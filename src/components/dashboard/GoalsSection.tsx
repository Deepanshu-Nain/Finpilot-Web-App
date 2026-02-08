import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Sparkles, Trash2, TrendingUp, Calendar } from 'lucide-react';
import { SavingsGoal } from '@/hooks/useBudget';
import { AddGoalDialog } from './AddGoalDialog';
import { format } from 'date-fns';

interface GoalsSectionProps {
  goals: SavingsGoal[];
  onAddGoal: (name: string, targetAmount: number, deadline: Date | null, icon: string) => SavingsGoal;
  onUpdateGoalProgress: (goalId: string, amount: number) => void;
  onDeleteGoal: (goalId: string) => void;
}

const AI_TIPS = [
  "Set aside 10% of every income before spending",
  "Use the 24-hour rule before any impulse purchase",
  "Automate your savings to remove decision fatigue",
  "Track small expenses - they add up quickly!",
  "Review and adjust your budget monthly",
  "Build an emergency fund covering 3-6 months expenses",
];

export const GoalsSection = ({ goals, onAddGoal, onUpdateGoalProgress, onDeleteGoal }: GoalsSectionProps) => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const rotateTip = () => {
    setCurrentTip((prev) => (prev + 1) % AI_TIPS.length);
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#2e4f21]">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="font-display text-xl text-[#2e4f21]">Savings Goals</CardTitle>
              <CardDescription className="text-gray-600">Set targets and track your progress with AI guidance</CardDescription>
            </div>
          </div>
          <Button 
            onClick={() => setShowAddGoal(true)}
            className="bg-[#2e4f21] hover:bg-[#1f3617] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Tips Card */}
        <div 
          className="p-4 rounded-xl bg-[#a0f1bd] bg-opacity-20 border border-[#a0f1bd] cursor-pointer hover:border-[#2e4f21] transition-colors"
          onClick={rotateTip}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#2e4f21]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">AI Savings Tip</p>
              <p className="font-medium text-[#2e4f21] animate-fade-in" key={currentTip}>
                {AI_TIPS[currentTip]}
              </p>
              <p className="text-xs text-gray-500 mt-2">Click for another tip</p>
            </div>
          </div>
        </div>

        {/* Goals List */}
        {goals.length > 0 ? (
          <div className="space-y-4">
            {goals.map((goal, index) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const remaining = goal.targetAmount - goal.currentAmount;
              
              return (
                <div 
                  key={goal.id}
                  className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#2e4f21] transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{goal.icon}</span>
                      <div>
                        <h4 className="font-display font-semibold text-[#2e4f21]">{goal.name}</h4>
                        {goal.deadline && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(goal.deadline, 'MMM dd, yyyy')}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteGoal(goal.id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {formatCurrency(goal.currentAmount)} saved
                      </span>
                      <span className="font-medium text-[#2e4f21]">{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <Progress 
                      value={progress} 
                      className="h-3"
                      style={{ 
                        '--progress-color': goal.color 
                      } as React.CSSProperties}
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {Math.round(progress)}% complete
                      </span>
                      <span className="text-[#2e4f21] font-medium flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {formatCurrency(remaining)} to go
                      </span>
                    </div>
                  </div>

                  {/* AI Suggestion from Backend */}
                  {goal.suggestion && (
                    <div className="mt-3 p-3 rounded-lg bg-[#a0f1bd] bg-opacity-20 border border-[#a0f1bd]">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-[#2e4f21] mt-0.5" />
                        <div className="flex-1 text-sm">
                          <p className="font-medium text-[#2e4f21] mb-1">AI Recommendation</p>
                          <p className="text-gray-700">{goal.suggestion}</p>
                          {goal.monthlyAmount && (
                            <p className="text-gray-600 mt-1">
                              Monthly: {formatCurrency(goal.monthlyAmount)}
                            </p>
                          )}
                          {goal.expectedReturn && (
                            <p className="text-[#2e4f21] font-medium mt-1">
                              Expected: {formatCurrency(goal.expectedReturn)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    {[500, 1000, 2000].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateGoalProgress(goal.id, amount)}
                        className="flex-1 text-xs border-[#2e4f21] text-[#2e4f21] hover:bg-[#2e4f21] hover:text-white"
                      >
                        +₹{amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex p-4 rounded-full bg-gray-100 mb-4">
              <Target className="w-8 h-8 text-gray-600" />
            </div>
            <h4 className="font-display text-lg mb-2 text-[#2e4f21]">No goals yet</h4>
            <p className="text-gray-600 mb-4">
              Create your first savings goal and start building towards your dreams!
            </p>
            <Button onClick={() => setShowAddGoal(true)} className="bg-[#2e4f21] hover:bg-[#1f3617] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create First Goal
            </Button>
          </div>
        )}

        {/* AI Planning Section */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#a0f1bd]" />
            <h4 className="font-display font-semibold text-[#2e4f21]">AI Planning (Coming Soon)</h4>
          </div>
          <p className="text-sm text-gray-600">
            Our AI advisor will analyze your spending patterns and create personalized saving strategies. 
            Connect your goals with smart recommendations to achieve them faster!
          </p>
          <Button variant="outline" className="mt-4 border-gray-300" disabled>
            <Sparkles className="w-4 h-4 mr-2" />
            Get AI Recommendations
          </Button>
        </div>

        <AddGoalDialog
          open={showAddGoal}
          onOpenChange={setShowAddGoal}
          onAddGoal={onAddGoal}
        />
      </CardContent>
    </Card>
  );
};
