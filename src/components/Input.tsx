import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ios-blue focus:border-transparent outline-none',
        className
      )}
      {...props}
    />
  );
}
