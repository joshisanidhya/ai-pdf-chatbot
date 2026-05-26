require('dotenv').config();
const { processDocument, queryDocument } = require('./rag/ragPipeline');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const embeddingService = require('./rag/embeddingService');
    const embeddings = embeddingService.getEmbeddings();
    console.log('Testing embeddings...');
    const result = await embeddings.embedQuery('What is SAGE?');
    console.log('Embed query successful. Dimension:', result.length);
    
    // Test document embedding
    const docs = ['SAGE is a powerful AI.', 'RAG is cool.'];
    const results = await embeddings.embedDocuments(docs);
    console.log('Embed documents successful. Result length:', results.length, 'Dimension:', results[0].length);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

main();
