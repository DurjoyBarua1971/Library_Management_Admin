import { useEffect, useState } from 'react';
import { User, CreateUserPayload } from '@/types';
import { getUsers, createUser } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Users as UsersIcon } from 'lucide-react';
import { format } from 'date-fns';

import { FormMessage } from '@/components/ui/form';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useDebounce } from '@/lib/utils';

const UserHeader = ({ onAddUser }: { onAddUser: () => void }) => (
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

const UserSearch = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) => (
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

const UserTable = ({
  users,
  loading,
  paginationMeta,
  currentPage,
  setCurrentPage,
}: {
  users: User[];
  loading: boolean;
  paginationMeta: { current_page: number; last_page: number; per_page: number; total: number };
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) => (
  <div className="space-y-4">
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-goodreads-purple mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading users...</p>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <UsersIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No users found</p>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
    {paginationMeta.last_page > 1 && (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(currentPage - 1)}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          {Array.from({ length: paginationMeta.last_page }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setCurrentPage(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(currentPage + 1)}
              className={currentPage === paginationMeta.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )}
  </div>
);

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [userForm, setUserForm] = useState<CreateUserPayload>({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateUserPayload, string>>>({});

  const { toast } = useToast();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const resetForm = () => {
    setUserForm({ name: '', email: '', password: '', role: 'user' });
    setErrors({});
  };

  const isFormValid = (): boolean => {
    return (
      userForm.name.trim() &&
      userForm.email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email) &&
      userForm.role !== undefined
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateUserPayload, string>> = {};
    if (!userForm.name.trim()) newErrors.name = 'Name is required';
    if (!userForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!userForm.role) newErrors.role = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchUsers = async (page: number, perPage: number, search?: string) => {
    try {
      setLoading(true);
      const response = await getUsers(page, perPage, search);
      if (response.status === 'success') {
        setUsers(response.data);
        setPaginationMeta({
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          per_page: response.meta.per_page,
          total: response.meta.total,
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, 10, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const payload: CreateUserPayload = {
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        ...(userForm.password ? { password: userForm.password } : {}),
      };
      const response = await createUser(payload);
      if (response.user) {
        await fetchUsers(1, 10, debouncedSearchQuery);
        setCurrentPage(1);
        toast({
          title: 'Success',
          description: 'User created successfully',
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive',
      });
    }
  };

  const handleFieldChange = (field: keyof CreateUserPayload, value: string) => {
    setUserForm({ ...userForm, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-6">
      <UserHeader onAddUser={() => setIsDialogOpen(true)} />
      <UserSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <UserTable
        users={users}
        loading={loading}
        paginationMeta={paginationMeta}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Add a new user to the system.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={userForm.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="Enter user name"
              />
              {errors.name && <FormMessage>{errors.name}</FormMessage>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userForm.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="Enter email address"
              />
              {errors.email && <FormMessage>{errors.email}</FormMessage>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (optional)</Label>
              <Input
                id="password"
                type="password"
                value={userForm.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                placeholder="Enter password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={userForm.role}
                onValueChange={(value) => handleFieldChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <FormMessage>{errors.role}</FormMessage>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid()}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;