import { BookLoan } from '@/types';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, Check, MoreHorizontal, RotateCcw, ThumbsDown, Truck } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface BookLoanTableContentProps {
  loans: BookLoan[];
  loading: boolean;
  statusFilter?: string;
  dueDateFilter?: string;
  getStatusBadge?: (status: string) => JSX.Element;
}

const BookLoanTableContent = ({
  loans,
  loading,
  statusFilter,
  dueDateFilter,
  getStatusBadge,
}: BookLoanTableContentProps) => {
  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-goodreads-purple mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading book loans...</p>
        </TableCell>
      </TableRow>
    );
  }

  if (loans.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="text-center py-8">
          <Calendar className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">No book loans found</p>
        </TableCell>
      </TableRow>
    );
  }

  return loans.map((loan) => {
    const handleApprove = () => {
      (window as any).handleApprove(loan.id);
    };
    const handleReject = () => {
      (window as any).handleReject(loan.id);
    };
    const handleDistribute = () => {
      (window as any).handleDistribute(loan.id);
    };
    const handleReturn = () => {
      (window as any).handleReturn(loan.id);
    };

    switch (statusFilter || dueDateFilter) {
      case 'pending':
        return (
          <TableRow key={loan.id}>
            <TableCell className="font-medium">{loan.book?.title}</TableCell>
            <TableCell>
              {loan.user?.name}
              <br />
              <span className="text-xs text-muted-foreground">{loan.user?.email}</span>
            </TableCell>
            <TableCell>{loan.requested_at ? format(new Date(loan.requested_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleApprove}>
                  <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button variant="outline" size="sm" onClick={handleReject}>
                  <ThumbsDown className="h-4 w-4 mr-1" /> Reject
                </Button>
              </div>
            </TableCell>
          </TableRow>
        );

      case 'pre-approved':
        return (
          <TableRow key={loan.id}>
            <TableCell className="font-medium">{loan.book?.title}</TableCell>
            <TableCell>
              {loan.user?.name}
              <br />
              <span className="text-xs text-muted-foreground">{loan.user?.email}</span>
            </TableCell>
            <TableCell>{loan.approved_at ? format(new Date(loan.approved_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleDistribute}>
                  <Truck className="h-4 w-4 mr-1" /> Distribute
                </Button>
              </div>
            </TableCell>
          </TableRow>
        );

      case 'approved':
        return (
          <TableRow key={loan.id}>
            <TableCell className="font-medium">{loan.book?.title}</TableCell>
            <TableCell>
              {loan.user?.name}
              <br />
              <span className="text-xs text-muted-foreground">{loan.user?.email}</span>
            </TableCell>
            <TableCell>{loan.approved_at ? format(new Date(loan.approved_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
            <TableCell>{loan.due_date ? format(new Date(loan.due_date), 'MMM d, yyyy') : 'N/A'}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleReturn}>
                  <RotateCcw className="h-4 w-4 mr-1" /> Return
                </Button>
              </div>
            </TableCell>
          </TableRow>
        );

      case 'overdue':
        return (
          <TableRow key={loan.id}>
            <TableCell className="font-medium">{loan.book?.title}</TableCell>
            <TableCell>
              {loan.user?.name}
              <br />
              <span className="text-xs text-muted-foreground">{loan.user?.email}</span>
            </TableCell>
            <TableCell>{loan.due_date ? format(new Date(loan.due_date), 'MMM d, yyyy') : 'N/A'}</TableCell>
            <TableCell>
              <span className="text-red-600 font-medium">
                {loan.due_date
                  ? `${differenceInDays(new Date(), new Date(loan.due_date))} days`
                  : 'N/A'}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleReturn}>
                  <RotateCcw className="h-4 w-4 mr-1" /> Return
                </Button>
              </div>
            </TableCell>
          </TableRow>
        );

      case 'returned':
        return (
          <TableRow key={loan.id}>
            <TableCell className="font-medium">{loan.book?.title}</TableCell>
            <TableCell>
              {loan.user?.name}
              <br />
              <span className="text-xs text-muted-foreground">{loan.user?.email}</span>
            </TableCell>
            <TableCell>{loan.approved_at ? format(new Date(loan.approved_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
            <TableCell>{loan.returned_at ? format(new Date(loan.returned_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
            <TableCell>
              {loan.approved_at && loan.returned_at
                ? `${differenceInDays(new Date(loan.returned_at), new Date(loan.approved_at))} days`
                : 'N/A'}
            </TableCell>
          </TableRow>
        );

      case 'rejected':
        return (
          <TableRow key={loan.id}>
            <TableCell className="font-medium">{loan.book?.title}</TableCell>
            <TableCell>
              {loan.user?.name}
              <br />
              <span className="text-xs text-muted-foreground">{loan.user?.email}</span>
            </TableCell>
            <TableCell>{loan.requested_at ? format(new Date(loan.requested_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
            <TableCell>{loan.approved_at ? format(new Date(loan.approved_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
          </TableRow>
        );

      default:
        return (
          <TableRow key={loan.id}>
            <TableCell className="font-medium">{loan.book?.title}</TableCell>
            <TableCell>
              {loan.user?.name}
              <br />
              <span className="text-xs text-muted-foreground">{loan.user?.email}</span>
            </TableCell>
            <TableCell>{getStatusBadge!(loan.status)}</TableCell>
            <TableCell>{loan.requested_at ? format(new Date(loan.requested_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
            <TableCell>{loan.due_date ? format(new Date(loan.due_date), 'MMM d, yyyy') : 'N/A'}</TableCell>
            <TableCell>{loan.returned_at ? format(new Date(loan.returned_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {loan.status === 'pending' && (
                    <>
                      <DropdownMenuItem onClick={handleApprove}>
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleReject}>
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        Reject
                      </DropdownMenuItem>
                    </>
                  )}
                  {loan.status === 'pre-approved' && (
                    <DropdownMenuItem onClick={handleDistribute}>
                      <Truck className="h-4 w-4 mr-2" />
                      Distribute
                    </DropdownMenuItem>
                  )}
                  {loan.status === 'approved' && (
                    <DropdownMenuItem onClick={handleReturn}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Return Book
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        );
    }
  });
};

export default BookLoanTableContent;