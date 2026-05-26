<div align="center">
  <br />
  <a href="https://github.com/your-username/sage">
    <img src="frontend/images/sage_logo.png" alt="SAGE Logo" width="280" />
  </a>
  <br />
  <br />

  <h3 align="center">Semantic AI Generation Engine</h3>

  <p align="center">
    <strong>AI-Powered Semantic Document Intelligence Platform</strong>
  </p>

  <p align="center">
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18-000000?style=for-the-badge&logo=react" alt="React" /></a>
    <a href="https://vitejs.dev"><img src="https://img.shields.io/badge/Vite-5-000000?style=for-the-badge&logo=vite" alt="Vite" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-18-000000?style=for-the-badge&logo=node.js" alt="Node.js" /></a>
    <a href="https://mongodb.com"><img src="https://img.shields.io/badge/MongoDB-Atlas-000000?style=for-the-badge&logo=mongodb" alt="MongoDB" /></a>
    <a href="https://langchain.com"><img src="https://img.shields.io/badge/LangChain-Integration-000000?style=for-the-badge&logo=chainlink" alt="LangChain" /></a>
  </p>
  <br />
</div>

## Overview

**SAGE** is a production-grade Retrieval-Augmented Generation (RAG) platform designed to eliminate LLM hallucinations. By combining precise local vector embeddings with advanced language models, SAGE enables users to upload dense PDF documents and instantly engage in semantic, context-aware conversations grounded entirely in truth.

Designed for performance and scale, SAGE represents a modern approach to private document intelligence.

---

## Features

- **AI Document Chat** — Interrogate your documents naturally in real-time.
- **Semantic Search** — Strict vector retrieval ensuring high-accuracy context extraction.
- **PDF Intelligence** — Automated parsing, cleaning, and token-optimized chunking.
- **RAG Pipeline** — Dynamic injection of localized context into the LLM prompt layer.
- **OpenRouter Integration** — Seamlessly leverage frontier models (Mistral, Claude, GPT-4).
- **Vector Retrieval** — Local embedding generation via `all-MiniLM-L6-v2` for blazing fast semantic mapping.
- **JWT Authentication** — Robust, isolated user sessions and secure document boundaries.
- **Modern UI** — Cinematic micro-interactions built with Framer Motion and Tailwind CSS.
- **MongoDB Storage** — Persistent metadata, conversation history, and user management.
- **Context-Aware Responses** — Intelligent synthesis of conversational history and extracted chunks.

---

## Architecture Flow

The SAGE retrieval pipeline is highly optimized for accuracy and low-latency inference.

```text
PDF Upload  →  Semantic Chunking  →  Local Vector Embeddings  →  Similarity Search  →  Context Assembly  →  OpenRouter LLM  →  AI Response
```

---

## Tech Stack

<div align="center">

| **Frontend** | **Backend** | **AI Infrastructure** |
| :--- | :--- | :--- |
| React 18 | Node.js | LangChain |
| Vite | Express.js | OpenRouter |
| Tailwind CSS | MongoDB | `@xenova/transformers` |
| Framer Motion | JSON Web Tokens | Sentence-Transformers |

</div>

---

## Interface

<div align="center">

| Landing Page | Application Dashboard |
| :---: | :---: |
| <img src="docs/placeholder-landing.png" width="400" alt="Landing Page Placeholder" /> | <img src="docs/placeholder-dashboard.png" width="400" alt="Dashboard Placeholder" /> |

| PDF Upload Interface | Real-time AI Chat |
| :---: | :---: |
| <img src="docs/placeholder-upload.png" width="400" alt="Upload Placeholder" /> | <img src="docs/placeholder-chat.png" width="400" alt="Chat Placeholder" /> |

</div>

---

## Installation

Getting SAGE up and running locally takes just a few minutes.

### 1. Clone & Install

```bash
git clone https://github.com/your-username/sage.git
cd sage

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Environment Setup

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sage
JWT_SECRET=your_super_secret_jwt_key
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_key
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Servers

Start the backend service:
```bash
cd backend
npm run dev
```

Start the client application:
```bash
cd frontend
npm run dev
```

---

## Deployment

SAGE is built with a modern, decoupled architecture, making cloud deployment seamless.

- **Frontend**: Optimized for edge deployment on **Vercel**.
- **Backend**: Container-ready for seamless deployment on **Render** or Railway.
- **Database**: Native integration with **MongoDB Atlas** for scalable persistence.

---

## Future Roadmap

- [ ] Implement persistent vector storage using ChromaDB / FAISS.
- [ ] Add support for `.docx` and `.txt` ingestion.
- [ ] Integrate streaming LLM responses (Server-Sent Events).
- [ ] Add enterprise role-based access control (RBAC).

---

<div align="center">
  <br />
  <p>Built with precision and purpose.</p>
  <b>SAGE © 2026</b>
</div>
