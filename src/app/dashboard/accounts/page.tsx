'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { 
  Plus, 
  Search, 
  Link2, 
  Unlink,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Video,
  AlertCircle
} from 'lucide-react';

const socialPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
  { id: 'tiktok', name: 'TikTok', icon: Video, color: 'bg-black' },
];

const mockAccounts = [
  {
    id: '1',
    platform: 'facebook',
    accountName: 'TechCorp Official',
    username: '@techcorp',
    companyId: '1',
    companyName: 'TechCorp Solutions',
    isConnected: true,
    lastSync: '2024-03-29T10:30:00Z',
    followers: 15420,
    postsCount: 89
  },
  {
    id: '2',
    platform: 'instagram',
    accountName: 'techcorp_official',
    username: '@techcorp_official',
    companyId: '1',
    companyName: 'TechCorp Solutions',
    isConnected: true,
    lastSync: '2024-03-29T09:15:00Z',
    followers: 28350,
    postsCount: 156
  },
  {
    id: '3',
    platform: 'twitter',
    accountName: 'TechCorp',
    username: '@techcorp',
    companyId: '1',
    companyName: 'TechCorp Solutions',
    isConnected: false,
    lastSync: '2024-03-28T15:45:00Z',
    followers: 8760,
    postsCount: 234
  },
  {
    id: '4',
    platform: 'linkedin',
    accountName: 'TechCorp Solutions',
    username: 'company/techcorp',
    companyId: '1',
    companyName: 'TechCorp Solutions',
    isConnected: true,
    lastSync: '2024-03-29T08:00:00Z',
    followers: 5420,
    postsCount: 45
  },
  {
    id: '5',
    platform: 'tiktok',
    accountName: '@techcorptiktok',
    username: '@techcorptiktok',
    companyId: '1',
    companyName: 'TechCorp Solutions',
    isConnected: true,
    lastSync: '2024-03-29T11:00:00Z',
    followers: 45600,
    postsCount: 78
  },
];

export default function AccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const filteredAccounts = mockAccounts.filter(account => {
    const matchesSearch = account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        account.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || account.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  const getPlatformIcon = (platform: string) => {
    const p = socialPlatforms.find(sp => sp.id === platform);
    return p ? p.icon : null;
  };

  const getPlatformColor = (platform: string) => {
    const p = socialPlatforms.find(sp => sp.id === platform);
    return p ? p.color : 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <Header 
        title="Cuentas" 
        description="Gestiona las cuentas de redes sociales conectadas"
        action={{
          label: 'Conectar Cuenta',
          onClick: () => setShowConnectModal(true)
        }}
      />
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {socialPlatforms.map((platform) => {
            const count = mockAccounts.filter(a => a.platform === platform.id && a.isConnected).length;
            return (
              <button
                key={platform.id}
                onClick={() => setFilterPlatform(filterPlatform === platform.id ? 'all' : platform.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  filterPlatform === platform.id 
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center`}>
                    <platform.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{platform.name}</p>
                    <p className="text-sm text-gray-500">{count} conectada{count !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cuentas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            >
              <option value="all">Todas las plataformas</option>
              {socialPlatforms.map((platform) => (
                <option key={platform.id} value={platform.id}>{platform.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredAccounts.map((account) => {
              const PlatformIcon = getPlatformIcon(account.platform);
              return (
                <div 
                  key={account.id}
                  className="p-4 border border-gray-200 rounded-xl hover:shadow-lg hover:border-emerald-200 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${getPlatformColor(account.platform)} rounded-xl flex items-center justify-center`}>
                        {PlatformIcon && <PlatformIcon className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{account.accountName}</h3>
                        <p className="text-sm text-gray-500">{account.username}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      account.isConnected 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {account.isConnected ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Conectada
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Desconectada
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Empresa</span>
                      <span className="text-gray-900 font-medium">{account.companyName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Seguidores</span>
                      <span className="text-gray-900 font-medium">{account.followers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Publicaciones</span>
                      <span className="text-gray-900 font-medium">{account.postsCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Última sincronización</span>
                      <span className="text-gray-900">{formatDate(account.lastSync)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {account.isConnected ? (
                      <>
                        <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4" />
                          Sincronizar
                        </button>
                        <button className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                          <Unlink className="w-4 h-4" />
                          Desconectar
                        </button>
                      </>
                    ) : (
                      <button className="flex-1 px-3 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                        <Link2 className="w-4 h-4" />
                        Reconectar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAccounts.length === 0 && (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cuentas</h3>
              <p className="text-gray-500 mb-4">Conecta tu primera cuenta de red social</p>
              <button
                onClick={() => setShowConnectModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-cyan-700 transition-all"
              >
                <Plus className="w-5 h-5" />
                Conectar Cuenta
              </button>
            </div>
          )}
        </div>
      </div>

      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConnectModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 m-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Conectar Nueva Cuenta</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedPlatform === platform.id 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <platform.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium text-gray-900 text-center">{platform.name}</p>
                </button>
              ))}
            </div>

            {selectedPlatform && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa asociada
                  </label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all">
                    <option>Selecciona una empresa</option>
                    <option>TechCorp Solutions</option>
                    <option>ModaStyle Store</option>
                    <option>HealthPlus Clínica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de la página o perfil
                  </label>
                  <input
                    type="text"
                    placeholder={`https://${selectedPlatform}.com/tu-pagina`}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    Serás redirigido a {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} para autorizar el acceso. 
                    Necesitarás iniciar sesión con una cuenta con permisos de administrador.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={() => setShowConnectModal(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!selectedPlatform}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Conectar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
