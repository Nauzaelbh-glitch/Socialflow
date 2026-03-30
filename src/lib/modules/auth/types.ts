export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface Company {
  id: string;
  name: string;
  slug: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  company: Company | null;
  lastLoginAt: string | null;
}
