# DSA Genie: Chatbot for DSA Questions

> **DSA Genie** is an interactive chatbot for answering Data Structures and Algorithms (DSA) questions using a Large Language Model (LLM) with Retrieval-Augmented Generation (RAG).

## Project Overview

This project consists of:
- **Frontend**: React + Vite app for chat UI
- **Backend**: Python FastAPI server with LLM and RAG pipeline

The chatbot helps users with DSA concepts, explanations, and code, leveraging a custom knowledge base and LLM.

## Features
- Conversational chatbot for DSA queries
- Uses LLM with RAG for accurate, context-aware answers
- Modern React frontend with real-time chat
- Easy to run locally

## Getting Started

### Prerequisites
- Node.js & npm (for frontend)
- Python 3.8+ (for backend)

### Setup

#### 1. Backend
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend will start the API server for the chatbot.

#### 2. Frontend
```
cd frontend
npm install
npm run dev
```
The frontend will be available at the local address shown in the terminal.

## Folder Structure

- `backend/` — Python FastAPI backend, LLM, RAG logic
- `frontend/` — React app, chat UI

## Customization
You can expand the knowledge base, tune the LLM, or adjust the UI as needed for your use case.

## License
MIT
