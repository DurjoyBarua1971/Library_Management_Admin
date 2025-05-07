import { DueDateIncreaseRequest } from "@/types";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ThumbsDown, ThumbsUp } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface DueDateExtensionsTableProps {
  requests: DueDateIncreaseRequest[];
  loading: boolean;
  paginationMeta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  currentPage: number;
  setCurrentPage: (page: number) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  handleApprove: (requestId: number) => void;
  handleReject: (requestId: number) => void;
}

const statusColors = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
  approved: { bg: "bg-green-100", text: "text-green-800" },
  rejected: { bg: "bg-red-100", text: "text-red-800" },
};

const DueDateExtensionsTable = ({
  requests,
  loading,
  paginationMeta,
  currentPage,
  setCurrentPage,
  statusFilter,
  setStatusFilter,
  handleApprove,
  handleReject,
}: DueDateExtensionsTableProps) => {
  const getStatusBadge = (status: string) => {
    const colorConfig = statusColors[status as keyof typeof statusColors] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
    };
    return (
      <Badge
        className={`${colorConfig.bg} ${colorConfig.text} border-none uppercase`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={statusFilter || "all"}
        onValueChange={(value) => {
          setStatusFilter(value === "all" ? null : value);
          setCurrentPage(1);
        }}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="pt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Current Due Date</TableHead>
                  <TableHead>Requested Due Date</TableHead>
                  <TableHead className="w-64">Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-goodreads-purple mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading requests...</p>
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Calendar className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">No due date extension requests found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.bookLoan.book?.title}
                      </TableCell>
                      <TableCell>
                        {request.user.name}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {request.user.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        {request.bookLoan.due_date
                          ? format(new Date(request.bookLoan.due_date), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {request.newDueDate
                          ? format(new Date(request.newDueDate), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell className="max-w-64 truncate" title={request.reason}>
                        {request.reason}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {request.createdAt
                          ? format(new Date(request.createdAt), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      {request.status === "pending" && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(request.id)}
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(request.id)}
                            >
                              <ThumbsDown className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </div>
                        </TableCell>
                      )}
                      {request.status !== "pending" && (
                        <TableCell className="text-right"></TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="pt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Current Due Date</TableHead>
                  <TableHead>Requested Due Date</TableHead>
                  <TableHead>Days Overdue</TableHead>
                  <TableHead className="w-64">Reason</TableHead>
                  <TableHead>Requested On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-goodreads-purple mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading requests...</p>
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Calendar className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">No pending requests found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.bookLoan.book?.title}
                      </TableCell>
                      <TableCell>
                        {request.user.name}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {request.user.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        {request.bookLoan.due_date
                          ? format(new Date(request.bookLoan.due_date), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {request.newDueDate
                          ? format(new Date(request.newDueDate), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <span className="text-red-600 font-medium">
                          {request.bookLoan.due_date
                            ? `${differenceInDays(
                                new Date(),
                                new Date(request.bookLoan.due_date)
                              )} days`
                            : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-64 truncate" title={request.reason}>
                        {request.reason}
                      </TableCell>
                      <TableCell>
                        {request.createdAt
                          ? format(new Date(request.createdAt), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(request.id)}
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="approved" className="pt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Previous Due Date</TableHead>
                  <TableHead>New Due Date</TableHead>
                  <TableHead className="w-64">Reason</TableHead>
                  <TableHead>Requested On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-goodreads-purple mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading requests...</p>
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Calendar className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">No approved requests found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.bookLoan.book?.title}
                      </TableCell>
                      <TableCell>
                        {request.user.name}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {request.user.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        {request.bookLoan.due_date
                          ? format(new Date(request.bookLoan.due_date), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {request.newDueDate
                          ? format(new Date(request.newDueDate), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell className="max-w-64 truncate" title={request.reason}>
                        {request.reason}
                      </TableCell>
                      <TableCell>
                        {request.createdAt
                          ? format(new Date(request.createdAt), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="pt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Current Due Date</TableHead>
                  <TableHead>Requested Due Date</TableHead>
                  <TableHead className="w-64">Reason</TableHead>
                  <TableHead>Requested On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-goodreads-purple mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading requests...</p>
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Calendar className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">No rejected requests found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.bookLoan.book?.title}
                      </TableCell>
                      <TableCell>
                        {request.user.name}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {request.user.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        {request.bookLoan.due_date
                          ? format(new Date(request.bookLoan.due_date), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {request.newDueDate
                          ? format(new Date(request.newDueDate), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell className="max-w-64 truncate" title={request.reason}>
                        {request.reason}
                      </TableCell>
                      <TableCell>
                        {request.createdAt
                          ? format(new Date(request.createdAt), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

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
};

export default DueDateExtensionsTable;