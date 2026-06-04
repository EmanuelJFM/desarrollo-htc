'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import Navigation from '../../components/Navigation';
import { Plus, Trash2, ArrowRight, DollarSign, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';

interface KardexProduct {
  Id_producto: number;
  Nombre_producto: string;
  PrecioVenta: number;
  Stock_actual: number;
}

interface SaleItem {
  idProducto: number;
  nombre: string;
  cantidad: number;
  precioVenta: number;
  stockDisponible: number;
}

export default function VentasPage() {
  const [products, setProducts] = useState<KardexProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [items, setItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Guardar datos del producto seleccionado para visualización en tiempo real
  const [selectedProductStock, setSelectedProductStock] = useState<number | null>(null);
  const [selectedProductPrice, setSelectedProductPrice] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      router.push('/');
      return;
    }
    fetchProductsWithStock();
  }, [router]);

  const fetchProductsWithStock = async () => {
    try {
      // Obtenemos los productos junto con su stock consolidado del Kardex
      const response = await api.get('/kardex');
      setProducts(response.data);
    } catch (err) {
      console.error('Error al obtener productos del Kardex', err);
    }
  };

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    if (!id) {
      setSelectedProductStock(null);
      setSelectedProductPrice(null);
      return;
    }

    const prod = products.find((p) => p.Id_producto === parseInt(id));
    if (prod) {
      setSelectedProductStock(prod.Stock_actual);
      setSelectedProductPrice(Number(prod.PrecioVenta));
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

    const prodId = parseInt(selectedProductId);
    const prod = products.find((p) => p.Id_producto === prodId);

    if (!prod) return;

    // Calcular cuánto se ha agregado ya al carrito para este producto
    const alreadyInCart = items
      .filter((i) => i.idProducto === prodId)
      .reduce((sum, item) => sum + item.cantidad, 0);

    const totalSolicitado = alreadyInCart + cantidad;

    if (totalSolicitado > prod.Stock_actual) {
      setError(`No se puede agregar. El stock disponible es ${prod.Stock_actual} y has solicitado en total ${totalSolicitado}.`);
      return;
    }

    const existingIndex = items.findIndex((i) => i.idProducto === prodId);
    if (existingIndex >= 0) {
      const updated = [...items];
      updated[existingIndex].cantidad += cantidad;
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          idProducto: prodId,
          nombre: prod.Nombre_producto,
          cantidad,
          precioVenta: Number(prod.PrecioVenta),
          stockDisponible: prod.Stock_actual,
        },
      ]);
    }

    // Reset
    setSelectedProductId('');
    setSelectedProductStock(null);
    setSelectedProductPrice(null);
    setCantidad(1);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleSubmitSale = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (items.length === 0) {
      setError('Debe agregar al menos un producto a la venta.');
      setLoading(false);
      return;
    }

    // Verificación de stock definitiva en frontend
    const stockViolatedItem = items.find((item) => item.cantidad > item.stockDisponible);
    if (stockViolatedItem) {
      setError(
        `Error crítico: El producto '${stockViolatedItem.nombre}' excede el stock disponible (${stockViolatedItem.stockDisponible}). Reduzca la cantidad.`
      );
      setLoading(false);
      return;
    }

    try {
      const payload = {
        items: items.map((i) => ({
          idProducto: i.idProducto,
          cantidad: i.cantidad,
        })),
      };

      await api.post('/ventas', payload);
      setSuccess('Venta registrada con éxito. Comprobante e inventario actualizados transaccionalmente.');
      setItems([]);
      fetchProductsWithStock(); // Recargar stock en tiempo real
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar la venta.');
    } finally {
      setLoading(false);
    }
  };

  // Validar si existe alguna violación de stock en el carrito para deshabilitar el botón
  const isStockExceeded = items.some((item) => item.cantidad > item.stockDisponible);

  // Cálculos reactivos de la venta en tiempo real
  const subTotal = items.reduce((acc, item) => acc + item.cantidad * item.precioVenta, 0);
  const igv = subTotal * 0.18;
  const total = subTotal + igv;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-200">
      <Navigation />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-emerald-400" />
            <span>Registrar Venta</span>
          </h1>
          <p className="text-sm text-slate-400">Salida de mercadería e inventario con validación de stock en tiempo real.</p>
        </div>

        {/* Notificaciones */}
        {error && (
          <div className="flex items-center space-x-2 bg-rose-950/20 border border-rose-900/50 text-rose-400 p-4 rounded-xl">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center space-x-2 bg-emerald-950/20 border border-emerald-900/50 text-emerald-400 p-4 rounded-xl">
            <ShieldCheck className="h-5 w-5 flex-shrink-0 text-emerald-500" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Panel Agregar Item */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit space-y-4">
            <h2 className="text-md font-semibold text-slate-100 border-b border-slate-800 pb-2">
              Seleccionar Producto
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
                    <option key={p.Id_producto} value={p.Id_producto} disabled={p.Stock_actual <= 0}>
                      {p.Nombre_producto} {p.Stock_actual <= 0 ? '(Agotado)' : `(Stock: ${p.Stock_actual})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Muestra datos en tiempo real al seleccionar */}
              {selectedProductId && (
                <div className="grid grid-cols-2 gap-4 bg-slate-950/50 border border-slate-800/80 rounded-lg p-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Stock Disponible</span>
                    <span className={`font-semibold ${selectedProductStock! <= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {selectedProductStock} u.
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Precio de Venta</span>
                    <span className="font-semibold text-slate-200">
                      ${selectedProductPrice?.toFixed(4)}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 block">Cantidad a Vender</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedProductId || (selectedProductStock !== null && cantidad > selectedProductStock)}
                className="w-full flex justify-center items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg text-sm shadow-md disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar a la Venta</span>
              </button>
            </form>
          </div>

          {/* Carrito de Venta y Validación de Stock */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <h2 className="text-md font-semibold text-slate-100 border-b border-slate-800 pb-2">
                Detalle del Comprobante (Venta)
              </h2>
              {items.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  Ningún producto agregado todavía. Utilice el selector lateral.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs">
                        <th className="py-2">Producto</th>
                        <th className="py-2 text-right">Cantidad</th>
                        <th className="py-2 text-right">Stock Disp.</th>
                        <th className="py-2 text-right">Precio Venta</th>
                        <th className="py-2 text-right">Subtotal</th>
                        <th className="py-2 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => {
                        const isOverStock = item.cantidad > item.stockDisponible;
                        return (
                          <tr
                            key={idx}
                            className={`border-b border-slate-800/50 hover:bg-slate-800/20 text-slate-300 ${
                              isOverStock ? 'bg-rose-950/10 border-rose-900/50 text-rose-300' : ''
                            }`}
                          >
                            <td className="py-2.5 font-medium flex items-center gap-1.5">
                              {item.nombre}
                              {isOverStock && (
                                <span className="text-[9px] bg-rose-900/40 text-rose-400 border border-rose-800 px-1 py-0.5 rounded uppercase font-bold">
                                  Sin Stock
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 text-right font-mono">{item.cantidad}</td>
                            <td className="py-2.5 text-right font-mono text-slate-400">{item.stockDisponible}</td>
                            <td className="py-2.5 text-right">${item.precioVenta.toFixed(4)}</td>
                            <td className="py-2.5 text-right">${(item.cantidad * item.precioVenta).toFixed(4)}</td>
                            <td className="py-2.5 text-right">
                              <button
                                onClick={() => handleRemoveItem(idx)}
                                className="text-rose-400 hover:text-rose-300 transition-colors p-1 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Panel de Validación de Stock y Totales */}
            {items.length > 0 && (
              <div className="border-t border-slate-800 pt-4 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                
                {/* Alerta de bloqueo */}
                {isStockExceeded && (
                  <div className="flex items-center space-x-2 text-xs bg-rose-950/40 border border-rose-900/50 text-rose-400 p-2.5 rounded-lg w-full md:w-auto">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 animate-bounce" />
                    <span>BOTÓN BLOQUEADO: Cantidades ingresadas superan el stock disponible.</span>
                  </div>
                )}

                {/* Totales */}
                <div className="flex items-center justify-between md:justify-end gap-6 text-right w-full md:w-auto">
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

                {/* Acción de Envío (Bloqueo proactivo en frontend) */}
                <button
                  onClick={handleSubmitSale}
                  disabled={loading || isStockExceeded}
                  className="w-full md:w-auto flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-emerald-950 disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <span>{loading ? 'Procesando...' : 'Confirmar Venta'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
