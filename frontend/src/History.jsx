// History.jsx
import { useState, useEffect } from 'react';
import './chatbot.css';

function History() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate loading history data
  useEffect(() => {
    const timer = setTimeout(() => {
      setHistoryItems([
        {
          id: 1,
          title: "Client Meeting - Q4 Planning",
          date: "2023-10-05 14:30",
          languages: ["EN", "ES"],
          summary: "Discussed Q4 goals and marketing strategy. Agreed on budget allocation and timeline for new campaign.",
          fileType: "audio"
        },
        {
          id: 2,
          title: "Team Standup - Development Update",
          date: "2023-10-04 10:15",
          languages: ["EN"],
          summary: "Reviewed sprint progress. Blockers identified in payment integration. John to assist with API issues.",
          fileType: "video"
        },
        {
          id: 3,
          title: "Project Requirements Document",
          date: "2023-10-03 16:45",
          languages: ["EN", "FR"],
          summary: "Final requirements for customer portal. Includes user authentication, dashboard, and reporting features.",
          fileType: "document"
        }
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'audio':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
        );
      case 'video':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7"></polygon>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
        );
      case 'document':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-background"></div>
      <br />
      <div className="chatbot-content">
        <br /><br />
          <h1 className="chatbot-header">History</h1>
       <br />
        <div className="chatbot-card">
      
        
          
          {loading ? (
            <div className="loading-container">
              <p>Loading History...</p>
            </div>
          ) : (
            <div className="history-list">
              {historyItems.map(item => (
                <div key={item.id} className="history-item">
                  <div className="history-item-header">
                    <div className="history-icon">
                      {getFileIcon(item.fileType)}
                    </div>
                    <div className="history-details">
                      <h3>{item.title}</h3>
                      <p className="history-date">{item.date}</p>
                    </div>
                    <div className="history-languages">
                      {item.languages.map(lang => (
                        <span key={lang} className="capability-tag">{lang}</span>
                      ))}
                    </div>
                  </div>
                  <div className="history-summary">
                    <p>{item.summary}</p>
                  </div>
                  <div className="history-actions">
                    <button className="btn-download">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Download Transcript
                    </button>
                    <button className="btn-download">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Download Summary
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;