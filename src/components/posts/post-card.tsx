import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Facebook, Instagram, Linkedin, Twitter, MoreHorizontal, Eye, Heart, MessageCircle, Share2, Pencil, Trash2 } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PostCardProps {
  id: string;
  title?: string;
  content: Record<string, { text: string }>;
  platforms: string[];
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
  scheduledAt?: string;
  publishedAt?: string;
  metrics?: {
    impressions: number;
    likes: number;
    comments: number;
    shares: number;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

const platformIcons: Record<string, React.ReactNode> = {
  facebook: <Facebook className="h-4 w-4 text-[#1877F2]" />,
  instagram: <Instagram className="h-4 w-4 text-[#E4405F]" />,
  linkedin: <Linkedin className="h-4 w-4 text-[#0A66C2]" />,
  twitter: <Twitter className="h-4 w-4" />,
};

const statusConfig = {
  DRAFT: { variant: 'info' as const, label: 'Borrador' },
  SCHEDULED: { variant: 'warning' as const, label: 'Programado' },
  PUBLISHED: { variant: 'success' as const, label: 'Publicado' },
  FAILED: { variant: 'error' as const, label: 'Fallido' },
};

export function PostCard({
  content,
  platforms,
  status,
  scheduledAt,
  publishedAt,
  metrics,
  onEdit,
  onDelete,
}: PostCardProps) {
  const config = statusConfig[status];
  const firstContent = Object.values(content)[0]?.text || '';
  const previewText = firstContent.length > 150 ? firstContent.slice(0, 150) + '...' : firstContent;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {platforms.map((platform) => (
                <div key={platform} className="p-1.5 bg-white rounded-md border border-gray-200">
                  {platformIcons[platform]}
                </div>
              ))}
            </div>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm text-gray-700 line-clamp-3">{previewText}</p>
        <p className="text-xs text-gray-400 mt-3">
          {status === 'PUBLISHED' && publishedAt && `Publicado: ${formatDateTime(publishedAt)}`}
          {status === 'SCHEDULED' && scheduledAt && `Programado: ${formatDateTime(scheduledAt)}`}
          {status === 'DRAFT' && 'Borrador'}
          {status === 'FAILED' && 'Error al publicar'}
        </p>
      </CardContent>

      {metrics && status === 'PUBLISHED' && (
        <CardFooter className="pt-0 border-t border-gray-100">
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span>{metrics.impressions.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              <span>{metrics.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{metrics.comments.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="h-3.5 w-3.5" />
              <span>{metrics.shares.toLocaleString()}</span>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
