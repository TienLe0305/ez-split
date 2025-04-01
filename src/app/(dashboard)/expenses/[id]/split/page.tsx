"use client";

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, QrCode, Home, Clock, Share2, Copy, Link as LinkIcon, Check, DollarSign, Users, Calendar, Wallet } from 'lucide-react';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Format date from ISO string
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  
  try {
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'N/A';
    }
    
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
  
  // Get query params to check if this is a new expense
  const searchParams = useSearchParams();
  const isNewExpense = searchParams.get('new') === 'true';
  
  // Share dialog state
  const [shareDialogOpen, setShareDialogOpen] = useState(isNewExpense);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
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

  // Create share URL when expense data is loaded
  useEffect(() => {
    if (expense) {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/expenses/${id}/split`;
      setShareUrl(url);
    }
  }, [expense, id]);
  
  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

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
      const currentTime = now.toISOString();
      
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
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-5xl">
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chi tiêu đã được tạo thành công</DialogTitle>
            <DialogDescription>
              Bạn có thể chia sẻ liên kết chi tiêu với người tham gia.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2">
              <div className="bg-muted p-2 rounded-full">
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Chia sẻ với mọi người để theo dõi chi tiêu</p>
            </div>
            <div className="mt-3 flex space-x-2">
              <div className="flex-1 flex items-center border rounded-md overflow-hidden bg-muted/50">
                <LinkIcon className="h-4 w-4 mx-2 text-muted-foreground" />
                <input 
                  className="flex-1 bg-transparent px-2 py-2 text-sm outline-none" 
                  value={shareUrl} 
                  readOnly
                />
              </div>
              <Button size="sm" onClick={copyToClipboard} className="gap-1.5">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Sao chép</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShareDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          <Link href={`/expenses/${id}`}>
            <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm">
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="truncate">Chi tiết</span>
            </Button>
          </Link>
          <Link href="/expenses">
            <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm">
              <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="truncate">Trang chủ</span>
            </Button>
          </Link>
        </div>
        
        {allCompleted && (
          <Badge variant="success" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
            <span className="truncate">Đã thanh toán đầy đủ</span>
          </Badge>
        )}
      </div>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{expense?.name}</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Chi tiết thanh toán và chia tiền cho khoản chi tiêu này
        </p>
      </div>
      
      {/* Expense Summary Card */}
      {expense && (
        <Card className="mb-6 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-muted/50 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl flex items-center justify-between">
              <span className="truncate">Thông tin chi tiêu</span>
            </CardTitle>
            <CardDescription>
              <span className="flex flex-wrap items-center gap-3 sm:gap-4 py-1">
                <span className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1">
                  <DollarSign className="h-4 w-4 mr-1.5" />
                  <span className="font-medium">{formatCurrency(expense.amount)}</span>
                </span>
                
                <span className="flex items-center bg-muted/50 rounded-full px-3 py-1">
                  <Users className="h-4 w-4 mr-1.5 text-blue-500" />
                  <span className="font-medium">{expense.participants?.length} người tham gia</span>
                </span>
                
                <span className="flex items-center bg-muted/50 rounded-full px-3 py-1">
                  <Calendar className="h-4 w-4 mr-1.5 text-orange-500" />
                  <span className="font-medium">{formatDate(expense.date || expense.created_at || '')}</span>
                </span>
              </span>
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
                    {expense.participants?.length} người
                  </div>
                </div>
                
                <div className="bg-muted/20 rounded-xl p-3 sm:p-4 border shadow-sm">
                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3">
                    {expense.participants?.map((participant) => (
                      <div 
                        key={participant.id} 
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
      )}
      
      {/* Transactions List */}
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Các khoản cần thanh toán</h2>
        <p className="text-muted-foreground mb-4 text-sm sm:text-base">
          Danh sách các giao dịch cần thực hiện để hoàn tất thanh toán
        </p>
      </div>
      
      {transactions.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground text-sm sm:text-base">
              Không có khoản thanh toán nào
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {transactions.map((transaction) => (
            <Card 
              key={transaction.id} 
              className={cn(
                "overflow-hidden transition-all hover:shadow border border-muted duration-300",
                transaction.payment_status?.paid 
                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900" 
                  : "bg-white dark:bg-gray-950 hover:border-primary/60"
              )}
            >
              <CardContent className="p-0">
                <div className="p-5 sm:p-6">
                  {/* Transaction details with avatars and flow indicator */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Transaction description and amount */}
                    <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                      <h3 className="font-medium text-base sm:text-lg">
                        <span className="text-sky-500">{transaction.fromName}</span>
                        <span className="text-slate-500 mx-1.5">thanh toán cho</span>
                        <span className="text-sky-500">{transaction.toName}</span>
                      </h3>
                      
                      {transaction.payment_status?.paid ? (
                        <div className="flex items-center text-green-600 dark:text-green-400 mt-1 font-medium px-3 py-1 rounded-full">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Đã thanh toán vào {formatDate(transaction.payment_status?.paid_at || '')}
                        </div>
                      ) : (
                        <div className="mt-0.5">
                          <div className="text-amber-500 text-sm font-medium mb-0.5">
                            Chưa thanh toán
                          </div>
                          <div className="font-bold text-2xl text-amber-500">
                            {formatCurrency(transaction.amount)}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Buttons and actions */}
                    <div className="flex items-center justify-center sm:justify-end gap-3 mt-2 sm:mt-0">
                      {!transaction.payment_status?.paid && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 h-9 px-3 text-xs sm:text-sm">
                              <QrCode className="h-4 w-4 mr-2" />
                              Mã QR Thanh Toán
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md max-w-[95vw] w-[360px] sm:w-auto">
                            <DialogHeader>
                              <DialogTitle className="text-base sm:text-lg">Quét mã QR để thanh toán</DialogTitle>
                              <DialogDescription className="text-xs sm:text-sm">
                                Sử dụng ứng dụng ngân hàng để quét mã QR và thanh toán khoản tiền.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-center justify-center p-3 sm:p-4">
                              <div className="mb-3 sm:mb-4 bg-white p-3 sm:p-4 rounded-lg shadow-md">
                                {(() => {
                                  const qrUrl = generateQRCodeUrl(transaction);                                  
                                  if (!transaction.toBankAccount) {
                                    return (
                                      <div className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] flex items-center justify-center bg-gray-100 border border-gray-200 rounded-lg text-center p-4">
                                        <div>
                                          <div className="text-red-500 font-medium mb-2 text-sm sm:text-base">Không thể tạo mã QR</div>
                                          <div className="text-xs sm:text-sm text-gray-500">Người nhận ({transaction.toName}) chưa cập nhật thông tin tài khoản ngân hàng</div>
                                        </div>
                                      </div>
                                    );
                                  }
                                  
                                  return (
                                    <Image 
                                      src={qrUrl ? `${qrUrl}?t=${qrRefreshCounter}` : '/placeholder.svg'}
                                      alt="QR Code for payment"
                                      width={250}
                                      height={250}
                                      className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px]"
                                      onError={(e) => {
                                        console.error('QR image failed to load');
                                        e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22250%22%20height%3D%22250%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22250%22%20height%3D%22250%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%22125%22%20y%3D%22125%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23aaa%22%3EKhông thể tải mã QR%3C%2Ftext%3E%3C%2Fsvg%3E';
                                      }}
                                    />
                                  );
                                })()}
                              </div>
                              <div className="space-y-1.5 sm:space-y-2 w-full bg-muted/30 p-3 sm:p-4 rounded-lg text-xs sm:text-sm">
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
                      
                      <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md">
                        <Checkbox 
                          id={`payment-${transaction.id}`}
                          checked={transaction.payment_status?.paid}
                          onCheckedChange={(checked) => {
                            handlePaymentStatusUpdate(transaction.id, checked === true);
                          }}
                          className="h-5 w-5 rounded-md border-slate-300"
                          disabled={updatePaymentStatus.isPending}
                        />
                        <label 
                          htmlFor={`payment-${transaction.id}`} 
                          className="text-sm font-medium cursor-pointer text-slate-600"
                        >
                          Đã thanh toán
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
      
      {transactions.length > 0 && (
        <Card className="mt-6 bg-muted/30">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
              <div>
                <h3 className="font-medium text-base sm:text-lg">Tổng quan thanh toán</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{transactions.length} khoản thanh toán</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center bg-green-50 dark:bg-green-950/30 p-2 sm:p-3 rounded-lg">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 font-medium text-xs sm:text-sm">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Đã thanh toán</div>
                    <div className="font-medium text-sm sm:text-base">
                      {formatCurrency(transactions.reduce((acc, t) => t.payment_status?.paid ? acc + t.amount : acc, 0))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center bg-yellow-50 dark:bg-yellow-950/30 p-2 sm:p-3 rounded-lg">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-2 font-medium text-xs sm:text-sm">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Chưa thanh toán</div>
                    <div className="font-medium text-sm sm:text-base">
                      {formatCurrency(transactions.reduce((acc, t) => !t.payment_status?.paid ? acc + t.amount : acc, 0))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 