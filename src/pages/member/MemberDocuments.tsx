import React, { useState } from 'react';
import { Search, FileText, Eye, Download, RotateCcw } from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { formatDate, triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';

const CITIZEN_CATEGORIES = [
  { label: 'All Public Documents', match: 'All' },
  { label: 'Gram Sabha', match: 'Gram Sabha Records' },
  { label: 'Development', match: 'Development Works' },
  { label: 'Government Schemes', match: 'Schemes' },
  { label: 'Tax Information', match: 'Audit Reports' },
  { label: 'Water Supply', match: 'Water Supply' },
  { label: 'Sanitation', match: 'Sanitation' },
  { label: 'Resolutions', match: 'Resolutions' },
  { label: 'Government Orders', match: 'Government Orders' },
];

export const MemberDocuments: React.FC = () => {
  const { documents, setPreviewDoc, showToast } = usePortal();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  // Strictly enforce visibility === 'public'
  const publicDocs = documents.filter((d) => d.visibility === 'public');

  const filteredDocs = publicDocs.filter((doc) => {
    const matchesSearch =
      !search.trim() ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(search.toLowerCase()) ||
      doc.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'All' || doc.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Public Documents' },
        ]}
      />

      <div className="border-b border-[#DDE5E0] pb-5">
        <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
          Public Documents &amp; Gram Panchayat Records
        </h2>
        <p className="mt-1 text-sm text-[#69766F]">
          Inspect and download verified public resolutions, Gram Sabha minutes, annual budgets, and development sanctions.
        </p>
      </div>

      {/* Search & Category Tabs */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#69766F]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search public documents by title or reference no..."
              className="w-full rounded-lg border border-[#DDE5E0] bg-white pl-9 pr-4 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:outline-none"
            />
          </div>
          {(search || selectedCat !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCat('All');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE5E0] bg-white px-3.5 py-2 text-xs font-medium text-[#69766F] hover:text-[#1E2925]"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CITIZEN_CATEGORIES.map((c) => (
            <button
              key={c.label}
              onClick={() => setSelectedCat(c.match)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                selectedCat === c.match
                  ? 'bg-[#174C3C] text-white'
                  : 'border border-[#DDE5E0] bg-white text-[#69766F] hover:bg-[#EEF4F0] hover:text-[#1E2925]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table (Read-Only for Members) */}
      <div className="rounded-xl border border-[#DDE5E0] bg-white overflow-hidden">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-[#69766F]/50 mb-2" />
            <p className="text-base font-bold text-[#1E2925]">
              No documents found matching the selected filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DDE5E0] bg-[#F7F8F5] text-[11px] font-semibold uppercase tracking-wider text-[#69766F]">
                  <th className="py-3 px-4">Document Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Financial Year</th>
                  <th className="py-3 px-4">Reference No.</th>
                  <th className="py-3 px-4">Published Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE5E0] text-sm">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#EEF4F0]/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#1E2925]">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="text-left hover:text-[#174C3C] hover:underline flex items-center gap-2 cursor-pointer"
                      >
                        <FileText className="h-4 w-4 shrink-0 text-[#174C3C]" />
                        <span>{doc.title}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#69766F]">{doc.category}</td>
                    <td className="py-3.5 px-4 font-mono-num text-xs text-[#1E2925]">
                      {doc.financialYear}
                    </td>
                    <td className="py-3.5 px-4 font-mono-num text-xs text-[#69766F]">
                      {doc.documentNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono-num text-xs text-[#69766F]">
                      {formatDate(doc.date)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="rounded border border-[#DDE5E0] bg-white px-3 py-1 text-xs font-medium text-[#1E2925] hover:bg-[#EEF4F0] cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 inline mr-1 text-[#174C3C]" />
                          View
                        </button>
                        <button
                          onClick={() => {
                            triggerDummyDownload(doc.file, doc.title);
                            showToast(`Downloading ${doc.title}...`, 'info');
                          }}
                          className="rounded bg-[#174C3C] px-3 py-1 text-xs font-semibold text-white hover:bg-[#236A52] cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5 inline mr-1" />
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
