import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-1 text-xs font-bold bg-gray-100 text-gray-600', className)}>
      {children}
    </span>
  );
}
