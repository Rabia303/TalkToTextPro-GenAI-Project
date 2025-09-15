// // SubtitleGenerator.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { FaFileUpload, FaLink, FaSpinner, FaFileDownload, FaFire, FaUsers } from 'react-icons/fa';
// import './chatbot.css'; // We'll use the same CSS file as the chatbot

// // Languages supported by Google Translate
// const languages = [
//   { code: 'en', name: 'English', flag: '🇺🇸' },
//   { code: 'es', name: 'Spanish', flag: '🇪🇸' },
//   { code: 'fr', name: 'French', flag: '🇫🇷' },
//   { code: 'de', name: 'German', flag: '🇩🇪' },
//   { code: 'it', name: 'Italian', flag: '🇮🇹' },
//   { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
//   { code: 'ru', name: 'Russian', flag: '🇷🇺' },
//   { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
//   { code: 'ko', name: 'Korean', flag: '🇰🇷' },
//   { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
//   { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
//   { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
//   { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
// ];

// const SubtitleGenerator = () => {
//   const [inputMode, setInputMode] = useState('link');
//   const [meetingUrl, setMeetingUrl] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedLanguage, setSelectedLanguage] = useState('en');
//   const [status, setStatus] = useState('idle');
//   const [progress, setProgress] = useState(0);
//   const [srtContent, setSrtContent] = useState('');
//   const [vttUrl, setVttUrl] = useState('');
//   const [processedMeetingUrl, setProcessedMeetingUrl] = useState('');
//   const [previewSrc, setPreviewSrc] = useState('');
//   const [error, setError] = useState('');
//   const [originalMediaFilename, setOriginalMediaFilename] = useState('');
//   const vttBlobRef = useRef(null);
//   const fileObjectUrlRef = useRef(null);

//   // Cleanup blob URLs on unmount or when changed
//   useEffect(() => {
//     return () => {
//       if (vttUrl) URL.revokeObjectURL(vttUrl);
//       if (fileObjectUrlRef.current) URL.revokeObjectURL(fileObjectUrlRef.current);
//     };
//   }, []);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       if (fileObjectUrlRef.current) {
//         URL.revokeObjectURL(fileObjectUrlRef.current);
//         fileObjectUrlRef.current = null;
//       }
//       const obj = URL.createObjectURL(file);
//       fileObjectUrlRef.current = obj;
//       setPreviewSrc(obj);
//     }
//   };

//   // Convert SRT to WebVTT format
//   const srtToVtt = (srt) => {
//     if (!srt) return '';
//     return 'WEBVTT\n\n' + srt.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
//   };

//   const handleGenerateSubtitles = async () => {
//     setError('');
//     setProcessedMeetingUrl('');
//     setSrtContent('');
//     setVttUrl('');
//     setOriginalMediaFilename('');
//     setProgress(5);

//     if (inputMode === 'link' && !meetingUrl) {
//       setError('Please enter a meeting URL');
//       return;
//     }
//     if (inputMode === 'file' && !selectedFile) {
//       setError('Please upload a meeting recording');
//       return;
//     }

//     if (inputMode === 'file' && selectedFile && !previewSrc) {
//       if (fileObjectUrlRef.current) {
//         URL.revokeObjectURL(fileObjectUrlRef.current);
//       }
//       const obj = URL.createObjectURL(selectedFile);
//       fileObjectUrlRef.current = obj;
//       setPreviewSrc(obj);
//     }

//     if (inputMode === 'link' && meetingUrl) {
//       const lower = meetingUrl.toLowerCase();
//       if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg')) {
//         setPreviewSrc(meetingUrl);
//       } else {
//         setPreviewSrc('');
//       }
//     }

//     setStatus('processing');
//     setProgress(10);

//     const formData = new FormData();
//     formData.append('language', selectedLanguage);
//     formData.append('burnSubtitles', 'true');

//     if (inputMode === 'link') {
//       formData.append('videoUrl', meetingUrl);
//     } else {
//       formData.append('file', selectedFile);
//     }

//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/subtitles/generate-subtitles',
//         formData,
//         {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           onUploadProgress: (progressEvent) => {
//             const p = Math.round(((progressEvent.loaded / (progressEvent.total || 1)) * 40) + 10);
//             setProgress(Math.min(p, 60));
//           },
//           timeout: 20 * 60 * 1000,
//         }
//       );

//       const data = response.data || {};
//       const srt = data.srt || '';
//       setSrtContent(srt);

