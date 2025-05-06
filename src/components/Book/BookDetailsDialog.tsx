import { Book } from '@/types';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BookDetailsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  book: Book | null;
  isLoading: boolean;
}

const BookDetailsDialog = ({ isOpen, setIsOpen, book, isLoading }: BookDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Book Details</DialogTitle>
          <DialogDescription>Full details of the selected book.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-goodreads-purple mx-auto"></div>
            <p className="mt-4 text-lg text-muted-foreground">Loading book details...</p>
          </div>
        ) : book ? (
          <div className="space-y-4">
            <div>
              <Label className="font-bold">Title</Label>
              <p>{book.title}</p>
            </div>
            <div>
              <Label className="font-bold">Author</Label>
              <p>{book.author}</p>
            </div>
            <div>
              <Label className="font-bold">Category</Label>
              <p>{book.category}</p>
            </div>
            <div>
              <Label className="font-bold">Description</Label>
              <p>{book.description || 'No description available'}</p>
            </div>
            <div>
              <Label className="font-bold">PDF Version</Label>
              <p>
                {book.ebook ? (
                  <a
                    href={book.ebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View PDF
                  </a>
                ) : (
                  'Not available'
                )}
              </p>
            </div>
            <div>
              <Label className="font-bold">Physical Copy</Label>
              <p>{book.hasPhysical === 1 ? 'Available' : 'Not available'}</p>
            </div>
            <div>
              <Label className="font-bold">Quantity</Label>
              <p>{book.quantity ?? 0} {book.hasPhysical === 1 ? 'copies' : ''}</p>
            </div>
            <div>
              <Label className="font-bold">Created At</Label>
              <p>
                {book.createdAt
                  ? new Date(book.createdAt).toLocaleDateString()
                  : 'Unknown'}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No details available</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailsDialog;