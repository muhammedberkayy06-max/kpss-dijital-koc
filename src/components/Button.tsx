import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-ios-blue text-white hover:bg-blue-600 shadow-sm active:scale-95 transition-transform',
    secondary: 'bg-white text-slate-900 border border-gray-200 hover:bg-gray-50 active:scale-95 transition-transform',
    outline: 'border-2 border-ios-blue text-ios-blue hover:bg-blue-50',
    ghost: 'text-ios-blue hover:bg-blue-50/50',
    danger: 'bg-ios-red text-white hover:bg-red-600'
  } as const;

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg font-semibold'
  } as const;

  return (
    <button
      className={cn(
        'rounded-xl inline-flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:pointer-events-none select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
