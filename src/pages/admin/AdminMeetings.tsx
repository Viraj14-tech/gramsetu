import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Users,
  Calendar,
  FileText,
  Download,
  CheckCircle2,
  Clock,
  X,
  ListChecks,
} from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { formatDate, triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { MeetingRecord, MeetingType } from '../../types';

const MEETING_TYPES: ('All' | MeetingType)[] = [
  'All',
  'Gram Sabha',
  'Monthly Panchayat Meeting',
  'Special Meeting',
];

export const AdminMeetings: React.FC = () => {
  const { meetings, addMeeting, showToast } = usePortal();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedType, setSelectedType] = useState<'All' | MeetingType>('All');
  const [activeMeeting, setActiveMeeting] = useState<MeetingRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add meeting form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MeetingType>('Gram Sabha');
  const [date, setDate] = useState('2026-10-02');
  const [time, setTime] = useState('11:00 AM');
  const [attendance, setAttendance] = useState('165 Citizens');
  const [agendaText, setAgendaText] = useState('');
  const [resolutionsCount, setResolutionsCount] = useState('5');
  const [status, setStatus] = useState<'Completed' | 'Scheduled'>('Completed');

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setIsAddModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filteredMeetings = meetings.filter(
    (m) => selectedType === 'All' || m.type === selectedType
  );

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedAgenda = agendaText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    addMeeting({
      title: title.trim(),
      type,
      date,
      time,
      venue: 'Gram Panchayat Karyalaya, Lakhlgoan',
      attendance: attendance.trim() || '11 / 11 Members',
      agendaCount: parsedAgenda.length || 4,
      agendaItems:
        parsedAgenda.length > 0
          ? parsedAgenda
          : [
              'Confirmation of previous meeting proceedings',
              'Review of ward-wise water supply and sanitation works',
              'Scrutiny of monthly income and expenditure vouchers',
              'Approval of citizen residence and NOC applications',
            ],
      resolutionsCount: Number(resolutionsCount) || 0,
      resolutionsSummary: [
        `Proceedings recorded under ${type} register dated ${formatDate(date)}.`,
      ],
      minutesPdf: '/documents/gram-sabha-august-2026.pdf',
      status,
    });

    setTitle('');
    setAgendaText('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Meeting Records' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE5E0] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
            Gram Sabha &amp; Panchayat Meeting Records
          </h2>
          <p className="mt-1 text-sm text-[#69766F]">
            Maintain statutory Gram Sabha proceedings, monthly committee meetings, attendance registers, and passed resolutions.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#174C3C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#236A52] transition-colors whitespace-nowrap cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add Meeting Record</span>
        </button>
      </div>

      {/* Section Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#DDE5E0] bg-white p-2">
        {MEETING_TYPES.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedType(tab)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
              selectedType === tab
                ? 'bg-[#174C3C] text-white'
                : 'text-[#69766F] hover:bg-[#EEF4F0] hover:text-[#1E2925]'
            }`}
          >
            {tab === 'Monthly Panchayat Meeting' ? 'Monthly Panchayat Meetings' : tab === 'Special Meeting' ? 'Special Meetings' : tab}
          </button>
        ))}
      </div>

      {/* Meetings List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMeetings.map((mtg) => (
          <div
            key={mtg.id}
            className="rounded-xl border border-[#DDE5E0] bg-white p-5 hover:border-[#236A52] transition-colors"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#69766F]">
                  <span className="font-semibold text-[#174C3C]">{mtg.type}</span>
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
                    <strong className="text-[#1E2925]">Resolutions Passed:</strong>{' '}
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
                  onClick={() => setActiveMeeting(mtg)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#174C3C] bg-white px-3.5 py-2 text-xs font-semibold text-[#174C3C] hover:bg-[#EEF4F0] transition-colors cursor-pointer"
                >
                  <ListChecks className="h-4 w-4" />
                  <span>Agenda &amp; Resolutions</span>
                </button>

                <button
                  onClick={() => {
                    triggerDummyDownload(mtg.minutesPdf, `${mtg.title} - Minutes`, {
                      'Meeting Type': mtg.type,
                      Date: mtg.date,
                      Attendance: mtg.attendance,
                      Resolutions: String(mtg.resolutionsCount),
                    });
                    showToast(`Downloaded Minutes PDF for ${mtg.title}`, 'info');
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

      {/* Meeting Details Modal */}
      {activeMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden my-8">
            <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-6 py-4">
              <div>
                <p className="text-xs font-semibold text-[#174C3C]">
                  {activeMeeting.type} · {formatDate(activeMeeting.date)}
                </p>
                <h3 className="text-lg font-bold text-[#1E2925]">{activeMeeting.title}</h3>
              </div>
              <button
                onClick={() => setActiveMeeting(null)}
                className="rounded-lg p-1.5 text-[#69766F] hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-lg bg-[#F7F8F5] p-3.5 border border-[#DDE5E0] text-xs">
                <div>
                  <span className="text-[#69766F]">Attendance</span>
                  <p className="font-semibold text-[#1E2925] mt-0.5">{activeMeeting.attendance}</p>
                </div>
                <div>
                  <span className="text-[#69766F]">Resolutions Count</span>
                  <p className="font-mono-num font-bold text-[#174C3C] mt-0.5">
                    {activeMeeting.resolutionsCount} Resolutions
                  </p>
                </div>
                <div>
                  <span className="text-[#69766F]">Status</span>
                  <p className="font-semibold text-[#1E2925] mt-0.5">{activeMeeting.status}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#69766F] mb-2">
                  Meeting Agenda ({activeMeeting.agendaItems.length} Items)
                </h4>
                <ol className="list-decimal list-inside space-y-2 rounded-lg border border-[#DDE5E0] bg-white p-4 text-sm text-[#1E2925]">
                  {activeMeeting.agendaItems.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#69766F] mb-2">
                  Key Resolutions Summary
                </h4>
                <ul className="space-y-2 rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-4 text-xs text-[#1E2925]">
                  {activeMeeting.resolutionsSummary.map((res, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#174C3C] shrink-0 mt-0.5" />
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#DDE5E0]">
                <button
                  onClick={() => {
                    triggerDummyDownload(
                      activeMeeting.minutesPdf,
                      `${activeMeeting.title} - Minutes`
                    );
                    showToast('Downloading Minutes PDF...', 'info');
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#174C3C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#236A52]"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Official Minutes PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Meeting Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-[#1E2925]">Log Meeting Record</h3>
                <p className="text-xs text-[#69766F]">
                  Record Gram Sabha or Monthly Panchayat Committee proceedings
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1.5 text-[#69766F] hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., October Monthly Panchayat Committee Meeting"
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Meeting Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as MeetingType)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                  >
                    <option value="Gram Sabha">Gram Sabha</option>
                    <option value="Monthly Panchayat Meeting">Monthly Panchayat Meeting</option>
                    <option value="Special Meeting">Special Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Meeting Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm font-mono-num focus:border-[#174C3C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Attendance Summary
                  </label>
                  <input
                    type="text"
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                    placeholder="e.g., 184 Citizens or 11/11"
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Resolutions Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={resolutionsCount}
                    onChange={(e) => setResolutionsCount(e.target.value)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm font-mono-num focus:border-[#174C3C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Agenda Items (One per line)
                </label>
                <textarea
                  rows={3}
                  value={agendaText}
                  onChange={(e) => setAgendaText(e.target.value)}
                  placeholder="1. Review of water supply maintenance&#10;2. Approval of vendor bills"
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
                  Save Meeting Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
