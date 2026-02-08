import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SavingsGoal } from '@/hooks/useBudget';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGoal: (name: string, targetAmount: number, deadline: Date | null, icon: string) => SavingsGoal;
}

const GOAL_ICONS = ['🎯', '🏠', '🚗', '✈️', '💻', '📚', '💍', '🎓', '🏥', '🎁', '🛡️', '💎'];

export const AddGoalDialog = ({ open, onOpenChange, onAddGoal }: AddGoalDialogProps) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [selectedIcon, setSelectedIcon] = useState('🎯');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(targetAmount);
    if (name && amount > 0) {
      onAddGoal(name, amount, deadline || null, selectedIcon);
      setName('');
      setTargetAmount('');
      setDeadline(undefined);
      setSelectedIcon('🎯');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border border-gray-200 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-[#2e4f21]">Create Savings Goal</DialogTitle>
          <DialogDescription className="text-gray-600">
            Set a target and deadline for your savings goal
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#2e4f21]">Choose an icon</Label>
            <div className="flex flex-wrap gap-2">
              {GOAL_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={cn(
                    "w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all",
                    selectedIcon === icon 
                      ? "bg-[#2e4f21] text-white scale-110" 
                      : "bg-gray-100 hover:bg-gray-200"
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#2e4f21]">Goal Name</Label>
            <Input
              id="name"
              placeholder="e.g., New Laptop, Vacation Fund"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border-gray-300 text-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target" className="text-[#2e4f21]">Target Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">₹</span>
              <Input
                id="target"
                type="number"
                placeholder="50,000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="pl-8 bg-gray-50 border-gray-300 text-black"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#2e4f21]">Target Date (optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-50 border-gray-300 text-black",
                    !deadline && "text-gray-600"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border border-gray-200" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
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
              disabled={!name || !targetAmount}
              className="flex-1 bg-[#2e4f21] hover:bg-[#1f3617] text-white"
            >
              Create Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
