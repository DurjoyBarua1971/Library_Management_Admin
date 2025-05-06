import { Book } from '@/types';
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
}

const BookTabs = ({
  books,
  loading,
  paginationMeta,
  currentPage,
  setCurrentPage,
}: BookTabsProps) => {
  return (
    <div>
      <BookTableView
        books={books}
        loading={loading}
      />
      {books.length > 0 && (
        <PaginationControls
          paginationMeta={paginationMeta}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemCount={books.length}
        />
      )}
    </div>
  );
};

export default BookTabs;