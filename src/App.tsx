import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';
import { I18nProvider } from './lib/i18n';
import { ThemeProvider } from './lib/theme-context';

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

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TenantsPage } from './pages/admin/TenantsPage';

import { PortalLayout } from './components/portal/PortalLayout';
import { PortalDashboard } from './pages/portal/PortalDashboard';
import { PortalShipments } from './pages/portal/PortalShipments';
import { PortalMessages } from './pages/portal/PortalMessages';

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
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

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="crm/leads" element={<LeadsPage />} />
            <Route path="crm/accounts" element={<LeadsPage />} />
            <Route path="crm/contacts" element={<LeadsPage />} />
            <Route path="crm/deals" element={<DealsPage />} />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="products" element={<LeadsPage />} />
            <Route path="logistics" element={<LogisticsPage />} />
            <Route path="compliance" element={<LeadsPage />} />
            <Route path="analytics" element={<DashboardHome />} />
            <Route path="settings" element={<LeadsPage />} />
          </Route>

          <Route path="/admin" element={<DashboardLayout variant="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="tenants" element={<TenantsPage />} />
            <Route path="users" element={<TenantsPage />} />
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
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
