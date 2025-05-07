import { Book } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { format } from "date-fns";

interface PhysicalStockTableProps {
  books: Book[];
  loading: boolean;
  paginationMeta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  currentPage: number;
  setCurrentPage: (page: number) => void;
  openUpdateDialog: (book: Book) => void;
}

const PhysicalStockTable = ({
  books,
  loading,
  paginationMeta,
  currentPage,
  setCurrentPage,
  openUpdateDialog,
}: PhysicalStockTableProps) => (
  <div className="space-y-4">
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book</TableHead>
            <TableHead>Author</TableHead>
            <TableHead className="text-center">Current Stock</TableHead>
            <TableHead className="text-center">Total Loans</TableHead>
            <TableHead className="text-right pr-10">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-goodreads-purple mx-auto"></div>
                <p className="mt-2 text-muted-foreground">
                  Loading stock data...
                </p>
              </TableCell>
            </TableRow>
          ) : books.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <Package className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  No physical stock found
                </p>
              </TableCell>
            </TableRow>
          ) : (
            books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-3 py-1 rounded-md ${
                      book.quantity && book.quantity > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {book.quantity ?? "N/A"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {book.loanCount ?? "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openUpdateDialog(book)}
                  >
                    Update Stock
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>

    {paginationMeta.last_page > 1 && (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(currentPage - 1)}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
          {Array.from(
            { length: paginationMeta.last_page },
            (_, i) => i + 1
          ).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setCurrentPage(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(currentPage + 1)}
              className={
                currentPage === paginationMeta.last_page
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )}
  </div>
);

export default PhysicalStockTable;
