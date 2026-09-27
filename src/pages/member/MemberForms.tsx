import React, { useState } from 'react';
import { FileSpreadsheet, Download, Search, CheckCircle2 } from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export const MemberForms: React.FC = () => {
  const { forms, showToast } = usePortal();
  const [search, setSearch] = useState('');

  const filteredForms = forms.filter(
    (f) =>
      !search.trim() ||
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Downloadable Forms' },
        ]}
      />

      <div className="border-b border-[#DDE5E0] pb-5">
        <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
          Citizen Certificate &amp; Application Forms
        </h2>
        <p className="mt-1 text-sm text-[#69766F]">
          Download official Gram Panchayat application forms for residence, birth/death registration, water connection, and NOCs.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#69766F]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search forms (e.g., Residence, Water Connection, NOC)..."
          className="w-full rounded-lg border border-[#DDE5E0] bg-white pl-9 pr-4 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredForms.map((form) => (
          <div
            key={form.id}
            className="rounded-xl border border-[#DDE5E0] bg-white p-5 flex flex-col justify-between hover:border-[#174C3C] transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#69766F] mb-2">
                <span className="font-semibold text-[#174C3C]">{form.category}</span>
                <span className="font-mono-num">{form.formCode}</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF4F0] text-[#174C3C]">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E2925]">{form.title}</h3>
                  <p className="mt-1 text-xs text-[#69766F] leading-relaxed">
                    {form.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DDE5E0]/80">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#69766F] mb-1.5">
                  Documents to Attach at Office:
                </p>
                <ul className="space-y-1 text-xs text-[#1E2925]">
                  {form.requiredDocs.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#236A52] shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#DDE5E0] flex items-center justify-between">
              <span className="text-xs text-[#69766F]">{form.processingDays}</span>
              <button
                onClick={() => {
                  triggerDummyDownload(form.file, form.title);
                  showToast(`Downloaded ${form.title} PDF`, 'info');
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#174C3C] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#236A52] transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Form</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
