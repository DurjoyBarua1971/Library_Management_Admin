
import { useEffect, useState } from 'react';
import { BookLoan } from '@/types';
import { getBookLoans, approveBookLoan, rejectBookLoan, returnBook, extendDueDate } from '@/lib/api';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Calendar, Check, Clock, MoreHorizontal, RotateCcw, Search, ThumbsDown, ThumbsUp } from 'lucide-react';
import { format, parseISO, addDays } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const statusColors = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  approved: { bg: 'bg-green-100', text: 'text-green-800' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800' },
  returned: { bg: 'bg-blue-100', text: 'text-blue-800' },
  overdue: { bg: 'bg-orange-100', text: 'text-orange-800' },
};

const BookLoans = () => {
  const [loans, setLoans] = useState<BookLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<BookLoan | null>(null);
  const [dueDate, setDueDate] = useState('');
  
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchBookLoans = async () => {
      try {
        setLoading(true);
        const response = await getBookLoans(statusFilter || undefined);
        
        if (response.status === 'success') {
          setLoans(response.data);
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
    
    fetchBookLoans();
  }, [toast, statusFilter]);
  
  const handleApprove = async (loanId: number) => {
    // Calculate default due date (2 weeks from today)
    const defaultDueDate = format(addDays(new Date(), 14), 'yyyy-MM-dd');
    
    try {
      const response = await approveBookLoan(loanId, defaultDueDate);
      
      if (response.status === 'success') {
        // Update local state
        setLoans(loans.map(loan =>
          loan.id === loanId ? { ...loan, status: 'approved', due_date: defaultDueDate, approved_at: new Date().toISOString() } : loan
        ));
        
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
      
      if (response.status === 'success') {
        // Update local state
        setLoans(loans.map(loan =>
          loan.id === loanId ? { ...loan, status: 'rejected' } : loan
        ));
        
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
  
  const handleReturn = async (loanId: number) => {
    try {
      const response = await returnBook(loanId);
      
      if (response.status === 'success') {
        // Update local state
        setLoans(loans.map(loan =>
          loan.id === loanId ? { ...loan, status: 'returned', returned_at: new Date().toISOString() } : loan
        ));
        
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
  
  const openExtendDialog = (loan: BookLoan) => {
    setSelectedLoan(loan);
    // Set initial due date to 2 weeks from current due date
    if (loan.due_date) {
      const newDueDate = addDays(parseISO(loan.due_date), 14);
      setDueDate(format(newDueDate, 'yyyy-MM-dd'));
    } else {
      setDueDate(format(addDays(new Date(), 14), 'yyyy-MM-dd'));
    }
    setIsExtendDialogOpen(true);
  };
  
  const handleExtend = async () => {
    if (!selectedLoan) return;
    
    try {
      const response = await extendDueDate(selectedLoan.id, dueDate);
      
      if (response.status === 'success') {
        // Update local state
        setLoans(loans.map(loan =>
          loan.id === selectedLoan.id ? { ...loan, due_date: dueDate } : loan
        ));
        
        toast({
          title: 'Success',
          description: 'Due date extended successfully',
        });
        
        setIsExtendDialogOpen(false);
      }
    } catch (error) {
      console.error('Error extending due date:', error);
      toast({
        title: 'Error',
        description: 'Failed to extend due date',
        variant: 'destructive',
      });
    }
  };
  
  const filteredLoans = loans.filter(loan => {
    const bookTitle = loan.book?.title?.toLowerCase() || '';
    const userName = loan.user?.name?.toLowerCase() || '';
    const userEmail = loan.user?.email?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return bookTitle.includes(query) || userName.includes(query) || userEmail.includes(query);
  });

  const getStatusBadge = (status: string) => {
    const colorConfig = statusColors[status as keyof typeof statusColors] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    
    return (
      <Badge className={`${colorConfig.bg} ${colorConfig.text} border-none uppercase`}>
        {status}
      </Badge>
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Book Loans</h1>
        <p className="text-muted-foreground">Manage book borrowing requests and loans</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search loans..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" onValueChange={(value) => setStatusFilter(value === 'all' ? null : value)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
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
                {renderTableContent()}
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
                {renderTableContent('pending')}
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
                {renderTableContent('approved')}
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
                {renderTableContent('overdue')}
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
                {renderTableContent('returned')}
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
                {renderTableContent('rejected')}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Extend Due Date Dialog */}
      <Dialog open={isExtendDialogOpen} onOpenChange={setIsExtendDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Extend Due Date</DialogTitle>
            <DialogDescription>
              {selectedLoan?.book?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="due_date">New Due Date</Label>
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
            <Button variant="outline" onClick={() => setIsExtendDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExtend}>
              Extend Due Date
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  function renderTableContent(statusFilterView?: string) {
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
    
    if (filteredLoans.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-8">
            <Calendar className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">No book loans found</p>
          </TableCell>
        </TableRow>
      );
    }

    const getFilteredLoans = () => {
      if (statusFilterView) {
        return filteredLoans.filter(loan => loan.status === statusFilterView);
      }
      return filteredLoans;
    };

    return getFilteredLoans().map((loan) => {
      switch (statusFilterView) {
        case 'pending':
          return (
            <TableRow key={loan.id}>
              <TableCell className="font-medium">{loan.book?.title}</TableCell>
              <TableCell>{loan.user?.name}<br /><span className="text-xs text-muted-foreground">{loan.user?.email}</span></TableCell>
              <TableCell>{loan.requested_at ? format(new Date(loan.requested_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleApprove(loan.id)}>
                    <ThumbsUp className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleReject(loan.id)}>
                    <ThumbsDown className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        
        case 'approved':
          return (
            <TableRow key={loan.id}>
              <TableCell className="font-medium">{loan.book?.title}</TableCell>
              <TableCell>{loan.user?.name}<br /><span className="text-xs text-muted-foreground">{loan.user?.email}</span></TableCell>
              <TableCell>{loan.approved_at ? format(new Date(loan.approved_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
              <TableCell>{loan.due_date ? format(new Date(loan.due_date), 'MMM d, yyyy') : 'N/A'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleReturn(loan.id)}>
                    <RotateCcw className="h-4 w-4 mr-1" /> Return
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openExtendDialog(loan)}>
                    <Clock className="h-4 w-4 mr-1" /> Extend
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
          
        case 'overdue':
          return (
            <TableRow key={loan.id}>
              <TableCell className="font-medium">{loan.book?.title}</TableCell>
              <TableCell>{loan.user?.name}<br /><span className="text-xs text-muted-foreground">{loan.user?.email}</span></TableCell>
              <TableCell>{loan.due_date ? format(new Date(loan.due_date), 'MMM d, yyyy') : 'N/A'}</TableCell>
              <TableCell>
                <span className="text-red-600 font-medium">
                  7 days {/* This would be calculated from API data */}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleReturn(loan.id)}>
                    <RotateCcw className="h-4 w-4 mr-1" /> Return
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openExtendDialog(loan)}>
                    <Clock className="h-4 w-4 mr-1" /> Extend
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        
        case 'returned':
          return (
            <TableRow key={loan.id}>
              <TableCell className="font-medium">{loan.book?.title}</TableCell>
              <TableCell>{loan.user?.name}<br /><span className="text-xs text-muted-foreground">{loan.user?.email}</span></TableCell>
              <TableCell>{loan.approved_at ? format(new Date(loan.approved_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
              <TableCell>{loan.returned_at ? format(new Date(loan.returned_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
              <TableCell>
                14 days {/* This would be calculated from API data */}
              </TableCell>
            </TableRow>
          );
        
        case 'rejected':
          return (
            <TableRow key={loan.id}>
              <TableCell className="font-medium">{loan.book?.title}</TableCell>
              <TableCell>{loan.user?.name}<br /><span className="text-xs text-muted-foreground">{loan.user?.email}</span></TableCell>
              <TableCell>{loan.requested_at ? format(new Date(loan.requested_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
              <TableCell>N/A {/* This would be from API data */}</TableCell>
            </TableRow>
          );
          
        default:
          return (
            <TableRow key={loan.id}>
              <TableCell className="font-medium">{loan.book?.title}</TableCell>
              <TableCell>{loan.user?.name}<br /><span className="text-xs text-muted-foreground">{loan.user?.email}</span></TableCell>
              <TableCell>{getStatusBadge(loan.status)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleApprove(loan.id)}>
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReject(loan.id)}>
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    {(loan.status === 'approved' || loan.status === 'overdue') && (
                      <>
                        <DropdownMenuItem onClick={() => handleReturn(loan.id)}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Return Book
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openExtendDialog(loan)}>
                          <Clock className="h-4 w-4 mr-2" />
                          Extend Due Date
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
      }
    });
  }
};

export default BookLoans;
