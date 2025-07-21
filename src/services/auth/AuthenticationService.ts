/**
 * Authentication & Authorization Service
 * JWT-based authentication with role-based access control and OAuth integration
 */

import { logger } from '@/lib/logger';
import { useGlobalStore } from '@/store/globalStore';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: string[];
  permissions: string[];
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  tokenType: 'Bearer';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  acceptTerms: boolean;
}

export interface OAuthProvider {
  name: string;
  clientId: string;
  redirectUri: string;
  scope: string[];
  authUrl: string;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
  isAuthenticated: boolean;
  expiresAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean;
}

// JWT Token Manager
class TokenManager {
  private readonly SECRET_KEY = 'your-secret-key'; // In production, use environment variable
  private readonly ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
  private readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

  generateTokens(user: User): AuthTokens {
    const now = new Date();
    const accessTokenExpiry = new Date(now.getTime() + this.ACCESS_TOKEN_EXPIRY);
    const refreshTokenExpiry = new Date(now.getTime() + this.REFRESH_TOKEN_EXPIRY);

    // Mock JWT generation - in production, use a proper JWT library
    const accessToken = this.createMockJWT({
      sub: user.id,
      email: user.email,
      roles: user.roles,
      exp: Math.floor(accessTokenExpiry.getTime() / 1000),
      iat: Math.floor(now.getTime() / 1000),
      type: 'access',
    });

    const refreshToken = this.createMockJWT({
      sub: user.id,
      exp: Math.floor(refreshTokenExpiry.getTime() / 1000),
      iat: Math.floor(now.getTime() / 1000),
      type: 'refresh',
    });

    return {
      accessToken,
      refreshToken,
      expiresAt: accessTokenExpiry,
      tokenType: 'Bearer',
    };
  }

  private createMockJWT(payload: any): string {
    // Mock JWT - in production, use jsonwebtoken library
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadStr = btoa(JSON.stringify(payload));
    const signature = btoa(`${header}.${payloadStr}.${this.SECRET_KEY}`);
    
    return `${header}.${payloadStr}.${signature}`;
  }

  validateToken(token: string): any | null {
    try {
      // Mock JWT validation - in production, use proper JWT verification
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp < now) {
        return null; // Token expired
      }

      return payload;
    } catch (error) {
      logger.error('Token validation failed', {
        component: 'TokenManager',
        action: 'validate_token',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      return null;
    }
  }

  refreshAccessToken(refreshToken: string): AuthTokens | null {
    const payload = this.validateToken(refreshToken);
    
    if (!payload || payload.type !== 'refresh') {
      return null;
    }

    // Mock user lookup - in production, fetch from database
    const user: User = {
      id: payload.sub,
      email: 'user@example.com',
      name: 'John Doe',
      roles: ['user'],
      permissions: [],
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {},
    };

    return this.generateTokens(user);
  }
}

// Role-Based Access Control
class RBACManager {
  private roles: Map<string, Role> = new Map();
  private permissions: Map<string, Permission> = new Map();

  constructor() {
    this.initializeDefaultRoles();
  }

  private initializeDefaultRoles(): void {
    // Define permissions
    const permissions: Permission[] = [
      { id: 'user:read', name: 'Read User', description: 'View user profiles', resource: 'user', action: 'read' },
      { id: 'user:write', name: 'Write User', description: 'Edit user profiles', resource: 'user', action: 'write' },
      { id: 'career:predict', name: 'Career Predict', description: 'Access career predictions', resource: 'career', action: 'predict' },
      { id: 'admin:manage', name: 'Admin Manage', description: 'Administrative access', resource: 'admin', action: 'manage' },
      { id: 'analytics:view', name: 'View Analytics', description: 'View analytics data', resource: 'analytics', action: 'view' },
    ];

    permissions.forEach(permission => {
      this.permissions.set(permission.id, permission);
    });

    // Define roles
    const roles: Role[] = [
      {
        id: 'user',
        name: 'User',
        description: 'Standard user with basic access',
        permissions: [
          this.permissions.get('user:read')!,
          this.permissions.get('career:predict')!,
        ],
        isDefault: true,
      },
      {
        id: 'premium',
        name: 'Premium User',
        description: 'Premium user with enhanced features',
        permissions: [
          this.permissions.get('user:read')!,
          this.permissions.get('user:write')!,
          this.permissions.get('career:predict')!,
          this.permissions.get('analytics:view')!,
        ],
        isDefault: false,
      },
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Full administrative access',
        permissions: Array.from(this.permissions.values()),
        isDefault: false,
      },
    ];

    roles.forEach(role => {
      this.roles.set(role.id, role);
    });
  }

