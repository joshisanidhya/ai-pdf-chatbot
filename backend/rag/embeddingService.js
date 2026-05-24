/**
 * Embedding Service
 * Provides HuggingFace embeddings via transformers.js or API
 * Supports local inference and API-based embedding generation
 */

const { HuggingFaceInferenceEmbeddings } = require('@langchain/community/embeddings/hf');
const logger = require('../utils/logger');

let embeddingInstance = null;

/**
 * Initialize and return embedding model (singleton)
 * Uses HuggingFace Inference API with all-MiniLM-L6-v2
 * - 384 dimensions, fast, high quality for semantic search
 */
function getEmbeddings() {
  if (embeddingInstance) return embeddingInstance;

  const model = process.env.EMBEDDING_MODEL || 'sentence-transformers/all-MiniLM-L6-v2';

  try {
    if (process.env.HUGGINGFACE_API_KEY) {
      // Use HuggingFace Inference API (recommended for production)
      embeddingInstance = new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HUGGINGFACE_API_KEY,
        model: model,
      });
      logger.info(`✅ Using HuggingFace API embeddings: ${model}`);
    } else {
      // Fallback to HuggingFace Inference without API key (rate limited)
      embeddingInstance = new HuggingFaceInferenceEmbeddings({
        model: model,
      });
      logger.warn('⚠️  Using HuggingFace without API key — rate limits apply');
    }
  } catch (error) {
    logger.error('Failed to initialize embeddings:', error.message);
    throw new Error('Embedding service initialization failed');
  }

  return embeddingInstance;
}

/**
 * Embed a single query string
 */
async function embedQuery(text) {
  const embeddings = getEmbeddings();
  return embeddings.embedQuery(text);
}

/**
 * Embed multiple documents
 */
async function embedDocuments(texts) {
  const embeddings = getEmbeddings();
  return embeddings.embedDocuments(texts);
}

module.exports = { getEmbeddings, embedQuery, embedDocuments };
