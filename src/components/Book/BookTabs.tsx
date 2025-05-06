import { Book } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookGridView from './BookGridView';
import BookTableView from './BookTableView';
import PaginationControls from './PaginationControls';

interface BookTabsProps {
  books: Book[];
  loading: boolean;
  paginationMeta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: number) => Promise<boolean>;
  onViewBook: (id: number) => void;
  isDeleting: boolean;
}

const BookTabs = ({
  books,
  loading,
  paginationMeta,
  currentPage,
  setCurrentPage,
  onEditBook,
  onDeleteBook,
  onViewBook,
  isDeleting,
}: BookTabsProps) => {
  return (
    <Tabs defaultValue="grid">
      <TabsList className="mb-4">
        <TabsTrigger value="grid">Grid View</TabsTrigger>
        <TabsTrigger value="table">Table View</TabsTrigger>
      </TabsList>
      <TabsContent value="grid">
        <BookGridView
          books={books}
          loading={loading}
          onEditBook={onEditBook}
          onDeleteBook={onDeleteBook}
          onViewBook={onViewBook}
          isDeleting={isDeleting}
        />
        {books.length > 0 && (
          <PaginationControls
            paginationMeta={paginationMeta}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemCount={books.length}
          />
        )}
      </TabsContent>
      <TabsContent value="table">
        <BookTableView
          books={books}
          loading={loading}
          onEditBook={onEditBook}
          onDeleteBook={onDeleteBook}
          onViewBook={onViewBook}
          isDeleting={isDeleting}
        />
        {books.length > 0 && (
          <PaginationControls
            paginationMeta={paginationMeta}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemCount={books.length}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default BookTabs;