import React, { useState } from 'react';
import { Bell, Download, AlertTriangle, Calendar } from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { formatDate, triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export const MemberNotices: React.FC = () => {
  const { notices, showToast } = usePortal();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const activeNotices = notices.filter((n) => n.status === 'Active');
  const categories = ['All', ...Array.from(new Set(activeNotices.map((n) => n.category)))];

  const filteredNotices = activeNotices.filter(
    (n) => selectedCategory === 'All' || n.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Village Notice Board' },
        ]}
      />

      <div className="border-b border-[#DDE5E0] pb-5">
        <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
          Gram Panchayat Public Notice Board
        </h2>
        <p className="mt-1 text-sm text-[#69766F]">
          Official announcements, Gram Sabha schedules, water supply advisories, and scheme verification camps.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#174C3C] text-white'
                : 'border border-[#DDE5E0] bg-white text-[#69766F] hover:bg-[#EEF4F0] hover:text-[#1E2925]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className={`rounded-xl border bg-white p-5 flex flex-col justify-between transition-colors ${
              notice.important
                ? 'border-[#D99528] border-l-4 border-l-[#D99528] bg-[#D99528]/[0.03]'
                : 'border-[#DDE5E0]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-[#69766F] mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#174C3C]">{notice.category}</span>
                  <span>·</span>
                  <span className="font-mono-num">{formatDate(notice.publishDate)}</span>
                </div>
                {notice.important && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D99528]">
                    <AlertTriangle className="h-3.5 w-3.5" /> Important
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-[#1E2925]">{notice.title}</h3>
              <p className="mt-2 text-sm text-[#1E2925]/85 leading-relaxed">
                {notice.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#DDE5E0] flex items-center justify-between text-xs text-[#69766F]">
              <span className="inline-flex items-center gap-1 font-mono-num">
                <Calendar className="h-3.5 w-3.5 text-[#236A52]" />
                Valid until: {formatDate(notice.expiryDate)}
              </span>

              <button
                onClick={() => {
                  triggerDummyDownload(notice.attachment, notice.title, {
                    Category: notice.category,
                    'Published Date': notice.publishDate,
                    'Valid Until': notice.expiryDate,
                    'Issued By': notice.issuedBy,
                  });
                  showToast(`Downloaded notice attachment (${notice.id})`, 'info');
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#174C3C] bg-white px-3 py-1.5 text-xs font-semibold text-[#174C3C] hover:bg-[#EEF4F0] transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Attachment PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
