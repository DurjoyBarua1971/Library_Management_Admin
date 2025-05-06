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
  return (
    <div className="flex justify-between items-center mt-6">
      <div className="text-sm text-muted-foreground">
        Showing {paginationMeta.from} to {paginationMeta.from + itemCount - 1} of {paginationMeta.total} books
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
  );
};

export default PaginationControls;