'use client';

import React, { useState } from 'react';
import api from '../lib/api';
import { X, Save, AlertCircle } from 'lucide-react';

interface QuickProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newProduct: any) => void;
}

export default function QuickProductModal({ isOpen, onClose, onCreated }: QuickProductModalProps) {
  const [nombre, setNombre] = useState('');
  const [nroLote, setNroLote] = useState('');
  const [costo, setCosto] = useState<number>(0);
  const [precioVenta, setPrecioVenta] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/productos', {
        nombre,
        nroLote: nroLote || null,
        costo: Number(costo),
        precioVenta: Number(precioVenta),
      });
      onCreated(response.data);
      onClose();
      // Reset form
      setNombre('');
      setNroLote('');
      setCosto(0);
      setPrecioVenta(0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el producto.');
    } finally {
      setLoading(false);
    }
  };

  // Calcular precio sugerido (Costo * 1.35)
  const handleCostoChange = (val: string) => {
    const numeric = parseFloat(val) || 0;
    setCosto(numeric);
    // Asignar precio sugerido automáticamente
    setPrecioVenta(parseFloat((numeric * 1.35).toFixed(4)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-semibold text-slate-100">Registro Rápido de Producto</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Nombre del Producto</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              placeholder="Ej. Paracetamol 500mg"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Número de Lote</label>
            <input
              type="text"
              value={nroLote}
              onChange={(e) => setNroLote(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              placeholder="Ej. L-PAR001"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Costo Base ($)</label>
              <input
                type="number"
                step="0.0001"
                min="0"
                required
                value={costo || ''}
                onChange={(e) => handleCostoChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                placeholder="0.0000"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Precio Venta ($)</label>
              <input
                type="number"
                step="0.0001"
                min="0"
                required
                value={precioVenta || ''}
                onChange={(e) => setPrecioVenta(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                placeholder="0.0000"
              />
              <span className="text-[10px] text-emerald-500">Sugerido (Costo * 1.35)</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center space-x-2 text-xs bg-rose-950/30 border border-rose-900/50 text-rose-400 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-emerald-950 transition-all cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Guardando...' : 'Registrar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
