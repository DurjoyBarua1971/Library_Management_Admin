import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Book } from "@/types";
import { updateBook } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import InfiniteScrollSelect from "./InfiniteScrollSelect";

interface BookForm {
  title: string;
  author: string;
  description: string;
  category_id: number;
  ebook: string;
  quantity: number;
}

interface EditBookDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  book: Book;
  onSuccess: () => void;
}

const EditBookDialog = ({
  isOpen,
  setIsOpen,
  book,
  onSuccess,
}: EditBookDialogProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState<BookForm>({
    title: book.title,
    author: book.author,
    description: book.description || "",
    category_id: book.categoryId,
    ebook: book.ebook || "",
    quantity: book.quantity || undefined,
  });
  const [hasEbook, setHasEbook] = useState(!!book.ebook);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm({
      title: book.title,
      author: book.author,
      description: book.description || "",
      category_id: book.categoryId,
      ebook: book.ebook || "",
      quantity: book.quantity || 0,
    });
    setHasEbook(!!book.ebook);
  }, [book]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload: any = {
        title: form.title,
        author: form.author,
        description: form.description,
        category_id: form.category_id,
        ebook: form.ebook,
        has_physical: book.hasPhysical,
        quantity: book.hasPhysical === 1 ? form.quantity : 0,
      };
      const response = await updateBook(book.id, payload);
      if (response?.data) {
        toast({
          title: "Success",
          description: "Book updated successfully",
        });
        setIsOpen(false);
        onSuccess();
      } else {
        throw new Error("Failed to update book");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      toast({
        title: "Error",
        description: "Failed to update book",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Update the book details in the library catalog.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter book title"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Enter author name"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <InfiniteScrollSelect
              value={form.category_id ? form.category_id.toString() : ""}
              onValueChange={(value) =>
                setForm({ ...form, category_id: parseInt(value) })
              }
              placeholder="Select category"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Enter book description"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label>Book Format</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ebook"
                  checked={hasEbook}
                  onCheckedChange={(checked) => {
                    setHasEbook(checked as boolean);
                    setForm({
                      ...form,
                      ebook: checked ? form.ebook || "" : "",
                    });
                  }}
                  disabled={isSubmitting}
                />
                <Label htmlFor="ebook" className="cursor-pointer">
                  PDF version
                </Label>
              </div>
              {hasEbook && (
                <div className="space-y-2">
                  <Label htmlFor="ebook_url">PDF URL</Label>
                  <Input
                    id="ebook_url"
                    value={form.ebook}
                    onChange={(e) =>
                      setForm({ ...form, ebook: e.target.value })
                    }
                    placeholder="Enter PDF URL"
                    disabled={isSubmitting}
                  />
                </div>
              )}
              {book.hasPhysical === 1 && (
                <div className="space-y-2">
                  <Label>Physical Copy</Label>
                  <p className="text-sm text-muted-foreground">
                    Physical copy available ({form.quantity} in stock)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            Update Book
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookDialog;
