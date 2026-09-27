import React from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { usePortal } from '../utils/PortalContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = usePortal();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const iconMap = {
          success: <CheckCircle2 className="h-4 w-4 shrink-0 text-[#174C3C]" />,
          info: <Info className="h-4 w-4 shrink-0 text-[#236A52]" />,
          warning: <AlertTriangle className="h-4 w-4 shrink-0 text-[#D99528]" />,
          error: <XCircle className="h-4 w-4 shrink-0 text-[#C74A4A]" />,
        };

        const borderMap = {
          success: 'border-l-4 border-l-[#174C3C]',
          info: 'border-l-4 border-l-[#236A52]',
          warning: 'border-l-4 border-l-[#D99528]',
          error: 'border-l-4 border-l-[#C74A4A]',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-lg border border-[#DDE5E0] bg-white px-4 py-3 shadow-md transition-all duration-150 ${borderMap[toast.type]}`}
          >
            <div className="flex items-center gap-2.5">
              {iconMap[toast.type]}
              <p className="text-sm font-medium text-[#1E2925]">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="rounded p-1 text-[#69766F] hover:bg-[#EEF4F0] hover:text-[#1E2925] transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
