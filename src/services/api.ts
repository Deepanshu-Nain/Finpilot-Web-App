// API Service for Backend Communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Auth Service Types
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user_id: string;
  email: string;
  name: string;
  message: string;
}

// Salary Service Types
export interface SalaryRequest {
  user_id: string;
  amount: number;
  month: string; // Format: "YYYY-MM"
}

export interface AllocationResponse {
  salary: number;
  predicted_allocation: Record<string, number>;
}

// Transaction Service Types
export interface TransactionRequest {
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  date: string; // Format: "YYYY-MM-DD"
  description?: string;
}

export interface TransactionResponse {
  id: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  description: string;
}

// Dashboard Service Types
export interface CategorySummary {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  status: 'over_budget' | 'within_budget';
}

export interface DashboardSummaryResponse {
  month: string;
  total_budget: number;
  total_spent: number;
  remaining_salary: number;
  breakdown: CategorySummary[];
}

// Goal Service Types
export interface GoalRequest {
  user_id: string;
  target_amount: number;
  duration_months: number;
}

export interface GoalResponse {
  goal_id: string;
  suggestion: string;
  monthly_amount: number;
  expected_return: number;
}

// API Service Object
export const api = {
  // Auth endpoints
  auth: {
    register: (data: RegisterRequest) =>
      apiCall<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    login: (data: LoginRequest) =>
      apiCall<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Salary endpoints
  salary: {
    setSalary: (data: SalaryRequest) =>
      apiCall<AllocationResponse>('/salary', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Transaction endpoints
  transactions: {
    add: (data: TransactionRequest) =>
      apiCall<{ id: string; status: string }>('/transactions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    getHistory: (userId: string) =>
      apiCall<TransactionResponse[]>(`/dashboard/history?user_id=${userId}`, {
        method: 'GET',
      }),
    
    getByCategory: (userId: string, category: string) =>
      apiCall<TransactionResponse[]>(
        `/dashboard/category/${category}?user_id=${userId}`,
        { method: 'GET' }
      ),
  },

  // Dashboard endpoints
  dashboard: {
    getSummary: (userId: string, month: string) =>
      apiCall<DashboardSummaryResponse>(
        `/dashboard/summary?user_id=${userId}&month=${month}`,
        { method: 'GET' }
      ),
  },

  // Goals endpoints
  goals: {
    create: (data: GoalRequest) =>
      apiCall<GoalResponse>('/savings/goal', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};

export default api;
