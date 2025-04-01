"use client";

import { use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Receipt, 
  Trash, 
  Edit, 
  SplitSquareVertical,
  RefreshCw
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useExpense, useDeleteExpense } from '@/lib/query/hooks';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ExpenseDetailSkeleton } from '@/components/skeletons';

// Format date from ISO string
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export default function ExpenseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const numericId = Number(id);
  const router = useRouter();
  
  // Use React Query hook with refetch capability
  const { 
    data: expense, 
    error, 
    isLoading,
    refetch,
    isRefetching
  } = useExpense(numericId);
  
  // Refetch when component mounts to ensure fresh data
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  // Mutation để xóa khoản chi
  const deleteExpense = useDeleteExpense({
    onSuccess: () => {
      // Redirect sau khi xóa thành công
      router.push('/expenses');
    }
  });
  
  const handleDeleteExpense = () => {
    deleteExpense.mutate(numericId);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <ExpenseDetailSkeleton />
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <p className="text-destructive">
            {error instanceof Error ? error.message : 'Không thể tải thông tin chi tiết. Vui lòng thử lại sau.'}
          </p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex space-x-2 mb-3">
            <Link href="/expenses">
              <Button variant="outline" size="sm" className="h-8 sm:h-9">
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Quay lại</span>
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 sm:h-9" 
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{expense.name}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {formatCurrency(expense.amount)} • Ngày {formatDate(expense.date || expense.created_at)}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <Link href={`/expenses/${id}/split`}>
            <Button size="sm" className="h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto">
              <SplitSquareVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Thanh toán
            </Button>
          </Link>
          
          <Link href={`/expenses/${id}/edit`}>
            <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto">
              <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Chỉnh sửa
            </Button>
          </Link>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto">
                <Trash className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Xóa
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc muốn xóa?</AlertDialogTitle>
                <AlertDialogDescription>
                  Khoản chi tiêu &quot;{expense.name}&quot; sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteExpense}>
                  {deleteExpense.isPending ? 'Đang xóa...' : 'Xóa'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <Card className="mb-8 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="bg-muted/50 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl flex items-center justify-between">
            <span className="flex items-center">
              <Receipt className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              Chi tiết
            </span>
          </CardTitle>
          <CardDescription className="text-sm">
            Chi tiết về khoản chi tiêu và người tham gia
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <div className="font-medium mb-2 text-primary text-sm sm:text-base">Người thanh toán</div>
              <div className="flex items-center p-2 sm:p-3 bg-primary/5 rounded-lg">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-2 sm:mr-3 font-medium text-sm sm:text-base">
                  {expense.payer?.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-sm sm:text-base">{expense.payer?.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Đã thanh toán trước</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="font-medium mb-2 text-primary text-sm sm:text-base">Người tham gia</div>
              <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2">
                {expense.participants?.map((participant, index) => (
                  <div key={`participant-${participant.user_id}-${index}`} className="flex items-center p-2 border-b last:border-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 font-medium text-xs sm:text-sm">
                      {participant.user?.name.charAt(0)}
                    </div>
                    <span className="flex-1 text-sm sm:text-base">{participant.user?.name}</span>
                    <span className="font-medium text-sm sm:text-base">{formatCurrency(participant.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 