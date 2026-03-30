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
  Video
} from 'lucide-react';

const platforms = [
  { name: 'Facebook', icon: Facebook, color: '#1877F2', connected: true },
  { name: 'Instagram', icon: Instagram, color: '#E4405F', connected: true },
  { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', connected: true },
  { name: 'Twitter/X', icon: Twitter, color: '#1DA1F2', connected: false },
  { name: 'TikTok', icon: Video, color: '#000000', connected: false },
];

const stats = [
  { 
    label: 'Alcance Total',
    value: '124.5K',
    change: '+12.3%',
    trend: 'up',
    icon: Eye,
    gradient: 'from-violet-500 to-purple-600'
  },
  { 
    label: 'Engagement',
    value: '8.2K',
    change: '+8.7%',
    trend: 'up',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-600'
  },
  { 
    label: 'Publicaciones',
    value: '156',
    change: '+23',
    trend: 'up',
    icon: Send,
    gradient: 'from-cyan-500 to-blue-600'
  },
  { 
    label: 'Cuentas Activas',
    value: '8',
    change: '-1',
    trend: 'down',
    icon: Share2,
    gradient: 'from-amber-500 to-orange-600'
  },
];

const weeklyData = [
  { day: 'Lun', posts: 12, engagement: 2400 },
  { day: 'Mar', posts: 18, engagement: 3200 },
  { day: 'Mié', posts: 15, engagement: 2800 },
  { day: 'Jue', posts: 22, engagement: 4100 },
  { day: 'Vie', posts: 19, engagement: 3600 },
  { day: 'Sáb', posts: 8, engagement: 1500 },
  { day: 'Dom', posts: 6, engagement: 1200 },
];

const scheduledPosts = [
  {
    id: 1,
    content: '🚀 Lanzamiento: Descubre nuestra nueva función de analytics avanzados. Incluye métricas en tiempo real y reportes personalizados.',
    platforms: ['Facebook', 'Instagram', 'LinkedIn'],
    time: '14:30',
    status: 'scheduled',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    content: '💡 Tip del día: Usa hashtags estratégicamente para aumentar tu alcance en un 40%. ¿Cuáles son tus favoritos?',
    platforms: ['Instagram', 'Twitter'],
    time: '18:00',
    status: 'scheduled',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    content: '📊 Case Study: Cómo nuestra startup creció 300% en 6 meses usando SocialFlow. Lee la historia completa.',
    platforms: ['LinkedIn'],
    time: '10:00',
    status: 'draft',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop'
  },
];

const quickActions = [
  { label: 'Nueva Publicación', icon: Plus, color: 'bg-violet-500' },
  { label: 'Ver Calendario', icon: Calendar, color: 'bg-cyan-500' },
  { label: 'Analytics', icon: BarChart3, color: 'bg-pink-500' },
  { label: 'Plantillas', icon: MessageCircle, color: 'bg-amber-500' },
];

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const maxEngagement = Math.max(...weeklyData.map(d => d.engagement));

  return (
    <div className="p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Buenos días, Nauzael 👋</h1>
        <p className="text-gray-500 mt-1">Aquí está el resumen de tu actividad en redes sociales</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div 
            key={i}
            className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:border-violet-200 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Rendimiento Semanal</h2>
            <select className="px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm font-medium text-gray-600 focus:ring-2 focus:ring-violet-500">
              <option>Esta semana</option>
              <option>Semana pasada</option>
              <option>Este mes</option>
            </select>
          </div>
          
          <div className="flex items-end gap-3 h-48">
            {weeklyData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex flex-col items-center justify-end">
                  <div 
                    className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-violet-500 to-purple-500 transition-all hover:from-violet-600 hover:to-purple-600"
                    style={{ height: `${(day.engagement / maxEngagement) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-500">{day.day}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-r from-violet-500 to-purple-500"></div>
              <span className="text-sm text-gray-500">Engagement</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Plataformas Conectadas</h2>
          <div className="space-y-3">
            {platforms.map((platform, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: platform.color + '20' }}
                  >
                    <platform.icon className="w-5 h-5" style={{ color: platform.color }} />
                  </div>
                  <span className="font-medium text-gray-900">{platform.name}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  platform.connected 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {platform.connected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all">
            Conectar Nueva Plataforma
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Publicaciones Programadas</h2>
            <button className="text-sm font-medium text-violet-600 hover:text-violet-700">Ver todas</button>
          </div>
          <div className="divide-y divide-gray-100">
            {scheduledPosts.map((post) => (
              <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                  <img 
                    src={post.image} 
                    alt=""
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{post.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.platforms.map((platform, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                            {platform}
                          </span>
                        ))}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        post.status === 'scheduled' 
                          ? 'bg-violet-100 text-violet-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {post.status === 'scheduled' ? 'Programado' : 'Borrador'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => (
              <button
                key={i}
                className="p-4 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition-all flex flex-col items-center gap-2"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-white/90">{action.label}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-white/20 backdrop-blur rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Meta del Mes</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-white rounded-full"></div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-white/80">117 de 150 publicaciones</span>
              <span className="text-sm font-semibold">78%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
