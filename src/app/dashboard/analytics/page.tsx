'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Calendar,
  Download,
  Filter,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Video
} from 'lucide-react';

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { id: 'tiktok', name: 'TikTok', icon: Video, color: '#000000' },
];

const mockMetrics = {
  totalFollowers: 103550,
  totalEngagement: 15420,
  totalReach: 234500,
  totalClicks: 8960,
  engagementRate: 4.8,
  growthRate: 12.5,
};

const mockPosts = [
  { id: 1, title: 'Lanzamiento nuevo producto', likes: 234, comments: 45, shares: 23, reach: 5600, date: '2026-03-28' },
  { id: 2, title: 'Promoción fin de semana', likes: 456, comments: 89, shares: 67, reach: 8900, date: '2026-03-27' },
  { id: 3, title: 'Testimonio cliente', likes: 345, comments: 56, shares: 34, reach: 7200, date: '2026-03-26' },
  { id: 4, title: 'Tip del día', likes: 189, comments: 34, shares: 18, reach: 4300, date: '2026-03-25' },
  { id: 5, title: 'Detrás de cámaras', likes: 567, comments: 98, shares: 78, reach: 12000, date: '2026-03-24' },
];

const mockWeeklyData = [
  { day: 'Lun', followers: 102400, engagement: 3200, reach: 45000 },
  { day: 'Mar', followers: 102800, engagement: 3500, reach: 48000 },
  { day: 'Mié', followers: 103100, engagement: 3800, reach: 51000 },
  { day: 'Jue', followers: 103200, engagement: 3600, reach: 49000 },
  { day: 'Vie', followers: 103400, engagement: 4200, reach: 56000 },
  { day: 'Sáb', followers: 103500, engagement: 4800, reach: 62000 },
  { day: 'Dom', followers: 103550, engagement: 4500, reach: 58000 },
];

const mockPlatformData = [
  { platform: 'Facebook', followers: 35000, engagement: 4200, percentage: 33.8 },
  { platform: 'Instagram', followers: 28000, engagement: 5800, percentage: 27.0 },
  { platform: 'Twitter', followers: 18000, engagement: 2100, percentage: 17.4 },
  { platform: 'LinkedIn', followers: 15000, engagement: 1200, percentage: 14.5 },
  { platform: 'TikTok', followers: 7550, engagement: 2120, percentage: 7.3 },
];

