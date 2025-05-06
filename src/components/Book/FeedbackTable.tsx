import { Feedback } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star } from "lucide-react";
import { formatDate, StarRating } from "@/utils/bookUtils";

export const FeedbackTable = ({
  feedback,
  feedbackLoading,
}: {
  feedback: Feedback[];
  feedbackLoading: boolean;
}) => {
  return (
    <div className="border rounded-md">
      <h2 className="text-lg font-semibold p-4">Feedback</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbackLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-goodreads-purple mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading feedback...</p>
              </TableCell>
            </TableRow>
          ) : feedback.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <Star className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No feedback found</p>
              </TableCell>
            </TableRow>
          ) : (
            feedback.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item?.user?.name ?? "Unknown User"}</TableCell>
                <TableCell>
                  <StarRating rating={item.rating} />
                </TableCell>
                <TableCell>{item.comment || "No comment"}</TableCell>
                <TableCell>
                  {item.user.created_at
                    ? formatDate(item.user.created_at)
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};