'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Loader2, 
  Users as UsersIcon, 
  Search, 
  Building, 
  CreditCard
} from 'lucide-react';
import { User } from '@/lib/api';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/lib/query/hooks';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// List of Vietnamese bank codes supported by sepay.vn
const BANK_CODES = [
  { code: 'VCB', name: 'Vietcombank (VCB)' },
  { code: 'CTG', name: 'VietinBank (CTG)' },
  { code: 'BIDV', name: 'BIDV' },
  { code: 'VPB', name: 'VPBank (VPB)' },
  { code: 'TCB', name: 'Techcombank (TCB)' },
  { code: 'MB', name: 'MBBank (MB)' },
  { code: 'ACB', name: 'ACB' },
  { code: 'STB', name: 'Sacombank (STB)' },
  { code: 'TPB', name: 'TPBank (TPB)' },
  { code: 'SHB', name: 'SHBank (SHB)' },
  { code: 'OCB', name: 'OCB' },
  { code: 'HDB', name: 'HDBank (HDB)' },
  { code: 'VIB', name: 'VIB Bank' },
  { code: 'MSB', name: 'MSB (Maritime Bank)' },
  { code: 'LPB', name: 'LienVietPostBank (LPB)' },
  { code: 'SEAB', name: 'SeABank (SEAB)' },
  { code: 'ABB', name: 'ABBank (ABB)' },
  { code: 'NAB', name: 'NamABank (NAB)' },
  { code: 'VAB', name: 'VietABank (VAB)' },
  { code: 'BVB', name: 'BaoVietBank (BVB)' },
  { code: 'SGB', name: 'SaigonBank (SGB)' },
  { code: 'VARB', name: 'Agribank (VARB)' },
  { code: 'CIMB', name: 'CIMB Bank' },
  { code: 'PGB', name: 'PGBank (PGB)' },
  { code: 'KLB', name: 'KienLongBank (KLB)' },
  { code: 'EIB', name: 'Eximbank (EIB)' },
  { code: 'VCCB', name: 'VietCapitalBank (VCCB)' },
  { code: 'SCB', name: 'SCB' },
  { code: 'WOO', name: 'Woori Bank (WOO)' },
];

