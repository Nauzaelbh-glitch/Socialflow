'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Video,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
  { id: 'tiktok', name: 'TikTok', icon: Video, color: 'bg-black' },
];

const mockPosts = [
  {
    id: '1',
    title: 'Lanzamiento nuevo producto',
    content: '¡Tenemos algo emocionante que compartir! Presentamos nuestro nuevo producto.',
    platforms: ['facebook', 'instagram', 'twitter'],
    scheduledAt: new Date(2026, 2, 29, 10, 0),
    status: 'scheduled',
    company: 'TechCorp Solutions'
  },
  {
    id: '2',
    title: 'Promoción fin de semana',
    content: 'Solo por este fin de semana, disfruta de un 30% de descuento.',
    platforms: ['instagram', 'facebook'],
    scheduledAt: new Date(2026, 2, 29, 14, 0),
    status: 'scheduled',
    company: 'TechCorp Solutions'
  },
  {
    id: '3',
    title: 'Tip del día',
    content: '¿Sabías que puedes mejorar tu productividad con estos simples pasos?',
    platforms: ['twitter', 'linkedin'],
    scheduledAt: new Date(2026, 2, 30, 9, 0),
    status: 'scheduled',
    company: 'ModaStyle Store'
  },
  {
    id: '4',
    title: 'Testimonio cliente',
    content: '"Gracias a esta solución, pude triplicar mis ventas en solo 3 meses."',
    platforms: ['facebook', 'linkedin'],
    scheduledAt: new Date(2026, 2, 28, 11, 0),
    status: 'published',
    company: 'HealthPlus Clínica'
  },
  {
    id: '5',
    title: 'Nuevo artículo del blog',
    content: 'Lee nuestro último artículo sobre las tendencias del mercado 2026.',
    platforms: ['linkedin', 'twitter'],
    scheduledAt: new Date(2026, 2, 31, 16, 0),
    status: 'scheduled',
    company: 'TechCorp Solutions'
  },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'week'>('month');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<typeof mockPosts[0] | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getPostsForDate = (date: Date) => {
    return mockPosts.filter(post => 
      post.scheduledAt.getDate() === date.getDate() &&
      post.scheduledAt.getMonth() === date.getMonth() &&
      post.scheduledAt.getFullYear() === date.getFullYear()
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700', label: 'Publicado' };
      case 'scheduled':
        return { icon: Clock, color: 'bg-blue-100 text-blue-700', label: 'Programado' };
      case 'failed':
        return { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Fallido' };
      default:
        return { icon: AlertCircle, color: 'bg-gray-100 text-gray-700', label: 'Borrador' };
    }
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.icon || Facebook;
  };

  const getPlatformColor = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.color || 'bg-gray-500';
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div>
      <Header 
        title="Calendario" 
        description="Programa y visualiza tus publicaciones"
        action={{
          label: 'Nueva Publicación',
          onClick: () => setShowCreateModal(true)
        }}
      />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'month' ? 'bg-white shadow text-emerald-600' : 'text-gray-600'
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'week' ? 'bg-white shadow text-emerald-600' : 'text-gray-600'
                }`}
              >
                Semana
              </button>
            </div>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
            >
              Hoy
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-gray-200">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                <div key={day} className="py-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7">
              {days.map((date, index) => {
                const posts = date ? getPostsForDate(date) : [];
                return (
                  <div
                    key={index}
                    onClick={() => date && setSelectedDate(date)}
                    className={`min-h-[120px] border-b border-r border-gray-100 p-2 cursor-pointer transition-colors ${
                      !date ? 'bg-gray-50' : ''
                    } ${isToday(date) ? 'bg-emerald-50' : ''} ${
                      isSelected(date) ? 'ring-2 ring-emerald-500' : ''
                    } hover:bg-gray-50`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${
                          isToday(date) ? 'text-emerald-600' : 'text-gray-700'
                        }`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {posts.slice(0, 3).map((post) => (
                            <div
                              key={post.id}
                              className={`text-xs px-1.5 py-0.5 rounded truncate ${
                                post.status === 'published' 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {formatTime(post.scheduledAt)} {post.title.substring(0, 15)}...
                            </div>
                          ))}
                          {posts.length > 3 && (
                            <div className="text-xs text-gray-500 px-1.5">
                              +{posts.length - 3} más
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                {selectedDate ? formatDate(selectedDate) : 'Selecciona una fecha'}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedDate ? `${getPostsForDate(selectedDate).length} publicaciones` : 'Haz clic en una fecha para ver las publicaciones'}
              </p>
            </div>

            <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {selectedDate ? (
                getPostsForDate(selectedDate).length > 0 ? (
                  getPostsForDate(selectedDate).map((post) => {
                    const statusBadge = getStatusBadge(post.status);
                    const StatusIcon = statusBadge.icon;
                    
                    return (
                      <div
                        key={post.id}
                        className="p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedPost(post);
                          setShowPostModal(true);
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{post.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                            <StatusIcon className="w-3 h-3 inline mr-1" />
                            {statusBadge.label}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{post.content}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{formatTime(post.scheduledAt)}</span>
                          </div>
                          <div className="flex -space-x-1">
                            {post.platforms.map((platformId) => {
                              const Icon = getPlatformIcon(platformId);
                              return (
                                <div
                                  key={platformId}
                                  className={`w-6 h-6 ${getPlatformColor(platformId)} rounded-full flex items-center justify-center`}
                                >
                                  <Icon className="w-3 h-3 text-white" />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No hay publicaciones programadas</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-xl hover:bg-emerald-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Crear publicación
                    </button>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Selecciona una fecha en el calendario</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-500">Publicados</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-500">Programados</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-sm text-gray-500">Fallidos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">89%</p>
                <p className="text-sm text-gray-500">Tasa de éxito</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPostModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPostModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 m-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{selectedPost.title}</h2>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Contenido</label>
                <p className="mt-1 text-gray-900">{selectedPost.content}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Plataformas</label>
                <div className="flex gap-2 mt-1">
                  {selectedPost.platforms.map((platformId) => {
                    const Icon = getPlatformIcon(platformId);
                    const platform = platforms.find(p => p.id === platformId);
                    return (
                      <div
                        key={platformId}
                        className={`w-8 h-8 ${getPlatformColor(platformId)} rounded-lg flex items-center justify-center`}
                        title={platform?.name}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha y hora</label>
                <p className="mt-1 text-gray-900">
                  {selectedPost.scheduledAt.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })} a las {formatTime(selectedPost.scheduledAt)}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Empresa</label>
                <p className="mt-1 text-gray-900">{selectedPost.company}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
              <button className="flex-1 px-4 py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
              <button className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-cyan-700 transition-colors">
                Ver detalles
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Nueva Publicación</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                ×
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  placeholder="Título de tu publicación"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido
                </label>
                <textarea
                  rows={4}
                  placeholder="¿Qué quieres publicar?"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plataformas
                </label>
                <div className="flex gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      type="button"
                      className={`w-10 h-10 ${platform.color} rounded-xl flex items-center justify-center transition-all hover:scale-110`}
                      title={platform.name}
                    >
                      <platform.icon className="w-5 h-5 text-white" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-cyan-700 transition-all"
                >
                  Programar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
