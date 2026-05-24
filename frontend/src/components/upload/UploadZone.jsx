/**
 * PDF Upload Component
 * Drag & drop with progress indicator and animation
 */

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import { useNavigate } from 'react-router-dom';

export default function UploadZone({ onClose }) {
  const { uploadDocument, isUploading, uploadProgress } = useDocuments();
  const [selectedFile, setSelectedFile] = useState(null);
  const [docName, setDocName] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        alert('File is too large. Maximum size is 50MB.');
      } else {
        alert('Only PDF files are accepted.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      // Auto-set name from filename
      setDocName(file.name.replace('.pdf', ''));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      const doc = await uploadDocument(selectedFile, docName);
      navigate(`/chat/${doc._id}`);
      onClose?.();
    } catch (error) {
      // Error handled by context
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setDocName('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass-strong rounded-2xl w-full max-w-lg shadow-dark-lg border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
              <Upload className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-sm">Upload PDF Document</h2>
              <p className="text-xs text-slate-500">Max 50MB · PDF only</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Drop Zone */}
          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-brand-400 bg-brand-500/10 drop-zone-active'
                  : 'border-white/10 hover:border-brand-500/40 hover:bg-white/[0.02]'
              }`}
            >
              <input {...getInputProps()} />

              <motion.div
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                  isDragActive ? 'bg-brand-500/30' : 'bg-white/5'
                }`}>
                  {isDragActive ? (
                    <Sparkles className="w-8 h-8 text-brand-400" />
                  ) : (
                    <Upload className="w-8 h-8 text-slate-500" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {isDragActive ? 'Drop it here!' : 'Drag & drop your PDF'}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    or <span className="text-brand-400 underline">click to browse</span>
                  </p>
                </div>
              </motion.div>
            </div>
          ) : (
            /* Selected File Preview */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 glass rounded-xl p-4"
            >
              <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-slate-500 text-xs">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              {!isUploading && (
                <button onClick={handleRemoveFile} className="btn-icon">
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          )}

          {/* Document Name Input */}
          {selectedFile && !isUploading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="input-label">Document Name</label>
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                className="input"
                placeholder="My Research Paper"
              />
            </motion.div>
          )}

          {/* Upload Progress */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-brand-500/40 border-t-brand-500 rounded-full animate-spin" />
                    {uploadProgress < 100 ? 'Uploading...' : 'Processing with AI...'}
                  </span>
                  <span className="text-brand-400 font-medium">{uploadProgress}%</span>
                </div>

                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-600 to-purple-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {uploadProgress === 100 && (
                  <div className="text-center space-y-1">
                    <p className="text-xs text-slate-400">Extracting text and generating embeddings...</p>
                    <p className="text-xs text-slate-600">This may take a moment for large documents</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          {!isUploading && (
            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                id="upload-confirm-btn"
                onClick={handleUpload}
                disabled={!selectedFile}
                className="btn-primary flex-1"
              >
                <Upload className="w-4 h-4" />
                Process PDF
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
