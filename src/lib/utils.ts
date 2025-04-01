import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Check if the userAgent suggests a mobile device
  const userAgent = window.navigator.userAgent;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  // Check if the screen dimensions are typical for mobile
  const screenWidth = window.innerWidth;
  const isMobileWidth = screenWidth < 768;
  
  return mobileRegex.test(userAgent) || isMobileWidth;
}

// Convert thousands to actual amount (50 => 50,000)
export function thousandsToAmount(thousands: string): number {
  const parsed = parseFloat(thousands.replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed * 1000;
}

// Convert actual amount to thousands for display (50000 => 50)
export function amountToThousands(amount: string): string {
  const parsed = parseFloat(amount);
  return isNaN(parsed) ? '' : (parsed / 1000).toString();
}

// Format number with comma separators
export function formatNumberWithCommas(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Get current date in YYYY-MM-DD format
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}
