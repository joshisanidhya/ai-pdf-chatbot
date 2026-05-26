/**
 * Embedding Service — SAGE
 * Uses @xenova/transformers for stable, high-quality local semantic embeddings.
 * Fallback to HuggingFace Inference API if configured.
 */

const { HuggingFaceInferenceEmbeddings } = require('@langchain/community/embeddings/hf');
const logger = require('../utils/logger');

class LocalTransformersEmbeddings {
  constructor() {
    this.modelName = 'Xenova/all-MiniLM-L6-v2';
    // Initialize pipeline asynchronously using dynamic import
    this.pipelinePromise = (async () => {
      const { pipeline } = await import('@xenova/transformers');
      return pipeline('feature-extraction', this.modelName);
    })();
  }

  async embedQuery(text) {
    try {
      const extractor = await this.pipelinePromise;
      const output = await extractor(text, { pooling: 'mean', normalize: true });
      return Array.from(output.data);
    } catch (error) {
      logger.error('Local embedQuery failed:', error);
      throw error;
    }
  }

  async embedDocuments(documents) {
    try {
      const extractor = await this.pipelinePromise;
      const embeddings = [];
      logger.info(`Generating embeddings for ${documents.length} chunks locally...`);
      for (const doc of documents) {
        const output = await extractor(doc, { pooling: 'mean', normalize: true });
        embeddings.push(Array.from(output.data));
      }
      logger.info(`Successfully generated embeddings of dimension ${embeddings[0].length}`);
      return embeddings;
    } catch (error) {
      logger.error('Local embedDocuments failed:', error);
      throw error;
    }
  }
}

class SageEmbeddings {
  constructor() {
    this.localEmbeddings = new LocalTransformersEmbeddings();
    logger.info('💡 SAGE Embeddings: Xenova local transformer initialized (sentence-transformers/all-MiniLM-L6-v2)');
  }

  async embedQuery(text) {
    return await this.localEmbeddings.embedQuery(text);
  }

  async embedDocuments(documents) {
    return await this.localEmbeddings.embedDocuments(documents);
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
