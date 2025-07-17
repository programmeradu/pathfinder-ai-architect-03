import { apiRequest } from './queryClient';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  currentGoal?: string;
  learningStyle?: string;
  skillLevel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: credentials
    });
    
    this.token = response.token;
    localStorage.setItem('auth_token', response.token);
    
    return response;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: credentials
    });
    
    this.token = response.token;
    localStorage.setItem('auth_token', response.token);
    
    return response;
  }

  async getCurrentUser(): Promise<User> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    return await apiRequest('/api/auth/user', {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authService = new AuthService();

// Auth context for React components
export interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}