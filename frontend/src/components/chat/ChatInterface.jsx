/**
 * Chat Interface — Core Component
 * Message display, input, AI response streaming effect, and source citations
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Send, Brain, User, Copy, ThumbsUp, ThumbsDown,
  ChevronDown, FileText, Zap, Sparkles, RotateCcw
} from 'lucide-react';
import { chatService } from '../../services/api';
import { useDocuments } from '../../context/DocumentContext';
import { conversationService } from '../../services/api';
import toast from 'react-hot-toast';

// ── Typing Indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 message-enter">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
        <Brain className="w-4 h-4 text-white" />
      </div>
      <div className="glass px-4 py-3.5 rounded-2xl rounded-bl-sm">
        <div className="flex items-center gap-1.5">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

// ── Source Citation Card ─────────────────────────────────────────────────────
function SourceCard({ source, index }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass rounded-xl overflow-hidden border border-white/5"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/[0.03] transition-colors text-left"
      >
        <FileText className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
        <span className="text-xs text-slate-400 flex-1 truncate">
          Source {index + 1} · {source.documentName}
          {source.pageNumber && ` · Page ${source.pageNumber}`}
        </span>
        <span className="text-xs text-slate-600 font-mono">
          {(source.score * 100).toFixed(0)}%
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/5"
          >
            <p className="text-xs text-slate-400 leading-relaxed p-3 font-mono">
              {source.content.slice(0, 400)}{source.content.length > 400 ? '...' : ''}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────────
function MessageBubble({ message, onFeedback }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
        isUser
          ? 'bg-gradient-to-br from-brand-500 to-purple-600'
          : 'bg-gradient-to-br from-emerald-500 to-teal-600'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Brain className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-3xl ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`glass px-4 py-3.5 ${
          isUser
            ? 'rounded-2xl rounded-br-sm bg-brand-600/20 border-brand-500/30'
            : 'rounded-2xl rounded-bl-sm'
        }`}>
          {isUser ? (
            <p className="text-sm text-slate-200 leading-relaxed">{message.content}</p>
          ) : (
            <div className="markdown-content text-sm">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="!bg-surface-900 !rounded-xl !text-sm"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={`${className} bg-white/10 px-1.5 py-0.5 rounded text-brand-300 font-mono text-xs`} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* AI message actions */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-2 px-1">
            {/* Response time */}
            {message.responseTimeMs && (
              <span className="text-xs text-slate-600 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {(message.responseTimeMs / 1000).toFixed(1)}s
              </span>
            )}

            <div className="flex items-center gap-1 ml-auto">
              {/* Copy */}
              <button
                onClick={copyToClipboard}
                className="btn-icon p-1.5"
                title="Copy response"
              >
                {copied ? (
                  <span className="text-emerald-400 text-xs">✓</span>
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
              {/* Thumbs */}
              <button
                onClick={() => onFeedback?.(message._id, 'thumbs_up')}
                className={`btn-icon p-1.5 ${message.feedback === 'thumbs_up' ? 'text-emerald-400' : ''}`}
              >
                <ThumbsUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => onFeedback?.(message._id, 'thumbs_down')}
                className={`btn-icon p-1.5 ${message.feedback === 'thumbs_down' ? 'text-red-400' : ''}`}
              >
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Source citations */}
        {!isUser && message.sources?.length > 0 && (
          <div className="mt-2 space-y-1 w-full">
            <p className="text-xs text-slate-600 px-1 mb-1.5 flex items-center gap-1">
              <FileText className="w-3 h-3" /> Sources used
            </p>
            {message.sources.slice(0, 3).map((source, i) => (
              <SourceCard key={i} source={source} index={i} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Suggested Questions ───────────────────────────────────────────────────────
const SUGGESTED_QUESTIONS = [
  'What are the main topics covered in this document?',
  'Summarize the key findings or conclusions.',
  'What are the most important points I should know?',
  'Are there any specific recommendations mentioned?',
];

// ── Main Chat Interface ───────────────────────────────────────────────────────
export default function ChatInterface({ document, conversationId, onConversationCreate }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeConvId, setActiveConvId] = useState(conversationId || null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load existing conversation
  useEffect(() => {
    if (conversationId && conversationId !== activeConvId) {
      setActiveConvId(conversationId);
      loadConversation(conversationId);
    } else if (!conversationId) {
      setMessages([]);
      setActiveConvId(null);
    }
  }, [conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadConversation = async (convId) => {
    try {
      const res = await conversationService.getById(convId);
      setMessages(res.data.conversation.messages || []);
    } catch (error) {
      toast.error('Failed to load conversation');
    }
  };

  const sendMessage = async (questionText) => {
    const question = questionText || input.trim();
    if (!question || isLoading || !document) return;

    setInput('');
    setIsLoading(true);

    // Optimistically add user message
    const userMessage = { role: 'user', content: question, _id: Date.now().toString() };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await chatService.sendMessage({
        question,
        documentId: document._id,
        conversationId: activeConvId,
      });

      const { conversationId: newConvId, answer, sources, responseTimeMs, messageId } = res.data;

      // Update conversation ID if new conversation was created
      if (!activeConvId) {
        setActiveConvId(newConvId);
        onConversationCreate?.(newConvId);
      }

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: answer,
          sources,
          responseTimeMs,
          _id: messageId,
        },
      ]);
    } catch (error) {
      toast.error(error.message || 'Failed to get response');
      // Remove optimistic user message on failure
      setMessages((prev) => prev.filter((m) => m._id !== userMessage._id));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleFeedback = async (messageId, feedback) => {
    if (!activeConvId) return;
    try {
      await chatService.submitFeedback({
        conversationId: activeConvId,
        messageId,
        feedback,
      });
      setMessages((prev) =>
        prev.map((m) => m._id === messageId ? { ...m, feedback } : m)
      );
      toast.success('Thanks for the feedback!');
    } catch {}
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Document Header ──────────────────────────── */}
      {document && (
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-surface-900/50 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
            <FileText className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-white text-sm truncate">{document.name}</h2>
            <p className="text-xs text-slate-500">
              {document.pageCount} pages · {document.chunkCount} chunks · Ready to chat
            </p>
          </div>
          <div className="badge-success">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Ready
          </div>
        </div>
      )}

      {/* ── Messages Area ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto chat-scroll px-6 py-6 space-y-6">
        {messages.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mb-4 shadow-brand animate-float">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {document ? `Consult SAGE on ${document.name}` : 'Select a Knowledge Base'}
            </h3>
            <p className="text-slate-400 text-sm max-w-md mb-8">
              {document
                ? 'Ask SAGE anything about your documents. Powered by semantic intelligence, SAGE scans the text and constructs precise, cited answers.'
                : 'Upload knowledge or select an existing knowledge base from the sidebar to begin.'}
            </p>

            {/* Suggested questions */}
            {document && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => sendMessage(q)}
                    className="text-left glass p-3.5 rounded-xl hover:bg-white/[0.06] border border-white/5 hover:border-brand-500/30 transition-all group text-xs text-slate-400 hover:text-slate-200"
                  >
                    <span className="text-brand-500 group-hover:text-brand-400 mr-1.5">→</span>
                    {q}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Render messages */}
        {messages.map((message, i) => (
          <MessageBubble
            key={message._id || i}
            message={message}
            onFeedback={handleFeedback}
          />
        ))}

        {/* Typing indicator */}
        {isLoading && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Area ──────────────────────────────── */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-white/5 bg-surface-900/30">
        <div className="flex items-end gap-3">
          <div className="flex-1 glass rounded-2xl border border-white/10 focus-within:border-brand-500/40 transition-all">
            <textarea
              ref={inputRef}
              id="chat-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={document ? 'Ask SAGE anything about your knowledge base...' : 'Select a knowledge base first'}
              disabled={!document || isLoading}
              rows={1}
              className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder-slate-600 resize-none focus:outline-none disabled:opacity-50 max-h-[150px]"
            />
          </div>
          <button
            id="send-message-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || !document || isLoading}
            className="btn-primary flex-shrink-0 h-12 w-12 p-0 rounded-xl"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-slate-700 text-center mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
