# # app/routes/chatbot.py
# from flask import Blueprint, request, jsonify, send_file, current_app
# from app.utils.chatbot_utils import *
# import tempfile
# import os

# chatbot_bp = Blueprint('chatbot', __name__)

# @chatbot_bp.route('/process', methods=['POST'])
# def process_file():
#     try:
#         if 'file' not in request.files:
#             return jsonify({'error': 'No file provided'}), 400
#         file = request.files['file']
#         if file.filename == '':
#             return jsonify({'error': 'No file selected'}), 400

#         file_extension = os.path.splitext(file.filename)[1].lower()
#         supported_audio = ['.wav', '.mp3', '.ogg', '.flac', '.m4a']
#         supported_video = ['.mp4', '.avi', '.mov', '.wmv']
#         supported_docs = ['.pdf', '.docx', '.doc', '.txt']

#         if file_extension not in supported_audio + supported_video + supported_docs:
#             return jsonify({'error': 'Unsupported file format'}), 400

#         action = request.form.get('action', 'transcribe')
#         transcription_langs = request.form.getlist('transcription_langs[]')
#         translation_langs = request.form.getlist('translation_langs[]')
#         output_formats = request.form.getlist('formats[]')
#         generate_summary_flag = request.form.get('generate_summary', 'false') == 'true'

#         with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
#             file.save(tmp_file.name)
#             tmp_filename = tmp_file.name

#         # Extract/transcribe text
#         if file_extension in supported_audio + supported_video:
#             if whisper_model is None:
#                 return jsonify({'error': 'Transcription model not available'}), 500
#             result = whisper_model.transcribe(tmp_filename, word_timestamps=False)
#             segments = result.get('segments', [])
#             transcript_lines = []
#             for seg in segments:
#                 start = seg['start']
#                 end = seg['end']
#                 text = seg['text'].strip()
#                 transcript_lines.append(f"[{start:.2f} - {end:.2f}] {text}")
#             full_transcript = "\n".join(transcript_lines)
#         else:
#             full_transcript = extract_text_from_file(tmp_filename, file_extension)
#             if not full_transcript:
#                 return jsonify({'error': 'Could not extract text from file'}), 400
#             transcript_lines = full_transcript.splitlines()

#         # Generate summary if requested
#         summary = ""
#         if generate_summary_flag:
#             summary_lang = transcription_langs[0] if transcription_langs else 'en'
#             summary = generate_summary(full_transcript, summary_lang)

#         transcriptions = {}
#         translations = {}
#         files_generated = {}

#         # Transcriptions
#         if action == 'transcribe' and transcription_langs:
#             for lang in transcription_langs:
#                 transcriptions[lang] = full_transcript
#                 lang_files = {}
#                 title = f"Transcription - {lang.upper()}"
#                 for fmt in output_formats:
#                     tmp_out = tempfile.NamedTemporaryFile(delete=False, suffix=f"_{lang}.{fmt}")
#                     path = tmp_out.name
#                     tmp_out.close()

#                     if fmt == 'txt':
#                         with open(path, 'w', encoding='utf-8') as f:
#                             f.write(full_transcript)
#                             if summary:
#                                 f.write(f"\n\n--- AI SUMMARY ---\n\n{summary}")
#                     elif fmt == 'pdf':
#                         pdf = create_pdf(full_transcript, title, generate_summary_flag, summary)
#                         pdf.output(path)
#                     elif fmt == 'docx':
#                         doc = create_docx(full_transcript, title, generate_summary_flag, summary)
#                         doc.save(path)

#                     lang_files[fmt] = path
#                 files_generated[lang] = lang_files

#         # Translations
#         if action == 'translate' and translation_langs:
#             for lang in translation_langs:
#                 try:
#                     translated_text = GoogleTranslator(source='auto', target=lang).translate(full_transcript)
#                     translations[lang] = translated_text
#                     lang_files = {}
#                     title = f"Translation - {lang.upper()}"
#                     for fmt in output_formats:
#                         tmp_out = tempfile.NamedTemporaryFile(delete=False, suffix=f"_{lang}.{fmt}")
#                         path = tmp_out.name
#                         tmp_out.close()

