import { useState, useEffect } from 'react';
import { apiService, ApiResponse } from '@/lib/api';

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, dependencies);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall();
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = apiService.getToken();
    if (token) {
      // Decode basic user info from token
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.userId,
          email: payload.email,
          role: payload.role
        });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const response = await apiService.login({ email, password });
    if (response.success) {
      checkAuth();
    }
    return response;
  };

  const register = async (userData: any) => {
    const response = await apiService.register(userData);
    if (response.success) {
      checkAuth();
    }
    return response;
  };

  const logout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, loading, login, register, logout };
}

export function useOrders(status?: string, limit: number = 10) {
  return useApi(
    () => apiService.getOrders(status, limit),
    [status, limit]
  );
}

export function useSuppliers(filters?: { city?: string; state?: string; material?: string; verified?: boolean }) {
  return useApi(
    () => apiService.getSuppliers(filters),
    [JSON.stringify(filters)]
  );
}

export function useNotifications(limit: number = 20, unreadOnly: boolean = false) {
  return useApi(
    () => apiService.getNotifications(limit, unreadOnly),
    [limit, unreadOnly]
  );
}

export function useMessages(orderId?: string, unreadOnly: boolean = false, limit: number = 50) {
  return useApi(
    () => apiService.getMessages(orderId, unreadOnly, limit),
    [orderId, unreadOnly, limit]
  );
}