  hasPermission(userRoles: string[], requiredPermission: string): boolean {
    for (const roleName of userRoles) {
      const role = this.roles.get(roleName);
      if (role && role.permissions.some(p => p.id === requiredPermission)) {
        return true;
      }
    }
    return false;
  }

  getUserPermissions(userRoles: string[]): Permission[] {
    const permissions: Permission[] = [];
    const permissionIds = new Set<string>();

    for (const roleName of userRoles) {
      const role = this.roles.get(roleName);
      if (role) {
        role.permissions.forEach(permission => {
          if (!permissionIds.has(permission.id)) {
            permissions.push(permission);
            permissionIds.add(permission.id);
          }
        });
      }
    }

    return permissions;
  }

  getAllRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  getRole(roleId: string): Role | undefined {
    return this.roles.get(roleId);
  }
}

// OAuth Integration
class OAuthManager {
  private providers: Map<string, OAuthProvider> = new Map();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    const providers: OAuthProvider[] = [
      {
        name: 'google',
        clientId: process.env.VITE_GOOGLE_CLIENT_ID || 'mock-google-client-id',
        redirectUri: `${window.location.origin}/auth/callback/google`,
        scope: ['openid', 'email', 'profile'],
        authUrl: 'https://accounts.google.com/oauth/authorize',
      },
      {
        name: 'github',
        clientId: process.env.VITE_GITHUB_CLIENT_ID || 'mock-github-client-id',
        redirectUri: `${window.location.origin}/auth/callback/github`,
        scope: ['user:email'],
        authUrl: 'https://github.com/login/oauth/authorize',
      },
      {
        name: 'linkedin',
        clientId: process.env.VITE_LINKEDIN_CLIENT_ID || 'mock-linkedin-client-id',
        redirectUri: `${window.location.origin}/auth/callback/linkedin`,
        scope: ['r_liteprofile', 'r_emailaddress'],
        authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
      },
    ];

