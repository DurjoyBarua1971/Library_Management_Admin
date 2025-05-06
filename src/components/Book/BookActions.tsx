import { Book } from '@/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

interface BookActionsProps {
  book: Book;
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: number) => Promise<boolean>;
  onViewBook: (id: number) => void;
  isDeleting: boolean;
}

const BookActions = ({ book, onViewBook }: BookActionsProps) => {
  const navigate = useNavigate();

  const handleView = () => {
    onViewBook(book.id);
    navigate(`/books/${book.id}`);
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleView}>
      <Eye className="h-4 w-4" />
    </Button>
  );
};

export default BookActions;