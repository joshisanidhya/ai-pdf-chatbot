/**
 * Embedding Service — SAGE
 * HuggingFace Inference API Embeddings with a guaranteed local fallback
 */

const { HuggingFaceInferenceEmbeddings } = require('@langchain/community/embeddings/hf');
const logger = require('../utils/logger');

/**
 * Custom lightweight local embedding fallback class
 * Implements standard LangChain Embeddings interface
 */
class SimpleLocalEmbeddings {
  constructor() {
    this.dimensions = 384;
  }

  /**
   * Word-frequency hashing vector generator
   * Maps words to index buckets and normalizes to L2 unit length
   */
  _embed(text) {
    const vector = new Array(this.dimensions).fill(0);
    if (!text || typeof text !== 'string') return vector;

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0);

    if (words.length === 0) return vector;

    // Hashing trick to map words to dimension indexes
    for (const word of words) {
      let hash = 5381;
      for (let i = 0; i < word.length; i++) {
        hash = ((hash << 5) + hash) + word.charCodeAt(i);
      }
      const index = Math.abs(hash) % this.dimensions;
      vector[index] += 1;
    }

    // L2 Normalize the vector
    let sumSq = 0;
    for (let i = 0; i < this.dimensions; i++) {
      sumSq += vector[i] * vector[i];
    }
    const norm = Math.sqrt(sumSq);
    if (norm > 0) {
      for (let i = 0; i < this.dimensions; i++) {
        vector[i] /= norm;
      }
    }

    return vector;
  }

  async embedQuery(text) {
    return this._embed(text);
  }

  async embedDocuments(documents) {
    return Promise.all(documents.map(doc => this.embedQuery(doc)));
  }
}

/**
 * SageEmbeddings wrapper orchestrator
 * Tries HuggingFace API, falls back to SimpleLocalEmbeddings on any failure
 */
class SageEmbeddings {
  constructor() {
    this.hfEmbeddings = null;
    this.localEmbeddings = new SimpleLocalEmbeddings();
    this.useLocalFallback = false;

    if (process.env.HUGGINGFACE_API_KEY) {
      try {
        this.hfEmbeddings = new HuggingFaceInferenceEmbeddings({
          apiKey: process.env.HUGGINGFACE_API_KEY,
          model: 'sentence-transformers/all-MiniLM-L6-v2',
        });
        logger.info('💡 SAGE Embeddings: HuggingFace inference initialized');
      } catch (error) {
        logger.warn(`⚠️ SAGE Embeddings: HuggingFace initialization failed (${error.message}). Using local fallback.`);
        this.useLocalFallback = true;
      }
    } else {
      logger.warn('⚠️ SAGE Embeddings: HUGGINGFACE_API_KEY not found. Using local fallback.');
      this.useLocalFallback = true;
    }
  }

  async embedQuery(text) {
    if (this.useLocalFallback || !this.hfEmbeddings) {
      return this.localEmbeddings.embedQuery(text);
    }
    try {
      return await this.hfEmbeddings.embedQuery(text);
    } catch (error) {
      logger.warn(`⚠️ SAGE Embeddings: HuggingFace embedQuery failed (${error.message}). Falling back to local embeddings.`);
      this.useLocalFallback = true;
      return this.localEmbeddings.embedQuery(text);
    }
  }

  async embedDocuments(documents) {
    if (this.useLocalFallback || !this.hfEmbeddings) {
      return this.localEmbeddings.embedDocuments(documents);
    }
    try {
      return await this.hfEmbeddings.embedDocuments(documents);
    } catch (error) {
      logger.warn(`⚠️ SAGE Embeddings: HuggingFace embedDocuments failed (${error.message}). Falling back to local embeddings.`);
      this.useLocalFallback = true;
      return this.localEmbeddings.embedDocuments(documents);
    }
  }
}

let embeddingInstance = null;

function getEmbeddings() {
  if (!embeddingInstance) {
    embeddingInstance = new SageEmbeddings();
  }
  return embeddingInstance;
}

async function embedQuery(text) {
  const embeddings = getEmbeddings();
  return embeddings.embedQuery(text);
}

async function embedDocuments(texts) {
  const embeddings = getEmbeddings();
  return embeddings.embedDocuments(texts);
}

module.exports = {
  getEmbeddings,
  embedQuery,
  embedDocuments,
};
