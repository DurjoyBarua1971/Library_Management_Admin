
import { useEffect, useState } from 'react';
import { BookLoan } from '@/types';
import { getBookLoans, approveBookLoan, rejectBookLoan } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Search, ThumbsDown, ThumbsUp } from 'lucide-react';
import { format, addDays } from 'date-fns';

const BookRequests = () => {
  const [requests, setRequests] = useState<BookLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BookLoan | null>(null);
  const [dueDate, setDueDate] = useState('');
  
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        setLoading(true);
        const response = await getBookLoans('pending');
        
        if (response.status === 'success') {
          setRequests(response.data);
        }
      } catch (error) {
        console.error('Error fetching book requests:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch book requests',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingRequests();
  }, [toast]);
  
  const openApproveDialog = (request: BookLoan) => {
    setSelectedRequest(request);
    // Set default due date to 2 weeks from today
    setDueDate(format(addDays(new Date(), 14), 'yyyy-MM-dd'));
    setIsDialogOpen(true);
  };
  
  const handleApprove = async () => {
    if (!selectedRequest) return;
    
    try {
      const response = await approveBookLoan(selectedRequest.id, dueDate);
      
      if (response.status === 'success') {
        // Remove the approved request from the list
        setRequests(requests.filter(req => req.id !== selectedRequest.id));
        
        toast({
          title: 'Success',
          description: 'Book request approved successfully',
        });
        
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve request',
        variant: 'destructive',
      });
    }
  };
  
  const handleReject = async (requestId: number) => {
    try {
      const response = await rejectBookLoan(requestId);
      
      if (response.status === 'success') {
        // Remove the rejected request from the list
        setRequests(requests.filter(req => req.id !== requestId));
        
        toast({
          title: 'Success',
          description: 'Book request rejected successfully',
        });
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject request',
        variant: 'destructive',
      });
    }
  };
  
  const filteredRequests = requests.filter(request => {
    const bookTitle = request.book?.title?.toLowerCase() || '';
    const userName = request.user?.name?.toLowerCase() || '';
    const userEmail = request.user?.email?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return bookTitle.includes(query) || userName.includes(query) || userEmail.includes(query);
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Book Requests</h1>
        <p className="text-muted-foreground">Manage pending book borrowing requests</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-goodreads-purple mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading book requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-8 bg-card rounded-lg border border-border p-8">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-lg text-muted-foreground">No pending requests</p>
          <p className="text-sm text-muted-foreground">All book requests have been handled</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <CardTitle>{request.book?.title}</CardTitle>
                <CardDescription>
                  {request.book?.author}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">Requested by:</span>
                  <p>{request.user?.name}</p>
                  <p className="text-sm text-muted-foreground">{request.user?.email}</p>
                </div>
                <div>
                  <span className="font-medium">Requested on:</span>
                  <p>{format(new Date(request.requested_at), 'MMM d, yyyy')}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleReject(request.id)}>
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => openApproveDialog(request)}>
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Approve Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Book Request</DialogTitle>
            <DialogDescription>
              {selectedRequest?.book?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>
              Approve Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookRequests;
