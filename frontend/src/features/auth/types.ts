export interface User {
  id: string;
  email: string;
  role: string;
}

export interface PermissionNode {
  module: string;
  actions: string[]; // e.g., 'read', 'add', 'edit', 'delete', 'printx', 'confirm', 'upload'
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  grantedPermissions: PermissionNode[] | ['*'];
}

export interface LoginPayload {
  email: string; // Legacy used username, migrating to email or keeping username based on Supabase config
  password: string;
}
