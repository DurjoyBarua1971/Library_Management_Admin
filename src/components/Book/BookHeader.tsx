import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface BookHeaderProps {
  onAddBook: () => void;
}

const BookHeader = ({ onAddBook }: BookHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Books</h1>
        <p className="text-muted-foreground">Manage your library books</p>
      </div>
      <Button onClick={onAddBook}>
        <Plus className="h-4 w-4 mr-2" />
        Add Book
      </Button>
    </div>
  );
};

export default BookHeader;