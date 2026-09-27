import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Eye,
  Download,
} from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { formatDate, triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { DocumentCategory, DocumentVisibility, FinancialYear } from '../../types';

const UPLOAD_CATEGORIES = [
  { label: 'Documents', mapped: 'General' as DocumentCategory },
  { label: 'Bills', mapped: 'Bills & Vouchers' as DocumentCategory },
  { label: 'Notices', mapped: 'Government Orders' as DocumentCategory },
  { label: 'Meeting Minutes', mapped: 'Gram Sabha Records' as DocumentCategory },
  { label: 'Photos', mapped: 'Development Works' as DocumentCategory },
  { label: 'Reports', mapped: 'Audit Reports' as DocumentCategory },
  { label: 'Certificates', mapped: 'Certificates' as DocumentCategory },
  { label: 'Other', mapped: 'General' as DocumentCategory },
];

export const AdminUploadCenter: React.FC = () => {
  const { documents, addDocument, setPreviewDoc, showToast } = usePortal();

  const [selectedBucket, setSelectedBucket] = useState('Documents');
  const [title, setTitle] = useState('');
  const [refNumber, setRefNumber] = useState('GP/LKG/UPL/2026/104');
  const [financialYear, setFinancialYear] = useState<FinancialYear>('2026-27');
  const [visibility, setVisibility] = useState<DocumentVisibility>('public');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    if (!title) {
      const clean = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(clean.charAt(0).toUpperCase() + clean.slice(1));
    }
  };

  const handleCentralUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const bucketObj =
      UPLOAD_CATEGORIES.find((b) => b.label === selectedBucket) || UPLOAD_CATEGORIES[0];

    const finalFile =
      fileName ||
      `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;

    addDocument({
      title: title.trim(),
      category: bucketObj.mapped,
      documentNumber: refNumber.trim() || 'GP/LKG/2026/105',
      financialYear,
      date: new Date().toISOString().split('T')[0],
      uploadedBy: 'Gram Sevak',
      department: 'General Administration',
      description:
        description.trim() ||
        `Uploaded via Central Upload Center under "${selectedBucket}" category.`,
      visibility,
      status: visibility === 'public' ? 'Published' : 'Internal',
      file: `/documents/${finalFile}`,
      fileSize: '1.5 MB',
      fileType: finalFile.split('.').pop()?.toUpperCase() || 'PDF',
    });

    setTitle('');
    setDescription('');
    setFileName('');
    setRefNumber(`GP/LKG/UPL/2026/${Math.floor(Math.random() * 899 + 100)}`);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Upload Center' },
        ]}
      />

      <div className="border-b border-[#DDE5E0] pb-5">
        <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
          Centralized Record Upload Center
        </h2>
        <p className="mt-1 text-sm text-[#69766F]">
          Batch or single-file digitisation utility for Gram Panchayat registers, vouchers, meeting minutes, and certificates.
        </p>
      </div>

      {/* Category Selector Pills */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#69766F] mb-2.5">
          1. Select Record Type
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {UPLOAD_CATEGORIES.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setSelectedBucket(item.label)}
              className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                selectedBucket === item.label
                  ? 'border-[#174C3C] bg-[#174C3C] text-white'
                  : 'border-[#DDE5E0] bg-white text-[#1E2925] hover:bg-[#EEF4F0]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drag & Drop + Metadata Form */}
      <form
        onSubmit={handleCentralUpload}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-xl border border-[#DDE5E0] bg-white p-6"
      >
        {/* Left Drag & Drop Zone */}
        <div className="lg:col-span-5 flex flex-col">
          <p className="text-xs font-bold uppercase tracking-wider text-[#69766F] mb-2">
            2. Select or Drop File
          </p>
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFileSelect(e.dataTransfer.files?.[0]);
            }}
            className={`flex-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
              dragOver
                ? 'border-[#174C3C] bg-[#EEF4F0]'
                : 'border-[#236A52]/40 bg-[#F7F8F5] hover:bg-[#EEF4F0]/60'
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF4F0] text-[#174C3C] mb-3">
              <UploadCloud className="h-7 w-7" />
            </div>

            {fileName ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#174C3C] flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> {fileName}
                </p>
                <p className="text-xs text-[#69766F]">Ready to index in local repository</p>
              </div>
            ) : (
              <>
                <p className="text-sm font-bold text-[#1E2925]">
                  Drag &amp; drop file here, or click to browse
                </p>
                <p className="mt-1 text-xs text-[#69766F]">
                  Supports PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
                </p>
                <span className="mt-4 inline-block rounded-lg border border-[#DDE5E0] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#174C3C]">
                  Choose Local File (or Submit Demo File)
                </span>
              </>
            )}

            <input
              type="file"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
              className="hidden"
            />
          </label>
        </div>

        {/* Right Record Metadata */}
        <div className="lg:col-span-7 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#69766F]">
            3. Enter Indexing Details ({selectedBucket})
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                Document / Record Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`e.g., ${selectedBucket} Register – September 2026`}
                className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                Reference Number
              </label>
              <input
                type="text"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm font-mono-num focus:border-[#174C3C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                Financial Year
              </label>
              <select
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value as FinancialYear)}
                className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm font-mono-num focus:border-[#174C3C] focus:outline-none"
              >
                <option value="2026-27">2026-27</option>
                <option value="2025-26">2025-26</option>
                <option value="2024-25">2024-25</option>
                <option value="2023-24">2023-24</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                Access Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as DocumentVisibility)}
                className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
              >
                <option value="public">Public / Member Portal Visible</option>
                <option value="admin">Admin Only (Internal Record)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                Remarks / Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional summary note for auditors and citizens..."
                className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#174C3C] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#236A52] transition-colors cursor-pointer"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload &amp; Index Record</span>
            </button>
          </div>
        </div>
      </form>

      {/* Recent Uploads Table */}
      <div className="rounded-xl border border-[#DDE5E0] bg-white overflow-hidden">
        <div className="border-b border-[#DDE5E0] px-5 py-4">
          <h3 className="text-base font-bold text-[#1E2925]">Recent Uploads</h3>
          <p className="text-xs text-[#69766F]">
            Most recently indexed files in the Gram Panchayat repository
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DDE5E0] bg-[#F7F8F5] text-[11px] font-semibold uppercase tracking-wider text-[#69766F]">
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Reference No.</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE5E0] text-sm">
              {documents.slice(0, 6).map((doc) => (
                <tr key={doc.id} className="hover:bg-[#EEF4F0]/40">
                  <td className="py-3 px-4 font-semibold text-[#1E2925]">
                    <FileText className="h-4 w-4 inline mr-1.5 text-[#174C3C]" />
                    {doc.title}
                  </td>
                  <td className="py-3 px-4 text-xs text-[#69766F]">{doc.category}</td>
                  <td className="py-3 px-4 font-mono-num text-xs text-[#69766F]">
                    {doc.documentNumber}
                  </td>
                  <td className="py-3 px-4 font-mono-num text-xs text-[#69766F]">
                    {formatDate(doc.date)}
                  </td>
                  <td className="py-3 px-4 text-xs font-medium">
                    {doc.visibility === 'public' ? 'Public / Member' : 'Admin Only'}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="rounded border border-[#DDE5E0] bg-white px-2.5 py-1 text-xs font-medium text-[#1E2925] hover:bg-[#EEF4F0] mr-1.5 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 inline mr-1 text-[#174C3C]" />
                      Preview
                    </button>
                    <button
                      onClick={() => {
                        triggerDummyDownload(doc.file, doc.title);
                        showToast(`Downloaded ${doc.title}`, 'info');
                      }}
                      className="rounded border border-[#DDE5E0] bg-white px-2.5 py-1 text-xs font-medium text-[#174C3C] hover:bg-[#EEF4F0] cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 inline mr-1" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
