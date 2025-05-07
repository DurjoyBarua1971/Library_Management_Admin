import { useEffect, useState } from 'react';
import { DueDateIncreaseRequest } from '@/types';
import { getDueDateIncreaseRequests, actionDueDateRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/lib/utils';
import {
  DueDateExtensionsHeader,
  DueDateExtensionsSearch,
  DueDateExtensionsTable,
} from '@/components/DueDateExtensions';

const DateExtension = () => {
  const [requests, setRequests] = useState<DueDateIncreaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const { toast } = useToast();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchDueDateIncreaseRequests = async () => {
    try {
      setLoading(true);
      const response = await getDueDateIncreaseRequests(
        currentPage,
        10,
        debouncedSearchQuery || undefined,
        statusFilter as 'pending' | 'approved' | 'rejected' | undefined
      );

      if (response) {
        setRequests(response.data);
        setPaginationMeta({
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          per_page: response.meta.per_page,
          total: response.meta.total,
        });
      }
    } catch (error) {
      console.error('Error fetching due date increase requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch due date increase requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueDateIncreaseRequests();
  }, [currentPage, debouncedSearchQuery, statusFilter]);

  const handleApprove = async (requestId: number) => {
    try {
      const response = await actionDueDateRequest(requestId, 'approved');
      if (response.message) {
        await fetchDueDateIncreaseRequests();
        toast({
          title: 'Success',
          description: 'Due date extension approved successfully',
        });
      }
    } catch (error) {
      console.error('Error approving due date extension:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve due date extension',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      const response = await actionDueDateRequest(requestId, 'rejected');
      if (response.message) {
        await fetchDueDateIncreaseRequests();
        toast({
          title: 'Success',
          description: 'Due date extension rejected successfully',
        });
      }
    } catch (error) {
      console.error('Error rejecting due date extension:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject due date extension',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <DueDateExtensionsHeader />
      <DueDateExtensionsSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <DueDateExtensionsTable
        requests={requests}
        loading={loading}
        paginationMeta={paginationMeta}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        handleApprove={handleApprove}
        handleReject={handleReject}
      />
    </div>
  );
};

export default DateExtension;