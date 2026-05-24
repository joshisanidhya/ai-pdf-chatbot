<div align="center">

# 🧠 SAGE

### Semantic Analysis & Guidance Engine — Intelligent PDF Knowledge Assistant

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![LangChain](https://img.shields.io/badge/LangChain-0.3-FF6B35?logo=chainlink&logoColor=white)](https://langchain.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Upload any PDF knowledge base. Ask SAGE anything. Get cited, grounded AI answers.**

[Demo](#) · [Documentation](#architecture) · [Quick Start](#quick-start) · [Roadmap](#roadmap)

---

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [RAG Pipeline](#rag-pipeline)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## Overview

**SAGE (Semantic Analysis & Guidance Engine)** is a startup-grade, production-ready RAG (Retrieval-Augmented Generation) application that transforms any PDF document into an interactive, context-aware AI knowledge base.

Built with a clean MVC backend, a modular LangChain pipeline, and a stunning dark-themed React frontend, SAGE demonstrates:

- **Full-stack engineering** across a production Express + MongoDB backend
- **AI/ML engineering** via a complete RAG pipeline with embeddings and vector search
- **Modern UI/UX** with glassmorphism, Framer Motion animations, and responsive design
- **Security-first development** with JWT, Helmet, bcrypt, and rate limiting
- **Scalable architecture** designed for future expansion (agents, voice, multi-doc, etc.)

---

## Features

### Core MVP
| Feature | Status |
|---------|--------|
| PDF Upload & Text Extraction | ✅ Complete |
| Recursive Character Text Chunking | ✅ Complete |
| HuggingFace Embeddings | ✅ Complete |
| In-Memory Vector Search | ✅ Complete |
| Multi-Provider LLM (OpenRouter / OpenAI / Ollama) | ✅ Complete |
| Semantic Retrieval + Context Injection | ✅ Complete |
| Source Citation Cards | ✅ Complete |
| Chat History Persistence (MongoDB) | ✅ Complete |
| JWT Authentication | ✅ Complete |
| Markdown + Code Block Rendering | ✅ Complete |
| Copy Response Button | ✅ Complete |
| AI Response Feedback (👍/👎) | ✅ Complete |
| Drag & Drop Upload with Progress | ✅ Complete |
| Collapsible Sidebar | ✅ Complete |
| Mobile Responsive | ✅ Complete |
| Toast Notifications | ✅ Complete |
| Document Management (CRUD) | ✅ Complete |
| Suggested Questions | ✅ Complete |

---

## Tech Stack

### Frontend
```
React 18         → Core UI framework
Vite             → Lightning-fast build tool
Tailwind CSS     → Utility-first styling
Framer Motion    → Smooth animations
React Router 6   → Client-side routing
React Markdown   → Markdown rendering
React Dropzone   → Drag & drop uploads
React Hot Toast  → Toast notifications
Axios            → HTTP client with interceptors
Lucide React     → Icon library
```

### Backend
```
Node.js + Express   → REST API server
MongoDB + Mongoose  → Document database
JWT + bcryptjs      → Authentication & password hashing
Multer              → File upload handling
Helmet              → HTTP security headers
Morgan              → HTTP request logging
Winston             → Structured application logging
Express Validator   → Input validation
express-rate-limit  → API rate limiting
```

### AI / RAG Pipeline
```
LangChain           → RAG orchestration framework
HuggingFace         → all-MiniLM-L6-v2 embedding model
MemoryVectorStore   → In-memory vector similarity search
pdf-parse           → PDF text extraction
RecursiveCharacterTextSplitter  → Semantic chunking
OpenRouter          → Multi-model LLM gateway (200+ models)
OpenAI              → GPT-3.5/GPT-4 support
Ollama              → Local LLM inference (Llama 3.2, Mistral)
```

---

## Architecture

```
ai-pdf-chatbot/
├── backend/                    # Express API Server
│   ├── config/
│   │   └── database.js         # MongoDB connection with retry
│   ├── controllers/
│   │   ├── authController.js   # Register, login, profile
│   │   ├── chatController.js   # RAG query + response
│   │   ├── documentController.js  # Upload, CRUD
│   │   └── conversationController.js  # Chat history
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   ├── upload.js           # Multer PDF validator
│   │   └── errorHandler.js     # Centralized error handling
│   ├── models/
│   │   ├── User.js             # User schema + bcrypt
│   │   ├── Document.js         # PDF document schema
│   │   └── Conversation.js     # Chat + message schema
│   ├── rag/
│   │   ├── ragPipeline.js      # Master RAG orchestration
│   │   ├── embeddingService.js # HuggingFace embeddings
│   │   └── llmService.js       # Multi-provider LLM service
│   ├── routes/
│   │   ├── auth.js             # /api/auth/*
│   │   ├── documents.js        # /api/documents/*
│   │   ├── chat.js             # /api/chat
│   │   └── conversations.js    # /api/conversations/*
│   ├── utils/
│   │   └── logger.js           # Winston structured logger
│   ├── uploads/                # PDF file storage
│   └── server.js               # Express entry point
│
└── frontend/                   # React + Vite SPA
    └── src/
        ├── components/
        │   ├── chat/
        │   │   └── ChatInterface.jsx  # Full chat UI
        │   ├── layout/
        │   │   └── Sidebar.jsx        # Collapsible sidebar
        │   └── upload/
        │       └── UploadZone.jsx     # Drag & drop upload
        ├── context/
        │   ├── AuthContext.jsx        # Global auth state
        │   └── DocumentContext.jsx    # Document state
        ├── pages/
        │   ├── LandingPage.jsx        # Marketing homepage
        │   ├── LoginPage.jsx          # Auth
        │   ├── RegisterPage.jsx       # Auth
        │   ├── DashboardPage.jsx      # Document overview
        │   ├── ChatPage.jsx           # RAG chat interface
        │   └── NotFoundPage.jsx       # 404
        └── services/
            └── api.js                 # Axios + interceptors
```

---

## RAG Pipeline

```
User Question
      │
      ▼
┌─────────────────────────────────────┐
│         RETRIEVAL PHASE             │
│                                     │
│  1. PDF Ingestion                   │
│     └── pdf-parse text extraction   │
│                                     │
│  2. Text Chunking                   │
│     └── RecursiveCharacterSplitter  │
│         chunk_size: 1000 chars      │
│         overlap: 200 chars          │
│                                     │
│  3. Embedding Generation            │
│     └── HuggingFace all-MiniLM-L6-v2│
│         384 dimensions              │
│                                     │
│  4. Vector Storage                  │
│     └── MemoryVectorStore           │
│         (FAISS/Chroma in prod)      │
└─────────────────────────────────────┘
      │
      ▼ (at query time)
┌─────────────────────────────────────┐
│         GENERATION PHASE            │
│                                     │
│  5. Semantic Search                 │
│     └── similaritySearchWithScore   │
│         top_k: 4 chunks             │
│         min_score: 0.3              │
│                                     │
│  6. Context Injection               │
│     └── System prompt construction  │
│         + source chunks             │
│         + conversation history      │
│                                     │
│  7. LLM Generation                  │
│     └── OpenRouter / OpenAI / Ollama│
│         temperature: 0.3            │
│         max_tokens: 1500            │
└─────────────────────────────────────┘
      │
      ▼
Cited Answer + Source Chunks
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas Cluster)
- One of: OpenRouter API key / OpenAI API key / Ollama running locally
- HuggingFace API key (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/joshisanidhya/ai-pdf-chatbot.git
cd ai-pdf-chatbot
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section)

npm run dev
# Server starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install

cp .env.example .env
# Configure VITE_API_URL if not using Vite proxy

npm run dev
# App opens on http://localhost:5173
```

### 4. Using Ollama (Free, Local)

```bash
# Install Ollama: https://ollama.ai
ollama pull llama3.2   # or mistral, phi3, etc.

# In backend .env:
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3.2
```

### 5. Using OpenRouter (Recommended)

```bash
# Sign up at https://openrouter.ai (generous free credits)
# In backend .env:
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=mistralai/mistral-7b-instruct
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/sage

# Authentication
JWT_SECRET=your_super_secret_key_at_least_32_chars
JWT_EXPIRES_IN=7d

# LLM Provider (openrouter | openai | ollama)
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-xxxxxxxx
OPENROUTER_MODEL=mistralai/mistral-7b-instruct

# Embeddings
HUGGINGFACE_API_KEY=hf_xxxxxxxx

# Upload
MAX_FILE_SIZE_MB=50

# Frontend (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Get JWT token |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Documents (Knowledge Bases)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/upload` | Upload & process PDF |
| GET | `/api/documents` | List user documents |
| GET | `/api/documents/:id` | Get document details |
| DELETE | `/api/documents/:id` | Delete document |
| POST | `/api/documents/:id/reprocess` | Reprocess failed doc |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send question, get RAG answer |
| POST | `/api/chat/feedback` | Rate AI response |

### Conversations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/conversations` | List conversations |
| GET | `/api/conversations/:id` | Get full conversation |
| PUT | `/api/conversations/:id` | Update title/pin/archive |
| DELETE | `/api/conversations/:id` | Delete conversation |

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build

# Connect to Vercel:
# 1. Push to GitHub
# 2. Import project at vercel.com
# 3. Add env var: VITE_API_URL=https://your-backend.railway.app/api
# 4. Deploy!
```

### Backend → Railway / Render

```bash
# Railway:
# 1. Connect GitHub repo
# 2. Set root directory to /backend
# 3. Add all environment variables
# 4. Railway auto-detects Node.js

# Render:
# 1. New Web Service → connect repo
# 2. Build command: cd backend && npm install
# 3. Start command: node server.js
# 4. Add environment variables
```

### Database → MongoDB Atlas (Free)

```bash
# 1. Create free cluster at atlas.mongodb.com
# 2. Get connection string
# 3. Update MONGODB_URI in production env vars
```

---

## Roadmap

### Phase 2 — Enhanced RAG
- [ ] **Persistent Vector Store** (FAISS/ChromaDB with disk persistence)
- [ ] **Streaming responses** (SSE for real-time token streaming)
- [ ] **Multi-document RAG** (chat across multiple PDFs simultaneously)
- [ ] **Re-ranking** (cross-encoder reranking for better retrieval)
- [ ] **Hybrid search** (keyword + semantic fusion)

### Phase 3 — Advanced Features
- [ ] **OCR Support** (Tesseract for scanned/image-based PDFs)
- [ ] **Web search integration** (Tavily/Serper for augmented context)
- [ ] **Voice assistant** (Web Speech API + TTS)
- [ ] **AI-generated notes** (auto-summary and key points extraction)
- [ ] **Flashcard generation** (Anki-style flashcards from content)

### Phase 4 — Agentic Workflows
- [ ] **Research mode** (autonomous web + document agent)
- [ ] **Interview prep mode** (Q&A generation from document)
- [ ] **YouTube transcript ingestion**
- [ ] **Multi-user workspace/team support**
- [ ] **Zapier/Webhook integrations**

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes (conventional commits)
git commit -m "feat: add streaming response support"

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ by [Sanidhya Joshi](https://github.com/joshisanidhya)**

*A portfolio project demonstrating production-grade AI/full-stack engineering*

⭐ Star this repo if you found it useful!

</div>
