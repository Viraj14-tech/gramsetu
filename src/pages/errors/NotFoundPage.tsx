import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';

export const NotFoundPage: React.FC = () => {
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
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF4F0] text-[#174C3C]">
          <FileQuestion className="h-7 w-7" />
        </div>
        <p className="font-mono-num text-xs font-bold uppercase tracking-wider text-[#236A52]">
          Error 404
        </p>
        <h1 className="mt-1 text-xl font-bold text-[#1E2925]">Record or Page Not Found</h1>
        <p className="mt-2 text-sm text-[#69766F] leading-relaxed">
          The requested page or Gram Panchayat file path does not exist in this prototype.
        </p>
        <div className="mt-6">
          <Link
            to={homeLink}
            className="inline-flex items-center gap-2 rounded-lg bg-[#174C3C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#236A52] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
