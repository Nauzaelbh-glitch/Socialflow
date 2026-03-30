import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  iconColor?: string;
}

export function StatCard({ title, value, change, changeLabel, icon, iconColor = 'bg-primary-100 text-primary-600' }: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        {icon && (
          <div className={cn('p-2.5 rounded-lg', iconColor)}>
            {icon}
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          {isPositive && <TrendingUp className="h-4 w-4 text-green-500" />}
          {isNegative && <TrendingDown className="h-4 w-4 text-red-500" />}
          <span className={cn(
            'text-sm font-medium',
            isPositive && 'text-green-500',
            isNegative && 'text-red-500',
            !isPositive && !isNegative && 'text-gray-500'
          )}>
            {isPositive && '+'}{change}%
          </span>
          {changeLabel && (
            <span className="text-sm text-gray-500">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
