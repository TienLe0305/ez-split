'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Users, Wallet, Search, MoreHorizontal, Calendar, Split, CheckCircle2 } from 'lucide-react';
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

  // Get the expense being deleted
  const expenseBeingDeleted = expenseToDelete !== null 
    ? expenses.find(expense => expense.id === expenseToDelete) 
    : null;

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getExpensesWithStatus();
      setExpenses(data);
    } catch (err) {
      setError('Không thể tải danh sách chi tiêu. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setIsLoading(false);
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
    <div className="container px-4 py-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chi tiêu</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các khoản chi tiêu của nhóm
          </p>
        </div>
        <Link href="/expenses/new">
          <Button size="sm" className="h-9 gap-1">
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
          <div className="flex flex-shrink-0 gap-3">
            <Button variant="outline" size="sm" className="h-9" onClick={fetchExpenses}>
              <span className={isLoading ? "animate-spin mr-1" : "mr-1"}>↻</span> Tải lại
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
            <p className="text-muted-foreground mb-4 text-center max-w-md">
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30%] min-w-[200px] font-medium">Tên chi tiêu</TableHead>
                      <TableHead className="w-[20%] min-w-[150px] font-medium">Người trả</TableHead>
                      <TableHead className="w-[15%] min-w-[100px] font-medium text-right">Số tiền</TableHead>
                      <TableHead className="w-[15%] min-w-[80px] font-medium hidden md:table-cell text-center">
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
                          <div className="flex items-center">
                            <span className="truncate">{expense.name}</span>
                            {expense.all_payments_completed && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Đã thanh toán
                              </span>
                            )}
                            {!expense.all_payments_completed && expense.completed_count > 0 && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                {expense.completed_count}/{expense.payment_count}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 font-medium text-xs">
                              {expense.payer_name.charAt(0)}
                            </div>
                            <span>{expense.payer_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-center">
                          <div className="flex items-center justify-center">
                            <span className="mr-1">{expense.participants_count || 0}</span>
                            <Users className="h-3.5 w-3.5" />
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-center">
                          {formatDate(expense?.created_at ?? '')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <Link href={`/expenses/${expense.id}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                              </Link>
                              <Link href={`/expenses/${expense.id}/split`}>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Split className="h-4 w-4 mr-2" />
                                  Xem chia tiền
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem 
                                className="cursor-pointer text-destructive focus:text-destructive"
                                onSelect={(e) => {
                                  e.preventDefault();
                                  openDeleteDialog(expense.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <CardFooter className="flex justify-between p-4 pt-0">
                <p className="text-sm text-muted-foreground">
                  Hiển thị {filteredExpenses.length} / {expenses.length} khoản chi tiêu
                </p>
              </CardFooter>
            </div>
          </>
        )}
      </div>
      
      {/* Centralized delete dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khoản chi tiêu {expenseBeingDeleted ? <>&quot;{expenseBeingDeleted.name}&quot;</> : 'này'}? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => expenseToDelete !== null && handleDelete(expenseToDelete)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 