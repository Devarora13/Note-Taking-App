import React, { useState } from "react";
import { Button } from "../ui/button";
import { useNotes } from "../../contexts/NotesContext";
import { Note } from "../../services/api";
import { useToast } from "../../hooks/use-toast";
import { Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

interface NotesListProps {
  notes: Note[];
}

export const NotesList: React.FC<NotesListProps> = ({ notes }) => {
  const { deleteNote } = useNotes();
  const { toast } = useToast();
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  const toggleExpanded = (noteId: string) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const result = await deleteNote(noteId);
      if (result.success) {
        toast({
          title: "Note deleted",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <Calendar className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No notes yet
        </h3>
        <p className="text-muted-foreground">
          Create your first note to get started organizing your thoughts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => {
        const isExpanded = expandedNotes.has(note._id);
        
        return (
          <div
            key={note._id}
            className="bg-card rounded-lg border border-border shadow-md hover:shadow-lg transition-all duration-200"
          >
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer"
              onClick={() => toggleExpanded(note._id)}
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-medium text-foreground truncate">
                  {note.title}
                </h4>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the expand/collapse
                  handleDeleteNote(note._id);
                }}
                className="flex-shrink-0 ml-3 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {isExpanded && note.content && (
              <div className="px-4 pb-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
