import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { StatsCard } from '../../components/dashboard/StatsCard';
import {
  Plus,
  Search,
  Filter,
  Ship,
  Plane,
  Truck,
  Package,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  MoreVertical,
} from 'lucide-react';

type Shipment = {
  id: string;
  number: string;
  order: string;
  customer: string;
  mode: 'sea' | 'air' | 'express' | 'truck';
  status: 'booked' | 'picked_up' | 'in_transit' | 'arrived' | 'delivered' | 'exception';
  origin: string;
  destination: string;
  etd: string;
  eta: string;
  carrier: string;
  tracking: string;
};

const sampleShipments: Shipment[] = [
  { id: '1', number: 'SH-2024-001', order: 'ORD-001', customer: 'ABC Corp', mode: 'sea', status: 'in_transit', origin: 'Shanghai, CN', destination: 'Los Angeles, US', etd: '2024-01-10', eta: '2024-02-05', carrier: 'COSCO', tracking: 'COSU123456' },
  { id: '2', number: 'SH-2024-002', order: 'ORD-002', customer: 'XYZ Ltd', mode: 'air', status: 'picked_up', origin: 'Shenzhen, CN', destination: 'London, UK', etd: '2024-01-18', eta: '2024-01-22', carrier: 'DHL', tracking: 'DHL789012' },
  { id: '3', number: 'SH-2024-003', order: 'ORD-003', customer: 'Tech Inc', mode: 'express', status: 'delivered', origin: 'Guangzhou, CN', destination: 'New York, US', etd: '2024-01-12', eta: '2024-01-16', carrier: 'FedEx', tracking: 'FEDEX345678' },
  { id: '4', number: 'SH-2024-004', order: 'ORD-004', customer: 'Global Trade', mode: 'sea', status: 'exception', origin: 'Ningbo, CN', destination: 'Hamburg, DE', etd: '2024-01-08', eta: '2024-02-10', carrier: 'Maersk', tracking: 'MAEU901234' },
  { id: '5', number: 'SH-2024-005', order: 'ORD-005', customer: 'Euro Goods', mode: 'air', status: 'booked', origin: 'Shanghai, CN', destination: 'Paris, FR', etd: '2024-01-25', eta: '2024-01-28', carrier: 'Air France', tracking: 'AF567890' },
];

const modeIcons: Record<Shipment['mode'], React.ReactNode> = {
  sea: <Ship className="w-4 h-4" />,
  air: <Plane className="w-4 h-4" />,
  express: <Package className="w-4 h-4" />,
  truck: <Truck className="w-4 h-4" />,
};

const statusConfig: Record<Shipment['status'], { color: string; label: string; icon: React.ReactNode }> = {
  booked: { color: 'bg-blue-100 text-blue-700', label: 'Booked', icon: <Calendar className="w-3 h-3" /> },
  picked_up: { color: 'bg-cyan-100 text-cyan-700', label: 'Picked Up', icon: <Package className="w-3 h-3" /> },
  in_transit: { color: 'bg-yellow-100 text-yellow-700', label: 'In Transit', icon: <Clock className="w-3 h-3" /> },
  arrived: { color: 'bg-green-100 text-green-700', label: 'Arrived', icon: <MapPin className="w-3 h-3" /> },
  delivered: { color: 'bg-green-100 text-green-700', label: 'Delivered', icon: <CheckCircle2 className="w-3 h-3" /> },
  exception: { color: 'bg-red-100 text-red-700', label: 'Exception', icon: <AlertTriangle className="w-3 h-3" /> },
};

const stats = [
  { title: 'Active Shipments', value: '42', change: 8.1, icon: <Package className="w-5 h-5" />, iconColor: 'bg-xisync-cyan-100 text-xisync-cyan-600' },
  { title: 'In Transit', value: '28', icon: <Ship className="w-5 h-5" />, iconColor: 'bg-xisync-blue-100 text-xisync-blue-600' },
  { title: 'Delivered (MTD)', value: '156', change: 12.3, icon: <CheckCircle2 className="w-5 h-5" />, iconColor: 'bg-xisync-green-100 text-xisync-green-600' },
  { title: 'Exceptions', value: '3', change: -25, icon: <AlertTriangle className="w-5 h-5" />, iconColor: 'bg-red-100 text-red-600' },
];

export function LogisticsPage() {
  const [shipments] = useState<Shipment[]>(sampleShipments);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

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
            change={stat.change}
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
            {shipments.map((shipment) => (
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
                  {new Date(shipment.eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
            ))}
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
                  <div className="text-sm text-gray-500">ETD: {new Date(selectedShipment.etd).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Destination</div>
                  <div className="font-medium text-gray-900">{selectedShipment.destination}</div>
                  <div className="text-sm text-gray-500">ETA: {new Date(selectedShipment.eta).toLocaleDateString()}</div>
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
                    const isCompleted = index < 3;
                    const isCurrent = index === 3;
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
                          {isCompleted && (
                            <div className="text-sm text-gray-500">Jan {10 + index}, 2024</div>
                          )}
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
