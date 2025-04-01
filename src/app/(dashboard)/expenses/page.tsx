'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Users, Wallet, Search, MoreHorizontal, Calendar, Split, CheckCircle2, RefreshCw } from 'lucide-react';
import { getExpensesWithStatus, deleteExpense, ExpenseWithStatus } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);
  const [isReloading, setIsReloading] = useState(false);

  // Get the expense being deleted
  const expenseBeingDeleted = expenseToDelete !== null 
    ? expenses.find(expense => expense.id === expenseToDelete) 
    : null;

  const fetchExpenses = async () => {
    try {
      setIsReloading(true);
      setIsLoading(true);
      setError(null);
      const data = await getExpensesWithStatus();
      setExpenses(data);
    } catch (err) {
      setError('Không thể tải danh sách chi tiêu. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsReloading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter(expense => expense.id !== id));
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    } catch (err) {
      console.error(err);
      setError('Không thể xóa chi tiêu. Vui lòng thử lại sau.');
    }
  };

  const openDeleteDialog = (id: number) => {
    setExpenseToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Filter expenses based on search term
  const filteredExpenses = expenses.filter(expense => 
    expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.payer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Chi tiêu</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Quản lý các khoản chi tiêu của nhóm
          </p>
        </div>
        <Link href="/expenses/new">
          <Button size="sm" className="h-9 gap-1 w-full sm:w-auto justify-center">
            <Plus className="h-4 w-4" /> Thêm chi tiêu
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm chi tiêu hoặc người trả..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-shrink-0 gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 w-full sm:w-auto justify-center relative transition-all duration-200 ease-in-out" 
              onClick={fetchExpenses}
              disabled={isLoading || isReloading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 transition-transform ${isReloading ? "animate-spin" : ""}`} />
              Tải lại
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-white dark:bg-gray-950">
            <div className="h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4"></div>
            <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 p-6 rounded-lg text-destructive text-center border border-destructive/20">
            <p className="font-medium mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchExpenses}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isReloading ? "animate-spin" : ""}`} />
              Thử lại
            </Button>
          </div>
        ) : filteredExpenses.length === 0 && searchTerm ? (
          <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-white dark:bg-gray-950">
            <p className="text-muted-foreground mb-2">Không tìm thấy kết quả phù hợp</p>
            <Button variant="outline" size="sm" onClick={() => setSearchTerm('')}>
              Xóa tìm kiếm
            </Button>
          </div>
        ) : expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-white dark:bg-gray-950">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-1">Chưa có chi tiêu nào</h3>
            <p className="text-muted-foreground mb-4 text-center max-w-md px-4">
              Hãy thêm khoản chi tiêu đầu tiên để bắt đầu quản lý và chia sẻ chi phí với nhóm bạn
            </p>
            <Link href="/expenses/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Thêm chi tiêu đầu tiên
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="rounded-lg border overflow-hidden bg-white dark:bg-gray-950">
              {/* Desktop view: Table */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30%] min-w-[180px] font-medium">Tên chi tiêu</TableHead>
                      <TableHead className="w-[20%] min-w-[120px] font-medium">Người trả</TableHead>
                      <TableHead className="w-[15%] min-w-[100px] font-medium text-right">Số tiền</TableHead>
                      <TableHead className="w-[15%] min-w-[80px] font-medium text-center">
                        <div className="flex items-center justify-center">
                          <Users className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[15%] min-w-[100px] font-medium hidden md:table-cell text-center">
                        <div className="flex items-center justify-center">
                          <Calendar className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[5%] min-w-[40px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => (
                      <TableRow key={expense.id} className="group">
                        <TableCell className="font-medium">
                          <Link href={`/expenses/${expense.id}`} className="block hover:underline focus:outline-none focus:underline">
                            <div className="flex items-center">
                              <span className="truncate">{expense.name}</span>
                              {expense.all_payments_completed && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  <span className="hidden xs:inline">Đã thanh toán</span>
                                </span>
                              )}
                              {!expense.all_payments_completed && expense.completed_count > 0 && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                  {expense.completed_count}/{expense.payment_count}
                                </span>
                              )}
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 font-medium text-xs">
                              {expense.payer_name.charAt(0)}
                            </div>
                            <span className="truncate">{expense.payer_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-center">
                          <div className="flex items-center justify-center">
                            <span className="mr-1">{expense.participants_count || 0}</span>
                            <Users className="h-3 w-3" />
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-center">
                          {formatDate(expense.created_at || expense.date)}
                        </TableCell>
                        <TableCell className="p-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 opacity-50 group-hover:opacity-100 focus:opacity-100"
                              >
                                <span className="sr-only">Mở menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px]">
                              <DropdownMenuLabel className="text-xs">Hành động</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <Link href={`/expenses/${expense.id}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Wallet className="mr-2 h-4 w-4" />
                                  <span>Chi tiết</span>
                                </DropdownMenuItem>
                              </Link>
                              <Link href={`/expenses/${expense.id}/split`}>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Split className="mr-2 h-4 w-4" />
                                  <span>Chia tiền</span>
                                </DropdownMenuItem>
                              </Link>
                              <Link href={`/expenses/${expense.id}/edit`}>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Chỉnh sửa</span>
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem 
                                className="cursor-pointer text-destructive focus:text-destructive"
                                onClick={(e) => {
                                  e.preventDefault();
                                  openDeleteDialog(expense.id);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Xóa</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Mobile view for smaller screens - show cards instead of table for better UX */}
              <div className="sm:hidden space-y-3 px-4 py-4">
                {filteredExpenses.map((expense) => (
                  <Link key={expense.id} href={`/expenses/${expense.id}`} className="block">
                    <div className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <div className="flex justify-between items-start mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-medium truncate">{expense.name}</h3>
                          {expense.all_payments_completed && (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                              <CheckCircle2 className="mr-0.5 h-3 w-3" />
                              <span className="hidden xs:inline">Đã TT</span>
                            </span>
                          )}
                          {!expense.all_payments_completed && expense.completed_count > 0 && (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-1.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              {expense.completed_count}/{expense.payment_count}
                            </span>
                          )}
                        </div>
                        <span className="font-medium whitespace-nowrap">{formatCurrency(expense.amount)}</span>
                      </div>
                      <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-2">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-1 font-medium text-xs">
                            {expense.payer_name.charAt(0)}
                          </div>
                          <span className="truncate max-w-[100px]">{expense.payer_name}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{expense.participants_count || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(expense.created_at || expense.date)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <CardFooter className="px-0 pb-0">
                <div className="text-sm text-muted-foreground">
                  {filteredExpenses.length} kết quả
                </div>
              </CardFooter>
            </div>
          </>
        )}
      </div>
      
      {/* Centralized delete dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa chi tiêu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa chi tiêu {expenseBeingDeleted?.name} với số tiền {expenseBeingDeleted ? formatCurrency(expenseBeingDeleted.amount) : ''}? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => expenseToDelete !== null && handleDelete(expenseToDelete)}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 