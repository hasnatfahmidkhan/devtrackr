export type UserRole = "contributor" | "maintainer";

export interface SignupBody {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string; // returned by pg as ISO string
  updated_at: string;
}

export interface UserWithPassword extends UserResponse {
  password: string;
}
