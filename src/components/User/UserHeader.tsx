import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface UserHeaderProps {
  onAddUser: () => void;
}

const UserHeader = ({ onAddUser }: UserHeaderProps) => (
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-serif font-bold mb-2">Users</h1>
      <p className="text-muted-foreground">Manage system users</p>
    </div>
    <Button onClick={onAddUser}>
      <Plus className="h-4 w-4 mr-2" />
      Add User
    </Button>
  </div>
);

export default UserHeader;