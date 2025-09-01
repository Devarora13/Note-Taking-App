import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { notesAPI, Note } from '../services/api';

interface NotesState {
  notes: Note[];
  isLoading: boolean;
}

interface NotesContextType extends NotesState {
  createNote: (title: string, content?: string) => Promise<{ success: boolean; message: string }>;
  deleteNote: (noteId: string) => Promise<{ success: boolean; message: string }>;
  updateNote: (noteId: string, title: string, content?: string) => Promise<{ success: boolean; message: string }>;
  loadNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, token, isAuthenticated } = useAuth();

  const loadNotes = useCallback(async (): Promise<void> => {
    if (!isAuthenticated || !token) {
      setNotes([]);
      return;
    }

    setIsLoading(true);
    try {
      const fetchedNotes = await notesAPI.getAllNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Failed to load notes:', error);
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  const createNote = async (title: string, content: string = ''): Promise<{ success: boolean; message: string }> => {
    if (!isAuthenticated || !user || !token) {
      return { success: false, message: 'Authentication required' };
    }

    setIsLoading(true);

    try {
      const newNote = await notesAPI.createNote({ title, content });
      setNotes(prev => [newNote, ...prev]);
      setIsLoading(false);
      return { success: true, message: 'Note created successfully!' };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: (error as Error).message };
    }
  };

  const deleteNote = async (noteId: string): Promise<{ success: boolean; message: string }> => {
    if (!isAuthenticated || !user || !token) {
      return { success: false, message: 'Authentication required' };
    }

    setIsLoading(true);

    try {
      await notesAPI.deleteNote(noteId);
      setNotes(prev => prev.filter(note => note._id !== noteId));
      setIsLoading(false);
      return { success: true, message: 'Note deleted successfully!' };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: (error as Error).message };
    }
  };

  const updateNote = async (noteId: string, title: string, content: string = ''): Promise<{ success: boolean; message: string }> => {
    if (!isAuthenticated || !user || !token) {
      return { success: false, message: 'Authentication required' };
    }

    setIsLoading(true);

    try {
      // Note: This would require an update endpoint in the backend
      // For now, we'll just update locally
      const updatedNote: Note = {
        _id: noteId,
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNotes(prev => prev.map(note => note._id === noteId ? updatedNote : note));
      setIsLoading(false);
      return { success: true, message: 'Note updated successfully!' };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: (error as Error).message };
    }
  };

  // Load notes when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotes();
    } else {
      setNotes([]);
    }
  }, [isAuthenticated, user, loadNotes]);

  const value: NotesContextType = {
    notes,
    isLoading,
    createNote,
    deleteNote,
    updateNote,
    loadNotes,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};
