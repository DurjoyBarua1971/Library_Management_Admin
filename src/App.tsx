
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Users from "./pages/Users";
import Categories from "./pages/Categories";
import PhysicalStock from "./pages/PhysicalStock";
import BookLoans from "./pages/BookLoans";
import NotFound from "./pages/NotFound";
import BookDetailsPage from "./components/Book/BookDetailsPage";
import DateExtension from "./pages/DateExtension";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="books" element={<Books />} />
              <Route path="books/:id" element={<BookDetailsPage />} />
              <Route path="users" element={<Users />} />
              <Route path="categories" element={<Categories />} />
              <Route path="stock" element={<PhysicalStock />} />
              <Route path="extension" element={<DateExtension />} />
              <Route path="loans" element={<BookLoans />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
