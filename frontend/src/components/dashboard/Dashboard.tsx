import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotes } from '../../contexts/NotesContext';
import { LogoWithName } from '../ui/logo';
import { CreateNoteModal } from './CreateNoteModal';
import { NotesList } from './NotesList';
import { Loader2, Plus, LogOut } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { notes, isLoading } = useNotes();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <LogoWithName />
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Section */}
        <div className="mb-8 p-6 bg-card rounded-lg border border-border shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome, {user.name}!
          </h1>
          <p className="text-muted-foreground mb-6">
            Email: {user.email}
          </p>
          
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center gap-2"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Create Note
          </Button>
        </div>

        {/* Notes Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Notes</h2>
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>

          <NotesList notes={notes} />
        </div>
      </main>

      {/* Create Note Modal */}
      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};