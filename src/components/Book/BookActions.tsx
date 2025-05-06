import { Book } from '@/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

interface BookActionsProps {
  book: Book;
}

const BookActions = ({ book }: BookActionsProps) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleView}>
      <Eye className="h-4 w-4" />
    </Button>
  );
};

export default BookActions;