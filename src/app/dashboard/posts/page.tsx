'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PostCard, PostEditor } from '@/components/posts';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const mockPosts = [
  {
    id: '1',
    content: {
      facebook: { text: '¡Nuevo producto lanzado! Descubre cómo nuestra solución puede transformar tu negocio. Link en bio #innovación #negocios' },
      instagram: { text: '¡Nuevo producto lanzado! 🔥 Descubre cómo nuestra solución puede transformar tu negocio. Link en bio #innovación #negocios' },
    },
    platforms: ['facebook', 'instagram'],
    status: 'PUBLISHED' as const,
    publishedAt: '2026-03-29T10:30:00Z',
    metrics: { impressions: 12500, likes: 342, comments: 45, shares: 23 },
  },
  {
    id: '2',
    content: {
      twitter: { text: '5 consejos para mejorar tu presencia en redes sociales. Thread completo abajo 👇' },
      linkedin: { text: '5 consejos para mejorar tu presencia en redes sociales. Lea el artículo completo para más detalles.' },
    },
    platforms: ['twitter', 'linkedin'],
    status: 'PUBLISHED' as const,
    publishedAt: '2026-03-28T15:00:00Z',
    metrics: { impressions: 8900, likes: 156, comments: 28, shares: 67 },
  },
  {
    id: '3',
    content: {
      facebook: { text: '¡Gran noticia! Hemos alcanzado 10,000 seguidores en Facebook. Gracias por el apoyo 🙌' },
    },
    platforms: ['facebook'],
    status: 'SCHEDULED' as const,
    scheduledAt: '2026-03-30T09:00:00Z',
  },
  {
    id: '4',
    content: {
      instagram: { text: 'Detrás de escenas de nuestro último shoot. ¿Os gusta el resultado? 🎬' },
    },
    platforms: ['instagram'],
    status: 'DRAFT' as const,
  },
  {
    id: '5',
    content: {
      linkedin: { text: 'Estamos contratando! Buscamos desarrolladores full-stack con experiencia en React y Node.js.' },
    },
    platforms: ['linkedin'],
    status: 'PUBLISHED' as const,
    publishedAt: '2026-03-27T11:00:00Z',
    metrics: { impressions: 5600, likes: 89, comments: 34, shares: 12 },
  },
];

export default function PostsPage() {
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch = Object.values(post.content).some((c) =>
      c.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: mockPosts.length,
    DRAFT: mockPosts.filter((p) => p.status === 'DRAFT').length,
    SCHEDULED: mockPosts.filter((p) => p.status === 'SCHEDULED').length,
    PUBLISHED: mockPosts.filter((p) => p.status === 'PUBLISHED').length,
    FAILED: mockPosts.filter((p) => p.status === 'FAILED').length,
  };

  return (
    <DashboardLayout title="Publicaciones" subtitle="Gestiona tu contenido">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar publicaciones..."
                className="w-64 pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos ({statusCounts.all})</option>
              <option value="DRAFT">Borradores ({statusCounts.DRAFT})</option>
              <option value="SCHEDULED">Programados ({statusCounts.SCHEDULED})</option>
              <option value="PUBLISHED">Publicados ({statusCounts.PUBLISHED})</option>
              <option value="FAILED">Fallidos ({statusCounts.FAILED})</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2',
                  viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2',
                  viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={() => setShowEditor(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Publicación
            </Button>
          </div>
        </div>

        {showEditor && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
            <div className="min-h-screen p-4 md:p-8">
              <PostEditor
                companyId="1"
                onSuccess={() => setShowEditor(false)}
                onCancel={() => setShowEditor(false)}
              />
            </div>
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No hay publicaciones</h3>
            <p className="text-gray-500 mt-1">Comienza creando tu primera publicación</p>
            <Button className="mt-4" onClick={() => setShowEditor(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Publicación
            </Button>
          </div>
        ) : (
          <div className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          )}>
            {filteredPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
