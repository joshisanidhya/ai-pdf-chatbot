/**
 * LLM Service
 * Multi-provider LLM abstraction layer
 * Supports: OpenRouter, OpenAI, Ollama
 *
 * This service provides a unified interface for text generation
 * regardless of the underlying LLM provider.
 */

const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Generate a response from the configured LLM provider
 * @param {Array} messages - Array of {role, content} message objects
 * @returns {Promise<string>} - Generated text response
 */
async function generateResponse(messages) {
  const provider = process.env.LLM_PROVIDER || 'openrouter';

  logger.info(`🤖 Generating response via: ${provider}`);

  switch (provider) {
    case 'openrouter':
      return generateWithOpenRouter(messages);
    case 'openai':
      return generateWithOpenAI(messages);
    case 'ollama':
      return generateWithOllama(messages);
    default:
      throw new Error(`Unknown LLM provider: ${provider}`);
  }
}

/**
 * ── OpenRouter Provider ──────────────────────────────────────────
 * Access to 200+ models (Mistral, Llama, Claude, GPT-4, etc.)
 * Cost-effective with generous free tier
 */
async function generateWithOpenRouter(messages) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not configured');

  const model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3-8b-instruct:free';
  const baseURL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

  try {
    const response = await axios.post(
      `${baseURL}/chat/completions`,
      {
        model,
        messages,
        temperature: 0.3,         // Low temp for factual, grounded answers
        max_tokens: 1500,
        top_p: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://sage-ai.vercel.app',
          'X-Title': 'SAGE',
        },
        timeout: 60000, // 60s timeout
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    if (error.response) {
      logger.error('OpenRouter API Error:', error.response.data);
      throw new Error(`OpenRouter API failed: ${error.response.data.error?.message || error.message}`);
    }
    throw error;
  }
}

/**
 * ── OpenAI Provider ──────────────────────────────────────────────
 * Direct OpenAI API access (GPT-4, GPT-3.5-turbo)
 */
async function generateWithOpenAI(messages) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model,
      messages,
      temperature: 0.3,
      max_tokens: 1500,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    }
  );

  return response.data.choices[0].message.content;
}

/**
 * ── Ollama Provider ──────────────────────────────────────────────
 * Local LLM inference via Ollama (completely free, private)
 * Run: ollama pull llama3.2
 */
async function generateWithOllama(messages) {
  const baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3.2';

  // Convert chat messages to a single prompt for Ollama
  const prompt = messages
    .map((m) => {
      if (m.role === 'system') return `System: ${m.content}`;
      if (m.role === 'user') return `Human: ${m.content}`;
      return `Assistant: ${m.content}`;
    })
    .join('\n\n') + '\n\nAssistant:';

  const response = await axios.post(
    `${baseURL}/api/generate`,
    {
      model,
      prompt,
      stream: false,
      options: {
        temperature: 0.3,
        num_predict: 1500,
      },
    },
    { timeout: 120000 } // 2 min for local models
  );

  return response.data.response;
}

module.exports = { generateResponse };
