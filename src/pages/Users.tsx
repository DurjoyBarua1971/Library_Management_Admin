import { useEffect, useState } from "react";
import { User, CreateUserPayload } from "@/types";
import { getUsers, createUser } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/lib/utils";
import {
  UserHeader,
  UserSearch,
  UserTable,
  AddUserDialog,
} from "@/components/User";

const Users = () => {
  const PER_PAGE = 10;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: PER_PAGE,
    total: 0,
  });
  const [userForm, setUserForm] = useState<CreateUserPayload>({
    name: "",
    email: "",
    role: "user",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateUserPayload, string>>
  >({});
  const { toast } = useToast();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const resetForm = () => {
    setUserForm({ name: "", email: "", role: "user" });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateUserPayload, string>> = {};
    if (!userForm?.name.trim()) newErrors.name = "Name is required";
    if (!userForm?.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!userForm?.role) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchUsers = async (page: number, perPage: number, search?: string) => {
    try {
      setLoading(true);
      const response = await getUsers(page, perPage, search);
      if (response.status === "success") {
        setUsers(response.data);
        setPaginationMeta({
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          per_page: response.meta.per_page,
          total: response.meta.total,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, PER_PAGE, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmissionLoading(true);
      const response = await createUser(userForm);
      if (response.user) {
        await fetchUsers(1, PER_PAGE, debouncedSearchQuery);
        setCurrentPage(1);
        toast({
          title: "Success",
          description: "User created successfully",
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setSubmissionLoading(false);
      resetForm();
    }
  };

  const handleFieldChange = (field: keyof CreateUserPayload, value: string) => {
    setUserForm({ ...userForm, [field]: value });
    validateForm();
  };

  return (
    <div className="space-y-6">
      <UserHeader onAddUser={() => setIsDialogOpen(true)} />
      <UserSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <UserTable
        users={users}
        loading={loading}
        paginationMeta={paginationMeta}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <AddUserDialog
        isOpen={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}
        onSubmit={handleSubmit}
        userForm={userForm}
        errors={errors}
        handleFieldChange={handleFieldChange}
        submissionLoading={submissionLoading}
      />
    </div>
  );
};

export default Users;