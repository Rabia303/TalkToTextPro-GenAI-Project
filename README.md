Here is the cleaned-up version of your **TalkToText Pro** project README with **all emojis removed**, while preserving formatting and clarity:

---

# TalkToText Pro

**AI-Powered Meeting Notes, Summaries & Subtitles**

[![Built for TechWiz Hackathon](https://img.shields.io/badge/Built%20for-TechWiz%20Hackathon-orange)](https://aptech-education.com.pk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue)]()
[![React](https://img.shields.io/badge/React-Vite%20JSX-61DAFB)]()
[![Flask](https://img.shields.io/badge/Backend-Flask-lightgrey)]()
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-green)]()

> **TechWiz Hackathon Entry** – Convert audio/video meetings into transcriptions, subtitles, translations, and AI-powered notes & summaries with secure authentication.

---

## Overview

**TalkToText Pro** is a next-generation AI tool for meeting productivity developed for the **TechWiz Hackathon** by **Aptech**. It supports:

* Uploading audio & video files
* Adding video links (YouTube, Meet, Teams)
* Generating AI summaries, notes, & subtitles
* Translating into English or other languages
* Exporting results in PDF, DOCX, TXT, SRT, VTT
* Secure user management with GitHub OAuth, Google Login, and OTP-based authentication

Ideal for remote teams, classrooms, and organizations that require accurate meeting documentation with security.

---

## Key Features

* Audio/Video Upload: Supports `.mp3`, `.wav`, `.mp4` files
* Video Links: Process YouTube, Google Meet, or MS Teams links
* AI Transcription: Powered by Gemini API for high-accuracy speech-to-text
* Translation: Automatic multi-language → English conversion
* AI Notes & Summaries: Executive summary, decisions, action items, sentiment
* Subtitles Generator: Export subtitles in `.srt` and `.vtt`
* Export & Share: Save as PDF, Word, TXT; share via email
* Progress Tracker: Real-time process visualization
* Authentication Options:

  * GitHub OAuth
  * Google Sign-In
  * Email + OTP login
* Meeting History: Access previous notes securely via dashboard

---

## Functional Workflow

1. **Login / Sign Up**

   * GitHub OAuth
   * Google Sign-In
   * OTP-based login (secure email verification)

2. **Upload / Provide Link**

   * Audio files (.mp3, .wav)
   * Video files (.mp4)
   * Meeting/video link (e.g., YouTube, Zoom recording)

3. **AI Processing**

   * Transcription → Translation → Optimization
   * AI Notes + Summaries generation
   * Subtitle extraction

4. **Output**

   * Display on dashboard
   * Export to PDF, DOCX, TXT, SRT, VTT
   * Store in database for retrieval

---

## Non-Functional Requirements

* Performance: 30-min meeting processed in ≤2 minutes
* Security: Encrypted storage, OAuth & OTP-based access control
* Accuracy: 85–90% transcription & summarization accuracy
* Scalability: Handles multiple concurrent uploads
* Usability: Mobile-responsive, clean UI

---

## Tech Stack

* **Frontend**: React.js + Vite, JSX, Tailwind CSS
* **Backend**: Flask (Python)
* **Authentication**:

  * GitHub OAuth
  * Google Sign-In API
  * Email OTP (custom implementation)
* **APIs & AI Models**:

  * Google Gemini API (transcription + summarization)
  * OpenAI API (optional NLP tasks)
* **Database**: MongoDB Atlas
* **Libraries**: TensorFlow, NLTK, Keras, Transformers, Flask-Login, OAuthLib
* **Formats Supported**: PDF, DOCX, TXT, SRT, VTT

---

## Environment Variables

### Frontend (.env for Vite)

Create a `.env` file inside your **frontend root folder**:

```env
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_BACKEND_URL=http://localhost:5000
```

### Backend (.env)

Create a `.env` file inside your **backend root folder**:

```env
# Core
GEMINI_API_KEY=your-gemini-api-key
SECRET_KEY=your-secret-key-here
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=your-mongodb-atlas-uri
MONGODB_URI=your-mongodb-atlas-uri

# Email (for OTP)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=your-email@example.com

# Social Logins
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/talktotext-pro.git
cd talktotext-pro
```

### 2. Setup Backend (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Setup Frontend (React + Vite)

```bash
cd frontend
npm install
```

### 4. Configure Environment Variables

Add your API keys and credentials to the respective `.env` files as shown above.

### 5. Run the Application

* Start Flask Backend:

  ```bash
  cd backend
  python app.py
  ```
* Start React Frontend:

  ```bash
  cd frontend
  npm run dev
  ```

### 6. Access the App

* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:5000`

---

## Deliverables

* Full Source Code (backend + frontend + notebooks)
* Secure Authentication System (OAuth, Google, OTP)
* AI Pipeline for transcription, translation, summarization, subtitles
* Output Export (PDF, DOCX, TXT, SRT, VTT)
* Documentation (user & developer guides)
* Public GitHub Repository
* Demo Video showcasing features

---

## Sample Outputs

**Meeting Notes (AI)**

```
Summary: Project kickoff meeting covered timelines and resource planning.  
Key Points: Hiring needs, budget approval, sprint goals.  
Decisions: Vendor contract signed.  
Action Items: PM to share updated roadmap by Friday.  
Sentiment: Positive.  
```

**Subtitle Example (.srt)**

```
00:00:01,000 --> 00:00:05,000  
Welcome everyone to the project kickoff meeting.  
```

---

## Contributors

Developed as part of **TechWiz Hackathon – Aptech Limited**

* \Rabia Imtiaz (Lead Developer)
* \Tayyaba Rehan
* \Rameen Sahar
* \Noor Ul Ain Lodhi
---

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## Links

* [Live Demo](https://your-demo-link.com)
* [GitHub Repository](https://github.com/Rabia303/TalkToTextPro-GenAI-Project)
* [Video Demo](https://youtube.com/your-demo-video)
* [Blog Post](https://ai-poweredmeetingnotesrewriter.hashnode.dev/talktotext-pro)

---

**Built with love for TechWiz Hackathon by Aptech**

---

