import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, DollarSign, TrendingUp, PiggyBank } from 'lucide-react';
import { BudgetCategory } from '@/hooks/useBudget';

interface SalaryInputProps {
  onPredictBudget: (salary: number) => BudgetCategory[];
  salary: number;
  categories: BudgetCategory[];
}

export const SalaryInput = ({ onPredictBudget, salary, categories }: SalaryInputProps) => {
  const [inputSalary, setInputSalary] = useState<string>(salary ? salary.toString() : '');
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePredict = () => {
    const salaryNum = parseFloat(inputSalary);
    if (salaryNum > 0) {
      setIsAnimating(true);
      onPredictBudget(salaryNum);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="bg-white border border-gray-200 overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-[#a0f1bd] opacity-5" />
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#2e4f21]">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="font-display text-xl text-[#2e4f21]">Monthly Salary</CardTitle>
            <CardDescription className="text-gray-600">Enter your income to get AI-powered budget predictions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-6">
        <div className="space-y-2">
          <Label htmlFor="salary" className="text-gray-600">Enter your monthly salary</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-lg">₹</span>
            <Input
              id="salary"
              type="number"
              placeholder="50,000"
              value={inputSalary}
              onChange={(e) => setInputSalary(e.target.value)}
              className="pl-10 h-14 text-xl font-display bg-gray-50 border-gray-300 text-black focus:border-[#2e4f21]"
            />
          </div>
        </div>

        <Button 
          onClick={handlePredict}
          disabled={!inputSalary || parseFloat(inputSalary) <= 0}
          className="w-full h-14 text-lg font-semibold bg-[#2e4f21] hover:bg-[#1f3617] text-white transition-all duration-300"
        >
          <Sparkles className={`w-5 h-5 mr-2 ${isAnimating ? 'animate-pulse' : ''}`} />
          Predict Smart Budget
        </Button>

        {salary > 0 && categories.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-gray-200 animate-fade-in">
            <h3 className="font-display text-lg flex items-center gap-2 text-[#2e4f21]">
              <TrendingUp className="w-5 h-5 text-[#2e4f21]" />
              Budget Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.slice(0, 6).map((category, index) => (
                <div 
                  key={category.id}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-200 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm text-gray-600">{category.name}</span>
                  </div>
                  <p className="font-display font-semibold text-[#2e4f21]">{formatCurrency(category.allocated)}</p>
                </div>
              ))}
            </div>
            
            <div className="p-4 rounded-xl bg-[#a0f1bd] bg-opacity-20 border border-[#a0f1bd]">
              <div className="flex items-center gap-3">
                <PiggyBank className="w-8 h-8 text-[#2e4f21]" />
                <div>
                  <p className="text-sm text-gray-600">Monthly Savings Target</p>
                  <p className="font-display text-2xl font-bold text-[#2e4f21]">
                    {formatCurrency(categories.find(c => c.name === 'Savings')?.allocated || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
