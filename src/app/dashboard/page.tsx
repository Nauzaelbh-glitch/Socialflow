'use client';

import { useState, useEffect } from 'react';
import { 
  description,
  favorite,
  visibility,
  group,
  dashboard,
  business,
  share,
  send,
  calendar_today,
  analytics,
  settings,
  help,
  logout,
  notifications,
  account_circle,
  search,
  add_circle,
  link,
  check_circle,
  warning,
  social_leaderboard,
  camera,
  work,
  close,
  music_note,
  auto_awesome,
  trending_up,
  calendar_month,
  add
} from 'lucide-react';

const navItems = [
  { icon: dashboard, label: 'Dashboard', active: true, href: '#' },
  { icon: business, label: 'Empresas', active: false, href: '#' },
  { icon: share, label: 'Cuentas Sociales', active: false, href: '#' },
  { icon: send, label: 'Publicaciones', active: false, href: '#' },
  { icon: calendar_today, label: 'Calendario', active: false, href: '#' },
  { icon: analytics, label: 'Analytics', active: false, href: '#' },
  { icon: settings, label: 'Configuración', active: false, href: '#' },
];

const platforms = [
  {
    name: 'Facebook',
    icon: social_leaderboard,
    color: '#1877F2',
    status: 'Conectado',
    lastConnected: 'hace 12 días',
    connected: true,
    gradient: false,
  },
  {
    name: 'Instagram',
    icon: camera,
    color: '#f09433',
    gradient: true,
    gradientColors: ['#f09433', '#e6683c', '#bc1888'],
    status: 'Conectado',
    lastConnected: 'hace 8 días',
    connected: true,
  },
  {
    name: 'LinkedIn',
    icon: work,
    color: '#0A66C2',
    status: 'Conectado',
    lastConnected: 'hace 30 días',
    connected: true,
    gradient: false,
  },
  {
    name: 'Twitter/X',
    icon: close,
    color: '#000000',
    status: 'Expired',
    lastConnected: 'Requiere re-autenticación',
    connected: false,
    gradient: false,
    isDark: true,
  },
  {
    name: 'TikTok',
    icon: music_note,
    color: '#000000',
    status: 'Conectar',
    lastConnected: 'Conecta tu cuenta para empezar',
    connected: false,
    gradient: false,
    showAddButton: true,
  },
];

