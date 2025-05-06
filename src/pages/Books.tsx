import { useEffect, useState } from 'react';
import { Book } from '@/types';
import { getBooks, createBook, updateBook, deleteBook, getBook } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import BookHeader from '@/components/Book/BookHeader';
import BookSearch from '@/components/Book/BookSearch';
import BookTabs from '@/components/Book/BookTabs';
import BookFormDialog from '@/components/Book/BookFormDialog';
import BookDetailsDialog from '@/components/Book/BookDetailsDialog';

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    current_page: 1,
    from: 0,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBookDetails, setSelectedBookDetails] = useState<Book | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    ebook: '',
    hasPhysical: 0,
    quantity: 0,
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
          throw new Error('Failed to fetch books');
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch books',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [toast, currentPage]);

  const resetForm = () => {
    setBookForm({
      title: '',
      author: '',
      description: '',
      category: '',
      ebook: '',
      hasPhysical: 0,
      quantity: 0,
    });
    setIsEditMode(false);
    setSelectedBook(null);
  };

  const openEditDialog = async (book: Book) => {
    try {
      setIsEditMode(true);
      setSelectedBook(book);
      setIsDialogOpen(true);
      setIsEditLoading(true);
      const response = await getBook(book.id);
      if (response) {
        setBookForm({
          title: response.data.title,
          author: response.data.author,
          description: response.data.description || '',
          category: response.data.category,
          ebook: response.data.ebook || '',
          hasPhysical: response.data.hasPhysical,
          quantity: response.data.quantity ?? 0,
        });
      } else {
        throw new Error('Failed to fetch book details');
      }
    } catch (error) {
      console.error('Error fetching book for edit:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch book details for editing',
        variant: 'destructive',
      });
      setIsDialogOpen(false);
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        title: bookForm.title,
        author: bookForm.author,
        description: bookForm.description,
        category: bookForm.category,
        ebook: bookForm.ebook,
        hasPhysical: bookForm.hasPhysical,
        quantity: bookForm.hasPhysical === 1 ? bookForm.quantity : 0,
      };

      let response;

      if (isEditMode && selectedBook) {
        response = await updateBook(selectedBook.id, payload);
      } else {
        response = await createBook(payload);
      }

      if (response) {
        setCurrentPage(1);
        const refreshResponse = await getBooks(1, 10);
        if (refreshResponse) {
          setBooks(refreshResponse.data);
          setPaginationMeta(refreshResponse.meta);
        } else {
          throw new Error('Failed to refresh books');
        }

        toast({
          title: 'Success',
          description: isEditMode ? 'Book updated successfully' : 'Book created successfully',
        });

        setIsDialogOpen(false);
        resetForm();
      } else {
        throw new Error('Failed to save book');
      }
    } catch (error) {
      console.error('Error saving book:', error);
      toast({
        title: 'Error',
        description: 'Failed to save book',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number): Promise<boolean> => {
    try {
      setIsDeleting(true);
      const response = await deleteBook(id);
      if (response) {
        const refreshResponse = await getBooks(currentPage, 10);
        if (refreshResponse) {
          if (refreshResponse.data.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            setBooks(refreshResponse.data);
            setPaginationMeta(refreshResponse.meta);
          }
          toast({
            title: 'Success',
            description: 'Book deleted successfully',
          });
          return true;
        } else {
          throw new Error('Failed to refresh books');
        }
      } else {
        throw new Error('Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete book',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const openBookDetails = async (id: number) => {
    try {
      setIsDetailsLoading(true);
      setIsDetailsModalOpen(true);
      const response = await getBook(id);
      if (response) {
        setSelectedBookDetails(response.data);
      } else {
        throw new Error('Failed to fetch book details');
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch book details',
        variant: 'destructive',
      });
      setIsDetailsModalOpen(false);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <BookHeader onAddBook={() => { resetForm(); setIsDialogOpen(true); }} />
      <BookSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <BookTabs
        books={filteredBooks}
        loading={loading}
        paginationMeta={paginationMeta}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onEditBook={openEditDialog}
        onDeleteBook={handleDelete}
        onViewBook={openBookDetails}
        isDeleting={isDeleting}
      />
      <BookFormDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        isEditMode={isEditMode}
        isEditLoading={isEditLoading}
        isSubmitting={isSubmitting}
        bookForm={bookForm}
        setBookForm={setBookForm}
        onSubmit={handleSubmit}
      />
      <BookDetailsDialog
        isOpen={isDetailsModalOpen}
        setIsOpen={setIsDetailsModalOpen}
        book={selectedBookDetails}
        isLoading={isDetailsLoading}
      />
    </div>
  );
};

export default Books;