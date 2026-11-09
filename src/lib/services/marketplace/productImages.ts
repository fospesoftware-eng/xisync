// ====================================================================================
// XiSync Product Image & Visual Assets Provider
// Produces 100% reliable, self-contained, high-resolution vector and graphic visuals
// for every SKU in the catalog, eliminating CORS errors and external image drops.
// ====================================================================================

function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString.trim())}`;
}

export const PRODUCT_VISUAL_ASSETS: Record<string, string[]> = {
  'INV-4000-HE': [
    // Angle 1: Hero Front - Commercial Hybrid Solar Inverter
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <defs>
          <linearGradient id="invBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="50%" stop-color="#1e293b" />
            <stop offset="100%" stop-color="#090d16" />
          </linearGradient>
          <linearGradient id="chassis" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#e2e8f0" />
            <stop offset="25%" stop-color="#f8fafc" />
            <stop offset="70%" stop-color="#cbd5e1" />
            <stop offset="100%" stop-color="#94a3b8" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0284c7" />
            <stop offset="100%" stop-color="#0369a1" />
          </linearGradient>
        </defs>
        
        <rect width="800" height="800" fill="url(#invBg)" />
        
        <!-- Tech grid background -->
        <g stroke="#334155" stroke-width="1" opacity="0.25">
          <line x1="100" y1="0" x2="100" y2="800" />
          <line x1="200" y1="0" x2="200" y2="800" />
          <line x1="300" y1="0" x2="300" y2="800" />
          <line x1="400" y1="0" x2="400" y2="800" />
          <line x1="500" y1="0" x2="500" y2="800" />
          <line x1="600" y1="0" x2="600" y2="800" />
          <line x1="700" y1="0" x2="700" y2="800" />
          <line x1="0" y1="100" x2="800" y2="100" />
          <line x1="0" y1="200" x2="800" y2="200" />
          <line x1="0" y1="300" x2="800" y2="300" />
          <line x1="0" y1="400" x2="800" y2="400" />
          <line x1="0" y1="500" x2="800" y2="500" />
          <line x1="0" y1="600" x2="800" y2="600" />
          <line x1="0" y1="700" x2="800" y2="700" />
        </g>
        
        <!-- Shadow -->
        <ellipse cx="400" cy="720" rx="260" ry="30" fill="#000000" opacity="0.7" />
        
        <!-- Main Inverter Chassis -->
        <rect x="220" y="140" width="360" height="540" rx="24" fill="url(#chassis)" stroke="#475569" stroke-width="4" />
        
        <!-- Side heat dissipation fins -->
        <g fill="#475569">
          <rect x="195" y="200" width="25" height="12" rx="4" />
          <rect x="195" y="230" width="25" height="12" rx="4" />
          <rect x="195" y="260" width="25" height="12" rx="4" />
          <rect x="195" y="290" width="25" height="12" rx="4" />
          <rect x="195" y="320" width="25" height="12" rx="4" />
          <rect x="195" y="350" width="25" height="12" rx="4" />
          <rect x="195" y="380" width="25" height="12" rx="4" />
          <rect x="195" y="410" width="25" height="12" rx="4" />
          
          <rect x="580" y="200" width="25" height="12" rx="4" />
          <rect x="580" y="230" width="25" height="12" rx="4" />
          <rect x="580" y="260" width="25" height="12" rx="4" />
          <rect x="580" y="290" width="25" height="12" rx="4" />
          <rect x="580" y="320" width="25" height="12" rx="4" />
          <rect x="580" y="350" width="25" height="12" rx="4" />
          <rect x="580" y="380" width="25" height="12" rx="4" />
          <rect x="580" y="410" width="25" height="12" rx="4" />
        </g>
        
        <!-- Upper Header Panel -->
        <rect x="240" y="160" width="320" height="70" rx="12" fill="#0f172a" />
        <text x="260" y="195" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="18" font-weight="900" letter-spacing="2">XISYNC SOLAR</text>
        <text x="260" y="215" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11" font-weight="600">5000W HYBRID INVERTER PRO</text>
        <circle cx="530" cy="195" r="8" fill="#10b981" />
        <circle cx="530" cy="195" r="14" fill="none" stroke="#10b981" stroke-width="2" opacity="0.6" />
        
        <!-- Central Color LCD Monitor -->
        <rect x="250" y="260" width="300" height="170" rx="16" fill="url(#screenGrad)" stroke="#0284c7" stroke-width="4" />
        <rect x="260" y="270" width="280" height="150" rx="10" fill="#0369a1" />
        
        <!-- LCD Metrics -->
        <text x="280" y="305" fill="#bae6fd" font-family="system-ui, monospace" font-size="13" font-weight="bold">SOLAR PV INPUT</text>
        <text x="280" y="338" fill="#ffffff" font-family="system-ui, monospace" font-size="28" font-weight="900">4,980 W</text>
        
        <text x="430" y="305" fill="#bae6fd" font-family="system-ui, monospace" font-size="13" font-weight="bold">GRID TIE</text>
        <text x="430" y="338" fill="#a7f3d0" font-family="system-ui, monospace" font-size="24" font-weight="900">230V / 50Hz</text>
        
        <line x1="280" y1="360" x2="520" y2="360" stroke="#38bdf8" stroke-width="1.5" opacity="0.4" />
        
        <text x="280" y="390" fill="#e0f2fe" font-family="system-ui, sans-serif" font-size="12" font-weight="600">MPPT EFF: 99.8% · THD &lt; 2%</text>
        <text x="435" y="390" fill="#fef08a" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">PURE SINE</text>
        
        <!-- Control buttons -->
        <g fill="#334155" stroke="#64748b" stroke-width="2">
          <circle cx="310" cy="470" r="18" />
          <circle cx="370" cy="470" r="18" />
          <circle cx="430" cy="470" r="18" />
          <circle cx="490" cy="470" r="18" />
        </g>
        <text x="303" y="475" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">ESC</text>
        <text x="364" y="475" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">▲</text>
        <text x="424" y="475" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">▼</text>
        <text x="480" y="475" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">ENT</text>
        
        <!-- Lower Connection Terminals -->
        <rect x="250" y="520" width="300" height="130" rx="14" fill="#1e293b" />
        <rect x="270" y="545" width="45" height="70" rx="8" fill="#0f172a" stroke="#dc2626" stroke-width="2" />
        <text x="277" y="585" fill="#f87171" font-family="system-ui, sans-serif" font-size="12" font-weight="900">PV +</text>
        
        <rect x="330" y="545" width="45" height="70" rx="8" fill="#0f172a" stroke="#475569" stroke-width="2" />
        <text x="340" y="585" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12" font-weight="900">PV -</text>
        
        <rect x="395" y="545" width="60" height="70" rx="8" fill="#0f172a" stroke="#3b82f6" stroke-width="2" />
        <text x="403" y="585" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="12" font-weight="900">BATTERY</text>
        
        <rect x="470" y="545" width="60" height="70" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2" />
        <text x="483" y="585" fill="#34d399" font-family="system-ui, sans-serif" font-size="12" font-weight="900">AC OUT</text>
        
        <!-- Quality Badges -->
        <g transform="translate(60, 680)">
          <rect width="180" height="34" rx="8" fill="#1e293b" stroke="#334155" />
          <text x="12" y="22" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">✓ CE / TUV / ISO9001</text>
        </g>
        
        <g transform="translate(560, 680)">
          <rect width="180" height="34" rx="8" fill="#1e293b" stroke="#334155" />
          <text x="15" y="22" fill="#10b981" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">FOB $1,250 · MOQ 1</text>
        </g>
      </svg>
    `),
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <rect width="800" height="800" fill="#0c4a6e" />
        <circle cx="400" cy="400" r="300" fill="#0369a1" />
        <text x="400" y="380" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="32" font-weight="900">SOLAR ARRAY FIELD</text>
        <text x="400" y="430" text-anchor="middle" fill="#bae6fd" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">Commercial Installation View</text>
      </svg>
    `),
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <rect width="800" height="800" fill="#1e1b4b" />
        <rect x="200" y="200" width="400" height="400" rx="20" fill="#312e81" stroke="#6366f1" stroke-width="4" />
        <text x="400" y="380" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="900">INTERNAL MPPT CIRCUIT</text>
        <text x="400" y="420" text-anchor="middle" fill="#c7d2fe" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">Pure Sine Wave Engineering</text>
      </svg>
    `),
  ],

  'PV-BOX-2026': [
    // Angle 1: Hero Front - IP68 Waterproof PV Junction Box
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <defs>
          <linearGradient id="pvBoxBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#090d16" />
            <stop offset="100%" stop-color="#1e293b" />
          </linearGradient>
          <linearGradient id="boxBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#334155" />
            <stop offset="50%" stop-color="#1e293b" />
            <stop offset="100%" stop-color="#0f172a" />
          </linearGradient>
          <linearGradient id="glandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#475569" />
            <stop offset="50%" stop-color="#64748b" />
            <stop offset="100%" stop-color="#334155" />
          </linearGradient>
        </defs>
        
        <rect width="800" height="800" fill="url(#pvBoxBg)" />
        
        <!-- Shadow -->
        <ellipse cx="400" cy="680" rx="280" ry="36" fill="#000000" opacity="0.8" />
        
        <!-- Waterproof Cable Glands on Top -->
        <g fill="url(#glandGrad)" stroke="#0f172a" stroke-width="2">
          <rect x="290" y="150" width="40" height="70" rx="6" />
          <rect x="470" y="150" width="40" height="70" rx="6" />
          <rect x="302" y="80" width="16" height="80" rx="8" fill="#dc2626" />
          <rect x="482" y="80" width="16" height="80" rx="8" fill="#1e293b" stroke="#475569" />
        </g>
        
        <!-- Main Junction Box Enclosure -->
        <rect x="200" y="200" width="400" height="420" rx="32" fill="url(#boxBody)" stroke="#475569" stroke-width="5" />
        
        <!-- Sealing Gasket Groove -->
        <rect x="220" y="220" width="360" height="380" rx="24" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-dasharray="10 5" opacity="0.8" />
        
        <!-- Laser Engraved Specs Center Plate -->
        <rect x="260" y="270" width="280" height="280" rx="16" fill="#090d16" stroke="#1e293b" stroke-width="2" />
        
        <text x="400" y="320" text-anchor="middle" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="20" font-weight="900" letter-spacing="3">IP68 PV JUNCTION BOX</text>
        <text x="400" y="348" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">MODEL: PV-BOX-2026 · 1000V / 30A</text>
        
        <!-- Diode Heat Sink Graphic -->
        <g transform="translate(300, 380)" fill="#475569">
          <rect x="0" y="0" width="200" height="50" rx="8" fill="#1e293b" stroke="#334155" />
          <line x1="20" y1="25" x2="180" y2="25" stroke="#f59e0b" stroke-width="3" />
          <polygon points="60,15 60,35 80,25" fill="#f59e0b" />
          <line x1="80" y1="15" x2="80" y2="35" stroke="#f59e0b" stroke-width="3" />
          <polygon points="120,15 120,35 140,25" fill="#f59e0b" />
          <line x1="140" y1="15" x2="140" y2="35" stroke="#f59e0b" stroke-width="3" />
        </g>
        
        <text x="400" y="470" text-anchor="middle" fill="#34d399" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">✓ US SECTION 301 TARIFF EXEMPT</text>
        <text x="400" y="495" text-anchor="middle" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11" font-weight="600">TUV Rheinland · UL 3730 · RoHS Certified</text>
        <text x="400" y="525" text-anchor="middle" fill="#38bdf8" font-family="system-ui, monospace" font-size="15" font-weight="900">CONTAINER MOQ: 1,000 PCS · $6.80/PC</text>
      </svg>
    `),
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <rect width="800" height="800" fill="#064e3b" />
        <circle cx="400" cy="400" r="280" fill="#047857" />
        <text x="400" y="380" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="32" font-weight="900">IP68 WATER SUBMERSION</text>
        <text x="400" y="430" text-anchor="middle" fill="#a7f3d0" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">100% Laboratory Tested &amp; Certified</text>
      </svg>
    `),
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <rect width="800" height="800" fill="#1e293b" />
        <rect x="200" y="200" width="400" height="400" rx="20" fill="#334155" stroke="#94a3b8" stroke-width="4" />
        <text x="400" y="380" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="900">BULK CONTAINER PACK</text>
        <text x="400" y="420" text-anchor="middle" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">Palletized Export Packaging</text>
      </svg>
    `),
  ],

  'LED-8800-HC': [
    // Angle 1: Ultra-Thin Smart Industrial LED Panel
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <defs>
          <linearGradient id="ledBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#090d16" />
            <stop offset="100%" stop-color="#1e293b" />
          </linearGradient>
          <linearGradient id="panelGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="50%" stop-color="#f8fafc" />
            <stop offset="100%" stop-color="#e0f2fe" />
          </linearGradient>
        </defs>
        
        <rect width="800" height="800" fill="url(#ledBg)" />
        
        <!-- Shadow -->
        <ellipse cx="400" cy="710" rx="300" ry="30" fill="#000000" opacity="0.9" />
        
        <!-- Outer Aluminum Frame -->
        <rect x="140" y="160" width="520" height="420" rx="18" fill="#334155" stroke="#94a3b8" stroke-width="4" />
        
        <!-- Luminous Panel Face -->
        <rect x="155" y="175" width="490" height="390" rx="10" fill="url(#panelGlow)" />
        
        <!-- Corner Smart Microwave Occupancy Sensor -->
        <circle cx="610" cy="210" r="14" fill="#0284c7" stroke="#ffffff" stroke-width="2" />
        <circle cx="610" cy="210" r="6" fill="#38bdf8" />
        
        <!-- Overlay Spec Graphic -->
        <g transform="translate(180, 240)">
          <rect width="440" height="260" rx="14" fill="#0f172a" opacity="0.9" />
          <text x="220" y="45" text-anchor="middle" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="20" font-weight="900">SMART INDUSTRIAL LED PANEL</text>
          <text x="220" y="75" text-anchor="middle" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">SKU: LED-8800-HC · 0.9m ULTRA-THIN 9mm</text>
          
          <line x1="40" y1="95" x2="400" y2="95" stroke="#334155" stroke-width="1.5" />
          
          <text x="60" y="130" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="900">⚡ 160 LM/W HIGH EFFICACY</text>
          <text x="60" y="160" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="900">📡 SMART RADAR OCCUPANCY SENSOR</text>
          <text x="60" y="190" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="900">🚢 40FT CONTAINER PALLET PACK</text>
          
          <text x="220" y="235" text-anchor="middle" fill="#4ade80" font-family="system-ui, monospace" font-size="16" font-weight="900">FOB $42.50 / UNIT · MOQ 200 UNITS</text>
        </g>
      </svg>
    `),
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <rect width="800" height="800" fill="#1e1b4b" />
        <circle cx="400" cy="400" r="280" fill="#312e81" />
        <text x="400" y="380" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="32" font-weight="900">WAREHOUSE HIGH-BAY VIEW</text>
        <text x="400" y="430" text-anchor="middle" fill="#c7d2fe" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">Commercial Illumination Demo</text>
      </svg>
    `),
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <rect width="800" height="800" fill="#0f172a" />
        <rect x="200" y="200" width="400" height="400" rx="20" fill="#1e293b" stroke="#38bdf8" stroke-width="4" />
        <text x="400" y="380" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="900">CONTAINER PACKAGING</text>
        <text x="400" y="420" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">40ft High Cube Container Pack</text>
      </svg>
    `),
  ],

  'TR-9900-MX': [
    // Angle 1: Precision Micro-Transformer Assembly
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <defs>
          <linearGradient id="trBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#090d16" />
            <stop offset="100%" stop-color="#1e293b" />
          </linearGradient>
          <linearGradient id="copper" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#b45309" />
            <stop offset="30%" stop-color="#d97706" />
            <stop offset="70%" stop-color="#f59e0b" />
            <stop offset="100%" stop-color="#92400e" />
          </linearGradient>
        </defs>
        
        <rect width="800" height="800" fill="url(#trBg)" />
        
        <!-- Toroidal Transformer Shape -->
        <ellipse cx="400" cy="400" rx="220" ry="220" fill="#1e293b" stroke="url(#copper)" stroke-width="50" />
        <ellipse cx="400" cy="400" rx="100" ry="100" fill="#0f172a" stroke="#475569" stroke-width="8" />
        
        <!-- Info Card -->
        <g transform="translate(180, 270)">
          <rect width="440" height="260" rx="16" fill="#0f172a" opacity="0.92" stroke="#334155" stroke-width="2" />
          <text x="220" y="45" text-anchor="middle" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="20" font-weight="900">PRECISION MICRO-TRANSFORMER</text>
          <text x="220" y="75" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">SKU: TR-9900-MX · SMT TOROIDAL CORE</text>
          
          <line x1="40" y1="95" x2="400" y2="95" stroke="#334155" stroke-width="1.5" />
          
          <text x="60" y="130" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">⚡ 0.5-3W RATING · RoHS/REACH COMPLIANT</text>
          <text x="60" y="160" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">🏭 DEDICATED ASSEMBLY LINE #3 CAPACITY</text>
          <text x="60" y="190" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">📦 SMT TAPE &amp; REEL PACKAGING</text>
          
          <text x="220" y="235" text-anchor="middle" fill="#4ade80" font-family="system-ui, monospace" font-size="16" font-weight="900">FOB $18.20 / UNIT · MOQ 1,000</text>
        </g>
      </svg>
    `),
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <rect width="800" height="800" fill="#064e3b" />
        <text x="400" y="400" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="32" font-weight="900">SMT ROBOTIC LINE #3</text>
      </svg>
    `),
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <rect width="800" height="800" fill="#1e293b" />
        <text x="400" y="400" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="32" font-weight="900">TOROIDAL COIL CLOSEUP</text>
      </svg>
    `),
  ],

  'VAL-X900-HYD': [
    // Angle 1: Industrial Hydraulic Valve Assembly X-900
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <defs>
          <linearGradient id="valBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#090d16" />
            <stop offset="100%" stop-color="#1e293b" />
          </linearGradient>
          <linearGradient id="steel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#64748b" />
            <stop offset="50%" stop-color="#94a3b8" />
            <stop offset="100%" stop-color="#475569" />
          </linearGradient>
        </defs>
        
        <rect width="800" height="800" fill="url(#valBg)" />
        
        <!-- Hydraulic Manifold Block -->
        <rect x="200" y="200" width="400" height="400" rx="20" fill="url(#steel)" stroke="#cbd5e1" stroke-width="4" />
        
        <!-- Valve Ports -->
        <circle cx="280" cy="280" r="36" fill="#0f172a" stroke="#334155" stroke-width="4" />
        <circle cx="520" cy="280" r="36" fill="#0f172a" stroke="#334155" stroke-width="4" />
        <circle cx="280" cy="520" r="36" fill="#0f172a" stroke="#334155" stroke-width="4" />
        <circle cx="520" cy="520" r="36" fill="#0f172a" stroke="#334155" stroke-width="4" />
        
        <!-- Central Dial Gauge -->
        <circle cx="400" cy="400" r="70" fill="#0f172a" stroke="#38bdf8" stroke-width="6" />
        <text x="400" y="380" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">PRESSURE</text>
        <text x="400" y="415" text-anchor="middle" fill="#38bdf8" font-family="system-ui, monospace" font-size="24" font-weight="900">350 BAR</text>
        
        <!-- Spec Card Overlay -->
        <g transform="translate(180, 620)">
          <rect width="440" height="80" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2" />
          <text x="220" y="32" text-anchor="middle" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">HYDRAULIC VALVE X-900 · HARDENED SPOOL</text>
          <text x="220" y="60" text-anchor="middle" fill="#4ade80" font-family="system-ui, monospace" font-size="16" font-weight="900">FOB $450.00 · MOQ 50 UNITS · 12M WARRANTY</text>
        </g>
      </svg>
    `),
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <rect width="800" height="800" fill="#1e293b" />
        <text x="400" y="400" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="32" font-weight="900">CNC STEEL MANIFOLD</text>
      </svg>
    `),
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <rect width="800" height="800" fill="#0f172a" />
        <text x="400" y="400" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="32" font-weight="900">PRESSURE TEST BENCH</text>
      </svg>
    `),
  ],

  'CF-3K-CARBON': [
    // Angle 1: High-Tensile Carbon Fiber Fabric 3K Roll
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <defs>
          <pattern id="carbonTwill" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="#1e293b" />
            <rect x="10" width="10" height="10" fill="#0f172a" />
            <rect y="10" width="10" height="10" fill="#0f172a" />
            <rect x="10" y="10" width="10" height="10" fill="#334155" />
          </pattern>
        </defs>
        
        <rect width="800" height="800" fill="url(#carbonTwill)" />
        <rect width="800" height="800" fill="#000000" opacity="0.4" />
        
        <!-- Central Spec Container -->
        <g transform="translate(180, 260)">
          <rect width="440" height="280" rx="16" fill="#0f172a" opacity="0.95" stroke="#475569" stroke-width="2" />
          <text x="220" y="48" text-anchor="middle" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="20" font-weight="900">CARBON FIBER FABRIC 3K</text>
          <text x="220" y="78" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">SKU: CF-3K-CARBON · 200g/m² TWILL WEAVE</text>
          
          <line x1="40" y1="100" x2="400" y2="100" stroke="#334155" stroke-width="1.5" />
          
          <text x="60" y="138" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">✈️ AEROSPACE &amp; STRUCTURAL GRADE</text>
          <text x="60" y="170" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">🔬 ISO9001 &amp; SGS TESTED QUALITY</text>
          <text x="60" y="202" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">📦 100m MASTER EXPORT ROLLS</text>
          
          <text x="220" y="250" text-anchor="middle" fill="#4ade80" font-family="system-ui, monospace" font-size="16" font-weight="900">FOB $120.00 / ROLL · MOQ 20 ROLLS</text>
        </g>
      </svg>
    `),
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <rect width="800" height="800" fill="#0f172a" />
        <text x="400" y="400" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="32" font-weight="900">3K WEAVE TEXTURE CLOSEUP</text>
      </svg>
    `),
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <rect width="800" height="800" fill="#1e293b" />
        <text x="400" y="400" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="32" font-weight="900">EXPORT MASTER ROLL</text>
      </svg>
    `),
  ],

  'SNS-8800-IOT': [
    // Angle 1: Smart IoT Precision Sensor Array v4
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <defs>
          <linearGradient id="iotBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#090d16" />
            <stop offset="100%" stop-color="#1e293b" />
          </linearGradient>
        </defs>
        
        <rect width="800" height="800" fill="url(#iotBg)" />
        
        <!-- Enclosure -->
        <rect x="220" y="220" width="360" height="380" rx="28" fill="#1e293b" stroke="#38bdf8" stroke-width="4" />
        
        <!-- Antenna -->
        <rect x="385" y="100" width="30" height="120" rx="6" fill="#334155" stroke="#0ea5e9" stroke-width="2" />
        <circle cx="400" cy="95" r="14" fill="#0284c7" />
        
        <!-- Digital OLED display -->
        <rect x="260" y="270" width="280" height="160" rx="12" fill="#0f172a" stroke="#0ea5e9" stroke-width="2" />
        <text x="280" y="310" fill="#38bdf8" font-family="system-ui, monospace" font-size="14" font-weight="bold">IOT TELEMETRY v4</text>
        <text x="280" y="345" fill="#4ade80" font-family="system-ui, monospace" font-size="22" font-weight="900">TEMP: 24.2°C</text>
        <text x="280" y="380" fill="#a5f3fc" font-family="system-ui, monospace" font-size="16" font-weight="bold">HUMIDITY: 48.6% RH</text>
        <text x="280" y="410" fill="#facc15" font-family="system-ui, monospace" font-size="13" font-weight="bold">📡 LoRaWAN / 4G CONNECTED</text>
        
        <!-- Spec Card Overlay -->
        <g transform="translate(180, 470)">
          <rect width="440" height="180" rx="14" fill="#0f172a" opacity="0.95" stroke="#334155" stroke-width="2" />
          <text x="220" y="40" text-anchor="middle" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="18" font-weight="900">SMART IOT PRECISION SENSOR</text>
          <text x="220" y="70" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">SKU: SNS-8800-IOT · IP67 ENCLOSURE</text>
          <text x="220" y="105" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">CE / FCC / RoHS CERTIFIED · CUSTOM FIRMWARE</text>
          <text x="220" y="145" text-anchor="middle" fill="#4ade80" font-family="system-ui, monospace" font-size="16" font-weight="900">FOB $85.00 · MOQ 100 UNITS</text>
        </g>
      </svg>
    `),
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <rect width="800" height="800" fill="#064e3b" />
        <text x="400" y="400" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="32" font-weight="900">PCB SENSOR CHIP</text>
      </svg>
    `),
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <rect width="800" height="800" fill="#0f172a" />
        <text x="400" y="400" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="32" font-weight="900">TELEMETRY GATEWAY</text>
      </svg>
    `),
  ],
};

export function getProductImages(sku: string): string[] {
  return PRODUCT_VISUAL_ASSETS[sku] || [
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <rect width="800" height="800" fill="#0f172a" />
        <circle cx="400" cy="360" r="140" fill="#1e293b" stroke="#38bdf8" stroke-width="6" />
        <text x="400" y="380" text-anchor="middle" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="32" font-weight="900">${sku}</text>
        <text x="400" y="560" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">XISYNC EXPORT CATALOG PRODUCT</text>
      </svg>
    `),
  ];
}
