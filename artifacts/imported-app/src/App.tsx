import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { AuthProvider } from './lib/auth-context';
import { I18nProvider } from './lib/i18n';
import { ThemeProvider } from './lib/theme-context';
import { PasswordProvider } from './lib/password-context';
import { CurrencyProvider } from './lib/currency-context';
import { AppGuard } from './components/AppGuard';

import { HomePage } from './pages/marketing/HomePage';
import { ProductPage } from './pages/marketing/ProductPage';
import { PricingPage } from './pages/marketing/PricingPage';
import { IntegrationsPage } from './pages/marketing/IntegrationsPage';
import { DemoPage } from './pages/marketing/DemoPage';

import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

const DashboardLayout = lazy(() =>
  import('./components/dashboard/DashboardLayout').then((module) => ({ default: module.DashboardLayout })),
);
const DashboardHome = lazy(() =>
  import('./pages/dashboard/DashboardHome').then((module) => ({ default: module.DashboardHome })),
);
const TradeCommandCenter = lazy(() =>
  import('./pages/dashboard/TradeCommandCenter').then((module) => ({ default: module.TradeCommandCenter })),
);
const TradeIntelligenceHome = lazy(() =>
  import('./pages/dashboard/trade/TradeIntelligenceHome').then((module) => ({ default: module.TradeIntelligenceHome })),
);
const CreditAssessmentPage = lazy(() =>
  import('./pages/dashboard/trade/CreditAssessmentPage').then((module) => ({ default: module.CreditAssessmentPage })),
);
const ShippingPredictorPage = lazy(() =>
  import('./pages/dashboard/trade/ShippingPredictorPage').then((module) => ({ default: module.ShippingPredictorPage })),
);
const MatchingPage = lazy(() =>
  import('./pages/dashboard/trade/MatchingPage').then((module) => ({ default: module.MatchingPage })),
);
const TradeAnalyticsPage = lazy(() =>
  import('./pages/dashboard/trade/TradeAnalyticsPage').then((module) => ({ default: module.TradeAnalyticsPage })),
);
const AiToolkitPage = lazy(() =>
  import('./pages/dashboard/trade/AiToolkitPage').then((module) => ({ default: module.AiToolkitPage })),
);
const LeadsPage = lazy(() =>
  import('./pages/dashboard/crm/LeadsPage').then((module) => ({ default: module.LeadsPage })),
);
const AccountsPage = lazy(() =>
  import('./pages/dashboard/crm/AccountsPage').then((module) => ({ default: module.AccountsPage })),
);
const ContactsPage = lazy(() =>
  import('./pages/dashboard/crm/ContactsPage').then((module) => ({ default: module.ContactsPage })),
);
const DealsPage = lazy(() =>
  import('./pages/dashboard/crm/DealsPage').then((module) => ({ default: module.DealsPage })),
);
const InboxPage = lazy(() =>
  import('./pages/dashboard/InboxPage').then((module) => ({ default: module.InboxPage })),
);
const LogisticsPage = lazy(() =>
  import('./pages/dashboard/LogisticsPage').then((module) => ({ default: module.LogisticsPage })),
);
const AICopilotPage = lazy(() =>
  import('./pages/dashboard/AICopilotPage').then((module) => ({ default: module.AICopilotPage })),
);
const SettingsPage = lazy(() =>
  import('./pages/dashboard/SettingsPage').then((module) => ({ default: module.SettingsPage })),
);
const MarketingHubPage = lazy(() =>
  import('./pages/dashboard/marketing/MarketingHubPage').then((module) => ({ default: module.MarketingHubPage })),
);
const MarketingCampaignsPage = lazy(() =>
  import('./pages/dashboard/marketing/MarketingCampaignsPage').then((module) => ({ default: module.MarketingCampaignsPage })),
);
const MarketingChannelsPage = lazy(() =>
  import('./pages/dashboard/marketing/MarketingChannelsPage').then((module) => ({ default: module.MarketingChannelsPage })),
);
const MarketingCreativeStudioPage = lazy(() =>
  import('./pages/dashboard/marketing/MarketingCreativeStudioPage').then((module) => ({ default: module.MarketingCreativeStudioPage })),
);
const MarketingAttributionPage = lazy(() =>
  import('./pages/dashboard/marketing/MarketingAttributionPage').then((module) => ({ default: module.MarketingAttributionPage })),
);
const UltraDashboardPage = lazy(() =>
  import('./pages/dashboard/UltraDashboardPage').then((module) => ({ default: module.UltraDashboardPage })),
);
const WebsitePage = lazy(() =>
  import('./pages/dashboard/WebsitePage').then((module) => ({ default: module.WebsitePage })),
);
const AdminDashboard = lazy(() =>
  import('./pages/admin/AdminDashboard').then((module) => ({ default: module.AdminDashboard })),
);
const TenantsPage = lazy(() =>
  import('./pages/admin/TenantsPage').then((module) => ({ default: module.TenantsPage })),
);
const CMSPage = lazy(() =>
  import('./pages/admin/CMSPage').then((module) => ({ default: module.CMSPage })),
);
const AdminSettingsPage = lazy(() =>
  import('./pages/admin/AdminSettingsPage').then((module) => ({ default: module.AdminSettingsPage })),
);
const MediaEngineAdminPage = lazy(() =>
  import('./pages/admin/mediaEngine/MediaEngineAdminPage').then((module) => ({ default: module.MediaEngineAdminPage })),
);
const MediaBuyerPage = lazy(() =>
  import('./pages/dashboard/mediaBuyer/MediaBuyerPage').then((module) => ({ default: module.MediaBuyerPage })),
);
const PortalLayout = lazy(() =>
  import('./components/portal/PortalLayout').then((module) => ({ default: module.PortalLayout })),
);
const PortalDashboard = lazy(() =>
  import('./pages/portal/PortalDashboard').then((module) => ({ default: module.PortalDashboard })),
);
const PortalShipments = lazy(() =>
  import('./pages/portal/PortalShipments').then((module) => ({ default: module.PortalShipments })),
);
const PortalMessages = lazy(() =>
  import('./pages/portal/PortalMessages').then((module) => ({ default: module.PortalMessages })),
);
const ProductsPage = lazy(() =>
  import('./pages/dashboard/ProductsPage').then((module) => ({ default: module.ProductsPage })),
);
const CompliancePage = lazy(() =>
  import('./pages/dashboard/CompliancePage').then((module) => ({ default: module.CompliancePage })),
);
const CalendarPage = lazy(() =>
  import('./pages/dashboard/CalendarPage').then((module) => ({ default: module.CalendarPage })),
);
const PublishedWebsiteView = lazy(() =>
  import('./pages/public/PublishedWebsiteView').then((module) => ({ default: module.PublishedWebsiteView })),
);
import { Loader2 } from 'lucide-react';
import { useAuth } from './lib/auth-context';

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-xisync-cyan-500" />
    </div>
  );
}

