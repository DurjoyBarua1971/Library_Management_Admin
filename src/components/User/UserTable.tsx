import { User } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Users as UsersIcon } from 'lucide-react';
import { format } from 'date-fns';

interface UserTableProps {
  users: User[];
  loading: boolean;
  paginationMeta: { current_page: number; last_page: number; per_page: number; total: number };
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const UserTable = ({
  users,
  loading,
  paginationMeta,
  currentPage,
  setCurrentPage,
}: UserTableProps) => (
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

export default UserTable;