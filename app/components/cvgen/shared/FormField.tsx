'use client';

import { ReactNode } from 'react';
import { Controller, useFormContext, ControllerRenderProps, FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'date' | 'number';
  required?: boolean;
  autoComplete?: string;
  className?: string;
  children?: (field: ControllerRenderProps<FieldValues, string>) => ReactNode;
}

export default function FormField({
  name,
  label,
  placeholder,
  type = 'text',
  required = false,
  autoComplete,
  className,
  children
}: FormFieldProps) {
  const { control, formState: { errors, touchedFields, isSubmitted } } = useFormContext();

  const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
    return path.split('.').reduce((acc: unknown, part: string) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj);
  };

  const hasError = Boolean(getNestedValue(errors as Record<string, unknown>, name));
  const isTouched = Boolean(getNestedValue(touchedFields as Record<string, unknown>, name));
  const showError = hasError && (isTouched || isSubmitted);
  
  const errorMessage = (() => {
    const error = getNestedValue(errors as Record<string, unknown>, name);
    if (error && typeof error === 'object' && 'message' in error) {
      return (error as { message?: string }).message;
    }
    return undefined;
  })();

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm text-gray-600">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <div>
            {children ? (
              children(field)
            ) : (
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={cn(
                  "h-12 sm:h-14 text-base rounded-lg",
                  "bg-gray-50 border-gray-200",
                  "focus:bg-white focus:border-geds-blue focus:ring-geds-blue",
                  showError && "border-destructive"
                )}
              />
            )}
            <div className="min-h-[1.5rem] mt-1.5">
              {showError && errorMessage && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
}

