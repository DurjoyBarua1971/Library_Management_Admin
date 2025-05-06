import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createBook } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import InfiniteScrollSelect from "./InfiniteScrollSelect";
import { FormMessage } from "@/components/ui/form";

interface BookForm {
  title: string;
  author: string;
  description: string;
  category_id: number;
  ebook: string;
  hasPhysical: number;
  quantity: number;
}

interface CreateBookDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess: (flag:boolean) => void;
}

const CreateBookDialog = ({ isOpen, setIsOpen, onSuccess }: CreateBookDialogProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState<BookForm>({
    title: "",
    author: "",
    description: "",
    category_id: 0,
    ebook: "",
    hasPhysical: 0,
    quantity: 0,
  });
  const [hasEbook, setHasEbook] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BookForm, string>>>({});

  // Reset form and errors when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setForm({
        title: "",
        author: "",
        description: "",
        category_id: 0,
        ebook: "",
        hasPhysical: 0,
        quantity: 0,
      });
      setHasEbook(false);
      setErrors({});
    }
  }, [isOpen]);

  // Validate form and return if it's valid
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BookForm, string>> = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!form.author.trim()) {
      newErrors.author = "Author is required";
    }
    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (form.category_id <= 0) {
      newErrors.category_id = "Please select a category";
    }
    if (hasEbook && !form.ebook.trim()) {
      newErrors.ebook = "PDF URL is required when PDF version is selected";
    } else if (hasEbook && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(form.ebook)) {
      newErrors.ebook = "Please enter a valid URL";
    }
    if (form.hasPhysical === 1 && form.quantity < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid for enabling Submit button
  const isFormValid = (): boolean => {
    return (
      form.title.trim() &&
      form.author.trim() &&
      form.description.trim() &&
      form.category_id > 0 &&
      (!hasEbook || (form.ebook.trim() && /^https?:\/\/[^\s$.?#].[^\s]*$/.test(form.ebook))) &&
      (form.hasPhysical !== 1 || form.quantity >= 0)
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: any = {
        title: form.title,
        author: form.author,
        description: form.description,
        category_id: form.category_id,
        ebook: form.ebook,
        has_physical: form.hasPhysical,
        quantity: form.hasPhysical === 1 ? form.quantity : undefined,
      };
      const response = await createBook(payload);
      if (response?.data) {
        toast({
          title: "Success",
          description: "Book created successfully",
        });
        setIsOpen(false);
        onSuccess(false);
      } else {
        throw new Error("Failed to create book");
      }
    } catch (error) {
      console.error("Error creating book:", error);
      toast({
        title: "Error",
        description: "Failed to create book",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear error for a field when it changes
  const handleFieldChange = (field: keyof BookForm, value: any) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>Add a new book to the library catalog.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="Enter book title"
              disabled={isSubmitting}
            />
            {errors.title && <FormMessage>{errors.title}</FormMessage>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={form.author}
              onChange={(e) => handleFieldChange("author", e.target.value)}
              placeholder="Enter author name"
              disabled={isSubmitting}
            />
            {errors.author && <FormMessage>{errors.author}</FormMessage>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <InfiniteScrollSelect
              value={form.category_id ? form.category_id.toString() : ""}
              onValueChange={(value) => handleFieldChange("category_id", parseInt(value) || 0)}
              placeholder="Select category"
            />
            {errors.category_id && <FormMessage>{errors.category_id}</FormMessage>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Enter book description"
              disabled={isSubmitting}
            />
            {errors.description && <FormMessage>{errors.description}</FormMessage>}
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
                    handleFieldChange("ebook", checked ? form.ebook || "" : "");
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
                    onChange={(e) => handleFieldChange("ebook", e.target.value)}
                    placeholder="Enter PDF URL"
                    disabled={isSubmitting}
                  />
                  {errors.ebook && <FormMessage>{errors.ebook}</FormMessage>}
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasPhysical"
                  checked={form.hasPhysical === 1}
                  onCheckedChange={(checked) => {
                    const hasPhysical = checked ? 1 : 0;
                    setForm({
                      ...form,
                      hasPhysical,
                      quantity: checked ? form.quantity : 0,
                    });
                    if (errors.quantity && !checked) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.quantity;
                        return newErrors;
                      });
                    }
                  }}
                  disabled={isSubmitting}
                />
                <Label htmlFor="hasPhysical" className="cursor-pointer">
                  Physical copy
                </Label>
              </div>
              {form.hasPhysical === 1 && (
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={form.quantity}
                    onChange={(e) => handleFieldChange("quantity", parseInt(e.target.value) || 0)}
                    placeholder="Enter quantity"
                    disabled={isSubmitting}
                  />
                  {errors.quantity && <FormMessage>{errors.quantity}</FormMessage>}
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !isFormValid()}>
            Add Book
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBookDialog;