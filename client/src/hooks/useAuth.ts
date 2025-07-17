import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, type User, type LoginCredentials, type RegisterCredentials } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['auth', 'user'],
    queryFn: () => authService.getCurrentUser(),
    enabled: authService.isAuthenticated(),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await authService.login(credentials);
      return response.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'user'], user);
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${user.username}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await authService.register(credentials);
      return response.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'user'], user);
      toast({
        title: "Welcome to Pathfinder!",
        description: `Account created successfully for ${user.username}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logout = () => {
    authService.logout();
    queryClient.clear();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return {
    user,
    isLoading,
    isAuthenticated: authService.isAuthenticated() && !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
}