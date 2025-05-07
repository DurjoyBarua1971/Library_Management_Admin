import { BookLoan } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import BookLoanTableContent from './BookLoanTableContent';

interface BookLoanTableProps {
  loans: BookLoan[];
  loading: boolean;
  paginationMeta: { current_page: number; last_page: number; per_page: number; total: number };
  currentPage: number;
  setCurrentPage: (page: number) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  dueDateFilter: string | null;
  setDueDateFilter: (dueDate: string | null) => void;
}

const statusColors = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'pre-approved': { bg: 'bg-purple-100', text: 'text-purple-800' },
  approved: { bg: 'bg-green-100', text: 'text-green-800' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800' },
  returned: { bg: 'bg-blue-100', text: 'text-blue-800' },
};

const BookLoanTable = ({
  loans,
  loading,
  paginationMeta,
  currentPage,
  setCurrentPage,
  statusFilter,
  setStatusFilter,
  dueDateFilter,
  setDueDateFilter,
}: BookLoanTableProps) => {
  const getStatusBadge = (status: string) => {
    const colorConfig = statusColors[status as keyof typeof statusColors] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
    };
    return (
      <Badge className={`${colorConfig.bg} ${colorConfig.text} border-none uppercase`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={statusFilter || dueDateFilter || 'all'}
        onValueChange={(value) => {
          if (value === 'all') {
            setStatusFilter(null);
            setDueDateFilter(null);
          } else if (value === 'overdue') {
            setStatusFilter(null);
            setDueDateFilter('overdue');
          } 
          else if (value === 'today') {
            setStatusFilter(null);
            setDueDateFilter('today');
          }
          else {
            setStatusFilter(value);
            setDueDateFilter(null);
          }
          setCurrentPage(1);
        }}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="pre-approved">Pre-Approved</TabsTrigger>
          <TabsTrigger value="approved">Active</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="returned">Returned</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="pt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Returned</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <BookLoanTableContent
                  loans={loans}
                  loading={loading}
                  getStatusBadge={getStatusBadge}
                />
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="pt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <BookLoanTableContent
                  loans={loans}
                  loading={loading}
                  statusFilter="pending"
                />
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="pre-approved" className="pt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Approved</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <BookLoanTableContent
                  loans={loans}
                  loading={loading}
                  statusFilter="pre-approved"
                />
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="approved" className="pt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Approved</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <BookLoanTableContent
                  loans={loans}
                  loading={loading}
                  statusFilter="approved"
                />
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="overdue" className="pt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Days Overdue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <BookLoanTableContent
                  loans={loans}
                  loading={loading}
                  dueDateFilter="overdue"
                />
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="returned" className="pt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Borrowed</TableHead>
                  <TableHead>Returned</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <BookLoanTableContent
                  loans={loans}
                  loading={loading}
                  statusFilter="returned"
                />
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="pt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Rejected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <BookLoanTableContent
                  loans={loans}
                  loading={loading}
                  statusFilter="rejected"
                />
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

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
                className={
                  currentPage === paginationMeta.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default BookLoanTable;