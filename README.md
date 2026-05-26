<p align="center">
  <img src="./frontend/src/images/logo_sage.png" alt="SAGE Logo" width="180" />
</p>

<h1 align="center">SAGE</h1>
<h3 align="center">Semantic AI Generation Engine</h3>

<p align="center">
  <strong>An Intelligent Retrieval-Augmented Generation (RAG) Platform for Seamless Document Interaction.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/OpenRouter-000000?style=for-the-badge&logo=openai&logoColor=white" alt="OpenRouter" />
  <img src="https://img.shields.io/badge/LangChain-121212?style=for-the-badge&logo=chainlink&logoColor=white" alt="LangChain" />
</p>

<p align="center">
  <a href="#-about-sage">About</a> •
  <a href="#-features">Features</a> •
  <a href="#%EF%B8%8F-architecture--rag-pipeline">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation--setup">Installation</a> •
  <a href="#-deployment">Deployment</a>
</p>

<br />

## 🧠 About SAGE

**SAGE** (Semantic AI Generation Engine) is a production-grade, AI-powered knowledge assistant built to transform how users interact with dense documentation. By leveraging a state-of-the-art **Retrieval-Augmented Generation (RAG)** pipeline, SAGE enables users to upload PDF documents and instantly query them through a natural language interface. 

Instead of relying solely on baseline LLM knowledge, SAGE uses strict semantic retrieval algorithms to extract localized context from the uploaded documents, grounding its responses in truth and minimizing hallucinations.

Whether you're analyzing legal contracts, academic papers, or technical manuals, SAGE extracts the facts you need in seconds.

---

## ⚡ Features

- **Conversational AI Document Chat**: Speak naturally to your documents. Get precise, contextually aware answers in real-time.
- **Intelligent PDF Parsing & Chunking**: Automatic text extraction and semantic chunking with overlapping context boundaries to preserve meaning.
- **Local Semantic Embeddings**: Runs `sentence-transformers/all-MiniLM-L6-v2` locally via HuggingFace's `Xenova` transformers for blazing-fast, private, and highly accurate vectorization.
- **Retrieval-Augmented Generation (RAG)**: Dynamically injects context into LLM prompts to guarantee grounded, highly accurate answers.
- **Multi-Model LLM Support**: Seamlessly switch between OpenRouter (Mistral, Claude, GPT-4), standard OpenAI API, or local Ollama models.
- **Secure Authentication**: Fully fledged JWT-based user authentication and document ownership isolation.
- **Modern System UI**: A stunning, responsive frontend built with React, Vite, TailwindCSS, and Framer Motion for cinematic micro-interactions.

---

## 🧩 Architecture & RAG Pipeline

SAGE utilizes a highly optimized extraction-to-generation pipeline:

1. **Ingestion & Parsing**: PDFs are processed on the Node.js backend. Text is extracted and normalized.
2. **Semantic Chunking**: Using LangChain's `RecursiveCharacterTextSplitter`, text is sliced into optimal token windows (~1000 characters) with a 200-character overlap.
3. **Vector Embeddings**: Each chunk is passed through the local `all-MiniLM-L6-v2` model to generate 384-dimensional semantic vectors.
4. **Vector Storage**: Vectors are indexed in memory (or persistently via FAISS/ChromaDB) for hyper-fast retrieval.
5. **Similarity Search**: When a user asks a question, it is embedded, and a cosine-similarity search retrieves the Top-K most relevant chunks.
6. **Context Synthesis**: The context and conversational history are compiled into a strict system prompt.
7. **LLM Generation**: The prompt is processed via OpenRouter (or your preferred LLM provider) to generate a factual, grounded response.

---

## 📸 Platform Interface

> *Screenshots placeholder — Add your application screenshots here*

<details open>
<summary><b>Click to view Screenshots</b></summary>
<br/>

| Landing Page | Application Dashboard |
|:---:|:---:|
| `<img src="path/to/landing.png" width="400"/>` | `<img src="path/to/dashboard.png" width="400"/>` |

| PDF Upload Interface | Real-time AI Chat |
|:---:|:---:|
| `<img src="path/to/upload.png" width="400"/>` | `<img src="path/to/chat.png" width="400"/>` |

</details>

---

## 🛠️ Tech Stack

### Frontend Client
- **Core Framework**: React 18, Vite
- **Styling**: TailwindCSS, PostCSS
- **Animation**: Framer Motion
- **State & Routing**: React Router DOM

### Backend Services
- **Core API**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI / RAG Infrastructure**: LangChain JS
- **Embeddings**: `@xenova/transformers` (Local HuggingFace pipeline)
- **File Processing**: `pdf-parse`, `multer`
- **Security**: JWT, bcryptjs, Helmet, Express Rate Limit

---

## 📂 Project Structure

```text
sage/
├── backend/                  # Core API & RAG Engine
│   ├── config/               # Database & service configurations
│   ├── controllers/          # Route business logic (Chat, Docs, Auth)
│   ├── middleware/           # JWT, Upload limits, Error handling
│   ├── models/               # MongoDB Mongoose schemas
│   ├── rag/                  # Retrieval-Augmented Generation logic
│   │   ├── embeddingService.js # Local & Remote Embeddings
│   │   ├── llmService.js       # Multi-provider LLM interface
│   │   └── ragPipeline.js      # Core extraction & synthesis flow
│   ├── routes/               # Express API endpoints
│   └── utils/                # Winston logger & helpers
└── frontend/                 # Client Interface
    ├── public/               # Static assets
    └── src/                  # React Application
        ├── components/       # Reusable UI elements
        ├── pages/            # Application views (Dashboard, Chat)
        ├── images/           # Brand assets (logo, favicons)
        └── styles/           # Tailwind / Global CSS
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18.0 or higher)
- **MongoDB** (Local instance or MongoDB Atlas)
- **OpenRouter API Key** (or OpenAI/Ollama)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sage-ai-pdf-chatbot.git
cd sage-ai-pdf-chatbot
```

### 2. Backend Setup

Navigate to the backend directory, install dependencies, and configure the environment:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/sage

# Security
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# LLM Provider Configuration
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=mistralai/mistral-7b-instruct
```

Start the backend development server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, install dependencies, and configure the environment:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SAGE
```

Start the Vite development server:

```bash
npm run dev
```

The application will now be running on `http://localhost:5173`.

---

## 🌐 Deployment

SAGE is built with modern, cloud-native deployments in mind:

- **Frontend (Vercel)**:
  Connect the repository to Vercel, set the root directory to `frontend`, and configure the `VITE_API_URL` environment variable.
  
- **Backend (Render / Railway / Heroku)**:
  Deploy the backend directory to Render as a Web Service. Ensure that the Node startup command executes `node --dns-result-order=ipv4first server.js` to seamlessly support HuggingFace local model downloads.
  
- **Database (MongoDB Atlas)**:
  Provision a free cluster on MongoDB Atlas and update the `MONGODB_URI` environment variable on your backend host.

---

<p align="center">
  Built with precision and purpose. <br/>
  <b>SAGE</b> © 2026 
</p>