export default function UsersPage() {
  const { toast } = useToast();
  const { data: users = [], isLoading, isError, refetch } = useUsers({
    queryKey: ['users'],
    refetchInterval: 30000, // Automatically refetch every 30 seconds
  });
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Form state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bank_account: '',
    bank_name: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (value: string, fieldName: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Open create user dialog
  const handleOpenCreateDialog = () => {
    setFormData({
      name: '',
      bank_account: '',
      bank_name: '',
    });
    setIsCreateDialogOpen(true);
  };

  // Open edit user dialog
  const handleOpenEditDialog = (user: User) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      bank_account: user.bank_account || '',
      bank_name: user.bank_name || '',
    });
    setIsEditDialogOpen(true);
  };

  // Open delete user dialog
  const handleOpenDeleteDialog = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Create a new user
  const handleCreateUser = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Vui lòng nhập tên người dùng',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        name: formData.name.trim(),
        bank_account: formData.bank_account.trim() || undefined,
        bank_name: formData.bank_name || undefined,
      });

      toast({
        title: 'Tạo người dùng thành công',
        description: `Đã thêm "${formData.name}" vào danh sách`,
      });

      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Không thể tạo người dùng',
        description: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định',
        variant: 'destructive',
      });
    }
  };

  // Update an existing user
  const handleUpdateUser = async () => {
    if (!currentUser || !formData.name.trim()) {
      toast({
        title: 'Vui lòng nhập tên người dùng',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        id: currentUser.id,
        userData: {
          name: formData.name.trim(),
          bank_account: formData.bank_account.trim() || undefined,
          bank_name: formData.bank_name || undefined,
        },
      });

      toast({
        title: 'Cập nhật thành công',
        description: `Đã cập nhật thông tin của "${formData.name}"`,
      });

      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Không thể cập nhật',
        description: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định',
        variant: 'destructive',
      });
    }
  };

  // Delete a user
  const handleDeleteUser = async () => {
    if (!currentUser) return;

    try {
      await deleteUserMutation.mutateAsync(currentUser.id);
      
      // Manually trigger refetch to ensure the UI updates immediately
      await refetch();

      toast({
        title: 'Xóa người dùng thành công',
        description: `Đã xóa "${currentUser.name}" khỏi danh sách`,
      });

      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Không thể xóa người dùng',
        description: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định',
        variant: 'destructive',
      });
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.bank_name && user.bank_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.bank_account && user.bank_account.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Người dùng</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Quản lý thành viên trong nhóm
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-9 gap-1 w-full sm:w-auto justify-center" onClick={handleOpenCreateDialog}>
              <Plus className="h-4 w-4" /> Thêm người dùng
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm người dùng mới</DialogTitle>
              <DialogDescription>
                Điền thông tin để thêm người dùng mới vào nhóm.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="required">
                  Tên
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên người dùng"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bank_account">Số tài khoản</Label>
                <Input
                  id="bank_account"
                  name="bank_account"
                  value={formData.bank_account}
                  onChange={handleInputChange}
                  placeholder="Nhập số tài khoản ngân hàng (không bắt buộc)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bank_name">Tên ngân hàng</Label>
                <Select
                  value={formData.bank_name}
                  onValueChange={(value) => handleSelectChange(value, 'bank_name')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn ngân hàng (không bắt buộc)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Ngân hàng phổ biến</SelectLabel>
                      {BANK_CODES.map((bank) => (
                        <SelectItem key={bank.code} value={bank.code}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Chọn đúng mã ngân hàng để tạo mã QR chuyển khoản.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleCreateUser}
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Thêm người dùng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm người dùng, ngân hàng..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-white dark:bg-gray-950">
            <div className="h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4"></div>
            <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        ) : isError ? (
          <div className="bg-destructive/10 p-6 rounded-lg text-destructive text-center border border-destructive/20">
            <p className="font-medium mb-2">Không thể tải danh sách người dùng. Vui lòng thử lại sau.</p>
          </div>
        ) : filteredUsers.length === 0 && searchTerm ? (
          <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-white dark:bg-gray-950">
            <p className="text-muted-foreground mb-2">Không tìm thấy kết quả phù hợp</p>
            <Button variant="outline" size="sm" onClick={() => setSearchTerm('')}>
              Xóa tìm kiếm
            </Button>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-white dark:bg-gray-950">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <UsersIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-1">Chưa có người dùng nào</h3>
            <p className="text-muted-foreground mb-4 text-center max-w-md px-4">
              Hãy thêm người dùng đầu tiên để bắt đầu quản lý nhóm và phân chia chi phí
            </p>
            <Button onClick={handleOpenCreateDialog}>
              <Plus className="mr-2 h-4 w-4" /> Thêm người dùng đầu tiên
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden bg-white dark:bg-gray-950">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%] min-w-[180px] font-medium">Tên</TableHead>
                    <TableHead className="w-[25%] min-w-[120px] font-medium hidden sm:table-cell">
                      <div className="flex items-center justify-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Số tài khoản
                      </div>
                    </TableHead>
                    <TableHead className="w-[25%] min-w-[120px] font-medium hidden sm:table-cell">
                      <div className="flex items-center justify-center">
                        <Building className="h-4 w-4 mr-2" />
                        Ngân hàng
                      </div>
                    </TableHead>
                    <TableHead className="w-[5%] min-w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="group">
                      <TableCell className="font-medium">
                        <div>{user.name}</div>
                        {/* Mobile view - show bank info in the name cell */}
                        <div className="sm:hidden mt-1 space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <CreditCard className="h-3 w-3 mr-1" />
                            <span>{user.bank_account || "—"}</span>
                          </div>
                          <div className="flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            <span>{user.bank_name || "—"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell">{user.bank_account || "—"}</TableCell>
                      <TableCell className="text-center hidden sm:table-cell">{user.bank_name || "—"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 sm:data-[state=open]:opacity-100"
                            >
                              <span className="sr-only">Mở menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleOpenEditDialog(user)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleOpenDeleteDialog(user)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
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
          </div>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin người dùng
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="required">
                Tên
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên người dùng"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-bank_account">Số tài khoản</Label>
              <Input
                id="edit-bank_account"
                name="bank_account"
                value={formData.bank_account}
                onChange={handleInputChange}
                placeholder="Nhập số tài khoản ngân hàng (không bắt buộc)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-bank_name">Tên ngân hàng</Label>
              <Select
                value={formData.bank_name}
                onValueChange={(value) => handleSelectChange(value, 'bank_name')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn ngân hàng (không bắt buộc)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Ngân hàng phổ biến</SelectLabel>
                    {BANK_CODES.map((bank) => (
                      <SelectItem key={bank.code} value={bank.code}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Chọn đúng mã ngân hàng để tạo mã QR chuyển khoản.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateUser}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng{' '}
              <strong>{currentUser?.name}</strong> không? Hành động này không
              thể hoàn tác.
              <br />
              <br />
              <span className="text-destructive font-semibold">
                Lưu ý: Chỉ có thể xóa người dùng chưa tham gia vào bất kỳ chi tiêu nào.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteUserMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Xóa người dùng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 