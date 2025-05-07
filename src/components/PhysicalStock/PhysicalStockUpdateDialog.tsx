import { Book } from '@/types';
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
import { Minus, Plus } from 'lucide-react';

interface PhysicalStockUpdateDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedBook: Book | null;
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleSubmit: () => void;
}

const PhysicalStockUpdateDialog = ({
  isOpen,
  setIsOpen,
  selectedBook,
  quantity,
  setQuantity,
  handleSubmit,
}: PhysicalStockUpdateDialogProps) => (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Update Stock Quantity</DialogTitle>
        <DialogDescription>{selectedBook?.title}</DialogDescription>
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
        <Button variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Update Stock</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default PhysicalStockUpdateDialog;