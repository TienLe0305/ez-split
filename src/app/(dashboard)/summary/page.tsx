'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, RefreshCw, Wallet2, UserRound, DollarSign, Receipt, CheckCircle } from 'lucide-react';
import { getSummary, UserSummary, Transaction, getExpensesTransactions, TransactionsByExpense } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function SummaryPage() {
  const [userSummary, setUserSummary] = useState<UserSummary[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expensesTransactions, setExpensesTransactions] = useState<TransactionsByExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [summaryData, expensesTransactionsData] = await Promise.all([
          getSummary(),
          getExpensesTransactions()
        ]);
        
        setUserSummary(summaryData.userSummary);
        setTransactions(summaryData.transactions);
        setExpensesTransactions(expensesTransactionsData);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshSummary = async () => {
    try {
      setRefreshing(true);
      
      // Fetch all data in parallel
      const [summaryData, expensesTransactionsData] = await Promise.all([
        getSummary(),
        getExpensesTransactions()
      ]);
      
      setUserSummary(summaryData.userSummary);
      setTransactions(summaryData.transactions);
      setExpensesTransactions(expensesTransactionsData);
      setError(null);
    } catch (err) {
      setError('Không thể cập nhật dữ liệu. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };
  
  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };


  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Kết quả chia tiền</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Tổng kết chi tiêu và các giao dịch cần thực hiện
          </p>
        </div>
        <Button 
          size="sm" 
          onClick={refreshSummary}
          disabled={isLoading || refreshing}
          className="h-9 gap-1 w-full sm:w-auto justify-center"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Cập nhật
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-white dark:bg-gray-950">
          <div className="h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4"></div>
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 p-6 rounded-lg text-destructive text-center border border-destructive/20">
          <p className="font-medium mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={refreshSummary} disabled={refreshing}>
            Thử lại
          </Button>
        </div>
      ) : (
        <>
          <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 w-full max-w-lg mx-auto">
              <TabsTrigger value="summary" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <UserRound className="h-4 w-4" />
                <span className="truncate">Tổng kết cá nhân</span>
              </TabsTrigger>
              <TabsTrigger value="byExpense" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Receipt className="h-4 w-4" />
                <span className="truncate">Theo chi tiêu</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {userSummary.map(user => {
                  return (
                    <Card key={user.id} className="overflow-hidden transition-all hover:shadow-md rounded-xl">
                      <CardHeader className="pb-2 relative">
                        <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                            <span className="text-base sm:text-lg font-semibold">{user.name.charAt(0)}</span>
                          </div>
                          <span className="truncate">{user.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-2 gap-2 sm:gap-4">
                          <div className="flex flex-col">
                            <span className="text-xs sm:text-sm text-muted-foreground mb-1 flex items-center gap-1">
                              <Wallet2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Đã chi
                            </span>
                            <span className="font-medium text-sm sm:text-base">{formatCurrency(user.paid)}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs sm:text-sm text-muted-foreground mb-1 flex items-center gap-1">
                              <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Đã tiêu
                            </span>
                            <span className="font-medium text-sm sm:text-base">{formatCurrency(user.spent)}</span>
                          </div>
                        </div>
                        
                        {user.received > 0 || user.pending > 0 ? (
                          <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-3 pt-3 border-t">
                            <div className="flex flex-col">
                              <span className="text-xs sm:text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" /> Đã nhận
                              </span>
                              <span className="font-medium text-sm sm:text-base text-green-600">{formatCurrency(user.received)}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs sm:text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                <RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-orange-500" /> Chờ nhận
                              </span>
                              <span className="font-medium text-sm sm:text-base text-orange-600">{formatCurrency(user.pending)}</span>
                            </div>
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="byExpense">
              <div className="space-y-6">
                {expensesTransactions.length === 0 ? (
                  <div className="text-center py-10 flex flex-col items-center bg-white dark:bg-gray-950 rounded-xl border shadow-sm">
                    <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-950/50 mb-3">
                      <Receipt className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Không có chi tiêu nào cần thanh toán</h3>
                    <p className="text-muted-foreground max-w-md px-4 text-sm">
                      Chưa có khoản chi tiêu nào được thêm hoặc tất cả đã được thanh toán.
                    </p>
                  </div>
                ) : (
                  expensesTransactions.map((expenseItem) => (
                    <Card 
                      key={expenseItem.expenseId} 
                      className="rounded-xl overflow-hidden border-blue-100 dark:border-blue-900 hover:shadow-md transition-all duration-300"
                    >
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-b border-blue-100 dark:border-blue-900 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <CardTitle className="text-lg sm:text-xl font-bold truncate">
                              {expenseItem.expenseName}
                            </CardTitle>
                            <CardDescription className="mt-1 flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-xs sm:text-sm">
                              <span>Tổng: {formatCurrency(expenseItem.amount)}</span>
                              <span className="text-gray-300 dark:text-gray-700">|</span>
                              <span>Ngày: {formatDate(expenseItem.date)}</span>
                              <span className="text-gray-300 dark:text-gray-700">|</span>
                              <span>{expenseItem.transactions.length} giao dịch</span>
                            </CardDescription>
                          </div>
                          
                          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                            {expenseItem.allCompleted && (
                              <div className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 whitespace-nowrap">
                                <CheckCircle className="h-3 w-3" />
                                <span className="hidden xs:inline">Đã thanh toán</span>
                                <span className="inline xs:hidden">TT</span>
                              </div>
                            )}
                            <Link href={`/expenses/${expenseItem.expenseId}/split`}>
                              <Button variant="outline" size="sm" className="border-blue-200 dark:border-blue-800 text-xs sm:text-sm h-7 sm:h-8">
                                Xem chi tiết
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-4 sm:pt-5">
                        <div className="space-y-3">
                          {expenseItem.transactions.map((transaction, idx) => (
                            <div
                              key={`${expenseItem.expenseId}-${idx}`}
                              className={`overflow-hidden rounded-lg border ${
                                transaction.payment_status?.paid
                                  ? "bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/50"
                                  : "bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900"
                              } transition-colors duration-200`}
                            >
                              <div className="p-2 sm:p-3">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                  <div className="flex shrink-0 items-center">
                                    <div className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full ${
                                      transaction.payment_status?.paid
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                                        : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                                    }`}>
                                      <span className="text-xs sm:text-sm font-medium">{transaction.fromName.charAt(0)}</span>
                                    </div>
                                    <div className="relative mx-1 w-4 sm:w-5 text-primary">
                                      <div className="absolute inset-0 flex items-center">
                                        <div className="h-[2px] w-full bg-primary/20"></div>
                                      </div>
                                      <ArrowRight className="relative h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    </div>
                                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                                      <span className="text-xs sm:text-sm font-medium">{transaction.toName.charAt(0)}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex-1 sm:ml-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                                    <div className="flex flex-col">
                                      <div className="flex items-center text-sm sm:text-base">
                                        <span className="font-medium text-xs sm:text-sm mr-1">{transaction.fromName}</span>
                                        <span className="text-muted-foreground text-xs">chuyển cho</span>
                                        <span className="font-medium text-xs sm:text-sm ml-1">{transaction.toName}</span>
                                      </div>
                                      
                                      {transaction.payment_status?.paid && (
                                        <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                          <CheckCircle className="h-3 w-3" />
                                          <span>
                                            Đã thanh toán lúc {new Date(transaction.payment_status.paid_at || '').toLocaleTimeString('vi-VN', {
                                              hour: '2-digit',
                                              minute: '2-digit',
                                              day: '2-digit',
                                              month: '2-digit',
                                            })}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                      <span className="font-semibold text-sm sm:text-base">{formatCurrency(transaction.amount)}</span>
                                      
                                      {!transaction.payment_status?.paid && (transaction.toBankAccount || transaction.toBankName) && (
                                        <Link 
                                          href={`/expenses/${expenseItem.expenseId}/split`} 
                                          className="text-primary hover:text-primary/80 text-xs sm:text-sm flex items-center gap-1"
                                        >
                                          <span className="hidden sm:inline">Xem chi tiết</span>
                                          <span className="sm:hidden">Chi tiết</span>
                                          <ArrowRight className="h-3 w-3 ml-1" />
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
} 