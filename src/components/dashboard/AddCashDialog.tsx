import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BudgetCategory } from '@/hooks/useBudget';

interface AddCashDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: BudgetCategory[];
  onAddTransaction: (categoryId: string, amount: number, type: 'expense' | 'income', description: string) => void;
}

export const AddCashDialog = ({ open, onOpenChange, categories, onAddTransaction }: AddCashDialogProps) => {
  const [categoryId, setCategoryId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (categoryId && amountNum > 0) {
      onAddTransaction(categoryId, amountNum, 'expense', description || 'Expense');
      setCategoryId('');
      setAmount('');
      setDescription('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border border-gray-200 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-[#2e4f21]">Add Expense</DialogTitle>
          <DialogDescription className="text-gray-600">
            Record a new expense and select the category
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-[#2e4f21]">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="bg-gray-50 border-gray-300 text-black">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-[#2e4f21]">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">₹</span>
              <Input
                id="amount"
                type="number"
                placeholder="1,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 bg-gray-50 border-gray-300 text-black"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#2e4f21]">Description (optional)</Label>
            <Input
              id="description"
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-50 border-gray-300 text-black"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!categoryId || !amount}
              className="flex-1 bg-[#2e4f21] hover:bg-[#1f3617] text-white"
            >
              Add Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
