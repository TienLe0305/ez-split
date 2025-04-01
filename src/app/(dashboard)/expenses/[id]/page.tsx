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
  RefreshCw,
  DollarSign,
  Calendar,
  Users,
  Wallet,
  Check
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">{expense.name}</h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center bg-primary/10 text-primary rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1">
              <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
              <span className="font-medium text-sm sm:text-base">{formatCurrency(expense.amount)}</span>
            </div>
            
            <div className="flex items-center bg-muted/50 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-blue-500" />
              <span className="font-medium text-sm sm:text-base">{expense.participants?.length || 0} người tham gia</span>
            </div>
            
            <div className="flex items-center bg-muted/50 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-orange-500" />
              <span className="font-medium text-sm sm:text-base">{formatDate(expense.date || expense.created_at)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <Link href={`/expenses/${id}/split`}>
            <Button size="sm" className="h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto">
              <SplitSquareVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Thanh toán
            </Button>
          </Link>
          
          <Link href={`/expenses/${id}/edit`}>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
            >
              <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Chỉnh sửa
            </Button>
          </Link>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="order-1">
              <div className="flex items-center mb-3 text-primary">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" />
                <h3 className="font-medium text-sm sm:text-base">Người thanh toán</h3>
              </div>
              
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 sm:p-5 border border-primary/10 shadow-sm hover:shadow transition-all duration-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center font-medium text-lg sm:text-xl">
                        {expense.payer?.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 shadow-md">
                        <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <div className="font-semibold text-base sm:text-lg">{expense.payer?.name}</div>
                    <div className="text-xs sm:text-sm mt-1 flex items-center text-green-600">
                      <DollarSign className="h-3.5 w-3.5 mr-1" />
                      <span>Đã thanh toán {formatCurrency(expense.amount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-primary">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" />
                  <h3 className="font-medium text-sm sm:text-base">Người tham gia</h3>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {expense.participants?.length || 0} người
                </div>
              </div>
              
              <div className="bg-muted/20 rounded-xl p-3 sm:p-4 border shadow-sm">
                <div className="space-y-3">
                  {expense.participants?.map((participant, index) => (
                    <div 
                      key={`participant-${participant.user_id}-${index}`} 
                      className="flex items-center bg-background p-2.5 sm:p-3 rounded-lg border border-muted hover:border-primary/20 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 font-medium text-sm sm:text-base">
                        {participant.user?.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">{participant.user?.name}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">Phần chi tiêu</div>
                      </div>
                      <div className="flex-shrink-0 font-semibold text-sm sm:text-base">{formatCurrency(participant.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 