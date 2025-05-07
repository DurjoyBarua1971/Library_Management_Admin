import { CreateUserPayload } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormMessage } from '@/components/ui/form';

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  userForm: CreateUserPayload;
  setUserForm: (form: CreateUserPayload) => void;
  errors: Partial<Record<keyof CreateUserPayload, string>>;
  handleFieldChange: (field: keyof CreateUserPayload, value: string) => void;
  isFormValid: () => boolean;
  submissionLoading: boolean;
}

const AddUserDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  userForm,
  setUserForm,
  errors,
  handleFieldChange,
  isFormValid,
  submissionLoading,
}: AddUserDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Add New User</DialogTitle>
        <DialogDescription>Add a new user to the system.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={userForm.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="Enter user name"
          />
          {errors.name && <FormMessage>{errors.name}</FormMessage>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={userForm.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="Enter email address"
          />
          {errors.email && <FormMessage>{errors.email}</FormMessage>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={userForm.role}
            onValueChange={(value) => handleFieldChange('role', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <FormMessage>{errors.role}</FormMessage>}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!isFormValid()}>
          Add User
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default AddUserDialog;