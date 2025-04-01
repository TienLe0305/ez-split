import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useMobile } from '@/hooks/use-mobile';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
}

export function TextField({
  label,
  description,
  error,
  className,
  wrapperClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  id: externalId,
  ...props
}: TextFieldProps) {
  const generatedId = React.useId();
  const id = externalId || generatedId;
  const isMobile = useMobile();
  
  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      {label && (
        <Label 
          htmlFor={id} 
          className={cn(
            isMobile && "text-base",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}
      <Input
        id={id}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive",
          isMobile && "min-h-[44px] text-base",
          className
        )}
        {...props}
      />
      {description && (
        <p className={cn("text-sm text-muted-foreground", descriptionClassName)}>
          {description}
        </p>
      )}
      {error && (
        <p className={cn("text-sm font-medium text-destructive", errorClassName)}>
          {error}
        </p>
      )}
    </div>
  );
} 