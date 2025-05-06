import axios from "axios";
import {
  ApiResponse,
  Book,
  BookLoan,
  BookResponseData,
  Category,
  CategoryResponseData,
  DashboardStats,
  Feedback,
  FeedbackResponseData,
  LoginCredentials,
  PhysicalStock,
  User,
} from "@/types";

// This would be replaced with the actual API base URL
const API_BASE_URL = "http://libms.laravel-sail.site:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const loginUser = async (
  credentials: LoginCredentials
): Promise<{ access_token: string; user: User }> => {
  const response = await apiClient.post("/v1/login", credentials);
  return response.data;
};

export const logoutUser = async (): Promise<ApiResponse<null>> => {
  const response = await apiClient.post("/v1/logout");
  return response.data;
};

// User APIs
export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  if (process.env.NODE_ENV === "development") {
    return Promise.resolve({
      status: "success",
      data: mockUsers,
    });
  }

  const response = await apiClient.get("/users");
  return response.data;
};

export const createUser = async (
  user: Omit<User, "id" | "created_at">
): Promise<ApiResponse<User>> => {
  const response = await apiClient.post("/users", user);
  return response.data;
};

export const updateUser = async (
  id: number,
  user: Partial<User>
): Promise<ApiResponse<User>> => {
  const response = await apiClient.put(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

// Book APIs
export const getBooks = async (
  page: number = 1,
  per_page: number = 10
): Promise<BookResponseData> => {
  const response = await apiClient.get("/v1/books", {
    params: { page, per_page },
  });
  return response.data;
};

export const getBook = async (id: number): Promise<ApiResponse<Book>> => {
  const response = await apiClient.get(`/v1/books/${id}`);
  return response.data;
};

export const getFeedback = async (
  bookId: number,
  page: number,
  per_page: number = 10
): Promise<FeedbackResponseData> => {
  const response = await apiClient.get(`v1/books/${bookId}/feedback`, {
    params: { page, per_page },
  });
  return response.data;
};

export const createBook = async (
  book: Omit<Book, "id" | "created_at">
): Promise<ApiResponse<Book>> => {
  const response = await apiClient.post("/v1/books", book);
  return response.data;
};

export const updateBook = async (
  id: number,
  book: Partial<Book>
): Promise<ApiResponse<Book>> => {
  const response = await apiClient.put(`/v1/books/${id}`, book);
  return response.data;
};

export const deleteBook = async (id: number): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete(`/v1/books/${id}`);
  return response.data;
};

export const uploadPdf = async (
  bookId: number,
  file: File
): Promise<ApiResponse<{ url: string }>> => {
  const formData = new FormData();
  formData.append("pdf", file);

  const response = await apiClient.post(`/books/${bookId}/pdf`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Category APIs
export const getCategories = async (
  page: number = 1,
  per_page: number = 10
): Promise<CategoryResponseData> => {
  const response = await apiClient.get("/v1/categories", {
    params: { page, per_page },
  });
  return response.data;
};

export const createCategory = async (
  category: Omit<Category, "id" | "created_at" | "bookCount" | "createdAt">
): Promise<ApiResponse<Category>> => {
  const response = await apiClient.post("/v1/categories", category);
  return response.data;
};

export const updateCategory = async (
  id: number,
  category: Partial<Category>
): Promise<ApiResponse<Category>> => {
  const response = await apiClient.put(`/v1/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (
  id: number
): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete(`/v1/categories/${id}`);
  return response.data;
};

// PhysicalStock APIs
export const getPhysicalStocks = async (): Promise<
  ApiResponse<PhysicalStock[]>
> => {
  if (process.env.NODE_ENV === "development") {
    return Promise.resolve({
      status: "success",
      data: mockPhysicalStocks,
    });
  }

  const response = await apiClient.get("/physical-stocks");
  return response.data;
};

export const updatePhysicalStock = async (
  id: number,
  quantity: number
): Promise<ApiResponse<PhysicalStock>> => {
  const response = await apiClient.put(`/physical-stocks/${id}`, { quantity });
  return response.data;
};

// BookLoan APIs
export const getBookLoans = async (
  status?: string
): Promise<ApiResponse<BookLoan[]>> => {
  if (process.env.NODE_ENV === "development") {
    let loans = mockBookLoans;
    if (status) {
      loans = loans.filter((loan) => loan.status === status);
    }
    return Promise.resolve({
      status: "success",
      data: loans,
    });
  }

  const response = await apiClient.get("/book-loans", {
    params: status ? { status } : undefined,
  });
  return response.data;
};

export const approveBookLoan = async (
  id: number,
  dueDate: string
): Promise<ApiResponse<BookLoan>> => {
  const response = await apiClient.put(`/book-loans/${id}/approve`, {
    due_date: dueDate,
  });
  return response.data;
};

export const rejectBookLoan = async (
  id: number
): Promise<ApiResponse<BookLoan>> => {
  const response = await apiClient.put(`/book-loans/${id}/reject`);
  return response.data;
};

export const returnBook = async (
  id: number
): Promise<ApiResponse<BookLoan>> => {
  const response = await apiClient.put(`/book-loans/${id}/return`);
  return response.data;
};

export const extendDueDate = async (
  id: number,
  dueDate: string
): Promise<ApiResponse<BookLoan>> => {
  const response = await apiClient.put(`/book-loans/${id}/extend`, {
    due_date: dueDate,
  });
  return response.data;
};

// Dashboard APIs
export const getDashboardStats = async (): Promise<
  ApiResponse<DashboardStats>
> => {
  if (process.env.NODE_ENV === "development") {
    return Promise.resolve({
      status: "success",
      data: mockDashboardStats,
    });
  }

  const response = await apiClient.get("/dashboard/stats");
  return response.data;
};

// Mock data for development
const mockUsers: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@example.com",
    role: "user",
    created_at: "2023-01-02T00:00:00Z",
  },
  {
    id: 3,
    name: "Jane Doe",
    email: "jane@example.com",
    role: "user",
    created_at: "2023-01-03T00:00:00Z",
  },
];

// const mockCategories: Category[] = [
//   {
//     id: 1,
//     name: "Fiction",
//     created_at: "2023-01-01T00:00:00Z",
//   },
//   {
//     id: 2,
//     name: "Non-Fiction",
//     created_at: "2023-01-01T00:00:00Z",
//   },
//   {
//     id: 3,
//     name: "Science",
//     created_at: "2023-01-01T00:00:00Z",
//   },
//   {
//     id: 4,
//     name: "History",
//     created_at: "2023-01-01T00:00:00Z",
//   },
//   {
//     id: 5,
//     name: "Biography",
//     created_at: "2023-01-01T00:00:00Z",
//   },
// ];

const mockBooks: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "A novel about the mysterious Jay Gatsby and his love for Daisy Buchanan.",
    category_id: 1,
    has_pdf: true,
    has_physical: true,
    pdf_url: "https://example.com/pdf/great-gatsby.pdf",
    cover_url:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1287&auto=format&fit=crop",
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    description:
      "A book that explores the history of the human species from the Stone Age to the present day.",
    category_id: 2,
    has_pdf: true,
    has_physical: false,
    pdf_url: "https://example.com/pdf/sapiens.pdf",
    cover_url:
      "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1352&auto=format&fit=crop",
    created_at: "2023-01-02T00:00:00Z",
  },
  {
    id: 3,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description:
      "A novel about racial injustice and the loss of innocence in the American South.",
    category_id: 1,
    has_pdf: false,
    has_physical: true,
    cover_url:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1288&auto=format&fit=crop",
    created_at: "2023-01-03T00:00:00Z",
  },
  {
    id: 4,
    title: "Brief Answers to the Big Questions",
    author: "Stephen Hawking",
    description:
      "The final book from Stephen Hawking on the biggest questions facing humanity.",
    category_id: 3,
    has_pdf: true,
    has_physical: true,
    pdf_url: "https://example.com/pdf/brief-answers.pdf",
    cover_url:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1173&auto=format&fit=crop",
    created_at: "2023-01-04T00:00:00Z",
  },
  {
    id: 5,
    title: "The Diary of a Young Girl",
    author: "Anne Frank",
    description:
      "The diary kept by Anne Frank while she was in hiding for two years with her family during the Nazi occupation of the Netherlands.",
    category_id: 4,
    has_pdf: true,
    has_physical: true,
    pdf_url: "https://example.com/pdf/diary-young-girl.pdf",
    cover_url:
      "https://images.unsplash.com/photo-1515098506762-79e1384e9d8e?q=80&w=1171&auto=format&fit=crop",
    created_at: "2023-01-05T00:00:00Z",
  },
];

const mockPhysicalStocks: PhysicalStock[] = [
  {
    id: 1,
    book_id: 1,
    quantity: 5,
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    book_id: 3,
    quantity: 3,
    updated_at: "2023-01-03T00:00:00Z",
  },
  {
    id: 3,
    book_id: 4,
    quantity: 2,
    updated_at: "2023-01-04T00:00:00Z",
  },
  {
    id: 4,
    book_id: 5,
    quantity: 4,
    updated_at: "2023-01-05T00:00:00Z",
  },
];

const mockBookLoans: BookLoan[] = [
  {
    id: 1,
    user_id: 2,
    book_id: 1,
    status: "approved",
    requested_at: "2023-02-01T00:00:00Z",
    approved_at: "2023-02-02T00:00:00Z",
    due_date: "2023-02-16T00:00:00Z",
    user: mockUsers.find((u) => u.id === 2),
    book: mockBooks.find((b) => b.id === 1),
  },
  {
    id: 2,
    user_id: 3,
    book_id: 3,
    status: "pending",
    requested_at: "2023-02-05T00:00:00Z",
    user: mockUsers.find((u) => u.id === 3),
    book: mockBooks.find((b) => b.id === 3),
  },
  {
    id: 3,
    user_id: 2,
    book_id: 4,
    status: "overdue",
    requested_at: "2023-01-10T00:00:00Z",
    approved_at: "2023-01-11T00:00:00Z",
    due_date: "2023-01-25T00:00:00Z",
    user: mockUsers.find((u) => u.id === 2),
    book: mockBooks.find((b) => b.id === 4),
  },
  {
    id: 4,
    user_id: 3,
    book_id: 5,
    status: "approved",
    requested_at: "2023-02-10T00:00:00Z",
    approved_at: "2023-02-11T00:00:00Z",
    due_date: "2023-02-25T00:00:00Z",
    user: mockUsers.find((u) => u.id === 3),
    book: mockBooks.find((b) => b.id === 5),
  },
  {
    id: 5,
    user_id: 2,
    book_id: 3,
    status: "returned",
    requested_at: "2023-01-15T00:00:00Z",
    approved_at: "2023-01-16T00:00:00Z",
    due_date: "2023-01-30T00:00:00Z",
    returned_at: "2023-01-28T00:00:00Z",
    user: mockUsers.find((u) => u.id === 2),
    book: mockBooks.find((b) => b.id === 3),
  },
];

const mockDashboardStats: DashboardStats = {
  totalUsers: mockUsers.length,
  totalBooks: mockBooks.length,
  currentLoans: mockBookLoans.filter((loan) => loan.status === "approved")
    .length,
  overdueBooks: mockBookLoans.filter((loan) => loan.status === "overdue")
    .length,
  borrowingTrend: [
    { date: "2023-01", count: 3 },
    { date: "2023-02", count: 5 },
    { date: "2023-03", count: 2 },
    { date: "2023-04", count: 7 },
    { date: "2023-05", count: 4 },
    { date: "2023-06", count: 6 },
  ],
  mostBorrowed: [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      count: 8,
    },
    {
      id: 3,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      count: 6,
    },
    {
      id: 5,
      title: "The Diary of a Young Girl",
      author: "Anne Frank",
      count: 5,
    },
  ],
};
