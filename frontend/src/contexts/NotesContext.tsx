import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

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

  const createNote = async (title: string, content: string = ''): Promise<{ success: boolean; message: string }> => {
    if (!isAuthenticated || !user || !token) {
      return { success: false, message: 'Authentication required' };
    }

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!title.trim()) {
        throw new Error('Note title is required');
      }

      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
      };

      // Store in localStorage (simulate database)
      const allNotes = JSON.parse(localStorage.getItem('notes') || '[]');
      allNotes.push(newNote);
      localStorage.setItem('notes', JSON.stringify(allNotes));

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Remove from localStorage
      const allNotes = JSON.parse(localStorage.getItem('notes') || '[]');
      const updatedNotes = allNotes.filter((note: Note) => note.id !== noteId || note.userId !== user.id);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));

      setNotes(prev => prev.filter(note => note.id !== noteId));
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));

      if (!title.trim()) {
        throw new Error('Note title is required');
      }

      // Find and update note
      const allNotes = JSON.parse(localStorage.getItem('notes') || '[]');
      const noteIndex = allNotes.findIndex((note: Note) => note.id === noteId && note.userId === user.id);
      
      if (noteIndex === -1) {
        throw new Error('Note not found');
      }

      const updatedNote: Note = {
        ...allNotes[noteIndex],
        title: title.trim(),
        content: content.trim(),
        updatedAt: new Date().toISOString(),
      };

      allNotes[noteIndex] = updatedNote;
      localStorage.setItem('notes', JSON.stringify(allNotes));

      setNotes(prev => prev.map(note => note.id === noteId ? updatedNote : note));
      setIsLoading(false);

      return { success: true, message: 'Note updated successfully!' };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: (error as Error).message };
    }
  };

  const loadNotes = async (): Promise<void> => {
    if (!isAuthenticated || !user) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Load user's notes from localStorage
      const allNotes = JSON.parse(localStorage.getItem('notes') || '[]');
      const userNotes = allNotes.filter((note: Note) => note.userId === user.id);

      setNotes(userNotes);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load notes:', error);
      setIsLoading(false);
    }
  };

  // Load notes when user authentication changes
  React.useEffect(() => {
    if (isAuthenticated && user) {
      loadNotes();
    } else {
      setNotes([]);
    }
  }, [isAuthenticated, user]);

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