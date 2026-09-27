import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Search,
  Plus,
  CheckCircle2,
  X,
} from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { FormCategory } from '../../types';

const FORM_CATEGORIES: ('All' | FormCategory)[] = [
  'All',
  'Birth Related',
  'Death Related',
  'Residence',
  'Income',
  'Property',
  'Water Connection',
  'Tax',
  'No Objection',
  'Government Schemes',
];

export const AdminForms: React.FC = () => {
  const { forms, addForm, showToast } = usePortal();
  const [selectedCategory, setSelectedCategory] = useState<'All' | FormCategory>('All');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FormCategory>('Residence');
  const [description, setDescription] = useState('');
  const [requiredDocs, setRequiredDocs] = useState('Aadhaar Card, Paid House Tax Receipt');

  const filteredForms = forms.filter((f) => {
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addForm({
      title: title.trim(),
      category,
      formCode: `GP-FORM-${Math.floor(Math.random() * 89 + 10)}`,
      description:
        description.trim() ||
        `Standard citizen application template for ${category} verification.`,
      requiredDocs: requiredDocs.split(',').map((s) => s.trim()),
      processingDays: '5 Working Days',
      file: `/documents/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`,
      fileSize: '340 KB',
    });

    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Certificates & Forms' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE5E0] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
            Certificates &amp; Citizen Application Forms
          </h2>
          <p className="mt-1 text-sm text-[#69766F]">
            Downloadable library of statutory Gram Panchayat application forms and citizen checklists.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#174C3C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#236A52] transition-colors whitespace-nowrap cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add Form Template</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#69766F]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search application forms by name or category..."
            className="w-full rounded-lg border border-[#DDE5E0] bg-white pl-9 pr-4 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {FORM_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#174C3C] text-white'
                  : 'border border-[#DDE5E0] bg-white text-[#69766F] hover:bg-[#EEF4F0] hover:text-[#1E2925]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredForms.map((form) => (
          <div
            key={form.id}
            className="rounded-xl border border-[#DDE5E0] bg-white p-5 flex flex-col justify-between hover:border-[#236A52] transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-[#69766F] mb-2">
                <span className="font-semibold text-[#174C3C]">{form.category}</span>
                <span className="font-mono-num">{form.formCode}</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF4F0] text-[#174C3C]">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E2925] leading-snug">
                    {form.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#69766F] leading-relaxed">
                    {form.description}
                  </p>
                </div>
              </div>

              {/* Required Documents Checklist */}
              <div className="mt-4 pt-3 border-t border-[#DDE5E0]/80">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#69766F] mb-1.5">
                  Required Attachments:
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
              <span className="text-xs text-[#69766F]">
                Timeline: <strong className="text-[#1E2925]">{form.processingDays}</strong>
              </span>
              <button
                onClick={() => {
                  triggerDummyDownload(form.file, form.title, {
                    'Form Code': form.formCode,
                    Category: form.category,
                    'Required Documents': form.requiredDocs.join(', '),
                    'Standard SLA': form.processingDays,
                  });
                  showToast(`Downloaded ${form.title} PDF`, 'info');
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#174C3C] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#236A52] transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Form Template Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-[#1E2925]">Add Application Form Template</h3>
                <p className="text-xs text-[#69766F]">Add downloadable PDF form to citizen library</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1.5 text-[#69766F] hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateForm} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Form Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Tree Cutting Permission / NOC Form"
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FormCategory)}
                  className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                >
                  {FORM_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Purpose and instructions for villagers..."
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Required Documents (Comma separated)
                </label>
                <input
                  type="text"
                  value={requiredDocs}
                  onChange={(e) => setRequiredDocs(e.target.value)}
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#DDE5E0]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-[#DDE5E0] px-4 py-2 text-sm font-medium text-[#69766F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#174C3C] px-5 py-2 text-sm font-semibold text-white hover:bg-[#236A52]"
                >
                  Save Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