const recentActivity = [
  {
    platform: 'Facebook',
    icon: social_leaderboard,
    color: '#1877F2',
    content: 'Post publicado en Facebook',
    time: 'hace 2h',
    campaign: 'Campaña Primavera',
  },
  {
    platform: 'Instagram',
    icon: camera,
    color: '#f09433',
    gradient: true,
    content: 'Nueva cuenta de Instagram conectada',
    time: 'hace 4h',
    campaign: 'Perfil Business',
  },
  {
    platform: 'LinkedIn',
    icon: calendar_month,
    color: '#10b981',
    content: 'Post programado para mañana',
    time: 'hace 6h',
    campaign: 'LinkedIn Update',
  },
  {
    platform: 'Twitter',
    icon: warning,
    color: '#ba1a1a',
    content: 'Sesión expirada en Twitter',
    time: 'hace 10h',
    campaign: 'Acción requerida',
    isError: true,
  },
];

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

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

  const formatDate = () => {
    return currentTime.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d]">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full h-[60px] z-50 bg-white/80 backdrop-blur-md shadow-sm flex justify-between items-center px-6">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold tracking-tight text-slate-900">SocialFlow</span>
          <div className="hidden md:flex items-center bg-slate-50 rounded-full px-4 py-1.5 ml-4">
            <search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-64 text-slate-600 outline-none" 
              placeholder="Buscar..." 
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-slate-50 transition-colors active:scale-95 duration-200">
            <notifications className="w-5 h-5 text-slate-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-50 transition-colors active:scale-95 duration-200">
            <account_circle className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-screen w-[250px] z-40 bg-slate-50 border-r border-slate-100 flex flex-col py-8 px-4 pt-[80px]">
        <div className="px-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#10b981]">
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">SocialFlow</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Editorial Workspace</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                item.active
                  ? 'bg-emerald-50 text-emerald-700 font-bold border-r-4 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="mt-auto space-y-1 border-t border-slate-100 pt-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-all">
            <help className="w-5 h-5" />
            <span className="text-sm">Help</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#ba1a1a] hover:bg-red-50 transition-all">
            <logout className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-[250px] pt-[60px] p-8">
        {/* Welcome Section */}
        <section className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-[#191c1d] tracking-tight mb-1">
              {getGreeting()}, Admin
            </h1>
            <p className="text-[#3c4a42] font-medium flex items-center gap-2">
              Aquí está el resumen de hoy <span className="w-1.5 h-1.5 bg-[#bbcabf] rounded-full"></span> {formatDate()}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform active:scale-95">
              <add_circle className="w-5 h-5" />
              + Nueva Publicación
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#e1e3e4] text-[#191c1d] font-bold rounded-xl hover:bg-[#e7e8e9] transition-colors active:scale-95">
              <link className="w-5 h-5" />
              + Conectar Cuenta
            </button>
          </div>
        </section>

        {/* Bento Grid Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Metric Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bbcabf]/10 group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#006c49]/10 rounded-lg text-[#006c49]">
                <description className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12% vs anterior</span>
            </div>
            <p className="text-[#3c4a42] text-sm font-medium mb-1">Total Posts</p>
            <p className="text-4xl font-extrabold text-[#191c1d]">142</p>
          </div>

          {/* Metric Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bbcabf]/10 group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#006b5f]/10 rounded-lg text-[#006b5f]">
                <favorite className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+0.3%</span>
            </div>
            <p className="text-[#3c4a42] text-sm font-medium mb-1">Engagement Rate</p>
            <p className="text-4xl font-extrabold text-[#191c1d]">4.8%</p>
          </div>

          {/* Metric Card 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bbcabf]/10 group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#005eb5]/10 rounded-lg text-[#005eb5]">
                <visibility className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+8%</span>
            </div>
            <p className="text-[#3c4a42] text-sm font-medium mb-1">Reach</p>
            <p className="text-4xl font-extrabold text-[#191c1d]">12.4K</p>
          </div>

          {/* Metric Card 4 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bbcabf]/10 group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#191c1d]/5 rounded-lg text-[#191c1d]">
                <group className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+2</span>
            </div>
            <p className="text-[#3c4a42] text-sm font-medium mb-1">Active Accounts</p>
            <p className="text-4xl font-extrabold text-[#191c1d]">8</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Platform Status (Column Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-[#191c1d]">Estado de Plataformas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.map((platform, i) => (
                <div 
                  key={i}
                  className="bg-white p-5 rounded-xl border border-[#bbcabf]/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 flex items-center justify-center rounded-xl"
                      style={{ 
                        backgroundColor: platform.gradient ? undefined : `${platform.color}10`,
                        background: platform.gradient 
                          ? `linear-gradient(to top right, ${platform.gradientColors.join(', ')})`
                          : undefined,
                        color: platform.isDark ? 'white' : platform.color
                      }}
                    >
                      <platform.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-[#191c1d]">{platform.name}</p>
                      <p className="text-xs text-[#3c4a42]">{platform.lastConnected}</p>
                    </div>
                  </div>
                  {platform.showAddButton ? (
                    <button className="flex items-center gap-1 text-[#3c4a42] bg-[#e7e8e9] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#e1e3e4] transition-colors">
                      <add className="w-4 h-4" /> Conectar
                    </button>
                  ) : (
                    <div 
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        platform.connected 
                          ? 'text-emerald-600 bg-emerald-50' 
                          : 'text-[#ba1a1a] bg-red-100/30'
                      }`}
                    >
                      {platform.connected ? (
                        <>
                          <check_circle className="w-4 h-4" /> Conectado
                        </>
                      ) : (
                        <>
                          <warning className="w-4 h-4" /> {platform.status}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#191c1d]">Actividad Reciente</h2>
            <div className="bg-white rounded-xl border border-[#bbcabf]/10 overflow-hidden">
              <div className="divide-y divide-[#f3f4f5]">
                {recentActivity.map((activity, i) => (
                  <div 
                    key={i}
                    className="p-4 hover:bg-[#f8f9fa] transition-colors cursor-pointer group"
                  >
                    <div className="flex gap-4">
                      <div 
                        className="mt-1 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: activity.gradient ? undefined : `${activity.color}10`,
                          background: activity.gradient 
                            ? `linear-gradient(to top right, ${activity.color}, #bc1888)`
                            : undefined,
                          color: activity.gradient ? 'white' : activity.color
                        }}
                      >
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold text-[#191c1d] group-hover:text-[#006c49] transition-colors ${activity.isError ? 'group-hover:text-[#ba1a1a]' : ''}`}>
                          {activity.content}
                        </p>
                        <p className="text-xs text-[#3c4a42]">
                          {activity.time} • {activity.campaign}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 text-xs font-bold text-[#3c4a42] hover:bg-[#f8f9fa] transition-colors">
                Ver todo el historial
              </button>
            </div>

            {/* Small Analytics Snapshot */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Crecimiento Mensual</p>
                <h3 className="text-2xl font-bold mb-4">+24.8%</h3>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-lg p-3">
                  <auto_awesome className="w-4 h-4 text-emerald-200" />
                  <p className="text-[11px] leading-tight">
                    Tu rendimiento es un 15% superior al promedio del sector este mes.
                  </p>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <trending_up className="w-[120px] h-[120px]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
