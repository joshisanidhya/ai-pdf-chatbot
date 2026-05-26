<div align="center">
  <img src="frontend/images/sage_logo.png" alt="SAGE Logo" width="120" />

  # SAGE
  **Semantic AI Generation Engine**

  *AI-Powered Semantic Document Intelligence Platform*

  <br />

  [![React](https://img.shields.io/badge/React-18-000000?style=flat&logo=react)](https://react.dev)
  [![Vite](https://img.shields.io/badge/Vite-5-000000?style=flat&logo=vite)](https://vitejs.dev)
  [![Node.js](https://img.shields.io/badge/Node.js-18-000000?style=flat&logo=node.js)](https://nodejs.org)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-000000?style=flat&logo=mongodb)](https://mongodb.com)
  [![LangChain](https://img.shields.io/badge/LangChain-Integration-000000?style=flat&logo=chainlink)](https://langchain.com)

</div>

---

SAGE is a production-grade Retrieval-Augmented Generation (RAG) platform. By combining precise vector search with advanced language models, SAGE allows users to upload PDF documents and engage in context-aware, semantic conversations grounded entirely in the provided documentation.

## Features

- **AI Document Chat** — Natural language queries routed directly against uploaded documentation.
- **Semantic Search** — Strict vector retrieval ensuring high-accuracy context extraction.
- **PDF Intelligence** — Automated parsing, cleaning, and formatting of dense PDF data.
- **RAG Pipeline** — Dynamic injection of localized context to eliminate LLM hallucination.
- **OpenRouter Integration** — Seamlessly leverage state-of-the-art models (Mistral, Claude, GPT-4).
- **Vector Retrieval** — Local embedding processing via `all-MiniLM-L6-v2` for blazing fast semantic mapping.
- **JWT Authentication** — Robust, isolated user sessions and secure document boundaries.
- **MongoDB Storage** — Persistent metadata, conversation history, and user management.
- **Modern UI** — Cinematic micro-interactions built with Framer Motion and Tailwind CSS.
- **Context-Aware Responses** — Intelligent synthesis of conversational history and semantic chunks.

## Architecture

```text
PDF Upload  →  Chunking  →  Embeddings  →  Vector Search  →  Context Retrieval  →  OpenRouter LLM  →  AI Response
```

## Stack

| Frontend | Backend | AI & Infrastructure |
| :--- | :--- | :--- |
| React | Node.js | LangChain |
| Vite | Express | OpenRouter |
| TailwindCSS | MongoDB | Embeddings (Xenova) |
| Framer Motion | JSON Web Tokens | RAG Pipeline |

## Interface

| Landing Page | Dashboard |
| :---: | :---: |
| <img src="docs/placeholder-landing.png" width="400" alt="Landing Page Placeholder" /> | <img src="docs/placeholder-dashboard.png" width="400" alt="Dashboard Placeholder" /> |

| PDF Upload | AI Chat Interface |
| :---: | :---: |
| <img src="docs/placeholder-upload.png" width="400" alt="Upload Placeholder" /> | <img src="docs/placeholder-chat.png" width="400" alt="Chat Placeholder" /> |

## Structure

```text
.
├── backend/
│   ├── config/            # Environment and database configuration
│   ├── controllers/       # Application logic and routing handlers
│   ├── models/            # Mongoose schemas (User, Document, Conversation)
│   ├── rag/               # Core extraction, embedding, and LLM synthesis
│   └── server.js          # Express application entry point
└── frontend/
    ├── public/            # Static assets
    └── src/
        ├── components/    # Reusable UI architecture
        ├── pages/         # Application views
        └── main.jsx       # React DOM entry point
```

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-username/sage.git
cd sage

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Environment Configuration

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sage
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_api_key
LLM_PROVIDER=openrouter
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Initialize

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

## Deployment

SAGE is structured for modern cloud-native deployment:

- **Frontend**: Optimized for Edge deployment via **Vercel**.
- **Backend**: Container-ready for seamless deployment on **Render** or Railway.
- **Database**: Native integration with **MongoDB Atlas** for scalable persistence.

---

<div align="center">
  Built with SAGE
</div>
