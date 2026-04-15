import { CheckCircle2, Clock, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  Paid: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/15' },
  Pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/15' },
  Partial: { icon: CircleDot, color: 'text-info', bg: 'bg-info/15' },
} as const;

export function StatusBadge({ status, onClick, size = 'sm' }: { status: 'Paid' | 'Pending' | 'Partial'; onClick?: () => void; size?: 'sm' | 'md' }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const sizeClass = size === 'md' ? 'px-3 py-1 text-xs gap-1.5' : 'px-2 py-0.5 text-[10px] gap-1';

  return (
    <button
      onClick={onClick}
      className={cn('inline-flex items-center rounded-full font-medium transition-all', config.bg, config.color, sizeClass, onClick && 'hover:scale-105 cursor-pointer')}
    >
      <Icon className={size === 'md' ? 'w-3.5 h-3.5' : 'w-3 h-3'} />
      {status}
    </button>
  );
}
