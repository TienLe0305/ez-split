"use client";

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, QrCode, Home } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Transaction } from '@/lib/api';
import { useExpenseSummary, useUpdatePaymentStatus } from '@/lib/query/hooks';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

// Format date from ISO string
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  
  try {
    // Log để debug
    console.log('Date string received:', dateString);
    
    const date = new Date(dateString);
    
    // Kiểm tra xem ngày có hợp lệ không
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'N/A';
    }
    
    // Debug date object
    console.log('Parsed date:', date.toString());
    console.log('Date timezone offset:', date.getTimezoneOffset());
    
    // Điều chỉnh cho múi giờ Việt Nam và hiển thị thời gian địa phương
    return new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'success';
}

const Badge = ({ children, className, variant = 'primary' }: BadgeProps) => {
  const baseClass = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium';
  const variantClass = variant === 'success' 
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    : 'bg-primary/10 text-primary';
  
  return (
    <span className={cn(baseClass, variantClass, className)}>
      {children}
    </span>
  );
};

export default function ExpenseSplitPage({ params }: { params: Promise<{ id: string }> }) {
  // Resolve params
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const numericId = Number(id);
  
  // State for QR code refresh
  const [qrRefreshCounter, setQrRefreshCounter] = useState(0);

  // State để lưu trữ danh sách transactions tạm thời cho optimistic update
  const [optimisticTransactions, setOptimisticTransactions] = useState<Transaction[]>([]);

  // Fetch expense summary data with react-query
  const { 
    data, 
    error: queryError, 
    isLoading, 
    refetch 
  } = useExpenseSummary(numericId);

  // Extract data from query result
  const expense = data?.expense;
  // Sử dụng optimistic transactions nếu có, hoặc dữ liệu từ API
  const transactions = optimisticTransactions.length > 0 
    ? optimisticTransactions 
    : data?.transactions || [];
  const allCompleted = data?.allCompleted || false;

  // Cập nhật optimistic transactions khi data thay đổi
  useEffect(() => {
    if (data?.transactions) {
      setOptimisticTransactions([]);
    }
  }, [data]);

  // Mutation for updating payment status
  const updatePaymentStatus = useUpdatePaymentStatus({
    onMutate: async ({ transactionId, paid }) => {
      // Lấy thời gian hiện tại chính xác tới mili giây với offset múi giờ Việt Nam (+7)
      const now = new Date();
      // Đảm bảo thời gian được điều chỉnh cho múi giờ Việt Nam
      const currentTime = now.toISOString();
      console.log('Current time set for payment:', currentTime);
      
      // Tạo bản sao optimistic của transactions
      const updatedTransactions = transactions.map(transaction => {
        if (transaction.id === transactionId) {
          return {
            ...transaction,
            payment_status: {
              ...transaction.payment_status,
              transaction_id: transactionId as number,
              paid,
              paid_at: paid ? currentTime : undefined
            }
          };
        }
        return transaction;
      });
      
      // Cập nhật state để UI hiển thị ngay lập tức
      setOptimisticTransactions(updatedTransactions);
    },
    onSuccess: () => {
      // Update QR refresh counter to force QR code refresh
      setQrRefreshCounter(prev => prev + 1);
      // Refetch để cập nhật dữ liệu chính xác từ server
      refetch();
    },
    onError: () => {
      // Nếu có lỗi, reset về dữ liệu gốc
      setOptimisticTransactions([]);
      refetch();
    }
  });

  const handlePaymentStatusUpdate = async (transactionId: number | string, paid: boolean) => {
    updatePaymentStatus.mutate({
      transactionId,
      paid
    });
  };

  // Generate QR code URL for a transaction
  const generateQRCodeUrl = (transaction: Transaction) => {
    if (!transaction.toBankAccount) {
      return null;
    }
    
    // Sử dụng qr.sepay.vn thay cho img.vietqr.io
    // Tham khảo: https://qr.sepay.vn/
    const params = new URLSearchParams({
      acc: transaction.toBankAccount,
      bank: transaction.toBankName || 'VPB',
      amount: transaction.amount.toString(),
      des: `Thanh toan cho ${expense?.name || ''}`,
      template: 'compact' // Hiển thị QR kèm logo ngân hàng
    });
    
    // Create URL với định dạng query parameters
    return `https://qr.sepay.vn/img?${params.toString()}`;
  };

  // Format transaction description
  const getTransactionDescription = (transaction: Transaction) => {
    return `${transaction.fromName} thanh toán cho ${transaction.toName}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <p className="text-destructive">
            {queryError instanceof Error ? queryError.message : 'Không thể tải thông tin chi tiết. Vui lòng thử lại sau.'}
          </p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          <Link href={`/expenses/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại chi tiết
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Trang chủ
            </Button>
          </Link>
        </div>
        
        {allCompleted && (
          <Badge variant="success" className="px-3 py-1 text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            Đã thanh toán đầy đủ
          </Badge>
        )}
      </div>
      
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{expense?.name}</h1>
        <p className="text-muted-foreground">
          Chi tiết thanh toán và chia tiền cho khoản chi tiêu này
        </p>
      </div>
      
      {/* Expense Summary Card */}
      {expense && (
        <Card className="mb-8 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-2xl flex items-center justify-between">
              <span className="truncate">Thông tin chi tiêu</span>
            </CardTitle>
            <CardDescription>
              Tổng: {formatCurrency(expense.amount)} • 
              {expense.participants?.length} người tham gia • 
              Ngày {formatDate(expense.date || expense.created_at || '')}
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
      )}
      
      {/* Transactions List */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Các khoản cần thanh toán</h2>
        <p className="text-muted-foreground mb-4">
          Danh sách các giao dịch cần thực hiện để hoàn tất thanh toán
        </p>
      </div>
      
      {transactions.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">
              Không có khoản thanh toán nào
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {transactions.map((transaction) => (
            <Card 
              key={transaction.id} 
              className={cn(
                "overflow-hidden transition-all hover:shadow-md",
                transaction.payment_status?.paid 
                  ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900" 
                  : "hover:border-primary"
              )}
            >
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{getTransactionDescription(transaction)}</h3>
                      
                      {transaction.payment_status?.paid ? (
                        <div className="flex flex-col text-sm text-green-600 dark:text-green-400 mt-1">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Đã thanh toán vào {formatDate(transaction.payment_status?.paid_at || '')}
                          </div>
                        </div>
                      ) : (
                        <div className="font-medium text-xl mt-1">{formatCurrency(transaction.amount)}</div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {!transaction.payment_status?.paid && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="border-primary">
                              <QrCode className="h-4 w-4 mr-2" />
                              QR Code
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Quét mã QR để thanh toán</DialogTitle>
                              <DialogDescription>
                                Sử dụng ứng dụng ngân hàng để quét mã QR và thanh toán khoản tiền.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-center justify-center p-4">
                              <div className="mb-4 bg-white p-4 rounded-lg shadow-md">
                                {(() => {
                                  const qrUrl = generateQRCodeUrl(transaction);
                                  console.log('QR URL:', qrUrl);
                                  
                                  if (!transaction.toBankAccount) {
                                    return (
                                      <div className="w-[250px] h-[250px] flex items-center justify-center bg-gray-100 border border-gray-200 rounded-lg text-center p-4">
                                        <div>
                                          <div className="text-red-500 font-medium mb-2">Không thể tạo mã QR</div>
                                          <div className="text-sm text-gray-500">Người nhận ({transaction.toName}) chưa cập nhật thông tin tài khoản ngân hàng</div>
                                        </div>
                                      </div>
                                    );
                                  }
                                  
                                  return (
                                    <img 
                                      src={qrUrl ? `${qrUrl}?t=${qrRefreshCounter}` : '#'}
                                      alt="QR Code for payment"
                                      className="w-[250px] h-[250px]"
                                      onError={(e) => {
                                        console.error('QR image failed to load');
                                        e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22250%22%20height%3D%22250%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22250%22%20height%3D%22250%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%22125%22%20y%3D%22125%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23aaa%22%3EKhông thể tải mã QR%3C%2Ftext%3E%3C%2Fsvg%3E';
                                      }}
                                    />
                                  );
                                })()}
                              </div>
                              <div className="space-y-2 w-full bg-muted/30 p-4 rounded-lg">
                                <p><strong>Người nhận:</strong> {transaction.toName}</p>
                                <p><strong>Số tài khoản:</strong> {transaction.toBankAccount || 'Chưa có thông tin'}</p>
                                <p><strong>Ngân hàng:</strong> {transaction.toBankName || 'VPB'}</p>
                                <p><strong>Số tiền:</strong> {formatCurrency(transaction.amount)}</p>
                                <p><strong>Nội dung:</strong> Thanh toán cho {expense?.name}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`payment-${transaction.id}`}
                          checked={transaction.payment_status?.paid}
                          onCheckedChange={(checked) => {
                            handlePaymentStatusUpdate(transaction.id, checked === true);
                          }}
                          className={transaction.payment_status?.paid ? "bg-green-600 text-white border-green-600" : ""}
                          disabled={updatePaymentStatus.isPending}
                        />
                        <label
                          htmlFor={`payment-${transaction.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {transaction.payment_status?.paid ? "Đã thanh toán" : "Đánh dấu đã thanh toán"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 