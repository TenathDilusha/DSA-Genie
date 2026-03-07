from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from qa_bot import ask_question
from code_runner import run_code


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


class CodeRequest(BaseModel):
    language: str
    code: str


@app.post("/chat")
def chat(req: Question):
    answer = ask_question(req.message)
    return {"answer": answer}


@app.post("/execute")
def execute(req: CodeRequest):
    result = run_code(req.language, req.code)
    return result


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
