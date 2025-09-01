import React, { useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { useNotes } from "../../contexts/NotesContext";
import { LogoWithName } from "../ui/logo";
import { CreateNoteModal } from "./CreateNoteModal";
import { NotesList } from "./NotesList";
import { Loader2, Plus, LogOut } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { notes, isLoading } = useNotes();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="md:border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <LogoWithName isLogoOnly />
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="text-primary hover:underline font-medium underline underline-offset-4"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Section */}
        <div className="mb-7 p-6 bg-card rounded-lg border border-border shadow-md text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground my-3">
            Welcome, {user.name}!
          </h1>
          <p className="text-muted-foreground my-3">Email: {user.email}</p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center gap-2 justify-self-center w-full sm:w-auto"
          size="lg"
        >
          Create Note
        </Button>

        {/* Notes Section */}
        <div className="space-y-6 mt-8">
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
