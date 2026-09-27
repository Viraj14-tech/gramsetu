import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';

export const AccessDeniedPage: React.FC = () => {
  const { currentUser } = usePortal();
  const homeLink =
    currentUser?.role === 'admin'
      ? '/admin/dashboard'
      : currentUser?.role === 'member'
      ? '/member/dashboard'
      : '/login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8F5] p-6">
      <div className="max-w-md w-full rounded-xl border border-[#DDE5E0] bg-white p-8 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#C74A4A]/10 text-[#C74A4A]">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-[#1E2925]">Access Restricted</h1>
        <p className="mt-2 text-sm text-[#69766F] leading-relaxed">
          Your current role ({currentUser ? currentUser.role.toUpperCase() : 'Guest'}) does not have
          permission to view this section of the Lakhlgoan Gram Panchayat Portal.
        </p>
        <div className="mt-6">
          <Link
            to={homeLink}
            className="inline-flex items-center gap-2 rounded-lg bg-[#174C3C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#236A52] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Authorized Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
