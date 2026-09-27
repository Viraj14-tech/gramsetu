import React, { useState, useEffect } from 'react';
import { X, Upload, FileCheck2 } from 'lucide-react';
import { usePortal } from '../utils/PortalContext';
import { DocumentCategory, FinancialYear, DocumentVisibility, DocumentStatus } from '../types';

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

export const UploadDocumentModal: React.FC = () => {
  const {
    isUploadModalOpen,
    setIsUploadModalOpen,
    addDocument,
    updateDocument,
    editingDoc,
    setEditingDoc,
  } = usePortal();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Gram Sabha Records');
  const [documentNumber, setDocumentNumber] = useState('');
  const [financialYear, setFinancialYear] = useState<FinancialYear>('2026-27');
  const [date, setDate] = useState('2026-09-27');
  const [department, setDepartment] = useState('General Administration');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<DocumentVisibility>('public');
  const [status, setStatus] = useState<DocumentStatus>('Published');
  const [selectedFileName, setSelectedFileName] = useState('');

  useEffect(() => {
    if (editingDoc) {
      setTitle(editingDoc.title);
      setCategory(editingDoc.category);
      setDocumentNumber(editingDoc.documentNumber);
      setFinancialYear(editingDoc.financialYear);
      setDate(editingDoc.date);
      setDepartment(editingDoc.department);
      setDescription(editingDoc.description);
      setVisibility(editingDoc.visibility);
      setStatus(editingDoc.status);
      setSelectedFileName(editingDoc.file.split('/').pop() || 'gram-panchayat-record.pdf');
    } else {
      setTitle('');
      setCategory('Gram Sabha Records');
      setDocumentNumber(`GP/LKG/2026/${Math.floor(Math.random() * 89 + 10)}`);
      setFinancialYear('2026-27');
      setDate(new Date().toISOString().split('T')[0]);
      setDepartment('General Administration');
      setDescription('');
      setVisibility('public');
      setStatus('Published');
      setSelectedFileName('');
    }
  }, [editingDoc, isUploadModalOpen]);

  if (!isUploadModalOpen) return null;

  const handleClose = () => {
    setIsUploadModalOpen(false);
    setEditingDoc(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      if (!title) {
        const autoTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(autoTitle.charAt(0).toUpperCase() + autoTitle.slice(1));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const cleanFileName =
      selectedFileName ||
      `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.pdf`;

    const ext = cleanFileName.split('.').pop()?.toUpperCase() || 'PDF';

    if (editingDoc) {
      updateDocument({
        ...editingDoc,
        title: title.trim(),
        category,
        documentNumber: documentNumber.trim() || 'GP/LKG/2026/01',
        financialYear,
        date,
        department,
        description:
          description.trim() ||
          `Official ${category} document uploaded for Financial Year ${financialYear}.`,
        visibility,
        status,
        file: `/documents/${cleanFileName}`,
        fileType: ext,
      });
    } else {
      addDocument({
        title: title.trim(),
        category,
        documentNumber: documentNumber.trim() || 'GP/LKG/2026/99',
        financialYear,
        date,
        uploadedBy: 'Gram Sevak',
        department,
        description:
          description.trim() ||
          `Official ${category} record indexed under Lakhlgoan Gram Panchayat for FY ${financialYear}.`,
        visibility,
        status,
        file: `/documents/${cleanFileName}`,
        fileSize: '1.2 MB',
        fileType: ext,
      });
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden my-8">
        <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#1E2925]">
              {editingDoc ? 'Edit Document Record' : 'Upload Gram Panchayat Document'}
            </h2>
            <p className="text-xs text-[#69766F]">
              Index official PDF, Word, Excel, or image files into the digital repository.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-[#69766F] hover:bg-white hover:text-[#1E2925]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                Document Title <span className="text-[#C74A4A]">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Gram Sabha Minutes – October 2026"
                className="w-full rounded-lg border border-[#DDE5E0] bg-white px-3.5 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2925] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full rounded-lg border border-[#DDE5E0] bg-white px-3.5 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                Document Reference Number
              </label>
              <input
                type="text"
                required
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="GP/LKG/GS/2026/09"
                className="w-full rounded-lg border border-[#DDE5E0] bg-white px-3.5 py-2 text-sm font-mono-num text-[#1E2925] focus:border-[#174C3C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2925] mb-1">Financial Year</label>
              <select
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value as FinancialYear)}
                className="w-full rounded-lg border border-[#DDE5E0] bg-white px-3.5 py-2 text-sm font-mono-num text-[#1E2925] focus:border-[#174C3C] focus:outline-none"
              >
                {FINANCIAL_YEARS.map((fy) => (
                  <option key={fy} value={fy}>
                    {fy}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2925] mb-1">Document Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-[#DDE5E0] bg-white px-3.5 py-2 text-sm font-mono-num text-[#1E2925] focus:border-[#174C3C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2925] mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-lg border border-[#DDE5E0] bg-white px-3.5 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:outline-none"
              >
                <option value="General Administration">General Administration</option>
                <option value="Finance & Accounts">Finance & Accounts</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Public Works">Public Works</option>
                <option value="Revenue & Tax">Revenue & Tax</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Electricity & Street Lighting">Electricity & Street Lighting</option>
                <option value="Social Welfare & Schemes">Social Welfare & Schemes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2925] mb-1">Visibility</label>
              <select
                value={visibility}
                onChange={(e) => {
                  const val = e.target.value as DocumentVisibility;
                  setVisibility(val);
                  if (val === 'admin') setStatus('Internal');
                  else setStatus('Published');
                }}
                className="w-full rounded-lg border border-[#DDE5E0] bg-white px-3.5 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:outline-none"
              >
                <option value="public">Public / Member</option>
                <option value="admin">Admin Only</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1E2925] mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of the resolution, bill, or order for citizen and administrative reference..."
                className="w-full rounded-lg border border-[#DDE5E0] bg-white px-3.5 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1E2925] mb-1">Upload File</label>
              <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#236A52]/40 bg-[#F7F8F5] px-4 py-5 cursor-pointer hover:bg-[#EEF4F0]/60 transition-colors">
                {selectedFileName ? (
                  <div className="flex items-center gap-2 text-sm font-medium text-[#174C3C]">
                    <FileCheck2 className="h-5 w-5" />
                    <span>{selectedFileName}</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-6 w-6 text-[#236A52] mb-1" />
                    <p className="text-xs font-medium text-[#1E2925]">
                      Click to choose a file or use simulated demo PDF
                    </p>
                    <p className="text-[11px] text-[#69766F] mt-0.5">
                      Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10 MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DDE5E0]">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-[#DDE5E0] bg-white px-4 py-2 text-sm font-medium text-[#69766F] hover:bg-[#F7F8F5] hover:text-[#1E2925]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#174C3C] px-5 py-2 text-sm font-semibold text-white hover:bg-[#236A52] transition-colors"
            >
              {editingDoc ? 'Save Changes' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