#                         if fmt == 'txt':
#                             with open(path, 'w', encoding='utf-8') as f:
#                                 f.write(translated_text)
#                                 if summary:
#                                     f.write(f"\n\n--- AI SUMMARY ---\n\n{summary}")
#                         elif fmt == 'pdf':
#                             pdf = create_pdf(translated_text, title, generate_summary_flag, summary)
#                             pdf.output(path)
#                         elif fmt == 'docx':
#                             doc = create_docx(translated_text, title, generate_summary_flag, summary)
#                             doc.save(path)

#                         lang_files[fmt] = path
#                     files_generated[lang] = lang_files
#                 except Exception as e:
#                     translations[lang] = f"Translation failed: {e}"

#         # Summary-only files
#         if generate_summary_flag and summary and not transcriptions and not translations:
#             lang = 'summary'
#             lang_files = {}
#             title = "Meeting Summary"
#             for fmt in output_formats:
#                 tmp_out = tempfile.NamedTemporaryFile(delete=False, suffix=f"_{lang}.{fmt}")
#                 path = tmp_out.name
#                 tmp_out.close()
#                 if fmt == 'txt':
#                     with open(path, 'w', encoding='utf-8') as f:
#                         f.write(summary)
#                 elif fmt == 'pdf':
#                     pdf = create_pdf(summary, title)
#                     pdf.output(path)
#                 elif fmt == 'docx':
#                     doc = create_docx(summary, title)
#                     doc.save(path)
#                 lang_files[fmt] = path
#             files_generated[lang] = lang_files

#         os.remove(tmp_filename)

#         return jsonify({
#             'segments': transcript_lines,
#             'transcriptions': transcriptions,
#             'translations': translations,
#             'summary': summary,
#             'files': {lang: {fmt: os.path.basename(path) for fmt, path in formats.items()} 
#                      for lang, formats in files_generated.items()}
#         })

#     except Exception as e:
#         current_app.logger.error(f"Error processing file: {str(e)}")
#         return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500


# @chatbot_bp.route('/download/<filename>', methods=['GET'])
# def download_file(filename):
#     try:
#         temp_dir = tempfile.gettempdir()
#         file_path = os.path.join(temp_dir, filename)
#         if os.path.exists(file_path):
#             return send_file(file_path, as_attachment=True)
#         else:
#             return jsonify({'error': 'File not found'}), 404
#     except Exception as e:
#         current_app.logger.error(f"Error downloading file: {str(e)}")
#         return jsonify({'error': str(e)}), 500


# @chatbot_bp.route('/health', methods=['GET'])
# def health_check():
#     return jsonify({'status': 'ok', 'whisper_loaded': whisper_model is not None})

