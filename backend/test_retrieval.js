require('dotenv').config();
const { processDocument, queryDocument } = require('./rag/ragPipeline');
const fs = require('fs');

async function main() {
  try {
    const vectorStoreId = 'test-doc-123';
    
    // Create a dummy PDF with text to test extraction and chunking
    // We'll mock extractTextFromPDF to avoid needing a real PDF
    const ragPipeline = require('./rag/ragPipeline');
    
    const dummyText = `
SAGE is an advanced AI system.
It utilizes Retrieval-Augmented Generation to fetch context from uploaded documents.
LangChain and HuggingFace provide the underlying embedding architecture.
MongoDB is used to store user conversations and document metadata.
Cosine similarity helps find the most relevant chunks.
    `;
    
    // Process document manually using the internals
    const chunks = await ragPipeline.chunkDocument(dummyText, { title: 'Test Doc' });
    console.log(`Created ${chunks.length} chunks.`);
    
    // Embed and store
    const { MemoryVectorStore } = require('langchain/vectorstores/memory');
    const embeddingService = require('./rag/embeddingService');
    const vectorStoreCache = require('./rag/ragPipeline').__vectorStoreCache; 
    // wait, vectorStoreCache is not exported. Let's mock it or just call createVectorStore if we can?
    // Let's modify ragPipeline.js locally or just use queryDocument after processDocument?
    // We can just use MemoryVectorStore directly to test similarities
    
    const vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddingService.getEmbeddings());
    
    console.log('Testing similarity search...');
    const results = await vectorStore.similaritySearchWithScore('What is the recipe for chocolate cake?', 4);
    
    console.log('Results:');
    results.forEach((res, i) => {
      console.log(`[${i}] Score: ${res[1]} | Content: ${res[0].pageContent}`);
    });
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

main();
