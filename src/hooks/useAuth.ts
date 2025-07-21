/**
 * Authentication Hooks - Beautiful auth state management
 * Comprehensive authentication with token management, auto-refresh, and security
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useGlobalStore } from '@/store/globalStore';
import { useLocalStorage } from './useLocalStorage';
import { logger } from '@/lib/logger';
import type { UserProfile } from '@/types';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  acceptTerms: boolean;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

// Main authentication hook
export function useAuth(): AuthState & AuthActions {
  const navigate = useNavigate();
  const { user, isAuthenticated, setUser, addError, addNotification } = useGlobalStore();
  const [tokens, setTokens] = useLocalStorage<AuthTokens>('auth-tokens');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-refresh token before expiration
  useEffect(() => {
    if (tokens && tokens.expiresAt) {
      const timeUntilExpiry = tokens.expiresAt - Date.now();
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0); // Refresh 5 minutes before expiry

      if (refreshTime > 0) {
        refreshTimeoutRef.current = setTimeout(() => {
          refreshAuth();
        }, refreshTime);
      }
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [tokens]);

  // Check authentication status on mount
  useEffect(() => {
    if (tokens && tokens.accessToken && !user) {
      refreshAuth();
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with actual API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      const { user: userData, accessToken, refreshToken, expiresIn } = data;

      const authTokens: AuthTokens = {
        accessToken,
        refreshToken,
        expiresAt: Date.now() + expiresIn * 1000,
      };

      setTokens(authTokens);
      setUser(userData);
      
      toast.success(`Welcome back, ${userData.name}!`);
      addNotification({
        type: 'success',
        title: 'Login Successful',
        message: 'You have been successfully logged in.',
      });

      logger.info('User logged in successfully', {
        component: 'useAuth',
        action: 'login_success',
        metadata: { userId: userData.id, email: userData.email },
      });

      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      addError({
        code: 'LOGIN_ERROR',
        message: errorMessage,
        severity: 'high',
      });

      logger.error('Login failed', {
        component: 'useAuth',
        action: 'login_error',
        metadata: { email: credentials.email, error: errorMessage },
      });
    } finally {
      setIsLoading(false);
    }
  }, [setTokens, setUser, addError, addNotification, navigate]);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with actual API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const responseData = await response.json();
      
      toast.success('Registration successful! Please check your email to verify your account.');
      addNotification({
        type: 'info',
        title: 'Email Verification Required',
        message: 'Please check your email and click the verification link to activate your account.',
      });

      logger.info('User registered successfully', {
        component: 'useAuth',
        action: 'register_success',
        metadata: { email: data.email, name: data.name },
      });

      navigate('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      addError({
        code: 'REGISTER_ERROR',
        message: errorMessage,
        severity: 'high',
      });

      logger.error('Registration failed', {
        component: 'useAuth',
        action: 'register_error',
        metadata: { email: data.email, error: errorMessage },
      });
    } finally {
      setIsLoading(false);
    }
  }, [addError, addNotification, navigate]);

  const logout = useCallback(() => {
    setTokens(undefined);
    setUser(null);
    setError(null);
    
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    toast.success('You have been logged out successfully');
    addNotification({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been successfully logged out.',
    });

    logger.info('User logged out', {
      component: 'useAuth',
      action: 'logout',
    });

    navigate('/');
  }, [setTokens, setUser, addNotification, navigate]);

  const refreshAuth = useCallback(async () => {
    if (!tokens?.refreshToken) {
      logout();
      return;
    }

    try {
      // Simulate API call - replace with actual API
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.refreshToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const { user: userData, accessToken, refreshToken, expiresIn } = data;

      const newTokens: AuthTokens = {
        accessToken,
        refreshToken,
        expiresAt: Date.now() + expiresIn * 1000,
      };

      setTokens(newTokens);
      setUser(userData);

      logger.debug('Auth token refreshed', {
        component: 'useAuth',
        action: 'token_refresh_success',
        metadata: { userId: userData.id },
      });
    } catch (error) {
      logger.error('Token refresh failed', {
        component: 'useAuth',
        action: 'token_refresh_error',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      logout();
    }
  }, [tokens, setTokens, setUser, logout]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!tokens?.accessToken || !user) {
      throw new Error('Not authenticated');
    }

    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      
      toast.success('Profile updated successfully');
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully.',
      });

      logger.info('Profile updated', {
        component: 'useAuth',
        action: 'profile_update_success',
        metadata: { userId: user.id, updates: Object.keys(updates) },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      toast.error(errorMessage);
      addError({
        code: 'PROFILE_UPDATE_ERROR',
        message: errorMessage,
        severity: 'medium',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [tokens, user, setUser, addError, addNotification]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!tokens?.accessToken) {
      throw new Error('Not authenticated');
    }

    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Password change failed');
      }

      toast.success('Password changed successfully');
      addNotification({
        type: 'success',
        title: 'Password Changed',
        message: 'Your password has been changed successfully.',
      });

      logger.info('Password changed', {
        component: 'useAuth',
        action: 'password_change_success',
        metadata: { userId: user?.id },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password change failed';
      toast.error(errorMessage);
      addError({
        code: 'PASSWORD_CHANGE_ERROR',
        message: errorMessage,
        severity: 'medium',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [tokens, user, addError, addNotification]);

  const requestPasswordReset = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Password reset request failed');
      }

      toast.success('Password reset email sent');
      addNotification({
        type: 'info',
        title: 'Password Reset Email Sent',
        message: 'Please check your email for password reset instructions.',
      });

      logger.info('Password reset requested', {
        component: 'useAuth',
        action: 'password_reset_request',
        metadata: { email },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset request failed';
      toast.error(errorMessage);
      addError({
        code: 'PASSWORD_RESET_ERROR',
        message: errorMessage,
        severity: 'medium',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addError, addNotification]);

  const verifyEmail = useCallback(async (token: string) => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Email verification failed');
      }

      toast.success('Email verified successfully');
      addNotification({
        type: 'success',
        title: 'Email Verified',
        message: 'Your email has been verified successfully. You can now log in.',
      });

      logger.info('Email verified', {
        component: 'useAuth',
        action: 'email_verification_success',
        metadata: { token },
      });

      navigate('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Email verification failed';
      toast.error(errorMessage);
      addError({
        code: 'EMAIL_VERIFICATION_ERROR',
        message: errorMessage,
        severity: 'high',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addError, addNotification, navigate]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshAuth,
    updateProfile,
    changePassword,
    requestPasswordReset,
    verifyEmail,
  };
}

// Hook for checking permissions
export function usePermissions() {
  const { user } = useGlobalStore();

  const hasPermission = useCallback(
    (permission: string) => {
      return user?.permissions?.includes(permission) || false;
    },
    [user]
  );

  const hasRole = useCallback(
    (role: string) => {
      return user?.role === role;
    },
    [user]
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]) => {
      return permissions.some(permission => hasPermission(permission));
    },
    [hasPermission]
  );

  const hasAllPermissions = useCallback(
    (permissions: string[]) => {
      return permissions.every(permission => hasPermission(permission));
    },
    [hasPermission]
  );

  return {
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
  };
}