# chatbot.py - Updated version
from flask import Blueprint, request, jsonify, send_file, current_app
from app.utils.chatbot_utils import *
import tempfile
import os
import json

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/process', methods=['POST'])
def process_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        file_extension = os.path.splitext(file.filename)[1].lower()
        supported_audio = ['.wav', '.mp3', '.ogg', '.flac', '.m4a']
        supported_video = ['.mp4', '.avi', '.mov', '.wmv']
        supported_docs = ['.pdf', '.docx', '.doc', '.txt']

        if file_extension not in supported_audio + supported_video + supported_docs:
            return jsonify({'error': 'Unsupported file format'}), 400

        # Form params
        action = request.form.get('action', 'transcribe')
        transcription_langs = request.form.getlist('transcription_langs[]')
        translation_langs = request.form.getlist('translation_langs[]')
        output_formats = request.form.getlist('formats[]')
        generate_summary_flag = request.form.get('generate_summary', 'false') == 'true'
        summary_only = request.form.get('summary_only', 'false') == 'true'

        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
            file.save(tmp_file.name)
            tmp_filename = tmp_file.name

        # Extract/transcribe text
        transcript_lines, full_transcript = [], ""
        if file_extension in supported_audio + supported_video:
            if whisper_model is None:
                return jsonify({'error': 'Transcription model not available'}), 500
            result = whisper_model.transcribe(tmp_filename, word_timestamps=False)
            segments = result.get('segments', [])
            for seg in segments:
                transcript_lines.append(f"[{seg['start']:.2f} - {seg['end']:.2f}] {seg['text'].strip()}")
            full_transcript = "\n".join(transcript_lines)
        else:
            full_transcript = extract_text_from_file(tmp_filename, file_extension)
            if not full_transcript:
                return jsonify({'error': 'Could not extract text from file'}), 400
            transcript_lines = full_transcript.splitlines()

        # Generate summary if requested
        summary, sentiment_analysis = "", {}
        if generate_summary_flag or summary_only:
            summary_lang = transcription_langs[0] if transcription_langs else 'en'
            summary = generate_summary(full_transcript, summary_lang)
            sentiment_analysis = analyze_sentiment(full_transcript)

        transcriptions, translations, files_generated = {}, {}, {}

        # Normal transcriptions (only if not summary-only)
        if not summary_only and action == 'transcribe' and transcription_langs:
            for lang in transcription_langs:
                transcriptions[lang] = full_transcript
                lang_files = {}
                title = f"Transcription - {lang.upper()}"
                for fmt in output_formats:
                    tmp_out = tempfile.NamedTemporaryFile(delete=False, suffix=f"_{lang}.{fmt}")
                    path = tmp_out.name
                    tmp_out.close()
                    if fmt == 'txt':
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(full_transcript)
                            if summary:
                                f.write(f"\n\n--- AI SUMMARY ---\n\n{summary}")
                    elif fmt == 'pdf':
                        pdf = create_pdf(full_transcript, title, generate_summary_flag, summary)
                        pdf.output(path)
                    elif fmt == 'docx':
                        doc = create_docx(full_transcript, title, generate_summary_flag, summary)
                        doc.save(path)
                    lang_files[fmt] = path
                files_generated[lang] = lang_files

        # Normal translations (only if not summary-only)
        if not summary_only and action == 'translate' and translation_langs:
            for lang in translation_langs:
                try:
                    translated_text = GoogleTranslator(source='auto', target=lang).translate(full_transcript)
                    translations[lang] = translated_text
                    lang_files = {}
                    title = f"Translation - {lang.upper()}"
                    for fmt in output_formats:
                        tmp_out = tempfile.NamedTemporaryFile(delete=False, suffix=f"_{lang}.{fmt}")
                        path = tmp_out.name
                        tmp_out.close()
                        if fmt == 'txt':
                            with open(path, 'w', encoding='utf-8') as f:
                                f.write(translated_text)
                                if summary:
                                    f.write(f"\n\n--- AI SUMMARY ---\n\n{summary}")
                        elif fmt == 'pdf':
                            pdf = create_pdf(translated_text, title, generate_summary_flag, summary)
                            pdf.output(path)
                        elif fmt == 'docx':
                            doc = create_docx(translated_text, title, generate_summary_flag, summary)
                            doc.save(path)
                        lang_files[fmt] = path
                    files_generated[lang] = lang_files
                except Exception as e:
                    translations[lang] = f"Translation failed: {e}"

        # Summary-only files
        if (generate_summary_flag or summary_only) and summary:
            lang = 'summary'
            lang_files = {}
            title = "Meeting Summary"
            for fmt in output_formats:
                tmp_out = tempfile.NamedTemporaryFile(delete=False, suffix=f"_{lang}.{fmt}")
                path = tmp_out.name
                tmp_out.close()
                if fmt == 'txt':
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(summary)
                elif fmt == 'pdf':
                    pdf = create_pdf(summary, title)
                    pdf.output(path)
                elif fmt == 'docx':
                    doc = create_docx(summary, title)
                    doc.save(path)
                lang_files[fmt] = path
            files_generated[lang] = lang_files

        os.remove(tmp_filename)

        return jsonify({
            'segments': transcript_lines if not summary_only else [],
            'transcriptions': transcriptions,
            'translations': translations,
            'summary': summary,
            'sentiment_analysis': sentiment_analysis,
            'files': {lang: {fmt: os.path.basename(path) for fmt, path in formats.items()} 
                     for lang, formats in files_generated.items()}
        })

    except Exception as e:
        current_app.logger.error(f"Error processing file: {str(e)}")
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500

@chatbot_bp.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, filename)
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        current_app.logger.error(f"Error downloading file: {str(e)}")
        return jsonify({'error': str(e)}), 500

@chatbot_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'whisper_loaded': whisper_model is not None})