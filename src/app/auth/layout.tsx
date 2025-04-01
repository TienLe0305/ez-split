import { ReactNode } from 'react';
import ClientAuthCheck from './client-auth-check';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ClientAuthCheck>
      <div className="min-h-screen flex flex-col bg-background">
        {children}
      </div>
    </ClientAuthCheck>
  );
} 