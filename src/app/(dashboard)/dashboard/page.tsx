'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  
  return (
    <div className="fixed inset-0 w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200/40 via-background to-violet-200/40 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_40%_35%,#60a5fa30,transparent_40%),radial-gradient(circle_at_60%_65%,#a78bfa30,transparent_40%)]"></div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-500 to-violet-500 rounded-lg blur-md opacity-40 animate-pulse"></div>
        <h1 className="relative px-8 py-6 bg-background rounded-lg shadow-xl text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-violet-500">
          EZ-SPLIT-PVN
        </h1>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-8 text-lg md:text-xl text-muted-foreground"
      >
        Giải pháp chia sẻ chi phí đơn giản và hiệu quả
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-12 z-10"
      >
        <Button 
          size="lg" 
          onClick={() => router.push('/expenses')}
          className="group px-8 py-6 text-lg font-medium bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <span>Quản lý chi tiêu</span>
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </div>
  );
} 