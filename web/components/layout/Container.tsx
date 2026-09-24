import { cn } from '@/lib/utils';

type Props = { className?: string; children: React.ReactNode; size?: 'default' | 'wide' };

export function Container({ className, children, size = 'default' }: Props) {
  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', size === 'wide' ? 'max-w-7xl' : 'max-w-6xl', className)}>
      {children}
    </div>
  );
}
