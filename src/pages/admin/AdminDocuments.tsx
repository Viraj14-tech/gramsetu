import React, { useState } from 'react';
import {
  Search,
  Upload,
  FileText,
  Eye,
  Download,
  Pencil,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { formatDate, triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { DocumentCategory, FinancialYear, DocumentStatus } from '../../types';

const CATEGORIES: DocumentCategory[] = [
  'Gram Sabha Records',
  'Government Orders',
  'Resolutions',
  'Tax Records',
  'Property Records',
  'Water Supply',
  'Sanitation',
  'Schemes',
  'Audit Reports',
  'Development Works',
  'Certificates',
  'Bills & Vouchers',
  'General',
];

const FINANCIAL_YEARS: FinancialYear[] = ['2026-27', '2025-26', '2024-25', '2023-24'];
const STATUSES: DocumentStatus[] = ['Published', 'Verified', 'Internal', 'Draft', 'Archived'];

export const AdminDocuments: React.FC = () => {
  const {
    documents,
    deleteDocument,
    setPreviewDoc,
    setEditingDoc,
    setIsUploadModalOpen,
    showToast,
  } = usePortal();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFY, setSelectedFY] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      !searchQuery.trim() ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.file.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesFY = selectedFY === 'All' || doc.financialYear === selectedFY;
    const matchesStatus = selectedStatus === 'All' || doc.status === selectedStatus;

    return matchesSearch && matchesCat && matchesFY && matchesStatus;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedFY('All');
    setSelectedStatus('All');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Document Management' },
        ]}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE5E0] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
            Document Management
          </h2>
          <p className="mt-1 text-sm text-[#69766F]">
            Upload, organise and manage Gram Panchayat documents.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingDoc(null);
            setIsUploadModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#174C3C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#236A52] transition-colors whitespace-nowrap cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          <span>+ Upload Document</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-4">
            <label className="block text-xs font-semibold text-[#69766F] mb-1">
              Search Documents
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#69766F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, ref no. or filename..."
                className="w-full rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] pl-9 pr-3 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-[#69766F] mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] px-3 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:bg-white focus:outline-none"
            >
              <option value="All">All Categories ({CATEGORIES.length})</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-[#69766F] mb-1">
              Financial Year
            </label>
            <select
              value={selectedFY}
              onChange={(e) => setSelectedFY(e.target.value)}
              className="w-full rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] px-3 py-2 text-sm font-mono-num text-[#1E2925] focus:border-[#174C3C] focus:bg-white focus:outline-none"
            >
              <option value="All">All Years</option>
              {FINANCIAL_YEARS.map((fy) => (
                <option key={fy} value={fy}>
                  {fy}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-[#69766F] mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] px-3 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:bg-white focus:outline-none"
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-1 flex justify-end">
            <button
              onClick={resetFilters}
              title="Reset Filters"
              className="w-full inline-flex items-center justify-center gap-1 rounded-lg border border-[#DDE5E0] bg-white px-3 py-2 text-xs font-medium text-[#69766F] hover:bg-[#EEF4F0] hover:text-[#1E2925] transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="lg:hidden">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Document Table */}
      <div className="rounded-xl border border-[#DDE5E0] bg-white overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#F7F8F5] px-5 py-3 text-xs text-[#69766F]">
          <span>
            Showing <strong className="font-mono-num text-[#1E2925]">{filteredDocs.length}</strong>{' '}
            of <strong className="font-mono-num text-[#1E2925]">{documents.length}</strong> indexed
            files
          </span>
          <span>Click any document title or View to open preview</span>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-[#69766F]/50 mb-3" />
            <p className="text-base font-bold text-[#1E2925]">
              No documents found matching the selected filters.
            </p>
            <p className="text-xs text-[#69766F] mt-1">
              Try clearing your search term or selecting a different category or financial year.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#174C3C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#236A52]"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DDE5E0] bg-[#F7F8F5] text-[11px] font-semibold uppercase tracking-wider text-[#69766F]">
                  <th className="py-3 px-4">File</th>
                  <th className="py-3 px-4">Document Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Financial Year</th>
                  <th className="py-3 px-4">Reference No.</th>
                  <th className="py-3 px-4">Uploaded Date</th>
                  <th className="py-3 px-4">Visibility</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE5E0] text-sm">
                {filteredDocs.map((doc) => {
                  const fileName = doc.file.split('/').pop() || 'document.pdf';
                  return (
                    <tr key={doc.id} className="hover:bg-[#EEF4F0]/40 transition-colors">
                      <td className="py-3 px-4 font-mono-num text-xs text-[#236A52] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-4 w-4 shrink-0 text-[#174C3C]" />
                          <span className="truncate max-w-[150px]" title={fileName}>
                            {fileName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#1E2925]">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="text-left hover:text-[#174C3C] hover:underline cursor-pointer"
                        >
                          {doc.title}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#69766F] whitespace-nowrap">
                        {doc.category}
                      </td>
                      <td className="py-3 px-4 font-mono-num text-xs text-[#1E2925] whitespace-nowrap">
                        {doc.financialYear}
                      </td>
                      <td className="py-3 px-4 font-mono-num text-xs text-[#69766F] whitespace-nowrap">
                        {doc.documentNumber}
                      </td>
                      <td className="py-3 px-4 font-mono-num text-xs text-[#69766F] whitespace-nowrap">
                        {formatDate(doc.date)}
                      </td>
                      <td className="py-3 px-4 text-xs whitespace-nowrap">
                        <span
                          className={
                            doc.visibility === 'public'
                              ? 'text-[#174C3C] font-medium'
                              : 'text-[#D99528] font-medium'
                          }
                        >
                          {doc.visibility === 'public' ? 'Public / Member' : 'Admin Only'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium whitespace-nowrap">
                        <span
                          className={
                            doc.status === 'Published' || doc.status === 'Verified'
                              ? 'text-[#174C3C]'
                              : doc.status === 'Internal' || doc.status === 'Draft'
                              ? 'text-[#D99528]'
                              : 'text-[#69766F]'
                          }
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="rounded border border-[#DDE5E0] bg-white px-2.5 py-1 text-xs font-medium text-[#1E2925] hover:bg-[#EEF4F0] transition-colors cursor-pointer"
                            title="View Document"
                          >
                            <Eye className="h-3.5 w-3.5 inline mr-1 text-[#174C3C]" />
                            View
                          </button>
                          <button
                            onClick={() => {
                              triggerDummyDownload(doc.file, doc.title, {
                                Category: doc.category,
                                Reference: doc.documentNumber,
                                'Financial Year': doc.financialYear,
                              });
                              showToast(`Downloading ${fileName}...`, 'info');
                            }}
                            className="rounded border border-[#DDE5E0] bg-white p-1.5 text-[#69766F] hover:bg-[#EEF4F0] hover:text-[#174C3C] transition-colors cursor-pointer"
                            title="Download"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingDoc(doc);
                              setIsUploadModalOpen(true);
                            }}
                            className="rounded border border-[#DDE5E0] bg-white p-1.5 text-[#69766F] hover:bg-[#EEF4F0] hover:text-[#1E2925] transition-colors cursor-pointer"
                            title="Edit Record"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteDocument(doc.id)}
                            className="rounded border border-[#DDE5E0] bg-white p-1.5 text-[#69766F] hover:bg-[#C74A4A]/10 hover:text-[#C74A4A] transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
