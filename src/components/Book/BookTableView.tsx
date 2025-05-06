import { Book } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, File } from "lucide-react";
import BookActions from "./BookActions";

interface BookTableViewProps {
  books: Book[];
  loading: boolean;
}

const BookTableView = ({ books, loading }: BookTableViewProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Formats</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-goodreads-purple mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading books...</p>
              </TableCell>
            </TableRow>
          ) : books.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <BookOpen className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No books found</p>
              </TableCell>
            </TableRow>
          ) : (
            books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {book.ebook && (
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-accent text-accent-foreground rounded">
                        <File className="h-3 w-3 mr-1" />
                        PDF
                      </span>
                    )}
                    {book.hasPhysical === 1 && (
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-accent text-accent-foreground rounded">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Physical
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <BookActions book={book} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookTableView;
