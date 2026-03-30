import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, Users, BarChart3 } from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    title: 'Nueva Publicación',
    description: 'Crear y programar contenido',
    icon: <Plus className="h-5 w-5" />,
    href: '/dashboard/posts/new',
    color: 'bg-primary-500 hover:bg-primary-600',
  },
  {
    title: 'Ver Calendario',
    description: 'Programaciones del mes',
    icon: <Calendar className="h-5 w-5" />,
    href: '/dashboard/calendar',
    color: 'bg-accent-500 hover:bg-accent-600 text-white',
  },
  {
    title: 'Gestionar Empresas',
    description: 'Agregar o editar clientes',
    icon: <Users className="h-5 w-5" />,
    href: '/dashboard/companies',
    color: 'bg-purple-500 hover:bg-purple-600 text-white',
  },
  {
    title: 'Ver Analytics',
    description: 'Métricas y reportes',
    icon: <BarChart3 className="h-5 w-5" />,
    href: '/dashboard/analytics',
    color: 'bg-orange-500 hover:bg-orange-600 text-white',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.title}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-primary-200 hover:bg-primary-50 transition-colors text-left"
            >
              <div className={`p-2.5 rounded-lg text-white ${action.color}`}>
                {action.icon}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{action.title}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
