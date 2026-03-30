import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';
import { Facebook, Instagram, Linkedin, Twitter, MoreHorizontal, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';

interface RecentPost {
  id: string;
  content: string;
  platforms: string[];
  status: 'published' | 'scheduled' | 'draft' | 'failed';
  scheduledAt?: string;
  publishedAt?: string;
  metrics?: {
    impressions: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

const platformIcons: Record<string, React.ReactNode> = {
  facebook: <Facebook className="h-4 w-4 text-[#1877F2]" />,
  instagram: <Instagram className="h-4 w-4 text-[#E4405F]" />,
  linkedin: <Linkedin className="h-4 w-4 text-[#0A66C2]" />,
  twitter: <Twitter className="h-4 w-4" />,
};

const statusColors = {
  published: 'success',
  scheduled: 'warning',
  draft: 'info',
  failed: 'error',
} as const;

const statusLabels = {
  published: 'Publicado',
  scheduled: 'Programado',
  draft: 'Borrador',
  failed: 'Fallido',
};

interface RecentPostsProps {
  posts: RecentPost[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold">Publicaciones Recientes</CardTitle>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Ver todas
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex -space-x-1">
                    {post.platforms.map((platform) => (
                      <div key={platform} className="p-1 bg-white rounded border border-gray-200">
                        {platformIcons[platform]}
                      </div>
                    ))}
                  </div>
                  <Badge variant={statusColors[post.status]}>
                    {statusLabels[post.status]}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {post.status === 'published' && post.publishedAt && formatDateTime(post.publishedAt)}
                  {post.status === 'scheduled' && post.scheduledAt && `Programado: ${formatDateTime(post.scheduledAt)}`}
                  {post.status === 'draft' && 'Borrador'}
                  {post.status === 'failed' && 'Error al publicar'}
                </p>
              </div>

              {post.metrics && post.status === 'published' && (
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{post.metrics.impressions.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" />
                    <span>{post.metrics.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>{post.metrics.comments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="h-3.5 w-3.5" />
                    <span>{post.metrics.shares.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
