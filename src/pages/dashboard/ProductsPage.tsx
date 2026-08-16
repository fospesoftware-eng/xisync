import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Package, Plus, Search, MoreVertical } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  moq: string;
  inventory: number;
  hsCode: string;
  status: 'active' | 'draft' | 'archived';
};

const sampleProducts: Product[] = [
  { id: '1', name: 'Industrial Hydraulic Valve Assembly X-900', category: 'Machinery & Components', price: '$450.00 / Unit', moq: '50 Units', inventory: 1240, hsCode: '8481.20.00', status: 'active' },
  { id: '2', name: 'Smart IoT Precision Sensor Array v4', category: 'Electronics & Sensors', price: '$85.00 / Unit', moq: '100 Units', inventory: 3800, hsCode: '9031.80.80', status: 'active' },
  { id: '3', name: 'High-Tensile Carbon Fiber Fabric 3K Roll', category: 'Raw Materials & Composites', price: '$120.00 / Roll', moq: '20 Rolls', inventory: 650, hsCode: '6815.10.00', status: 'active' },
  { id: '4', name: 'Automatic Bottling & Packaging System Pro', category: 'Heavy Industrial Machinery', price: '$18,500.00 / Set', moq: '1 Set', inventory: 12, hsCode: '8422.30.00', status: 'active' },
  { id: '5', name: 'Solar Energy Inverter Hybrid 10kW', category: 'Clean Energy & Power', price: '$1,250.00 / Unit', moq: '10 Units', inventory: 420, hsCode: '8504.40.95', status: 'active' },
];

export function ProductsPage() {
  const [products] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Global Products & Catalog Center</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300 font-medium">
            Manage your B2B trade product catalog, HS codes, MOQ tiers, and global inventory
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button icon={<Plus className="w-4 h-4" />}>Add Product</Button>
        </div>
      </div>

      {/* KPI Metric Deck */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Active SKUs</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">428</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">Global Trade Catalog</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Average Unit Price</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-cyan-400 mt-1">$480.00</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Wholesale & Export Tiers</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Total In-Stock Units</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">68,400</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Across 4 Logistics Hubs</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Verified HS Codes</div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">100%</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Customs Ready</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by SKU name or category..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950/80 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-xisync-cyan-500 font-medium"
          />
        </div>
      </div>

      {/* Product List Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-200 font-extrabold">
              <th className="py-3.5 px-6">Product Name & Category</th>
              <th className="py-3.5 px-6">Wholesale Price</th>
              <th className="py-3.5 px-6">MOQ Requirement</th>
              <th className="py-3.5 px-6">Inventory Stock</th>
              <th className="py-3.5 px-6">HS Tariff Code</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredProducts.map((prod) => (
              <tr key={prod.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-xisync-blue-500 to-xisync-cyan-500 flex items-center justify-center text-white font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white text-sm">{prod.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-300 font-medium">{prod.category}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 font-mono font-bold text-emerald-600 dark:text-emerald-400">{prod.price}</td>
                <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-200">{prod.moq}</td>
                <td className="py-4 px-6 font-mono font-semibold text-slate-800 dark:text-slate-200">{prod.inventory.toLocaleString()} Units</td>
                <td className="py-4 px-6 font-mono text-slate-500 dark:text-slate-300 font-bold">{prod.hsCode}</td>
                <td className="py-4 px-6 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
