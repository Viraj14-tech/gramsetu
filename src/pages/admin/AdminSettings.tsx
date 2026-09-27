import React from 'react';
import { RotateCcw, ShieldCheck, HardDrive, Database } from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export const AdminSettings: React.FC = () => {
  const { resetDemoData } = usePortal();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Portal Settings' },
        ]}
      />

      <div className="border-b border-[#DDE5E0] pb-5">
        <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
          Portal Configuration &amp; Demo Controls
        </h2>
        <p className="mt-1 text-sm text-[#69766F]">
          Manage local prototype storage, role access rules, and academic demonstration state.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role & Security Summary */}
        <div className="rounded-xl border border-[#DDE5E0] bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF4F0] text-[#174C3C]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E2925]">
                Role-Based Access Control (RBAC)
              </h3>
              <p className="text-xs text-[#69766F]">
                Configured permissions for Admin vs Citizen/Member accounts
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#1E2925] pt-2">
            <div className="rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-3.5">
              <p className="font-bold text-[#174C3C]">1. Admin Role (Gram Sevak / Staff)</p>
              <p className="text-[#69766F] mt-1">
                Full read/write access to all public and internal documents, vendor bills, notices,
                project progress updates, member activation, and CSV/PDF reports.
              </p>
            </div>

            <div className="rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-3.5">
              <p className="font-bold text-[#236A52]">2. Member / Villager Role (Citizen)</p>
              <p className="text-[#69766F] mt-1">
                Read-only transparency access strictly restricted to records marked{' '}
                <code className="font-mono-num text-[#174C3C]">visibility = public</code>. Internal
                tax registers, draft documents, and administrative controls are hidden.
              </p>
            </div>
          </div>
        </div>

        {/* Local Storage & Demo Data Reset */}
        <div className="rounded-xl border border-[#DDE5E0] bg-white p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF4F0] text-[#174C3C]">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E2925]">
                  Academic Prototype Data Management
                </h3>
                <p className="text-xs text-[#69766F]">
                  Local JSON data + browser localStorage persistence
                </p>
              </div>
            </div>

            <p className="text-xs text-[#69766F] leading-relaxed">
              Any documents uploaded, bills added, notices published, or project updates made during
              your evaluation session are stored locally in your browser. Click the button below at
              any time to restore the default college presentation dataset.
            </p>

            <div className="rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-3.5 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-medium text-[#1E2925]">
                <HardDrive className="h-4 w-4 text-[#236A52]" /> Repository Storage Quota
              </span>
              <span className="font-mono-num font-bold text-[#174C3C]">1.8 GB / 5.0 GB (36%)</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DDE5E0] flex justify-end">
            <button
              onClick={resetDemoData}
              className="inline-flex items-center gap-2 rounded-lg border border-[#C74A4A] bg-white px-4 py-2.5 text-xs font-semibold text-[#C74A4A] hover:bg-[#C74A4A] hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Demo Data to Initial State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
