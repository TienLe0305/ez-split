"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Split, Wallet, Users, DollarSign, AlertCircle, Receipt, CalendarIcon } from 'lucide-react';
import { getUsers, createExpense, User } from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency, getCurrentDate, thousandsToAmount, amountToThousands } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ThousandsInput } from '@/components/ui/thousands-input';
import { QuickExpenseType } from '@/components/ui/quick-expense-type';
import { useToast } from "@/components/ui/use-toast";

export default function NewExpensePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [amountInThousands, setAmountInThousands] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<{ [key: number]: boolean }>({});
  const [participantAmounts, setParticipantAmounts] = useState<{ [key: number]: string }>({});
  const [participantThousands, setParticipantThousands] = useState<{ [key: number]: string }>({});
  const [equalSplit, setEqualSplit] = useState(true);
  const [date, setDate] = useState(getCurrentDate());
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUsers();
        setUsers(data);
        
        // Initialize selected participants with only the payer selected
        const initialParticipants: { [key: number]: boolean } = {};
        const initialAmounts: { [key: number]: string } = {};
        const initialThousands: { [key: number]: string } = {};
        
        // Set default payer if there are users
        if (data.length > 0) {
          const defaultPayerId = data[0].id;
          setPayerId(defaultPayerId.toString());
          
          // Initialize with only the payer as a participant
          data.forEach(user => {
            initialParticipants[user.id] = user.id === defaultPayerId;
            initialAmounts[user.id] = '';
            initialThousands[user.id] = '';
          });
        }
        
        setSelectedParticipants(initialParticipants);
        setParticipantAmounts(initialAmounts);
        setParticipantThousands(initialThousands);
        
      } catch (err) {
        setError('Không thể tải dữ liệu người dùng. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Update participants when payer changes
  useEffect(() => {
    if (payerId && users.length > 0) {
      const payerIdNum = parseInt(payerId);
      const newSelected = { ...selectedParticipants };
      
      // Always ensure the payer is a participant
      if (!newSelected[payerIdNum]) {
        newSelected[payerIdNum] = true;
        setSelectedParticipants(newSelected);
      }
    }
  }, [payerId, users, selectedParticipants]);
  
  // Update amount when thousands input changes
  const handleAmountChange = useCallback((newAmount: number) => {
    setAmount(newAmount.toString());
  }, []);
  
  // Select an expense type from quick options
  const handleExpenseTypeSelect = useCallback((expenseName: string) => {
    setName(expenseName);
  }, []);
  
  // Calculate equal share when amount or participants change
  useEffect(() => {
    if (equalSplit && amount) {
      const selectedCount = Object.values(selectedParticipants).filter(Boolean).length;
      
      if (selectedCount > 0) {
        const amountValue = parseFloat(amount);
        const equalShare = (amountValue / selectedCount).toFixed(2);
        
        const newAmounts = { ...participantAmounts };
        const newThousands = { ...participantThousands };
        
        Object.keys(selectedParticipants).forEach(userIdStr => {
          const userId = parseInt(userIdStr);
          if (selectedParticipants[userId]) {
            newAmounts[userId] = equalShare;
            // Convert to thousands format for display
            newThousands[userId] = amountToThousands(equalShare);
          } else {
            newAmounts[userId] = '';
            newThousands[userId] = '';
          }
        });
        
        setParticipantAmounts(newAmounts);
        setParticipantThousands(newThousands);
      }
    }
  }, [amount, selectedParticipants, equalSplit]);
  
  // Toggle participant selection
  const toggleParticipant = useCallback((userId: number) => {
    const newSelected = { ...selectedParticipants };
    newSelected[userId] = !newSelected[userId];
    setSelectedParticipants(newSelected);
    
    // If unselected, clear amount
    if (!newSelected[userId]) {
      const newAmounts = { ...participantAmounts };
      const newThousands = { ...participantThousands };
      newAmounts[userId] = '';
      newThousands[userId] = '';
      setParticipantAmounts(newAmounts);
      setParticipantThousands(newThousands);
    }
  }, [selectedParticipants, participantAmounts, participantThousands]);
  
  // Update participant amount
  const updateParticipantAmount = useCallback((userId: number, thousandsValue: string) => {
    // Update the displayed thousands value
    const newThousands = { ...participantThousands };
    newThousands[userId] = thousandsValue;
    setParticipantThousands(newThousands);
    
    // Update the actual amount value
    const newAmounts = { ...participantAmounts };
    const actualAmount = thousandsToAmount(thousandsValue);
    newAmounts[userId] = actualAmount.toString();
    setParticipantAmounts(newAmounts);
    
    // Disable equal split if manually editing amounts
    if (equalSplit && thousandsValue) {
      setEqualSplit(false);
    }
  }, [participantThousands, participantAmounts, equalSplit]);
  
  // Toggle equal split
  const toggleEqualSplit = () => {
    setEqualSplit(!equalSplit);
  };
  
  // Validate form before submission
  const validateForm = () => {
    if (!name.trim()) {
      setError('Vui lòng nhập tên chi tiêu');
      return false;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return false;
    }
    
    if (!payerId) {
      setError('Vui lòng chọn người trả tiền');
      return false;
    }
    
    const participantCount = Object.values(selectedParticipants).filter(Boolean).length;
    if (participantCount === 0) {
      setError('Vui lòng chọn ít nhất một người tham gia');
      return false;
    }
    
    // Check if all participant amounts are valid and sum is correct
    let totalParticipantAmount = 0;
    let allValid = true;
    
    for (const userId in selectedParticipants) {
      if (selectedParticipants[parseInt(userId)]) {
        const participantAmount = participantAmounts[parseInt(userId)];
        
        if (!participantAmount || isNaN(parseFloat(participantAmount))) {
          setError(`Vui lòng nhập số tiền cho tất cả người tham gia`);
          allValid = false;
          break;
        }
        
        totalParticipantAmount += parseFloat(participantAmount);
      }
    }
    
    if (!allValid) return false;
    
    // Allow small rounding errors (within 1 VND)
    const amountValue = parseFloat(amount);
    if (Math.abs(totalParticipantAmount - amountValue) > 1) {
      setError(`Tổng số tiền phân chia (${formatCurrency(totalParticipantAmount)}) phải bằng tổng chi phí (${formatCurrency(amountValue)})`);
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Prepare participants data
      const participants = [];
      
      for (const userId in selectedParticipants) {
        if (selectedParticipants[parseInt(userId)]) {
          participants.push({
            user_id: parseInt(userId),
            amount: parseFloat(participantAmounts[parseInt(userId)]),
            expense_id: 0 // This will be set by the backend
          });
        }
      }
      
      // Create expense
      const response = await createExpense({
        name,
        amount: parseFloat(amount),
        payer_id: parseInt(payerId),
        date,
        participants
      } as unknown as Omit<import('@/lib/api').Expense, 'id' | 'created_at'>);
      
      // Redirect to split page with a query parameter that indicates this is a new expense
      router.push(`/expenses/${response.id}/split?new=true`);
      
      toast({
        title: "Thành công!",
        description: "Chi tiêu đã được tạo",
      });
      
    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra khi lưu chi tiêu. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate total amount of selected participants
  const calculateTotalParticipantAmount = () => {
    let total = 0;
    
    for (const userId in selectedParticipants) {
      if (selectedParticipants[parseInt(userId)]) {
        const amount = participantAmounts[parseInt(userId)];
        if (amount && !isNaN(parseFloat(amount))) {
          total += parseFloat(amount);
        }
      }
    }
    
    return total;
  };
  
  const totalParticipantAmount = calculateTotalParticipantAmount();
  const amountValue = amount ? parseFloat(amount) : 0;
  const difference = amountValue - totalParticipantAmount;
  
  // Calculate number of selected participants
  const selectedParticipantCount = Object.values(selectedParticipants).filter(Boolean).length;
  
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
      <div className="flex flex-col items-start justify-between gap-4 mb-6">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Thêm chi tiêu</h1>
          <Link href="/expenses">
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <ArrowLeft className="h-4 w-4" /> Quay lại
            </Button>
          </Link>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Thêm khoản chi tiêu mới và phân chia cho các thành viên
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-4 bg-muted/30 border-b">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Thông tin chi tiêu
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-5 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm flex items-center gap-1.5">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  Tên chi tiêu
                </Label>
                
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading || isSubmitting}
                  placeholder="Nhập tên chi tiêu"
                  className="h-10"
                />
                
                <div className="pt-1">
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Chọn nhanh loại chi tiêu</Label>
                  <QuickExpenseType onSelect={handleExpenseTypeSelect} />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="amount" className="text-sm flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Số tiền
                </Label>
                <ThousandsInput
                  id="amount"
                  value={amountInThousands}
                  onChange={setAmountInThousands}
                  onAmountChange={handleAmountChange}
                  disabled={isLoading || isSubmitting}
                  placeholder="Nhập số tiền (nghìn đồng)"
                  className="h-10"
                />
                {amount && (
                  <div className="text-xs text-muted-foreground">
                    = {formatCurrency(parseFloat(amount))}
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="date" className="text-sm flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  Ngày chi tiêu
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isLoading || isSubmitting}
                  className="h-10 w-full md:w-5/6"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="payer" className="text-sm flex items-center gap-1.5">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  Người trả tiền
                </Label>
                <Select
                  value={payerId}
                  onValueChange={(value) => setPayerId(value)}
                  disabled={isLoading || isSubmitting}
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Chọn người trả tiền" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Người tham gia
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="equal-split"
                      checked={equalSplit}
                      onCheckedChange={toggleEqualSplit}
                      disabled={isLoading || isSubmitting}
                    />
                    <label
                      htmlFor="equal-split"
                      className="text-sm font-medium leading-none"
                    >
                      Chia đều
                    </label>
                  </div>
                </div>
                
                <Card className="border-dashed">
                  <CardHeader className="py-3 px-4 bg-muted/10">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">
                        {selectedParticipantCount} người tham gia
                      </div>
                      {amount && (
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-muted-foreground">
                            Tổng: {formatCurrency(totalParticipantAmount)}
                          </div>
                          {Math.abs(difference) > 0.01 && (
                            <div className={difference > 0 ? 'text-xs text-red-500' : difference < 0 ? 'text-xs text-orange-500' : ''}>
                              {difference > 0 ? 'Thiếu' : 'Thừa'}: {formatCurrency(Math.abs(difference))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="py-3 px-4">
                    {isLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                      </div>
                    ) : (
                      <Accordion type="single" collapsible className="w-full" defaultValue="participants">
                        <AccordionItem value="participants" className="border-none">
                          <AccordionTrigger className="py-2 px-0">
                            <span className="text-sm font-medium">{equalSplit ? 'Chia đều cho mọi người' : 'Chia theo số tiền tùy chỉnh'}</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 pt-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-3 md:space-y-0">
                              {users.map(user => (
                                <div key={user.id} className="flex items-center space-x-2 p-2 rounded-md border bg-background">
                                  <Checkbox
                                    id={`user-${user.id}`}
                                    checked={selectedParticipants[user.id] || false}
                                    onCheckedChange={() => toggleParticipant(user.id)}
                                    disabled={isSubmitting}
                                    className="shrink-0"
                                  />
                                  <label
                                    htmlFor={`user-${user.id}`}
                                    className="flex-1 text-sm font-medium leading truncate mr-2"
                                  >
                                    {user.name}
                                  </label>
                                  <div className="w-[130px] flex-shrink-0">
                                    <ThousandsInput
                                      value={participantThousands[user.id] || ''}
                                      onChange={(value) => updateParticipantAmount(user.id, value)}
                                      disabled={!selectedParticipants[user.id] || equalSplit || isSubmitting}
                                      placeholder="Số tiền"
                                      className="h-8 text-sm"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t p-4 bg-muted/5">
            <Link href="/expenses">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="w-28"
              >
                Hủy
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="gap-2 w-28"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-background/40 border-t-background animate-spin"></div>
                  <span>Lưu...</span>
                </>
              ) : (
                <>
                  <Split className="h-4 w-4" />
                  <span>Lưu</span>
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
} 