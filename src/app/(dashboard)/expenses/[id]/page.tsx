"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { PageTransition, StaggerContainer, StaggerItem, SlideUp } from "@/components/ui/animation";
import { LucideSave, LucideX, LucideDollarSign, LucideEdit, LucideUsers, LucidePieChart, LucideTrash } from "lucide-react";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Tên chi tiêu phải có ít nhất 3 ký tự" }),
  amount: z.coerce.number().positive({ message: "Số tiền phải lớn hơn 0" }),
  payer: z.string(),
  participants: z.array(z.string()).min(1, { message: "Phải có ít nhất 1 người tham gia" }),
  splitEvenly: z.boolean().default(true),
  individualAmounts: z.record(z.number()).optional(),
});

export default function EditExpensePage({ params }: { params: { id: string } }) {
  // Since this is a client component, we don't need to use React.use() on params
  // The server has already resolved the promise by the time it reaches client components
  const expenseId = params.id;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [users] = useState([
    "Phương", "Thắng", "Hoàng", "Giang", "Đức", "Duyệt", "Tâm"
  ]);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 0,
      payer: users[0],
      participants: [] as string[],
      splitEvenly: true,
      individualAmounts: {},
    },
  });

  const { watch, setValue } = form;
  const participants = watch("participants");
  const amount = watch("amount");
  const splitEvenly = watch("splitEvenly");

  // Load expense data
  useEffect(() => {
    // In a real app, this would be fetched from an API
    // For now, we'll use mock data based on the ID
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockExpense = getMockExpense(expenseId);
      
      if (mockExpense) {
        setValue("name", mockExpense.name);
        setValue("amount", mockExpense.amount);
        setValue("payer", mockExpense.payer);
        setValue("participants", mockExpense.participants);
        setValue("splitEvenly", mockExpense.splitEvenly);
        setValue("individualAmounts", mockExpense.individualAmounts || {});
      }
      
      setIsLoading(false);
    }, 500);
  }, [expenseId, setValue]);

  // Update individual amounts when participants or splitEvenly changes
  useEffect(() => {
    if (splitEvenly && participants.length > 0) {
      const evenAmount = amount / participants.length;
      const newIndividualAmounts = {} as Record<string, number>;
      
      participants.forEach(participant => {
        newIndividualAmounts[participant] = evenAmount;
      });
      
      setValue("individualAmounts", newIndividualAmounts);
    }
  }, [participants, amount, splitEvenly, setValue]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Here we would put the expense to the API
    console.log(values);
    
    // Redirect to expenses list
    router.push("/expenses");
  }

  function getMockExpense(id: string) {
    const expenses = [
      {
        id: "1",
        name: "Ăn trưa tại nhà hàng ABC",
        amount: 1500000,
        payer: "Phương",
        participants: ["Phương", "Thắng", "Hoàng", "Giang"],
        splitEvenly: true,
        date: "25/03/2023"
      },
      {
        id: "2",
        name: "Cafe cuối tuần",
        amount: 480000,
        payer: "Đức",
        participants: ["Đức", "Tâm", "Duyệt", "Giang", "Phương"],
        splitEvenly: true,
        date: "26/03/2023"
      },
      {
        id: "3",
        name: "Tiệc sinh nhật Hoàng",
        amount: 2500000,
        payer: "Hoàng",
        participants: ["Phương", "Thắng", "Hoàng", "Giang", "Đức", "Duyệt", "Tâm"],
        splitEvenly: false,
        individualAmounts: {
          "Phương": 300000,
          "Thắng": 300000,
          "Hoàng": 700000,
          "Giang": 300000,
          "Đức": 300000,
          "Duyệt": 300000,
          "Tâm": 300000
        },
        date: "28/03/2023"
      }
    ];
    
    return expenses.find(expense => expense.id === id);
  }

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-primary border-b-transparent border-l-primary border-r-transparent rounded-full animate-spin"></div>
          <div className="mt-4 text-muted-foreground">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
              Chỉnh sửa chi tiêu
            </h1>
            <p className="text-muted-foreground mt-1">Cập nhật thông tin chi tiêu</p>
          </div>
          <div className="flex gap-2">
            <Link href="/expenses">
              <Button variant="outline" className="flex items-center gap-1 hover:bg-primary/5 transition-colors">
                <LucideX size={16} />
                <span>Hủy</span>
              </Button>
            </Link>
            <Button 
              variant="destructive"
              className="flex items-center gap-1 shadow hover:shadow-md transition-all"
              onClick={() => {
                // In a real app, this would send a delete request
                router.push("/expenses");
              }}
            >
              <LucideTrash size={16} />
              <span>Xóa</span>
            </Button>
          </div>
        </div>

        <SlideUp delay={0.1}>
          <Card className="border-2">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center gap-2 mb-1">
                <LucideEdit className="text-primary" size={18} />
                <CardTitle>Thông tin chi tiêu</CardTitle>
              </div>
              <CardDescription>Cập nhật thông tin chi tiêu</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <StaggerContainer className="space-y-6">
                    <StaggerItem>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <LucideEdit size={14} />
                              <span>Tên chi tiêu</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ăn trưa, cà phê, ..." 
                                {...field} 
                                className="focus-visible:ring-primary transition-shadow"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </StaggerItem>

                    <StaggerItem>
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <LucideDollarSign size={14} />
                              <span>Số tiền</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="100000"
                                {...field}
                                onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                                className="focus-visible:ring-primary transition-shadow"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </StaggerItem>

                    <StaggerItem>
                      <FormField
                        control={form.control}
                        name="payer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <LucideUsers size={14} />
                              <span>Người trả</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="focus:ring-primary">
                                  <SelectValue placeholder="Chọn người trả" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {users.map(user => (
                                  <SelectItem key={user} value={user}>
                                    {user}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </StaggerItem>

                    <StaggerItem>
                      <FormField
                        control={form.control}
                        name="participants"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel className="flex items-center gap-2">
                                <LucideUsers size={14} />
                                <span>Người tham gia</span>
                              </FormLabel>
                              <FormDescription>
                                Chọn những người tham gia vào chi tiêu này
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-secondary/10 p-4 rounded-lg border">
                              {users.map((user) => (
                                <FormField
                                  key={user}
                                  control={form.control}
                                  name="participants"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={user}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(user)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, user])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== user
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {user}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </StaggerItem>

                    <StaggerItem>
                      <FormField
                        control={form.control}
                        name="splitEvenly"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 gap-2">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center gap-2">
                                <LucidePieChart size={16} />
                                <span>Chia đều chi phí</span>
                              </FormLabel>
                              <FormDescription>
                                Mọi người sẽ trả số tiền như nhau
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </StaggerItem>
                    
                    <div className="flex justify-end pt-2">
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-primary to-indigo-400 hover:from-primary/90 hover:to-indigo-400/90 shadow hover:shadow-md transition-all flex items-center gap-1"
                    >
                      <LucideSave size={16} />
                      <span>Lưu thay đổi</span>
                    </Button>
                  </div>
                  </StaggerContainer>
                </form>
              </Form>
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </PageTransition>
  );
} 