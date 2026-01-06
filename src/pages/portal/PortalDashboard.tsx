import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import {
  FileText,
  Package,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Ship,
  Plane,
} from 'lucide-react';

const stats = [
  { label: 'Open Quotes', value: '3', icon: FileText, color: 'bg-blue-100 text-blue-600' },
  { label: 'Active Orders', value: '5', icon: Package, color: 'bg-cyan-100 text-cyan-600' },
  { label: 'In Transit', value: '2', icon: Ship, color: 'bg-green-100 text-green-600' },
  { label: 'Unread Messages', value: '4', icon: MessageSquare, color: 'bg-yellow-100 text-yellow-600' },
];

const recentOrders = [
  { id: 'ORD-2024-001', date: 'Jan 15, 2024', total: '$12,450', status: 'In Production' },
  { id: 'ORD-2024-002', date: 'Jan 10, 2024', total: '$8,200', status: 'Shipped' },
  { id: 'ORD-2024-003', date: 'Jan 5, 2024', total: '$25,000', status: 'Delivered' },
];

const activeShipments = [
  { id: 'SH-2024-001', order: 'ORD-2024-002', mode: 'sea', origin: 'Shanghai', destination: 'Los Angeles', eta: 'Feb 5, 2024', status: 'In Transit' },
  { id: 'SH-2024-002', order: 'ORD-2024-003', mode: 'air', origin: 'Shenzhen', destination: 'New York', eta: 'Jan 22, 2024', status: 'Arrived' },
];

const pendingQuotes = [
  { id: 'QT-2024-005', date: 'Jan 18, 2024', items: 3, total: '$15,800', validUntil: 'Feb 18, 2024' },
  { id: 'QT-2024-004', date: 'Jan 12, 2024', items: 5, total: '$32,500', validUntil: 'Feb 12, 2024' },
];

export function PortalDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, John</h1>
          <p className="text-gray-600">Here's an overview of your account</p>
        </div>
        <Link to="/portal/messages">
          <Button>
            <MessageSquare className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Pending Quotes</h2>
            <Link to="/portal/orders" className="text-sm text-xisync-cyan-600 hover:text-xisync-cyan-700 font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingQuotes.map((quote) => (
              <div key={quote.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-medium text-gray-900">{quote.id}</span>
                    <p className="text-sm text-gray-500 mt-0.5">{quote.items} items</p>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{quote.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    Valid until {quote.validUntil}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">View</Button>
                    <Button size="sm">Accept</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Active Shipments</h2>
            <Link to="/portal/shipments" className="text-sm text-xisync-cyan-600 hover:text-xisync-cyan-700 font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {activeShipments.map((shipment) => (
              <div key={shipment.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      shipment.mode === 'sea' ? 'bg-blue-100 text-blue-600' : 'bg-cyan-100 text-cyan-600'
                    }`}>
                      {shipment.mode === 'sea' ? <Ship className="w-5 h-5" /> : <Plane className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{shipment.id}</span>
                      <p className="text-sm text-gray-500">{shipment.order}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    shipment.status === 'In Transit' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {shipment.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-600">
                    {shipment.origin} → {shipment.destination}
                  </div>
                  <div className="text-gray-500">ETA: {shipment.eta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/portal/orders" className="text-sm text-xisync-cyan-600 hover:text-xisync-cyan-700 font-medium flex items-center gap-1">
            View all orders <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">{order.id}</td>
                  <td className="px-5 py-4 text-gray-600">{order.date}</td>
                  <td className="px-5 py-4 font-medium text-gray-900">{order.total}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button variant="ghost" size="sm">View Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-r from-xisync-blue-900 to-xisync-cyan-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Need Help?</h3>
            <p className="text-xisync-blue-200">
              Our support team is ready to assist you with any questions.
            </p>
          </div>
          <Link to="/portal/support">
            <Button className="bg-white text-xisync-blue-900 hover:bg-gray-100">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
