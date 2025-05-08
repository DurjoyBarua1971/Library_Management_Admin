import { useEffect, useState } from "react";
import { ApiResponse, Category } from "@/types";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { FolderOpen, FileText, PenLine, Plus, Trash } from "lucide-react";
import { format } from "date-fns";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    current_page: 1,
    from: 0,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  // Form state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories(currentPage);
        setCategories(response.data);
        setPaginationMeta(response.meta);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentPage]);

  const resetForm = () => {
    setCategoryForm({
      name: "",
    });
    setIsEditMode(false);
    setSelectedCategory(null);
  };

  const openEditDialog = (category: Category) => {
    setIsEditMode(true);
    setSelectedCategory(category);
    setCategoryForm({
      name: category.name,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      let response:ApiResponse<Category>;

      if (isEditMode && selectedCategory) {
        response = await updateCategory(selectedCategory.id, categoryForm);
      } else {
        response = await createCategory(categoryForm);
      }

      if (response) {
        setCurrentPage(1);
        const refreshResponse = await getCategories();
        if (refreshResponse) {
          setCategories(refreshResponse.data);
        }
        toast({
          title: "Success",
          description: isEditMode
            ? "Category updated successfully"
            : "Category created successfully",
        });

        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteCategory(id);
      if (response) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        const refreshResponse = await getCategories(currentPage, 10);
        if (refreshResponse.data.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          setCategories(refreshResponse.data);
          setPaginationMeta(refreshResponse.meta);
        }
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category. It may be in use by books.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground">Manage book categories</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-goodreads-purple mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">
            Loading categories...
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8">
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-lg text-muted-foreground">
            No categories found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  {category.name}
                </CardTitle>
                <CardDescription>
                  {/* {category.createdAt} */}
                  {format(new Date(category.createdAt), "MMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                    <span>
                    {category.bookCount} {category.bookCount === 1 ? "book" : "books"}
                    </span>
                  {/* This would be actual count from API */}
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(category)}
                >
                  <PenLine className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the category. All books in
                        this category will need to be re-categorized.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(category.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {categories.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {paginationMeta.from} to{" "}
            {paginationMeta.from + categories.length - 1} of{" "}
            {paginationMeta.total} categories
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === paginationMeta.last_page}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the category name."
                : "Add a new book category to the system."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, name: e.target.value })
                }
                placeholder="Enter category name"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEditMode ? "Update Category" : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
