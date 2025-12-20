import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all',
        onClick && 'cursor-pointer hover:shadow-md active:scale-[0.98]',
        className
      )}
    >
      {children}
    </div>
  );
}
