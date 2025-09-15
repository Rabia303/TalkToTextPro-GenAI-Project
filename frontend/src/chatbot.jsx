import { useState } from 'react'
import './chatbot.css'

function Chatbot() {
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [activeTab, setActiveTab] = useState('transcribe')
  const [transcriptionLangs, setTranscriptionLangs] = useState(['en'])
  const [translationLangs, setTranslationLangs] = useState([])
  const [formats, setFormats] = useState(['txt', 'pdf'])
  const [generateSummary, setGenerateSummary] = useState(false)
  const [summaryOnly, setSummaryOnly] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', label: 'French', flag: '🇫🇷' },
    { code: 'de', label: 'German', flag: '🇩🇪' },
    { code: 'zh-cn', label: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', label: 'Hindi', flag: '🇮🇳' }
  ]

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    const fileExtension = selectedFile.name.split('.').pop().toLowerCase()
    const supportedTypes = [
      'wav', 'mp3', 'ogg', 'flac', 'm4a',
      'mp4', 'avi', 'mov', 'wmv',
      'pdf', 'docx', 'doc', 'txt'
    ]

    if (!supportedTypes.includes(fileExtension)) {
      setError('Unsupported file type')
      setFile(null)
      setFileType(null)
      return
    }

    // Determine file type
    if (['wav', 'mp3', 'ogg', 'flac', 'm4a'].includes(fileExtension)) {
      setFileType('audio')
    } else if (['mp4', 'avi', 'mov', 'wmv'].includes(fileExtension)) {
      setFileType('video')
    } else {
      setFileType('document')
    }

    setFile(selectedFile)
    setResult(null)
    setError('')
  }

  const simulateProgress = () => {
    const steps = [
      'Uploading file...',
      'Processing content...',
      'Generating outputs...',
      'Finalizing...'
    ]

    let currentProgress = 0
    const interval = setInterval(() => {
      if (currentProgress >= 100) {
        clearInterval(interval)
        return
      }

      currentProgress += 5
      setProgress(currentProgress)

      // Update current step based on progress
      if (currentProgress < 25) setCurrentStep(steps[0])
      else if (currentProgress < 50) setCurrentStep(steps[1])
      else if (currentProgress < 75) setCurrentStep(steps[2])
      else setCurrentStep(steps[3])

    }, 300)

    return interval
  }

  const handleProcess = async (e, actionType) => {
    e.preventDefault()
    if (!file) { setError('Please select a file'); return }
    if (actionType === 'translate' && translationLangs.length === 0 && !summaryOnly) {
      setError('Please select at least one translation language'); return
    }

    setLoading(true)
    setError('')
    setProgress(0)
    setCurrentStep('Starting process...')

    const progressInterval = simulateProgress()

    const formData = new FormData()
    formData.append('file', file)
    formData.append('action', actionType)
    formData.append('generate_summary', generateSummary)
    formData.append('summary_only', summaryOnly)

    if (actionType === 'transcribe' && !summaryOnly) {
      transcriptionLangs.forEach(lang => formData.append('transcription_langs[]', lang))
    } else if (actionType === 'translate' && !summaryOnly) {
      translationLangs.forEach(lang => formData.append('translation_langs[]', lang))
    }

    formats.forEach(fmt => formData.append('formats[]', fmt))

    try {
      const res = await fetch('http://localhost:5000/api/chatbot/process', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setResult(data)
      setProgress(100)
      setCurrentStep('Process completed successfully!')

      // Clear progress after success
      setTimeout(() => {
        setProgress(0)
        setCurrentStep('')
      }, 2000)
    } catch (err) {
      setError(err.message)
      setProgress(0)
      setCurrentStep('')
    } finally {
      clearInterval(progressInterval)
      setLoading(false)
    }
  }

  const handleDownload = (filename) => {
    window.open(`http://localhost:5000/api/chatbot/download/${filename}`, '_blank')
  }

  const toggleLanguage = (lang, type) => {
    if (type === 'transcription') {
      setTranscriptionLangs(prev =>
        prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
      )
    } else {
      setTranslationLangs(prev =>
        prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
      )
    }
  }

  const toggleFormat = (fmt) => {
    setFormats(prev => prev.includes(fmt) ? prev.filter(f => f !== fmt) : [...prev, fmt])
  }

  const formatSummary = (summary) => {
    if (!summary) return summary

    const sections = summary.split(/\d+\.\s+[A-Z\s]+:/).filter(Boolean)
    const sectionTitles = summary.match(/\d+\.\s+[A-Z\s]+:/g) || []

    return (
      <div className="summary-sections">
        {sectionTitles.map((title, index) => (
          <div key={index} className="summary-section">
            <h4>{title.replace(/\d+\.\s+/, '')}</h4>
            <p>{sections[index]?.trim()}</p>
          </div>
        ))}
      </div>
    )
  }

  const renderSentimentAnalysis = (sentiment) => {
    if (!sentiment || sentiment.sentiment === "Unknown") return null
    
    const sentimentColor = sentiment.sentiment === "Positive" ? "#4caf50" : 
                          sentiment.sentiment === "Negative" ? "#f44336" : "#ff9800"
    
    return (
      <div className="sentiment-analysis">
        <h3>Sentiment Analysis</h3>
        <div className="sentiment-card">
          <div className="sentiment-badge" style={{ backgroundColor: sentimentColor }}>
            {sentiment.sentiment}
          </div>
          <div className="sentiment-details">
            <div className="sentiment-meter">
              <span>Polarity: {sentiment.polarity}</span>
              <div className="meter-bar">
                <div 
                  className="meter-fill" 
                  style={{ 
                    width: `${(sentiment.polarity + 1) * 50}%`,
                    backgroundColor: sentimentColor
                  }}
                ></div>
              </div>
            </div>
            <div className="sentiment-meter">
              <span>Subjectivity: {sentiment.subjectivity}</span>
              <div className="meter-bar">
                <div 
                  className="meter-fill" 
                  style={{ 
                    width: `${sentiment.subjectivity * 100}%`,
                    backgroundColor: "#2196f3"
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-background"></div>
      <br /><br /><br />
      <header className="chatbot-header">
        <h1>TalkToText Pro</h1>
        <p>AI-Powered Meeting Notes Transcription & Translation</p>
      </header>

      <div className="chatbot-content">
        <div className="chatbot-card">
          <div className="file-section">
            <div className="file-input-container">
              <input
                type="file"
                id="file"
                accept="audio/*,video/*,.pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                disabled={loading}
              />
              <label htmlFor="file" className="file-label">
                <div className="file-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                </div>
                <span className="file-text">{file ? file.name : 'Choose file'}</span>
                <div className="file-browse">Browse</div>
              </label>
            </div>

            {file && (
              <div className="file-info-container">
                <div className="file-info-card">
                  <div className="file-info-icon">
                    {fileType === 'audio' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                      </svg>
                    )}
                    {fileType === 'video' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                      </svg>
                    )}
                    {fileType === 'document' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="file-details">
                    <p className="file-name">{file.name}</p>
                    <div className="file-capabilities">
                      {fileType === 'audio' && (
                        <span className="capability-tag">Can generate transcription</span>
                      )}
                      {fileType === 'video' && (
                        <span className="capability-tag">Can extract audio and generate transcription</span>
                      )}
                      {fileType === 'document' && (
                        <span className="capability-tag">Can extract text and generate key points</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="progress-container">
              <div className="progress-header">
                <span className="progress-title">Processing</span>
                <span className="progress-percent">{progress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="progress-text">{currentStep}</p>
            </div>
          )}

          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'transcribe' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('transcribe')
                  setSummaryOnly(false)
                }}
              >
                <span className="tab-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </span>
                Transcription
              </button>
              <button
                className={`tab ${activeTab === 'translate' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('translate')
                  setSummaryOnly(false)
                }}
              >
                <span className="tab-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </span>
                Translation
              </button>
              <button
                className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('summary')
                  setSummaryOnly(true)
                  setGenerateSummary(true)
                }}
              >
                <span className="tab-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </span>
                Summary
              </button>
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

          <div className="tab-content">
            {/* Transcription Tab */}
            {activeTab === 'transcribe' && (
              <div className="transcription-section">
                <h2>Transcription Settings</h2>
                {fileType === 'document' && (
                  <div className="info-banner">
                    <span className="info-icon">ℹ️</span>
                    <p>Document files will have their text extracted for processing.</p>
                  </div>
                )}
                <div className="option-group">
                  <h3>Select Transcription Languages</h3>
                  <div className="language-grid">
                    {languages.map(l => (
                      <div
                        key={l.code}
                        className={`language-item ${transcriptionLangs.includes(l.code) ? 'selected' : ''}`}
                        onClick={() => !loading && toggleLanguage(l.code, 'transcription')}
                      >
                        <span className="language-flag">{l.flag}</span>
                        <span className="language-name">{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="option-group">
                  <h3>Output Formats</h3>
                  <div className="format-grid">
                    {['txt', 'pdf', 'docx'].map(f => (
                      <div
                        key={f}
                        className={`format-item ${formats.includes(f) ? 'selected' : ''}`}
                        onClick={() => !loading && toggleFormat(f)}
                      >
                        {f.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="option-group">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={generateSummary}
                      onChange={() => !loading && setGenerateSummary(!generateSummary)}
                      disabled={loading}
                    />
                    <span className="checkmark"></span>
                    Generate AI Summary
                  </label>
                </div>

                <button
                  onClick={(e) => handleProcess(e, 'transcribe')}
                  disabled={loading || !file || transcriptionLangs.length === 0}
                  className="btn btn-primary"
                >
                  {loading ? 'Processing...' : 'Generate Transcription'}
                </button>
              </div>
            )}

            {/* Translation Tab */}
            {activeTab === 'translate' && (
              <div className="translation-section">
                <h2>Translation Settings</h2>
                <div className="option-group">
                  <h3>Select Translation Languages</h3>
                  <div className="language-grid">
                    {languages.map(l => (
                      <div
                        key={l.code}
                        className={`language-item ${translationLangs.includes(l.code) ? 'selected' : ''}`}
                        onClick={() => !loading && toggleLanguage(l.code, 'translation')}
                      >
                        <span className="language-flag">{l.flag}</span>
                        <span className="language-name">{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="option-group">
                  <h3>Output Formats</h3>
                  <div className="format-grid">
                    {['txt', 'pdf', 'docx'].map(f => (
                      <div
                        key={f}
                        className={`format-item ${formats.includes(f) ? 'selected' : ''}`}
                        onClick={() => !loading && toggleFormat(f)}
                      >
                        {f.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => handleProcess(e, 'translate')}
                  disabled={loading || !file || (translationLangs.length === 0 && !summaryOnly)}
                  className="btn btn-primary"
                >
                  {loading ? 'Processing...' : 'Generate Translation'}
                </button>
              </div>
            )}

            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div className="summary-section">
                <h2>AI Summary</h2>
                <p className="summary-description">
                  Generate comprehensive summaries with key points, action items, and insights from your content.
                </p>
                
                <div className="option-group">
                  <h3>Summary Focus Areas</h3>
                  <div className="focus-areas">
                    <div className="focus-item">
                      <span className="focus-icon">● </span>
                      <span>Key Points</span>
                    </div>
                    <div className="focus-item">
                      <span className="focus-icon">● </span>
                      <span>Action Items</span>
                    </div>
                    <div className="focus-item">
                      <span className="focus-icon">● </span>
                      <span>Insights</span>
                    </div>
                    <div className="focus-item">
                      <span className="focus-icon">● </span>
                      <span>Decisions</span>
                    </div>
                    <div className="focus-item">
                      <span className="focus-icon">● </span>
                      <span>Sentiment Analysis</span>
                    </div>
                  </div>
                </div>

                <div className="option-group">
                  <h3>Output Formats</h3>
                  <div className="format-grid">
                    {['txt', 'pdf', 'docx'].map(f => (
                      <div
                        key={f}
                        className={`format-item ${formats.includes(f) ? 'selected' : ''}`}
                        onClick={() => !loading && toggleFormat(f)}
                      >
                        {f.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => handleProcess(e, 'transcribe')}
                  disabled={loading || !file}
                  className="btn btn-primary"
                >
                  {loading ? 'Generating Summary...' : 'Generate Summary'}
                </button>
              </div>
            )}
          </div>

          {result && (
            <div className="result-section">
              <h2>Results</h2>
              <div className="result-grid">
                {result.transcription && (
                  <div className="result-card">
                    <h3>Transcription</h3>
                    <div className="result-content">
                      <p>{result.transcription}</p>
                    </div>
                    {result.files && result.files.transcription && (
                      <div className="download-grid">
                        {Object.entries(result.files.transcription).map(([format, filename]) => (
                          <button
                            key={format}
                            onClick={() => handleDownload(filename)}
                            className="download-btn"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download {format.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {result.summary && (
                  <div className="result-card">
                    <h3>AI Summary</h3>
                    <div className="result-content">
                      {formatSummary(result.summary)}
                    </div>
                    {result.files && result.files.summary && (
                      <div className="download-grid">
                        {Object.entries(result.files.summary).map(([format, filename]) => (
                          <button
                            key={format}
                            onClick={() => handleDownload(filename)}
                            className="download-btn"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1='15' x2="12" y2="3"></line>
                            </svg>
                            Download {format.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {result.sentiment_analysis && renderSentimentAnalysis(result.sentiment_analysis)}

                {result.files && Object.entries(result.files).map(([type, formats]) => (
                  type !== 'transcription' && type !== 'summary' && (
                    <div key={type} className="result-card">
                      <h3>{type.charAt(0).toUpperCase() + type.slice(1)} Files</h3>
                      <div className="download-grid">
                        {Object.entries(formats).map(([format, filename]) => (
                          <button
                            key={format}
                            onClick={() => handleDownload(filename)}
                            className="download-btn"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download {format.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chatbot