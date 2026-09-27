import React, { useState } from 'react';
import {
  Users,
  Download,
  CheckCircle2,
  Clock,
  ListChecks,
  X,
} from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { formatDate, triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { MeetingRecord } from '../../types';

export const MemberMeetings: React.FC = () => {
  const { meetings, showToast } = usePortal();
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRecord | null>(null);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Meeting Records' },
        ]}
      />

      <div className="border-b border-[#DDE5E0] pb-5">
        <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
          Gram Sabha &amp; Panchayat Meeting Proceedings
        </h2>
        <p className="mt-1 text-sm text-[#69766F]">
          Public access to Gram Sabha agendas, attendance summaries, passed resolutions, and official minutes PDFs.
        </p>
      </div>

      <div className="space-y-4">
        {meetings.map((mtg) => (
          <div
            key={mtg.id}
            className="rounded-xl border border-[#DDE5E0] bg-white p-5 hover:border-[#236A52] transition-colors"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#69766F]">
                  <span className="font-bold text-[#174C3C]">{mtg.type}</span>
                  <span>·</span>
                  <span className="font-mono-num">{formatDate(mtg.date)}</span>
                  <span>·</span>
                  <span>{mtg.time}</span>
                  <span>·</span>
                  <span>{mtg.venue}</span>
                </div>

                <h3 className="text-lg font-bold text-[#1E2925]">{mtg.title}</h3>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-1 text-xs text-[#69766F]">
                  <span>
                    <strong className="text-[#1E2925]">Attendance:</strong> {mtg.attendance}
                  </span>
                  <span>
                    <strong className="text-[#1E2925]">Agenda Items:</strong>{' '}
                    <span className="font-mono-num">{mtg.agendaCount}</span>
                  </span>
                  <span>
                    <strong className="text-[#1E2925]">Resolutions:</strong>{' '}
                    <span className="font-mono-num">{mtg.resolutionsCount}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#174C3C]">
                    {mtg.status === 'Completed' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#174C3C]" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-[#D99528]" />
                    )}
                    {mtg.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setSelectedMeeting(mtg)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#174C3C] bg-white px-3.5 py-2 text-xs font-semibold text-[#174C3C] hover:bg-[#EEF4F0] transition-colors cursor-pointer"
                >
                  <ListChecks className="h-4 w-4" />
                  <span>View Agenda &amp; Resolutions</span>
                </button>

                <button
                  onClick={() => {
                    triggerDummyDownload(mtg.minutesPdf, `${mtg.title} - Minutes`);
                    showToast(`Downloaded Minutes PDF (${mtg.title})`, 'info');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#174C3C] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#236A52] transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Minutes PDF</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden my-8">
            <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-6 py-4">
              <div>
                <p className="text-xs font-semibold text-[#174C3C]">
                  {selectedMeeting.type} · {formatDate(selectedMeeting.date)}
                </p>
                <h3 className="text-lg font-bold text-[#1E2925]">{selectedMeeting.title}</h3>
              </div>
              <button
                onClick={() => setSelectedMeeting(null)}
                className="rounded-lg p-1.5 text-[#69766F] hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#69766F] mb-2">
                  Agenda Items
                </h4>
                <ol className="list-decimal list-inside space-y-2 rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-4 text-sm text-[#1E2925]">
                  {selectedMeeting.agendaItems.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ol>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#69766F] mb-2">
                  Passed Resolutions Summary
                </h4>
                <ul className="space-y-2 rounded-lg border border-[#DDE5E0] bg-white p-4 text-xs text-[#1E2925]">
                  {selectedMeeting.resolutionsSummary.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#174C3C] shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
