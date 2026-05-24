/**
 * Dashboard Page
 * Document grid overview with stats and upload CTA
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Upload, Brain, MessageSquare, Zap, Plus,
  Trash2, Clock, BarChart2, ArrowRight, Sparkles
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import UploadZone from '../components/upload/UploadZone';
import { useDocuments } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const StatusBadge = ({ status }) => {
  const config = {
    ready: { className: 'badge-success', label: 'Ready', dot: 'bg-emerald-400' },
    processing: { className: 'badge-warning', label: 'Processing...', dot: 'bg-amber-400' },
    failed: { className: 'badge-error', label: 'Failed', dot: 'bg-red-400' },
    uploading: { className: 'badge-info', label: 'Uploading', dot: 'bg-blue-400' },
  };
  const c = config[status] || config.uploading;
  return (
    <span className={c.className}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === 'processing' ? 'animate-pulse' : ''}`} />
      {c.label}
    </span>
  );
};

export default function DashboardPage() {
  const [showUpload, setShowUpload] = useState(false);
  const { documents, fetchDocuments, deleteDocument, setActiveDocument, isLoading } = useDocuments();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleChatClick = (doc) => {
    setActiveDocument(doc);
    navigate(`/chat/${doc._id}`);
  };

  const stats = [
    { label: 'Documents', value: documents.length, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Ready to Chat', value: documents.filter((d) => d.status === 'ready').length, icon: Brain, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Pages', value: documents.reduce((a, d) => a + (d.pageCount || 0), 0), icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Queries Made', value: documents.reduce((a, d) => a + (d.queryCount || 0), 0), icon: MessageSquare, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="flex h-screen bg-surface-950 overflow-hidden">
      <Sidebar onUploadClick={() => setShowUpload(true)} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <p className="text-slate-500 text-sm mb-1">Good morning 👋</p>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h1>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp} className="card">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Documents Section */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Your Documents</h2>
            <button
              id="dashboard-upload-btn"
              onClick={() => setShowUpload(true)}
              className="btn-primary text-sm"
            >
              <Plus className="w-4 h-4" />
              Upload PDF
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass rounded-2xl p-5 h-40">
                  <div className="shimmer rounded-lg h-6 w-3/4 mb-3" />
                  <div className="shimmer rounded-lg h-4 w-1/2 mb-2" />
                  <div className="shimmer rounded-lg h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-brand-500/10 flex items-center justify-center mb-5 animate-float">
                <Upload className="w-10 h-10 text-brand-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No documents yet</h3>
              <p className="text-slate-500 text-sm max-w-sm mb-6">
                Upload your first PDF to start chatting with it using AI-powered document intelligence.
              </p>
              <button
                onClick={() => setShowUpload(true)}
                className="btn-primary"
              >
                <Upload className="w-4 h-4" />
                Upload Your First PDF
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {documents.map((doc) => (
                <motion.div
                  key={doc._id}
                  variants={fadeInUp}
                  className="card group relative overflow-hidden hover:border-brand-500/20 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative">
                    {/* Icon & Status */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-400" />
                      </div>
                      <StatusBadge status={doc.status} />
                    </div>

                    {/* Name */}
                    <h3 className="font-semibold text-white text-sm mb-1 truncate pr-4">{doc.name}</h3>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                      {doc.pageCount > 0 && <span>{doc.pageCount} pages</span>}
                      {doc.wordCount > 0 && <span>~{(doc.wordCount / 1000).toFixed(1)}k words</span>}
                      <span>{(doc.fileSize / 1024).toFixed(0)}KB</span>
                    </div>

                    {/* Preview text */}
                    {doc.textPreview && (
                      <p className="text-xs text-slate-600 mb-4 line-clamp-2">{doc.textPreview}</p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleChatClick(doc)}
                        disabled={doc.status !== 'ready'}
                        className="btn-primary text-xs flex-1 py-2 disabled:opacity-40"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Chat
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteDocument(doc._id)}
                        className="btn-icon p-2 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Last queried */}
                    {doc.lastQueried && (
                      <div className="flex items-center gap-1 mt-3 text-xs text-slate-700">
                        <Clock className="w-3 h-3" />
                        Last queried: {new Date(doc.lastQueried).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && <UploadZone onClose={() => setShowUpload(false)} />}
      </AnimatePresence>
    </div>
  );
}
