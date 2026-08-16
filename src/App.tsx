import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TenantsPage } from './pages/admin/TenantsPage';
import { CMSPage } from './pages/admin/CMSPage';

import { PortalLayout } from './components/portal/PortalLayout';
import { PortalDashboard } from './pages/portal/PortalDashboard';
import { PortalShipments } from './pages/portal/PortalShipments';
import { PortalMessages } from './pages/portal/PortalMessages';

import { ProductsPage } from './pages/dashboard/ProductsPage';
import { CompliancePage } from './pages/dashboard/CompliancePage';
import { CalendarPage } from './pages/dashboard/CalendarPage';

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <PasswordProvider>
          <AuthProvider>
            <CurrencyProvider>
              <BrowserRouter>
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

              <Route path="/dashboard/ultra" element={<UltraDashboardPage />}>
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="marketing" element={<MarketingHubPage />} />
                <Route path="marketing/campaigns" element={<MarketingCampaignsPage />} />
                <Route path="marketing/channels" element={<MarketingChannelsPage />} />
                <Route path="marketing/creatives" element={<MarketingCreativeStudioPage />} />
                <Route path="marketing/attribution" element={<MarketingAttributionPage />} />
                <Route path="crm/leads" element={<LeadsPage />} />
                <Route path="crm/accounts" element={<LeadsPage />} />
                <Route path="crm/contacts" element={<LeadsPage />} />
                <Route path="crm/deals" element={<DealsPage />} />
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
                <Route path="settings/workflow" element={<SettingsPage />} />
                <Route path="settings/profile" element={<SettingsPage />} />
                <Route path="settings/ai-rules" element={<SettingsPage />} />
                <Route path="settings/logistics-settings" element={<SettingsPage />} />
                <Route path="settings/security-compliance" element={<SettingsPage />} />
                <Route path="settings/notifications" element={<SettingsPage />} />
              </Route>

              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="marketing" element={<MarketingHubPage />} />
                <Route path="marketing/campaigns" element={<MarketingCampaignsPage />} />
                <Route path="marketing/channels" element={<MarketingChannelsPage />} />
                <Route path="marketing/creatives" element={<MarketingCreativeStudioPage />} />
                <Route path="marketing/attribution" element={<MarketingAttributionPage />} />
                <Route path="crm/leads" element={<LeadsPage />} />
                <Route path="crm/accounts" element={<LeadsPage />} />
                <Route path="crm/contacts" element={<LeadsPage />} />
                <Route path="crm/deals" element={<DealsPage />} />
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
                <Route path="settings/workflow" element={<SettingsPage />} />
                <Route path="settings/profile" element={<SettingsPage />} />
                <Route path="settings/ai-rules" element={<SettingsPage />} />
                <Route path="settings/logistics-settings" element={<SettingsPage />} />
                <Route path="settings/security-compliance" element={<SettingsPage />} />
                <Route path="settings/notifications" element={<SettingsPage />} />
              </Route>

              <Route path="/admin" element={<DashboardLayout variant="admin" />}>
                <Route index element={<AdminDashboard />} />
                <Route path="tenants" element={<TenantsPage />} />
                <Route path="users" element={<TenantsPage />} />
                <Route path="cms" element={<CMSPage />} />
                <Route path="billing" element={<AdminDashboard />} />
                <Route path="integrations" element={<AdminDashboard />} />
                <Route path="security" element={<AdminDashboard />} />
                <Route path="analytics" element={<AdminDashboard />} />
                <Route path="settings" element={<AdminDashboard />} />
              </Route>

              <Route path="/portal" element={<PortalLayout />}>
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
