import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Bell,
  HardHat,
  Users,
  FileSpreadsheet,
  Image,
  Landmark,
  UserCheck,
  UploadCloud,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCheck,
} from 'lucide-react';
import { usePortal } from '../utils/PortalContext';
import { CivicEmblem } from '../components/CivicEmblem';
import { DocumentPreviewModal } from '../components/DocumentPreviewModal';
import { UploadDocumentModal } from '../components/UploadDocumentModal';
import { GlobalSearchModal } from '../components/GlobalSearchModal';

const ADMIN_NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Documents', to: '/admin/documents', icon: FileText },
  { label: 'Bills & Expenses', to: '/admin/bills', icon: Receipt },
  { label: 'Notices', to: '/admin/notices', icon: Bell },
  { label: 'Development Works', to: '/admin/development-works', icon: HardHat },
  { label: 'Meeting Records', to: '/admin/meetings', icon: Users },
  { label: 'Certificates & Forms', to: '/admin/forms', icon: FileSpreadsheet },
  { label: 'Photo Gallery', to: '/admin/gallery', icon: Image },
  { label: 'Village Information', to: '/admin/village-info', icon: Landmark },
  { label: 'Members', to: '/admin/members', icon: UserCheck },
  { label: 'Upload Center', to: '/admin/upload-center', icon: UploadCloud },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const {
    logout,
    notifications,
    markAllNotificationsRead,
    setIsSearchOpen,
  } = usePortal();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentNav =
    ADMIN_NAV.find((item) => location.pathname.startsWith(item.to)) || ADMIN_NAV[0];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-[#F7F8F5] text-[#1E2925]">
      {/* Mobile Sidebar Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#174C3C] text-white transition-all duration-200 lg:static ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-white/15 px-4 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#EEF4F0]">
              <CivicEmblem size={28} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-tight text-white">
                  Lakhlgoan GP
                </p>
                <p className="truncate text-[11px] text-[#EEF4F0]/75">
                  Administration Portal
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded p-1 text-white/80 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#236A52] text-white shadow-xs font-semibold'
                      : 'text-[#EEF4F0]/85 hover:bg-white/10 hover:text-white'
                  } ${collapsed ? 'justify-center' : ''}`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Logout & Collapse Controls */}
        <div className="border-t border-white/15 p-2.5 space-y-1">
          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-[#EEF4F0]/90 hover:bg-[#C74A4A] hover:text-white transition-colors whitespace-nowrap ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 rounded-lg py-2 text-[11px] text-[#EEF4F0]/70 hover:bg-white/10 hover:text-white transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Collapse Menu</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#DDE5E0] bg-white px-4 sm:px-6 py-3">
          {/* Left: Mobile Menu + Page Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-[#DDE5E0] p-2 text-[#1E2925] hover:bg-[#EEF4F0] lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-base sm:text-lg font-bold text-[#1E2925]">
                {currentNav.label}
              </h1>
            </div>
          </div>

          {/* Center/Right Controls: Search, Date, Notifications, Profile */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Global Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2.5 rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] px-3 py-1.5 text-xs text-[#69766F] hover:border-[#236A52] hover:text-[#1E2925] transition-colors w-36 sm:w-60"
            >
              <Search className="h-3.5 w-3.5 text-[#174C3C] shrink-0" />
              <span className="truncate">Search records, notices...</span>
            </button>

            {/* Current Date */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs font-medium text-[#69766F] border-r border-[#DDE5E0] pr-4 whitespace-nowrap">
              <Calendar className="h-3.5 w-3.5 text-[#236A52]" />
              <span className="font-mono-num">{todayFormatted}</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative rounded-lg border border-[#DDE5E0] bg-white p-2 text-[#1E2925] hover:bg-[#EEF4F0] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4 text-[#174C3C]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D99528] text-[10px] font-bold text-white font-mono-num">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotifOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-4 py-3">
                      <span className="text-xs font-bold text-[#1E2925]">
                        Portal Notifications ({unreadCount} unread)
                      </span>
                      <button
                        onClick={markAllNotificationsRead}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#174C3C] hover:underline"
                      >
                        <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#DDE5E0]">
                      {notifications.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setNotifOpen(false);
                            if (item.link === '/notices') navigate('/admin/notices');
                            else if (item.link === '/projects') navigate('/admin/development-works');
                            else navigate('/admin/documents');
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-[#F7F8F5] transition-colors ${
                            !item.read ? 'bg-[#EEF4F0]/40' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-[#174C3C]">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-[#69766F] font-mono-num">
                              {item.date}
                            </span>
                          </div>
                          <p className="text-xs text-[#1E2925] mt-0.5 leading-snug">
                            {item.message}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-2.5 border-l border-[#DDE5E0] pl-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#174C3C] text-xs font-bold text-white">
                GS
              </div>
              <div className="hidden md:block leading-tight">
                <p className="text-xs font-bold text-[#1E2925] whitespace-nowrap">
                  Gram Sevak
                </p>
                <p className="text-[11px] text-[#69766F] whitespace-nowrap">
                  Lakhlgoan Gram Panchayat
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>

        {/* Discrete Academic Prototype Footer */}
        <footer className="border-t border-[#DDE5E0] bg-white px-6 py-3 text-xs text-[#69766F] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#174C3C]">
              Lakhlgoan Gram Panchayat Digital Records Portal
            </span>
            <span>·</span>
            <span>Administration Console</span>
          </div>
          <div className="text-[11px] text-[#69766F]">
            Academic Prototype — Demo Data • For Educational Demonstration Only
          </div>
        </footer>
      </div>

      {/* Shared Modals */}
      <DocumentPreviewModal />
      <UploadDocumentModal />
      <GlobalSearchModal />
    </div>
  );
};
