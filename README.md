## 🚦 Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/DurjoyBarua1971/Library_Management_Admin.git
   cd Library_Management_Admin
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**  
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## 📚 Library Management Admin - Developer Documentation

### 1. 📌 Project Overview

This **Library Management Admin** project is a **web-based dashboard** designed to manage books, users, categories, stock, loans, and due date extensions for a library system. It is built using **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **shadcn-ui**, offering a modern and scalable solution for library administrators. The system supports full CRUD operations, integrates with backend APIs, and provides a responsive, accessible UI with toast notifications, dark mode, and protected routes. Its modular architecture ensures that it can be easily maintained or extended by new contributors.

### 🔗 Project Repository

[GitHub – Library Management Admin](https://github.com/DurjoyBarua1971/Library_Management_Admin)

---

### 2. 🚀 Feature List

| Feature             | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| Authentication      | Secure login, context-based auth, and route protection        |
| Dashboard Overview  | Displays key statistics related to books, users, and loans    |
| Book Management     | Full CRUD functionality with detailed views and user feedback |
| Category Management | Manage book categories via create, update, delete             |
| User Management     | Admin panel to manage user accounts                           |
| Physical Stock      | Track physical copies of books and update availability        |
| Book Loans          | Approve/reject loan requests, handle distribution and return  |
| Due Date Extensions | Manage extension requests with approval/rejection options     |
| Search & Pagination | Built-in search and paginated views for all major entities    |
| Toast Notifications | Real-time feedback for actions and errors                     |
| Responsive Design   | Works well across devices with dark mode support              |

---

### 3. 🗂️ File & Folder Structure

| File/Folder            | Description                                                             |
| ---------------------- | ----------------------------------------------------------------------- |
| `src/`                 | Main source code directory                                              |
| `components/`          | Reusable UI & domain-specific components (e.g., Book, BookLoan, layout) |
| `contexts/`            | Auth and toast context providers                                        |
| `hooks/`               | Custom React hooks (e.g., `use-toast`, `use-mobile`)                    |
| `lib/`                 | API logic and utility helpers (`api.ts`, `utils.ts`)                    |
| `pages/`               | Page components corresponding to each route                             |
| `types/`               | Shared TypeScript types (e.g., Book, User, Loan)                        |
| `utils/`               | Helper functions for specific features (e.g., `bookUtils.tsx`)          |
| `App.tsx`              | Main application root, routes + providers setup                         |
| `main.tsx`             | React DOM entry point                                                   |
| `index.css`, `App.css` | Global styles                                                           |
| `public/`              | Static assets (e.g., `placeholder.svg`, `robots.txt`)                   |
| `package.json`         | Project metadata and dependencies                                       |
| `vite.config.ts`       | Vite build configuration                                                |
| `tailwind.config.ts`   | Tailwind custom theme setup                                             |
| `tsconfig.json`        | TypeScript compiler config                                              |
| `README.md`            | Project instructions and documentation                                  |

---

### 4. 🧩 Open Source Libraries Used & Customization

- **shadcn-ui**:
  Used for UI components (e.g., `Button`, `Dialog`, `Table`, `Toast`). Heavily styled and composed for domain-specific actions.
- **@radix-ui/react-progress**:
  Used in progress indicators with custom styling via Tailwind.
- **lucide-react**:
  For clean, scalable icons across the dashboard.
- **date-fns**:
  Handles date formatting and calculation (e.g., due date logic).
- **@tanstack/react-query**:
  Manages data fetching, caching, and synchronization across the app.
- **react-router-dom**:
  For client-side routing and navigation control.
- **Tailwind CSS**:
  Utility-first styling; theme customized in `tailwind.config.ts`.
- **Custom Contexts & Hooks**:
  - `AuthContext`: For auth state and user role management.
  - `use-toast`: For globally accessible toast feedback.

---

### 5. ⏱️ Task Estimation

- **Estimated time for a trainee or beginner (without AI):** 15 — 30 working days
  Includes learning authentication flow, API integration, component composition, and handling async operations like loan distribution or due extensions.
- **Estimated time with AI tools (Lovable AI):** 3 — 5 working days
  AI tools help with scaffolding forms, writing reusable components, integrating APIs, and solving errors faster. However, architectural understanding and third-party library composition still need hands-on effort.

### ⚠️ Challenges

1. **Authentication Flow**:

   Implementing protected routes, auth persistence, and role-based UI behavior.

2. **Complex State Management**:

   Especially in dialogs, forms, or components with multiple conditions.

3. **UI Library Composition**:

   shadcn-ui and Radix components are low-level; composing them requires care.

4. **API Handling**:

   Handling edge cases (e.g., 404s, failed updates), managing loaders, error states.

5. **Pagination + Search**:

   Integrating these features smoothly with the data-fetching logic can be confusing.

---

### 6. 🧠 Potential AI Hallucinations / Debugging Notes

| Area                 | Possible Issue                                               | Debugging Tip                                                                      |
| -------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Protected Routes     | AI may misconfigure auth-based route redirection             | Use context-based auth and `react-router-dom` guards carefully                     |
| shadcn-ui Components | AI might hallucinate props or event names                    | Reference [shadcn-ui docs](https://ui.shadcn.com/docs/components) for proper usage |
| React Query          | AI may suggest stale queries or incorrect invalidation logic | Follow React Query mutation lifecycle closely (invalidateQueries)                  |

---

### 7. 🌱 Suggested Features

1. **Role-Based Access Control (RBAC)**

   Allow granular access control by user role (e.g., librarian, admin, manager).

2. **Bulk Import/Export**

   Add CSV import/export for books, users, and categories for faster data management.