const topPosts = [
  { 
    id: 1, 
    title: 'Detrás de cámaras nuevo video', 
    platform: 'instagram',
    engagement: 892,
    reach: 15000,
    growth: '+15.2%'
  },
  { 
    id: 2, 
    title: 'Promoción especial marzo', 
    platform: 'facebook',
    engagement: 756,
    reach: 12500,
    growth: '+12.8%'
  },
  { 
    id: 3, 
    title: 'Entrevista con CEO', 
    platform: 'linkedin',
    engagement: 623,
    reach: 9800,
    growth: '+18.5%'
  },
];

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.icon || Facebook;
  };

  const getPlatformColor = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.color || '#666';
  };

  const maxEngagement = Math.max(...mockWeeklyData.map(d => d.engagement));
  const maxReach = Math.max(...mockWeeklyData.map(d => d.reach));

  return (
    <div>
      <Header 
        title="Analytics" 
        description="Métricas y rendimiento de tus redes sociales"
      />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {['24h', '7d', '30d', '90d'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  selectedPeriod === period 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {period === '24h' ? '24 horas' : period === '7d' ? '7 días' : period === '30d' ? '30 días' : '90 días'}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Exportar Reporte
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Seguidores Totales</span>
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(mockMetrics.totalFollowers)}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-600">+{mockMetrics.growthRate}%</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Engagement Total</span>
              <Heart className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(mockMetrics.totalEngagement)}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-600">+8.2%</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Alcance Total</span>
              <Eye className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(mockMetrics.totalReach)}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-600">+15.3%</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Clics Totales</span>
              <Share2 className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(mockMetrics.totalClicks)}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-600">+5.7%</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-emerald-100">Tasa de Engagement</span>
              <TrendingUp className="w-4 h-4 text-emerald-200" />
            </div>
            <p className="text-2xl font-bold">{mockMetrics.engagementRate}%</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-4 h-4 text-emerald-200" />
              <span className="text-sm text-emerald-100">+0.3% vs periodo anterior</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Rendimiento Semanal</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg">Engagement</button>
                <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg">Alcance</button>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2">
              {mockWeeklyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-emerald-100 rounded-t-lg relative" style={{ height: `${(data.engagement / maxEngagement) * 180}px` }}>
                      <div 
                        className="absolute inset-0 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg"
                        style={{ height: `${(data.engagement / maxEngagement) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{data.day}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Promedio engagement</p>
                <p className="text-xl font-bold text-gray-900">{(mockWeeklyData.reduce((acc, d) => acc + d.engagement, 0) / 7).toFixed(0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mejor día</p>
                <p className="text-xl font-bold text-gray-900">Sáb</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total publicaciones</p>
                <p className="text-xl font-bold text-gray-900">28</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribución por Plataforma</h3>
            
            <div className="space-y-4">
              {mockPlatformData.map((data) => (
                <div key={data.platform}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getPlatformColor(data.platform.toLowerCase()) }}
                      />
                      <span className="text-sm font-medium text-gray-700">{data.platform}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatNumber(data.followers)}</span>
                  </div>
                  <div className="ml-5 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${data.percentage}%`,
                        backgroundColor: getPlatformColor(data.platform.toLowerCase())
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-lg font-bold text-gray-900">{formatNumber(mockMetrics.totalFollowers)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Publicaciones</h3>
              <button className="text-sm text-emerald-600 hover:text-emerald-700">Ver todas</button>
            </div>
            
            <div className="space-y-4">
              {topPosts.map((post, index) => {
                const PlatformIcon = getPlatformIcon(post.platform);
                return (
                  <div key={post.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{post.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: getPlatformColor(post.platform) }}
                          />
                          <span className="text-xs text-gray-500 capitalize">{post.platform}</span>
                        </div>
                        <span className="text-xs text-gray-500">Engagement: {formatNumber(post.engagement)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-emerald-600">{post.growth}</p>
                      <p className="text-xs text-gray-500">vs promedio</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Rendimiento por Plataforma</h3>
              <select 
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg"
              >
                <option value="all">Todas</option>
                {platforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>{platform.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {platforms.map((platform) => (
                <div key={platform.id} className="p-4 border border-gray-200 rounded-xl hover:border-emerald-200 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: platform.color + '20' }}
                      >
                        <platform.icon className="w-5 h-5" style={{ color: platform.color }} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{platform.name}</h4>
                        <p className="text-sm text-gray-500">{formatNumber(mockPlatformData.find(p => p.platform.toLowerCase() === platform.id)?.followers || 0)} seguidores</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{mockPlatformData.find(p => p.platform.toLowerCase() === platform.id)?.percentage}%</p>
                      <p className="text-xs text-emerald-600">+2.3%</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Heart className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900">{formatNumber(mockPlatformData.find(p => p.platform.toLowerCase() === platform.id)?.engagement || 0)}</p>
                      <p className="text-xs text-gray-500">Engagement</p>
                    </div>
                    <div className="text-center">
                      <Eye className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900">{formatNumber((mockPlatformData.find(p => p.platform.toLowerCase() === platform.id)?.engagement || 0) * 12)}</p>
                      <p className="text-xs text-gray-500">Alcance</p>
                    </div>
                    <div className="text-center">
                      <MessageCircle className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900">{formatNumber((mockPlatformData.find(p => p.platform.toLowerCase() === platform.id)?.engagement || 0) * 0.2)}</p>
                      <p className="text-xs text-gray-500">Comentarios</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Publicaciones Recientes</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-xl hover:bg-emerald-600 transition-colors">
              <Calendar className="w-4 h-4" />
              Programar Reporte
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Publicación</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Fecha</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Likes</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Comentarios</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Compartidos</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Alcance</th>
                </tr>
              </thead>
              <tbody>
                {mockPosts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{post.title}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">{post.date}</td>
                    <td className="py-4 px-4 text-center text-sm font-medium text-gray-900">{post.likes}</td>
                    <td className="py-4 px-4 text-center text-sm font-medium text-gray-900">{post.comments}</td>
                    <td className="py-4 px-4 text-center text-sm font-medium text-gray-900">{post.shares}</td>
                    <td className="py-4 px-4 text-center text-sm font-medium text-gray-900">{formatNumber(post.reach)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
