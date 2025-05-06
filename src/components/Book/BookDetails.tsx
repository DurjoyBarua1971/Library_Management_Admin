import { Book } from "@/types";
import { Button } from "@/components/ui/button";
import { BookOpen, File, Star } from "lucide-react";

// Component to display book details
export const BookDetails = ({ book }: { book: Book }) => {
  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Book Details</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled
            onClick={() => console.log("Edit book (to be implemented)")}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            disabled
            onClick={() => console.log("Delete book (to be implemented)")}
          >
            Delete
          </Button>
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
              Physical {book.quantity ? `(${book.quantity} available)` : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
