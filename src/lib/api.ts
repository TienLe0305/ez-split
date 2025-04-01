// API base URL - update this with your deployed backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface User {
  id: number;
  name: string;
  bank_account?: string;
  bank_name?: string;
}

export interface Participant {
  expense_id: number;
  user_id: number;
  amount: number;
  user?: User;
}

export interface Expense {
  id: number;
  name: string;
  amount: number;
  date: string;
  payer_id: number;
  payer?: User;
  participants?: ExpenseParticipant[];
  created_at?: string;
  updated_at?: string;
}

export interface UserSummary {
  id: number;
  name: string;
  paid: number;
  spent: number;
  balance: number;
  bank_account?: string;
  bank_name?: string;
}

export interface Transaction {
  id: number;
  fromUserId: number;
  toUserId: number;
  fromName: string;
  toName: string;
  amount: number;
  fromBankAccount?: string;
  toBankAccount?: string;
  fromBankName?: string;
  toBankName?: string;
  relatedExpenses?: string[];
  expenseIds?: number[];
  payment_status?: PaymentStatus;
}

export interface ExpenseSummary {
  userSummary: UserSummary[];
  transactions: Transaction[];
}

export interface ExpenseWithStatus extends Expense {
  payer_name: string;
  payment_count: number;
  completed_count: number;
  all_payments_completed: boolean;
  participants_count: number;
}

export interface ExpenseDetailSummary {
  expense: Expense;
  userSummary: UserSummary[];
  transactions: Transaction[];
  allCompleted: boolean;
}

export interface ExpenseParticipant {
  id: number;
  expense_id: number;
  user_id: number;
  amount: number;
  share?: number;
  user?: User;
  payment_status?: PaymentStatus;
}

export interface PaymentStatus {
  id?: number;
  transaction_id: number;
  paid: boolean;
  paid_at?: string;
}

export interface TransactionsByExpense {
  expenseId: number;
  expenseName: string;
  amount: number;
  date: string;
  transactions: Transaction[];
  allCompleted: boolean;
}

// API functions
export async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function getExpenses(): Promise<Expense[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses`);
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
}

export async function getExpenseById(id: number): Promise<Expense> {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch expense');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching expense with ID ${id}:`, error);
    throw error;
  }
}

export async function createExpense(expense: Omit<Expense, 'id' | 'created_at'>): Promise<Expense> {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });
    if (!response.ok) {
      throw new Error('Failed to create expense');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
}

export async function updateExpense(id: number, expense: Omit<Expense, 'id' | 'created_at'>): Promise<Expense> {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });
    if (!response.ok) {
      throw new Error('Failed to update expense');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating expense with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteExpense(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }
  } catch (error) {
    console.error(`Error deleting expense with ID ${id}:`, error);
    throw error;
  }
}

export async function getSummary(): Promise<ExpenseSummary> {
  try {
    const response = await fetch(`${API_BASE_URL}/summary`);
    if (!response.ok) {
      throw new Error('Failed to fetch summary');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching summary:', error);
    throw error;
  }
}

export async function getExpenseSummary(expenseId: number): Promise<{
  expense: Expense;
  transactions: Transaction[];
  allCompleted: boolean;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/summary/expense/${expenseId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch expense summary for ID ${expenseId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching summary for expense ${expenseId}:`, error);
    throw error;
  }
}

export async function getExpensesWithStatus(): Promise<ExpenseWithStatus[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/summary/expenses-with-status`);
    if (!response.ok) {
      throw new Error('Failed to fetch expenses with status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching expenses with status:', error);
    throw error;
  }
}

export async function updatePaymentStatus(transactionId: string | number, paid: boolean): Promise<PaymentStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/summary/payment/${transactionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paid }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update payment status for transaction ${transactionId}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating payment status for transaction ${transactionId}:`, error);
    throw error;
  }
}

export async function getExpensesTransactions(): Promise<TransactionsByExpense[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/summary/expenses-transactions`);
    if (!response.ok) {
      throw new Error('Failed to fetch expenses transactions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching expenses transactions:', error);
    throw error;
  }
} 