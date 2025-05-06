
import { useEffect, useState } from 'react';
import { Book, PhysicalStock as PhysicalStockType } from '@/types';
import { getBooks, getPhysicalStocks, updatePhysicalStock } from '@/lib/api';
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
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Minus, Package, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';

const PhysicalStock = () => {
  const [stocks, setStocks] = useState<PhysicalStockType[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<PhysicalStockType | null>(null);
  
  // Form state
  const [quantity, setQuantity] = useState(0);
  
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stocksResponse, booksResponse] = await Promise.all([
          getPhysicalStocks(),
          getBooks(),
        ]);
        
        if (stocksResponse.status === 'success') {
          setStocks(stocksResponse.data);
        }
        
        if (booksResponse.status === 'success') {
          setBooks(booksResponse.data.filter(book => book.has_physical));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch stock data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  const openUpdateDialog = (stock: PhysicalStockType) => {
    setSelectedStock(stock);
    setQuantity(stock.quantity);
    setIsDialogOpen(true);
  };
  
  const handleSubmit = async () => {
    if (!selectedStock) return;
    
    try {
      const response = await updatePhysicalStock(selectedStock.id, quantity);
      
      if (response.status === 'success') {
        // Update the local state
        setStocks(stocks.map(stock => 
          stock.id === selectedStock.id ? { ...stock, quantity } : stock
        ));
        
        toast({
          title: 'Success',
          description: 'Stock updated successfully',
        });
        
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: 'Error',
        description: 'Failed to update stock',
        variant: 'destructive',
      });
    }
  };
  
  // Helper to get book details
  const getBookDetails = (bookId: number) => {
    return books.find(book => book.id === bookId);
  };
  
  const filteredStocks = stocks.filter(stock => {
    const book = getBookDetails(stock.book_id);
    if (!book) return false;
    
    return (
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Physical Stock</h1>
          <p className="text-muted-foreground">Manage physical book inventory</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="text-center">Current Stock</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-goodreads-purple mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading stock data...</p>
                </TableCell>
              </TableRow>
            ) : filteredStocks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Package className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No physical stock found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredStocks.map((stock) => {
                const book = getBookDetails(stock.book_id);
                if (!book) return null;
                
                return (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center">
                        <span className={`px-3 py-1 rounded-md ${
                          stock.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {stock.quantity}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(stock.updated_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openUpdateDialog(stock)}>
                        Update Stock
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Update Stock Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Stock Quantity</DialogTitle>
            <DialogDescription>
              {selectedStock && getBookDetails(selectedStock.book_id)?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  disabled={quantity <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Update Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhysicalStock;
