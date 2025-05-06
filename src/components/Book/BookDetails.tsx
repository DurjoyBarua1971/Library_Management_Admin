import { Book } from "@/types";
import { Button } from "@/components/ui/button";
import { BookOpen, File } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

// Component to display book details
export const BookDetails = ({
  book,
  onEdit,
  onDelete,
}: {
  book: Book;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const canDelete = book.bookLoans.length === 0;

  const handleDelete = async () => {
    await onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Book Details</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={!canDelete}>
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the book from the library.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="space-y-2">
        <p>
          <strong>Author:</strong> {book.author}
        </p>
        <p>
          <strong>Category:</strong> {book.category}
        </p>
        {book.description && (
          <p>
            <strong>Description:</strong> {book.description}
          </p>
        )}
        <p>
          <strong>Formats:</strong>
        </p>
        <div className="flex items-center gap-2">
          {book.ebook && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-accent text-accent-foreground rounded">
              <File className="h-3 w-3 mr-1" />
              PDF
            </span>
          )}
          {book.hasPhysical === 1 && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-accent text-accent-foreground rounded">
              <BookOpen className="h-3 w-3 mr-1" />
              Physical {book.quantity ? `(${book.quantity} available)` : ""}{" "}
              {book.bookLoans.length > 0 ? `(${book.bookLoans.length} loans)` : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};