//       if (srt) {
//         const vttText = srtToVtt(srt);
//         if (vttBlobRef.current) {
//           URL.revokeObjectURL(vttBlobRef.current);
//           vttBlobRef.current = null;
//         }
//         const blob = new Blob([vttText], { type: 'text/vtt' });
//         const vttBlobUrl = URL.createObjectURL(blob);
//         vttBlobRef.current = vttBlobUrl;
//         setVttUrl(vttBlobUrl);
//       }

//       if (data.originalMediaFilename) {
//         const backendOriginal = `http://localhost:5000/files/${data.originalMediaFilename}`;
//         setOriginalMediaFilename(data.originalMediaFilename);
//         setPreviewSrc(backendOriginal);
//       }

//       setProgress(80);

//       if (data.meeting_with_subtitles) {
//         const processed = `http://localhost:5000${data.meeting_with_subtitles}`;
//         setProcessedMeetingUrl(processed);
//         setPreviewSrc(processed);
//         setProgress(100);
//         setStatus('completed');
//       } else {
//         const jobId = data.jobId || null;
//         if (jobId) {
//           const maxPolls = 30;
//           let attempts = 0;
//           let processedUrl = null;
//           while (attempts < maxPolls && !processedUrl) {
//             await new Promise(res => setTimeout(res, 2000));
//             attempts += 1;
//             try {
//               const statusResp = await axios.get(`http://localhost:5000/api/subtitle-status?jobId=${jobId}`);
//               if (statusResp?.data?.meeting_with_subtitles) {
//                 processedUrl = `http://localhost:5000${statusResp.data.meeting_with_subtitles}`;
//                 break;
//               }
//               if (statusResp?.data?.progress) {
//                 const backendProgress = 80 + Math.round(statusResp.data.progress * 0.18);
//                 setProgress(Math.min(98, backendProgress));
//               }
//             } catch (pollErr) {
//               // ignore transient poll errors
//             }
//           }
//           if (processedUrl) {
//             setProcessedMeetingUrl(processedUrl);
//             setPreviewSrc(processedUrl);
//             setProgress(100);
//             setStatus('completed');
//           } else {
//             setStatus('completed');
//             setProgress(98);
//             setError('Processing finished in background but we could not find the processed meeting yet. Check server or try again later.');
//           }
//         } else {
//           setStatus('completed');
//           setProgress(90);
//         }
//       }
//     } catch (err) {
//       console.error('Error generating meeting subtitles', err);
//       setStatus('error');
//       const errMsg = err.response?.data?.error || err.message || 'Failed to generate meeting subtitles';
//       setError(errMsg);
//     }
//   };

//   const handleDownloadSRT = () => {
//     if (!srtContent) return;
//     const blob = new Blob([srtContent], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `meeting-subtitles-${selectedLanguage}.srt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const handleDownloadProcessedMeeting = () => {
//     if (!processedMeetingUrl) return;
//     const a = document.createElement('a');
//     a.href = processedMeetingUrl;
//     a.download = 'meeting_with_subtitles.mp4';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };

//   return (
//     <div className="chatbot-container">
//       <div className="chatbot-background"></div>
//       <br /><br /><br />
//       <header className="chatbot-header">
//         <h1>TalkToText Pro - Meeting Subtitles</h1>
//         <p>Generate accurate subtitles for your meeting recordings. Supports multiple platforms including Zoom, Microsoft Teams, and Google Meet.</p>
//       </header>

//       <div className="chatbot-content">
//         <div className="chatbot-card">
//           <div className="tabs-container">
//             <div className="tabs">
//               <button
//                 className={`tab ${inputMode === 'link' ? 'active' : ''}`}
//                 onClick={() => setInputMode('link')}
//               >
//                 <span className="tab-icon">
//                   <FaLink />
//                 </span>
//                 Meeting URL
//               </button>
//               <button
//                 className={`tab ${inputMode === 'file' ? 'active' : ''}`}
//                 onClick={() => setInputMode('file')}
//               >
//                 <span className="tab-icon">
//                   <FaFileUpload />
//                 </span>
//                 Upload Recording
//               </button>
//             </div>
//           </div>

//           {inputMode === 'link' ? (
//             <div className="input-container">
//               <input
//                 type="text"
//                 placeholder="Paste meeting URL (Zoom, Teams, Google Meet, etc.)"
//                 value={meetingUrl}
//                 onChange={(e) => setMeetingUrl(e.target.value)}
//                 className="text-input"
//               />
//               <small className="input-note">
//                 Note: For platform-specific links, the recording will be downloaded and processed automatically.
//               </small>
//             </div>
//           ) : (
//             <div className="file-section">
//               <div className="file-input-container">
//                 <input
//                   id="file-upload-input"
//                   type="file"
//                   onChange={handleFileChange}
//                   accept="video/*,audio/*"
//                   className="hidden-file-input"
//                 />
//                 <label htmlFor="file-upload-input" className="file-label">
//                   <div className="file-icon">
//                     <FaFileUpload />
//                   </div>
//                   <span className="file-text">{selectedFile ? selectedFile.name : 'Upload meeting recording'}</span>
//                   <div className="file-browse">Browse</div>
//                 </label>
//               </div>
//               {selectedFile && (
//                 <div className="file-info-container">
//                   <div className="file-info-card">
//                     <div className="file-info-icon">
//                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <polygon points="23 7 16 12 23 17 23 7"></polygon>
//                         <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
//                       </svg>
//                     </div>
//                     <div className="file-details">
//                       <p className="file-name">{selectedFile.name}</p>
//                       <div className="file-capabilities">
//                         <span className="capability-tag">Supported format</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           <div className="option-group">
//             <h3>Meeting Language</h3>
//             <div className="language-grid">
//               {languages.map((lang) => (
//                 <div
//                   key={lang.code}
//                   className={`language-item ${selectedLanguage === lang.code ? 'selected' : ''}`}
//                   onClick={() => setSelectedLanguage(lang.code)}
//                 >
//                   <span className="language-flag">{lang.flag}</span>
//                   <span className="language-name">{lang.name}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {error && (
//             <div className="error-message">
//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <circle cx="12" cy="12" r="10"></circle>
//                 <line x1="12" y1="8" x2="12" y2="12"></line>
//                 <line x1="12" y1="16" x2="12.01" y2="16"></line>
//               </svg>
//               {error}
//             </div>
//           )}

//           <button
//             onClick={handleGenerateSubtitles}
//             disabled={status === 'processing'}
//             className="btn"
//           >
//             {status === 'processing' ? (
//               <>
//                 <FaSpinner className="spinner" /> Processing Meeting...
//               </>
//             ) : (
//               <>
//                 <FaFire /> Generate Meeting Subtitles
//               </>
//             )}
//           </button>

//           {status === 'processing' && (
//             <div className="progress-container">
//               <div className="progress-header">
//                 <span className="progress-title">Processing</span>
//                 <span className="progress-percent">{progress}%</span>
//               </div>
//               <div className="progress-bar">
//                 <div className="progress-fill" style={{ width: `${progress}%` }}></div>
//               </div>
//               <div className="progress-steps">
//                 <span className={progress > 10 ? 'completed' : ''}>Downloading</span>
//                 <span className={progress > 30 ? 'completed' : ''}>Transcribing</span>
//                 <span className={progress > 60 ? 'completed' : ''}>Generating Subtitles</span>
//                 <span className={progress > 90 ? 'completed' : ''}>Finalizing</span>
//               </div>
//             </div>
//           )}

//           {(status === 'completed' || srtContent || processedMeetingUrl) && (
//             <div className="results-container">
//               <h2>Meeting Subtitles Generated Successfully!</h2>
//               <p className="results-description">
//                 Your meeting has been processed and subtitles are now available. Download the subtitles file or the meeting video with burned-in subtitles.
//               </p>

//               <div className="download-buttons">
//                 {srtContent && (
//                   <button className="btn-download" onClick={handleDownloadSRT}>
//                     <FaFileDownload /> Download Subtitles (SRT)
//                   </button>
//                 )}
//                 {processedMeetingUrl && (
//                   <button className="btn-download" onClick={handleDownloadProcessedMeeting}>
//                     <FaFileDownload /> Download Meeting with Subtitles
//                   </button>
//                 )}
//               </div>

//               {previewSrc ? (
//                 <div className="preview-container">
//                   <h3>Meeting Preview with Subtitles</h3>
//                   <p className="preview-note">
//                     Subtitles are displayed as an overlay. The final downloaded version will have subtitles permanently embedded.
//                   </p>
//                   <video controls key={previewSrc} className="preview-video">
//                     <source src={previewSrc} type="video/mp4" />
//                     {vttUrl && (
//                       <track
//                         src={vttUrl}
//                         kind="subtitles"
//                         srcLang={selectedLanguage}
//                         label={languages.find(l => l.code === selectedLanguage)?.name || 'Subtitles'}
//                         default
//                       />
//                     )}
//                     Your browser does not support the video tag.
//                   </video>
//                 </div>
//               ) : (
//                 <div className="preview-container">
//                   <h3>Preview will appear here</h3>
//                   <p className="preview-placeholder">
//                     For uploaded files, the meeting will play immediately with live subtitles.
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubtitleGenerator;


// SubtitleGenerator.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaFileUpload, FaLink, FaSpinner, FaFileDownload, FaFire, FaUsers, FaEye, FaEyeSlash } from 'react-icons/fa';
import './chatbot.css';

// Languages supported by Google Translate
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
];

const SubtitleGenerator = () => {
  const [inputMode, setInputMode] = useState('link');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [srtContent, setSrtContent] = useState('');
  const [vttUrl, setVttUrl] = useState('');
  const [processedMeetingUrl, setProcessedMeetingUrl] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [error, setError] = useState('');
  const [originalMediaFilename, setOriginalMediaFilename] = useState('');
  const [showSubtitles, setShowSubtitles] = useState(true);
  const vttBlobRef = useRef(null);
  const fileObjectUrlRef = useRef(null);
  const videoRef = useRef(null);

  // Cleanup blob URLs on unmount or when changed
  useEffect(() => {
    return () => {
      if (vttUrl) URL.revokeObjectURL(vttUrl);
      if (fileObjectUrlRef.current) URL.revokeObjectURL(fileObjectUrlRef.current);
    };
  }, []);

  // Reset subtitles track when vttUrl changes
  useEffect(() => {
    if (videoRef.current && vttUrl && showSubtitles) {
      // Remove existing track elements
      const existingTracks = videoRef.current.querySelectorAll('track');
      existingTracks.forEach(track => track.remove());
      
      // Add new track
      const track = document.createElement('track');
      track.src = vttUrl;
      track.kind = 'subtitles';
      track.srcLang = selectedLanguage;
      track.label = languages.find(l => l.code === selectedLanguage)?.name || 'Subtitles';
      track.default = true;
      
      videoRef.current.appendChild(track);
      
      // Reload video to recognize new track
      videoRef.current.load();
      
      // Enable subtitles
      if (videoRef.current.textTracks && videoRef.current.textTracks.length > 0) {
        for (let i = 0; i < videoRef.current.textTracks.length; i++) {
          videoRef.current.textTracks[i].mode = 'showing';
        }
      }
    }
  }, [vttUrl, showSubtitles, selectedLanguage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (fileObjectUrlRef.current) {
        URL.revokeObjectURL(fileObjectUrlRef.current);
        fileObjectUrlRef.current = null;
      }
      const obj = URL.createObjectURL(file);
      fileObjectUrlRef.current = obj;
      setPreviewSrc(obj);
    }
  };

  // Convert SRT to WebVTT format
  const srtToVtt = (srt) => {
    if (!srt) return '';
    return 'WEBVTT\n\n' + srt.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
  };

 const handleGenerateSubtitles = async () => {
  setError('');
  setProcessedMeetingUrl('');
  setSrtContent('');
  setVttUrl('');
  setOriginalMediaFilename('');
  setProgress(5);
  setShowSubtitles(true);

  if (inputMode === 'link' && !meetingUrl) {
    setError('Please enter a meeting URL');
    return;
  }
  if (inputMode === 'file' && !selectedFile) {
    setError('Please upload a meeting recording');
    return;
  }

  if (inputMode === 'file' && selectedFile && !previewSrc) {
    if (fileObjectUrlRef.current) {
      URL.revokeObjectURL(fileObjectUrlRef.current);
    }
    const obj = URL.createObjectURL(selectedFile);
    fileObjectUrlRef.current = obj;
    setPreviewSrc(obj);
  }

  if (inputMode === 'link' && meetingUrl) {
    const lower = meetingUrl.toLowerCase();
    if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg')) {
      setPreviewSrc(meetingUrl);
    } else {
      setPreviewSrc('');
    }
  }

  setStatus('processing');
  setProgress(10);

  const formData = new FormData();
  formData.append('language', selectedLanguage);
  formData.append('burnSubtitles', 'true');
  formData.append('generate_summary', 'true'); // ✅ Added back

  if (inputMode === 'link') {
    formData.append('videoUrl', meetingUrl);
  } else {
    formData.append('file', selectedFile);
  }

  try {
    const response = await axios.post(
      'http://localhost:5000/api/subtitles/generate-subtitles',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const p = Math.round(((progressEvent.loaded / (progressEvent.total || 1)) * 40) + 10);
          setProgress(Math.min(p, 60));
        },
        timeout: 20 * 60 * 1000,
      }
    );

      const data = response.data || {};
      const srt = data.srt || '';
      setSrtContent(srt);

      if (srt) {
        const vttText = srtToVtt(srt);
        if (vttBlobRef.current) {
          URL.revokeObjectURL(vttBlobRef.current);
          vttBlobRef.current = null;
        }
        const blob = new Blob([vttText], { type: 'text/vtt' });
        const vttBlobUrl = URL.createObjectURL(blob);
        vttBlobRef.current = vttBlobUrl;
        setVttUrl(vttBlobUrl);
      }

      if (data.originalMediaFilename) {
        const backendOriginal = `http://localhost:5000/files/${data.originalMediaFilename}`;
        setOriginalMediaFilename(data.originalMediaFilename);
        setPreviewSrc(backendOriginal);
      }

      setProgress(80);

      if (data.meeting_with_subtitles) {
        const processed = `http://localhost:5000${data.meeting_with_subtitles}`;
        setProcessedMeetingUrl(processed);
        setPreviewSrc(processed);
        setProgress(100);
        setStatus('completed');
      } else {
        const jobId = data.jobId || null;
        if (jobId) {
          const maxPolls = 30;
          let attempts = 0;
          let processedUrl = null;
          while (attempts < maxPolls && !processedUrl) {
            await new Promise(res => setTimeout(res, 2000));
            attempts += 1;
            try {
              const statusResp = await axios.get(`http://localhost:5000/api/subtitle-status?jobId=${jobId}`);
              if (statusResp?.data?.meeting_with_subtitles) {
                processedUrl = `http://localhost:5000${statusResp.data.meeting_with_subtitles}`;
                break;
              }
              if (statusResp?.data?.progress) {
                const backendProgress = 80 + Math.round(statusResp.data.progress * 0.18);
                setProgress(Math.min(98, backendProgress));
              }
            } catch (pollErr) {
              // ignore transient poll errors
            }
          }
          if (processedUrl) {
            setProcessedMeetingUrl(processedUrl);
            setPreviewSrc(processedUrl);
            setProgress(100);
            setStatus('completed');
          } else {
            setStatus('completed');
            setProgress(98);
            setError('Processing finished in background but we could not find the processed meeting yet. Check server or try again later.');
          }
        } else {
          setStatus('completed');
          setProgress(90);
        }
      }
    } catch (err) {
      console.error('Error generating meeting subtitles', err);
      setStatus('error');
      const errMsg = err.response?.data?.error || err.message || 'Failed to generate meeting subtitles';
      setError(errMsg);
    }
  };

  const handleDownloadSRT = () => {
    if (!srtContent) return;
    const blob = new Blob([srtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-subtitles-${selectedLanguage}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadProcessedMeeting = () => {
    if (!processedMeetingUrl) return;
    const a = document.createElement('a');
    a.href = processedMeetingUrl;
    a.download = 'meeting_with_subtitles.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toggleSubtitles = () => {
    setShowSubtitles(!showSubtitles);
    
    if (videoRef.current && videoRef.current.textTracks) {
      for (let i = 0; i < videoRef.current.textTracks.length; i++) {
        videoRef.current.textTracks[i].mode = showSubtitles ? 'hidden' : 'showing';
      }
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-background"></div>
      <br /><br /><br />
      <header className="chatbot-header">
        <h1>TalkToText Pro - Meeting Subtitles</h1>
        <p>Generate accurate subtitles for your meeting recordings. Supports multiple platforms including Zoom, Microsoft Teams, and Google Meet.</p>
      </header>

      <div className="chatbot-content">
        <div className="chatbot-card">
          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${inputMode === 'link' ? 'active' : ''}`}
                onClick={() => setInputMode('link')}
              >
                <span className="tab-icon">
                  <FaLink />
                </span>
                Meeting URL
              </button>
              <button
                className={`tab ${inputMode === 'file' ? 'active' : ''}`}
                onClick={() => setInputMode('file')}
              >
                <span className="tab-icon">
                  <FaFileUpload />
                </span>
                Upload Recording
              </button>
            </div>
          </div>

          {inputMode === 'link' ? (
            <div className="input-container">
              <input
                type="text"
                placeholder="Paste meeting URL (Zoom, Teams, Google Meet, etc.)"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                className="text-input"
              />
              <small className="input-note">
                Note: For platform-specific links, the recording will be downloaded and processed automatically.
              </small>
            </div>
          ) : (
            <div className="file-section">
              <div className="file-input-container">
                <input
                  id="file-upload-input"
                  type="file"
                  onChange={handleFileChange}
                  accept="video/*,audio/*"
                  className="hidden-file-input"
                />
                <label htmlFor="file-upload-input" className="file-label">
                  <div className="file-icon">
                    <FaFileUpload />
                  </div>
                  <span className="file-text">{selectedFile ? selectedFile.name : 'Upload meeting recording'}</span>
                  <div className="file-browse">Browse</div>
                </label>
              </div>
              {selectedFile && (
                <div className="file-info-container">
                  <div className="file-info-card">
                    <div className="file-info-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                      </svg>
                    </div>
                    <div className="file-details">
                      <p className="file-name">{selectedFile.name}</p>
                      <div className="file-capabilities">
                        <span className="capability-tag">Supported format</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="option-group">
            <h3>Meeting Language</h3>
            <div className="language-grid">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className={`language-item ${selectedLanguage === lang.code ? 'selected' : ''}`}
                  onClick={() => setSelectedLanguage(lang.code)}
                >
                  <span className="language-flag">{lang.flag}</span>
                  <span className="language-name">{lang.name}</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          <button
            onClick={handleGenerateSubtitles}
            disabled={status === 'processing'}
            className="btn"
          >
            {status === 'processing' ? (
              <>
                <FaSpinner className="spinner" /> Processing Meeting...
              </>
            ) : (
              <>
                <FaFire /> Generate Meeting Subtitles
              </>
            )}
          </button>

          {status === 'processing' && (
            <div className="progress-container">
              <div className="progress-header">
                <span className="progress-title">Processing</span>
                <span className="progress-percent">{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="progress-steps">
                <span className={progress > 10 ? 'completed' : ''}>Downloading</span>
                <span className={progress > 30 ? 'completed' : ''}>Transcribing</span>
                <span className={progress > 60 ? 'completed' : ''}>Generating Subtitles</span>
                <span className={progress > 90 ? 'completed' : ''}>Finalizing</span>
              </div>
            </div>
          )}

          {(status === 'completed' || srtContent || processedMeetingUrl) && (
            <div className="results-container">
              <h2>Meeting Subtitles Generated Successfully!</h2>
              <p className="results-description">
                Your meeting has been processed and subtitles are now available. Download the subtitles file or the meeting video with burned-in subtitles.
              </p>

              <div className="download-buttons">
                {srtContent && (
                  <button className="btn-download" onClick={handleDownloadSRT}>
                    <FaFileDownload /> Download Subtitles (SRT)
                  </button>
                )}
                {processedMeetingUrl && (
                  <button className="btn-download" onClick={handleDownloadProcessedMeeting}>
                    <FaFileDownload /> Download Meeting with Subtitles
                  </button>
                )}
              </div>

              {previewSrc ? (
                <div className="preview-container">
                  <div className="preview-header">
                    <h3>Meeting Preview with Subtitles</h3>
                    {vttUrl && (
                      <button 
                        className="toggle-subtitles-btn"
                        onClick={toggleSubtitles}
                        title={showSubtitles ? "Hide subtitles" : "Show subtitles"}
                      >
                        {showSubtitles ? <FaEyeSlash /> : <FaEye />}
                        {showSubtitles ? " Hide Subtitles" : " Show Subtitles"}
                      </button>
                    )}
                  </div>
                  <p className="preview-note">
                    {processedMeetingUrl 
                      ? "Subtitles are permanently embedded in the video."
                      : "Subtitles are displayed as an overlay. The final downloaded version will have subtitles permanently embedded."}
                  </p>
                  <video 
                    ref={videoRef}
                    controls 
                    key={previewSrc} 
                    className="preview-video"
                  >
                    <source src={previewSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="preview-container">
                  <h3>Preview will appear here</h3>
                  <p className="preview-placeholder">
                    For uploaded files, the meeting will play immediately with live subtitles.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubtitleGenerator;