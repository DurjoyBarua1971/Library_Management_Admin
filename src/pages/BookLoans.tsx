import { useEffect, useState } from 'react';
import { BookLoan } from '@/types';
import { getBookLoans, approveBookLoan, rejectBookLoan, distributeBookLoan, returnBook } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/lib/utils';
import { BookLoanHeader, BookLoanSearch, BookLoanTable } from '@/components/BookLoan';

const BookLoans = () => {
  const [loans, setLoans] = useState<BookLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dueDateFilter, setDueDateFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const { toast } = useToast();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchBookLoans = async () => {
    try {
      setLoading(true);
      const response = await getBookLoans(
        currentPage,
        10,
        statusFilter || undefined,
        dueDateFilter || undefined,
        debouncedSearchQuery || undefined
      );

      if (response) {
        setLoans(response.data);
        setPaginationMeta({
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          per_page: response.meta.per_page,
          total: response.meta.total,
        });
      }
    } catch (error) {
      console.error('Error fetching book loans:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch book loans',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookLoans();
  }, [currentPage, statusFilter, dueDateFilter, debouncedSearchQuery]);

  const handleApprove = async (loanId: number) => {
    try {
      const response = await approveBookLoan(loanId);
      if (response.message !== undefined) {
        await fetchBookLoans();
        toast({
          title: 'Success',
          description: 'Book loan approved successfully',
        });
      }
    } catch (error) {
      console.error('Error approving book loan:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve book loan',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (loanId: number) => {
    try {
      const response = await rejectBookLoan(loanId);
      if (response.message !== undefined) {
        await fetchBookLoans();
        toast({
          title: 'Success',
          description: 'Book loan rejected successfully',
        });
      }
    } catch (error) {
      console.error('Error rejecting book loan:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject book loan',
        variant: 'destructive',
      });
    }
  };

  const handleDistribute = async (loanId: number) => {
    try {
      const response = await distributeBookLoan(loanId);
      if (response.message !== undefined) {
        await fetchBookLoans();
        toast({
          title: 'Success',
          description: 'Book loan distributed successfully',
        });
      }
    } catch (error) {
      console.error('Error distributing book loan:', error);
      toast({
        title: 'Error',
        description: 'Failed to distribute book loan',
        variant: 'destructive',
      });
    }
  };

  const handleReturn = async (loanId: number) => {
    try {
      const response = await returnBook(loanId);
      if (response.message !== undefined) {
        await fetchBookLoans();
        toast({
          title: 'Success',
          description: 'Book returned successfully',
        });
      }
    } catch (error) {
      console.error('Error processing book return:', error);
      toast({
        title: 'Error',
        description: 'Failed to process book return',
        variant: 'destructive',
      });
    }
  };

  // Expose handlers to window for BookLoanTableContent
  (window as any).handleApprove = handleApprove;
  (window as any).handleReject = handleReject;
  (window as any).handleDistribute = handleDistribute;
  (window as any).handleReturn = handleReturn;

  return (
    <div className="space-y-6">
      <BookLoanHeader />
      <BookLoanSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <BookLoanTable
        loans={loans}
        loading={loading}
        paginationMeta={paginationMeta}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dueDateFilter={dueDateFilter}
        setDueDateFilter={setDueDateFilter}
      />
    </div>
  );
};

export default BookLoans;