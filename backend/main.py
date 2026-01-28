from fastapi import FastAPI
from pydantic import BaseModel
from qa_bot import ask_question
from fastapi.middleware.cors import CORSMiddleware

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
