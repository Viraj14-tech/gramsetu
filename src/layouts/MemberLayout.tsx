import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Bell,
  HardHat,
  Scale,
  Users,
  FileSpreadsheet,
  Image,
  Landmark,
  User,
  LogOut,
  Search,
  Menu,
  X,
  Calendar,
  CheckCheck,
} from 'lucide-react';
import { usePortal } from '../utils/PortalContext';
import { CivicEmblem } from '../components/CivicEmblem';
import { DocumentPreviewModal } from '../components/DocumentPreviewModal';
import { GlobalSearchModal } from '../components/GlobalSearchModal';

const MEMBER_NAV = [
  { label: 'Dashboard', to: '/member/dashboard', icon: LayoutDashboard },
  { label: 'Documents', to: '/member/documents', icon: FileText },
  { label: 'Notices', to: '/member/notices', icon: Bell },
  { label: 'Development Works', to: '/member/development-works', icon: HardHat },
  { label: 'Bills & Expenditure', to: '/member/finance', icon: Scale },
  { label: 'Meeting Records', to: '/member/meetings', icon: Users },
  { label: 'Forms', to: '/member/forms', icon: FileSpreadsheet },
  { label: 'Gallery', to: '/member/gallery', icon: Image },
  { label: 'Village Information', to: '/member/village-info', icon: Landmark },
  { label: 'Profile', to: '/member/profile', icon: User },
];

export const MemberLayout: React.FC = () => {
  const {
    logout,
    notifications,
    markAllNotificationsRead,
    setIsSearchOpen,
  } = usePortal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentNav =
    MEMBER_NAV.find((item) => location.pathname.startsWith(item.to)) || MEMBER_NAV[0];

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
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Citizen Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-[#174C3C] text-white transition-transform duration-200 lg:static ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/15 px-4 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#EEF4F0]">
              <CivicEmblem size={28} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-tight text-white">
                Lakhlgoan GP
              </p>
              <p className="truncate text-[11px] text-[#EEF4F0]/75">
                Citizen & Member Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded p-1 text-white/80 hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
          {MEMBER_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#236A52] text-white font-semibold'
                      : 'text-[#EEF4F0]/85 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/15 p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-[#EEF4F0]/90 hover:bg-[#C74A4A] hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#DDE5E0] bg-white px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-[#DDE5E0] p-2 text-[#1E2925] hover:bg-[#EEF4F0] lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="truncate text-base sm:text-lg font-bold text-[#1E2925]">
              {currentNav.label}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2.5 rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] px-3 py-1.5 text-xs text-[#69766F] hover:border-[#236A52] hover:text-[#1E2925] transition-colors w-36 sm:w-60"
            >
              <Search className="h-3.5 w-3.5 text-[#174C3C] shrink-0" />
              <span className="truncate">Search public records...</span>
            </button>

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
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-4 py-3">
                      <span className="text-xs font-bold text-[#1E2925]">
                        Village Updates ({unreadCount} new)
                      </span>
                      <button
                        onClick={markAllNotificationsRead}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#174C3C] hover:underline"
                      >
                        <CheckCheck className="h-3.5 w-3.5" /> Mark read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#DDE5E0]">
                      {notifications.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setNotifOpen(false);
                            if (item.link === '/notices') navigate('/member/notices');
                            else if (item.link === '/projects') navigate('/member/development-works');
                            else navigate('/member/documents');
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

            <div className="flex items-center gap-2.5 border-l border-[#DDE5E0] pl-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#236A52] text-xs font-bold text-white">
                RP
              </div>
              <div className="hidden md:block leading-tight">
                <p className="text-xs font-bold text-[#1E2925] whitespace-nowrap">
                  Ramesh Patil
                </p>
                <p className="text-[11px] text-[#69766F] whitespace-nowrap">
                  Member • Ward 1 (LGP001)
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>

        <footer className="border-t border-[#DDE5E0] bg-white px-6 py-3 text-xs text-[#69766F] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#174C3C]">
              Lakhlgoan Gram Panchayat Citizen Portal
            </span>
            <span>·</span>
            <span>Public Transparency & Records Access</span>
          </div>
          <div className="text-[11px] text-[#69766F]">
            Academic Prototype — Demo Data • For Educational Demonstration Only
          </div>
        </footer>
      </div>

      <DocumentPreviewModal />
      <GlobalSearchModal />
    </div>
  );
};
