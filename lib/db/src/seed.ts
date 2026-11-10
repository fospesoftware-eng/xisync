import { createHash } from 'node:crypto';
import {
  accountsTable,
  cmsPagesTable,
  cmsSectionsTable,
  contactsTable,
  conversationsTable,
  db,
  dealsTable,
  leadsTable,
  messagesTable,
  pool,
  profilesTable,
  shipmentsTable,
  tenantsTable,
  usersTable,
} from './index';

/**
 * Demo data for XiSync. Every row uses a deterministic UUID derived from its
 * seed key, so re-running the seed updates the same rows instead of creating
 * duplicates. Nothing outside the demo keys is touched.
 */

function uuid(key: string): string {
  const hex = createHash('sha256').update(`xisync-demo:${key}`).digest('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

function day(offset: number, hour = 9): Date {
  const date = new Date();
  date.setUTCHours(hour, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offset);
  return date;
}

async function upsert(table: any, rows: any[]): Promise<void> {
  for (const row of rows) {
    await db.insert(table).values(row).onConflictDoUpdate({ target: table.id, set: row });
  }
}

const T = {
  lumen: uuid('tenant:lumen'),
  harbor: uuid('tenant:harborline'),
  vantage: uuid('tenant:vantage'),
};

const U = {
  wei: uuid('user:wei-zhang'),
  mei: uuid('user:mei-lin'),
  lena: uuid('contact:lumen:lena'),
  daniel: uuid('user:daniel-wu'),
  aisha: uuid('user:aisha-rahman'),
};

const A = {
  nordline: uuid('account:lumen:nordline'),
  pacific: uuid('account:lumen:pacific'),
  alfaisal: uuid('account:lumen:alfaisal'),
  maple: uuid('account:lumen:maple'),
  casa: uuid('account:lumen:casa'),
  brightware: uuid('account:lumen:brightware'),
  foshan: uuid('account:lumen:foshan'),
  eurotools: uuid('account:harbor:eurotools'),
  gulfmarine: uuid('account:harbor:gulfmarine'),
  qingdao: uuid('account:harbor:qingdao'),
  santiago: uuid('account:harbor:santiago'),
  brightcart: uuid('account:vantage:brightcart'),
  nusantara: uuid('account:vantage:nusantara'),
  dongguan: uuid('account:vantage:dongguan'),
};

const C = {
  lena: U.lena,
  jonas: uuid('contact:lumen:jonas'),
  grace: uuid('contact:lumen:grace'),
  reyes: uuid('contact:lumen:reyes'),
  omar: uuid('contact:lumen:omar'),
  priya: uuid('contact:lumen:priya'),
  emily: uuid('contact:lumen:emily'),
  mariana: uuid('contact:lumen:mariana'),
  huang: uuid('contact:lumen:huang'),
  li: uuid('contact:lumen:li'),
  sophie: uuid('contact:harbor:sophie'),
  milan: uuid('contact:harbor:milan'),
  rashid: uuid('contact:harbor:rashid'),
  wang: uuid('contact:harbor:wang'),
  camila: uuid('contact:harbor:camila'),
  oliver: uuid('contact:vantage:oliver'),
  dewi: uuid('contact:vantage:dewi'),
  chen: uuid('contact:vantage:chen'),
};

const CONV = {
  nordline: uuid('conversation:lumen:nordline'),
  pacific: uuid('conversation:lumen:pacific'),
  alfaisal: uuid('conversation:lumen:alfaisal'),
  maple: uuid('conversation:lumen:maple'),
  casa: uuid('conversation:lumen:casa'),
  eurotools: uuid('conversation:harbor:eurotools'),
  gulfmarine: uuid('conversation:harbor:gulfmarine'),
  santiago: uuid('conversation:harbor:santiago'),
  brightcart: uuid('conversation:vantage:brightcart'),
  nusantara: uuid('conversation:vantage:nusantara'),
};

const PAGE = {
  home: uuid('page:lumen:home'),
  about: uuid('page:lumen:about'),
  products: uuid('page:lumen:products'),
  contact: uuid('page:lumen:contact'),
  harborHome: uuid('page:harbor:home'),
  harborProducts: uuid('page:harbor:products'),
};

async function seed(): Promise<void> {
  // ---------------------------------------------------------------- tenants
  await upsert(tenantsTable, [
    {
      id: T.lumen,
      name: 'Lumen Trading Co., Ltd.',
      nameCn: '上海流明贸易有限公司',
      slug: 'lumen-trading',
      industry: 'Consumer Electronics & Home Goods',
      region: 'Shanghai, East China',
      timezone: 'Asia/Shanghai',
      currency: 'USD',
      defaultLanguage: 'zh',
      logoUrl: 'https://cdn.xisync.app/logos/lumen-trading.svg',
      status: 'active',
      plan: 'growth',
      settings: {
        brandColor: '#0f766e',
        onboardingComplete: true,
        aiLanguages: ['zh', 'en', 'es'],
        exportMarkets: ['EU', 'US', 'MENA', 'LATAM'],
        defaultIncoterm: 'FOB',
      },
      trialEndsAt: day(240),
      createdAt: day(-540),
      updatedAt: day(-2),
    },
    {
      id: T.harbor,
      name: 'Harborline Export Group',
      nameCn: '宁波海线出口集团',
      slug: 'harborline-export',
      industry: 'Industrial Hardware & Tools',
      region: 'Ningbo, Zhejiang',
      timezone: 'Asia/Shanghai',
      currency: 'USD',
      defaultLanguage: 'zh',
      logoUrl: 'https://cdn.xisync.app/logos/harborline-export.svg',
      status: 'active',
      plan: 'scale',
      settings: {
        brandColor: '#1d4ed8',
        onboardingComplete: true,
        aiLanguages: ['zh', 'en'],
        exportMarkets: ['EU', 'MENA', 'LATAM'],
        defaultIncoterm: 'FOB',
      },
      trialEndsAt: day(180),
      createdAt: day(-720),
      updatedAt: day(-1),
    },
    {
      id: T.vantage,
      name: 'Vantage Shenzhen Electronics',
      nameCn: '深圳华观电子有限公司',
      slug: 'vantage-electronics',
      industry: 'Consumer Electronics',
      region: 'Shenzhen, Guangdong',
      timezone: 'Asia/Shanghai',
      currency: 'USD',
      defaultLanguage: 'en',
      logoUrl: 'https://cdn.xisync.app/logos/vantage-electronics.svg',
      status: 'trial',
      plan: 'trial',
      settings: {
        brandColor: '#0ea5e9',
        onboardingComplete: false,
        aiLanguages: ['en', 'zh'],
        exportMarkets: ['UK', 'SEA'],
        defaultIncoterm: 'EXW',
      },
      trialEndsAt: day(9),
      createdAt: day(-40),
      updatedAt: day(-3),
    },
  ]);

  // ------------------------------------------------------------------ users
  await upsert(usersTable, [
    {
      id: U.wei,
      email: 'wei.zhang@lumentrading.com',
      firstName: 'Wei',
      lastName: 'Zhang',
      profileImageUrl: 'https://cdn.xisync.app/avatars/wei-zhang.jpg',
      createdAt: day(-540),
      updatedAt: day(-2),
    },
    {
      id: U.mei,
      email: 'mei.lin@lumentrading.com',
      firstName: 'Mei',
      lastName: 'Lin',
      profileImageUrl: 'https://cdn.xisync.app/avatars/mei-lin.jpg',
      createdAt: day(-430),
      updatedAt: day(-4),
    },
    {
      id: U.lena,
      email: 'lena.hoffmann@nordline-retail.de',
      firstName: 'Lena',
      lastName: 'Hoffmann',
      profileImageUrl: 'https://cdn.xisync.app/avatars/lena-hoffmann.jpg',
      createdAt: day(-210),
      updatedAt: day(0),
    },
    {
      id: U.daniel,
      email: 'daniel.wu@harborline-export.com',
      firstName: 'Daniel',
      lastName: 'Wu',
      profileImageUrl: 'https://cdn.xisync.app/avatars/daniel-wu.jpg',
      createdAt: day(-690),
      updatedAt: day(-1),
    },
    {
      id: U.aisha,
      email: 'aisha.rahman@vantage-electronics.com',
      firstName: 'Aisha',
      lastName: 'Rahman',
      profileImageUrl: 'https://cdn.xisync.app/avatars/aisha-rahman.jpg',
      createdAt: day(-40),
      updatedAt: day(-3),
    },
  ]);

  // --------------------------------------------------------------- profiles
  await upsert(profilesTable, [
    {
      id: U.wei,
      tenantId: T.lumen,
      fullName: 'Wei Zhang',
      fullNameCn: '张伟',
      role: 'admin',
      avatarUrl: 'https://cdn.xisync.app/avatars/wei-zhang.jpg',
      phone: '+86 21 6888 1201',
      language: 'zh',
      isActive: true,
      settings: { notificationEmail: true, sidebarCollapsed: false, calendarSync: 'google' },
      createdAt: day(-540),
      updatedAt: day(-2),
    },
    {
      id: U.mei,
      tenantId: T.lumen,
      fullName: 'Mei Lin',
      fullNameCn: '林梅',
      role: 'manager',
      avatarUrl: 'https://cdn.xisync.app/avatars/mei-lin.jpg',
      phone: '+86 21 6888 1207',
      language: 'zh',
      isActive: true,
      settings: { notificationEmail: true, sidebarCollapsed: true, calendarSync: null },
      createdAt: day(-430),
      updatedAt: day(-4),
    },
    {
      id: U.lena,
      tenantId: T.lumen,
      fullName: 'Lena Hoffmann',
      fullNameCn: '莉娜·霍夫曼',
      role: 'customer',
      avatarUrl: 'https://cdn.xisync.app/avatars/lena-hoffmann.jpg',
      phone: '+49 40 5566 2201',
      language: 'en',
      isActive: true,
      settings: { portalTourComplete: true, preferredCurrency: 'EUR' },
      createdAt: day(-210),
      updatedAt: day(0),
    },
    {
      id: U.daniel,
      tenantId: T.harbor,
      fullName: 'Daniel Wu',
      fullNameCn: '吴丹',
      role: 'admin',
      avatarUrl: 'https://cdn.xisync.app/avatars/daniel-wu.jpg',
      phone: '+86 574 8700 3312',
      language: 'zh',
      isActive: true,
      settings: { notificationEmail: true, sidebarCollapsed: false, calendarSync: 'outlook' },
      createdAt: day(-690),
      updatedAt: day(-1),
    },
    {
      id: U.aisha,
      tenantId: T.vantage,
      fullName: 'Aisha Rahman',
      fullNameCn: '艾莎·拉赫曼',
      role: 'admin',
      avatarUrl: 'https://cdn.xisync.app/avatars/aisha-rahman.jpg',
      phone: '+86 755 2299 4410',
      language: 'en',
      isActive: true,
      settings: { notificationEmail: true, sidebarCollapsed: false, onboardingStep: 'invite-team' },
      createdAt: day(-40),
      updatedAt: day(-3),
    },
  ]);

  // --------------------------------------------------------------- accounts
  await upsert(accountsTable, [
    {
      id: A.nordline,
      tenantId: T.lumen,
      name: 'Nordline Retail GmbH',
      nameCn: '德国北线零售有限公司',
      type: 'customer',
      industry: 'Home & Kitchen Retail',
      website: 'https://www.nordline-retail.de',
      country: 'Germany',
      city: 'Hamburg',
      status: 'active',
      createdAt: day(-420),
      updatedAt: day(-2),
    },
    {
      id: A.pacific,
      tenantId: T.lumen,
      name: 'Pacific Home Depot LLC',
      nameCn: '美国太平洋家居进口商',
      type: 'customer',
      industry: 'Home Improvement Retail',
      website: 'https://pacifichomedepot.com',
      country: 'United States',
      city: 'Los Angeles',
      status: 'active',
      createdAt: day(-380),
      updatedAt: day(-5),
    },
    {
      id: A.alfaisal,
      tenantId: T.lumen,
      name: 'Al Faisal Trading LLC',
      nameCn: '阿尔法萨尔贸易公司',
      type: 'customer',
      industry: 'General Trading & Distribution',
      website: 'https://alfaisaltrading.ae',
      country: 'United Arab Emirates',
      city: 'Dubai',
      status: 'active',
      createdAt: day(-260),
      updatedAt: day(-3),
    },
    {
      id: A.maple,
      tenantId: T.lumen,
      name: 'Maple & Co. Imports',
      nameCn: '枫叶进口公司',
      type: 'customer',
      industry: 'Seasonal Decor & Gifts',
      website: 'https://maplecoimports.ca',
      country: 'Canada',
      city: 'Toronto',
      status: 'prospect',
      createdAt: day(-95),
      updatedAt: day(-5),
    },
    {
      id: A.casa,
      tenantId: T.lumen,
      name: 'Casa & Co. Importadora Ltda',
      nameCn: '卡萨进口有限公司',
      type: 'customer',
      industry: 'Housewares Import & Distribution',
      website: 'https://casaeco.com.br',
      country: 'Brazil',
      city: 'São Paulo',
      status: 'active',
      createdAt: day(-150),
      updatedAt: day(-11),
    },
    {
      id: A.brightware,
      tenantId: T.lumen,
      name: 'Ningbo Brightware Manufacturing',
      nameCn: '宁波明亮制品厂',
      type: 'supplier',
      industry: 'Stainless Steel Kitchenware',
      website: 'https://brightware.cn',
      country: 'China',
      city: 'Ningbo',
      status: 'active',
      createdAt: day(-520),
      updatedAt: day(-8),
    },
    {
      id: A.foshan,
      tenantId: T.lumen,
      name: 'Foshan Ceramic Works',
      nameCn: '佛山陶瓷工厂',
      type: 'supplier',
      industry: 'Ceramic Tableware',
      website: 'https://foshan-ceramic.cn',
      country: 'China',
      city: 'Foshan',
      status: 'active',
      createdAt: day(-480),
      updatedAt: day(-6),
    },
    {
      id: A.eurotools,
      tenantId: T.harbor,
      name: 'EuroTools Distribution BV',
      nameCn: '欧洲工具分销公司',
      type: 'customer',
      industry: 'Industrial Tools Wholesale',
      website: 'https://eurotools.nl',
      country: 'Netherlands',
      city: 'Rotterdam',
      status: 'active',
      createdAt: day(-610),
      updatedAt: day(-2),
    },
    {
      id: A.gulfmarine,
      tenantId: T.harbor,
      name: 'Gulf Marine Supply FZE',
      nameCn: '海湾船舶用品公司',
      type: 'customer',
      industry: 'Marine Hardware',
      website: 'https://gulfmarinesupply.ae',
      country: 'United Arab Emirates',
      city: 'Sharjah',
      status: 'active',
      createdAt: day(-330),
      updatedAt: day(-4),
    },
    {
      id: A.qingdao,
      tenantId: T.harbor,
      name: 'Qingdao Fastener Group',
      nameCn: '青岛紧固件集团',
      type: 'supplier',
      industry: 'Fasteners & Fittings',
      website: 'https://qingdao-fastener.cn',
      country: 'China',
      city: 'Qingdao',
      status: 'active',
      createdAt: day(-700),
      updatedAt: day(-9),
    },
    {
      id: A.santiago,
      tenantId: T.harbor,
      name: 'Santiago Industrial SpA',
      nameCn: '圣地亚哥工业公司',
      type: 'customer',
      industry: 'Mining & Construction Supplies',
      website: 'https://santiagoid.cl',
      country: 'Chile',
      city: 'Santiago',
      status: 'active',
      createdAt: day(-180),
      updatedAt: day(-7),
    },
    {
      id: A.brightcart,
      tenantId: T.vantage,
      name: 'BrightCart Online Ltd',
      nameCn: '光明购物在线有限公司',
      type: 'customer',
      industry: 'E-commerce Electronics',
      website: 'https://brightcart.co.uk',
      country: 'United Kingdom',
      city: 'London',
      status: 'active',
      createdAt: day(-36),
      updatedAt: day(-1),
    },
    {
      id: A.nusantara,
      tenantId: T.vantage,
      name: 'Nusantara Digital PT',
      nameCn: '努山塔拉数字公司',
      type: 'customer',
      industry: 'Consumer Electronics Distribution',
      website: 'https://nusantaradigital.id',
      country: 'Indonesia',
      city: 'Jakarta',
      status: 'active',
      createdAt: day(-28),
      updatedAt: day(-3),
    },
    {
      id: A.dongguan,
      tenantId: T.vantage,
      name: 'Dongguan Circuit Boards Co.',
      nameCn: '东莞电路板有限公司',
      type: 'supplier',
      industry: 'PCB Assembly',
      website: 'https://dg-circuit.cn',
      country: 'China',
      city: 'Dongguan',
      status: 'active',
      createdAt: day(-38),
      updatedAt: day(-6),
    },
  ]);

  // --------------------------------------------------------------- contacts
  await upsert(contactsTable, [
    { id: C.lena, tenantId: T.lumen, accountId: A.nordline, firstName: 'Lena', lastName: 'Hoffmann', email: 'lena.hoffmann@nordline-retail.de', phone: '+49 40 5566 2201', status: 'active', createdAt: day(-210), updatedAt: day(0) },
    { id: C.jonas, tenantId: T.lumen, accountId: A.nordline, firstName: 'Jonas', lastName: 'Weber', email: 'jonas.weber@nordline-retail.de', phone: '+49 40 5566 2214', status: 'active', createdAt: day(-190), updatedAt: day(-6) },
    { id: C.grace, tenantId: T.lumen, accountId: A.pacific, firstName: 'Grace', lastName: 'Chen', email: 'grace.chen@pacifichomedepot.com', phone: '+1 213 555 0182', status: 'active', createdAt: day(-175), updatedAt: day(-1) },
    { id: C.reyes, tenantId: T.lumen, accountId: A.pacific, firstName: 'Daniel', lastName: 'Reyes', email: 'daniel.reyes@pacifichomedepot.com', phone: '+1 213 555 0199', status: 'active', createdAt: day(-175), updatedAt: day(-12) },
    { id: C.omar, tenantId: T.lumen, accountId: A.alfaisal, firstName: 'Omar', lastName: 'Al Faisal', email: 'omar@alfaisaltrading.ae', phone: '+971 4 355 8820', status: 'active', createdAt: day(-150), updatedAt: day(-2) },
    { id: C.priya, tenantId: T.lumen, accountId: A.alfaisal, firstName: 'Priya', lastName: 'Nair', email: 'priya@alfaisaltrading.ae', phone: '+971 4 355 8831', status: 'active', createdAt: day(-140), updatedAt: day(-4) },
    { id: C.emily, tenantId: T.lumen, accountId: A.maple, firstName: 'Emily', lastName: 'Tremblay', email: 'emily@maplecoimports.ca', phone: '+1 416 555 0144', status: 'active', createdAt: day(-95), updatedAt: day(-5) },
    { id: C.mariana, tenantId: T.lumen, accountId: A.casa, firstName: 'Mariana', lastName: 'Silva', email: 'mariana@casaeco.com.br', phone: '+55 11 4002 8922', status: 'active', createdAt: day(-150), updatedAt: day(-11) },
    { id: C.huang, tenantId: T.lumen, accountId: A.brightware, firstName: 'Jian', lastName: 'Huang', email: 'huang.jian@brightware.cn', phone: '+86 574 8712 6600', status: 'active', createdAt: day(-300), updatedAt: day(-8) },
    { id: C.li, tenantId: T.lumen, accountId: A.foshan, firstName: 'Xiaoyan', lastName: 'Li', email: 'li.xiaoyan@foshan-ceramic.cn', phone: '+86 757 8223 7710', status: 'active', createdAt: day(-280), updatedAt: day(-6) },
    { id: C.sophie, tenantId: T.harbor, accountId: A.eurotools, firstName: 'Sophie', lastName: 'de Vries', email: 'sophie@eurotools.nl', phone: '+31 10 214 8890', status: 'active', createdAt: day(-410), updatedAt: day(-2) },
    { id: C.milan, tenantId: T.harbor, accountId: A.eurotools, firstName: 'Milan', lastName: 'Kovac', email: 'milan@eurotools.nl', phone: '+31 10 214 8895', status: 'active', createdAt: day(-400), updatedAt: day(-15) },
    { id: C.rashid, tenantId: T.harbor, accountId: A.gulfmarine, firstName: 'Rashid', lastName: 'Al Suwaidi', email: 'rashid@gulfmarinesupply.ae', phone: '+971 6 552 1180', status: 'active', createdAt: day(-300), updatedAt: day(-4) },
    { id: C.wang, tenantId: T.harbor, accountId: A.qingdao, firstName: 'Peng', lastName: 'Wang', email: 'wang.peng@qingdao-fastener.cn', phone: '+86 532 8577 2201', status: 'active', createdAt: day(-500), updatedAt: day(-9) },
    { id: C.camila, tenantId: T.harbor, accountId: A.santiago, firstName: 'Camila', lastName: 'Rojas', email: 'camila@santiagoid.cl', phone: '+56 2 2345 8890', status: 'active', createdAt: day(-180), updatedAt: day(-7) },
    { id: C.oliver, tenantId: T.vantage, accountId: A.brightcart, firstName: 'Oliver', lastName: 'Bennett', email: 'oliver@brightcart.co.uk', phone: '+44 20 7946 0881', status: 'active', createdAt: day(-36), updatedAt: day(-1) },
    { id: C.dewi, tenantId: T.vantage, accountId: A.nusantara, firstName: 'Dewi', lastName: 'Kartika', email: 'dewi@nusantaradigital.id', phone: '+62 21 5087 1122', status: 'active', createdAt: day(-28), updatedAt: day(-3) },
    { id: C.chen, tenantId: T.vantage, accountId: A.dongguan, firstName: 'Hao', lastName: 'Chen', email: 'chen.hao@dg-circuit.cn', phone: '+86 769 2288 5510', status: 'active', createdAt: day(-38), updatedAt: day(-6) },
  ]);

  // ------------------------------------------------------------------ leads
  await upsert(leadsTable, [
    { id: uuid('lead:lumen:1'), tenantId: T.lumen, source: 'Alibaba', companyName: 'Casa Verde Importadora', companyNameCn: '卡萨维德进口公司', contactName: 'Rafael Moreira', email: 'rafael@casaverde.com.mx', phone: '+52 55 5523 8890', country: 'Mexico', industry: 'Kitchenware Retail', status: 'qualified', score: 82, notes: 'Requested an FOB Ningbo quote for three containers of tri-ply cookware. Needs FDA-compliant coating and Spanish packaging.', tags: ['kitchenware', 'LATAM', 'high-intent'], createdAt: day(-6), updatedAt: day(-1) },
    { id: uuid('lead:lumen:2'), tenantId: T.lumen, source: 'Made-in-China', companyName: 'Bluepeak Home Sourcing', companyNameCn: '蓝峰家居采购', contactName: 'Amelia Clark', email: 'amelia@bluepeakhome.co.uk', phone: '+44 161 555 0187', country: 'United Kingdom', industry: 'Homeware Distribution', status: 'contacted', score: 64, notes: 'Sourcing agent for three UK department-store chains. Wants samples of the 18/10 cookware range.', tags: ['homeware', 'UK'], createdAt: day(-11), updatedAt: day(-3) },
    { id: uuid('lead:lumen:3'), tenantId: T.lumen, source: 'Canton Fair', companyName: 'Sakura Living Co.', companyNameCn: '樱花生活株式会社', contactName: 'Kenji Sato', email: 'kenji@sakura-living.jp', phone: '+81 3 5555 2210', country: 'Japan', industry: 'Housewares Retail', status: 'new', score: 55, notes: 'Met at Canton Fair phase 1. Interested in matte-finish ceramic dinnerware for 12 stores.', tags: ['housewares', 'JP', 'trade-show'], createdAt: day(-2), updatedAt: day(-2) },
    { id: uuid('lead:lumen:4'), tenantId: T.lumen, source: 'Website', companyName: 'Sandton Hospitality Supply', companyNameCn: '桑顿酒店用品', contactName: 'Thabo Mokoena', email: 'thabo@sandtonhospitality.co.za', phone: '+27 11 555 7788', country: 'South Africa', industry: 'Hospitality Supplies', status: 'new', score: 47, notes: 'Downloaded the hotelware catalogue. Hotel group with 14 properties across Gauteng.', tags: ['hospitality', 'AF'], createdAt: day(-4), updatedAt: day(-4) },
    { id: uuid('lead:lumen:5'), tenantId: T.lumen, source: 'Referral', companyName: 'Gulf Hospitality Group', companyNameCn: '海湾酒店集团', contactName: 'Yousef Al Marri', email: 'yousef@gulfhospitality.ae', phone: '+971 4 555 0091', country: 'United Arab Emirates', industry: 'Hotel Procurement', status: 'qualified', score: 88, notes: 'Referred by Al Faisal Trading. Refit of 2,400 rooms; needs 40HQ mixed container by Q1.', tags: ['hospitality', 'MENA', 'high-intent'], createdAt: day(-14), updatedAt: day(-2) },
    { id: uuid('lead:lumen:6'), tenantId: T.lumen, source: 'LinkedIn', companyName: 'Nordic Table AB', companyNameCn: '北欧餐桌公司', contactName: 'Erik Lindqvist', email: 'erik@nordictable.se', phone: '+46 8 555 3300', country: 'Sweden', industry: 'Furniture & Decor Retail', status: 'lost', score: 32, notes: 'Budget frozen until the next fiscal year. Revisit in spring.', tags: ['decor', 'EU'], createdAt: day(-60), updatedAt: day(-40) },
    { id: uuid('lead:lumen:7'), tenantId: T.lumen, source: 'Alibaba', companyName: 'Cascade Gifting Inc.', companyNameCn: '瀑布礼品公司', contactName: 'Sarah Whitman', email: 'sarah@cascadegifting.com', phone: '+1 604 555 0123', country: 'Canada', industry: 'Gifts & Promotional Products', status: 'converted', score: 91, notes: 'Converted into the Maple & Co. trial order after sample approval.', tags: ['gifts', 'NA', 'converted'], createdAt: day(-70), updatedAt: day(-18) },
    { id: uuid('lead:lumen:8'), tenantId: T.lumen, source: 'Trade Show', companyName: 'Istanbul Homeware AS', companyNameCn: '伊斯坦布尔家居公司', contactName: 'Elif Yilmaz', email: 'elif@istanbulhomeware.com.tr', phone: '+90 212 555 6612', country: 'Turkey', industry: 'Homeware Wholesale', status: 'contacted', score: 58, notes: 'Asked for landed-cost estimates to Izmir for a mixed pallet programme.', tags: ['homeware', 'TR'], createdAt: day(-8), updatedAt: day(-5) },
    { id: uuid('lead:lumen:9'), tenantId: T.lumen, source: 'Website', companyName: 'Lisbon Kitchen Lab', companyNameCn: '里斯本厨房实验室', contactName: 'Inês Duarte', email: 'ines@lisbonkitchenlab.pt', phone: '+351 21 555 3040', country: 'Portugal', industry: 'Kitchenware E-commerce', status: 'new', score: 41, notes: 'Small first order potential; tests new products on a DTC store.', tags: ['kitchenware', 'EU', 'ecommerce'], createdAt: day(-1), updatedAt: day(-1) },
    { id: uuid('lead:lumen:10'), tenantId: T.lumen, source: 'Alibaba', companyName: 'Andes Retail Group', companyNameCn: '安第斯零售集团', contactName: 'Valentina Rojas', email: 'valentina@andesretail.cl', phone: '+56 2 555 7712', country: 'Chile', industry: 'Department Stores', status: 'qualified', score: 76, notes: 'Wants private-label cookware for 22 stores. Requires SGS test report.', tags: ['cookware', 'LATAM', 'private-label'], createdAt: day(-20), updatedAt: day(-4) },
    { id: uuid('lead:lumen:11'), tenantId: T.lumen, source: 'Referral', companyName: 'Cape Home Traders', companyNameCn: '开普家居贸易', contactName: 'Naledi Khumalo', email: 'naledi@capehometraders.co.za', phone: '+27 21 555 4419', country: 'South Africa', industry: 'Homeware Retail', status: 'contacted', score: 52, notes: 'Referred by Sandton Hospitality. Interested in seasonal serveware.', tags: ['homeware', 'AF'], createdAt: day(-9), updatedAt: day(-6) },
    { id: uuid('lead:lumen:12'), tenantId: T.lumen, source: 'Made-in-China', companyName: 'Danube Housewares GmbH', companyNameCn: '多瑙家居有限公司', contactName: 'Klaus Berger', email: 'klaus@danube-housewares.at', phone: '+43 1 555 2280', country: 'Austria', industry: 'Housewares Distribution', status: 'new', score: 45, notes: 'Catalogue request for the autumn range. No budget confirmed yet.', tags: ['housewares', 'EU'], createdAt: day(-3), updatedAt: day(-3) },
    { id: uuid('lead:harbor:1'), tenantId: T.harbor, source: 'Alibaba', companyName: 'Baltic Tool Import OU', companyNameCn: '波罗的海工具进口公司', contactName: 'Mart Sepp', email: 'mart@baltictool.ee', phone: '+372 6 555 220', country: 'Estonia', industry: 'Tool Import & Distribution', status: 'qualified', score: 79, notes: 'Needs 3,000 torque wrenches with CE documentation for Q2.', tags: ['tools', 'EU', 'high-intent'], createdAt: day(-13), updatedAt: day(-2) },
    { id: uuid('lead:harbor:2'), tenantId: T.harbor, source: 'Trade Show', companyName: 'Atlas Mining Supply', companyNameCn: '阿特拉斯矿业供应', contactName: 'Diego Salazar', email: 'diego@atlasmining.pe', phone: '+51 1 555 8890', country: 'Peru', industry: 'Mining Supplies', status: 'contacted', score: 61, notes: 'Mining contractor; requires forged shackles with mill certificates.', tags: ['mining', 'LATAM'], createdAt: day(-19), updatedAt: day(-7) },
    { id: uuid('lead:harbor:3'), tenantId: T.harbor, source: 'Website', companyName: 'Rotterdam Marine BV', companyNameCn: '鹿特丹船舶公司', contactName: 'Bram Jansen', email: 'bram@rotterdammarine.nl', phone: '+31 10 555 7711', country: 'Netherlands', industry: 'Ship Chandlery', status: 'new', score: 44, notes: 'Filled in the contact form asking about stainless deck hardware.', tags: ['marine', 'EU'], createdAt: day(-5), updatedAt: day(-5) },
    { id: uuid('lead:harbor:4'), tenantId: T.harbor, source: 'Referral', companyName: 'Cape Fastener Co.', companyNameCn: '开普紧固件公司', contactName: 'Johan Pretorius', email: 'johan@capefastener.co.za', phone: '+27 21 555 6623', country: 'South Africa', industry: 'Fastener Wholesale', status: 'lost', score: 29, notes: 'Chose a local supplier on price for the standard range.', tags: ['fasteners', 'AF'], createdAt: day(-80), updatedAt: day(-55) },
    { id: uuid('lead:harbor:5'), tenantId: T.harbor, source: 'LinkedIn', companyName: 'Nordic Fixings AB', companyNameCn: '北欧紧固件公司', contactName: 'Anna Berg', email: 'anna@nordicfixings.se', phone: '+46 8 555 7722', country: 'Sweden', industry: 'Construction Fasteners', status: 'converted', score: 84, notes: 'Signed the annual framework after a factory audit.', tags: ['fasteners', 'EU', 'converted'], createdAt: day(-120), updatedAt: day(-30) },
    { id: uuid('lead:harbor:6'), tenantId: T.harbor, source: 'Made-in-China', companyName: 'Adriatic Hardware doo', companyNameCn: '亚得里亚五金公司', contactName: 'Luka Horvat', email: 'luka@adriatichardware.hr', phone: '+385 1 555 3344', country: 'Croatia', industry: 'Hardware Retail', status: 'contacted', score: 57, notes: 'Interested in mixed containers of hand tools and fittings.', tags: ['hardware', 'EU'], createdAt: day(-16), updatedAt: day(-8) },
    { id: uuid('lead:vantage:1'), tenantId: T.vantage, source: 'Website', companyName: 'TechNova Retail GmbH', companyNameCn: '科技新星零售公司', contactName: 'Julia Neumann', email: 'julia@technova-retail.de', phone: '+49 30 555 8821', country: 'Germany', industry: 'Electronics Retail', status: 'qualified', score: 86, notes: 'Wants 5,000 USB-C hubs with German packaging and 2-year warranty.', tags: ['electronics', 'EU', 'high-intent'], createdAt: day(-7), updatedAt: day(-1) },
    { id: uuid('lead:vantage:2'), tenantId: T.vantage, source: 'Alibaba', companyName: 'Jakarta Gadget Hub', companyNameCn: '雅加达数码中心', contactName: 'Budi Santoso', email: 'budi@jakartagadget.id', phone: '+62 21 555 9900', country: 'Indonesia', industry: 'Gadget Distribution', status: 'new', score: 49, notes: 'Asked for MOQ and lead time on wireless charging pads.', tags: ['gadgets', 'SEA'], createdAt: day(-3), updatedAt: day(-3) },
    { id: uuid('lead:vantage:3'), tenantId: T.vantage, source: 'LinkedIn', companyName: 'Midwest Electronics LLC', companyNameCn: '中西部电子公司', contactName: 'Tyler Brooks', email: 'tyler@midwestelectronics.com', phone: '+1 312 555 4477', country: 'United States', industry: 'Consumer Electronics', status: 'contacted', score: 63, notes: 'Needs FCC-certified Bluetooth audio accessories for back-to-school.', tags: ['audio', 'NA'], createdAt: day(-11), updatedAt: day(-4) },
    { id: uuid('lead:vantage:4'), tenantId: T.vantage, source: 'Trade Show', companyName: 'SmartLife Distribution FZE', companyNameCn: '智能生活分销公司', contactName: 'Hassan Al Nuaimi', email: 'hassan@smartlife.ae', phone: '+971 4 555 6633', country: 'United Arab Emirates', industry: 'Smart Home Distribution', status: 'new', score: 54, notes: 'Met at GITEX. Requested smart-plug samples with UAE plug types.', tags: ['smart-home', 'MENA'], createdAt: day(-4), updatedAt: day(-4) },
    { id: uuid('lead:vantage:5'), tenantId: T.vantage, source: 'Referral', companyName: 'Kiwi Tech Ltd', companyNameCn: '奇异科技公司', contactName: 'Charlotte Reid', email: 'charlotte@kiwitech.co.nz', phone: '+64 9 555 1188', country: 'New Zealand', industry: 'Technology Retail', status: 'contacted', score: 58, notes: 'Small volumes but fast payer; wants a 200-unit trial.', tags: ['electronics', 'APAC'], createdAt: day(-14), updatedAt: day(-6) },
  ]);

  // ------------------------------------------------------------------ deals
  await upsert(dealsTable, [
    { id: uuid('deal:lumen:nordline-reorder'), tenantId: T.lumen, accountId: A.nordline, contactId: C.lena, name: 'Q3 Nordline Kitchenware Reorder — 2 x 40HQ', value: 186400, currency: 'USD', stage: 'negotiation', createdAt: day(-45), updatedAt: day(-2) },
    { id: uuid('deal:lumen:pacific-program'), tenantId: T.lumen, accountId: A.pacific, contactId: C.grace, name: 'Pacific Home Depot Stainless Cookware Program', value: 248000, currency: 'USD', stage: 'proposal', createdAt: day(-30), updatedAt: day(-4) },
    { id: uuid('deal:lumen:alfaisal-ramadan'), tenantId: T.lumen, accountId: A.alfaisal, contactId: C.omar, name: 'Al Faisal Ramadan Giftware Container', value: 92500, currency: 'USD', stage: 'discovery', createdAt: day(-18), updatedAt: day(-3) },
    { id: uuid('deal:lumen:maple-trial'), tenantId: T.lumen, accountId: A.maple, contactId: C.emily, name: 'Maple & Co. Holiday Decor Trial Order', value: 38900, currency: 'USD', stage: 'qualification', createdAt: day(-9), updatedAt: day(-5) },
    { id: uuid('deal:lumen:nordline-private-label'), tenantId: T.lumen, accountId: A.nordline, contactId: C.lena, name: 'Nordline Private Label Ceramic Line', value: 154000, currency: 'USD', stage: 'closed_won', createdAt: day(-120), updatedAt: day(-60) },
    { id: uuid('deal:lumen:pacific-spring'), tenantId: T.lumen, accountId: A.pacific, contactId: C.reyes, name: 'Pacific Home Depot Spring Range 2025', value: 210000, currency: 'USD', stage: 'closed_lost', createdAt: day(-200), updatedAt: day(-150) },
    { id: uuid('deal:lumen:alfaisal-hotelware'), tenantId: T.lumen, accountId: A.alfaisal, contactId: C.priya, name: 'Al Faisal Hotelware Expansion', value: 67300, currency: 'USD', stage: 'negotiation', createdAt: day(-25), updatedAt: day(-1) },
    { id: uuid('deal:harbor:eurotools-framework'), tenantId: T.harbor, accountId: A.eurotools, contactId: C.sophie, name: 'Rotterdam Port Hardware Framework', value: 320000, currency: 'USD', stage: 'proposal', createdAt: day(-40), updatedAt: day(-3) },
    { id: uuid('deal:harbor:gulf-marine'), tenantId: T.harbor, accountId: A.gulfmarine, contactId: C.rashid, name: 'Gulf Marine Deck Fittings Order', value: 128000, currency: 'USD', stage: 'negotiation', createdAt: day(-20), updatedAt: day(-2) },
    { id: uuid('deal:harbor:santiago-fasteners'), tenantId: T.harbor, accountId: A.santiago, contactId: C.camila, name: 'Santiago Mining Fasteners Q1', value: 88000, currency: 'USD', stage: 'qualification', createdAt: day(-12), updatedAt: day(-6) },
    { id: uuid('deal:harbor:eurotools-annual'), tenantId: T.harbor, accountId: A.eurotools, contactId: C.milan, name: 'EuroTools Annual Tooling Contract', value: 275000, currency: 'USD', stage: 'closed_won', createdAt: day(-160), updatedAt: day(-95) },
    { id: uuid('deal:vantage:brightcart-bundle'), tenantId: T.vantage, accountId: A.brightcart, contactId: C.oliver, name: 'BrightCart Smart Home Bundle', value: 76500, currency: 'USD', stage: 'proposal', createdAt: day(-15), updatedAt: day(-1) },
    { id: uuid('deal:vantage:nusantara-audio'), tenantId: T.vantage, accountId: A.nusantara, contactId: C.dewi, name: 'Nusantara 20ft Audio Accessories', value: 41200, currency: 'USD', stage: 'qualification', createdAt: day(-6), updatedAt: day(-2) },
    { id: uuid('deal:vantage:brightcart-reorder'), tenantId: T.vantage, accountId: A.brightcart, contactId: C.oliver, name: 'BrightCart Charging Accessories Reorder', value: 58900, currency: 'USD', stage: 'closed_won', createdAt: day(-90), updatedAt: day(-45) },
  ]);

  // -------------------------------------------------------------- shipments
  await upsert(shipmentsTable, [
    { id: uuid('shipment:lumen:0148'), tenantId: T.lumen, accountId: A.nordline, shipmentNumber: 'SHP-2026-0148', orderId: 'PO-2026-0142', mode: 'sea', trackingNumber: 'MAEU-2291-4471', carrier: 'Maersk', originPort: 'Ningbo', originCountry: 'China', destinationPort: 'Rotterdam', destinationCountry: 'Netherlands', etd: day(-12), status: 'in_transit', eta: day(14), createdAt: day(-20), updatedAt: day(-1) },
    { id: uuid('shipment:lumen:0131'), tenantId: T.lumen, accountId: A.pacific, shipmentNumber: 'SHP-2026-0131', orderId: 'PO-2026-0129', mode: 'sea', trackingNumber: 'CGMU-7712-3390', carrier: 'CMA CGM', originPort: 'Shanghai', originCountry: 'China', destinationPort: 'Los Angeles', destinationCountry: 'United States', etd: day(-38), status: 'delivered', eta: day(-9), createdAt: day(-46), updatedAt: day(-9) },
    { id: uuid('shipment:lumen:0156'), tenantId: T.lumen, accountId: A.alfaisal, shipmentNumber: 'SHP-2026-0156', orderId: 'PO-2026-0151', mode: 'air', trackingNumber: '020-4471 8823', carrier: 'Emirates SkyCargo', originPort: 'Shanghai Pudong', originCountry: 'China', destinationPort: 'Dubai', destinationCountry: 'United Arab Emirates', etd: day(-3), status: 'booked', eta: day(2), createdAt: day(-6), updatedAt: day(-3) },
    { id: uuid('shipment:lumen:0122'), tenantId: T.lumen, accountId: A.casa, shipmentNumber: 'SHP-2026-0122', orderId: 'PO-2026-0118', mode: 'sea', trackingNumber: 'COSU-6382-1185', carrier: 'COSCO', originPort: 'Qingdao', originCountry: 'China', destinationPort: 'Santos', destinationCountry: 'Brazil', etd: day(-26), status: 'in_transit', eta: day(18), createdAt: day(-34), updatedAt: day(-2) },
    { id: uuid('shipment:lumen:0163'), tenantId: T.lumen, accountId: A.maple, shipmentNumber: 'SHP-2026-0163', orderId: 'PO-2026-0158', mode: 'sea', trackingNumber: 'ONEY-5590-7742', carrier: 'Ocean Network Express', originPort: 'Ningbo', originCountry: 'China', destinationPort: 'Vancouver', destinationCountry: 'Canada', etd: day(-1), status: 'export_cleared', eta: day(16), createdAt: day(-8), updatedAt: day(-1) },
    { id: uuid('shipment:lumen:0109'), tenantId: T.lumen, accountId: A.alfaisal, shipmentNumber: 'SHP-2026-0109', orderId: 'PO-2026-0104', mode: 'sea', trackingNumber: 'HLCU-9921-6630', carrier: 'Hapag-Lloyd', originPort: 'Shanghai', originCountry: 'China', destinationPort: 'Jebel Ali', destinationCountry: 'United Arab Emirates', etd: day(-64), status: 'import_cleared', eta: day(-37), createdAt: day(-72), updatedAt: day(-36) },
    { id: uuid('shipment:harbor:0150'), tenantId: T.harbor, accountId: A.eurotools, shipmentNumber: 'SHP-2026-0150', orderId: 'PO-2026-0146', mode: 'sea', trackingNumber: 'MSCU-3388-9901', carrier: 'MSC', originPort: 'Ningbo', originCountry: 'China', destinationPort: 'Rotterdam', destinationCountry: 'Netherlands', etd: day(-16), status: 'in_transit', eta: day(9), createdAt: day(-24), updatedAt: day(-2) },
    { id: uuid('shipment:harbor:0137'), tenantId: T.harbor, accountId: A.gulfmarine, shipmentNumber: 'SHP-2026-0137', orderId: 'PO-2026-0133', mode: 'sea', trackingNumber: 'COSU-7714-2208', carrier: 'COSCO', originPort: 'Qingdao', originCountry: 'China', destinationPort: 'Sharjah', destinationCountry: 'United Arab Emirates', etd: day(-44), status: 'arrived', eta: day(-11), createdAt: day(-52), updatedAt: day(-10) },
    { id: uuid('shipment:harbor:0161'), tenantId: T.harbor, accountId: A.santiago, shipmentNumber: 'SHP-2026-0161', orderId: 'PO-2026-0157', mode: 'air', trackingNumber: '176-3344 5521', carrier: 'Lufthansa Cargo', originPort: 'Shanghai Pudong', originCountry: 'China', destinationPort: 'Santiago', destinationCountry: 'Chile', etd: day(-2), status: 'picked_up', eta: day(3), createdAt: day(-5), updatedAt: day(-2) },
    { id: uuid('shipment:vantage:0159'), tenantId: T.vantage, accountId: A.brightcart, shipmentNumber: 'SHP-2026-0159', orderId: 'PO-2026-0154', mode: 'air', trackingNumber: '999-8877 1122', carrier: 'Cathay Cargo', originPort: 'Shenzhen', originCountry: 'China', destinationPort: 'London Heathrow', destinationCountry: 'United Kingdom', etd: day(-4), status: 'in_transit', eta: day(1), createdAt: day(-7), updatedAt: day(0) },
    { id: uuid('shipment:vantage:0140'), tenantId: T.vantage, accountId: A.nusantara, shipmentNumber: 'SHP-2026-0140', orderId: 'PO-2026-0136', mode: 'sea', trackingNumber: 'EISU-2277-4410', carrier: 'Evergreen', originPort: 'Yantian', originCountry: 'China', destinationPort: 'Jakarta', destinationCountry: 'Indonesia', etd: day(-22), status: 'delivered', eta: day(-8), createdAt: day(-30), updatedAt: day(-8) },
  ]);

  // ---------------------------------------------------------- conversations
  await upsert(conversationsTable, [
    { id: CONV.nordline, tenantId: T.lumen, channelType: 'email', contactId: C.lena, subject: 'Q3 kitchenware reorder — container split', status: 'open', lastMessageAt: day(0, 15), createdAt: day(-9, 10), updatedAt: day(0, 15) },
    { id: CONV.pacific, tenantId: T.lumen, channelType: 'whatsapp', contactId: C.grace, subject: 'Stainless cookware programme — sample approval', status: 'open', lastMessageAt: day(-1, 16), createdAt: day(-14, 9), updatedAt: day(-1, 16) },
    { id: CONV.alfaisal, tenantId: T.lumen, channelType: 'alibaba', contactId: C.omar, subject: 'Ramadan giftware — packaging artwork', status: 'open', lastMessageAt: day(-2, 11), createdAt: day(-10, 8), updatedAt: day(-2, 11) },
    { id: CONV.maple, tenantId: T.lumen, channelType: 'webchat', contactId: C.emily, subject: 'Holiday decor trial order', status: 'pending', lastMessageAt: day(-5, 14), createdAt: day(-6, 13), updatedAt: day(-5, 14) },
    { id: CONV.casa, tenantId: T.lumen, channelType: 'email', contactId: C.mariana, subject: 'Cookware launch — shipping documents', status: 'closed', lastMessageAt: day(-20, 10), createdAt: day(-26, 9), updatedAt: day(-20, 10) },
    { id: CONV.eurotools, tenantId: T.harbor, channelType: 'email', contactId: C.sophie, subject: 'Rotterdam framework — pricing schedule', status: 'open', lastMessageAt: day(-1, 9), createdAt: day(-12, 8), updatedAt: day(-1, 9) },
    { id: CONV.gulfmarine, tenantId: T.harbor, channelType: 'whatsapp', contactId: C.rashid, subject: 'Deck fittings — mill certificates', status: 'open', lastMessageAt: day(-2, 17), createdAt: day(-8, 10), updatedAt: day(-2, 17) },
    { id: CONV.santiago, tenantId: T.harbor, channelType: 'alibaba', contactId: C.camila, subject: 'Mining fasteners — technical datasheet', status: 'pending', lastMessageAt: day(-4, 12), createdAt: day(-7, 9), updatedAt: day(-4, 12) },
    { id: CONV.brightcart, tenantId: T.vantage, channelType: 'webchat', contactId: C.oliver, subject: 'Smart home bundle — launch timing', status: 'open', lastMessageAt: day(0, 10), createdAt: day(-5, 9), updatedAt: day(0, 10) },
    { id: CONV.nusantara, tenantId: T.vantage, channelType: 'whatsapp', contactId: C.dewi, subject: 'Audio accessories — 20ft mixed container', status: 'open', lastMessageAt: day(-2, 14), createdAt: day(-6, 11), updatedAt: day(-2, 14) },
  ]);

  // --------------------------------------------------------------- messages
  await upsert(messagesTable, [
    { id: uuid('message:nordline:1'), tenantId: T.lumen, conversationId: CONV.nordline, senderId: U.lena, senderType: 'customer', direction: 'inbound', content: 'Hi Wei, we would like to split the Q3 reorder into two 40HQ containers. Can you confirm the sailing dates from Ningbo?', contentTranslated: '你好伟，我们希望把第三季度的返单拆成两个40尺高柜。能否确认宁波的船期？', contentType: 'text', status: 'read', createdAt: day(-9, 10) },
    { id: uuid('message:nordline:2'), tenantId: T.lumen, conversationId: CONV.nordline, senderId: U.wei, senderType: 'agent', direction: 'outbound', content: 'Hi Lena, yes — we can split 60/40. Next Ningbo sailings are on the 12th and 19th, both arriving Rotterdam in about 28 days.', contentTranslated: '你好 Lena，可以，我们能按 60/40 拆分。宁波下一班船期是 12 号和 19 号，大约 28 天抵达鹿特丹。', contentType: 'text', status: 'read', createdAt: day(-8, 11) },
    { id: uuid('message:nordline:3'), tenantId: T.lumen, conversationId: CONV.nordline, senderId: U.lena, senderType: 'customer', direction: 'inbound', content: 'The 12th works. Please keep the cookware sets in the first container and the glassware in the second so we can release them separately.', contentTranslated: '12 号可以。请把锅具套装放在第一个柜，玻璃器皿放第二个柜，方便我们分开提货。', contentType: 'text', status: 'read', createdAt: day(-1, 9) },
    { id: uuid('message:nordline:4'), tenantId: T.lumen, conversationId: CONV.nordline, senderId: U.wei, senderType: 'agent', direction: 'outbound', content: 'Understood. I have sent the revised packing list and the proforma invoice for both containers this morning.', contentTranslated: '明白。我今天上午已经把两个柜的修改后装箱单和形式发票发出。', contentType: 'text', status: 'sent', createdAt: day(0, 15) },
    { id: uuid('message:pacific:1'), tenantId: T.lumen, conversationId: CONV.pacific, senderId: null, senderType: 'customer', direction: 'inbound', content: 'Our QA team approved the 18/10 sample set. What is the lead time for 12,000 units?', contentTranslated: '我们的质检团队已通过 18/10 样品套装。12,000 件的交期是多少？', contentType: 'text', status: 'read', createdAt: day(-4, 10) },
    { id: uuid('message:pacific:2'), tenantId: T.lumen, conversationId: CONV.pacific, senderId: U.wei, senderType: 'agent', direction: 'outbound', content: 'Great news. Production is 30 days plus 26 days ocean to Los Angeles. We can ship in two batches to protect your launch date.', contentTranslated: '好消息。生产 30 天，加上海运到洛杉矶 26 天。我们可以分两批出运，保证你们的上市时间。', contentType: 'text', status: 'read', createdAt: day(-3, 12) },
    { id: uuid('message:pacific:3'), tenantId: T.lumen, conversationId: CONV.pacific, senderId: null, senderType: 'customer', direction: 'inbound', content: 'Two batches works. Please send the updated quotation with the freight split by batch.', contentTranslated: '分两批可以。请把按批次分摊的运费更新到报价单里发给我。', contentType: 'text', status: 'read', createdAt: day(-1, 16) },
    { id: uuid('message:alfaisal:1'), tenantId: T.lumen, conversationId: CONV.alfaisal, senderId: null, senderType: 'customer', direction: 'inbound', content: 'We need the gift boxes in deep green with gold foil Arabic lettering. Can your Foshan factory handle that?', contentTranslated: '我们需要深绿色礼盒加烫金阿拉伯文。你们佛山工厂能做吗？', contentType: 'text', status: 'read', createdAt: day(-4, 8) },
    { id: uuid('message:alfaisal:2'), tenantId: T.lumen, conversationId: CONV.alfaisal, senderId: U.mei, senderType: 'agent', direction: 'outbound', content: 'Yes, Foshan has confirmed the foil stamping. They need the final artwork as a vector file by Thursday to hold the production slot.', contentTranslated: '可以，佛山确认能烫金。他们需要在周四前收到最终矢量文件，以便保留生产排期。', contentType: 'text', status: 'read', createdAt: day(-3, 10) },
    { id: uuid('message:alfaisal:3'), tenantId: T.lumen, conversationId: CONV.alfaisal, senderId: null, senderType: 'customer', direction: 'inbound', content: 'Artwork attached. Please confirm the Pantone 3435C shade before printing.', contentTranslated: '附件是设计稿。印刷前请确认潘通 3435C 色号。', contentType: 'text', status: 'read', createdAt: day(-2, 11) },
    { id: uuid('message:maple:1'), tenantId: T.lumen, conversationId: CONV.maple, senderId: null, senderType: 'customer', direction: 'inbound', content: 'We would like a small trial order of the holiday serveware before committing to the full season.', contentTranslated: '我们想先下一小批节日餐具试单，再决定整季的采购。', contentType: 'text', status: 'read', createdAt: day(-6, 13) },
    { id: uuid('message:maple:2'), tenantId: T.lumen, conversationId: CONV.maple, senderId: U.wei, senderType: 'agent', direction: 'outbound', content: 'A trial of 600 sets is possible with a 45-day lead time. I will prepare the pricing and the shipping options to Toronto.', contentTranslated: '600 套试单可行，交期 45 天。我会准备价格和到多伦多的运输方案。', contentType: 'text', status: 'read', createdAt: day(-5, 14) },
    { id: uuid('message:casa:1'), tenantId: T.lumen, conversationId: CONV.casa, senderId: null, senderType: 'customer', direction: 'inbound', content: 'The container arrived and cleared Santos customs. Please send the original bill of lading for our records.', contentTranslated: '货柜已到港并通过桑托斯海关。请把正本提单寄给我们存档。', contentType: 'text', status: 'read', createdAt: day(-26, 9) },
    { id: uuid('message:casa:2'), tenantId: T.lumen, conversationId: CONV.casa, senderId: U.mei, senderType: 'agent', direction: 'outbound', content: 'Originals were couriered on Monday, tracking DHL 4471 8823 901. I have also emailed the packing list and invoice.', contentTranslated: '正本已于周一快递，DHL 单号 4471 8823 901。装箱单和发票也已邮件发送。', contentType: 'text', status: 'read', createdAt: day(-24, 11) },
    { id: uuid('message:casa:3'), tenantId: T.lumen, conversationId: CONV.casa, senderId: null, senderType: 'customer', direction: 'inbound', content: 'Received, thank you. Everything matches. Closing this thread.', contentTranslated: '已收到，谢谢。全部一致，此对话可以关闭。', contentType: 'text', status: 'read', createdAt: day(-20, 10) },
    { id: uuid('message:eurotools:1'), tenantId: T.harbor, conversationId: CONV.eurotools, senderId: null, senderType: 'customer', direction: 'inbound', content: 'Can you hold the framework pricing for 90 days? Our board reviews supplier contracts at the end of the quarter.', contentTranslated: '框架价格能否保留 90 天？我们董事会在季末审核供应商合同。', contentType: 'text', status: 'read', createdAt: day(-12, 8) },
    { id: uuid('message:eurotools:2'), tenantId: T.harbor, conversationId: CONV.eurotools, senderId: U.daniel, senderType: 'agent', direction: 'outbound', content: 'We can hold it for 60 days without a deposit. Beyond that we would need a 20% commitment to lock the steel price.', contentTranslated: '无定金可保留 60 天。超过 60 天需要 20% 的承诺量来锁定钢材价格。', contentType: 'text', status: 'read', createdAt: day(-10, 9) },
    { id: uuid('message:eurotools:3'), tenantId: T.harbor, conversationId: CONV.eurotools, senderId: null, senderType: 'customer', direction: 'inbound', content: 'Understood. We will confirm the commitment after the board meeting on Friday.', contentTranslated: '明白。我们会在周五董事会后确认承诺量。', contentType: 'text', status: 'read', createdAt: day(-1, 9) },
    { id: uuid('message:gulfmarine:1'), tenantId: T.harbor, conversationId: CONV.gulfmarine, senderId: null, senderType: 'customer', direction: 'inbound', content: 'The surveyor needs mill certificates for the stainless shackles before we can release the shipment.', contentTranslated: '验船师需要不锈钢卸扣的材质证明，之后我们才能放货。', contentType: 'text', status: 'read', createdAt: day(-8, 10) },
    { id: uuid('message:gulfmarine:2'), tenantId: T.harbor, conversationId: CONV.gulfmarine, senderId: U.daniel, senderType: 'agent', direction: 'outbound', content: 'Certificates for heat numbers 22-4481 and 22-4482 are attached. The third batch is still at the mill.', contentTranslated: '随附炉号 22-4481 和 22-4482 的证书。第三批仍在钢厂。', contentType: 'text', status: 'read', createdAt: day(-5, 15) },
    { id: uuid('message:gulfmarine:3'), tenantId: T.harbor, conversationId: CONV.gulfmarine, senderId: null, senderType: 'customer', direction: 'inbound', content: 'Thank you. Please send the third batch certificates as soon as they arrive.', contentTranslated: '谢谢。第三批证书到了请尽快发给我们。', contentType: 'text', status: 'read', createdAt: day(-2, 17) },
    { id: uuid('message:santiago:1'), tenantId: T.harbor, conversationId: CONV.santiago, senderId: null, senderType: 'customer', direction: 'inbound', content: 'Please send the technical datasheet for the M24 galvanised bolts, including torque values.', contentTranslated: '请发送 M24 镀锌螺栓的技术资料，包含扭矩值。', contentType: 'text', status: 'read', createdAt: day(-7, 9) },
    { id: uuid('message:santiago:2'), tenantId: T.harbor, conversationId: CONV.santiago, senderId: U.daniel, senderType: 'agent', direction: 'outbound', content: 'Datasheet attached. Torque values are 780 Nm dry and 620 Nm lubricated. We can also supply test reports on request.', contentTranslated: '资料已附。干态扭矩 780 牛米，润滑态 620 牛米。如需可提供检测报告。', contentType: 'text', status: 'read', createdAt: day(-4, 12) },
    { id: uuid('message:brightcart:1'), tenantId: T.vantage, conversationId: CONV.brightcart, senderId: null, senderType: 'customer', direction: 'inbound', content: 'We want to launch the smart home bundle in week 42. Can you confirm the packaging and the app localisation?', contentTranslated: '我们想在 10 月第 42 周上线智能家居套装。能否确认包装和应用本地化？', contentType: 'text', status: 'read', createdAt: day(-5, 9) },
    { id: uuid('message:brightcart:2'), tenantId: T.vantage, conversationId: CONV.brightcart, senderId: U.aisha, senderType: 'agent', direction: 'outbound', content: 'Week 42 is achievable if we approve artwork this week. English and German localisation are already in the app build.', contentTranslated: '如果本周确认设计稿，第 42 周可以做到。应用内已完成英语和德语本地化。', contentType: 'text', status: 'read', createdAt: day(-3, 11) },
    { id: uuid('message:brightcart:3'), tenantId: T.vantage, conversationId: CONV.brightcart, senderId: null, senderType: 'customer', direction: 'inbound', content: 'Artwork approved. Please proceed with production and send the deposit invoice.', contentTranslated: '设计稿已确认。请开始生产并发送定金发票。', contentType: 'text', status: 'read', createdAt: day(0, 10) },
    { id: uuid('message:nusantara:1'), tenantId: T.vantage, conversationId: CONV.nusantara, senderId: null, senderType: 'customer', direction: 'inbound', content: 'What is the MOQ if we mix wireless earbuds and charging pads in one 20ft container?', contentTranslated: '如果无线耳机和充电板混装一个 20 尺柜，起订量是多少？', contentType: 'text', status: 'read', createdAt: day(-6, 11) },
    { id: uuid('message:nusantara:2'), tenantId: T.vantage, conversationId: CONV.nusantara, senderId: U.aisha, senderType: 'agent', direction: 'outbound', content: '1,000 units per SKU for a mixed 20ft, or 3,000 total if you allow us to choose the mix. Lead time is 25 days.', contentTranslated: '混装 20 尺柜每个 SKU 起订 1,000 件，若由我们搭配则总计 3,000 件即可。交期 25 天。', contentType: 'text', status: 'read', createdAt: day(-4, 13) },
    { id: uuid('message:nusantara:3'), tenantId: T.vantage, conversationId: CONV.nusantara, senderId: null, senderType: 'customer', direction: 'inbound', content: 'We will take 1,200 earbuds and 1,800 pads. Please confirm the landed cost to Jakarta.', contentTranslated: '我们要 1,200 副耳机和 1,800 个充电板。请确认到雅加达的到岸成本。', contentType: 'text', status: 'read', createdAt: day(-2, 14) },
  ]);

  // -------------------------------------------------------------- CMS pages
  await upsert(cmsPagesTable, [
    { id: PAGE.home, tenantId: T.lumen, slug: 'home', title: 'Lumen Trading — Global Sourcing, Delivered', description: 'Home page for Lumen Trading: export-ready housewares and electronics sourced from verified factories in East China.', status: 'published', createdAt: day(-300), updatedAt: day(-6) },
    { id: PAGE.about, tenantId: T.lumen, slug: 'about', title: 'About Lumen Trading', description: 'Our sourcing story, quality process and the markets we serve.', status: 'published', createdAt: day(-300), updatedAt: day(-20) },
    { id: PAGE.products, tenantId: T.lumen, slug: 'products', title: 'Product Catalogue', description: 'Cookware, tableware and small appliances available for export.', status: 'published', createdAt: day(-280), updatedAt: day(-9) },
    { id: PAGE.contact, tenantId: T.lumen, slug: 'contact', title: 'Request a Quote', description: 'Send us your specification and we will reply with an FOB quote within two business days.', status: 'draft', createdAt: day(-40), updatedAt: day(-2) },
    { id: PAGE.harborHome, tenantId: T.harbor, slug: 'home', title: 'Harborline Export Group', description: 'Industrial hardware and tools exported from Ningbo to Europe, the Gulf and Latin America.', status: 'published', createdAt: day(-260), updatedAt: day(-12) },
    { id: PAGE.harborProducts, tenantId: T.harbor, slug: 'products', title: 'Hardware Range', description: 'Fasteners, hand tools and marine hardware for distributors.', status: 'draft', createdAt: day(-120), updatedAt: day(-15) },
  ]);

  // ----------------------------------------------------------- CMS sections
  await upsert(cmsSectionsTable, [
    { id: uuid('section:lumen:home:hero'), pageId: PAGE.home, sectionType: 'hero', sectionKey: 'hero', content: { heading: 'Global sourcing, delivered on time', subheading: 'Verified factories in Ningbo, Foshan and Shenzhen. Export-ready cookware and electronics for buyers in 30+ markets.', ctaLabel: 'Request a quote', ctaHref: '/contact', backgroundImage: 'https://cdn.xisync.app/cms/lumen-hero.jpg' }, sortOrder: 1, visible: true, createdAt: day(-300), updatedAt: day(-6) },
    { id: uuid('section:lumen:home:stats'), pageId: PAGE.home, sectionType: 'stats', sectionKey: 'stats', content: { items: [{ label: 'Active buyers', value: '120+' }, { label: 'Countries served', value: '32' }, { label: 'Containers shipped', value: '1,480' }, { label: 'On-time delivery', value: '97.4%' }] }, sortOrder: 2, visible: true, createdAt: day(-300), updatedAt: day(-6) },
    { id: uuid('section:lumen:home:features'), pageId: PAGE.home, sectionType: 'features', sectionKey: 'features', content: { items: [{ icon: 'factory', title: 'Factory-direct pricing', description: 'We quote from the production line, not a trading desk.' }, { icon: 'shield', title: 'QC before loading', description: 'AQL 2.5 inspection with photo evidence on every order.' }, { icon: 'ship', title: 'Door-to-door logistics', description: 'FOB, CIF or DDP — one team handles the whole route.' }] }, sortOrder: 3, visible: true, createdAt: day(-290), updatedAt: day(-10) },
    { id: uuid('section:lumen:home:testimonials'), pageId: PAGE.home, sectionType: 'testimonials', sectionKey: 'testimonials', content: { items: [{ quote: 'The reorder process is the smoothest of any supplier we work with.', author: 'Lena Hoffmann', company: 'Nordline Retail GmbH' }, { quote: 'Documentation is always complete, which saves us days at customs.', author: 'Grace Chen', company: 'Pacific Home Depot LLC' }] }, sortOrder: 4, visible: true, createdAt: day(-250), updatedAt: day(-18) },
    { id: uuid('section:lumen:home:cta'), pageId: PAGE.home, sectionType: 'cta', sectionKey: 'cta', content: { heading: 'Planning your next container?', subheading: 'Send your specification and target price. We reply within two business days.', buttonLabel: 'Start an enquiry', buttonHref: '/contact' }, sortOrder: 5, visible: true, createdAt: day(-250), updatedAt: day(-6) },
    { id: uuid('section:lumen:about:hero'), pageId: PAGE.about, sectionType: 'hero', sectionKey: 'hero', content: { heading: 'A sourcing team that lives where your products are made', subheading: 'Founded in Shanghai in 2016, Lumen Trading works directly with 40+ factories across East and South China.', ctaLabel: 'Meet the team', ctaHref: '/about#team', backgroundImage: 'https://cdn.xisync.app/cms/lumen-about.jpg' }, sortOrder: 1, visible: true, createdAt: day(-300), updatedAt: day(-20) },
    { id: uuid('section:lumen:about:story'), pageId: PAGE.about, sectionType: 'content', sectionKey: 'story', content: { heading: 'Our story', body: 'We started as a three-person QC office in Ningbo. Today we manage production, inspection and documentation for buyers across Europe, North America, the Gulf and Latin America.' }, sortOrder: 2, visible: true, createdAt: day(-300), updatedAt: day(-20) },
    { id: uuid('section:lumen:about:values'), pageId: PAGE.about, sectionType: 'values', sectionKey: 'values', content: { items: [{ title: 'Evidence over promises', description: 'Every claim is backed by a test report or an inspection photo.' }, { title: 'One point of contact', description: 'Your account manager owns the order from sample to arrival.' }, { title: 'Long-term factories', description: 'We stay with suppliers that invest in their lines and their people.' }] }, sortOrder: 3, visible: true, createdAt: day(-300), updatedAt: day(-25) },
    { id: uuid('section:lumen:products:hero'), pageId: PAGE.products, sectionType: 'hero', sectionKey: 'hero', content: { heading: 'Export catalogue', subheading: 'Cookware, tableware and small appliances — available for private label.', ctaLabel: 'Download PDF', ctaHref: '/catalogue.pdf', backgroundImage: 'https://cdn.xisync.app/cms/lumen-catalogue.jpg' }, sortOrder: 1, visible: true, createdAt: day(-280), updatedAt: day(-9) },
    { id: uuid('section:lumen:products:grid'), pageId: PAGE.products, sectionType: 'product_grid', sectionKey: 'product-grid', content: { items: [{ name: 'Tri-ply stainless cookware set', price: 'USD 42.80', image: 'https://cdn.xisync.app/cms/tri-ply.jpg' }, { name: 'Matte ceramic dinnerware, 16 pc', price: 'USD 28.40', image: 'https://cdn.xisync.app/cms/ceramic.jpg' }, { name: 'Borosilicate glass storage, 10 pc', price: 'USD 16.90', image: 'https://cdn.xisync.app/cms/glass.jpg' }] }, sortOrder: 2, visible: true, createdAt: day(-280), updatedAt: day(-9) },
    { id: uuid('section:lumen:products:cta'), pageId: PAGE.products, sectionType: 'cta', sectionKey: 'cta', content: { heading: 'Need a private-label quote?', subheading: 'Send your logo and target volume; we will return a costed offer.', buttonLabel: 'Request pricing', buttonHref: '/contact' }, sortOrder: 3, visible: true, createdAt: day(-270), updatedAt: day(-9) },
    { id: uuid('section:lumen:contact:hero'), pageId: PAGE.contact, sectionType: 'hero', sectionKey: 'hero', content: { heading: 'Request a quote', subheading: 'Tell us the product, quantity and destination port. We reply within two business days.', ctaLabel: null, ctaHref: null, backgroundImage: 'https://cdn.xisync.app/cms/lumen-contact.jpg' }, sortOrder: 1, visible: true, createdAt: day(-40), updatedAt: day(-2) },
    { id: uuid('section:lumen:contact:form'), pageId: PAGE.contact, sectionType: 'form', sectionKey: 'enquiry-form', content: { fields: ['name', 'company', 'email', 'destination_port', 'message'], submitLabel: 'Send enquiry', successMessage: 'Thank you — our export team will reply shortly.' }, sortOrder: 2, visible: true, createdAt: day(-40), updatedAt: day(-2) },
    { id: uuid('section:harbor:home:hero'), pageId: PAGE.harborHome, sectionType: 'hero', sectionKey: 'hero', content: { heading: 'Industrial hardware from Ningbo', subheading: 'Fasteners, hand tools and marine hardware with full traceability.', ctaLabel: 'View the range', ctaHref: '/products', backgroundImage: 'https://cdn.xisync.app/cms/harbor-hero.jpg' }, sortOrder: 1, visible: true, createdAt: day(-260), updatedAt: day(-12) },
    { id: uuid('section:harbor:home:features'), pageId: PAGE.harborHome, sectionType: 'features', sectionKey: 'features', content: { items: [{ icon: 'certificate', title: 'Mill certificates', description: 'Heat-number traceability on every forged batch.' }, { icon: 'container', title: 'Mixed containers', description: 'Combine fasteners and tools to fill a 40HQ.' }, { icon: 'globe', title: 'Gulf and EU lanes', description: 'Weekly sailings to Rotterdam, Jebel Ali and Sharjah.' }] }, sortOrder: 2, visible: true, createdAt: day(-260), updatedAt: day(-12) },
    { id: uuid('section:harbor:home:cta'), pageId: PAGE.harborHome, sectionType: 'cta', sectionKey: 'cta', content: { heading: 'Send us your bill of materials', subheading: 'We will quote standards, finishes and packaging in one response.', buttonLabel: 'Contact sales', buttonHref: '/contact' }, sortOrder: 3, visible: true, createdAt: day(-250), updatedAt: day(-12) },
    { id: uuid('section:harbor:products:hero'), pageId: PAGE.harborProducts, sectionType: 'hero', sectionKey: 'hero', content: { heading: 'Hardware range', subheading: 'Galvanised, stainless and high-tensile ranges for distributors.', ctaLabel: null, ctaHref: null, backgroundImage: 'https://cdn.xisync.app/cms/harbor-range.jpg' }, sortOrder: 1, visible: true, createdAt: day(-120), updatedAt: day(-15) },
    { id: uuid('section:harbor:products:grid'), pageId: PAGE.harborProducts, sectionType: 'product_grid', sectionKey: 'product-grid', content: { items: [{ name: 'M24 galvanised hex bolt', price: 'USD 0.86', image: 'https://cdn.xisync.app/cms/bolt.jpg' }, { name: 'Stainless steel shackle, 12t', price: 'USD 9.40', image: 'https://cdn.xisync.app/cms/shackle.jpg' }, { name: 'Torque wrench, 200 Nm', price: 'USD 38.20', image: 'https://cdn.xisync.app/cms/torque.jpg' }] }, sortOrder: 2, visible: true, createdAt: day(-120), updatedAt: day(-15) },
  ]);

  const summary = await pool.query<{ table_name: string; rows: string }>(`
    select 'tenants' as table_name, count(*)::text as rows from tenants
    union all select 'users', count(*)::text from users
    union all select 'profiles', count(*)::text from profiles
    union all select 'accounts', count(*)::text from accounts
    union all select 'contacts', count(*)::text from contacts
    union all select 'leads', count(*)::text from leads
    union all select 'deals', count(*)::text from deals
    union all select 'shipments', count(*)::text from shipments
    union all select 'conversations', count(*)::text from conversations
    union all select 'messages', count(*)::text from messages
    union all select 'cms_pages', count(*)::text from cms_pages
    union all select 'cms_sections', count(*)::text from cms_sections
  `);

  console.log('[db:seed] Demo data ready:');
  for (const row of summary.rows) {
    console.log(`  ${row.table_name.padEnd(14)} ${row.rows}`);
  }
  console.log(`[db:seed] Primary demo tenant: lumen-trading (${T.lumen})`);
  console.log('[db:seed] Bind a real login to it with: pnpm --filter @workspace/db bind <email>');
}

seed()
  .catch((error: unknown) => {
    console.error('[db:seed] Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
