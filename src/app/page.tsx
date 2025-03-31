import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, CardAnimation } from "@/components/ui/animation";
import { LucideWallet, LucideList, LucideCalculator, LucideUsers, LucideArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 relative overflow-hidden flex flex-col">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-300/10 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-blue-300/10 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 z-0"></div>
      
      <FadeIn className="flex-grow flex flex-col z-10">
        <div className="w-full px-4 py-12 space-y-16 flex-grow flex flex-col">
          <SlideUp delay={0.1}>
            <div className="text-center space-y-4">
              <div className="inline-block mb-2 px-3 py-1 rounded-full bg-primary/10 backdrop-blur-sm text-primary text-sm font-medium">
                Phiên bản 1.0
              </div>
              <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent pb-2">
                EzSplitPVN
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Chia sẻ chi phí một cách dễ dàng giữa nhóm bạn
              </p>
            </div>
          </SlideUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 md:grid-rows-1 auto-rows-fr max-w-7xl mx-auto" delay={0.3}>
            <StaggerItem className="h-full">
              <CardAnimation className="h-full">
                <Card className="h-full flex flex-col border-2 hover:border-primary/80 transition-all hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-4 border-b border-border/40">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2.5 rounded-md bg-gradient-to-br from-primary/10 to-primary/20 text-primary">
                        <LucideWallet size={20} />
                      </div>
                      <CardTitle className="text-xl">Thêm chi tiêu</CardTitle>
                    </div>
                    <CardDescription>Thêm chi tiêu mới cần chia</CardDescription>
                  </CardHeader>
                  <CardContent className="py-6 flex-1 overflow-auto">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Thêm các khoản chi tiêu của nhóm để tính toán chia tiền</p>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-primary"></span>
                          <span>Nhập chi tiêu với số tiền cụ thể</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-primary"></span>
                          <span>Chọn người trả tiền</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-primary"></span>
                          <span>Chọn người tham gia</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 mt-auto border-t border-border/40">
                    <Link href="/expenses/new" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 shadow transition-all hover:shadow-md hover:shadow-primary/20 font-medium" size="default">
                        Thêm chi tiêu
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </CardAnimation>
            </StaggerItem>

            <StaggerItem className="h-full">
              <CardAnimation className="h-full">
                <Card className="h-full flex flex-col border-2 hover:border-primary/80 transition-all hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-4 border-b border-border/40">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2.5 rounded-md bg-gradient-to-br from-primary/10 to-primary/20 text-primary">
                        <LucideList size={20} />
                      </div>
                      <CardTitle className="text-xl">Danh sách chi tiêu</CardTitle>
                    </div>
                    <CardDescription>Xem tất cả chi tiêu đã có</CardDescription>
                  </CardHeader>
                  <CardContent className="py-6 flex-1 overflow-auto">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Quản lý các khoản chi tiêu đã được thêm vào hệ thống</p>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-primary"></span>
                          <span>Xem chi tiết từng khoản chi</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-primary"></span>
                          <span>Sửa và cập nhật thông tin</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-primary"></span>
                          <span>Xóa chi tiêu không cần thiết</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 mt-auto border-t border-border/40">
                    <Link href="/expenses" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 shadow transition-all hover:shadow-md hover:shadow-primary/20 font-medium" size="default">
                        Xem danh sách
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </CardAnimation>
            </StaggerItem>

            <StaggerItem className="h-full">
              <CardAnimation className="h-full">
                <Card className="h-full flex flex-col border-2 hover:border-primary/80 transition-all hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-4 border-b border-border/40">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2.5 rounded-md bg-gradient-to-br from-primary/10 to-primary/20 text-primary">
                        <LucideCalculator size={20} />
                      </div>
                      <CardTitle className="text-xl">Kết quả chia tiền</CardTitle>
                    </div>
                    <CardDescription>Xem tổng kết và các giao dịch cần thực hiện</CardDescription>
                  </CardHeader>
                  <CardContent className="py-6 flex-1 overflow-auto">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Tính toán các giao dịch tối ưu để thanh toán giữa các thành viên</p>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-primary"></span>
                          <span>Báo cáo số tiền đã chi của mỗi người</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-primary"></span>
                          <span>Tính toán số tiền cần thanh toán</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-primary"></span>
                          <span>Hướng dẫn các giao dịch cần thực hiện</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 mt-auto border-t border-border/40">
                    <Link href="/summary" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 shadow transition-all hover:shadow-md hover:shadow-primary/20 font-medium" size="default">
                        Xem kết quả
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </CardAnimation>
            </StaggerItem>
          </StaggerContainer>
          
          <SlideUp delay={0.8} className="rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-800/50 dark:to-indigo-900/30 p-8 border-2 border-indigo-100 dark:border-indigo-950/50 shadow-xl shadow-indigo-100/10 dark:shadow-indigo-950/5 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-left space-y-3 flex-1">
                <div className="inline-block mb-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-primary text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <LucideUsers size={16} />
                    <span>Quản lý chi tiêu nhóm</span>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                  Giải pháp chia tiền thông minh
                </h2>
                <p className="text-muted-foreground">
                  EzSplitPVN giúp bạn chia sẻ chi phí công bằng, xem lại lịch sử chi tiêu, và tính toán ai cần trả bao nhiêu tiền cho ai một cách nhanh chóng và chính xác.
                </p>
                <div className="pt-4">
                  <Link href="/expenses/new">
                    <Button className="bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 shadow transition-all hover:shadow-md hover:shadow-primary/20 group font-medium flex items-center gap-2" size="lg">
                      Bắt đầu ngay
                      <LucideArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex-shrink-0 hidden md:block">
                <div className="size-48 relative">
                  <div className="absolute inset-0 size-full rounded-full bg-indigo-100 dark:bg-indigo-900/30 animate-pulse opacity-30"></div>
                  <div className="absolute inset-3 size-[calc(100%-24px)] rounded-full bg-indigo-200 dark:bg-indigo-800/30 animate-pulse opacity-50 animation-delay-700"></div>
                  <div className="absolute inset-6 size-[calc(100%-48px)] rounded-full bg-indigo-300 dark:bg-indigo-700/30 animate-pulse opacity-70 animation-delay-1400"></div>
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary">7</div>
                      <div className="text-sm text-muted-foreground">Người dùng</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SlideUp>
        </div>
      </FadeIn>
    </div>
  );
}
