import { useEffect, useState } from "react";
import { Book } from "@/types";
import { getBooks, updatePhysicalStock } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/lib/utils";
import {
  PhysicalStockHeader,
  PhysicalStockSearch,
  PhysicalStockTable,
  PhysicalStockUpdateDialog,
} from "@/components/PhysicalStock";

const PhysicalStock = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [quantity, setQuantity] = useState(0);

  const { toast } = useToast();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const booksResponse = await getBooks(
          currentPage,
          10,
          debouncedSearchQuery || undefined
        );
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
  }, [toast, currentPage, debouncedSearchQuery]);

  const openUpdateDialog = (book: Book) => {
    setSelectedBook(book);
    setQuantity(book.quantity ?? 0);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedBook) return;

    try {
      const response = await updatePhysicalStock(selectedBook.id, quantity);
      setBooks(
        books.map((book) =>
          book.id === selectedBook.id
            ? { ...book, quantity: response.data.current_stock }
            : book
        )
      );
      toast({
        title: "Success",
        description: response.message,
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating stock:", error);
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PhysicalStockHeader />
      <PhysicalStockSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <PhysicalStockTable
        books={books}
        loading={loading}
        paginationMeta={paginationMeta}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        openUpdateDialog={openUpdateDialog}
      />
      <PhysicalStockUpdateDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        selectedBook={selectedBook}
        quantity={quantity}
        setQuantity={setQuantity}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default PhysicalStock;
