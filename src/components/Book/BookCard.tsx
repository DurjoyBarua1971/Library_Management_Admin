import { Book } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, File } from 'lucide-react';
import BookActions from './BookActions';

interface BookCardProps {
  book: Book;
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: number) => Promise<boolean>;
  onViewBook: (id: number) => void;
  isDeleting: boolean;
}

const BookCard = ({ book, onEditBook, onDeleteBook, onViewBook, isDeleting }: BookCardProps) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="aspect-[3/4] bg-muted relative">
        <div className="w-full h-full flex items-center justify-center bg-accent">
          <BookOpen className="h-12 w-12 text-muted-foreground" />
        </div>
      </div>
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold truncate">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
          <BookActions
            book={book}
            onEditBook={onEditBook}
            onDeleteBook={onDeleteBook}
            onViewBook={onViewBook}
            isDeleting={isDeleting}
          />
        </div>
        <p className="text-xs mt-2 line-clamp-3">{book.description}</p>
        <div className="flex items-center gap-2 mt-auto pt-3">
          {book.ebook && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-accent text-accent-foreground rounded">
              <File className="h-3 w-3 mr-1" />
              PDF
            </span>
          )}
          {book.hasPhysical === 1 && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-accent text-accent-foreground rounded">
              <BookOpen className="h-3 w-3 mr-1" />
              Physical
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;