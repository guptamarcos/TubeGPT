# TubeGPT

TubeGPT is an AI-powered YouTube video summarization application. Users
can paste a YouTube video URL and receive an automatically generated
summary based on the video’s transcript.

The project is split into a **React frontend** and a **FastAPI +
LangChain backend**. The backend fetches the YouTube transcript, splits
long transcripts into manageable chunks, summarizes the chunks in
parallel with Google Gemini, and combines the partial summaries into a
final result.

## Features

### Currently Implemented

- Paste a YouTube video URL
- Validate YouTube URLs on the frontend
- Extract the YouTube video ID on the backend
- Fetch YouTube transcripts
- Handle videos with unavailable/disabled transcripts
- Split long transcripts using `RecursiveCharacterTextSplitter`
- Summarize transcript chunks asynchronously
- Generate a final consolidated summary for long videos
- Display loading/progress state in the UI
- Display generated summaries in a clean interface
- Clear the generated summary
- Clear the URL and generated summary
- Toast-based error notifications
- Responsive React UI

### Planned / UI Placeholders

The interface currently contains action cards for:

- Summary
- Key Points
- Chat with Video
- Generate Quiz
- Flashcards
- Export Notes

At the moment, these cards are UI elements only; their backend
functionality has not been implemented.

------------------------------------------------------------------------

## Architecture

``` text
┌──────────────────────────┐
│       React Frontend     │
│                          │
│  YouTube URL Input       │
│          │               │
│          ▼               │
│  Axios API Request       │
└──────────┬───────────────┘
           │
           │ POST /api/v1/summarize
           ▼
┌──────────────────────────┐
│      FastAPI Backend     │
│                          │
│  Validate URL            │
│          │               │
│          ▼               │
│  Extract Video ID        │
│          │               │
│          ▼               │
│  Fetch Transcript        │
│          │               │
│          ▼               │
│  Split Transcript        │
│          │               │
│          ▼               │
│  Gemini Summarization    │
│          │               │
│          ▼               │
│  Combine Summaries       │
│          │               │
│          ▼               │
│  JSON Response           │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│       React UI           │
│                          │
│     Display Summary      │
└──────────────────────────┘
```

------------------------------------------------------------------------

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS 4
- Axios
- Lucide React
- React Toastify

### Backend

- Python
- FastAPI
- Uvicorn
- LangChain
- LangChain Google GenAI
- LangChain Text Splitters
- Google Gemini
- YouTube Transcript API
- Pydantic
- python-dotenv

------------------------------------------------------------------------

## Project Structure

``` text
TubeGPT-main/
│
├── client/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosInstance.js
│   │   │   └── Video.js
│   │   │
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   │
│   │   ├── components/
│   │   │   ├── ActionCard.jsx
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── pages/
│   │   │   └── YouTubeSummarizerPage.jsx
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
└── youtube-rag/
    ├── app.py
    ├── requirements.txt
    └── .gitignore
```

------------------------------------------------------------------------

# How the Application Works

## 1. User enters a YouTube URL

The React application provides an input field where the user pastes a
YouTube URL.

Before making the API request, the frontend checks whether the URL
belongs to a supported YouTube hostname:

``` text
youtube.com
youtu.be
m.youtube.com
music.youtube.com
```

## 2. Frontend sends the request

The frontend uses Axios to send:

``` http
POST /api/v1/summarize
```

with:

``` json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

The backend URL is configured through:

``` text
VITE_BACKEND_URL
```

------------------------------------------------------------------------

## 3. Backend extracts the video ID

The FastAPI backend extracts the 11-character YouTube video ID from
supported URL patterns.

For example:

``` text
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

becomes:

``` text
dQw4w9WgXcQ
```

------------------------------------------------------------------------

## 4. Backend fetches the transcript

TubeGPT uses `youtube-transcript-api` to fetch the transcript associated
with the video.

The transcript snippets are combined into a single text string:

``` text
snippet 1 + snippet 2 + snippet 3 + ...
```

If a transcript is unavailable or transcripts are disabled, the API
returns an appropriate error response.

------------------------------------------------------------------------

## 5. Long transcripts are chunked

Long transcripts may be too large to send to the model in one request.

TubeGPT uses:

``` python
RecursiveCharacterTextSplitter(
    chunk_size=12000,
    chunk_overlap=1200
)
```

This produces smaller overlapping transcript chunks.

The overlap helps preserve context between adjacent chunks.

------------------------------------------------------------------------

## 6. Each chunk is summarized

Each transcript chunk is sent to the Gemini chat model using a LangChain
chain.

The summarization prompt instructs the model to:

- Use simple English
- Use headings
- Use bullet points
- Ignore filler words
- Keep the summary within approximately 500 words

The chunk summarization calls are executed concurrently with:

``` python
asyncio.gather(...)
```

