import axios from "axios";
import {
  ActionResponse,
  ApiResponse,
  Book,
  BookLoanResponse,
  BookResponseData,
  Category,
  CategoryResponseData,
  CreateUserPayload,
  CreateUserResponse,
  DashboardStats,
  DueDateIncreaseRequestResponse,
  FeedbackResponseData,
  GetUsersResponse,
  LoginCredentials,
  StockUpdateResponse,
  User,
  UserResponseData,
} from "@/types";

// Axios Setup
const API_BASE_URL = "http://libms.laravel-sail.site:8080/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

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

//
// ====================== AUTH APIs ======================
//

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

//
// ====================== USER APIs ======================
//

export const getUsers = async (
  page: number = 1,
  per_page: number = 10,
  search?: string
): Promise<GetUsersResponse> => {
  const response = await apiClient.get<UserResponseData>("/v1/users", {
    params: { page, per_page, search },
  });
  return {
    status: "success",
    data: response.data.data,
    meta: response.data.meta,
  };
};

export const createUser = async (
  payload: CreateUserPayload
): Promise<CreateUserResponse> => {
  const response = await apiClient.post<CreateUserResponse>("/v1/users", payload);
  return response.data;
};

//
// ====================== BOOK APIs ======================
//

export const getBooks = async (
  page: number = 1,
  per_page: number = 10,
  search?: string
): Promise<BookResponseData> => {
  const response = await apiClient.get("/v1/books", {
    params: { page, per_page, search },
  });
  return response.data;
};

export const getBook = async (id: number): Promise<ApiResponse<Book>> => {
  const response = await apiClient.get(`/v1/books/${id}`);
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

//
// ====================== BOOK FEEDBACK ======================
//

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

//
// ====================== CATEGORY APIs ======================
//

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

//
// ====================== PHYSICAL STOCK ======================
//

export const updatePhysicalStock = async (
  bookId: number,
  quantity: number
): Promise<StockUpdateResponse> => {
  const response = await apiClient.put(`/v1/books/${bookId}/stock`, { quantity });
  return response.data;
};

//
// ====================== BOOK LOAN APIs ======================
//

export const getBookLoans = async (
  page: number = 1,
  perPage: number = 10,
  status?: string,
  dueDate?: string,
  search?: string
): Promise<BookLoanResponse> => {
  const response = await apiClient.get('/v1/book-loans', {
    params: {
      page,
      per_page: perPage,
      status,
      due_date: dueDate,
      search,
    },
  });
  return response.data;
};

export const approveBookLoan = async (loanId: number): Promise<ActionResponse> => {
  const response = await apiClient.put(`/v1/book-loans/${loanId}/approve`);
  return response.data;
};

export const rejectBookLoan = async (loanId: number): Promise<ActionResponse> => {
  const response = await apiClient.put(`/v1/book-loans/${loanId}/reject`);
  return response.data;
};

export const distributeBookLoan = async (loanId: number): Promise<ActionResponse> => {
  const response = await apiClient.put(`/v1/book-loans/${loanId}/distribute`);
  return response.data;
};

export const returnBook = async (loanId: number): Promise<ActionResponse> => {
  const response = await apiClient.put(`/v1/book-loans/${loanId}/return`);
  return response.data;
};

//
// ========== DUE DATE INCREASE REQUEST APIs ==========
//

export const getDueDateIncreaseRequests = async (
  page: number = 1,
  perPage: number = 10,
  search?: string,
  status?: 'pending' | 'approved' | 'rejected'
): Promise<DueDateIncreaseRequestResponse> => {
  const response = await apiClient.get('/v1/book-loans/due-date-increase-requests', {
    params: {
      page,
      per_page: perPage,
      search,
      status,
    },
  });
  return response.data;
};

export const actionDueDateRequest = async (
  requestId: number,
  status: 'approved' | 'rejected'
): Promise<ActionResponse> => {
  const response = await apiClient.put(`/v1/book-loans/${requestId}/action-due-date-request/${status}`);
  return response.data;
};


export const getDashboardStats = async (): Promise<{ status: string; data: DashboardStats; message: string }> => {
  const response = await apiClient.get('/v1/dashboard');
  return response.data;
};