import { cn } from '@/lib/utils';

interface PlatformCardProps {
  name: string;
  icon: React.ReactNode;
  accountName: string;
  followers: number;
  posts: number;
  engagement: number;
  status: 'connected' | 'disconnected' | 'error';
  color: string;
}

export function PlatformCard({
  name,
  icon,
  accountName,
  followers,
  posts,
  engagement,
  status,
  color,
}: PlatformCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('p-2.5 rounded-lg', color)}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{accountName}</p>
          </div>
        </div>
        <span className={cn(
          'px-2 py-1 text-xs font-medium rounded-full',
          status === 'connected' && 'bg-green-100 text-green-700',
          status === 'disconnected' && 'bg-gray-100 text-gray-600',
          status === 'error' && 'bg-red-100 text-red-700'
        )}>
          {status === 'connected' && 'Conectada'}
          {status === 'disconnected' && 'Desconectada'}
          {status === 'error' && 'Error'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-5">
        <div>
          <p className="text-xs text-gray-500">Seguidores</p>
          <p className="text-lg font-semibold text-gray-900">{followers.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Publicaciones</p>
          <p className="text-lg font-semibold text-gray-900">{posts}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Engagement</p>
          <p className="text-lg font-semibold text-gray-900">{engagement}%</p>
        </div>
      </div>
    </div>
  );
}
