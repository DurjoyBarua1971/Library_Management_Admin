import { Book } from '@/types';
import { BookOpen } from 'lucide-react';
import BookCard from './BookCard';

interface BookGridViewProps {
  books: Book[];
  loading: boolean;
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: number) => Promise<boolean>;
  onViewBook: (id: number) => void;
  isDeleting: boolean;
}

const BookGridView = ({ books, loading, onEditBook, onDeleteBook, onViewBook, isDeleting }: BookGridViewProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-goodreads-purple mx-auto"></div>
        <p className="mt-4 text-lg text-muted-foreground">Loading books...</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="h-10 w-10 mx-auto text-muted-foreground" />
        <p className="mt-4 text-lg text-muted-foreground">No books found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onEditBook={onEditBook}
          onDeleteBook={onDeleteBook}
          onViewBook={onViewBook}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};

export default BookGridView;