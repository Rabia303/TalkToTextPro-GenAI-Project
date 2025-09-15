import React, { useState } from "react";
import "../styles/Chatbot.css";
import { m } from "framer-motion";

function MeetingNotes() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [selectedFormat, setSelectedFormat] = useState("bullet");

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const generateNotes = async () => {
    if (!inputText.trim()) return;

    if (!apiKey) {
      setSummary("❌ Error: Gemini API key is missing. Check your .env file.");
      return;
    }

    setLoading(true);
    setSummary("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Summarize this into clear notes with ${selectedFormat === "bullet" ? "bullet points" : "numbered list"} in ${selectedLanguage}:\n\n${inputText}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        setSummary(data.candidates[0].content.parts[0].text);
      } else {
        setSummary("⚠️ No summary generated. Check input or API response.");
        console.error("Gemini API response:", data);
      }
    } catch (err) {
      console.error("Error calling Gemini:", err);
      setSummary("❌ Error generating notes.");
    }

    setLoading(false);
  };

  // Function to format the summary text with bullet points
  const formatSummary = (text) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ marginRight: '10px', color: '#8B5DFF' }}>•</span>
            <span>{line.substring(2)}</span>
          </div>
        );
      } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.match(/^\d+\./)) {
        return (
          <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ marginRight: '10px', color: '#8B5DFF', minWidth: '20px' }}>{line.split('.')[0]}.</span>
            <span>{line.substring(line.indexOf('.') + 2)}</span>
          </div>
        );
      } else if (line.trim() === '') {
        return null;
      } else {
        return <p key={index} style={{ marginBottom: '16px', lineHeight: '1.6' }}>{line}</p>;
      }
    });
  };

  // Copy to clipboard function
  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    
    // Show temporary feedback
    const button = document.getElementById('copy-button');
    if (button) {
      button.innerHTML = '✓ Copied!';
      setTimeout(() => {
        button.innerHTML = 'Copy Notes';
      }, 2000);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-background"></div>
      <br /><br /><br />
      <div className="chatbot-header">
        <h1>SmartNotes Generator</h1>
        <p>Transform your content into beautiful, organized notes with AI</p>
      </div>

      <div className="chatbot-content">
        <div className="chatbot-card">
          <div className="input-container">
            <textarea
              className="text-input"
              rows="8"
              placeholder="Paste your text, article, or transcript here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <span className="input-note">Enter at least 100 characters for better results</span>
          </div>

          <div className="option-group">
            <h3>Output Language</h3>
            <div className="language-grid">
              <div 
                className={`language-item ${selectedLanguage === "english" ? "selected" : ""}`}
                onClick={() => setSelectedLanguage("english")}
              >
                <span>English</span>
              </div>
              <div 
                className={`language-item ${selectedLanguage === "spanish" ? "selected" : ""}`}
                onClick={() => setSelectedLanguage("spanish")}
              >
                <span>Spanish</span>
              </div>
              <div 
                className={`language-item ${selectedLanguage === "french" ? "selected" : ""}`}
                onClick={() => setSelectedLanguage("french")}
              >
                <span>French</span>
              </div>
              <div 
                className={`language-item ${selectedLanguage === "german" ? "selected" : ""}`}
                onClick={() => setSelectedLanguage("german")}
              >
                <span>German</span>
              </div>
            </div>
          </div>

          <div className="option-group">
            <h3>Note Format</h3>
            <div className="format-grid">
              <div 
                className={`format-item ${selectedFormat === "bullet" ? "selected" : ""}`}
                onClick={() => setSelectedFormat("bullet")}
              >
                <span>Bullet Points</span>
              </div>
              <div 
                className={`format-item ${selectedFormat === "numbered" ? "selected" : ""}`}
                onClick={() => setSelectedFormat("numbered")}
              >
                <span>Numbered List</span>
              </div>
            </div>
          </div>

          <div className="progress-container">
            <div className="progress-header">
              <span className="progress-title">AI Processing</span>
              <span className="progress-percent">{loading ? "Processing..." : "Ready"}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: loading ? "50%" : inputText ? "100%" : "0%" }}
              ></div>
            </div>
            <div className="progress-text">
              {loading ? "Generating your notes..." : "Click the button below to generate notes"}
            </div>
          </div>

          <button
            className="btn"
            onClick={generateNotes}
            disabled={loading || !inputText.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Generating Notes...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14"></path>
                  <path d="M5 12h14"></path>
                </svg>
                Generate Notes
              </>
            )}
          </button>
        </div>

        {summary && (
          <div className="results-container">
            <h2>Your Generated Notes</h2>
            
            <div className="result-section">
              <h3>Summary</h3>
              <div className="summary-content">
                <div className="summary-section">
                  <div className="content-box">
                    {formatSummary(summary)}
                  </div>
                </div>
              </div>
            </div>

            <div className="download-buttons">
              <button className="btn-download" onClick={copyToClipboard} id="copy-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy Notes
              </button>
              <button className="btn-download">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download as Text
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MeetingNotes;