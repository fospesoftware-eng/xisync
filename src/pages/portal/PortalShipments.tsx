import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import {
  Ship,
  Plane,
  Truck,
  Package,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  X,
} from 'lucide-react';

type Shipment = {
  id: string;
  order: string;
  mode: 'sea' | 'air' | 'express';
  status: 'booked' | 'in_transit' | 'arrived' | 'delivered';
  origin: string;
  destination: string;
  etd: string;
  eta: string;
  carrier: string;
  tracking: string;
  milestones: { name: string; date: string; completed: boolean }[];
};

const sampleShipments: Shipment[] = [
  {
    id: 'SH-2024-001',
    order: 'ORD-2024-002',
    mode: 'sea',
    status: 'in_transit',
    origin: 'Shanghai, China',
    destination: 'Los Angeles, USA',
    etd: '2024-01-15',
    eta: '2024-02-05',
    carrier: 'COSCO Shipping',
    tracking: 'COSU1234567890',
    milestones: [
      { name: 'Order Placed', date: 'Jan 10, 2024', completed: true },
      { name: 'Picked Up', date: 'Jan 14, 2024', completed: true },
      { name: 'Departed Port', date: 'Jan 15, 2024', completed: true },
      { name: 'In Transit', date: 'Jan 15, 2024', completed: true },
      { name: 'Arrived at Port', date: '', completed: false },
      { name: 'Customs Cleared', date: '', completed: false },
      { name: 'Delivered', date: '', completed: false },
    ],
  },
  {
    id: 'SH-2024-002',
    order: 'ORD-2024-003',
    mode: 'air',
    status: 'arrived',
    origin: 'Shenzhen, China',
    destination: 'New York, USA',
    etd: '2024-01-18',
    eta: '2024-01-22',
    carrier: 'DHL Express',
    tracking: 'DHL9876543210',
    milestones: [
      { name: 'Order Placed', date: 'Jan 16, 2024', completed: true },
      { name: 'Picked Up', date: 'Jan 18, 2024', completed: true },
      { name: 'Departed Origin', date: 'Jan 18, 2024', completed: true },
      { name: 'In Transit', date: 'Jan 19, 2024', completed: true },
      { name: 'Arrived at Destination', date: 'Jan 21, 2024', completed: true },
      { name: 'Out for Delivery', date: '', completed: false },
      { name: 'Delivered', date: '', completed: false },
    ],
  },
];

const modeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  sea: { icon: <Ship className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600', label: 'Ocean Freight' },
  air: { icon: <Plane className="w-5 h-5" />, color: 'bg-cyan-100 text-cyan-600', label: 'Air Freight' },
  express: { icon: <Truck className="w-5 h-5" />, color: 'bg-green-100 text-green-600', label: 'Express' },
};

const statusConfig: Record<string, { color: string; label: string }> = {
  booked: { color: 'bg-gray-100 text-gray-700', label: 'Booked' },
  in_transit: { color: 'bg-yellow-100 text-yellow-700', label: 'In Transit' },
  arrived: { color: 'bg-blue-100 text-blue-700', label: 'Arrived' },
  delivered: { color: 'bg-green-100 text-green-700', label: 'Delivered' },
};

export function PortalShipments() {
  const [shipments] = useState<Shipment[]>(sampleShipments);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

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
              <div className="text-2xl font-bold text-gray-900">2</div>
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
              <div className="text-2xl font-bold text-gray-900">1</div>
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
              <div className="text-2xl font-bold text-gray-900">8</div>
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
              <div className="text-2xl font-bold text-gray-900">11</div>
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
          {shipments.map((shipment) => (
            <div
              key={shipment.id}
              className="p-5 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setSelectedShipment(shipment)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${modeConfig[shipment.mode].color}`}>
                    {modeConfig[shipment.mode].icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{shipment.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[shipment.status].color}`}>
                        {statusConfig[shipment.status].label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      Order: {shipment.order} | {modeConfig[shipment.mode].label}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">ETA: {new Date(shipment.eta).toLocaleDateString()}</div>
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
                        style={{
                          width: `${(shipment.milestones.filter(m => m.completed).length / shipment.milestones.length) * 100}%`
                        }}
                      />
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-3 h-3 rounded-full bg-xisync-blue-500 border-2 border-white" />
                    <div className="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-3 rounded-full bg-gray-300 border-2 border-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedShipment(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${modeConfig[selectedShipment.mode].color}`}>
                    {modeConfig[selectedShipment.mode].icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedShipment.id}</h2>
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
                    Departed: {new Date(selectedShipment.etd).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Destination</div>
                  <div className="font-medium text-gray-900">{selectedShipment.destination}</div>
                  <div className="text-sm text-gray-500">
                    ETA: {new Date(selectedShipment.eta).toLocaleDateString()}
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
                  {selectedShipment.milestones.map((milestone, index) => (
                    <div key={milestone.name} className="relative flex items-start gap-4 pl-8">
                      <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        milestone.completed
                          ? 'bg-xisync-green-100 text-xisync-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {milestone.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className={`font-medium ${milestone.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                          {milestone.name}
                        </div>
                        {milestone.date && (
                          <div className="text-sm text-gray-500">{milestone.date}</div>
                        )}
                      </div>
                    </div>
                  ))}
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
