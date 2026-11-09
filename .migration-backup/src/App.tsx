import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';
import { I18nProvider } from './lib/i18n';
import { ThemeProvider } from './lib/theme-context';
import { PasswordProvider } from './lib/password-context';
import { CurrencyProvider } from './lib/currency-context';
import { AppGuard } from './components/AppGuard';

import { HomePage } from './pages/marketing/HomePage';
import { ProductPage } from './pages/marketing/ProductPage';
import { SolutionsPage } from './pages/marketing/SolutionsPage';
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
import { MarketplaceChannelsAdminPage } from './pages/admin/marketplace/MarketplaceChannelsAdminPage';
import { MediaBuyerPage } from './pages/dashboard/mediaBuyer/MediaBuyerPage';

import { PortalLayout } from './components/portal/PortalLayout';
import { PortalDashboard } from './pages/portal/PortalDashboard';
import { PortalShipments } from './pages/portal/PortalShipments';
import { PortalMessages } from './pages/portal/PortalMessages';

import { ProductsPage } from './pages/dashboard/ProductsPage';
import { ProductVideoStudioPage } from './pages/dashboard/products/ProductVideoStudioPage';
import { MarketplaceHubPage } from './pages/dashboard/marketplace/MarketplaceHubPage';
import { MarketplaceCatalogPage } from './pages/dashboard/marketplace/MarketplaceCatalogPage';
import { MarketplaceImportQueuePage } from './pages/dashboard/marketplace/MarketplaceImportQueuePage';
import { MarketplaceHistoryPage } from './pages/dashboard/marketplace/MarketplaceHistoryPage';
import { CompliancePage } from './pages/dashboard/CompliancePage';
import { CalendarPage } from './pages/dashboard/CalendarPage';
import { PublishedWebsiteView } from './pages/public/PublishedWebsiteView';

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
                    <Route path="/solutions" element={<SolutionsPage />} />
                    <Route path="/solutions/:industry" element={<SolutionsPage />} />
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

              <Route path="/dashboard/ultra" element={<UltraDashboardPage />}>
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
                <Route path="products/video-studio" element={<ProductVideoStudioPage />} />
                <Route path="marketplaces" element={<MarketplaceHubPage />} />
                <Route path="marketplaces/catalog" element={<MarketplaceCatalogPage />} />
                <Route path="marketplaces/imports" element={<MarketplaceImportQueuePage />} />
                <Route path="marketplaces/history" element={<MarketplaceHistoryPage />} />
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

              <Route path="/dashboard" element={<DashboardLayout />}>
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
                <Route path="products/video-studio" element={<ProductVideoStudioPage />} />
                <Route path="marketplaces" element={<MarketplaceHubPage />} />
                <Route path="marketplaces/catalog" element={<MarketplaceCatalogPage />} />
                <Route path="marketplaces/imports" element={<MarketplaceImportQueuePage />} />
                <Route path="marketplaces/history" element={<MarketplaceHistoryPage />} />
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

              <Route path="/admin" element={<DashboardLayout variant="admin" />}>
                <Route index element={<AdminDashboard />} />
                <Route path="tenants" element={<TenantsPage />} />
                <Route path="users" element={<TenantsPage />} />
                <Route path="cms" element={<CMSPage />} />
                <Route path="media-engine" element={<MediaEngineAdminPage />} />
                <Route path="marketplace-channels" element={<MarketplaceChannelsAdminPage />} />
                <Route path="billing" element={<AdminDashboard />} />
                <Route path="integrations" element={<AdminDashboard />} />
                <Route path="security" element={<AdminDashboard />} />
                <Route path="analytics" element={<AdminDashboard />} />
                <Route path="settings" element={<AdminSettingsPage />} />
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
