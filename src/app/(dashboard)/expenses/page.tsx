import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTransition, StaggerContainer, StaggerItem, CardAnimation } from "@/components/ui/animation";
import { LucideEdit, LucideTrash, LucideCalendar, LucideUsers, LucideArrowUpRight } from "lucide-react";

export default function ExpensesPage() {
  // Mock data - would be fetched from API in a real implementation
  const expenses = [
    {
      id: "1",
      name: "Ăn trưa tại nhà hàng ABC",
      amount: 1500000,
      payer: "Phương",
      participants: ["Phương", "Thắng", "Hoàng", "Giang"],
      date: "25/03/2023"
    },
    {
      id: "2",
      name: "Cafe cuối tuần",
      amount: 480000,
      payer: "Đức",
      participants: ["Đức", "Tâm", "Duyệt", "Giang", "Phương"],
      date: "26/03/2023"
    },
    {
      id: "3",
      name: "Tiệc sinh nhật Hoàng",
      amount: 2500000,
      payer: "Hoàng",
      participants: ["Phương", "Thắng", "Hoàng", "Giang", "Đức", "Duyệt", "Tâm"],
      date: "28/03/2023"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
              Danh sách chi tiêu
            </h1>
            <p className="text-muted-foreground mt-1">Quản lý các khoản chi tiêu của nhóm</p>
          </div>
          <Link href="/expenses/new">
            <Button className="bg-gradient-to-r from-primary to-indigo-400 hover:from-primary/90 hover:to-indigo-400/90 shadow hover:shadow-md transition-all">
              Thêm chi tiêu
            </Button>
          </Link>
        </div>

        {expenses.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Chưa có chi tiêu nào. Hãy thêm chi tiêu mới!</p>
            </CardContent>
          </Card>
        ) : (
          <StaggerContainer className="space-y-4">
            {expenses.map((expense) => (
              <StaggerItem key={expense.id}>
                <CardAnimation>
                  <Card className="overflow-hidden group border-2 hover:border-primary/60 transition-colors">
                    <CardHeader className="pb-2 bg-primary/5 group-hover:bg-primary/10 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2 font-bold">
                            {expense.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <LucideCalendar size={14} />
                            <span>Ngày {expense.date}</span>
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-primary text-lg block">
                            {formatCurrency(expense.amount)}
                          </span>
                          <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
                            <span>Người trả:</span>
                            <span className="font-medium">{expense.payer}</span>
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 pt-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <LucideUsers size={14} />
                        <span className="font-medium">Người tham gia:</span>
                        <span>{expense.participants.join(", ")}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 py-3 border-t bg-secondary/20">
                      <Link href={`/expenses/${expense.id}`}>
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <LucideEdit size={14} />
                          <span>Chỉnh sửa</span>
                        </Button>
                      </Link>
                      <Button size="sm" variant="destructive" className="flex items-center gap-1">
                        <LucideTrash size={14} />
                        <span>Xóa</span>
                      </Button>
                    </CardFooter>
                  </Card>
                </CardAnimation>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        <div className="flex justify-center mt-8">
          <Link href="/summary">
            <Button variant="outline" className="flex items-center gap-2 hover:bg-primary/5 transition-colors">
              <span>Xem kết quả chia tiền</span>
              <LucideArrowUpRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
} 