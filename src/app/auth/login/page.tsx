"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'ez_split_access_token';
const CORRECT_PASSWORD = 'ilovepvn';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      router.replace('/expenses');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (password === CORRECT_PASSWORD) {
        // Create a simple token (in real apps, use proper JWT)
        const token = btoa(Date.now().toString());
        
        // Store token in both localStorage and cookies
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        
        // Set cookie with same name
        Cookies.set(ACCESS_TOKEN_KEY, token, { 
          expires: 7, // 7 days
          path: '/',
          sameSite: 'strict'
        });
        
        router.replace('/expenses');
      } else {
        setError('Mật khẩu không đúng');
      }
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">EzSplitPVN</CardTitle>
          <CardDescription>
            Nhập mật khẩu để truy cập ứng dụng
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                disabled={isLoading}
                className="mt-2"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-background/40 border-t-background animate-spin mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 