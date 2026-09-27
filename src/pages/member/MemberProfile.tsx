import React from 'react';
import { User, Home, Phone, ShieldCheck, CheckCircle2, Download } from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export const MemberProfile: React.FC = () => {
  const { showToast } = usePortal();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Citizen Profile' },
        ]}
      />

      <div className="border-b border-[#DDE5E0] pb-5">
        <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
          Registered Villager Profile
        </h2>
        <p className="mt-1 text-sm text-[#69766F]">
          Household registration summary and Gram Panchayat citizen membership record (Demo Data).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-7 rounded-xl border border-[#DDE5E0] bg-white p-6 space-y-6">
          <div className="flex items-center gap-4 border-b border-[#DDE5E0] pb-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#174C3C] text-xl font-bold text-white">
              RP
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-[#69766F]">
                <span className="font-mono-num font-bold text-[#174C3C]">Member ID: LGP001</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#174C3C]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Active Citizen Account
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1E2925] mt-0.5">Ramesh Patil</h3>
              <p className="text-xs text-[#69766F]">
                Registered Resident • Lakhlgoan Gram Panchayat
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-3.5">
              <span className="text-xs text-[#69766F] flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5 text-[#174C3C]" /> Ward &amp; House Number
              </span>
              <p className="font-semibold text-[#1E2925] mt-1">
                Ward 1 • House No. <span className="font-mono-num">112</span>
              </p>
            </div>

            <div className="rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-3.5">
              <span className="text-xs text-[#69766F] flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-[#236A52]" /> Registered Mobile
              </span>
              <p className="font-mono-num font-semibold text-[#1E2925] mt-1">98XXXXXX21</p>
            </div>

            <div className="rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-3.5">
              <span className="text-xs text-[#69766F] flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#174C3C]" /> Family Members Listed
              </span>
              <p className="font-mono-num font-semibold text-[#1E2925] mt-1">5 Members</p>
            </div>

            <div className="rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-3.5">
              <span className="text-xs text-[#69766F] flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#236A52]" /> Portal Member Since
              </span>
              <p className="font-mono-num font-semibold text-[#1E2925] mt-1">2024</p>
            </div>
          </div>
        </div>

        {/* Household Tax & Water Connection Summary */}
        <div className="lg:col-span-5 rounded-xl border border-[#DDE5E0] bg-white p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1E2925]">
              Household Civic Status (FY 2026–27)
            </h3>
            <p className="text-xs text-[#69766F] mt-0.5">
              Namuna No. 8 Property &amp; Water Cess Summary (Demo Record)
            </p>

            <div className="mt-5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[#DDE5E0] pb-2.5">
                <span className="text-[#69766F]">House Tax (Ghar Patti) 2026–27</span>
                <span className="font-semibold text-[#174C3C]">Paid (₹1,240)</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#DDE5E0] pb-2.5">
                <span className="text-[#69766F]">Water Cess (Pani Patti) 2026–27</span>
                <span className="font-semibold text-[#174C3C]">Paid (₹600)</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#DDE5E0] pb-2.5">
                <span className="text-[#69766F]">Tap Water Connection</span>
                <span className="font-mono-num font-medium text-[#1E2925]">
                  JJM-W1-0112 (Active)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#69766F]">Ward Representative</span>
                <span className="font-medium text-[#1E2925]">Mr. Ashok Kadam (Demo)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#DDE5E0]">
            <button
              onClick={() => {
                triggerDummyDownload(
                  '/documents/house-tax-receipt-LGP001.pdf',
                  'House Tax & Water Cess Receipt – LGP001 (Ramesh Patil)',
                  {
                    'Member ID': 'LGP001',
                    'House No': '112, Ward 1',
                    'Financial Year': '2026-27',
                    'Total Paid': 'INR 1,840 (Paid)',
                  }
                );
                showToast('Downloaded Tax Receipt Copy (Demo)', 'info');
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#174C3C] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#236A52] transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download Property Tax Receipt (Demo)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
