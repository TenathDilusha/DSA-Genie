from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from qa_bot import ask_question


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Question(BaseModel):
    message: str


@app.post("/chat")
def chat(req: Question):
    answer = ask_question(req.message)
    return {"answer": answer}


if __name__ == "__main__":
    # Run with auto-reload for development
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
