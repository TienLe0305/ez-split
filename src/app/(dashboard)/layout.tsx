'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReceiptText, Calculator, Menu, X, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/mobile-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Handle mobile menu close when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  // Handle hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const navigation = [
    { name: 'Chi tiêu', href: '/expenses', icon: ReceiptText, description: 'Quản lý các khoản chi tiêu' },
    { name: 'Kết quả', href: '/summary', icon: Calculator, description: 'Xem kết quả chia tiền' },
  ];

  if (!mounted) return null;
  
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex pl-2">
            <Link 
              href="/"
              className="flex items-center space-x-2 font-bold text-xl text-primary"
            >
              <span className="hidden sm:inline-block">EzSplitPVN</span>
              <span className="sm:hidden">EzSplit</span>
            </Link>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto lg:hidden" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for desktop */}
        <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow border-r bg-white dark:bg-gray-900 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-6">
              <Link href="/" className="font-bold text-2xl text-primary">
                EzSplitPVN
              </Link>
            </div>
            <div className="mt-2 flex-1 flex flex-col px-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group py-3 px-3 rounded-md flex items-center transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon 
                      className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                        isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary/70'
                      }`} 
                    />
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</span>
                    </div>
                    {isActive && (
                      <ChevronRight className="ml-auto h-4 w-4 text-primary" />
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="px-6 pt-4 pb-2 border-t">
              <div className="mt-4 px-2 text-xs text-gray-500">
                <p>Made by PVN-TienL</p>
                <p>© 2025 EzSplitPVN</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sidebar backdrop */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out transform ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:hidden`}
        >
          <div className="flex items-center justify-between h-14 border-b px-6">
            <Link 
              href="/"
              className="flex items-center space-x-2 font-bold text-xl text-primary"
            >
              EzSplitPVN
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pb-4 pt-2">
            <div className="px-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group py-3 px-3 rounded-md flex items-center transition-all ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon 
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary/70'
                      }`} 
                    />
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</span>
                    </div>
                    {isActive && (
                      <ChevronRight className="ml-auto h-4 w-4 text-primary" />
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="px-6 pt-4 mt-auto border-t">
              <div className="mt-4 px-2 text-xs text-gray-500">
                <p>Made by PVN-TienL</p>
                <p>© 2025 EzSplitPVN</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:pl-72">
          <main className="flex-1 pb-24 md:pb-28 lg:pb-0 max-w-[1600px] mx-auto">{children}</main>
        </div>
      </div>

      {/* Mobile bottom navigation with our new component */}
      <MobileNav />
    </div>
  );
} 