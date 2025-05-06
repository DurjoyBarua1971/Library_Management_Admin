import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
  paginationMeta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemCount: number;
}

const PaginationControls = ({
  paginationMeta,
  currentPage,
  setCurrentPage,
  itemCount,
}: PaginationControlsProps) => {
  const { last_page, from, total } = paginationMeta;

  // Generate page numbers with truncation for large page counts
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages: (number | string)[] = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(last_page, currentPage + 2);

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis if needed
    if (endPage < last_page) {
      if (endPage < last_page - 1) pages.push('...');
      pages.push(last_page);
    }

    return pages;
  };

  return (
    <div className="flex justify-between items-center mt-6">
      <div className="text-sm text-muted-foreground">
        Showing {from} to {from + itemCount - 1} of {total} {total === 1 ? 'item' : 'items'}
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
        {getPageNumbers().map((page, index) => (
          <Button
            key={`${page}-${index}`}
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => typeof page === 'number' && setCurrentPage(page)}
            disabled={typeof page !== 'number'}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === last_page}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;