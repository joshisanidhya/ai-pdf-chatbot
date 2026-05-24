/**
 * Document Context
 * Global state management for uploaded documents and active selection
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { documentService } from '../services/api';
import toast from 'react-hot-toast';

const initialState = {
  documents: [],
  activeDocument: null,
  isLoading: false,
  isUploading: false,
  uploadProgress: 0,
  pagination: { page: 1, total: 0, pages: 0 },
};

function docReducer(state, action) {
  switch (action.type) {
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload.documents, pagination: action.payload.pagination };
    case 'ADD_DOCUMENT':
      return { ...state, documents: [action.payload, ...state.documents] };
    case 'REMOVE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter((d) => d._id !== action.payload),
        activeDocument: state.activeDocument?._id === action.payload ? null : state.activeDocument,
      };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map((d) =>
          d._id === action.payload._id ? action.payload : d
        ),
      };
    case 'SET_ACTIVE':
      return { ...state, activeDocument: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_UPLOADING':
      return { ...state, isUploading: action.payload };
    case 'SET_UPLOAD_PROGRESS':
      return { ...state, uploadProgress: action.payload };
    default:
      return state;
  }
}

const DocumentContext = createContext(null);

export function DocumentProvider({ children }) {
  const [state, dispatch] = useReducer(docReducer, initialState);

  const fetchDocuments = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await documentService.getAll(params);
      dispatch({
        type: 'SET_DOCUMENTS',
        payload: {
          documents: res.data.documents,
          pagination: res.data.pagination,
        },
      });
    } catch (error) {
      toast.error('Failed to load documents');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const uploadDocument = useCallback(async (file, name) => {
    const formData = new FormData();
    formData.append('pdf', file);
    if (name) formData.append('name', name);

    dispatch({ type: 'SET_UPLOADING', payload: true });
    dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: 0 });

    const toastId = toast.loading('Processing your PDF...');

    try {
      const res = await documentService.upload(formData, (event) => {
        const progress = Math.round((event.loaded * 100) / event.total);
        dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: progress });
      });

      dispatch({ type: 'ADD_DOCUMENT', payload: res.data.document });
      dispatch({ type: 'SET_ACTIVE', payload: res.data.document });

      toast.success('Document ready! Start chatting.', { id: toastId });
      return res.data.document;
    } catch (error) {
      toast.error(error.message || 'Upload failed', { id: toastId });
      throw error;
    } finally {
      dispatch({ type: 'SET_UPLOADING', payload: false });
      dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: 0 });
    }
  }, []);

  const deleteDocument = useCallback(async (id) => {
    try {
      await documentService.delete(id);
      dispatch({ type: 'REMOVE_DOCUMENT', payload: id });
      toast.success('Document deleted');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  }, []);

  const setActiveDocument = useCallback((doc) => {
    dispatch({ type: 'SET_ACTIVE', payload: doc });
  }, []);

  return (
    <DocumentContext.Provider
      value={{
        ...state,
        fetchDocuments,
        uploadDocument,
        deleteDocument,
        setActiveDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) throw new Error('useDocuments must be used within DocumentProvider');
  return context;
};
