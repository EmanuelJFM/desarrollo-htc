'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { ShieldAlert, KeyRound, User, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Si ya existe un token, redirigir al Kardex
    const token = localStorage.getItem('jwt_token');
    if (token) {
      router.push('/kardex');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      const { access_token } = response.data;
      
      localStorage.setItem('jwt_token', access_token);
      router.push('/kardex');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Error de conexión con el servidor de autenticación.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-950 border border-emerald-800/50 text-emerald-400 mb-2">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">HCE ENTERPRISE</h1>
          <p className="text-sm text-slate-400">Sistema de Ventas y Control de Kardex</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 block">Usuario</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-10 pr-3 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500 text-sm transition-all"
                placeholder="Ingresar usuario"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 block">Contraseña</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-10 pr-3 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500 text-sm transition-all"
                placeholder="Ingresar contraseña"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-xs bg-rose-950/30 border border-rose-900/50 text-rose-400 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg text-sm shadow-lg shadow-emerald-900/40 hover:shadow-emerald-500/20 disabled:bg-emerald-800 disabled:text-slate-400 transition-all cursor-pointer"
          >
            <KeyRound className="h-4 w-4" />
            <span>{loading ? 'Autenticando...' : 'Iniciar Sesión'}</span>
          </button>
        </form>

        {/* Credentials Tip */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500">
            Credenciales demo: <span className="font-mono text-emerald-400">admin</span> / <span className="font-mono text-emerald-400">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
