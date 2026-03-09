# DSA Genie

> **DSA Genie** is an AI-powered chatbot for Data Structures and Algorithms (DSA) questions. It combines a local LLM (via Ollama) with a Retrieval-Augmented Generation (RAG) pipeline over a DSA knowledge base, and includes a built-in code runner for Python and JavaScript.

## Features

- **RAG-powered answers** — FAISS vector store built from a DSA PDF, queried with HuggingFace sentence-transformer embeddings (`all-MiniLM-L6-v2`)
- **Local LLM** — runs `llama3.2` via Ollama; no external API key required for inference
- **Streaming responses** — answers are streamed token-by-token over SSE
- **Integrated code runner** — execute Python or JavaScript snippets directly in the browser; code from chat answers can be sent to the runner with one click
- **MCP server** — exposes `execute_python` and `execute_javascript` tools via the Model Context Protocol for use with MCP-compatible clients
- **Structured responses** — the LLM is prompted to always return Explanation, Algorithm, Code, Complexity Analysis, and Key Takeaways sections

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Backend | Python, FastAPI, Uvicorn |
| LLM | Ollama (`llama3.2`) |
| RAG | LangChain, FAISS, HuggingFace Embeddings |
| PDF parsing | PyMuPDF (`fitz`) |
| Code execution | Python `subprocess` sandbox |
| MCP | `fastmcp` |

## Prerequisites

- **Python 3.8+**
- **Node.js & npm**
- **Ollama** installed and running locally with the `llama3.2` model pulled:
  ```bash
  ollama pull llama3.2
  ```
- A **HuggingFace token** (for downloading the embedding model)

## Setup

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```env
HF_TOKEN=your_huggingface_token_here
```

Place your DSA PDF at `backend/data/DSA.pdf`. On first run the RAG index is built automatically and cached to `backend/data/faiss_index/`.

Start the server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at the local address shown in the terminal (default `http://localhost:5173`).

### 3. MCP Server (optional)

To expose code execution as MCP tools for a compatible AI client:

```bash
cd backend
python mcp_server.py
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/chat` | Single-shot question → answer |
| `POST` | `/chat/stream` | Streaming question → SSE token stream |
| `POST` | `/execute` | Execute `{ language, code }` and return output |

## Folder Structure

```
DSA-Genie/
├── backend/
│   ├── main.py          # FastAPI app, route definitions
│   ├── qa_bot.py        # LangChain RAG chain + Ollama LLM
│   ├── rag_setup.py     # FAISS index build/load, PDF ingestion
│   ├── code_runner.py   # Sandboxed Python/JS execution
│   ├── mcp_server.py    # MCP tool server
│   ├── requirements.txt
│   └── data/
│       ├── DSA.pdf      # Knowledge base (add your own)
│       └── faiss_index/ # Auto-generated vector index
└── frontend/
    ├── src/
    │   ├── App.jsx       # Two-panel layout (chat + code runner)
    │   ├── Chatbox.jsx   # Chat UI with streaming support
    │   └── CodeRunner.jsx# In-browser code editor and runner
    └── index.html
```

## License

MIT
