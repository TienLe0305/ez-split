"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Split, Wallet, Users, DollarSign, AlertCircle, Receipt } from 'lucide-react';
import { getUsers, createExpense, User, Participant } from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function NewExpensePage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<{ [key: number]: boolean }>({});
  const [participantAmounts, setParticipantAmounts] = useState<{ [key: number]: string }>({});
  const [equalSplit, setEqualSplit] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUsers();
        setUsers(data);
        
        // Initialize selected participants with all users checked
        const initialParticipants: { [key: number]: boolean } = {};
        const initialAmounts: { [key: number]: string } = {};
        
        data.forEach(user => {
          initialParticipants[user.id] = true;
          initialAmounts[user.id] = '';
        });
        
        setSelectedParticipants(initialParticipants);
        setParticipantAmounts(initialAmounts);
      } catch (err) {
        setError('Không thể tải dữ liệu người dùng. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Calculate equal share when amount or participants change
  useEffect(() => {
    if (equalSplit && amount) {
      const selectedCount = Object.values(selectedParticipants).filter(Boolean).length;
      
      if (selectedCount > 0) {
        const amountValue = parseFloat(amount);
        const equalShare = (amountValue / selectedCount).toFixed(2);
        
        const newAmounts = { ...participantAmounts };
        
        Object.keys(selectedParticipants).forEach(userIdStr => {
          const userId = parseInt(userIdStr);
          if (selectedParticipants[userId]) {
            newAmounts[userId] = equalShare;
          } else {
            newAmounts[userId] = '';
          }
        });
        
        setParticipantAmounts(newAmounts);
      }
    }
  }, [amount, selectedParticipants, equalSplit]);
  
  // Toggle participant selection
  const toggleParticipant = (userId: number) => {
    const newSelected = { ...selectedParticipants };
    newSelected[userId] = !newSelected[userId];
    setSelectedParticipants(newSelected);
    
    // If unselected, clear amount
    if (!newSelected[userId]) {
      const newAmounts = { ...participantAmounts };
      newAmounts[userId] = '';
      setParticipantAmounts(newAmounts);
    }
  };
  
  // Update participant amount
  const updateParticipantAmount = (userId: number, newAmount: string) => {
    const newAmounts = { ...participantAmounts };
    newAmounts[userId] = newAmount;
    setParticipantAmounts(newAmounts);
    
    // Disable equal split if manually editing amounts
    if (equalSplit && newAmount) {
      setEqualSplit(false);
    }
  };
  
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
      const participants: Participant[] = [];
      
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
      await createExpense({
        name,
        amount: parseFloat(amount),
        payer_id: parseInt(payerId),
        participants
      });
      
      // Redirect back to expenses list
      router.push('/expenses');
      
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
    <div className="container px-4 py-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thêm chi tiêu</h1>
          <p className="text-muted-foreground mt-1">
            Thêm khoản chi tiêu mới và phân chia cho các thành viên
          </p>
        </div>
        <Link href="/expenses">
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </Button>
        </Link>
      </div>

      <div className="mx-auto">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Thông tin chi tiêu
              </CardTitle>
              <CardDescription>
                Nhập thông tin chi tiết cho khoản chi tiêu mới
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Lỗi</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid gap-5">
                <div className="grid gap-3">
                  <Label htmlFor="name" className="flex items-center gap-1.5">
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                    Tên chi tiêu
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading || isSubmitting}
                    placeholder="Ví dụ: Ăn tối, Đi chơi, Mua sắm..."
                    className="h-10"
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="amount" className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Số tiền (VND)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isLoading || isSubmitting}
                    placeholder="Nhập tổng số tiền chi tiêu"
                    className="h-10"
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="payer" className="flex items-center gap-1.5">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    Người trả tiền
                  </Label>
                  <Select
                    value={payerId}
                    onValueChange={(value) => setPayerId(value)}
                    disabled={isLoading || isSubmitting}
                  >
                    <SelectTrigger className="h-10">
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
                
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1.5">
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
                    <CardHeader className="p-4 pb-2">
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
                    
                    <CardContent className="p-4 pt-0">
                      {isLoading ? (
                        <div className="flex justify-center py-4">
                          <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                        </div>
                      ) : (
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="participants">
                            <AccordionTrigger className="py-2">
                              <span className="text-sm font-medium">{equalSplit ? 'Chia đều cho mọi người' : 'Chia theo số tiền tùy chỉnh'}</span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3 pt-2">
                                {users.map(user => (
                                  <div key={user.id} className="flex items-center gap-3 p-2 rounded-md border bg-background">
                                    <Checkbox
                                      id={`user-${user.id}`}
                                      checked={selectedParticipants[user.id] || false}
                                      onCheckedChange={() => toggleParticipant(user.id)}
                                      disabled={isSubmitting}
                                    />
                                    <label
                                      htmlFor={`user-${user.id}`}
                                      className="flex-1 text-sm font-medium leading-none"
                                    >
                                      {user.name}
                                    </label>
                                    <Input
                                      type="number"
                                      value={participantAmounts[user.id] || ''}
                                      onChange={(e) => updateParticipantAmount(user.id, e.target.value)}
                                      disabled={!selectedParticipants[user.id] || equalSplit || isSubmitting}
                                      placeholder="Số tiền"
                                      className="w-32 h-8 text-sm"
                                    />
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
            
            <CardFooter className="flex justify-between border-t p-6">
              <Link href="/expenses">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Hủy bỏ
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-background/40 border-t-background animate-spin"></div>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Split className="h-4 w-4" />
                    <span>Lưu chi tiêu</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
} 