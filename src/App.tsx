import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PortalProvider, usePortal } from './utils/PortalContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer } from './components/ToastContainer';

import { LoginPage } from './pages/LoginPage';
import { AccessDeniedPage } from './pages/errors/AccessDeniedPage';
import { NotFoundPage } from './pages/errors/NotFoundPage';

import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDocuments } from './pages/admin/AdminDocuments';
import { AdminBills } from './pages/admin/AdminBills';
import { AdminNotices } from './pages/admin/AdminNotices';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminMeetings } from './pages/admin/AdminMeetings';
import { AdminForms } from './pages/admin/AdminForms';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminVillageInfo } from './pages/admin/AdminVillageInfo';
import { AdminMembers } from './pages/admin/AdminMembers';
import { AdminUploadCenter } from './pages/admin/AdminUploadCenter';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';

import { MemberLayout } from './layouts/MemberLayout';
import { MemberDashboard } from './pages/member/MemberDashboard';
import { MemberDocuments } from './pages/member/MemberDocuments';
import { MemberNotices } from './pages/member/MemberNotices';
import { MemberProjects } from './pages/member/MemberProjects';
import { MemberFinance } from './pages/member/MemberFinance';
import { MemberMeetings } from './pages/member/MemberMeetings';
import { MemberForms } from './pages/member/MemberForms';
import { MemberGallery } from './pages/member/MemberGallery';
import { MemberProfile } from './pages/member/MemberProfile';

const RoleShortcutRedirect: React.FC<{ adminPath: string; memberPath: string }> = ({
  adminPath,
  memberPath,
}) => {
  const { currentUser } = usePortal();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={currentUser.role === 'admin' ? adminPath : memberPath} replace />;
};

export default function App() {
  return (
    <PortalProvider>
      <BrowserRouter>
        <Routes>
          {/* Root starts directly at /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Top-level convenience redirects for direct navigation */}
          <Route
            path="/documents"
            element={<RoleShortcutRedirect adminPath="/admin/documents" memberPath="/member/documents" />}
          />
          <Route
            path="/notices"
            element={<RoleShortcutRedirect adminPath="/admin/notices" memberPath="/member/notices" />}
          />
          <Route
            path="/settings"
            element={<RoleShortcutRedirect adminPath="/admin/settings" memberPath="/member/profile" />}
          />

          {/* Admin Portal Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="bills" element={<AdminBills />} />
            <Route path="notices" element={<AdminNotices />} />
            <Route path="development-works" element={<AdminProjects />} />
            <Route path="meetings" element={<AdminMeetings />} />
            <Route path="forms" element={<AdminForms />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="village-info" element={<AdminVillageInfo />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="upload-center" element={<AdminUploadCenter />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Member / Citizen Portal Routes */}
          <Route
            path="/member"
            element={
              <ProtectedRoute allowedRole="member">
                <MemberLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/member/dashboard" replace />} />
            <Route path="dashboard" element={<MemberDashboard />} />
            <Route path="documents" element={<MemberDocuments />} />
            <Route path="notices" element={<MemberNotices />} />
            <Route path="development-works" element={<MemberProjects />} />
            <Route path="finance" element={<MemberFinance />} />
            <Route path="meetings" element={<MemberMeetings />} />
            <Route path="forms" element={<MemberForms />} />
            <Route path="gallery" element={<MemberGallery />} />
            <Route path="village-info" element={<AdminVillageInfo isMemberView />} />
            <Route path="profile" element={<MemberProfile />} />
          </Route>

          {/* Error Routes */}
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </PortalProvider>
  );
}
