/**
 * Chat Page — Main RAG chat interface
 */

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { FileText } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import ChatInterface from '../components/chat/ChatInterface';
import UploadZone from '../components/upload/UploadZone';
import { useDocuments } from '../context/DocumentContext';
import { documentService } from '../services/api';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const { documentId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationId = searchParams.get('conv');

  const [showUpload, setShowUpload] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);

  const { documents, setActiveDocument, activeDocument } = useDocuments();

  // Load document if ID in URL
  useEffect(() => {
    if (documentId) {
      loadDocument(documentId);
    } else {
      setCurrentDocument(null);
    }
  }, [documentId]);

  const loadDocument = async (id) => {
    // Check if already in local state
    const localDoc = documents.find((d) => d._id === id);
    if (localDoc) {
      setCurrentDocument(localDoc);
      setActiveDocument(localDoc);
      return;
    }

    setIsLoadingDoc(true);
    try {
      const res = await documentService.getById(id);
      setCurrentDocument(res.data.document);
      setActiveDocument(res.data.document);
    } catch (error) {
      toast.error('Document not found');
    } finally {
      setIsLoadingDoc(false);
    }
  };

  const handleConversationCreate = (convId) => {
    setSearchParams({ conv: convId });
  };

  return (
    <div className="flex h-screen bg-surface-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar onUploadClick={() => setShowUpload(true)} />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isLoadingDoc ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
              <p className="text-slate-500 text-sm">Loading document...</p>
            </div>
          </div>
        ) : currentDocument ? (
          <ChatInterface
            document={currentDocument}
            conversationId={conversationId}
            onConversationCreate={handleConversationCreate}
          />
        ) : (
          /* No document selected — welcome screen */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 rounded-3xl bg-brand-500/10 flex items-center justify-center mx-auto mb-5 animate-float">
                <FileText className="w-10 h-10 text-brand-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Select a document</h2>
              <p className="text-slate-500 text-sm mb-6">
                Choose a document from the sidebar to start chatting, or upload a new PDF.
              </p>
              <button
                onClick={() => setShowUpload(true)}
                className="btn-primary"
              >
                Upload PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && <UploadZone onClose={() => setShowUpload(false)} />}
      </AnimatePresence>
    </div>
  );
}