This can reduce the total waiting time compared with processing every
chunk sequentially.

------------------------------------------------------------------------

## 7. Partial summaries are combined

If the transcript contains multiple chunks, their summaries are combined
and passed through the summarization chain again.

Conceptually:

``` text
Transcript
    │
    ├── Chunk 1 → Summary 1
    ├── Chunk 2 → Summary 2
    ├── Chunk 3 → Summary 3
    └── Chunk N → Summary N
                    │
                    ▼
             Combined Summaries
                    │
                    ▼
              Final Summary
```

If there is only one chunk, that chunk’s summary is returned directly.

------------------------------------------------------------------------

# Installation

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Python 3.10+
- pip
- A Google Gemini API key

------------------------------------------------------------------------

# Backend Setup

Navigate to the backend:

``` bash
cd youtube-rag
```

Create a virtual environment:

### Windows

``` bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

``` bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

``` bash
pip install -r requirements.txt
```

------------------------------------------------------------------------

## Backend Environment Variables

Create:

``` text
youtube-rag/.env
```

Add:

``` env
GOOGLE_API_KEY=your_google_gemini_api_key
CLIENT_URL=http://localhost:5173
```

The backend loads environment variables using `python-dotenv`.

> Keep `.env` private and never commit your API key to Git.

------------------------------------------------------------------------

# Start the Backend

From the `youtube-rag` directory:

``` bash
uvicorn app:app --reload
```

The backend will normally be available at:

``` text
http://127.0.0.1:8000
```

The root endpoint can be tested with:

``` http
GET /
```

Expected response:

``` json
{
  "message": "TubeGPT API Running"
}
```

------------------------------------------------------------------------

# Frontend Setup

Open another terminal and navigate to:

``` bash
cd client
```

Install dependencies:

``` bash
npm install
```

Create:

``` text
client/.env
```

Add:

``` env
VITE_BACKEND_URL=http://127.0.0.1:8000
```

------------------------------------------------------------------------

# Start the Frontend

Run:

``` bash
npm run dev
```

Vite will provide a local development URL, typically:

``` text
http://localhost:5173
```

Open that URL in your browser.

------------------------------------------------------------------------

# API Documentation

## Health Check

### `GET /`

Checks whether the API is running.

### Response

``` json
{
  "message": "TubeGPT API Running"
}
```

------------------------------------------------------------------------

## Summarize YouTube Video

### `POST /api/v1/summarize`

Generates a summary from a YouTube video’s transcript.

### Request

``` json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

### Successful Response

``` json
{
  "video_id": "VIDEO_ID",
  "summary": "Generated video summary..."
}
```

### Possible Errors

#### Invalid YouTube URL

``` json
{
  "detail": "Invalid YouTube URL"
}
```

#### Transcript unavailable

``` json
{
  "detail": "Transcript not available for this video."
}
```

#### Other server/API errors

The backend returns an HTTP 500 response with the underlying error
message.

------------------------------------------------------------------------

# Frontend API Flow

The frontend API layer is organized as:

``` text
src/api/
├── axiosInstance.js
└── Video.js
```

`axiosInstance.js` creates a reusable Axios instance:

``` text
VITE_BACKEND_URL + /api
```

`Video.js` exposes:

``` javascript
getSummary(url)
```

which sends:

``` text
POST /v1/summarize
```

Because the Axios base URL already contains `/api`, the resulting
endpoint is:

``` text
/api/v1/summarize
```

------------------------------------------------------------------------

# Chunking Strategy

TubeGPT currently uses `RecursiveCharacterTextSplitter`.

Configuration:

``` python
chunk_size=12000
chunk_overlap=1200
```

### Why chunking is necessary

A YouTube transcript can be much larger than the amount of text that
should be processed in a single LLM request.

Chunking allows the application to:

1.  Break large transcripts into smaller pieces.
2.  Process each piece independently.
3.  Generate partial summaries.
4.  Combine those summaries into a final summary.

The overlap reduces the chance of losing important context at chunk
boundaries.

------------------------------------------------------------------------

# Error Handling

The frontend handles several common situations:

- Empty URL
- Invalid YouTube URL
- Backend errors
- Transcript unavailable
- Loading state while processing

Toast notifications are displayed using `react-toastify`.

The backend uses FastAPI’s `HTTPException` for API-level errors.

------------------------------------------------------------------------

# Performance Considerations

The backend uses:

``` python
asyncio.to_thread(...)
```

for transcript fetching because transcript retrieval is synchronous.

It also uses:

``` python
asyncio.gather(...)
```

to summarize multiple transcript chunks concurrently.

This creates a processing flow approximately like:

``` text
Fetch Transcript
       │
       ▼
Split Transcript
       │
       ├─────────────┐
       ▼             ▼
   Chunk 1        Chunk 2       ... Chunk N
       │             │             │
       ▼             ▼             ▼
   Gemini          Gemini        Gemini
       │             │             │
       └─────────────┬─────────────┘
                     ▼
             Combine Summaries
                     │
                     ▼
                Final Summary
