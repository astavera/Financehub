import { cn } from '@/lib/utils';

export function PaidByBadge({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-[10px]';
  return (
    <span className={cn(
      'rounded-full font-medium',
      sizeClass,
      name === 'Sebas' ? 'bg-info/20 text-info' : 'bg-accent/20 text-accent'
    )}>
      {name}
    </span>
  );
}
