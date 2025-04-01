"use client";

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Home, 
  Receipt, 
  Trash, 
  Edit, 
  SplitSquareVertical
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
  
  // Sử dụng React Query hook để lấy dữ liệu
  const { 
    data: expense, 
    error, 
    isLoading 
  } = useExpense(numericId);
  
  // Mutation để xóa khoản chi
  const deleteExpense = useDeleteExpense({
    onSuccess: () => {
      // Redirect sau khi xóa thành công
      router.push('/dashboard');
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
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex space-x-2 mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Trang chủ
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">{expense.name}</h1>
          <p className="text-muted-foreground">
            {formatCurrency(expense.amount)} • Ngày {formatDate(expense.date || expense.created_at)}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Link href={`/expenses/${id}/split`}>
            <Button>
              <SplitSquareVertical className="h-4 w-4 mr-2" />
              Thanh toán
            </Button>
          </Link>
          
          <Link href={`/expenses/${id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          </Link>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                <Trash className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Khoản chi tiêu này sẽ bị xóa vĩnh viễn khỏi hệ thống.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteExpense}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteExpense.isPending}
                >
                  {deleteExpense.isPending ? 'Đang xóa...' : 'Xóa'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <Card className="mb-8 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-2xl flex items-center justify-between">
            <span className="flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Chi tiết
            </span>
          </CardTitle>
          <CardDescription>
            Chi tiết về khoản chi tiêu và người tham gia
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-medium mb-2 text-primary">Người thanh toán</div>
              <div className="flex items-center p-3 bg-primary/5 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 font-medium">
                  {expense.payer?.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{expense.payer?.name}</div>
                  <div className="text-sm text-muted-foreground">Đã thanh toán trước</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="font-medium mb-2 text-primary">Người tham gia</div>
              <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2">
                {expense.participants?.map((participant) => (
                  <div key={participant.id} className="flex items-center p-2 border-b last:border-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 font-medium">
                      {participant.user?.name.charAt(0)}
                    </div>
                    <span className="flex-1">{participant.user?.name}</span>
                    <span className="font-medium">{formatCurrency(participant.amount)}</span>
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