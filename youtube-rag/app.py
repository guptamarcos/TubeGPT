import os
import re
import asyncio

from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from youtube_transcript_api import (
    YouTubeTranscriptApi,
    NoTranscriptFound,
    TranscriptsDisabled,
)

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CLIENT_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash-lite",
    temperature=0.2,
)

prompt = ChatPromptTemplate.from_template(
    """
You are an expert YouTube video summarizer.

Summarize the following transcript.

Rules:
- Use simple English.
- Use headings.
- Use bullet points.
- Ignore filler words.
- Maximum 500 words.

Transcript:

{transcript}
"""
)

chain = prompt | llm | StrOutputParser()


# ---------------------------
# Request Model
# ---------------------------

class VideoRequest(BaseModel):
    url: str


# ---------------------------
# Helpers
# ---------------------------

def extract_video_id(url: str):
    patterns = [
        r"v=([a-zA-Z0-9_-]{11})",
        r"youtu\.be\/([a-zA-Z0-9_-]{11})",
        r"shorts\/([a-zA-Z0-9_-]{11})",
    ]

    for pattern in patterns:
        match = re.search(pattern, url)

        if match:
            return match.group(1)

    raise HTTPException(
        status_code=400,
        detail="Invalid YouTube URL"
    )


def fetch_transcript(video_id: str):
    api = YouTubeTranscriptApi()

    transcript = api.fetch(video_id)

    transcript_text = " ".join(
        snippet.text
        for snippet in transcript
    )

    return transcript_text


async def summarize_chunk(chunk: str):
    return await chain.ainvoke(
        {
            "transcript": chunk
        }
    )


# ---------------------------
# Routes
# ---------------------------

@app.get("/")
def home():
    return {
        "message": "TubeGPT API Running"
    }


@app.post("/api/v1/summarize")
async def summarize_video(data: VideoRequest):

    video_id = extract_video_id(data.url)

    try:
        # Run synchronous transcript fetching in a background thread
        transcript = await asyncio.to_thread(
            fetch_transcript,
            video_id
        )

    except (NoTranscriptFound, TranscriptsDisabled):

        raise HTTPException(
            status_code=404,
            detail="Transcript not available for this video."
        )

    except Exception as e:

        print(e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=12000,
        chunk_overlap=1200,
    )

    chunks = splitter.split_text(transcript)

    tasks = [
        summarize_chunk(chunk)
        for chunk in chunks
    ]

    partial_summaries = await asyncio.gather(*tasks)

    if len(partial_summaries) == 1:

        final_summary = partial_summaries[0]

    else:

        combined = "\n\n".join(partial_summaries)

        final_summary = await chain.ainvoke(
            {
                "transcript": combined
            }
        )

    return {
        "video_id": video_id,
        "summary": final_summary,
    }