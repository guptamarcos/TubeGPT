import re

from fastapi import FastAPI,HTTPException
from pydantic import BaseModel

from youtube_transcript_api import YouTubeTranscriptApi

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_text_splitters import RecursiveCharacterTextSplitter

router = FastAPI()

llm = ChatGoogleGenerativeAI(
  model="gemini-3.5-flash-lite",
  temperature=0.2,
)

prompt = ChatPromptTemplate.from_template("""
You are an expert YouTube video summarizer.

Summarize the following transcript.

Use:
- Headings
- Bullet points
- Simple English

Transcript:
{transcript}
""")

chain = prompt | llm | StrOutputParser()

class VideoRequest(BaseModel):
  url: str


@router.post("/")
def summarize_video(data: VideoRequest):

    # Extract Video ID
    match = re.search(r"(?:v=|youtu\.be/)([a-zA-Z0-9_-]{11})", data.url)

    if not match:
      raise HTTPException(status_code=400, detail="Invalid URL")

    video_id = match.group(1)

    try:
      api = YouTubeTranscriptApi()
      transcript = api.fetch(video_id)

    except Exception:
      raise HTTPException(status_code=404, detail="Transcript not found")

    transcript_text = ""

    for item in transcript:
      transcript_text += item.text + " "

    splitter = RecursiveCharacterTextSplitter(chunk_size=12000, chunk_overlap=1000)

    chunks = splitter.split_text(transcript_text)

    summaries = []

    for chunk in chunks:
      summary = chain.invoke({"transcript": chunk})
      summaries.append(summary)

    if len(summaries) == 1:
      final_summary = summaries[0]

    else:
      combined_summary = "\n\n".join(summaries)

      final_summary = chain.invoke({"transcript": combined_summary})

    return {"video_id": video_id, "summary": final_summary}
