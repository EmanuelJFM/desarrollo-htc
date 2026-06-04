'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import Navigation from '../../components/Navigation';
import { ClipboardList, History, X, Calendar, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';

interface KardexItem {
  Id_producto: number;
  Nombre_producto: string;
  NroLote: string;
  Costo: number;
  PrecioVenta: number;
  Stock_actual: number;
}

interface MovimientoItem {
  Id_MovimientoCab: number;
  Fecha_registro: string;
  Tipo_Movimiento: 'Entrada' | 'Salida';
  Cantidad: number;
  Id_DocumentoOrigen: number;
}

export default function KardexPage() {
  const [kardexList, setKardexList] = useState<KardexItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<KardexItem | null>(null);
  const [movements, setMovements] = useState<MovimientoItem[]>([]);
  const [loadingMovements, setLoadingMovements] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      router.push('/');
      return;
    }
    fetchKardex();
  }, [router]);

  const fetchKardex = async () => {
    setLoading(true);
    try {
      const response = await api.get('/kardex');
      setKardexList(response.data);
    } catch (err) {
      console.error('Error al obtener consolidado de Kardex', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMovements = async (product: KardexItem) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setLoadingMovements(true);

    try {
      const response = await api.get(`/kardex/producto/${product.Id_producto}`);
      setMovements(response.data);
    } catch (err) {
      console.error('Error al obtener movimientos del producto', err);
    } finally {
      setLoadingMovements(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setMovements([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-200">
      <Navigation />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-emerald-400" />
              <span>Kardex de Inventario</span>
            </h1>
            <p className="text-sm text-slate-400">Consolidado general de stock, costos de compra y precios de venta.</p>
          </div>
        </div>

        {/* Tabla principal */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          {loading ? (
            <div className="text-center py-12 text-slate-400">Cargando inventario...</div>
          ) : kardexList.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No hay productos registrados en el sistema. Vaya a Registro de Compras para abastecer stock.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Producto</th>
                    <th className="py-3 px-4">Nro Lote</th>
                    <th className="py-3 px-4 text-right">Costo Unit.</th>
                    <th className="py-3 px-4 text-right">Precio Venta</th>
                    <th className="py-3 px-4 text-right">Stock Actual</th>
                    <th className="py-3 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {kardexList.map((item) => (
                    <tr key={item.Id_producto} className="border-b border-slate-800/60 hover:bg-slate-800/20 text-slate-300 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-slate-500">{item.Id_producto}</td>
                      <td className="py-3 px-4 font-medium">{item.Nombre_producto}</td>
                      <td className="py-3 px-4 text-slate-400 text-xs">{item.NroLote || 'N/A'}</td>
                      <td className="py-3 px-4 text-right font-mono">${Number(item.Costo).toFixed(4)}</td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-400">${Number(item.PrecioVenta).toFixed(4)}</td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-xs ${
                            item.Stock_actual <= 0
                              ? 'bg-rose-950/40 text-rose-400 border border-rose-900/50'
                              : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/50'
                          }`}
                        >
                          {item.Stock_actual} u.
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleOpenMovements(item)}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded text-xs transition-colors cursor-pointer"
                        >
                          <Eye className="h-3 w.5-3 text-emerald-400" />
                          <span>Ver Movimientos</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal Detallado de Movimientos (Historial) */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <History className="h-5 w-5 text-emerald-400" />
                <div>
                  <h2 className="text-md font-semibold text-slate-100">Historial de Kardex</h2>
                  <p className="text-xs text-slate-400">{selectedProduct.Nombre_producto}</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenido Historial */}
            <div className="space-y-4">
              {loadingMovements ? (
                <div className="text-center py-8 text-slate-400">Cargando movimientos...</div>
              ) : movements.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No se registran movimientos para este producto en el sistema.
                </div>
              ) : (
                <div className="overflow-y-auto max-h-96">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs">
                        <th className="py-2">Fecha Registro</th>
                        <th className="py-2">Tipo Movimiento</th>
                        <th className="py-2 text-right">Cantidad</th>
                        <th className="py-2 text-right">Doc. Origen ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movements.map((mov) => {
                        const isEntrada = mov.Tipo_Movimiento === 'Entrada';
                        return (
                          <tr key={mov.Id_MovimientoCab} className="border-b border-slate-800/40 hover:bg-slate-800/10 text-slate-300">
                            <td className="py-2 flex items-center space-x-1.5 text-slate-400 text-xs">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(mov.Fecha_registro).toLocaleString()}</span>
                            </td>
                            <td className="py-2">
                              <span
                                className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                  isEntrada
                                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/50'
                                    : 'bg-rose-950/40 text-rose-400 border border-rose-900/50'
                                }`}
                              >
                                {isEntrada ? (
                                  <ArrowUpRight className="h-3 w-3 inline" />
                                ) : (
                                  <ArrowDownRight className="h-3 w-3 inline" />
                                )}
                                <span>{mov.Tipo_Movimiento}</span>
                              </span>
                            </td>
                            <td className="py-2 text-right font-mono font-bold text-slate-200">
                              {isEntrada ? '+' : '-'}{mov.Cantidad}
                            </td>
                            <td className="py-2 text-right font-mono text-xs text-slate-500">
                              #{mov.Id_DocumentoOrigen}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
              <span className="text-slate-500">
                Stock consolidado total: <span className="font-semibold text-slate-300">{selectedProduct.Stock_actual} u.</span>
              </span>
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
