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
  name: string;
  icon: string;
  deadline: string | null;
  current_amount: number;
  color: string;
}

export interface GoalResponse {
  goal_id: string;
  suggestion: string;
  monthly_amount: number;
  expected_return: number;
}

export interface GoalFullResponse {
  goal_id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  icon: string;
  color: string;
  suggestion: string;
  monthly_amount: number;
  expected_return: number;
  duration_months: number;
}

export interface GoalUpdateRequest {
  amount: number;
}

// Wrapped (Year Review) Types
export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  icon: string;
}

export interface WeeklyData {
  week_label: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface BiggestTransaction {
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface GoalsSummary {
  total_goals: number;
  completed: number;
  in_progress: number;
  total_saved: number;
  total_target: number;
}

export interface WrappedSummary {
  year: number;
  month: number;
  month_name: string;
  user_name: string;
  total_income: number;
  total_expenses: number;
  total_savings: number;
  savings_rate: number;
  income_change: number;
  expense_change: number;
  savings_change: number;
  total_transactions: number;
  average_daily_spending: number;
  top_categories: CategoryBreakdown[];
  most_consistent_category: string;
  biggest_transaction: BiggestTransaction | null;
  weekly_data: WeeklyData[];
  highest_spending_week: string;
  best_savings_week: string;
  goals_summary: GoalsSummary;
  daily_average_spend: number;
  transactions_per_week: number;
  top_spending_day_of_week: string;
  fun_comparisons: string[];
  streak_days_under_budget: number;
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

    getAll: (userId: string) =>
      apiCall<GoalFullResponse[]>(`/savings/goals?user_id=${userId}`, {
        method: 'GET',
      }),

    updateProgress: (goalId: string, data: GoalUpdateRequest) =>
      apiCall<{ goal_id: string; current_amount: number }>(`/savings/goal/${goalId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (goalId: string) =>
      apiCall<{ status: string; message: string }>(`/savings/goal/${goalId}`, {
        method: 'DELETE',
      }),
  },

  // Wrapped (Monthly Review) endpoints
  wrapped: {
    getSummary: (userId: string, year: number, month: number) =>
      apiCall<WrappedSummary>(
        `/wrapped/summary?user_id=${userId}&year=${year}&month=${month}`,
        { method: 'GET' }
      ),
  },
};

export default api;
