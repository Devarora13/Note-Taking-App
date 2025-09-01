import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useNotes, Note } from '../../contexts/NotesContext';
import { useToast } from '../../hooks/use-toast';
import { Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface NotesListProps {
  notes: Note[];
}

export const NotesList: React.FC<NotesListProps> = ({ notes }) => {
  const { deleteNote } = useNotes();
  const { toast } = useToast();

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
        <h3 className="text-lg font-medium text-foreground mb-2">No notes yet</h3>
        <p className="text-muted-foreground">
          Create your first note to get started organizing your thoughts.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Card key={note.id} className="note-card group">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
                {note.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteNote(note.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          {note.content && (
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm line-clamp-3">
                {note.content}
              </p>
            </CardContent>
          )}
          
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">
              Created {format(new Date(note.createdAt), 'MMM d, yyyy')}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};