    providers.forEach(provider => {
      this.providers.set(provider.name, provider);
    });
  }

  getAuthUrl(providerName: string, state?: string): string | null {
    const provider = this.providers.get(providerName);
    if (!provider) {
      return null;
    }

    const params = new URLSearchParams({
      client_id: provider.clientId,
      redirect_uri: provider.redirectUri,
      scope: provider.scope.join(' '),
      response_type: 'code',
      ...(state && { state }),
    });

    return `${provider.authUrl}?${params.toString()}`;
  }

  async handleCallback(providerName: string, code: string): Promise<User | null> {
    try {
      // Mock OAuth callback handling - in production, exchange code for tokens
      logger.info('OAuth callback received', {
        component: 'OAuthManager',
        action: 'handle_callback',
        metadata: { provider: providerName },
      });

      // Mock user data from OAuth provider
      const mockUser: User = {
        id: `oauth-${providerName}-${Date.now()}`,
        email: `user@${providerName}.com`,
        name: `${providerName} User`,
        avatar: `https://avatar.${providerName}.com/user.jpg`,
        roles: ['user'],
        permissions: [],
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          provider: providerName,
          oauthId: `${providerName}-123456`,
        },
      };

      return mockUser;
    } catch (error) {
      logger.error('OAuth callback failed', {
        component: 'OAuthManager',
        action: 'handle_callback',
        metadata: { 
          provider: providerName,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      return null;
    }
  }

  getProviders(): OAuthProvider[] {
    return Array.from(this.providers.values());
  }
}

// Main Authentication Service
export class AuthenticationService {
  private tokenManager: TokenManager;
  private rbacManager: RBACManager;
  private oauthManager: OAuthManager;
  private currentSession: AuthSession | null = null;

  constructor() {
    this.tokenManager = new TokenManager();
    this.rbacManager = new RBACManager();
    this.oauthManager = new OAuthManager();
    
    this.loadStoredSession();
  }

  private loadStoredSession(): void {
    try {
      const storedSession = localStorage.getItem('auth_session');
      if (storedSession) {
        const session = JSON.parse(storedSession);
        
        // Validate stored token
        const tokenPayload = this.tokenManager.validateToken(session.tokens.accessToken);
        if (tokenPayload) {
          this.currentSession = {
            ...session,
            expiresAt: new Date(session.expiresAt),
          };
          
          // Update global store
          const setUser = useGlobalStore.getState().setUser;
          setUser(session.user);
        }
      }
    } catch (error) {
      logger.error('Failed to load stored session', {
        component: 'AuthenticationService',
        action: 'load_stored_session',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthSession | null> {
    try {
      logger.info('User login attempt', {
        component: 'AuthenticationService',
        action: 'login',
        metadata: { email: credentials.email },
      });

      // Mock authentication - in production, verify against database
      if (credentials.email === 'demo@pathfinder.ai' && credentials.password === 'demo123') {
        const user: User = {
          id: 'user-demo-123',
          email: credentials.email,
          name: 'Demo User',
          avatar: 'https://avatar.example.com/demo.jpg',
          roles: ['user'],
          permissions: this.rbacManager.getUserPermissions(['user']),
          isEmailVerified: true,
          lastLoginAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: {},
        };

        const tokens = this.tokenManager.generateTokens(user);
        
        const session: AuthSession = {
          user,
          tokens,
          isAuthenticated: true,
          expiresAt: tokens.expiresAt,
        };

        this.currentSession = session;
        
        // Store session
        if (credentials.rememberMe) {
          localStorage.setItem('auth_session', JSON.stringify(session));
        }

        // Update global store
        const setUser = useGlobalStore.getState().setUser;
        setUser(user);

        logger.info('User login successful', {
          component: 'AuthenticationService',
          action: 'login_success',
          metadata: { userId: user.id, email: user.email },
        });

        return session;
      }

      logger.warn('Invalid login credentials', {
        component: 'AuthenticationService',
        action: 'login_failed',
        metadata: { email: credentials.email },
      });

      return null;
    } catch (error) {
      logger.error('Login failed', {
        component: 'AuthenticationService',
        action: 'login_error',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      return null;
    }
  }

  async register(data: RegisterData): Promise<User | null> {
    try {
      logger.info('User registration attempt', {
        component: 'AuthenticationService',
        action: 'register',
        metadata: { email: data.email, name: data.name },
      });

      // Mock registration - in production, create user in database
      const user: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name,
        roles: ['user'],
        permissions: this.rbacManager.getUserPermissions(['user']),
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      logger.info('User registration successful', {
        component: 'AuthenticationService',
        action: 'register_success',
        metadata: { userId: user.id, email: user.email },
      });

      return user;
    } catch (error) {
      logger.error('Registration failed', {
        component: 'AuthenticationService',
        action: 'register_error',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      return null;
    }
  }

  async logout(): Promise<void> {
    logger.info('User logout', {
      component: 'AuthenticationService',
      action: 'logout',
      metadata: { userId: this.currentSession?.user.id },
    });

    this.currentSession = null;
    localStorage.removeItem('auth_session');
    
    // Update global store
    const setUser = useGlobalStore.getState().setUser;
    setUser(null);
  }

  async refreshSession(): Promise<AuthSession | null> {
    if (!this.currentSession?.tokens.refreshToken) {
      return null;
    }

    const newTokens = this.tokenManager.refreshAccessToken(this.currentSession.tokens.refreshToken);
    if (!newTokens) {
      await this.logout();
      return null;
    }

    this.currentSession.tokens = newTokens;
    this.currentSession.expiresAt = newTokens.expiresAt;

    // Update stored session
    localStorage.setItem('auth_session', JSON.stringify(this.currentSession));

    return this.currentSession;
  }

  getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }

  getCurrentUser(): User | null {
    return this.currentSession?.user || null;
  }

  isAuthenticated(): boolean {
    return this.currentSession?.isAuthenticated || false;
  }

  hasPermission(permission: string): boolean {
    if (!this.currentSession?.user) {
      return false;
    }

    return this.rbacManager.hasPermission(this.currentSession.user.roles, permission);
  }

  // OAuth methods
  getOAuthUrl(provider: string, state?: string): string | null {
    return this.oauthManager.getAuthUrl(provider, state);
  }

  async handleOAuthCallback(provider: string, code: string): Promise<AuthSession | null> {
    const user = await this.oauthManager.handleCallback(provider, code);
    if (!user) {
      return null;
    }

    const tokens = this.tokenManager.generateTokens(user);
    
    const session: AuthSession = {
      user,
      tokens,
      isAuthenticated: true,
      expiresAt: tokens.expiresAt,
    };

    this.currentSession = session;
    localStorage.setItem('auth_session', JSON.stringify(session));

    // Update global store
    const setUser = useGlobalStore.getState().setUser;
    setUser(user);

    return session;
  }

  getOAuthProviders(): OAuthProvider[] {
    return this.oauthManager.getProviders();
  }

  // RBAC methods
  getAllRoles(): Role[] {
    return this.rbacManager.getAllRoles();
  }

  getUserPermissions(): Permission[] {
    if (!this.currentSession?.user) {
      return [];
    }

    return this.rbacManager.getUserPermissions(this.currentSession.user.roles);
  }
}

// Singleton instance
export const authenticationService = new AuthenticationService();

export default authenticationService;
