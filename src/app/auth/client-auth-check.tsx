'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'ez_split_access_token';

export default function ClientAuthCheck({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Handle hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    // If we're on auth pages and already authenticated, redirect to expenses
    const localToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const cookieToken = Cookies.get(ACCESS_TOKEN_KEY);
    
    if (localToken && cookieToken) {
      router.replace('/expenses');
    }
  }, [router]);
  
  if (!mounted) return null;
  
  return <>{children}</>;
} 