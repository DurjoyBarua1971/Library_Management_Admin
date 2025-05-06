import { useEffect, useState } from "react";
import { Book } from "@/types";
import {
  getBooks,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import BookHeader from "@/components/Book/BookHeader";
import BookSearch from "@/components/Book/BookSearch";
import BookTabs from "@/components/Book/BookTabs";
import CreateBookDialog from "@/components/Book/CreateBookDialog";

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    current_page: 1,
    from: 0,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const booksResponse = await getBooks(currentPage, 10);
        if (booksResponse) {
          setBooks(booksResponse.data);
          setPaginationMeta(booksResponse.meta);
        } else {
          throw new Error("Failed to fetch books");
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        toast({
          title: "Error",
          description: "Failed to fetch books",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [toast, currentPage]);

  const handleSubmit = async (flag: boolean) => {
    try {
      const refreshResponse = await getBooks(1, 10);
      if (refreshResponse) {
        setBooks(refreshResponse.data);
        setPaginationMeta(refreshResponse.meta);
      } else {
        throw new Error("Failed to refresh books");
      }
      toast({
        title: "Success",
        description: flag
          ? "Book updated successfully"
          : "Book created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save book",
        variant: "destructive",
      });
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )
  );

  return (
    <div className="space-y-6">
      <BookHeader
        onAddBook={() => {
          setIsDialogOpen(true);
        }}
      />
      <BookSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <BookTabs
        books={filteredBooks}
        loading={loading}
        paginationMeta={paginationMeta}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <CreateBookDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSuccess={handleSubmit}
      />
    </div>
  );
};

export default Books;
