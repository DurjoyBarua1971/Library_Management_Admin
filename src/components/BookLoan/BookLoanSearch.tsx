import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface BookLoanSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const BookLoanSearch = ({ searchQuery, setSearchQuery }: BookLoanSearchProps) => (
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Search loans by book title..."
      className="pl-10"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
);

export default BookLoanSearch;