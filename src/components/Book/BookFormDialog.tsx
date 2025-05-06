import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BookForm {
  title: string;
  author: string;
  description: string;
  category: string;
  ebook: string;
  hasPhysical: number;
  quantity: number;
}

interface BookFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isEditMode: boolean;
  isEditLoading: boolean;
  isSubmitting: boolean;
  bookForm: BookForm;
  setBookForm: (form: BookForm) => void;
  onSubmit: () => void;
}

const BookFormDialog = ({
  isOpen,
  setIsOpen,
  isEditMode,
  isEditLoading,
  isSubmitting,
  bookForm,
  setBookForm,
  onSubmit,
}: BookFormDialogProps) => {
  const [hasEbook, setHasEbook] = useState(!!bookForm.ebook);

  useEffect(() => {
    setHasEbook(!!bookForm.ebook);
  }, [bookForm.ebook, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the book details in the library catalog.'
              : 'Add a new book to the library catalog.'}
          </DialogDescription>
        </DialogHeader>
        {isEditLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-goodreads-purple mx-auto"></div>
            <p className="mt-4 text-lg text-muted-foreground">Loading book details...</p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={bookForm.title}
                onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                placeholder="Enter book title"
                disabled={isEditLoading || isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={bookForm.author}
                onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                placeholder="Enter author name"
                disabled={isEditLoading || isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={bookForm.category}
                onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                placeholder="Enter category (e.g., Fiction)"
                disabled={isEditLoading || isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={bookForm.description}
                onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                placeholder="Enter book description"
                disabled={isEditLoading || isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label>Book Format</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ebook"
                    checked={hasEbook}
                    onCheckedChange={(checked) => {
                      setHasEbook(checked as boolean);
                      setBookForm({
                        ...bookForm,
                        ebook: checked ? bookForm.ebook || '' : '',
                      });
                    }}
                    disabled={isEditLoading || isSubmitting}
                  />
                  <Label htmlFor="ebook" className="cursor-pointer">
                    PDF version
                  </Label>
                </div>
                {hasEbook && (
                  <div className="space-y-2">
                    <Label htmlFor="ebook_url">PDF URL</Label>
                    <Input
                      id="ebook_url"
                      value={bookForm.ebook}
                      onChange={(e) => setBookForm({ ...bookForm, ebook: e.target.value })}
                      placeholder="Enter PDF URL"
                      disabled={isEditLoading || isSubmitting}
                    />
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasPhysical"
                    checked={bookForm.hasPhysical === 1}
                    onCheckedChange={(checked) =>
                      setBookForm({
                        ...bookForm,
                        hasPhysical: checked ? 1 : 0,
                        quantity: checked ? bookForm.quantity : 0,
                      })
                    }
                    disabled={isEditLoading || isSubmitting}
                  />
                  <Label htmlFor="hasPhysical" className="cursor-pointer">
                    Physical copy
                  </Label>
                </div>
                {bookForm.hasPhysical === 1 && (
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      value={bookForm.quantity}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, quantity: parseInt(e.target.value) || 0 })
                      }
                      placeholder="Enter quantity"
                      disabled={isEditLoading || isSubmitting}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isEditLoading || isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isEditLoading || isSubmitting}>
            {isEditMode ? 'Update Book' : 'Add Book'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookFormDialog;