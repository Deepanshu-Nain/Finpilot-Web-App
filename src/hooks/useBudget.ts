import { useState, useCallback, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  allocated: number;
  spent: number;
  color: string;
}

export interface Transaction {
  id: string;
  categoryId: string;
  amount: number;
  type: 'expense' | 'income';
  description: string;
  date: Date;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | null;
  icon: string;
  color: string;
  suggestion?: string;
  monthlyAmount?: number;
  expectedReturn?: number;
}

// Map frontend category names to backend categories
const CATEGORY_MAPPING: Record<string, string> = {
  'Housing': 'rent',
  'Food': 'food',
  'Transport': 'transport',
  'Entertainment': 'entertainment',
  'Utilities': 'misc',
  'Shopping': 'misc',
  'Health': 'misc',
  'Savings': 'savings',
};

// Reverse mapping for backend to frontend
const REVERSE_CATEGORY_MAPPING: Record<string, string> = {
  'rent': 'Housing',
  'food': 'Food',
  'transport': 'Transport',
  'entertainment': 'Entertainment',
  'misc': 'Utilities',
  'savings': 'Savings',
};

const defaultCategories: BudgetCategory[] = [
  { id: '1', name: 'Housing', icon: '🏠', allocated: 0, spent: 0, color: '#7c3aed' },
  { id: '2', name: 'Food', icon: '🍕', allocated: 0, spent: 0, color: '#2563eb' },
  { id: '3', name: 'Transport', icon: '🚗', allocated: 0, spent: 0, color: '#ef4444' },
  { id: '4', name: 'Entertainment', icon: '🎬', allocated: 0, spent: 0, color: '#f59e0b' },
  { id: '5', name: 'Utilities', icon: '⚡', allocated: 0, spent: 0, color: '#10b981' },
  { id: '6', name: 'Shopping', icon: '🛍️', allocated: 0, spent: 0, color: '#ec4899' },
  { id: '7', name: 'Health', icon: '💊', allocated: 0, spent: 0, color: '#06b6d4' },
  { id: '8', name: 'Savings', icon: '💰', allocated: 0, spent: 0, color: '#f97316' },
];

