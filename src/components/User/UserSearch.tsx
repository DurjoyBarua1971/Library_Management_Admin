import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface UserSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const UserSearch = ({ searchQuery, setSearchQuery }: UserSearchProps) => (
  <div className="flex items-center gap-4">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search users..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  </div>
);

export default UserSearch;