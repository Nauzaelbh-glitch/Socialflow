'use client';

import { Header } from '@/components/layout/header';
import { useAuth } from '@/lib/auth-context';
import { 
  Users, 
  Share2, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

const stats = [
  { 
    name: 'Empresas Activas', 
    value: '3', 
    change: '+1 este mes', 
    icon: Users,
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    name: 'Cuentas Conectadas', 
    value: '12', 
    change: '+3 esta semana', 
    icon: Share2,
    color: 'from-emerald-500 to-teal-500'
  },
  { 
    name: 'Publicaciones Programadas', 
    value: '24', 
    change: '8 para hoy', 
    icon: Calendar,
    color: 'from-purple-500 to-pink-500'
  },
  { 
    name: 'Tasa de Engagement', 
    value: '4.8%', 
    change: '+0.3%', 
    icon: TrendingUp,
    color: 'from-orange-500 to-amber-500'
  },
];

const recentPosts = [
  {
    id: 1,
    title: 'Lanzamiento nuevo producto',
    company: 'TechCorp',
    platforms: ['Facebook', 'Instagram', 'Twitter'],
    scheduledAt: 'Hace 2 horas',
    status: 'Programado',
    statusColor: 'bg-blue-100 text-blue-700'
  },
  {
    id: 2,
    title: 'Promoción fin de semana',
    company: 'ModaStyle',
    platforms: ['Instagram', 'TikTok'],
    scheduledAt: 'Hace 5 horas',
    status: 'Publicado',
    statusColor: 'bg-emerald-100 text-emerald-700'
  },
  {
    id: 3,
    title: 'Testimonio cliente',
    company: 'HealthPlus',
    platforms: ['Facebook', 'LinkedIn'],
    scheduledAt: 'Hace 1 día',
    status: 'Fallido',
    statusColor: 'bg-red-100 text-red-700'
  },
];

const quickStats = [
  { label: 'Publicados', value: 156, icon: CheckCircle2, color: 'text-emerald-500' },
  { label: 'Pendientes', value: 24, icon: Clock, color: 'text-amber-500' },
  { label: 'Fallidos', value: 3, icon: AlertCircle, color: 'text-red-500' },
  { label: 'Plantillas', value: 18, icon: FileText, color: 'text-blue-500' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <Header 
        title={`Bienvenido, ${user?.firstName || 'Usuario'}`} 
        description="Resumen de tu actividad en SocialFlow"
      />
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div 
              key={stat.name}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Publicaciones Recientes</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{post.company}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex -space-x-2">
                          {post.platforms.map((platform) => (
                            <div 
                              key={platform}
                              className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                            >
                              <span className="text-xs text-gray-600">{platform[0]}</span>
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">{post.scheduledAt}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.statusColor}`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Resumen Rápido</h2>
            </div>
            <div className="p-6 space-y-4">
              {quickStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                </div>
                <span className="text-sm text-gray-500">80%</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Meta mensual completada</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">¿Listo para tu próxima publicación?</h3>
              <p className="text-emerald-100 mt-1">Crea contenido impactante con nuestras plantillas prediseñadas</p>
            </div>
            <button className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors">
              Crear Publicación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