export const useBudget = () => {
  const { user } = useAuth();
  const [salary, setSalary] = useState<number>(0);
  const [categories, setCategories] = useState<BudgetCategory[]>(defaultCategories);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get current month in YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  // Load dashboard data when user is authenticated
  useEffect(() => {
    if (user) {
      loadDashboardData();
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;
    try {
      const backendGoals = await api.goals.getAll(user.user_id);
      const mappedGoals: SavingsGoal[] = backendGoals.map(g => ({
        id: g.goal_id,
        name: g.name,
        targetAmount: g.target_amount,
        currentAmount: g.current_amount,
        deadline: g.deadline ? new Date(g.deadline) : null,
        icon: g.icon,
        color: g.color,
        suggestion: g.suggestion,
        monthlyAmount: g.monthly_amount,
        expectedReturn: g.expected_return,
      }));
      setGoals(mappedGoals);
    } catch (error: any) {
      console.error('Failed to load goals:', error);
    }
  };

  const loadDashboardData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const month = getCurrentMonth();
      const summary = await api.dashboard.getSummary(user.user_id, month);

      // Update categories with backend data
      const updatedCategories = defaultCategories.map(cat => {
        const backendCategory = CATEGORY_MAPPING[cat.name];
        const categoryData = summary.breakdown.find(b => b.category === backendCategory);
        
        return {
          ...cat,
          allocated: categoryData?.allocated || 0,
          spent: categoryData?.spent || 0,
        };
      });

      setCategories(updatedCategories);
      setSalary(summary.total_budget);

      // Load transaction history
      const history = await api.transactions.getHistory(user.user_id);
      const mappedTransactions: Transaction[] = history.map(txn => ({
        id: txn.id,
        categoryId: Object.keys(CATEGORY_MAPPING).find(
          key => CATEGORY_MAPPING[key] === txn.category
        ) || '5',
        amount: txn.amount,
        type: txn.type === 'debit' ? 'expense' : 'income',
        description: txn.description,
        date: new Date(txn.date),
      }));
      setTransactions(mappedTransactions);
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      // Don't show error toast on initial load, data might not exist yet
    } finally {
      setIsLoading(false);
    }
  };

  const predictBudget = useCallback(async (monthlySalary: number) => {
    if (!user) {
      toast.error('Please login to use this feature');
      return defaultCategories;
    }

    setIsLoading(true);
    try {
      const month = getCurrentMonth();
      const response = await api.salary.setSalary({
        user_id: user.user_id,
        amount: monthlySalary,
        month,
      });

      // Map backend allocation to frontend categories
      const newCategories = defaultCategories.map(cat => {
        const backendCategory = CATEGORY_MAPPING[cat.name];
        const allocated = response.predicted_allocation[backendCategory] || 0;
        
        return {
          ...cat,
          allocated: Math.round(allocated),
          spent: 0,
        };
      });

      setSalary(monthlySalary);
      setCategories(newCategories);
      toast.success('Budget predicted successfully!');
      return newCategories;
    } catch (error: any) {
      console.error('Failed to predict budget:', error);
      toast.error('Failed to predict budget');
      return defaultCategories;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addTransaction = useCallback(async (
    categoryId: string,
    amount: number,
    type: 'expense' | 'income',
    description: string
  ) => {
    if (!user) {
      toast.error('Please login to use this feature');
      return null;
    }

    const category = categories.find(c => c.id === categoryId);
    if (!category) {
      toast.error('Invalid category');
      return null;
    }

    setIsLoading(true);
    try {
      const backendCategory = CATEGORY_MAPPING[category.name];
      const date = getCurrentDate();

      await api.transactions.add({
        user_id: user.user_id,
        amount,
        type: type === 'expense' ? 'debit' : 'credit',
        category: backendCategory,
        date,
        description: description || 'Transaction',
      });

      // Create local transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        categoryId,
        amount,
        type,
        description,
        date: new Date(),
      };

      setTransactions(prev => [newTransaction, ...prev]);

      // Update category spent amount
      if (type === 'expense') {
        setCategories(prev => prev.map(cat => 
          cat.id === categoryId 
            ? { ...cat, spent: cat.spent + amount }
            : cat
        ));
      }

      toast.success('Transaction added successfully!');
      return newTransaction;
    } catch (error: any) {
      console.error('Failed to add transaction:', error);
      toast.error('Failed to add transaction');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, categories]);

  const addGoal = useCallback(async (
    name: string,
    targetAmount: number,
    deadline: Date | null,
    icon: string
  ) => {
    if (!user) {
      toast.error('Please login to use this feature');
      return null;
    }

    setIsLoading(true);
    try {
      // Calculate duration in months
      const durationMonths = deadline 
        ? Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))
        : 12; // Default to 12 months if no deadline

      const colors = [
        'hsl(142, 40%, 45%)',
        'hsl(152, 68%, 70%)',
        'hsl(140, 30%, 35%)',
        'hsl(155, 45%, 55%)',
        'hsl(148, 50%, 60%)',
      ];
      const color = colors[goals.length % colors.length];

      const response = await api.goals.create({
        user_id: user.user_id,
        target_amount: targetAmount,
        duration_months: Math.max(1, durationMonths),
        name,
        icon,
        deadline: deadline ? deadline.toISOString().split('T')[0] : null,
        current_amount: 0,
        color,
      });

      const newGoal: SavingsGoal = {
        id: response.goal_id,
        name,
        targetAmount,
        currentAmount: 0,
        deadline,
        icon,
        color,
        suggestion: response.suggestion,
        monthlyAmount: response.monthly_amount,
        expectedReturn: response.expected_return,
      };

      setGoals(prev => [...prev, newGoal]);
      toast.success('Goal created successfully!');
      return newGoal;
    } catch (error: any) {
      console.error('Failed to create goal:', error);
      toast.error('Failed to create goal');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, goals.length]);

  const updateGoalProgress = useCallback(async (goalId: string, amount: number) => {
    if (!user) {
      toast.error('Please login to use this feature');
      return;
    }
    try {
      const response = await api.goals.updateProgress(goalId, { amount });
      setGoals(prev => prev.map(goal =>
        goal.id === goalId
          ? { ...goal, currentAmount: response.current_amount }
          : goal
      ));
      toast.success('Goal progress updated!');
    } catch (error: any) {
      console.error('Failed to update goal progress:', error);
      toast.error('Failed to update goal progress');
    }
  }, [user]);

  const deleteGoal = useCallback(async (goalId: string) => {
    if (!user) {
      toast.error('Please login to use this feature');
      return;
    }
    try {
      await api.goals.delete(goalId);
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      toast.success('Goal deleted!');
    } catch (error: any) {
      console.error('Failed to delete goal:', error);
      toast.error('Failed to delete goal');
    }
  }, [user]);

  const totalBudget = categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return {
    salary,
    setSalary,
    categories,
    setCategories,
    transactions,
    goals,
    predictBudget,
    addTransaction,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    totalBudget,
    totalSpent,
    totalRemaining,
    isLoading,
    loadDashboardData,
  };
};
