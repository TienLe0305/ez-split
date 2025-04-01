import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useMobile } from "@/hooks/use-mobile"

export interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({
  date,
  setDate,
  className,
  placeholder = "Pick a date",
  disabled = false,
}: DatePickerProps) {
  const isMobile = useMobile();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      setDate(undefined);
      return;
    }
    
    const selectedDate = new Date(value);
    if (!isNaN(selectedDate.getTime())) {
      setDate(selectedDate);
    }
  };

  // Format date to YYYY-MM-DD for input[type="date"]
  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };
  
  return (
    <div className={cn("relative", className)}>
      <Input
        type="date"
        value={formatDateForInput(date)}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "w-full pl-10",
          isMobile && "min-h-[44px] text-base"
        )}
        placeholder={placeholder}
      />
      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </div>
  );
} 