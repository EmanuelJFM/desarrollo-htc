'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import Navigation from '../../components/Navigation';
import QuickProductModal from '../../components/QuickProductModal';
import { Plus, Trash2, ArrowRight, DollarSign, ListPlus, AlertCircle, ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  nombre: string;
  nroLote: string;
  costo: string;
  precioVenta: string;
}

interface PurchaseItem {
  idProducto: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

export default function ComprasPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [precio, setPrecio] = useState<number>(0);
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar token JWT antes de cargar datos
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      router.push('/');
      return;
    }
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/productos');
      setProducts(response.data);
    } catch (err) {
      console.error('Error al obtener productos', err);
    }
  };

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    const prod = products.find((p) => p.id === parseInt(id));
    if (prod) {
      setPrecio(Number(prod.costo));
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedProductId) {
      setError('Por favor, seleccione un producto.');
      return;
    }

    if (cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0.');
      return;
    }

    if (precio <= 0) {
      setError('El costo del producto debe ser mayor a 0.');
      return;
    }

    const prodId = parseInt(selectedProductId);
    const prod = products.find((p) => p.id === prodId);

    if (!prod) return;

    // Verificar si ya existe en la lista
    const existingIndex = items.findIndex((i) => i.idProducto === prodId);
    if (existingIndex >= 0) {
      const updated = [...items];
      updated[existingIndex].cantidad += cantidad;
      updated[existingIndex].precio = precio; // Actualizar con el último costo
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          idProducto: prodId,
          nombre: prod.nombre,
          cantidad,
          precio,
        },
      ]);
    }

    // Resetear inputs de selección
    setSelectedProductId('');
    setCantidad(1);
    setPrecio(0);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleProductCreated = (newProduct: any) => {
    setProducts((prev) => [...prev, newProduct]);
    setSelectedProductId(newProduct.id.toString());
    setPrecio(newProduct.costo);
  };

  const handleSubmitPurchase = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (items.length === 0) {
      setError('Debe agregar al menos un producto a la compra.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        items: items.map((i) => ({
          idProducto: i.idProducto,
          cantidad: i.cantidad,
          precio: i.precio,
        })),
      };

      await api.post('/compras', payload);
      setSuccess('Compra registrada transaccionalmente con éxito e inventario incrementado.');
      setItems([]);
      fetchProducts(); // Refrescar los costos locales
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar la compra.');
    } finally {
      setLoading(false);
    }
  };

  // Cálculos reactivos de la compra totalizadora
  const subTotal = items.reduce((acc, item) => acc + item.cantidad * item.precio, 0);
  const igv = subTotal * 0.18;
  const total = subTotal + igv;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-200">
      <Navigation />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-emerald-400" />
              <span>Registrar Orden de Compra</span>
            </h1>
            <p className="text-sm text-slate-400">Ingreso de mercadería al inventario y actualización automática de costos.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700 cursor-pointer"
          >
            <ListPlus className="h-4 w-4 text-emerald-400" />
            <span>Modal Registro Rápido</span>
          </button>
        </div>

        {/* Notificaciones */}
        {error && (
          <div className="flex items-center space-x-2 bg-rose-950/20 border border-rose-900/50 text-rose-400 p-4 rounded-xl">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center space-x-2 bg-emerald-950/20 border border-emerald-900/50 text-emerald-400 p-4 rounded-xl">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-emerald-500" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Formulario Agregar Item */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit space-y-4">
            <h2 className="text-md font-semibold text-slate-100 border-b border-slate-800 pb-2">
              Añadir Producto a la Orden
            </h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 block">Producto</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Seleccione un producto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} (Lote: {p.nroLote || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 block">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={cantidad}
                    onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 block">Costo Unitario ($)</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    required
                    value={precio || ''}
                    onChange={(e) => setPrecio(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="0.0000"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg text-sm shadow-md transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar a la lista</span>
              </button>
            </form>

            <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 space-y-2">
              <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> ADVERTENCIA DE COSTOS:
              </span>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Al procesar la compra, el costo unitario del producto se actualizará al nuevo costo de compra ingresado. Además, el 
                <span className="text-emerald-400 font-semibold"> PrecioVenta</span> se recalculará automáticamente como <span className="font-mono text-emerald-400">Costo * 1.35</span> (Margen del 35%).
              </p>
            </div>
          </div>

          {/* Tabla de Items Agregados */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <h2 className="text-md font-semibold text-slate-100 border-b border-slate-800 pb-2">
                Detalle de la Compra
              </h2>
              {items.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  Ningún producto agregado todavía. Utilice el panel lateral para añadir ítems.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs">
                        <th className="py-2">Producto</th>
                        <th className="py-2 text-right">Cantidad</th>
                        <th className="py-2 text-right">Costo Unit.</th>
                        <th className="py-2 text-right">Subtotal</th>
                        <th className="py-2 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/20 text-slate-300">
                          <td className="py-2.5 font-medium">{item.nombre}</td>
                          <td className="py-2.5 text-right">{item.cantidad}</td>
                          <td className="py-2.5 text-right">${item.precio.toFixed(4)}</td>
                          <td className="py-2.5 text-right">${(item.cantidad * item.precio).toFixed(4)}</td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => handleRemoveItem(idx)}
                              className="text-rose-400 hover:text-rose-300 transition-colors p-1 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Totales y Acción Final */}
            {items.length > 0 && (
              <div className="border-t border-slate-800 pt-4 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                {/* Panel de Totales */}
                <div className="grid grid-cols-3 gap-6 text-right w-full md:w-auto">
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-500">Subtotal</span>
                    <p className="text-sm font-semibold text-slate-300">${subTotal.toFixed(4)}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-500">IGV (18%)</span>
                    <p className="text-sm font-semibold text-slate-300">${igv.toFixed(4)}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-500">Total</span>
                    <p className="text-base font-bold text-emerald-400">${total.toFixed(4)}</p>
                  </div>
                </div>

                <button
                  onClick={handleSubmitPurchase}
                  disabled={loading}
                  className="w-full md:w-auto flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                >
                  <span>{loading ? 'Procesando...' : 'Confirmar Compra'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <QuickProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleProductCreated}
      />
    </div>
  );
}
