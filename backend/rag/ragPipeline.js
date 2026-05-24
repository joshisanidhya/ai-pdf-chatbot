/**
 * DocuMind AI — RAG Pipeline
 * ===========================
 * Core pipeline orchestrating the full RAG workflow:
 * PDF Loading → Chunking → Embedding → Vector Storage → Retrieval → LLM Generation
 *
 * Supports multiple LLM providers: OpenRouter, OpenAI, Ollama
 * Supports FAISS and ChromaDB vector stores
 */

const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { Document: LangchainDocument } = require('langchain/document');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const logger = require('../utils/logger');
const embeddingService = require('./embeddingService');
const llmService = require('./llmService');

// In-memory vector store map: { vectorStoreId → MemoryVectorStore }
// For production: use persistent ChromaDB or FAISS with disk persistence
const vectorStoreCache = new Map();

/**
 * ─────────────────────────────────────────────────────────────────
 * STEP 1: PDF Loading & Text Extraction
 * ─────────────────────────────────────────────────────────────────
 */
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    return {
      text: data.text,
      pageCount: data.numpages,
      metadata: {
        title: data.info?.Title || null,
        author: data.info?.Author || null,
        subject: data.info?.Subject || null,
        creator: data.info?.Creator || null,
        creationDate: data.info?.CreationDate || null,
      },
    };
  } catch (error) {
    logger.error('PDF extraction failed:', error.message);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * ─────────────────────────────────────────────────────────────────
 * STEP 2: Text Chunking Strategy
 * Uses recursive character splitting with semantic overlap
 * ─────────────────────────────────────────────────────────────────
 */
async function chunkDocument(text, documentMeta = {}) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,      // ~250 tokens per chunk
    chunkOverlap: 200,    // Overlap to preserve context across chunks
    separators: ['\n\n', '\n', '. ', ', ', ' ', ''], // Semantic separators
    keepSeparator: false,
  });

  const chunks = await splitter.createDocuments(
    [text],
    [{ ...documentMeta }]
  );

  // Enrich chunks with index metadata
  return chunks.map((chunk, index) => ({
    ...chunk,
    metadata: {
      ...chunk.metadata,
      chunkIndex: index,
      totalChunks: chunks.length,
    },
  }));
}

/**
 * ─────────────────────────────────────────────────────────────────
 * STEP 3 & 4: Generate Embeddings & Store in Vector DB
 * ─────────────────────────────────────────────────────────────────
 */
async function createVectorStore(chunks, vectorStoreId) {
  try {
    logger.info(`Creating vector store for ${chunks.length} chunks...`);

    const embeddings = embeddingService.getEmbeddings();

    // Use MemoryVectorStore for simplicity; swap for FAISS/Chroma in production
    const vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);

    // Cache the vector store by ID
    vectorStoreCache.set(vectorStoreId, vectorStore);

    logger.info(`✅ Vector store created: ${vectorStoreId}`);
    return vectorStore;
  } catch (error) {
    logger.error('Vector store creation failed:', error.message);
    throw new Error(`Embedding generation failed: ${error.message}`);
  }
}

/**
 * ─────────────────────────────────────────────────────────────────
 * STEP 5: Semantic Retrieval
 * Returns top-k most relevant chunks for a given query
 * ─────────────────────────────────────────────────────────────────
 */
async function retrieveRelevantChunks(query, vectorStoreId, topK = 4) {
  const vectorStore = vectorStoreCache.get(vectorStoreId);

  if (!vectorStore) {
    throw new Error(
      `Vector store not found for ID: ${vectorStoreId}. ` +
      'Please re-upload and reprocess the document.'
    );
  }

  // Similarity search with relevance score
  const results = await vectorStore.similaritySearchWithScore(query, topK);

  // Filter by minimum similarity threshold (cosine similarity > 0.3)
  const filtered = results
    .filter(([, score]) => score > 0.3)
    .map(([doc, score]) => ({
      content: doc.pageContent,
      metadata: doc.metadata,
      score: parseFloat(score.toFixed(4)),
    }));

  logger.info(`Retrieved ${filtered.length} relevant chunks for query`);
  return filtered;
}

/**
 * ─────────────────────────────────────────────────────────────────
 * STEP 6 & 7: Context Injection + LLM Answer Generation
 * ─────────────────────────────────────────────────────────────────
 */
