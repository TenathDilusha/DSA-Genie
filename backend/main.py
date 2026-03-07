from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uvicorn
import json

from qa_bot import ask_question, stream_question
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


@app.post("/chat/stream")
def chat_stream(req: Question):
    def token_generator():
        for token in stream_question(req.message):
            # JSON-encode so newlines/special chars survive SSE transport
            yield f"data: {json.dumps(token)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(token_generator(), media_type="text/event-stream")


@app.post("/execute")
def execute(req: CodeRequest):
    result = run_code(req.language, req.code)
    return result


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
