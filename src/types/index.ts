// ==========================
// 🔐 Auth Related Types
// ==========================
export type LoginCredentials = {
  email: string;
  password: string;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  status: "success" | "error";
};

// ==========================
// 👤 User Related Types
// ==========================
export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
}

export interface CreateUserResponse {
  message: string;
  user: User;
}

export interface UserResponseData {
  data: User[];
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface GetUsersResponse {
  status: "success";
  data: User[];
  meta: UserResponseData["meta"];
}

// ==========================
// 📚 Book Related Types
// ==========================
export interface Book {
  id: number;
  title: string;
  description?: string;
  author: string;
  ebook: string;
  hasPhysical: number;
  bookLoans?: BookLoan[];
  loanCount?: number;
  quantity?: number;
  category: string;
  categoryId?: number;
  category_id?: number;
  createdAt?: string;
}

export interface BookResponseData {
  data: Book[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// ==========================
// 💬 Feedback Related Types
// ==========================
export interface Feedback {
  id: number;
  book_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
  createdAt: string | null;
}

export interface FeedbackResponseData {
  data: Feedback[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    total: number;
    to: number;
  };
}

// ==========================
// 🏷️ Category Related Types
// ==========================
export interface Category {
  id: number;
  name: string;
  bookCount: number;
  createdAt: string;
}

export interface CategoryResponseData {
  data: Category[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// ==========================
// 🧾 Book Loan Related Types
// ==========================
export interface BookLoan {
  id: number;
  book_id: number;
  user_id: number;
  status: "pending" | "pre-approved" | "approved" | "rejected" | "returned";
  requested_at: string;
  approved_at: string | null;
  due_date: string | null;
  returned_at: string | null;
  book: Partial<Book>;
  user: Partial<User>;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface BookLoanResponse {
  status: "success";
  data: BookLoan[];
  meta: PaginationMeta;
}

// ==========================
// ⏳ Due Date Extension Types
// ==========================
export interface DueDateIncreaseRequest {
  id: number;
  newDueDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  bookLoan: BookLoan;
  user: User;
  createdAt: string;
}

export interface DueDateIncreaseRequestResponse {
  status: "success";
  data: DueDateIncreaseRequest[];
  meta: PaginationMeta;
}

// ==========================
// 🧮 Dashboard & Stock
// ==========================
export interface TopBorrowedBook {
  id: number;
  title: string;
  author: string;
  thumbnail: string | null;
  totalBorrows: number;
}

export interface TopBorrowedBooks {
  minCount: number | null;
  maxCount: number | null;
  data: TopBorrowedBook[];
}

export interface LastSevenDaysLoan {
  min_count: number;
  max_count: number;
  data: Array<{
    date: string;
    count: number;
  }>;
}

export interface DashboardStats {
  total_books: number;
  physical_books: number;
  ebooks: number;
  active_loans: number;
  total_users: number;
  top_borrowed_books: TopBorrowedBooks;
  last_seven_days_loans: LastSevenDaysLoan;
}

export interface PhysicalStock {
  id: number;
  book_id: number;
  quantity: number;
  updated_at: string;
}

export interface StockUpdateResponse {
  message: string;
  data: {
    current_stock: number;
  };
}

export interface ActionResponse {
  message: string;
}
