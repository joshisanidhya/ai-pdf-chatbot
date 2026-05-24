/**
 * Sidebar Component — DocuMind AI Dashboard
 * Navigation, document list, and conversation history
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, FileText, MessageSquare, Plus, Trash2, ChevronRight,
  LogOut, Settings, Menu, X, Upload, Clock, MoreVertical,
  Search, Home, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import { conversationService } from '../../services/api';
import toast from 'react-hot-toast';

export default function Sidebar({ onUploadClick }) {
  const { user, logout } = useAuth();
  const { documents, activeDocument, setActiveDocument, fetchDocuments, deleteDocument } = useDocuments();
  const [conversations, setConversations] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { documentId } = useParams();

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (activeDocument) {
      loadConversations(activeDocument._id);
    }
  }, [activeDocument]);

  const loadConversations = async (docId) => {
    try {
      const res = await conversationService.getAll({ documentId: docId, limit: 10 });
      setConversations(res.data.conversations);
    } catch {}
  };

  const handleDocumentSelect = (doc) => {
    setActiveDocument(doc);
    navigate(`/chat/${doc._id}`);
  };

  const handleDeleteDocument = async (e, docId) => {
    e.stopPropagation();
    if (confirm('Delete this document and all its conversations?')) {
      await deleteDocument(docId);
      if (activeDocument?._id === docId) {
        navigate('/dashboard');
      }
    }
  };

  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    try {
      await conversationService.delete(convId);
      setConversations((prev) => prev.filter((c) => c._id !== convId));
      toast.success('Conversation deleted');
    } catch {
      toast.error('Failed to delete conversation');
    }
  };

  const filteredDocs = documents.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'text-emerald-400';
      case 'processing': return 'text-amber-400 animate-pulse';
      case 'failed': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 64 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="h-screen flex flex-col glass border-r border-white/5 overflow-hidden flex-shrink-0"
    >
      {/* ── Header ──────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base">
                Docu<span className="text-brand-400">Mind</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="btn-icon ml-auto"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Upload Button ────────────────────────────── */}
      <div className="p-3">
        <button
          id="sidebar-upload-btn"
          onClick={onUploadClick}
          className={`w-full btn-primary gap-2 ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`}
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>Upload PDF</span>}
        </button>
      </div>

      {/* ── Search ──────────────────────────────────── */}
      {!isCollapsed && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-brand-500/40"
            />
          </div>
        </div>
      )}

      {/* ── Navigation ──────────────────────────────── */}
      {!isCollapsed && (
        <div className="px-3 pb-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
              location.pathname === '/dashboard'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      )}

      {/* ── Documents List ───────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {!isCollapsed && (
          <div className="px-3 py-2">
            <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold mb-2 px-2">
              Documents ({filteredDocs.length})
            </p>
            <div className="space-y-1">
              {filteredDocs.length === 0 && !documents.length && (
                <div className="text-center py-6">
                  <FileText className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-slate-600 text-xs">No documents yet</p>
                  <p className="text-slate-700 text-xs mt-1">Upload a PDF to start</p>
                </div>
              )}
              {filteredDocs.map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => handleDocumentSelect(doc)}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    activeDocument?._id === doc._id
                      ? 'bg-brand-500/15 border border-brand-500/20'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <FileText className={`w-4 h-4 flex-shrink-0 ${getStatusColor(doc.status)}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${
                      activeDocument?._id === doc._id ? 'text-brand-300' : 'text-slate-300'
                    }`}>
                      {doc.name}
                    </p>
                    <p className="text-xs text-slate-600 truncate">
                      {doc.pageCount > 0 ? `${doc.pageCount}p · ` : ''}{(doc.fileSize / 1024).toFixed(0)}KB
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteDocument(e, doc._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-slate-600 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Recent Conversations ─────────────────── */}
        {!isCollapsed && activeDocument && conversations.length > 0 && (
          <div className="px-3 py-2">
            <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold mb-2 px-2">
              Recent Chats
            </p>
            <div className="space-y-1">
              {conversations.map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => navigate(`/chat/${activeDocument._id}?conv=${conv._id}`)}
                  className="group flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                  <p className="text-xs text-slate-400 truncate flex-1">{conv.title}</p>
                  <button
                    onClick={(e) => handleDeleteConversation(e, conv._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-slate-600 transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── User Profile Footer ──────────────────────── */}
      <div className="p-3 border-t border-white/5">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="btn-icon p-1.5"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button onClick={logout} className="btn-icon p-1.5">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
