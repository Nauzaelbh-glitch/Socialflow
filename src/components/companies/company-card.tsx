import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, FileText, Calendar, MoreHorizontal, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanyCardProps {
  id: string;
  name: string;
  slug: string;
  userCount: number;
  postCount: number;
  socialAccountsCount: number;
  createdAt: string;
  onEdit?: () => void;
  onView?: () => void;
}

export function CompanyCard({
  name,
  slug,
  userCount,
  postCount,
  socialAccountsCount,
  createdAt,
  onEdit,
  onView,
}: CompanyCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary-100">
              <Building2 className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-500">/{slug}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
              <Users className="h-4 w-4" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{userCount}</p>
            <p className="text-xs text-gray-500">Usuarios</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
              <FileText className="h-4 w-4" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{postCount}</p>
            <p className="text-xs text-gray-500">Posts</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
              <Calendar className="h-4 w-4" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{socialAccountsCount}</p>
            <p className="text-xs text-gray-500">Cuentas</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Creada {new Date(createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={onView}>
            Ver
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
