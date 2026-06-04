'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, TrendingUp, ClipboardList, LogOut, ShieldAlert } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    router.push('/');
  };

  const navItems = [
    { name: 'Kardex (Inventario)', href: '/kardex', icon: ClipboardList },
    { name: 'Registrar Compra', href: '/compras', icon: ShoppingCart },
    { name: 'Registrar Venta', href: '/ventas', icon: TrendingUp },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-6 w-6 text-emerald-500" />
            <span className="font-bold text-lg tracking-wider text-emerald-400">HCE ENTERPRISE</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">v1.0</span>
          </div>

          {/* Nav Items */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 border border-slate-800 rounded-md text-sm font-medium text-rose-400 hover:bg-rose-950/20 hover:border-rose-900/50 transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
