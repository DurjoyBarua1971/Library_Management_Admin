export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
}

export interface Book {
  id: number;
  title: string;
  description?: string;
  author: string;
  ebook: string;
  hasPhysical: number;
  bookLoans?: BookLoan[];
  quantity?: number;
  category: string;
  categoryId?: number;
  category_id?: number;
  createdAt?: string;
}

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

export interface PhysicalStock {
  id: number;
  book_id: number;
  quantity: number;
  updated_at: string;
}

export interface BookLoan {
  id: number;
  user_id: number;
  book_id: number;
  status: "pending" | "approved" | "rejected" | "returned" | "overdue";
  requested_at: string;
  approved_at?: string;
  due_date?: string;
  returned_at?: string;
  user?: User;
  book?: Book;
}

export type LoginCredentials = {
  email: string;
  password: string;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  status: "success" | "error";
};

export interface DashboardStats {
  totalUsers: number;
  totalBooks: number;
  currentLoans: number;
  overdueBooks: number;
  borrowingTrend: {
    date: string;
    count: number;
  }[];
  mostBorrowed: {
    id: number;
    title: string;
    author: string;
    count: number;
  }[];
}
