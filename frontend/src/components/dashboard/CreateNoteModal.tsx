import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useNotes } from '../../contexts/NotesContext';
import { useToast } from '../../hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [error, setError] = useState('');
  const { createNote, isLoading } = useNotes();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Note title is required');
      return;
    }

    try {
      const result = await createNote(formData.title, formData.content);

      if (result.success) {
        toast({
          title: "Note created!",
          description: result.message,
        });
        setFormData({ title: '', content: '' });
        onClose();
      } else {
        setError(result.message);
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = "Failed to create note. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setFormData({ title: '', content: '' });
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-foreground">
              Note Title
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter note title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`form-input ${error ? 'border-destructive' : ''}`}
              autoFocus
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>

          <div>
            <Label htmlFor="content" className="text-sm font-medium text-foreground">
              Content (Optional)
            </Label>
            <Textarea
              id="content"
              placeholder="Add note content..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="form-input min-h-[100px] resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-primary"
              disabled={isLoading || !formData.title.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Note'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};