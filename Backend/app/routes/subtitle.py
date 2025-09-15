from flask import Blueprint, request, jsonify, send_from_directory, current_app
import os, uuid
from werkzeug.utils import secure_filename
import yt_dlp
from deep_translator import GoogleTranslator
from flask_cors import cross_origin

subtitle_bp = Blueprint('subtitle_bp', __name__)

ALLOWED_EXTENSIONS = {'mp4', 'webm', 'mov', 'avi', 'mkv', 'wav', 'mp3', 'm4a'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def seconds_to_srt_time(seconds):
    ms = int((seconds - int(seconds)) * 1000)
    sec = int(seconds)
    m, s = divmod(sec, 60)
    h, m = divmod(m, 60)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"

def generate_srt(segments):
    srt_content = []
    for i, seg in enumerate(segments):
        start = seconds_to_srt_time(seg["start"])
        end = seconds_to_srt_time(seg["end"])
        srt_content.append(f"{i+1}\n{start} --> {end}\n{seg['text'].strip()}\n")
    return "\n".join(srt_content)

@subtitle_bp.route('/generate-subtitles', methods=['POST'])
@cross_origin(origins="*", supports_credentials=True)
def generate_subtitles():
    max_file_size = current_app.config.get('MAX_FILE_SIZE', 100 * 1024 * 1024)
    if request.content_length and request.content_length > max_file_size:
        return jsonify({"error": f"File too large (max {max_file_size/1024/1024:.0f}MB)"}), 400

    lang = request.form.get("language", "en")
    video_url = request.form.get("videoUrl")
    file = request.files.get("file")

    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)

    temp_file_path = None
    original_media_filename = None

    try:
        if video_url:
            filename = f"{uuid.uuid4()}.mp4"
            temp_file_path = os.path.join(upload_folder, filename)
            ydl_opts = {
                'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
                'outtmpl': temp_file_path,
                'quiet': True
            }
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([video_url])
            original_media_filename = filename
        elif file and allowed_file(file.filename):
            ext = secure_filename(file.filename).rsplit('.', 1)[1].lower()
            filename = f"{uuid.uuid4()}.{ext}"
            temp_file_path = os.path.join(upload_folder, filename)
            file.save(temp_file_path)
            original_media_filename = filename
        else:
            return jsonify({"error": "No valid video or file provided"}), 400

        result = current_app.whisper_model.transcribe(temp_file_path, task="transcribe", verbose=False)
        segments = result.get("segments", [])

        translated_segments = []
        if lang != "same":
            for seg in segments:
                text = seg['text'] or ""
                try:
                    translated_text = GoogleTranslator(source='auto', target=lang).translate(text)
                except:
                    translated_text = "[Translation error]"
                translated_segments.append({
                    'start': seg['start'],
                    'end': seg['end'],
                    'text': translated_text
                })
        else:
            translated_segments = [{'start': s['start'], 'end': s['end'], 'text': s['text']} for s in segments]

        srt_content = generate_srt(translated_segments)

        return jsonify({
            "subtitles": translated_segments,
            "srt": srt_content,
            "language": lang,
            "originalMediaFilename": original_media_filename
        })

    except Exception as e:
        current_app.logger.error(f"Subtitle API error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@subtitle_bp.route('/files/<filename>')
@cross_origin(origins="*", supports_credentials=True)
def serve_file(filename):
    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
    return send_from_directory(upload_folder, filename)
