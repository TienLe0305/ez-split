import React from 'react';
import { Input, InputProps } from '@/components/ui/input';
import { thousandsToAmount, formatNumberWithCommas } from '@/lib/utils';

interface ThousandsInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  onAmountChange?: (amount: number) => void;
}

export function ThousandsInput({
  value,
  onChange,
  onAmountChange,
  className,
  ...props
}: ThousandsInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    
    // Update display value (in thousands)
    onChange(rawValue);
    
    // Update actual amount value (in VND)
    if (onAmountChange) {
      const actualAmount = thousandsToAmount(rawValue);
      onAmountChange(actualAmount);
    }
  };

  // Format with commas for display
  const displayValue = formatNumberWithCommas(value);

  return (
    <div className="relative flex items-center w-full">
      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={displayValue}
        onChange={handleChange}
        className={`pr-16 ${className}`}
        {...props}
      />
      <div className="absolute right-3 text-sm text-muted-foreground pointer-events-none whitespace-nowrap">
        nghìn
      </div>
    </div>
  );
} 