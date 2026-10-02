import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { LeadsPage } from './pages/dashboard/crm/LeadsPage';
import { AccountsPage } from './pages/dashboard/crm/AccountsPage';
import { ContactsPage } from './pages/dashboard/crm/ContactsPage';
import { DealsPage } from './pages/dashboard/crm/DealsPage';
import { InboxPage } from './pages/dashboard/InboxPage';
import { LogisticsPage } from './pages/dashboard/LogisticsPage';
import { AICopilotPage } from './pages/dashboard/AICopilotPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';
import { MarketingHubPage } from './pages/dashboard/marketing/MarketingHubPage';
import { MarketingCampaignsPage } from './pages/dashboard/marketing/MarketingCampaignsPage';
import { MarketingChannelsPage } from './pages/dashboard/marketing/MarketingChannelsPage';
import { MarketingCreativeStudioPage } from './pages/dashboard/marketing/MarketingCreativeStudioPage';
import { MarketingAttributionPage } from './pages/dashboard/marketing/MarketingAttributionPage';
import { UltraDashboardPage } from './pages/dashboard/UltraDashboardPage';
import { WebsitePage } from './pages/dashboard/WebsitePage';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TenantsPage } from './pages/admin/TenantsPage';
import { CMSPage } from './pages/admin/CMSPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { MediaEngineAdminPage } from './pages/admin/mediaEngine/MediaEngineAdminPage';
import { MediaBuyerPage } from './pages/dashboard/mediaBuyer/MediaBuyerPage';

import { PortalLayout } from './components/portal/PortalLayout';
import { PortalDashboard } from './pages/portal/PortalDashboard';
import { PortalShipments } from './pages/portal/PortalShipments';
import { PortalMessages } from './pages/portal/PortalMessages';

import { ProductsPage } from './pages/dashboard/ProductsPage';
import { CompliancePage } from './pages/dashboard/CompliancePage';
import { CalendarPage } from './pages/dashboard/CalendarPage';
import { PublishedWebsiteView } from './pages/public/PublishedWebsiteView';
import { Loader2 } from 'lucide-react';
import { useAuth } from './lib/auth-context';

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
                <Route index element={<DashboardHome />} />
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
