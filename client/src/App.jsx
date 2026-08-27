import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicDataProvider } from './context/PublicDataContext';

// Public Layout & Pages
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/HomePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CaseStudyDetailPage from './pages/CaseStudyDetailPage';
import ContactPage from './pages/ContactPage';
import QuotePage from './pages/QuotePage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Auth & Protected Layout
import AdminLoginPage from './admin/pages/AdminLoginPage';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import AdminEnquiriesPage from './admin/pages/AdminEnquiriesPage';
import AdminQuotesPage from './admin/pages/AdminQuotesPage';
import AdminServicesPage from './admin/pages/AdminServicesPage';
import AdminProjectsPage from './admin/pages/AdminProjectsPage';
import AdminCaseStudiesPage from './admin/pages/AdminCaseStudiesPage';
import AdminFounderPage from './admin/pages/AdminFounderPage';
import AdminTeamPage from './admin/pages/AdminTeamPage';
import AdminTestimonialsPage from './admin/pages/AdminTestimonialsPage';
import AdminFaqsPage from './admin/pages/AdminFaqsPage';
import AdminSettingsPage from './admin/pages/AdminSettingsPage';
import AdminSocialLinksPage from './admin/pages/AdminSocialLinksPage';
import AdminLayout from './admin/layouts/AdminLayout';
import AdminProtectedRoute from './admin/routes/AdminProtectedRoute';
import PublicAdminRoute from './admin/routes/PublicAdminRoute';

export default function App() {
  return (
    <AuthProvider>
      <PublicDataProvider>
        <Router>
          <Routes>
            {/* Public Customer Website Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="projects/:slug" element={<ProjectDetailPage />} />
              <Route path="case-studies/:slug" element={<CaseStudyDetailPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="get-a-quote" element={<QuotePage />} />
            </Route>

            {/* Admin Authentication Route (Public Only for Admins) */}
            <Route
              path="/admin/login"
              element={
                <PublicAdminRoute>
                  <AdminLoginPage />
                </PublicAdminRoute>
              }
            />

            {/* Protected Admin Portal Shell Routes */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="enquiries" element={<AdminEnquiriesPage />} />
              <Route path="quotes" element={<AdminQuotesPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="case-studies" element={<AdminCaseStudiesPage />} />
              <Route path="founder" element={<AdminFounderPage />} />
              <Route path="team" element={<AdminTeamPage />} />
              <Route path="testimonials" element={<AdminTestimonialsPage />} />
              <Route path="faqs" element={<AdminFaqsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="social-links" element={<AdminSocialLinksPage />} />
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </PublicDataProvider>
    </AuthProvider>
  );
}
