import { User, CheckCircle, Calendar } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { formatCurrency } from '@/lib/utils';
import { Expense, ExpenseWithStatus } from '@/lib/api';

type ExpenseItemProps = {
  expense: Expense | ExpenseWithStatus;
  showStatus?: boolean;
};

export function ExpenseItem({ expense, showStatus = false }: ExpenseItemProps) {
  const hasPaymentStatus = 
    'all_payments_completed' in expense && 
    'payment_count' in expense && 
    'completed_count' in expense;
  
  const date = expense.date ? new Date(expense.date) : 
               expense.created_at ? new Date(expense.created_at) : new Date();
  
  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

  // Progress calculation for payment status
  const paymentCount = hasPaymentStatus ? (expense as ExpenseWithStatus).payment_count : 0;
  const completedCount = hasPaymentStatus ? (expense as ExpenseWithStatus).completed_count : 0;
  const progressPercentage = paymentCount > 0 ? (completedCount / paymentCount) * 100 : 0;
  const allCompleted = hasPaymentStatus ? (expense as ExpenseWithStatus).all_payments_completed : false;
  
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-lg truncate">{expense.name}</h3>
            <div className="text-muted-foreground text-sm flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              {formattedDate}
              <span className="mx-2">•</span>
              <User className="h-3 w-3 mr-1" />
              {expense.payer?.name || ('payer_name' in expense ? (expense as ExpenseWithStatus).payer_name : 'Unknown')}
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">{formatCurrency(expense.amount)}</div>
            
            {showStatus && hasPaymentStatus && (
              <div className="mt-2">
                {allCompleted ? (
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Hoàn tất
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-muted-foreground">
                      {completedCount}/{paymentCount} thanh toán
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-1 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 