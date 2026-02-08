import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { TrendingUp, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BudgetCategory, Transaction } from '@/hooks/useBudget';
import { useState } from 'react';
import { AddCashDialog } from './AddCashDialog';

interface BudgetChartProps {
  categories: BudgetCategory[];
  transactions: Transaction[];
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  onAddTransaction: (categoryId: string, amount: number, type: 'expense' | 'income', description: string) => void;
}

export const BudgetChart = ({ 
  categories, 
  transactions, 
  totalBudget, 
  totalSpent, 
  totalRemaining,
  onAddTransaction 
}: BudgetChartProps) => {
  const [showAddCash, setShowAddCash] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const pieData = categories
    .filter(cat => cat.allocated > 0)
    .map(cat => ({
      name: cat.name,
      value: cat.allocated,
      spent: cat.spent,
      color: cat.color,
      icon: cat.icon,
    }));

  const barData = categories
    .filter(cat => cat.allocated > 0)
    .map(cat => ({
      name: cat.icon,
      fullName: cat.name,
      allocated: cat.allocated,
      spent: cat.spent,
      remaining: Math.max(0, cat.allocated - cat.spent),
    }));

  const recentTransactions = transactions.slice(0, 5);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-lg">
          <p className="font-display font-semibold text-[#2e4f21]">{payload[0].payload.fullName}</p>
          <p className="text-sm text-gray-600">
            Allocated: {formatCurrency(payload[0].payload.allocated)}
          </p>
          <p className="text-sm text-[#2e4f21]">
            Spent: {formatCurrency(payload[0].payload.spent)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#a0f1bd]">
              <TrendingUp className="w-6 h-6 text-[#2e4f21]" />
            </div>
            <div>
              <CardTitle className="font-display text-xl text-[#2e4f21]">Budget Management</CardTitle>
              <CardDescription className="text-gray-600">Track your spending in real-time</CardDescription>
            </div>
          </div>
          <Button 
            onClick={() => setShowAddCash(true)}
            className="bg-[#2e4f21] hover:bg-[#1f3617] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Budget</p>
            <p className="font-display text-2xl font-bold text-[#2e4f21]">{formatCurrency(totalBudget)}</p>
          </div>
          <div className="p-4 rounded-xl bg-red-50 border border-red-200">
            <p className="text-sm text-gray-600 mb-1">Total Spent</p>
            <p className="font-display text-2xl font-bold text-red-600">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#a0f1bd] bg-opacity-20 border border-[#a0f1bd]">
            <p className="text-sm text-gray-600 mb-1">Remaining</p>
            <p className="font-display text-2xl font-bold text-[#2e4f21]">{formatCurrency(totalRemaining)}</p>
          </div>
        </div>

        {/* Chart Section */}
        {totalBudget > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="p-4 rounded-xl bg-gray-50">
              <h4 className="font-display font-semibold mb-4 text-[#2e4f21]">Allocation Overview</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {pieData.slice(0, 6).map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-600">{item.icon} {item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="p-4 rounded-xl bg-gray-50">
              <h4 className="font-display font-semibold mb-4 text-[#2e4f21]">Spending vs Budget</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={30} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="allocated" fill="#d0d0d0" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="spent" fill="#2e4f21" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gray-300" />
                  <span className="text-gray-600">Allocated</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#2e4f21]" />
                  <span className="text-gray-600">Spent</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <p>Enter your salary to see budget visualization</p>
          </div>
        )}

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-display font-semibold mb-4 text-[#2e4f21]">Recent Transactions</h4>
            <div className="space-y-2">
              {recentTransactions.map((transaction) => {
                const category = categories.find(c => c.id === transaction.categoryId);
                return (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category?.icon}</span>
                      <div>
                        <p className="font-medium text-[#2e4f21]">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{category?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {transaction.type === 'expense' ? (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-[#2e4f21]" />
                      )}
                      <span className={`font-display font-semibold ${
                        transaction.type === 'expense' ? 'text-red-600' : 'text-[#2e4f21]'
                      }`}>
                        {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <AddCashDialog 
          open={showAddCash}
          onOpenChange={setShowAddCash}
          categories={categories}
          onAddTransaction={onAddTransaction}
        />
      </CardContent>
    </Card>
  );
};
