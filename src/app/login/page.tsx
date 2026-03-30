'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Key, Eye, EyeOff } from 'lucide-react';

const ACCESS_KEY = 'SocialFlow2024';

export default function LoginPage() {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (accessKey === ACCESS_KEY) {
      try {
        await fetch('/api/auth/access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        router.push('/dashboard');
      } catch {
        setError('Error al iniciar sesión');
        setIsLoading(false);
      }
    } else {
      setError('Clave de acceso incorrecta');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">SocialFlow</h1>
          <p className="text-gray-600 mt-2">Gestión unificada de redes sociales</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-violet-500/10 p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">Acceso</h2>
          <p className="text-sm text-gray-500 mb-6 text-center">Ingresa la clave para continuar</p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="accessKey" className="block text-sm font-medium text-gray-700 mb-2">
                Clave de Acceso
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Key className="w-5 h-5" />
                </div>
                <input
                  type={showKey ? 'text' : 'password'}
                  id="accessKey"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all outline-none disabled:opacity-50"
                  placeholder="Ingresa la clave"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !accessKey}
              className="w-full py-3 px-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:from-violet-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Key className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Al continuar, aceptas nuestros{' '}
            <a href="#" className="text-violet-600 hover:underline">Términos de Servicio</a>
            {' '}y{' '}
            <a href="#" className="text-violet-600 hover:underline">Política de Privacidad</a>
          </p>
        </div>
      </div>
    </div>
  );
}
