'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Users, 
  Plus, 
  Clock,
  ArrowUpRight,
  BarChart3,
  CalendarCheck
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/empty-state';

// Define activity type interface
interface Activity {
  id: number;
  title: string;
  amount: number;
  date: string;
  type: 'expense' | 'payment';
}

// Define stats interface
interface Stats {
  totalExpenses: number;
  pendingPayments: number;
  peopleCount: number;
  recentActivity: Activity[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalExpenses: 0,
    pendingPayments: 0,
    peopleCount: 0,
    recentActivity: []
  });

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalExpenses: 2450000,
        pendingPayments: 850000,
        peopleCount: 5,
        recentActivity: [
          { id: 1, title: 'Ăn trưa', amount: 250000, date: 'Hôm nay', type: 'expense' },
          { id: 2, title: 'Cafe', amount: 120000, date: 'Hôm qua', type: 'expense' },
          { id: 3, title: 'Taxi về nhà', amount: 180000, date: '25/04/2025', type: 'expense' },
        ]
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8 max-w-7xl mx-auto animate-fadeIn">
      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Chào mừng đến với EzSplitPVN</h1>
          <p className="text-muted-foreground mt-1">Giải pháp chia sẻ chi phí đơn giản và hiệu quả</p>
        </div>
        <Button onClick={() => router.push('/expenses/new')} className="w-full md:w-auto flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Thêm chi tiêu mới</span>
        </Button>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <motion.div 
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card className="overflow-hidden border-l-4 border-l-primary">
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium flex justify-between items-center">
                Tổng chi tiêu
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              {isLoading ? (
                <Skeleton className="h-8 w-3/4" />
              ) : (
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalExpenses)}
                </div>
              )}
            </CardContent>
            <CardFooter className="py-2 border-t text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium mr-1">+12.5%</span> 
              <span>so với tháng trước</span>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div 
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card className="overflow-hidden border-l-4 border-l-orange-500">
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium flex justify-between items-center">
                Chưa thanh toán
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              {isLoading ? (
                <Skeleton className="h-8 w-3/4" />
              ) : (
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.pendingPayments)}
                </div>
              )}
            </CardContent>
            <CardFooter className="py-2 border-t text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              <span className="text-red-500 font-medium mr-1">+5.2%</span> 
              <span>so với tháng trước</span>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div 
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card className="overflow-hidden border-l-4 border-l-blue-500">
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium flex justify-between items-center">
                Số người
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              {isLoading ? (
                <Skeleton className="h-8 w-3/4" />
              ) : (
                <div className="text-2xl font-bold">
                  {stats.peopleCount} người
                </div>
              )}
            </CardContent>
            <CardFooter className="py-2 border-t text-xs text-muted-foreground">
              <span>Sử dụng dịch vụ</span>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <motion.div 
          className="col-span-1 lg:col-span-4" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Tabs defaultValue="activity" className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Hoạt động gần đây</h2>
              <TabsList>
                <TabsTrigger value="activity">Tất cả</TabsTrigger>
                <TabsTrigger value="expenses">Chi tiêu</TabsTrigger>
                <TabsTrigger value="payments">Thanh toán</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="activity" className="h-full">
              <Card className="h-full">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : stats.recentActivity.length > 0 ? (
                    <div className="divide-y">
                      {stats.recentActivity.map((activity) => (
                        <div 
                          key={activity.id} 
                          className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${activity.type === 'expense' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20' : 'bg-green-100 text-green-600 dark:bg-green-500/20'}`}>
                              {activity.type === 'expense' ? <CreditCard className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">{activity.date}</p>
                            </div>
                          </div>
                          <div className={`font-medium ${activity.type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                            {activity.type === 'expense' ? '-' : '+'}{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(activity.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState 
                      icon={<Clock className="h-6 w-6" />}
                      title="Chưa có hoạt động"
                      description="Các hoạt động mới sẽ xuất hiện ở đây"
                    />
                  )}
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Link href="/expenses" className="text-primary text-sm hover:underline flex items-center">
                    Xem tất cả hoạt động
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="expenses" className="h-full">
              <Card className="h-full">
                <CardContent className="p-6 flex items-center justify-center">
                  <EmptyState 
                    icon={<CreditCard className="h-6 w-6" />}
                    title="Đang tải chi tiêu"
                    description="Vui lòng đợi trong giây lát"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payments" className="h-full">
              <Card className="h-full">
                <CardContent className="p-6 flex items-center justify-center">
                  <EmptyState 
                    icon={<ArrowUpRight className="h-6 w-6" />}
                    title="Đang tải thanh toán"
                    description="Vui lòng đợi trong giây lát"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        <motion.div 
          className="col-span-1 lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Truy cập nhanh</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mb-6">
            <Card className="overflow-hidden hover:bg-muted/50 transition-colors">
              <Link href="/expenses/new" className="block p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Thêm chi tiêu mới</p>
                    <p className="text-sm text-muted-foreground">Tạo khoản chi tiêu mới</p>
                  </div>
                </div>
              </Link>
            </Card>
            
            <Card className="overflow-hidden hover:bg-muted/50 transition-colors">
              <Link href="/summary" className="block p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-500/20">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Xem tổng kết</p>
                    <p className="text-sm text-muted-foreground">Báo cáo và phân tích</p>
                  </div>
                </div>
              </Link>
            </Card>
            
            <Card className="overflow-hidden hover:bg-muted/50 transition-colors">
              <Link href="/users" className="block p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Quản lý người dùng</p>
                    <p className="text-sm text-muted-foreground">Thêm/xóa người dùng</p>
                  </div>
                </div>
              </Link>
            </Card>
          </div>
          
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Lịch chi tiêu</h2>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tháng Tư 2025</CardTitle>
              <CardDescription>Các khoản chi tiêu theo lịch</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-md border">
                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">Thanh toán tiền điện</div>
                      <div className="text-sm text-muted-foreground">15/04/2025</div>
                    </div>
                    <div className="font-medium">320.000₫</div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-md border">
                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">Thanh toán tiền nước</div>
                      <div className="text-sm text-muted-foreground">20/04/2025</div>
                    </div>
                    <div className="font-medium">150.000₫</div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t p-4">
              <Link href="/expenses" className="text-primary text-sm hover:underline flex items-center">
                Xem tất cả
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 