async function generateAnswer(question, retrievedChunks, conversationHistory = []) {
  // Format source context from retrieved chunks
  const context = retrievedChunks
    .map((chunk, i) => `[Source ${i + 1}]\n${chunk.content}`)
    .join('\n\n---\n\n');

  // Format conversation history (last 6 exchanges for context window management)
  const historyText = conversationHistory
    .slice(-6)
    .map((msg) => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  // System prompt — instructs LLM to be grounded, cite sources, stay honest
  const systemPrompt = `You are DocuMind AI, an expert document analysis assistant. 
Your role is to provide accurate, insightful answers based ONLY on the provided document context.

Guidelines:
- Answer based strictly on the provided context chunks
- If the answer cannot be found in the context, clearly state: "I don't have enough information in this document to answer that."
- Reference source sections when relevant (e.g., "According to the document...")
- Be concise but comprehensive
- Format complex answers with proper markdown (headings, bullets, code blocks)
- Never hallucinate or make up information not in the context

Context from the document:
${context}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...(historyText ? [{ role: 'user', content: `Previous conversation:\n${historyText}` }] : []),
    { role: 'user', content: question },
  ];

  const startTime = Date.now();
  const answer = await llmService.generateResponse(messages);
  const responseTimeMs = Date.now() - startTime;

  return { answer, responseTimeMs };
}

/**
 * ─────────────────────────────────────────────────────────────────
 * MASTER PIPELINE: Full RAG Process for a New Document
 * ─────────────────────────────────────────────────────────────────
 */
async function processDocument(filePath, vectorStoreId, documentMeta = {}) {
  logger.info(`🔄 Starting RAG pipeline for: ${path.basename(filePath)}`);

  // Step 1: Extract text
  const { text, pageCount, metadata: pdfMeta } = await extractTextFromPDF(filePath);

  if (!text || text.trim().length < 100) {
    throw new Error('Could not extract sufficient text from PDF. The file may be image-based or corrupted.');
  }

  const wordCount = text.split(/\s+/).length;
  logger.info(`📄 Extracted: ${pageCount} pages, ~${wordCount} words`);

  // Step 2: Chunk the document
  const chunks = await chunkDocument(text, {
    ...documentMeta,
    ...pdfMeta,
    filePath,
  });
  logger.info(`✂️  Created ${chunks.length} chunks`);

  // Steps 3 & 4: Embed and store
  await createVectorStore(chunks, vectorStoreId);

  // Text preview (first 500 chars)
  const textPreview = text.slice(0, 500).trim();

  return {
    pageCount,
    wordCount,
    chunkCount: chunks.length,
    textPreview,
    pdfMeta,
  };
}

/**
 * ─────────────────────────────────────────────────────────────────
 * QUERY PIPELINE: Retrieve + Generate for a User Question
 * ─────────────────────────────────────────────────────────────────
 */
async function queryDocument(question, vectorStoreId, conversationHistory = []) {
  // Step 5: Retrieve relevant chunks
  const retrievedChunks = await retrieveRelevantChunks(question, vectorStoreId);

  if (retrievedChunks.length === 0) {
    return {
      answer: "I couldn't find relevant information in the document to answer your question. Try rephrasing or asking something else.",
      sources: [],
      responseTimeMs: 0,
    };
  }

  // Steps 6 & 7: Generate answer
  const { answer, responseTimeMs } = await generateAnswer(
    question,
    retrievedChunks,
    conversationHistory
  );

  return {
    answer,
    sources: retrievedChunks,
    responseTimeMs,
  };
}

/**
 * Remove vector store from cache (when document is deleted)
 */
function clearVectorStore(vectorStoreId) {
  vectorStoreCache.delete(vectorStoreId);
  logger.info(`🗑️  Cleared vector store: ${vectorStoreId}`);
}

/**
 * Restore vector store for a document on server restart
 * (Requires re-processing since MemoryVectorStore is not persistent)
 */
async function restoreVectorStore(filePath, vectorStoreId, documentMeta = {}) {
  if (vectorStoreCache.has(vectorStoreId)) {
    return; // Already in cache
  }

  if (!fs.existsSync(filePath)) {
    logger.warn(`File not found for restore: ${filePath}`);
    return;
  }

  await processDocument(filePath, vectorStoreId, documentMeta);
  logger.info(`♻️  Restored vector store: ${vectorStoreId}`);
}

module.exports = {
  processDocument,
  queryDocument,
  clearVectorStore,
  restoreVectorStore,
  extractTextFromPDF,
  chunkDocument,
};
