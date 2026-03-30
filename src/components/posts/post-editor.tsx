'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPostSchema, type CreatePostInput } from '@/lib/modules/posts/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Facebook, Instagram, Linkedin, Twitter, FileText, Loader2, Calendar, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-[#1877F2]' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-[#0A66C2]' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-gray-900' },
];

interface PostEditorProps {
  companyId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PostEditor({ companyId, onSuccess, onCancel }: PostEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [content, setContent] = useState<Record<string, string>>({});
  const [scheduledAt, setScheduledAt] = useState('');
  const [isNow, setIsNow] = useState(true);

  const maxLengths: Record<string, number> = {
    facebook: 63206,
    instagram: 2200,
    linkedin: 3000,
    twitter: 280,
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
    if (!content[platformId]) {
      setContent((prev) => ({ ...prev, [platformId]: '' }));
    }
  };

  const handleContentChange = (platform: string, value: string) => {
    setContent((prev) => ({ ...prev, [platform]: value }));
  };

  const onSubmit = async () => {
    if (selectedPlatforms.length === 0) {
      setError('Selecciona al menos una plataforma');
      return;
    }

    const hasContent = selectedPlatforms.some((p) => content[p]?.trim());
    if (!hasContent) {
      setError('Escribe contenido para al menos una plataforma');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const platformContent: Record<string, { text: string }> = {};
      selectedPlatforms.forEach((p) => {
        if (content[p]?.trim()) {
          platformContent[p] = { text: content[p] };
        }
      });

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          content: platformContent,
          platforms: selectedPlatforms,
          scheduledAt: isNow ? null : scheduledAt,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Error al crear publicación');
        return;
      }

      onSuccess?.();
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Nueva Publicación</h2>
          <p className="text-sm text-gray-500">Crea contenido para tus redes sociales</p>
        </div>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seleccionar Plataformas</CardTitle>
          <CardDescription>
            Elige en qué redes sociales quieres publicar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all',
                  selectedPlatforms.includes(platform.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className={cn('p-1.5 rounded-md', platform.color)}>
                  <platform.icon className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-gray-700">{platform.name}</span>
                {selectedPlatforms.includes(platform.id) && (
                  <Badge variant="default" className="ml-1">Seleccionada</Badge>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedPlatforms.length > 0 && (
        <div className="space-y-4">
          {selectedPlatforms.map((platformId) => {
            const platform = platforms.find((p) => p.id === platformId);
            if (!platform) return null;

            return (
              <Card key={platformId}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn('p-1.5 rounded-md', platform.color)}>
                      <platform.icon className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-base">{platform.name}</CardTitle>
                    <span className="ml-auto text-xs text-gray-400">
                      {content[platformId]?.length || 0} / {maxLengths[platformId]}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={content[platformId] || ''}
                    onChange={(e) => handleContentChange(platformId, e.target.value)}
                    maxLength={maxLengths[platformId]}
                    placeholder={`¿Qué quieres publicar en ${platform.name}?`}
                    className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Programación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsNow(true)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all',
                isNow
                  ? 'border-primary-500 bg-primary-50 text-primary-600'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <Send className="h-4 w-4" />
              <span className="font-medium">Publicar ahora</span>
            </button>
            <button
              onClick={() => setIsNow(false)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all',
                !isNow
                  ? 'border-primary-500 bg-primary-50 text-primary-600'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Programar</span>
            </button>
          </div>

          {!isNow && (
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          )}
        </CardContent>
        <CardFooter>
          {error && (
            <div className="w-full p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm mb-4">
              {error}
            </div>
          )}
          <Button
            className="w-full"
            size="lg"
            onClick={onSubmit}
            disabled={isLoading || selectedPlatforms.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : isNow ? (
              <>
                <Send className="mr-2 h-4 w-4" />
                Publicar Ahora
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Programar Publicación
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
