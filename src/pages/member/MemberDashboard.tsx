import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  FileText,
  HardHat,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Eye,
  Download,
  X,
  CheckCircle2,
} from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { formatDate, formatINR, triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export const MemberDashboard: React.FC = () => {
  const {
    documents,
    notices,
    projects,
    meetings,
    setPreviewDoc,
    showToast,
  } = usePortal();

  const [showAgendaModal, setShowAgendaModal] = useState(false);

  const publicDocs = documents.filter((d) => d.visibility === 'public');
  const activeNotices = notices.filter((n) => n.status === 'Active');
  const nextGramSabha =
    meetings.find((m) => m.id === 'MTG-2026-10-02') || meetings[0];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Citizen Portal' }, { label: 'Dashboard' }]} />

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE5E0] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
            Namaskar, Ramesh Patil
          </h2>
          <p className="mt-1 text-sm text-[#69766F]">
            Access Gram Panchayat documents, notices, development updates and village information.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#69766F] bg-white px-3.5 py-2 rounded-lg border border-[#DDE5E0]">
          <span>Member ID:</span>
          <strong className="font-mono-num text-[#174C3C]">LGP001</strong>
          <span>·</span>
          <span>Ward 1 (House No. 112)</span>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/member/notices"
          className="rounded-xl border border-[#DDE5E0] bg-white p-4 hover:border-[#174C3C] transition-colors"
        >
          <div className="flex items-center justify-between text-[#69766F] mb-2">
            <span className="text-xs font-medium">Latest Notices</span>
            <Bell className="h-4 w-4 text-[#D99528]" />
          </div>
          <p className="font-mono-num text-2xl font-bold text-[#1E2925]">
            {activeNotices.length}
          </p>
          <p className="mt-1 text-[11px] text-[#174C3C] font-medium">
            View active village circulars →
          </p>
        </Link>

        <Link
          to="/member/documents"
          className="rounded-xl border border-[#DDE5E0] bg-white p-4 hover:border-[#174C3C] transition-colors"
        >
          <div className="flex items-center justify-between text-[#69766F] mb-2">
            <span className="text-xs font-medium">Public Documents</span>
            <FileText className="h-4 w-4 text-[#174C3C]" />
          </div>
          <p className="font-mono-num text-2xl font-bold text-[#1E2925]">
            {publicDocs.length}
          </p>
          <p className="mt-1 text-[11px] text-[#174C3C] font-medium">
            Resolutions, budgets &amp; orders →
          </p>
        </Link>

        <Link
          to="/member/development-works"
          className="rounded-xl border border-[#DDE5E0] bg-white p-4 hover:border-[#174C3C] transition-colors"
        >
          <div className="flex items-center justify-between text-[#69766F] mb-2">
            <span className="text-xs font-medium">Development Works</span>
            <HardHat className="h-4 w-4 text-[#236A52]" />
          </div>
          <p className="font-mono-num text-2xl font-bold text-[#1E2925]">
            {projects.length}
          </p>
          <p className="mt-1 text-[11px] text-[#174C3C] font-medium">
            Track ward road &amp; water works →
          </p>
        </Link>

        <div
          onClick={() => setShowAgendaModal(true)}
          className="rounded-xl border border-[#DDE5E0] bg-white p-4 hover:border-[#174C3C] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#69766F] mb-2">
            <span className="text-xs font-medium">Upcoming Gram Sabha</span>
            <Calendar className="h-4 w-4 text-[#174C3C]" />
          </div>
          <p className="font-mono-num text-xl font-bold text-[#174C3C]">2 Oct 2026</p>
          <p className="mt-1 text-[11px] text-[#69766F]">11:00 AM • Panchayat Office</p>
        </div>
      </div>

      {/* NEXT GRAM SABHA Highlight Banner + Latest Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Gram Sabha Card */}
        <div className="lg:col-span-5 rounded-xl border border-[#174C3C] bg-[#174C3C] text-white p-6 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#EEF4F0]">
              <span>NEXT GRAM SABHA</span>
            </div>

            <h3 className="mt-3 text-xl font-bold text-white">
              Mahatma Gandhi Jayanti Statutory Gram Sabha
            </h3>
            <p className="mt-1.5 text-xs text-[#EEF4F0]/85 leading-relaxed">
              All registered villagers of Lakhlgoan are invited to participate in the open house
              review of GPDP works, water supply audit, and PMAY-G beneficiary verification.
            </p>

            <div className="mt-5 space-y-2.5 rounded-lg bg-black/20 p-4 text-xs text-[#EEF4F0]">
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-[#D99528] shrink-0" />
                <span className="font-mono-num font-bold text-sm text-white">
                  2 October 2026
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-[#D99528] shrink-0" />
                <span className="font-mono-num font-semibold">11:00 AM</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#D99528] shrink-0" />
                <span>Gram Panchayat Office, Lakhlgoan</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => setShowAgendaModal(true)}
              className="w-full rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-[#174C3C] hover:bg-[#EEF4F0] transition-colors cursor-pointer"
            >
              View Agenda
            </button>
          </div>
        </div>

        {/* Latest Active Notices */}
        <div className="lg:col-span-7 rounded-xl border border-[#DDE5E0] bg-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#1E2925]">Latest Village Notices</h3>
                <p className="text-xs text-[#69766F]">
                  Important circulars and public advisories from Gram Panchayat
                </p>
              </div>
              <Link
                to="/member/notices"
                className="text-xs font-semibold text-[#174C3C] hover:underline inline-flex items-center gap-1"
              >
                All Notices <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {activeNotices.slice(0, 3).map((nt) => (
                <div
                  key={nt.id}
                  className={`rounded-lg border p-3.5 ${
                    nt.important
                      ? 'border-[#D99528]/60 bg-[#D99528]/5 border-l-4 border-l-[#D99528]'
                      : 'border-[#DDE5E0] bg-[#F7F8F5]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-[#69766F] mb-1">
                    <span className="font-semibold text-[#174C3C]">{nt.category}</span>
                    <span className="font-mono-num">{formatDate(nt.publishDate)}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#1E2925]">{nt.title}</h4>
                  <p className="text-xs text-[#69766F] mt-1 line-clamp-2">{nt.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Public Documents & Ongoing Works */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Public Documents */}
        <div className="lg:col-span-7 rounded-xl border border-[#DDE5E0] bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#DDE5E0] px-5 py-4">
            <div>
              <h3 className="text-base font-bold text-[#1E2925]">Recent Public Documents</h3>
              <p className="text-xs text-[#69766F]">
                Verified records open for citizen inspection and download
              </p>
            </div>
            <Link
              to="/member/documents"
              className="text-xs font-semibold text-[#174C3C] hover:underline inline-flex items-center gap-1"
            >
              Browse All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-[#DDE5E0]">
            {publicDocs.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-[#EEF4F0]/40"
              >
                <div className="min-w-0">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="text-left text-sm font-semibold text-[#1E2925] hover:text-[#174C3C] hover:underline truncate block cursor-pointer"
                  >
                    {doc.title}
                  </button>
                  <p className="text-xs text-[#69766F]">
                    {doc.category} · <span className="font-mono-num">{doc.documentNumber}</span> ·{' '}
                    {formatDate(doc.date)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="rounded border border-[#DDE5E0] bg-white px-2.5 py-1 text-xs font-medium text-[#1E2925] hover:bg-[#EEF4F0] cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 inline mr-1 text-[#174C3C]" />
                    View
                  </button>
                  <button
                    onClick={() => {
                      triggerDummyDownload(doc.file, doc.title);
                      showToast(`Downloaded ${doc.title}`, 'info');
                    }}
                    className="rounded border border-[#DDE5E0] bg-white p-1.5 text-[#174C3C] hover:bg-[#EEF4F0] cursor-pointer"
                    title="Download PDF"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Development Works */}
        <div className="lg:col-span-5 rounded-xl border border-[#DDE5E0] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#1E2925]">Village Development Progress</h3>
              <p className="text-xs text-[#69766F]">Ongoing infrastructure works in Lakhlgoan</p>
            </div>
            <Link
              to="/member/development-works"
              className="text-xs font-semibold text-[#174C3C] hover:underline"
            >
              All Works →
            </Link>
          </div>
          <div className="space-y-4">
            {projects.slice(0, 3).map((prj) => (
              <div
                key={prj.id}
                className="rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1E2925]">{prj.name}</span>
                  <span className="font-mono-num font-bold text-[#174C3C]">{prj.progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#DDE5E0] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#174C3C]"
                    style={{ width: `${prj.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#69766F]">
                  <span>
                    {prj.ward} · {prj.scheme}
                  </span>
                  <span className="font-mono-num">Budget: {formatINR(prj.budget)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agenda Modal for Next Gram Sabha */}
      {showAgendaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-6 py-4">
              <div>
                <p className="text-xs font-bold uppercase text-[#174C3C]">
                  2 October 2026 • 11:00 AM
                </p>
                <h3 className="text-base font-bold text-[#1E2925]">{nextGramSabha.title}</h3>
              </div>
              <button
                onClick={() => setShowAgendaModal(false)}
                className="rounded-lg p-1 text-[#69766F] hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-[#69766F]">
                Venue: <strong className="text-[#1E2925]">Gram Panchayat Office, Lakhlgoan</strong>
              </p>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#69766F] mb-2">
                  Official Meeting Agenda
                </h4>
                <ul className="space-y-2 text-sm text-[#1E2925]">
                  {nextGramSabha.agendaItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#174C3C] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-3 border-t border-[#DDE5E0] flex justify-end gap-2">
                <button
                  onClick={() => {
                    triggerDummyDownload(
                      nextGramSabha.minutesPdf,
                      'Gram Sabha Notice & Agenda – 2 Oct 2026'
                    );
                    showToast('Downloaded Gram Sabha Agenda PDF', 'info');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#174C3C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#236A52]"
                >
                  <Download className="h-3.5 w-3.5" /> Download Agenda Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
