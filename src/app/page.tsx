"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ACCESS_TOKEN_KEY = 'ez_split_access_token';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      router.replace('/expenses');
    } else {
      router.replace('/auth/login');
    }
  }, [router]);

  return null;
}
