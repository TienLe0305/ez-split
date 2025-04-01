'use client';

import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryOptions,
  UseMutationOptions 
} from '@tanstack/react-query';
import * as api from '../api';
import { 
  Expense,
  PaymentStatus,
  ExpenseSummary,
  User,
  ExpenseWithStatus,
  TransactionsByExpense
} from '../api';

// Key factory for queries
export const queryKeys = {
  users: ['users'],
  expenses: ['expenses'],
  expense: (id: number) => ['expenses', id],
  summary: ['summary'],
  expenseSummary: (id: number) => ['expenses', id, 'summary'],
  expensesWithStatus: ['expenses', 'status'],
  expensesTransactions: ['expenses', 'transactions'],
};

// User hooks
export function useUsers(options?: UseQueryOptions<User[]>) {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => api.getUsers(),
    ...options,
  });
}

// Expense hooks
export function useExpenses(options?: UseQueryOptions<Expense[]>) {
  return useQuery({
    queryKey: queryKeys.expenses,
    queryFn: () => api.getExpenses(),
    ...options,
  });
}

export function useExpense(id: number, options?: UseQueryOptions<Expense>) {
  return useQuery({
    queryKey: queryKeys.expense(id),
    queryFn: () => api.getExpenseById(id),
    ...options,
  });
}

export function useCreateExpense(
  options?: UseMutationOptions<
    Expense, 
    Error, 
    Omit<Expense, 'id' | 'created_at'>
  >
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (expense: Omit<Expense, 'id' | 'created_at'>) => 
      api.createExpense(expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
      queryClient.invalidateQueries({ queryKey: queryKeys.summary });
      queryClient.invalidateQueries({ queryKey: queryKeys.expensesWithStatus });
      queryClient.invalidateQueries({ queryKey: queryKeys.expensesTransactions });
    },
    ...options,
  });
}

export function useUpdateExpense(
  options?: UseMutationOptions<
    Expense, 
    Error, 
    { id: number; data: Omit<Expense, 'id' | 'created_at'> }
  >
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Expense, 'id' | 'created_at'> }) => 
      api.updateExpense(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expense(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
      queryClient.invalidateQueries({ queryKey: queryKeys.summary });
      queryClient.invalidateQueries({ queryKey: queryKeys.expenseSummary(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.expensesWithStatus });
      queryClient.invalidateQueries({ queryKey: queryKeys.expensesTransactions });
    },
    ...options,
  });
}

export function useDeleteExpense(
  options?: UseMutationOptions<void, Error, number>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => api.deleteExpense(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
      queryClient.invalidateQueries({ queryKey: queryKeys.expense(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.summary });
      queryClient.invalidateQueries({ queryKey: queryKeys.expensesWithStatus });
      queryClient.invalidateQueries({ queryKey: queryKeys.expensesTransactions });
    },
    ...options,
  });
}

// Summary hooks
export function useSummary(options?: UseQueryOptions<ExpenseSummary>) {
  return useQuery({
    queryKey: queryKeys.summary,
    queryFn: () => api.getSummary(),
    ...options,
  });
}

export function useExpenseSummary(
  expenseId: number,
  options?: UseQueryOptions<{
    expense: Expense;
    transactions: api.Transaction[];
    allCompleted: boolean;
  }>
) {
  return useQuery({
    queryKey: queryKeys.expenseSummary(expenseId),
    queryFn: () => api.getExpenseSummary(expenseId),
    ...options,
  });
}

export function useExpensesWithStatus(
  options?: UseQueryOptions<ExpenseWithStatus[]>
) {
  return useQuery({
    queryKey: queryKeys.expensesWithStatus,
    queryFn: () => api.getExpensesWithStatus(),
    ...options,
  });
}

export function useUpdatePaymentStatus(
  options?: UseMutationOptions<
    PaymentStatus,
    Error,
    { transactionId: string | number; paid: boolean }
  >
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ transactionId, paid }: { transactionId: string | number; paid: boolean }) => 
      api.updatePaymentStatus(transactionId, paid),
    onSuccess: () => {
      // Invalidate all summary-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.summary });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      // We can't know which expense this transaction belongs to, so invalidate all
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          Array.isArray(query.queryKey) && 
          query.queryKey[0] === 'expenses' && 
          query.queryKey[2] === 'summary'
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.expensesWithStatus });
      queryClient.invalidateQueries({ queryKey: queryKeys.expensesTransactions });
    },
    ...options,
  });
}

export function useExpensesTransactions(
  options?: UseQueryOptions<TransactionsByExpense[]>
) {
  return useQuery({
    queryKey: queryKeys.expensesTransactions,
    queryFn: () => api.getExpensesTransactions(),
    ...options,
  });
} 