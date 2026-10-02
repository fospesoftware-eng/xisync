import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { xisyncDb } from '../../lib/xisync-db';
import { useAuth } from '../../lib/auth-context';
import {
  Ship,
  Plane,
  Truck,
  Package,
  MapPin,
  CheckCircle2,
  Clock,
  Download,
  X,
  Loader2,
} from 'lucide-react';

type Shipment = {
  id: string;
  number: string;
  order: string;
  mode: 'sea' | 'air' | 'express' | 'rail' | 'truck';
  status: 'booked' | 'picked_up' | 'export_cleared' | 'in_transit' | 'arrived' | 'import_cleared' | 'delivered' | 'exception';
  origin: string;
  destination: string;
  etd: string;
  eta: string;
  carrier: string;
  tracking: string;
};

const modeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  sea: { icon: <Ship className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600', label: 'Ocean Freight' },
  air: { icon: <Plane className="w-5 h-5" />, color: 'bg-cyan-100 text-cyan-600', label: 'Air Freight' },
  express: { icon: <Truck className="w-5 h-5" />, color: 'bg-green-100 text-green-600', label: 'Express' },
  rail: { icon: <Package className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-600', label: 'Rail' },
  truck: { icon: <Truck className="w-5 h-5" />, color: 'bg-gray-100 text-gray-600', label: 'Truck' },
};

const statusConfig: Record<string, { color: string; label: string }> = {
  booked: { color: 'bg-gray-100 text-gray-700', label: 'Booked' },
  picked_up: { color: 'bg-cyan-100 text-cyan-700', label: 'Picked Up' },
  export_cleared: { color: 'bg-cyan-100 text-cyan-700', label: 'Export Cleared' },
  in_transit: { color: 'bg-yellow-100 text-yellow-700', label: 'In Transit' },
  arrived: { color: 'bg-blue-100 text-blue-700', label: 'Arrived' },
  import_cleared: { color: 'bg-green-100 text-green-700', label: 'Import Cleared' },
  delivered: { color: 'bg-green-100 text-green-700', label: 'Delivered' },
  exception: { color: 'bg-red-100 text-red-700', label: 'Exception' },
};

const statusOrder = ['booked', 'picked_up', 'export_cleared', 'in_transit', 'arrived', 'import_cleared', 'delivered'];
const milestoneLabels = ['Booked', 'Picked Up', 'Export Cleared', 'In Transit', 'Arrived', 'Import Cleared', 'Delivered'];

export function PortalShipments() {
  const { tenant } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (tenant) {
          const { data, error } = await xisyncDb
            .from('shipments')
            .select('*')
            .eq('tenant_id', tenant.id)
            .order('created_at', { ascending: false });
          if (!error && data) {
            setShipments(
              data.map((row: Record<string, unknown>) => ({
                id: row.id as string,
                number: (row.shipment_number as string) || '—',
                order: (row.order_id as string) || '—',
                mode: (row.mode as Shipment['mode']) || 'sea',
                status: (row.status as Shipment['status']) || 'booked',
                origin: `${row.origin_port || '—'}, ${row.origin_country || ''}`.trim(),
                destination: `${row.destination_port || '—'}, ${row.destination_country || ''}`.trim(),
                etd: (row.etd as string) || '',
                eta: (row.eta as string) || '',
                carrier: (row.carrier as string) || '—',
                tracking: (row.tracking_number as string) || '—',
              })),
            );
          }
        }
      } catch (err) {
        console.error('PortalShipments fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [tenant]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-xisync-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Shipments</h1>
        <p className="text-gray-600">Track your orders from origin to destination</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{shipments.filter(s => s.status === 'in_transit').length}</div>
              <div className="text-sm text-gray-500">In Transit</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{shipments.filter(s => s.status === 'arrived').length}</div>
              <div className="text-sm text-gray-500">Arrived</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{shipments.filter(s => s.status === 'delivered').length}</div>
              <div className="text-sm text-gray-500">Delivered</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{shipments.length}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Active Shipments</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {shipments.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No shipments yet</div>
          ) : (
            shipments.map((shipment) => {
              const currentIndex = statusOrder.indexOf(shipment.status);
              const progress = currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
              return (
                <div
                  key={shipment.id}
                  className="p-5 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedShipment(shipment)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${modeConfig[shipment.mode]?.color || 'bg-gray-100 text-gray-600'}`}>
                        {modeConfig[shipment.mode]?.icon || <Package className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{shipment.number}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[shipment.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                            {statusConfig[shipment.status]?.label || shipment.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          Order: {shipment.order} | {modeConfig[shipment.mode]?.label || shipment.mode}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">ETA: {shipment.eta ? new Date(shipment.eta).toLocaleDateString() : '—'}</div>
                      <div className="text-sm text-gray-500">{shipment.carrier}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">{shipment.origin}</span>
                        <span className="text-sm text-gray-600">{shipment.destination}</span>
                      </div>
                      <div className="relative">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-xisync-blue-500 to-xisync-cyan-500 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-3 h-3 rounded-full bg-xisync-blue-500 border-2 border-white" />
                        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-3 rounded-full bg-gray-300 border-2 border-white" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedShipment(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${modeConfig[selectedShipment.mode]?.color || 'bg-gray-100 text-gray-600'}`}>
                    {modeConfig[selectedShipment.mode]?.icon || <Package className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedShipment.number}</h2>
                    <p className="text-gray-500">{selectedShipment.carrier}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedShipment(null)} className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Origin</div>
                  <div className="font-medium text-gray-900">{selectedShipment.origin}</div>
                  <div className="text-sm text-gray-500">
                    Departed: {selectedShipment.etd ? new Date(selectedShipment.etd).toLocaleDateString() : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Destination</div>
                  <div className="font-medium text-gray-900">{selectedShipment.destination}</div>
                  <div className="text-sm text-gray-500">
                    ETA: {selectedShipment.eta ? new Date(selectedShipment.eta).toLocaleDateString() : '—'}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-8">
                <div className="text-sm text-gray-500 mb-1">Tracking Number</div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-medium text-gray-900">{selectedShipment.tracking}</span>
                  <Button variant="outline" size="sm">
                    Track on Carrier Site
                  </Button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-4">Shipment Progress</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-6">
                  {milestoneLabels.map((milestone, index) => {
                    const currentIndex = statusOrder.indexOf(selectedShipment.status);
                    const isCompleted = index <= currentIndex;
                    return (
                      <div key={milestone} className="relative flex items-start gap-4 pl-8">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-xisync-green-100 text-xisync-green-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                            {milestone}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between">
              <Button variant="outline" icon={<Download className="w-4 h-4" />}>
                Download Documents
              </Button>
              <Button onClick={() => setSelectedShipment(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
