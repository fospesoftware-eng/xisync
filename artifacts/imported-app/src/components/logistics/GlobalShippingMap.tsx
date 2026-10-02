import { useState, useEffect } from 'react';
import { Ship, Compass, DollarSign, X, CheckCircle2, Anchor } from 'lucide-react';

interface TradeRoute {
  id: string;
  name: string;
  carrier: string;
  vessel: string;
  origin: string;
  destination: string;
  region: string;
  speed: string;
  status: string;
  color: string;
  searoutePath: string;
  vesselPos: { x: number; y: number };
  cargo: string;
  containers: string;
}

export function GlobalShippingMap() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>('r1');
  const [activeRegionFilter, setActiveRegionFilter] = useState<string>('all');
  const [vesselPulse, setVesselPulse] = useState(0);
  const [showInspector, setShowInspector] = useState(false);
  const [showRateFinder, setShowRateFinder] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVesselPulse((prev) => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Famous Top China Export Ports
  const chinaMajorPorts = [
    { name: 'Shanghai (CNSHA)', x: 820, y: 175, highlight: true },
    { name: 'Ningbo-Zhoushan (CNNGB)', x: 828, y: 185, highlight: true },
    { name: 'Shenzhen Yantian (CNSZX)', x: 800, y: 210, highlight: true },
    { name: 'Guangzhou Nansha (CNCAN)', x: 788, y: 215, highlight: false },
    { name: 'Qingdao (CNTAO)', x: 810, y: 155, highlight: false },
    { name: 'Tianjin (CNTSN)', x: 800, y: 140, highlight: false },
    { name: 'Xiamen (CNXMN)', x: 815, y: 198, highlight: false },
    { name: 'Hong Kong (HKHKG)', x: 805, y: 222, highlight: false },
    { name: 'Dalian (CNDLC)', x: 815, y: 135, highlight: false },
  ];

  // International Destination Hub Ports
  const globalDestinationPorts = [
    { name: 'Los Angeles', x: 180, y: 180 },
    { name: 'New York', x: 240, y: 160 },
    { name: 'Rotterdam', x: 480, y: 110 },
    { name: 'Nhava Sheva', x: 675, y: 210 },
    { name: 'Jebel Ali', x: 600, y: 190 },
    { name: 'Singapore', x: 770, y: 240 },
    { name: 'Santos', x: 330, y: 330 },
  ];

  const tradeRoutes: TradeRoute[] = [
    {
      id: 'r1',
      name: 'Transpacific Express',
      carrier: 'COSCO Shipping',
      vessel: 'COSCO SH-2024',
      origin: 'Shanghai (CNSHA)',
      destination: 'Los Angeles (USLAX)',
      region: 'pacific',
      speed: '18.4 knots',
      status: 'In Pacific Ocean Transit',
      color: '#06b6d4',
      searoutePath: 'M 820 175 C 700 80, 320 80, 180 180',
      vesselPos: { x: 500, y: 105 },
      cargo: 'Electronics & Solar Modules',
      containers: '1,850 TEU',
    },
    {
      id: 'r2',
      name: 'Asia Europe Route',
      carrier: 'Maersk Line',
      vessel: 'MAERSK EU-901',
      origin: 'Shenzhen Yantian (CNSZX)',
      destination: 'Rotterdam (NLRTM)',
      region: 'suez',
      speed: '21.2 knots',
      status: 'Suez Transit',
      color: '#f97316',
      searoutePath: 'M 800 210 L 770 240 L 675 210 L 600 190 L 580 170 L 450 140 L 480 110',
      vesselPos: { x: 600, y: 190 },
      cargo: 'Textiles & Auto Parts',
      containers: '2,400 TEU',
    },
    {
      id: 'r3',
      name: 'Transatlantic Direct',
      carrier: 'Hapag-Lloyd',
      vessel: 'HAPAG US-302',
      origin: 'Rotterdam (NLRTM)',
      destination: 'New York (USNYC)',
      region: 'atlantic',
      speed: '19.8 knots',
      status: 'Mid Atlantic Transit',
      color: '#84cc16',
      searoutePath: 'M 480 110 C 400 110, 310 130, 240 160',
      vesselPos: { x: 360, y: 125 },
      cargo: 'Pharmaceuticals & Hardware',
      containers: '850 TEU',
    },
    {
      id: 'r4',
      name: 'Middle East Express',
      carrier: 'OOCL Cargo',
      vessel: 'OOCL DXB-501',
      origin: 'Ningbo-Zhoushan (CNNGB)',
      destination: 'Jebel Ali (AEDXB)',
      region: 'me',
      speed: '19.5 knots',
      status: 'Arabian Sea Crossing',
      color: '#ef4444',
      searoutePath: 'M 828 185 L 770 240 L 600 190',
      vesselPos: { x: 680, y: 220 },
      cargo: 'Refined Goods & Equipment',
      containers: '1,420 TEU',
    },
  ];

  const filteredRoutes = tradeRoutes.filter((r) => {
    if (activeRegionFilter === 'pacific') return r.region === 'pacific';
    if (activeRegionFilter === 'suez') return r.region === 'suez';
    if (activeRegionFilter === 'atlantic') return r.region === 'atlantic';
    if (activeRegionFilter === 'me') return r.region === 'me';
    return true;
  });

  const activeR = tradeRoutes.find((r) => r.id === selectedRoute) || tradeRoutes[0];

  return (
    <div className="rounded-3xl bg-[#070b14] border border-slate-800/80 p-6 shadow-2xl relative overflow-hidden text-white space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-md">
            <Anchor className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              Global Shipping Map
            </h2>
          </div>
        </div>

        {/* Short Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#02050e] border border-slate-800 text-xs font-bold">
          {[
            { id: 'all', label: 'All' },
            { id: 'pacific', label: 'Pacific' },
            { id: 'suez', label: 'Suez' },
            { id: 'atlantic', label: 'Atlantic' },
            { id: 'me', label: 'Middle East' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveRegionFilter(tab.id);
                const match = tradeRoutes.find((r) => tab.id === 'all' || r.region === tab.id);
                if (match) setSelectedRoute(match.id);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeRegionFilter === tab.id
                  ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => setShowRateFinder(true)}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-extrabold shadow-xs transition-all flex items-center gap-1 ml-1"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Rates</span>
          </button>
        </div>
      </div>

      {/* EXPANDED HIGH-DEFINITION GEOGRAPHIC WORLD VECTOR MAP CANVAS */}
      <div className="relative w-full h-[540px] md:h-[580px] rounded-2xl bg-[#02050e] border border-slate-800/80 p-2 overflow-hidden shadow-inner">
        <svg className="w-full h-full" viewBox="0 0 1000 500">
          <defs>
            <pattern id="dotGridHD" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#334155" opacity="0.25" />
            </pattern>
          </defs>

          <rect width="1000" height="500" fill="url(#dotGridHD)" />

          {/* REAL HIGH-DEFINITION CONTINENT VECTOR SILHOUETTES */}
          <g fill="#1e293b" stroke="#475569" strokeWidth="1.5" opacity="0.95">
            {/* North America */}
            <path d="M 50 60 L 120 40 L 220 50 L 290 100 L 260 160 L 190 180 L 150 160 L 100 120 Z" />
            {/* South America */}
            <path d="M 260 210 L 320 220 L 350 280 L 320 370 L 280 400 L 250 310 Z" />
            {/* Europe */}
            <path d="M 440 60 L 520 40 L 550 80 L 510 130 L 460 130 L 430 90 Z" />
            {/* Africa */}
            <path d="M 440 150 L 540 150 L 560 250 L 520 370 L 460 350 L 430 250 Z" />
            {/* Middle East */}
            <path d="M 550 140 L 610 155 L 610 195 L 560 195 Z" />
            {/* India Subcontinent */}
            <path d="M 645 155 L 675 230 L 710 175 Z" />
            {/* East Asia & China Main Landmass */}
            <path d="M 730 80 L 880 60 L 910 140 L 870 230 L 750 210 Z" stroke="#ef4444" strokeWidth="2" />
            {/* Southeast Asia */}
            <path d="M 750 220 L 780 250 L 800 260 Z" />
            {/* Australia / Oceania */}
            <path d="M 810 290 L 890 290 L 920 340 L 870 390 L 810 340 Z" />
          </g>

          {/* FIERY DENSITY HEATLINES */}
          <g strokeWidth="1" opacity="0.4" fill="none">
            <path d="M 820 175 Q 770 240, 675 210 Q 600 190, 480 110" stroke="#f97316" strokeWidth="2.5" />
            <path d="M 820 175 Q 500 40, 180 180" stroke="#06b6d4" strokeWidth="2" />
            <path d="M 675 210 Q 600 190, 330 330" stroke="#f59e0b" strokeWidth="2" />
            <path d="M 800 210 L 770 240 L 675 210 L 600 190 L 580 170 L 450 140 L 480 110" stroke="#f97316" strokeWidth="2" />
            <path d="M 480 110 Q 340 130, 240 160" stroke="#84cc16" strokeWidth="1.5" />
          </g>

          {/* Interactive Trade Routes */}
          {filteredRoutes.map((route) => {
            const isSelected = selectedRoute === route.id;
            return (
              <g
                key={route.id}
                onClick={() => {
                  setSelectedRoute(route.id);
                  setShowInspector(true);
                }}
                className="cursor-pointer group"
              >
                <path
                  d={route.searoutePath}
                  fill="none"
                  stroke={route.color}
                  strokeWidth={isSelected ? '5' : '3'}
                  opacity={isSelected ? '1' : '0.75'}
                  className="transition-all duration-300 drop-shadow-md"
                />

                <path
                  d={route.searoutePath}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  strokeDasharray="6 8"
                  strokeDashoffset={-vesselPulse * 2.5}
                />

                <g transform={`translate(${route.vesselPos.x}, ${route.vesselPos.y})`}>
                  <circle r="12" fill={route.color} opacity="0.35" className="animate-ping" />
                  <circle r="7" fill={route.color} stroke="#ffffff" strokeWidth="2" />
                  <text y="-12" textAnchor="middle" className="fill-white text-[9.5px] font-extrabold font-mono drop-shadow-md">
                    {route.vessel}
                  </text>
                </g>
              </g>
            );
          })}

          {/* ALL FAMOUS CHINA MAJOR CONTAINER PORTS (RED BEACONS) */}
          {chinaMajorPorts.map((port, idx) => (
            <g key={`cn-port-${idx}`} className="group cursor-pointer">
              <circle cx={port.x} cy={port.y} r={port.highlight ? '6' : '4.5'} fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx={port.x} cy={port.y} r={port.highlight ? '12' : '8'} fill="#ef4444" opacity="0.35" className="animate-ping" />
              <text x={port.x + 8} y={port.y + 3} textAnchor="start" className="fill-red-400 text-[8.5px] font-black font-mono drop-shadow-md">
                {port.name}
              </text>
            </g>
          ))}

          {/* GLOBAL DESTINATION HUB PORTS (CYAN BEACONS) */}
          {globalDestinationPorts.map((port, idx) => (
            <g key={`dest-port-${idx}`} className="group cursor-pointer">
              <circle cx={port.x} cy={port.y} r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx={port.x} cy={port.y} r="9" fill="#38bdf8" opacity="0.2" className="animate-pulse" />
              <text x={port.x} y={port.y + 14} textAnchor="middle" className="fill-slate-300 text-[9px] font-bold font-mono">
                {port.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Selected Route Telemetry Bar */}
        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#070b14]/95 border border-slate-800 shadow-2xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl text-white shadow-xs" style={{ backgroundColor: activeR.color }}>
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white text-xs flex items-center gap-2">
                {activeR.name}
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-slate-800 text-slate-300">
                  {activeR.carrier}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                <span className="text-red-400 font-bold">{activeR.origin}</span> ➔ <span className="text-cyan-400 font-bold">{activeR.destination}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 font-mono text-xs">
            <div>
              <span className="text-slate-500 font-bold block text-[9px]">SPEED</span>
              <span className="text-cyan-400 font-extrabold">{activeR.speed}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[9px]">CAPACITY</span>
              <span className="text-emerald-400 font-extrabold">{activeR.containers}</span>
            </div>
            <button
              onClick={() => setShowInspector(true)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              Inspect Cargo
            </button>
          </div>
        </div>
      </div>

      {/* Cargo Inspector Modal */}
      {showInspector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#070b14] border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-white space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Vessel Telemetry</h3>
              </div>
              <button onClick={() => setShowInspector(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-xl bg-[#02050e] border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold text-[10px]">Vessel & Carrier</div>
                <div className="font-extrabold text-white text-xs">{activeR.vessel} ({activeR.carrier})</div>
                <div className="text-cyan-400 font-mono text-[11px]">{activeR.origin} ➔ {activeR.destination}</div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-[#02050e] border border-slate-800">
                  <div className="text-slate-400 font-bold text-[10px]">Speed</div>
                  <div className="font-extrabold text-cyan-400 font-mono text-sm">{activeR.speed}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#02050e] border border-slate-800">
                  <div className="text-slate-400 font-bold text-[10px]">Containers</div>
                  <div className="font-extrabold text-emerald-400 font-mono text-sm">{activeR.containers}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowInspector(false);
                  triggerToast(`Tracking link copied for ${activeR.vessel}!`);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white font-bold text-xs shadow-xs"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rate Finder Modal */}
      {showRateFinder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#070b14] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-white space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Freight Spot Rate Finder</h3>
              </div>
              <button onClick={() => setShowRateFinder(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Origin Port</label>
                  <input type="text" defaultValue="Shanghai (CNSHA)" className="w-full p-2 rounded-xl border border-slate-800 bg-[#02050e] text-white font-semibold outline-none" />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Destination Port</label>
                  <input type="text" defaultValue="Los Angeles (USLAX)" className="w-full p-2 rounded-xl border border-slate-800 bg-[#02050e] text-white font-semibold outline-none" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#02050e] border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-white">COSCO Ocean FCL 40ft HC</div>
                  <div className="text-[10px] text-slate-400">Guaranteed Departure • 12 Days Transit</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black font-mono text-amber-400">$2,450</div>
                  <div className="text-[10px] text-emerald-400 font-bold">Spot Rate</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowRateFinder(false);
                  triggerToast('Booked Spot Rate for $2,450!');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs shadow-xs"
              >
                Book Rate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
