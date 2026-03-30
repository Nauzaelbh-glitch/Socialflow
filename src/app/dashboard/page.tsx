'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
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
  MoreHorizontal,
  BellRing,
  Settings,
  Home,
  BarChart,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  Video
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
    label: 'Total',
    value: '12.5K',
    change: '+15%',
    trend: 'up',
    color: '#10B981'
  },
  { 
    label: 'Active',
    value: '3.2K',
    change: '+8%',
    trend: 'up',
    color: '#14B8A6'
  },
  { 
    label: 'Completed',
    value: '1.8K',
    change: '+12%',
    trend: 'up',
    color: '#10B981'
  },
  { 
    label: 'Scheduled',
    value: '856',
    change: '-3%',
    trend: 'down',
    color: '#14B8A6'
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
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8fafc' }}>
      <aside 
        className={`flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
        style={{
          background: 'linear-gradient(180deg, #059669 0%, #10B981 50%, #34d399 100%)',
        }}
      >
        <div className="p-6 border-b border-emerald-600">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            {!isSidebarCollapsed && (
              <span className="text-2xl font-bold text-white tracking-tight">SocialFlow</span>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                item.active 
                  ? 'bg-white text-emerald-700 shadow-lg' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <item.icon className="w-6 h-6 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <span className="font-semibold text-base">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-2 border-t border-emerald-600">
          {bottomNavItems.map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/20 transition-all duration-200"
            >
              <item.icon className="w-6 h-6 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <span className="font-semibold text-base">{item.label}</span>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-emerald-600">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-white hover:bg-white/20 transition-all duration-200"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-6 h-6" />
            ) : (
              <>
                <ChevronLeft className="w-6 h-6" />
                <span className="text-base font-medium">Colapsar</span>
              </>
            )}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="px-8 py-6" style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {getGreeting()}, Admin
              </h1>
              <p className="text-gray-500 mt-1 text-base">
                {currentTime.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-3 rounded-xl hover:bg-gray-100 transition-colors relative">
                <BellRing className="w-6 h-6 text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></span>
              </button>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg" style={{ background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)' }}>
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
                className="rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                style={{ 
                  background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
                  boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1), 0 2px 4px -1px rgba(16, 185, 129, 0.06)'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-3 h-3 rounded-full bg-white/40" />
                  <div className={`flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full ${
                    stat.trend === 'up' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-red-500/20 text-red-200'
                  }`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-white tracking-tight mb-2">{stat.value}</h3>
                <p className="text-white/80 font-semibold text-base">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl p-6" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Engagement</h2>
                  <p className="text-gray-500 text-sm">Metrics overview</p>
                </div>
                <select className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer border border-gray-300">
                  <option>This Week</option>
                  <option>Last Week</option>
                  <option>This Month</option>
                </select>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Reach</span>
                      <span className="text-sm font-bold text-gray-900">12.5K</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: '75%',
                          background: 'linear-gradient(90deg, #10B981 0%, #14B8A6 100%)'
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Engagement</span>
                      <span className="text-sm font-bold text-gray-900">3.2K</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: '60%',
                          background: 'linear-gradient(90deg, #10B981 0%, #14B8A6 100%)'
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Link Clicks</span>
                      <span className="text-sm font-bold text-gray-900">1.8K</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: '45%',
                          background: 'linear-gradient(90deg, #10B981 0%, #14B8A6 100%)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)' }}>
                  <Plus className="w-5 h-5" />
                  Nueva Publicación
                </button>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Actividad Reciente</h2>
                <button className="text-sm font-semibold hover:text-emerald-600 transition-colors" style={{ color: '#10B981' }}>Ver todo</button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f3f4f6' }}>
                      <activity.icon className="w-6 h-6" style={{ color: '#10B981' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 mb-1">{activity.platform}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{activity.content}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">{activity.time}</span>
                        <span className="text-xs font-bold" style={{ color: '#10B981' }}>{activity.engagement}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Distribution</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E1306C' }}>
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-700">Instagram</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4267B2' }}>
                      <Facebook className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-700">Facebook</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0077B5' }}>
                      <Linkedin className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-700">LinkedIn</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-black">
                      <Twitter className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-700">X</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">10%</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Posts</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
                      <Heart className="w-5 h-5" style={{ color: '#f59e0b' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">Product Launch Announcement</p>
                      <p className="text-xs text-gray-500">2.5K likes • 156 comments</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                      <MessageCircle className="w-5 h-5" style={{ color: '#3b82f6' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">Behind the Scenes</p>
                      <p className="text-xs text-gray-500">1.8K likes • 98 comments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Scheduled Posts</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                      <Send className="w-5 h-5" style={{ color: '#10B981' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Weekly Newsletter</p>
                      <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fce7f3' }}>
                      <Video className="w-5 h-5" style={{ color: '#ec4899' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Tutorial Video</p>
                      <p className="text-xs text-gray-500">Wed, 2:00 PM</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef9c3' }}>
                      <Calendar className="w-5 h-5" style={{ color: '#eab308' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Event Announcement</p>
                      <p className="text-xs text-gray-500">Fri, 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
