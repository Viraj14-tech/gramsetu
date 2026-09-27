import React, { useState } from 'react';
import {
  FileText,
  Receipt,
  HardHat,
  Bell,
  Users,
  HardDrive,
  Download,
  FileSpreadsheet,
  Eye,
} from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { formatDate, formatINR, exportToCSV, triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';

type ReportType =
  | 'Document Summary'
  | 'Financial Year Expenditure'
  | 'Development Work Status'
  | 'Notice Summary'
  | 'Meeting Records'
  | 'Storage Usage';

const REPORT_TYPES: { id: ReportType; desc: string; icon: React.ElementType }[] = [
  {
    id: 'Document Summary',
    desc: 'Category-wise breakdown of public and internal digital files for FY 2026–27.',
    icon: FileText,
  },
  {
    id: 'Financial Year Expenditure',
    desc: 'Paid and pending vendor bills, grant utilization, and department outlay.',
    icon: Receipt,
  },
  {
    id: 'Development Work Status',
    desc: 'Physical and financial progress of ongoing GPDP and Jal Jeevan Mission works.',
    icon: HardHat,
  },
  {
    id: 'Notice Summary',
    desc: 'Log of active, expired, and draft citizen notices and circulars.',
    icon: Bell,
  },
  {
    id: 'Meeting Records',
    desc: 'Attendance and resolution register for Gram Sabha and monthly meetings.',
    icon: Users,
  },
  {
    id: 'Storage Usage',
    desc: 'Digital repository allocation across PDFs, spreadsheets, and photo albums.',
    icon: HardDrive,
  },
];

export const AdminReports: React.FC = () => {
  const { documents, bills, projects, notices, meetings, showToast } = usePortal();
  const [selectedReport, setSelectedReport] = useState<ReportType>('Document Summary');

  const getReportTable = (): { headers: string[]; rows: (string | number)[][] } => {
    switch (selectedReport) {
      case 'Document Summary':
        return {
          headers: ['Doc ID', 'Title', 'Category', 'Financial Year', 'Visibility', 'Status', 'Date'],
          rows: documents.map((d) => [
            d.id,
            d.title,
            d.category,
            d.financialYear,
            d.visibility === 'public' ? 'Public' : 'Admin Only',
            d.status,
            formatDate(d.date),
          ]),
        };
      case 'Financial Year Expenditure':
        return {
          headers: ['Bill No.', 'Vendor', 'Purpose', 'Department', 'Amount (INR)', 'Date', 'Status'],
          rows: bills.map((b) => [
            b.id,
            b.vendor,
            b.purpose,
            b.department,
            formatINR(b.amount),
            formatDate(b.date),
            b.status,
          ]),
        };
      case 'Development Work Status':
        return {
          headers: ['Project ID', 'Work Name', 'Ward', 'Scheme', 'Budget', 'Spent', 'Progress', 'Status'],
          rows: projects.map((p) => [
            p.id,
            p.name,
            p.ward,
            p.scheme,
            formatINR(p.budget),
            formatINR(p.spent),
            `${p.progress}%`,
            p.status,
          ]),
        };
      case 'Notice Summary':
        return {
          headers: ['Notice ID', 'Title', 'Category', 'Publish Date', 'Expiry Date', 'Status'],
          rows: notices.map((n) => [
            n.id,
            n.title,
            n.category,
            formatDate(n.publishDate),
            formatDate(n.expiryDate),
            n.status,
          ]),
        };
      case 'Meeting Records':
        return {
          headers: ['Meeting ID', 'Title', 'Type', 'Date', 'Attendance', 'Agenda Items', 'Resolutions'],
          rows: meetings.map((m) => [
            m.id,
            m.title,
            m.type,
            formatDate(m.date),
            m.attendance,
            m.agendaCount,
            m.resolutionsCount,
          ]),
        };
      case 'Storage Usage':
        return {
          headers: ['Module / Bucket', 'File Count', 'Storage Consumed', 'Quota Share', 'Status'],
          rows: [
            ['Gram Sabha & Meeting PDFs', 42, '640 MB', '12.8%', 'Nominal'],
            ['Development Work Site Photos', 68, '520 MB', '10.4%', 'Nominal'],
            ['Bills, Vouchers & Audit Reports', 46, '380 MB', '7.6%', 'Nominal'],
            ['Namuna No. 8 & Tax Registers', 18, '190 MB', '3.8%', 'Nominal'],
            ['Citizen Application Form Templates', 9, '70 MB', '1.4%', 'Nominal'],
          ],
        };
    }
  };

  const { headers, rows } = getReportTable();

  const handleExportCSV = () => {
    const slug = selectedReport.toLowerCase().replace(/\s+/g, '-');
    exportToCSV(`lakhlgoan-gp-${slug}-2026.csv`, headers, rows);
    showToast(`Exported "${selectedReport}" as CSV.`, 'success');
  };

  const handleExportPDF = () => {
    const slug = selectedReport.toLowerCase().replace(/\s+/g, '-');
    triggerDummyDownload(`lakhlgoan-gp-${slug}-report.pdf`, `${selectedReport} – FY 2026–27`, {
      'Report Type': selectedReport,
      'Total Records': String(rows.length),
      'Prepared By': 'Gram Sevak, Lakhlgoan Gram Panchayat',
    });
    showToast(`Exported "${selectedReport}" official PDF summary.`, 'success');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Administrative Reports' },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE5E0] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
            Administrative Reports &amp; Registers
          </h2>
          <p className="mt-1 text-sm text-[#69766F]">
            Generate, inspect, and export Gram Panchayat statutory summaries in PDF or CSV format.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 rounded-lg bg-[#174C3C] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#236A52] transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-[#174C3C] bg-white px-4 py-2.5 text-xs font-semibold text-[#174C3C] hover:bg-[#EEF4F0] transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORT_TYPES.map((rep) => {
          const Icon = rep.icon;
          const isSelected = selectedReport === rep.id;
          return (
            <div
              key={rep.id}
              onClick={() => setSelectedReport(rep.id)}
              className={`rounded-xl border p-4 cursor-pointer transition-colors flex flex-col justify-between ${
                isSelected
                  ? 'border-[#174C3C] bg-[#EEF4F0]/70'
                  : 'border-[#DDE5E0] bg-white hover:border-[#236A52]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-[#1E2925]">{rep.id}</span>
                  <Icon className="h-4 w-4 text-[#174C3C]" />
                </div>
                <p className="text-xs text-[#69766F] leading-relaxed">{rep.desc}</p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#DDE5E0]/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#174C3C] inline-flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> View Report
                </span>
                <span className="text-[#69766F]">FY 2026–27</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Report Preview Table */}
      <div className="rounded-xl border border-[#DDE5E0] bg-white overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDE5E0] bg-[#F7F8F5] px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-[#1E2925]">
              Report Preview: {selectedReport}
            </h3>
            <p className="text-xs text-[#69766F]">
              Lakhlgoan Gram Panchayat • Generated on{' '}
              {new Date().toLocaleDateString('en-IN')} ({rows.length} rows)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="rounded border border-[#DDE5E0] bg-white px-3 py-1.5 text-xs font-semibold text-[#174C3C] hover:bg-[#EEF4F0] cursor-pointer"
            >
              Export PDF
            </button>
            <button
              onClick={handleExportCSV}
              className="rounded border border-[#DDE5E0] bg-white px-3 py-1.5 text-xs font-semibold text-[#236A52] hover:bg-[#EEF4F0] cursor-pointer"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DDE5E0] bg-white text-[11px] font-semibold uppercase tracking-wider text-[#69766F]">
                {headers.map((h) => (
                  <th key={h} className="py-3 px-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE5E0] text-sm">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#EEF4F0]/40">
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`py-3 px-4 text-xs ${
                        cIdx === 0
                          ? 'font-mono-num font-bold text-[#174C3C]'
                          : cIdx === 1
                          ? 'font-semibold text-[#1E2925]'
                          : 'text-[#1E2925]'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
