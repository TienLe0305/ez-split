"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExpenses, useExpensesWithStatus } from '@/lib/query/hooks';
import { ExpenseItem } from '@/components/expense-item';
import { EmptyState } from '@/components/empty-state';
import { ExpensesDashboardSkeleton } from '@/components/skeletons';
import { ExpenseWithStatus } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [showMine, setShowMine] = useState<boolean>(false);
  
  // Fetch expenses data using React Query hooks
  const { 
    data: expenses,
    isLoading: expensesLoading,
    error: expensesError
  } = useExpenses();

  // Fetch expenses with payment status
  const {
    data: expensesWithStatus,
    isLoading: statusLoading,
    error: statusError
  } = useExpensesWithStatus();

  // Show error message if either query fails
  const error = expensesError || statusError;
  const isLoading = expensesLoading || statusLoading;

  // Filter expenses based on the 'showMine' state
  const filteredExpenses = showMine && expensesWithStatus 
    ? expensesWithStatus.filter((exp: ExpenseWithStatus) => 
        !exp.all_payments_completed && exp.payment_count > 0)
    : expenses;

  const handleCreateNewExpense = () => {
    router.push('/expenses/new');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Chi tiêu của bạn</h1>
          <p className="text-muted-foreground">Quản lý các khoản chi tiêu và thanh toán</p>
        </div>
        <Button onClick={handleCreateNewExpense}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Chi tiêu mới
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 mb-4">
          <Button
            variant={!showMine ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMine(false)}
          >
            Tất cả
          </Button>
          <Button
            variant={showMine ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMine(true)}
          >
            Cần thanh toán
          </Button>
        </div>
      </div>

      {isLoading ? (
        <ExpensesDashboardSkeleton />
      ) : error ? (
        <div className="p-8 text-center">
          <div className="text-destructive mb-4">
            {error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải dữ liệu'}
          </div>
          <Button onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      ) : filteredExpenses && filteredExpenses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredExpenses.map((expense) => (
            <Link href={`/expenses/${expense.id}`} key={expense.id}>
              <ExpenseItem expense={expense} showStatus={showMine} />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="Không có chi tiêu nào"
          description={showMine ? "Bạn không có khoản nào cần thanh toán" : "Hãy thêm chi tiêu đầu tiên của bạn"}
          icon={<PlusCircle className="h-12 w-12" />}
          action={
            <Button onClick={handleCreateNewExpense}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Chi tiêu mới
            </Button>
          }
        />
      )}
    </div>
  );
} 