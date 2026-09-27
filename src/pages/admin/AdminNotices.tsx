import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Bell,
  Download,
  Trash2,
  X,
  AlertTriangle,
} from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { formatDate, triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { NoticeCategory, NoticeStatus } from '../../types';

const NOTICE_CATEGORIES: NoticeCategory[] = [
  'General',
  'Gram Sabha',
  'Water Supply',
  'Tax',
  'Health',
  'Government Scheme',
  'Emergency',
  'Tender',
];

export const AdminNotices: React.FC = () => {
  const { notices, addNotice, updateNoticeStatus, deleteNotice, showToast } = usePortal();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New notice form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('General');
  const [publishDate, setPublishDate] = useState('2026-09-27');
  const [expiryDate, setExpiryDate] = useState('2026-10-25');
  const [status, setStatus] = useState<NoticeStatus>('Active');
  const [important, setImportant] = useState(false);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setIsModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      !search.trim() ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || n.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || n.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addNotice({
      title: title.trim(),
      description: description.trim(),
      category,
      publishDate,
      expiryDate,
      attachment: '/documents/gram-sabha-august-2026.pdf',
      status,
      important,
      issuedBy: 'Gram Sevak',
    });

    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Notices Management' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE5E0] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
            Public Notices &amp; Circulars
          </h2>
          <p className="mt-1 text-sm text-[#69766F]">
            Publish and manage Gram Sabha notifications, tax reminders, water advisories, and tenders.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#174C3C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#236A52] transition-colors whitespace-nowrap cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Publish Notice</span>
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#69766F]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notice title or content..."
              className="w-full rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] pl-9 pr-3 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] px-3 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:bg-white focus:outline-none"
          >
            <option value="All">All Categories ({NOTICE_CATEGORIES.length})</option>
            {NOTICE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] px-3 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:bg-white focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-3">
        {filteredNotices.length === 0 ? (
          <div className="rounded-xl border border-[#DDE5E0] bg-white p-12 text-center">
            <Bell className="mx-auto h-10 w-10 text-[#69766F]/50 mb-2" />
            <p className="text-base font-bold text-[#1E2925]">
              No notices found matching the selected filters.
            </p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`rounded-xl border bg-white p-5 transition-colors ${
                notice.important && notice.status === 'Active'
                  ? 'border-[#D99528] border-l-4 border-l-[#D99528]'
                  : 'border-[#DDE5E0]'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#69766F]">
                    <span className="font-semibold text-[#174C3C]">{notice.category}</span>
                    <span>·</span>
                    <span className="font-mono-num">{notice.id}</span>
                    <span>·</span>
                    <span>Published: {formatDate(notice.publishDate)}</span>
                    <span>·</span>
                    <span>Expires: {formatDate(notice.expiryDate)}</span>
                    {notice.important && (
                      <>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-[#D99528]">
                          <AlertTriangle className="h-3.5 w-3.5" /> Priority Notice
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#1E2925]">{notice.title}</h3>
                  <p className="text-sm text-[#1E2925]/85 leading-relaxed">{notice.description}</p>
                </div>

                <div className="flex flex-wrap lg:flex-col items-end justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <select
                      value={notice.status}
                      onChange={(e) =>
                        updateNoticeStatus(notice.id, e.target.value as NoticeStatus)
                      }
                      className="rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] px-2.5 py-1 text-xs font-semibold text-[#1E2925] focus:border-[#174C3C] focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Expired">Expired</option>
                      <option value="Draft">Draft</option>
                    </select>

                    <button
                      onClick={() => {
                        triggerDummyDownload(notice.attachment, notice.title, {
                          Category: notice.category,
                          Published: notice.publishDate,
                          Expiry: notice.expiryDate,
                        });
                        showToast(`Downloaded attachment for ${notice.id}`, 'info');
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE5E0] bg-white px-3 py-1 text-xs font-medium text-[#174C3C] hover:bg-[#EEF4F0] transition-colors cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Attachment</span>
                    </button>

                    <button
                      onClick={() => deleteNotice(notice.id)}
                      className="rounded-lg border border-[#DDE5E0] bg-white p-1.5 text-[#69766F] hover:bg-[#C74A4A]/10 hover:text-[#C74A4A] transition-colors cursor-pointer"
                      title="Delete Notice"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Publish Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-[#1E2925]">Publish Official Notice</h3>
                <p className="text-xs text-[#69766F]">
                  Post notice to the Gram Panchayat digital notice board
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-[#69766F] hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Special Gram Sabha Meeting – October 2026"
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                  >
                    {NOTICE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as NoticeStatus)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm font-mono-num focus:border-[#174C3C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm font-mono-num focus:border-[#174C3C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed notice text for citizens and ward members..."
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-[#1E2925] cursor-pointer">
                <input
                  type="checkbox"
                  checked={important}
                  onChange={(e) => setImportant(e.target.checked)}
                  className="rounded border-[#DDE5E0] text-[#174C3C] focus:ring-[#174C3C]"
                />
                <span>Highlight as Priority / Important Notice (Amber border)</span>
              </label>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#DDE5E0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-[#DDE5E0] px-4 py-2 text-sm font-medium text-[#69766F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#174C3C] px-5 py-2 text-sm font-semibold text-white hover:bg-[#236A52]"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
