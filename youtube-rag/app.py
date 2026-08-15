import os

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.summarize import router as summarize_route

app = FastAPI(title="TubeGPT")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CLIENT_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(summarize_route, prefix="/api/v1/summarize")


@app.get("/")
def home():
    return {"message": "TubeGPT API Running"}
