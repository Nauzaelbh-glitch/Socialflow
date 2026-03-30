'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  Share2,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Send,
  BarChart3,
  Clock,
  CheckCircle2,
  Plus,
  Bell,
  Search,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Video,
  MoreHorizontal,
  BellRing,
  Settings,
  Home,
  BarChart,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Inicio', active: true },
  { icon: Calendar, label: 'Calendario', active: false },
  { icon: BarChart, label: 'Estadísticas', active: false },
  { icon: Send, label: 'Publicar', active: false },
  { icon: MessageSquare, label: 'Mensajes', active: false },
];

const bottomNavItems = [
  { icon: Settings, label: 'Configuración' },
  { icon: LogOut, label: 'Cerrar sesión' },
];

const stats = [
  { 
    label: 'Alcance Total',
    value: '12.5K',
    change: '+15%',
    trend: 'up',
    color: '#10B981'
  },
  { 
    label: 'Engagement',
    value: '3.2K',
    change: '+8%',
    trend: 'up',
    color: '#14B8A6'
  },
  { 
    label: 'Clics',
    value: '1.8K',
    change: '+12%',
    trend: 'up',
    color: '#06B6D4'
  },
  { 
    label: 'Compartidos',
    value: '856',
    change: '-3%',
    trend: 'down',
    color: '#8B5CF6'
  },
];

const recentActivity = [
  {
    platform: 'Instagram',
    icon: Instagram,
    content: 'Nueva publicación con imagen destacada',
    time: 'Hace 2 horas',
    engagement: '1.2K'
  },
  {
    platform: 'Facebook',
    icon: Facebook,
    content: 'Video promocional publicado exitosamente',
    time: 'Hace 5 horas',
    engagement: '856'
  },
  {
    platform: 'LinkedIn',
    icon: Linkedin,
    content: 'Artículo compartido con tu red',
    time: 'Ayer',
    engagement: '423'
  },
];

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside 
        className={`bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            {!isSidebarCollapsed && (
              <span className="text-xl font-bold text-gray-900 tracking-tight">SocialFlow</span>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                item.active 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-2 border-t border-gray-100">
          {bottomNavItems.map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-all duration-200"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">Colapsar</span>
              </>
            )}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {getGreeting()}, Admin
              </h1>
              <p className="text-gray-500 mt-1">
                {currentTime.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors relative">
                <BellRing className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></span>
              </button>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-emerald-500/20">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div 
                key={i}
                className="bg-white rounded-2xl p-6 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  />
                  <div className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full ${
                    stat.trend === 'up' 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-red-50 text-red-500'
                  }`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">{stat.value}</h3>
                <p className="text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Métricas de Engagement</h2>
                  <p className="text-gray-500 text-sm mt-1">Resumen de las últimas 24 horas</p>
                </div>
                <select className="px-4 py-2 bg-gray-50 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                  <option>Últimas 24 horas</option>
                  <option>Última semana</option>
                  <option>Último mes</option>
                </select>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Alcance</span>
                      <span className="text-sm font-bold text-gray-900">12.5K</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        style={{ width: '75%' }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Interacciones</span>
                      <span className="text-sm font-bold text-gray-900">3.2K</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                        style={{ width: '60%' }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Clics en enlaces</span>
                      <span className="text-sm font-bold text-gray-900">1.8K</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        style={{ width: '45%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Nueva Publicación
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Actividad Reciente</h2>
                <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Ver todo</button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <activity.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.platform}</p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{activity.content}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">{activity.time}</span>
                        <span className="text-xs font-semibold text-emerald-600">{activity.engagement}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
