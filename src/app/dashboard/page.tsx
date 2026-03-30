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
  Settings
} from 'lucide-react';

const platforms = [
  { name: 'Facebook', icon: Facebook, color: '#1877F2', connected: true, followers: '24.5K' },
  { name: 'Instagram', icon: Instagram, color: '#E4405F', connected: true, followers: '18.2K' },
  { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', connected: true, followers: '12.8K' },
  { name: 'Twitter/X', icon: Twitter, color: '#1DA1F2', connected: false, followers: '-' },
  { name: 'TikTok', icon: Video, color: '#000000', connected: false, followers: '-' },
];

const stats = [
  { 
    label: 'Total Alcance',
    value: '124.5K',
    change: '+12.3%',
    trend: 'up',
    icon: Eye,
    color: 'emerald'
  },
  { 
    label: 'Engagement',
    value: '8.2K',
    change: '+8.7%',
    trend: 'up',
    icon: Heart,
    color: 'pink'
  },
  { 
    label: 'Publicaciones',
    value: '156',
    change: '+23',
    trend: 'up',
    icon: Send,
    color: 'blue'
  },
  { 
    label: 'Cuentas Activas',
    value: '8',
    change: '-1',
    trend: 'down',
    icon: Share2,
    color: 'amber'
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

const recentPosts = [
  {
    id: 1,
    platform: 'Instagram',
    icon: Instagram,
    content: '🚀 Lanzamiento: Descubre nuestra nueva función de analytics avanzados. Incluye métricas en tiempo real y reportes personalizados.',
    time: 'Hace 2 horas',
    likes: '234',
    comments: '18',
    shares: '12',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop'
  },
  {
    id: 2,
    platform: 'Facebook',
    icon: Facebook,
    content: '💡 Tip del día: Usa hashtags estratégicamente para aumentar tu alcance en un 40%. ¿Cuáles son tus favoritos? #marketing #socialmedia',
    time: 'Hace 5 horas',
    likes: '156',
    comments: '24',
    shares: '8',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&auto=format&fit=crop'
  },
  {
    id: 3,
    platform: 'LinkedIn',
    icon: Linkedin,
    content: '📊 Case Study: Cómo nuestra startup creció 300% en 6 meses usando SocialFlow. Lee la historia completa en nuestro blog.',
    time: 'Ayer',
    likes: '412',
    comments: '32',
    shares: '45',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop'
  },
];

const scheduledPosts = [
  {
    id: 1,
    content: '🎉 ¡Nuevo lanzamiento! Comparte la noticia de tu última actualización de producto con tus seguidores.',
    platform: 'Facebook',
    time: '10:00',
    date: 'Mañana'
  },
  {
    id: 2,
    content: '💬 ¿Cuál es tu función favorita de SocialFlow? ¡Cuéntanos en los comentarios!',
    platform: 'Instagram',
    time: '14:30',
    date: 'Mañana'
  },
  {
    id: 3,
    content: '📈 5 consejos para aumentar tu engagement en redes sociales',
    platform: 'LinkedIn',
    time: '09:00',
    date: 'Miércoles'
  },
];

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const maxEngagement = Math.max(...weeklyData.map(d => d.engagement));

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; gradient: string; ring: string }> = {
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', gradient: 'from-emerald-500 to-teal-500', ring: 'ring-emerald-500' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-600', gradient: 'from-pink-500 to-rose-500', ring: 'ring-pink-500' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', gradient: 'from-blue-500 to-cyan-500', ring: 'ring-blue-500' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-600', gradient: 'from-amber-500 to-orange-500', ring: 'ring-amber-500' },
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="p-6 lg:p-8 overflow-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#191c1d] tracking-tight">
                Buenos días, Nauzael
              </h1>
              <p className="text-[#6c7a71] mt-2 text-lg">
                Aquí está el resumen de tu actividad
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 rounded-2xl bg-white text-[#6c7a71] hover:text-[#191c1d] transition-colors shadow-sm">
                <BellRing className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-2xl bg-white text-[#6c7a71] hover:text-[#191c1d] transition-colors shadow-sm">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-emerald-500/20">
                N
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[#6c7a71]">3 notificaciones</span>
            </div>
            <div className="text-[#6c7a71]">
              {currentTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
            const colors = getColorClasses(stat.color);
            return (
              <div 
                key={i}
                className="bg-white rounded-3xl p-6 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${
                    stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-[#191c1d] tracking-tight mb-1">{stat.value}</h3>
                <p className="text-[#6c7a71] font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-[#191c1d]">Rendimiento Semanal</h2>
                <p className="text-[#6c7a71] text-sm mt-1">Engagement por día de la semana</p>
              </div>
              <select className="px-4 py-2.5 bg-[#f8f9fa] rounded-xl text-sm font-medium text-[#191c1d] focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                <option>Esta semana</option>
                <option>Semana pasada</option>
                <option>Este mes</option>
              </select>
            </div>
            
            <div className="flex items-end gap-4 h-56 mb-6">
              {weeklyData.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-full h-full flex flex-col items-center justify-end">
                    <div 
                      className="w-full max-w-16 rounded-t-2xl bg-gradient-to-t from-emerald-500 to-teal-400 transition-all duration-500 hover:from-emerald-600 hover:to-teal-500"
                      style={{ height: `${Math.max((day.engagement / maxEngagement) * 100, 10)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-[#6c7a71]">{day.day}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-6 border-t border-[#e1e3e4]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                <span className="text-sm text-[#6c7a71]">Engagement</span>
              </div>
              <div className="text-sm text-[#6c7a71]">
                Total: <span className="font-semibold text-[#191c1d]">18,800</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#191c1d]">Plataformas</h2>
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Ver todo</button>
            </div>
            <div className="space-y-4">
              {platforms.map((platform, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#f8f9fa] transition-colors">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: platform.color + '15' }}
                    >
                      <platform.icon className="w-6 h-6" style={{ color: platform.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#191c1d]">{platform.name}</p>
                      <p className="text-sm text-[#6c7a71]">{platform.followers} seguidores</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    platform.connected 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-[#e1e3e4] text-[#6c7a71]'
                  }`}>
                    {platform.connected ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300">
              + Conectar Plataforma
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#191c1d]">Publicaciones Recientes</h2>
                <p className="text-[#6c7a71] text-sm mt-1">Tu última actividad en redes</p>
              </div>
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Ver todo</button>
            </div>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex gap-5 p-4 rounded-2xl hover:bg-[#f8f9fa] transition-colors group">
                  <img 
                    src={post.image} 
                    alt=""
                    className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <post.icon className="w-4 h-4 text-[#6c7a71]" />
                        <span className="text-sm font-medium text-[#6c7a71]">{post.platform}</span>
                      </div>
                      <span className="text-[#bbcabf]">•</span>
                      <span className="text-sm text-[#bbcabf]">{post.time}</span>
                    </div>
                    <p className="text-sm text-[#191c1d] line-clamp-2 leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-6 mt-3">
                      <div className="flex items-center gap-1.5 text-[#6c7a71]">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-medium">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#6c7a71]">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{post.comments}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#6c7a71]">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm font-medium">{post.shares}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 rounded-xl text-[#6c7a71] hover:bg-[#f8f9fa] hover:text-[#191c1d] transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#191c1d]">Próximas Publicaciones</h2>
                <button className="p-2 rounded-xl hover:bg-[#f8f9fa] transition-colors">
                  <Calendar className="w-5 h-5 text-[#6c7a71]" />
                </button>
              </div>
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div key={post.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[#f8f9fa] transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-[#f8f9fa] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#6c7a71]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#191c1d] line-clamp-2 leading-relaxed">{post.content}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs font-medium text-emerald-600">{post.platform}</span>
                        <span className="text-[#bbcabf]">•</span>
                        <span className="text-xs text-[#6c7a71]">{post.date} {post.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-6 lg:p-8 text-white">
              <h2 className="text-xl font-bold mb-4">Meta del Mes</h2>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-white/90">117 de 150 publicaciones</span>
              </div>
              <div className="h-3 bg-white/30 rounded-full overflow-hidden mb-3">
                <div className="h-full w-[78%] bg-white rounded-full"></div>
              </div>
              <p className="text-sm text-white/80">78% completado • 33 publicaciones restantes</p>
              
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button className="py-3 px-4 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all flex items-center justify-center gap-2 font-medium">
                  <Plus className="w-5 h-5" />
                  Nueva
                </button>
                <button className="py-3 px-4 bg-white text-emerald-600 rounded-2xl hover:bg-emerald-50 transition-all font-medium">
                  Ver Calendario
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
