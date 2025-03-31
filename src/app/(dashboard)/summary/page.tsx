import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageTransition, FadeIn, SlideUp } from "@/components/ui/animation";
import { LucideListTodo, LucideArrowRight, LucideUsers, LucideCreditCard, LucideReceiptText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SummaryPage() {
  // Mock data - would be fetched from API in a real implementation
  const personalSummary = [
    { name: "Phương", paid: 1500000, owes: 978571, balance: 521429 },
    { name: "Thắng", paid: 0, owes: 842857, balance: -842857 },
    { name: "Hoàng", paid: 2500000, owes: 1271429, balance: 1228571 },
    { name: "Giang", paid: 0, owes: 1271429, balance: -1271429 },
    { name: "Đức", paid: 480000, owes: 842857, balance: -362857 },
    { name: "Duyệt", paid: 0, owes: 842857, balance: -842857 },
    { name: "Tâm", paid: 0, owes: 842857, balance: -842857 }
  ];

  const transactions = [
    { from: "Thắng", to: "Phương", amount: 400000 },
    { from: "Giang", to: "Phương", amount: 121429 },
    { from: "Giang", to: "Hoàng", amount: 1150000 },
    { from: "Đức", to: "Hoàng", amount: 78571 },
    { from: "Duyệt", to: "Hoàng", amount: 842857 },
    { from: "Tâm", to: "Phương", amount: 842857 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Calculate total numbers for summary
  const totalPaid = personalSummary.reduce((sum, person) => sum + person.paid, 0);
  const peopleWithDebt = personalSummary.filter(person => person.balance < 0).length;
  const peopleWithCredit = personalSummary.filter(person => person.balance > 0).length;

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
              Kết quả chia tiền
            </h1>
            <p className="text-muted-foreground mt-1">Xem tổng kết và các giao dịch cần thực hiện</p>
          </div>
          <Link href="/expenses">
            <Button variant="outline" className="flex items-center gap-1 hover:bg-primary/5 transition-colors">
              <LucideListTodo size={16} />
              <span>Quản lý chi tiêu</span>
            </Button>
          </Link>
        </div>

        <FadeIn delay={0.1}>
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <SlideUp delay={0.2} className="bg-primary/5 rounded-lg p-4 border-2 border-primary/10">
              <div className="flex flex-col h-full">
                <div className="mb-2 text-primary">
                  <LucideCreditCard size={22} />
                </div>
                <h3 className="text-xl font-medium mb-1">Tổng chi tiêu</h3>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalPaid)}</p>
                <p className="text-sm text-muted-foreground mt-auto pt-2">Tổng số tiền đã chi tiêu</p>
              </div>
            </SlideUp>
            
            <SlideUp delay={0.3} className="bg-primary/5 rounded-lg p-4 border-2 border-primary/10">
              <div className="flex flex-col h-full">
                <div className="mb-2 text-primary">
                  <LucideUsers size={22} />
                </div>
                <h3 className="text-xl font-medium mb-1">Người nợ tiền</h3>
                <p className="text-2xl font-bold text-red-500">{peopleWithDebt} người</p>
                <p className="text-sm text-muted-foreground mt-auto pt-2">Số người cần thanh toán</p>
              </div>
            </SlideUp>
            
            <SlideUp delay={0.4} className="bg-primary/5 rounded-lg p-4 border-2 border-primary/10">
              <div className="flex flex-col h-full">
                <div className="mb-2 text-primary">
                  <LucideReceiptText size={22} />
                </div>
                <h3 className="text-xl font-medium mb-1">Người được nhận</h3>
                <p className="text-2xl font-bold text-green-500">{peopleWithCredit} người</p>
                <p className="text-sm text-muted-foreground mt-auto pt-2">Số người cần được thanh toán</p>
              </div>
            </SlideUp>
          </div>
        </FadeIn>

        <SlideUp delay={0.5}>
          <Card className="border-2">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <LucideUsers className="text-primary" size={18} />
                <span>Tổng kết cá nhân</span>
              </CardTitle>
              <CardDescription>Số tiền mỗi người đã chi trả và nợ</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead className="text-right">Đã trả</TableHead>
                    <TableHead className="text-right">Cần trả</TableHead>
                    <TableHead className="text-right">Cân đối</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personalSummary.map((person, index) => (
                    <TableRow 
                      key={person.name}
                      className="hover:bg-primary/5 transition-colors"
                      style={{ 
                        animation: `fadeIn 0.5s ease forwards`,
                        animationDelay: `${0.1 + index * 0.05}s`,
                        opacity: 0
                      }}
                    >
                      <TableCell className="font-medium">{person.name}</TableCell>
                      <TableCell className="text-right">{formatCurrency(person.paid)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(person.owes)}</TableCell>
                      <TableCell className={`text-right font-medium ${person.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {person.balance >= 0 ? '+' : ''}{formatCurrency(person.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.7}>
          <Card className="border-2">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <LucideCreditCard className="text-primary" size={18} />
                <span>Các giao dịch cần thực hiện</span>
              </CardTitle>
              <CardDescription>Những người cần trả tiền cho người khác</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {transactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Không có giao dịch nào cần thực hiện</p>
              ) : (
                <div className="space-y-2">
                  {transactions.map((transaction, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center border-b py-4 hover:bg-primary/5 transition-colors px-2 rounded-sm"
                      style={{ 
                        animation: `fadeIn 0.5s ease forwards`,
                        animationDelay: `${0.1 + index * 0.05}s`,
                        opacity: 0
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-red-100 text-red-600 w-10 h-10 flex items-center justify-center font-bold">
                          {transaction.from[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{transaction.from}</span>
                          <span className="text-sm text-muted-foreground">Người trả tiền</span>
                        </div>
                        <LucideArrowRight className="mx-2 text-muted-foreground" />
                        <div className="rounded-full bg-green-100 text-green-600 w-10 h-10 flex items-center justify-center font-bold">
                          {transaction.to[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{transaction.to}</span>
                          <span className="text-sm text-muted-foreground">Người nhận tiền</span>
                        </div>
                      </div>
                      <div className="font-bold text-primary text-lg">
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </PageTransition>
  );
} 