import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Book, Feedback } from "@/types";
import { getBook, getFeedback, deleteBook } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import PaginationControls from "./PaginationControls";
import { BookDetails } from "./BookDetails";
import { FeedbackTable } from "./FeedbackTable";
import EditBookDialog from "./EditBookDialog";


const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Centralized state for book and feedback
  const [state, setState] = useState<{
    book: Book | null;
    feedback: Feedback[];
    paginationMeta: {
      current_page: number;
      from: number;
      last_page: number;
      per_page: number;
      to: number;
      total: number;
    };
    loading: {
      book: boolean;
      feedback: boolean;
      delete: boolean;
    };
    error: {
      book: string | null;
      feedback: string | null;
      delete: string | null;
    };
  }>({
    book: null,
    feedback: [],
    paginationMeta: {
      current_page: 1,
      from: 0,
      last_page: 1,
      per_page: 10,
      to: 0,
      total: 0,
    },
    loading: {
      book: true,
      feedback: true,
      delete: false,
    },
    error: {
      book: null,
      feedback: null,
      delete: null,
    },
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch book and feedback data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setState((prev) => ({
          ...prev,
          loading: { ...prev.loading, book: true },
          error: { ...prev.error, book: null },
        }));
        const response = await getBook(Number(id));
        if (response?.data) {
          setState((prev) => ({ ...prev, book: response.data }));
        } else {
          throw new Error("Failed to fetch book");
        }
      } catch (error) {
        console.error("Error fetching book:", error);
        setState((prev) => ({
          ...prev,
          error: { ...prev.error, book: "Failed to fetch book details" },
        }));
        toast({
          title: "Error",
          description: "Failed to fetch book details",
          variant: "destructive",
        });
        navigate("/books");
      } finally {
        setState((prev) => ({
          ...prev,
          loading: { ...prev.loading, book: false },
        }));
      }
    };

    const fetchFeedback = async () => {
      try {
        setState((prev) => ({
          ...prev,
          loading: { ...prev.loading, feedback: true },
          error: { ...prev.error, feedback: null },
        }));
        const response = await getFeedback(Number(id), currentPage, 10);
        if (response?.data) {
          setState((prev) => ({
            ...prev,
            feedback: response.data,
            paginationMeta: response.meta,
          }));
        } else {
          throw new Error("Failed to fetch feedback");
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setState((prev) => ({
          ...prev,
          error: { ...prev.error, feedback: "Failed to fetch feedback" },
        }));
        toast({
          title: "Error",
          description: "Failed to fetch feedback",
          variant: "destructive",
        });
      } finally {
        setState((prev) => ({
          ...prev,
          loading: { ...prev.loading, feedback: false },
        }));
      }
    };

    fetchBook();
    fetchFeedback();
  }, [id, currentPage, toast, navigate]);

  const handleDelete = async () => {
    try {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, delete: true },
        error: { ...prev.error, delete: null },
      }));
      const response = await deleteBook(Number(id));
      if (response) {
        toast({
          title: "Success",
          description: "Book deleted successfully",
        });
        navigate("/books");
      } else {
        throw new Error("Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      setState((prev) => ({
        ...prev,
        error: { ...prev.error, delete: "Failed to delete book" },
      }));
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    } finally {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, delete: false },
      }));
    }
  };

  const handleEditSuccess = () => {
    // Refresh book data after edit
    const fetchBook = async () => {
      try {
        const response = await getBook(Number(id));
        if (response?.data) {
          setState((prev) => ({ ...prev, book: response.data }));
        }
      } catch (error) {
        console.error("Error refreshing book:", error);
        toast({
          title: "Error",
          description: "Failed to refresh book details",
          variant: "destructive",
        });
      }
    };
    fetchBook();
  };

  if (state.loading.book || !state.book) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-goodreads-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{state.book.title}</h1>
        <Button variant="outline" onClick={() => navigate("/books")}>
          Back to Books
        </Button>
      </div>
      <BookDetails
        book={state.book}
        onEdit={() => setIsEditDialogOpen(true)}
        onDelete={handleDelete}
      />
      <FeedbackTable
        feedback={state.feedback}
        feedbackLoading={state.loading.feedback}
      />
      {state.feedback.length > 0 && (
        <PaginationControls
          paginationMeta={state.paginationMeta}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemCount={state.feedback.length}
        />
      )}
      <EditBookDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        book={state.book}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default BookDetailsPage;