```

### Important limitation

Concurrent LLM requests can increase API usage and may encounter
provider rate limits for very long videos. Production implementations
should consider concurrency limits, retries, exponential backoff, and
token/cost monitoring.

------------------------------------------------------------------------

# Security and Configuration Notes

- Never expose `GOOGLE_API_KEY` in frontend code.
- Store secrets in environment variables.
- Configure CORS to allow only trusted frontend origins in production.
- Avoid returning raw internal exception messages to users in
  production.
- Add request validation and rate limiting before exposing the API
  publicly.
- Consider authentication if the application becomes a multi-user
  service.

------------------------------------------------------------------------

# Current Limitations

The current version is a focused MVP rather than a complete YouTube
learning platform.

### 1. Transcript dependency

The summarizer requires a transcript. Videos without an accessible
transcript cannot currently be summarized.

### 2. No persistent storage

There is currently no database for:

- Users
- Videos
- Summaries
- History
- Saved notes
- Quizzes
- Flashcards

### 3. Action cards are not connected

The UI displays options such as Quiz, Flashcards, and Chat with Video,
but their functionality has not yet been implemented.

### 4. No authentication

The user icon in the navbar is currently only a UI element.

### 5. No streaming response

The final summary is returned after processing rather than streamed
progressively to the frontend.

### 6. Limited URL parsing

The backend currently supports specific YouTube URL patterns. A
production implementation could use a more robust URL parser to cover
additional YouTube URL formats.

------------------------------------------------------------------------

# Future Improvements

TubeGPT can be expanded into a complete AI-powered YouTube learning
assistant.

## High-value next features

### 1. Key Point Extraction

Generate structured takeaways:

``` text
Key Point 1
Key Point 2
Key Point 3
...
```

### 2. Video Chat

Store the transcript as retrievable chunks and implement RAG:

``` text
Question
   │
   ▼
Query Embedding
   │
   ▼
Vector Search
   │
   ▼
Relevant Transcript Chunks
   │
   ▼
LLM
   │
   ▼
Answer
```

### 3. Quiz Generation

Generate:

- Multiple-choice questions
- True/false questions
- Short-answer questions
- Answers and explanations

### 4. Flashcards

Generate:

``` text
Question → Answer
```

cards from important concepts in the transcript.

### 5. Persistent Video History

Add a database containing:

``` text
User
 └── Videos
      ├── Transcript
      ├── Summary
      ├── Key Points
      ├── Quiz
      └── Flashcards
```

### 6. Export

Allow users to export generated content as:

- PDF
- Markdown
- TXT

### 7. Background Jobs

For long videos, move processing to a background job system such as
Celery or another task queue.

### 8. Better RAG Pipeline

A production-grade video-chat system could use:

``` text
YouTube Transcript
       │
       ▼
Cleaning
       │
       ▼
Semantic / Recursive Chunking
       │
       ▼
Embeddings
       │
       ▼
Vector Database
       │
       ▼
Retriever
       │
       ▼
LLM
```

This would make the “Chat with Video” feature substantially more useful
than sending the entire transcript to the model.

------------------------------------------------------------------------

# Development Commands

## Frontend

Install dependencies:

``` bash
npm install
```

Start development server:

``` bash
npm run dev
```

Build production bundle:

``` bash
npm run build
```

Run ESLint:

``` bash
npm run lint
```

Preview production build:

``` bash
npm run preview
```

## Backend

Start development server:

``` bash
uvicorn app:app --reload
```

------------------------------------------------------------------------

# Example Usage

1.  Start the FastAPI backend.
2.  Start the React frontend.
3.  Open the frontend in your browser.
4.  Copy a YouTube video URL.
5.  Paste it into the TubeGPT input.
6.  Click **Summarize**.
7.  TubeGPT fetches the transcript.
8.  The transcript is chunked.
9.  Gemini summarizes the chunks.
10. The final summary is displayed in the browser.

------------------------------------------------------------------------

# Project Goal

The long-term goal of TubeGPT is to evolve from a simple YouTube
summarizer into an **AI-powered video learning assistant** that can
understand a video’s transcript and provide:

- Summaries
- Key points
- Conversational Q&A
- Quizzes
- Flashcards
- Searchable notes
- Exportable learning material

The current implementation establishes the core pipeline:

``` text
YouTube URL
     ↓
Transcript
     ↓
Chunking
     ↓
LLM Summarization
     ↓
Final Summary
```

That pipeline can later become the foundation for a full RAG-based
YouTube knowledge system.

------------------------------------------------------------------------

## License

No license file is currently included in the repository.

If you plan to publish TubeGPT as an open-source project, add an
appropriate `LICENSE` file.
