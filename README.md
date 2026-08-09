# TubeGPT 🎥

TubeGPT is an AI-powered YouTube video summarizer. Paste a YouTube URL and get a concise AI-generated summary from the video's transcript.

## ✨ Features

* 🔗 YouTube URL input
* 📝 Automatic transcript extraction
* 🤖 AI-powered summarization using Google Gemini
* ✂️ Transcript chunking for long videos
* ⚡ Parallel processing of transcript chunks
* 📱 Responsive UI
* 🚨 Error and loading handling

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Toastify

### Backend

* Python
* FastAPI
* LangChain
* Google Gemini
* YouTube Transcript API

## 📂 Project Structure

```text
TubeGPT/
├── client/              # React frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
│
└── youtube-rag/         # FastAPI backend
    ├── app.py
    └── requirements.txt
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd TubeGPT
```

### 2. Backend Setup

```bash
cd youtube-rag

python -m venv venv
```

Activate the virtual environment:

**Windows**

```bash
venv\Scripts\activate
```

**Linux/macOS**

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
GOOGLE_API_KEY=your_google_api_key
CLIENT_URL=http://localhost:5173
```

Run the backend:

```bash
uvicorn app:app --reload
```

### 3. Frontend Setup

Open another terminal:

```bash
cd client
npm install
```

Create `.env`:

```env
VITE_BACKEND_URL=http://127.0.0.1:8000
```

Run the frontend:

```bash
npm run dev
```

Open the URL shown by Vite in your browser.

## 🔄 How It Works

```text
YouTube URL
     ↓
Fetch Transcript
     ↓
Split Transcript into Chunks
     ↓
Gemini Summarizes Chunks
     ↓
Combine Summaries
     ↓
Final Summary
```

## 🚀 Future Improvements

* Chat with YouTube videos
* Generate quizzes
* Generate flashcards
* Key-point extraction
* Video history
* User authentication
* Export summaries
* RAG-based video Q&A

## 📄 License

This project currently does not include a license.
