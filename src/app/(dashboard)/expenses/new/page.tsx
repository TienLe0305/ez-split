"use client";

import { useState, useEffect } from "react";
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
import { LucideSave, LucideX, LucideDollarSign, LucideEdit, LucideUsers, LucidePieChart } from "lucide-react";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Tên chi tiêu phải có ít nhất 3 ký tự" }),
  amount: z.coerce.number().positive({ message: "Số tiền phải lớn hơn 0" }),
  payer: z.string(),
  participants: z.array(z.string()).min(1, { message: "Phải có ít nhất 1 người tham gia" }),
  splitEvenly: z.boolean().default(true),
  individualAmounts: z.record(z.number()).optional(),
});

export default function NewExpensePage() {
  const router = useRouter();
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
  const individualAmounts = watch("individualAmounts") || {};

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

  // Calculate total of individual amounts
  const totalIndividualAmount = Object.values(individualAmounts).reduce((sum, amount) => sum + amount, 0);
  const amountDifference = amount - totalIndividualAmount;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Here we would post the expense to the API
    console.log(values);
    
    // Redirect to expenses list
    router.push("/expenses");
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
              Thêm chi tiêu mới
            </h1>
            <p className="text-muted-foreground mt-1">Nhập thông tin chi tiêu để chia tiền</p>
          </div>
          <Link href="/expenses">
            <Button variant="outline" className="flex items-center gap-1 hover:bg-primary/5 transition-colors">
              <LucideX size={16} />
              <span>Hủy</span>
            </Button>
          </Link>
        </div>

        <SlideUp delay={0.1}>
          <Card className="border-2">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center gap-2 mb-1">
                <LucideEdit className="text-primary" size={18} />
                <CardTitle>Thông tin chi tiêu</CardTitle>
              </div>
              <CardDescription>Nhập thông tin chi tiêu để chia tiền</CardDescription>
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
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-6 bg-secondary/10">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center gap-2">
                                <LucidePieChart size={14} />
                                <span>Chia đều</span>
                              </FormLabel>
                              <FormDescription>
                                Chia đều số tiền cho tất cả người tham gia
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
                  </StaggerContainer>

                  {!splitEvenly && participants.length > 0 && (
                    <div className="space-y-4 p-4 border rounded-lg bg-secondary/10 animate-fadeIn">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Chi tiêu theo từng người:</span>
                        <span className={amountDifference !== 0 ? "text-red-500 font-bold" : "text-green-500"}>
                          {amountDifference !== 0 
                            ? `Chênh lệch: ${amountDifference.toLocaleString('vi-VN')} đ` 
                            : "Hợp lệ"}
                        </span>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-2">
                        {participants.map(participant => (
                          <div key={participant} className="flex items-center gap-3 bg-background p-3 rounded-md border">
                            <span className="w-24 font-medium">{participant}</span>
                            <Input
                              type="number"
                              value={individualAmounts[participant] || 0}
                              onChange={(e) => {
                                const newAmount = e.target.valueAsNumber || 0;
                                const newAmounts = { ...individualAmounts, [participant]: newAmount };
                                setValue("individualAmounts", newAmounts);
                              }}
                              className="focus-visible:ring-primary transition-shadow"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <Button 
                      type="submit" 
                      disabled={!splitEvenly && amountDifference !== 0}
                      className="bg-gradient-to-r from-primary to-indigo-400 hover:from-primary/90 hover:to-indigo-400/90 shadow hover:shadow-md transition-all flex items-center gap-1"
                    >
                      <LucideSave size={16} />
                      <span>Lưu chi tiêu</span>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </PageTransition>
  );
} 