function AuthRequired({ children }: { children: ReactNode }) {
  const { user, profile, loading, error } = useAuth();
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-xisync-cyan-500" /></div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (error) return <div role="alert" className="mx-auto max-w-xl p-8 text-center text-red-700">{error}</div>;
  if (!profile) return <div role="status" className="p-8 text-center">Your XiSync profile is not available.</div>;
  return <>{children}</>;
}

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <PasswordProvider>
          <AuthProvider>
            <CurrencyProvider>
              <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
                <AppGuard>
                  <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/product" element={<ProductPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/integrations" element={<IntegrationsPage />} />
                    <Route path="/demo" element={<DemoPage />} />
                    <Route path="/contact" element={<DemoPage />} />
                    <Route path="/resources" element={<HomePage />} />

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />



                    {/* Public Live Website & Preview Routes */}
                    <Route path="/site/:subdomain" element={<PublishedWebsiteView />} />
                    <Route path="/site/:subdomain/*" element={<PublishedWebsiteView />} />
                    <Route path="/preview/site" element={<PublishedWebsiteView />} />
                    <Route path="/preview/:siteId" element={<PublishedWebsiteView />} />

              <Route path="/dashboard/ultra" element={<AuthRequired><UltraDashboardPage /></AuthRequired>}>
                <Route index element={<TradeCommandCenter />} />
                <Route path="trade-intelligence" element={<TradeIntelligenceHome />} />
                <Route path="trade-intelligence/credit" element={<CreditAssessmentPage />} />
                <Route path="trade-intelligence/shipping" element={<ShippingPredictorPage />} />
                <Route path="trade-intelligence/matching" element={<MatchingPage />} />
                <Route path="trade-intelligence/analytics" element={<TradeAnalyticsPage />} />
                <Route path="trade-intelligence/toolkit" element={<AiToolkitPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="marketing" element={<MarketingHubPage />} />
                <Route path="media-buyer" element={<MediaBuyerPage />} />
                <Route path="marketing/campaigns" element={<MarketingCampaignsPage />} />
                <Route path="marketing/channels" element={<MarketingChannelsPage />} />
                <Route path="marketing/creatives" element={<MarketingCreativeStudioPage />} />
                <Route path="marketing/attribution" element={<MarketingAttributionPage />} />
                <Route path="crm/leads" element={<LeadsPage />} />
                <Route path="crm/accounts" element={<AccountsPage />} />
                <Route path="crm/contacts" element={<ContactsPage />} />
                <Route path="crm/deals" element={<DealsPage />} />
                <Route path="website-builder" element={<WebsitePage />} />
                <Route path="website-builder/build" element={<WebsitePage />} />
                <Route path="website-builder/themes" element={<WebsitePage />} />
                <Route path="website-builder/domains" element={<WebsitePage />} />
                <Route path="website-builder/statistics" element={<WebsitePage />} />
                <Route path="inbox" element={<InboxPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="logistics" element={<LogisticsPage />} />
                <Route path="logistics/map" element={<LogisticsPage />} />
                <Route path="logistics/tracking" element={<LogisticsPage />} />
                <Route path="logistics/rates" element={<LogisticsPage />} />
                <Route path="logistics/ai-optimizer" element={<LogisticsPage />} />
                <Route path="logistics/customs" element={<LogisticsPage />} />
                <Route path="ai-copilot" element={<AICopilotPage />} />
                <Route path="ai-copilot/negotiation" element={<AICopilotPage />} />
                <Route path="ai-copilot/forecast" element={<AICopilotPage />} />
                <Route path="ai-copilot/credit-shield" element={<AICopilotPage />} />
                <Route path="compliance" element={<CompliancePage />} />
                <Route path="analytics" element={<DashboardHome />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="settings/channels" element={<SettingsPage />} />
                <Route path="settings/api" element={<SettingsPage />} />
                <Route path="settings/workflow" element={<SettingsPage />} />
                <Route path="settings/profile" element={<SettingsPage />} />
                <Route path="settings/ai-rules" element={<SettingsPage />} />
                <Route path="settings/logistics-settings" element={<SettingsPage />} />
                <Route path="settings/security-compliance" element={<SettingsPage />} />
                <Route path="settings/notifications" element={<SettingsPage />} />
              </Route>

              <Route path="/dashboard" element={<AuthRequired><DashboardLayout /></AuthRequired>}>
                <Route index element={<TradeCommandCenter />} />
                <Route path="trade-intelligence" element={<TradeIntelligenceHome />} />
                <Route path="trade-intelligence/credit" element={<CreditAssessmentPage />} />
                <Route path="trade-intelligence/shipping" element={<ShippingPredictorPage />} />
                <Route path="trade-intelligence/matching" element={<MatchingPage />} />
                <Route path="trade-intelligence/analytics" element={<TradeAnalyticsPage />} />
                <Route path="trade-intelligence/toolkit" element={<AiToolkitPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="marketing" element={<MarketingHubPage />} />
                <Route path="media-buyer" element={<MediaBuyerPage />} />
                <Route path="marketing/campaigns" element={<MarketingCampaignsPage />} />
                <Route path="marketing/channels" element={<MarketingChannelsPage />} />
                <Route path="marketing/creatives" element={<MarketingCreativeStudioPage />} />
                <Route path="marketing/attribution" element={<MarketingAttributionPage />} />
                <Route path="crm/leads" element={<LeadsPage />} />
                <Route path="crm/accounts" element={<AccountsPage />} />
                <Route path="crm/contacts" element={<ContactsPage />} />
                <Route path="crm/deals" element={<DealsPage />} />
                <Route path="website-builder" element={<WebsitePage />} />
                <Route path="website-builder/build" element={<WebsitePage />} />
                <Route path="website-builder/themes" element={<WebsitePage />} />
                <Route path="website-builder/domains" element={<WebsitePage />} />
                <Route path="website-builder/statistics" element={<WebsitePage />} />
                <Route path="inbox" element={<InboxPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="logistics" element={<LogisticsPage />} />
                <Route path="logistics/map" element={<LogisticsPage />} />
                <Route path="logistics/tracking" element={<LogisticsPage />} />
                <Route path="logistics/rates" element={<LogisticsPage />} />
                <Route path="logistics/ai-optimizer" element={<LogisticsPage />} />
                <Route path="logistics/customs" element={<LogisticsPage />} />
                <Route path="ai-copilot" element={<AICopilotPage />} />
                <Route path="ai-copilot/negotiation" element={<AICopilotPage />} />
                <Route path="ai-copilot/forecast" element={<AICopilotPage />} />
                <Route path="ai-copilot/credit-shield" element={<AICopilotPage />} />
                <Route path="compliance" element={<CompliancePage />} />
                <Route path="analytics" element={<DashboardHome />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="settings/channels" element={<SettingsPage />} />
                <Route path="settings/api" element={<SettingsPage />} />
                <Route path="settings/workflow" element={<SettingsPage />} />
                <Route path="settings/profile" element={<SettingsPage />} />
                <Route path="settings/ai-rules" element={<SettingsPage />} />
                <Route path="settings/logistics-settings" element={<SettingsPage />} />
                <Route path="settings/security-compliance" element={<SettingsPage />} />
                <Route path="settings/notifications" element={<SettingsPage />} />
              </Route>

              <Route path="/admin" element={<AuthRequired><DashboardLayout variant="admin" /></AuthRequired>}>
                <Route index element={<AdminDashboard />} />
                <Route path="tenants" element={<TenantsPage />} />
                <Route path="users" element={<TenantsPage />} />
                <Route path="cms" element={<CMSPage />} />
                <Route path="media-engine" element={<MediaEngineAdminPage />} />
                <Route path="billing" element={<AdminDashboard />} />
                <Route path="integrations" element={<AdminDashboard />} />
                <Route path="security" element={<AdminDashboard />} />
                <Route path="analytics" element={<AdminDashboard />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              <Route path="/portal" element={<AuthRequired><PortalLayout /></AuthRequired>}>
                <Route index element={<PortalDashboard />} />
                <Route path="messages" element={<PortalMessages />} />
                <Route path="orders" element={<PortalDashboard />} />
                <Route path="shipments" element={<PortalShipments />} />
                <Route path="documents" element={<PortalDashboard />} />
                <Route path="support" element={<PortalMessages />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  </Suspense>
                </AppGuard>
              </BrowserRouter>
            </CurrencyProvider>
          </AuthProvider>
        </PasswordProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
