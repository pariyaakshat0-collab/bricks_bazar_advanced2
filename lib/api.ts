const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
  };
}

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('bricksbazar_token');
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
        return {
          success: false,
          error: errorData.error || 'Request failed'
        };
      }

      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  logout() {
    this.setToken(null);
  }

  // Orders endpoints
  async getOrders(status?: string, limit: number = 10) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit.toString());

    return this.request<any>(`/orders?${params.toString()}`);
  }

  async createOrder(orderData: any) {
    return this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  // Suppliers endpoints
  async getSuppliers(filters?: { city?: string; state?: string; material?: string; verified?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.state) params.append('state', filters.state);
    if (filters?.material) params.append('material', filters.material);
    if (filters?.verified) params.append('verified', 'true');

    return this.request<any>(`/suppliers?${params.toString()}`);
  }

  async createSupplier(supplierData: any) {
    return this.request<any>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplierData)
    });
  }

  // Notifications endpoints
  async getNotifications(limit: number = 20, unreadOnly: boolean = false) {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (unreadOnly) params.append('unread', 'true');

    return this.request<any>(`/notifications?${params.toString()}`);
  }

  async createNotification(notificationData: any) {
    return this.request<any>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData)
    });
  }

  // Messages endpoints
  async getMessages(orderId?: string, unreadOnly: boolean = false, limit: number = 50) {
    const params = new URLSearchParams();
    if (orderId) params.append('orderId', orderId);
    if (unreadOnly) params.append('unread', 'true');
    params.append('limit', limit.toString());

    return this.request<any>(`/messages?${params.toString()}`);
  }

  async sendMessage(messageData: any) {
    return this.request<any>('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }

  // Generic GET method
  async get(endpoint: string) {
    return this.request<any>(endpoint, {
      method: 'GET'
    });
  }

  // Generic POST method
  async post(endpoint: string, data: any) {
    return this.request<any>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Generic PUT method
  async put(endpoint: string, data: any) {
    return this.request<any>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Generic DELETE method
  async delete(endpoint: string) {
    return this.request<any>(endpoint, {
      method: 'DELETE'
    });
  }
}

export const apiService = new ApiService();
export const api = apiService;