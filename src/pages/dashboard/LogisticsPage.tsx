import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth-context';
import { Plus, Search, Filter, Ship, Plane, Truck, Brain as Train, Package, MapPin, Calendar, AlertTriangle, CheckCircle2, Clock, ExternalLink, MoreVertical, Loader2 } from 'lucide-react';

type Shipment = {
  id: string;
  number: string;
  order: string;
  customer: string;
  mode: 'sea' | 'air' | 'express' | 'rail' | 'truck';
  status: 'booked' | 'picked_up' | 'export_cleared' | 'in_transit' | 'arrived' | 'import_cleared' | 'delivered' | 'exception';
  origin: string;
  destination: string;
  etd: string;
  eta: string;
  carrier: string;
  tracking: string;
};

const modeIcons: Record<Shipment['mode'], React.ReactNode> = {
  sea: <Ship className="w-4 h-4" />,
  air: <Plane className="w-4 h-4" />,
  express: <Package className="w-4 h-4" />,
  rail: <Train className="w-4 h-4" />,
  truck: <Truck className="w-4 h-4" />,
};

const statusConfig: Record<Shipment['status'], { color: string; label: string; icon: React.ReactNode }> = {
  booked: { color: 'bg-blue-100 text-blue-700', label: 'Booked', icon: <Calendar className="w-3 h-3" /> },
  picked_up: { color: 'bg-cyan-100 text-cyan-700', label: 'Picked Up', icon: <Package className="w-3 h-3" /> },
  export_cleared: { color: 'bg-cyan-100 text-cyan-700', label: 'Export Cleared', icon: <CheckCircle2 className="w-3 h-3" /> },
  in_transit: { color: 'bg-yellow-100 text-yellow-700', label: 'In Transit', icon: <Clock className="w-3 h-3" /> },
  arrived: { color: 'bg-green-100 text-green-700', label: 'Arrived', icon: <MapPin className="w-3 h-3" /> },
  import_cleared: { color: 'bg-green-100 text-green-700', label: 'Import Cleared', icon: <CheckCircle2 className="w-3 h-3" /> },
  delivered: { color: 'bg-green-100 text-green-700', label: 'Delivered', icon: <CheckCircle2 className="w-3 h-3" /> },
  exception: { color: 'bg-red-100 text-red-700', label: 'Exception', icon: <AlertTriangle className="w-3 h-3" /> },
};

export function LogisticsPage() {
  const { tenant } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (tenant) {
          const { data, error } = await supabase
            .from('shipments')
            .select('*, account:accounts(name)')
            .eq('tenant_id', tenant.id)
            .order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            setShipments(
              data.map((row: Record<string, unknown>) => ({
                id: row.id as string,
                number: (row.shipment_number as string) || '—',
                order: (row.order_id as string) || '—',
                customer: ((row.account as { name?: string } | null)?.name) || '—',
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
        console.error('LogisticsPage fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [tenant]);

  const stats = [
    { title: 'Active Shipments', value: String(shipments.filter(s => !['delivered', 'exception'].includes(s.status)).length), icon: <Package className="w-5 h-5" />, iconColor: 'bg-xisync-cyan-100 text-xisync-cyan-600' },
    { title: 'In Transit', value: String(shipments.filter(s => s.status === 'in_transit').length), icon: <Ship className="w-5 h-5" />, iconColor: 'bg-xisync-blue-100 text-xisync-blue-600' },
    { title: 'Delivered', value: String(shipments.filter(s => s.status === 'delivered').length), icon: <CheckCircle2 className="w-5 h-5" />, iconColor: 'bg-xisync-green-100 text-xisync-green-600' },
    { title: 'Exceptions', value: String(shipments.filter(s => s.status === 'exception').length), icon: <AlertTriangle className="w-5 h-5" />, iconColor: 'bg-red-100 text-red-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-xisync-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logistics</h1>
          <p className="text-gray-600">Track and manage your shipments</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Create Shipment</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search shipments..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500"
          />
        </div>
        <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
          Filter
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Shipment</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Route</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mode</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ETA</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {shipments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">No shipments yet</td>
              </tr>
            ) : (
              shipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedShipment(shipment)}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{shipment.number}</div>
                    <div className="text-sm text-gray-500">{shipment.order}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{shipment.customer}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-900">{shipment.origin}</div>
                      <div className="text-gray-500">to {shipment.destination}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                        {modeIcons[shipment.mode]}
                      </div>
                      <span className="capitalize text-gray-600">{shipment.mode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[shipment.status].color}`}>
                      {statusConfig[shipment.status].icon}
                      {statusConfig[shipment.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {shipment.eta ? new Date(shipment.eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedShipment(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedShipment.number}</h2>
                  <p className="text-gray-500">{selectedShipment.customer}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[selectedShipment.status].color}`}>
                  {statusConfig[selectedShipment.status].icon}
                  {statusConfig[selectedShipment.status].label}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Origin</div>
                  <div className="font-medium text-gray-900">{selectedShipment.origin}</div>
                  <div className="text-sm text-gray-500">ETD: {selectedShipment.etd ? new Date(selectedShipment.etd).toLocaleDateString() : '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Destination</div>
                  <div className="font-medium text-gray-900">{selectedShipment.destination}</div>
                  <div className="text-sm text-gray-500">ETA: {selectedShipment.eta ? new Date(selectedShipment.eta).toLocaleDateString() : '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Carrier</div>
                  <div className="font-medium text-gray-900">{selectedShipment.carrier}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Tracking Number</div>
                  <div className="font-medium text-xisync-cyan-600">{selectedShipment.tracking}</div>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-4">Milestones</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-6">
                  {['Booked', 'Picked Up', 'Export Cleared', 'In Transit', 'Arrived', 'Import Cleared', 'Delivered'].map((milestone, index) => {
                    const statusOrder = ['booked', 'picked_up', 'export_cleared', 'in_transit', 'arrived', 'import_cleared', 'delivered'];
                    const currentIndex = statusOrder.indexOf(selectedShipment.status);
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    return (
                      <div key={milestone} className="relative flex items-start gap-4 pl-8">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-xisync-green-100 text-xisync-green-600' :
                          isCurrent ? 'bg-xisync-cyan-100 text-xisync-cyan-600 ring-4 ring-xisync-cyan-50' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className={`font-medium ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                            {milestone}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedShipment(null)}>Close</Button>
              <Button>Share Tracking</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
