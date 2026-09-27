import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Receipt,
  Bell,
  HardHat,
  Users,
  HardDrive,
  Upload,
  PlusCircle,
  Megaphone,
  Camera,
  CalendarPlus,
  Eye,
  Download,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { usePortal } from '../../utils/PortalContext';
import { formatDate, formatINR, triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export const AdminDashboard: React.FC = () => {
  const {
    documents,
    bills,
    notices,
    projects,
    village,
    setPreviewDoc,
    setEditingDoc,
    setIsUploadModalOpen,
    showToast,
  } = usePortal();
  const navigate = useNavigate();

  // Baseline demo totals combined with any newly added items during session
  const totalDocsCount = 128 + Math.max(0, documents.length - 12);
  const totalBillsCount = 46 + Math.max(0, bills.length - 10);
  const activeNoticesCount = notices.filter((n) => n.status === 'Active').length;
  const totalWorksCount = 14 + Math.max(0, projects.length - 6);

  const fin = village.financialSummary;

  const chartData = fin.categoryBreakdown.map((item) => ({
    name: item.category,
    Allocated: item.allocated / 1000,
    Expenditure: item.spent / 1000,
  }));

  const recentDocs = documents.slice(0, 6);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard' }, { label: 'Gram Panchayat Overview' }]} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE5E0] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
            Gram Panchayat Overview
          </h2>
          <p className="mt-1 text-sm text-[#69766F]">
            Manage village records, financial documents, notices and administrative information.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setEditingDoc(null);
              setIsUploadModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#174C3C] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#236A52] transition-colors whitespace-nowrap cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            <span>+ Upload Document</span>
          </button>
          <Link
            to="/admin/reports"
            className="inline-flex items-center gap-2 rounded-lg border border-[#DDE5E0] bg-white px-4 py-2.5 text-xs font-semibold text-[#1E2925] hover:bg-[#EEF4F0] transition-colors whitespace-nowrap"
          >
            <span>View Reports</span>
          </Link>
        </div>
      </div>

      {/* 6 Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
          <div className="flex items-center justify-between text-[#69766F] mb-2">
            <span className="text-xs font-medium">Total Documents</span>
            <FileText className="h-4 w-4 text-[#174C3C]" />
          </div>
          <p className="font-mono-num text-2xl font-bold text-[#1E2925]">{totalDocsCount}</p>
          <p className="mt-1 text-[11px] text-[#69766F]">FY 2026–27 Indexed</p>
        </div>

        <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
          <div className="flex items-center justify-between text-[#69766F] mb-2">
            <span className="text-xs font-medium">Bills &amp; Vouchers</span>
            <Receipt className="h-4 w-4 text-[#236A52]" />
          </div>
          <p className="font-mono-num text-2xl font-bold text-[#1E2925]">{totalBillsCount}</p>
          <p className="mt-1 text-[11px] text-[#69766F]">Verified Vouchers</p>
        </div>

        <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
          <div className="flex items-center justify-between text-[#69766F] mb-2">
            <span className="text-xs font-medium">Active Notices</span>
            <Bell className="h-4 w-4 text-[#D99528]" />
          </div>
          <p className="font-mono-num text-2xl font-bold text-[#1E2925]">{activeNoticesCount}</p>
          <p className="mt-1 text-[11px] text-[#69766F]">Citizen Board</p>
        </div>

        <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
          <div className="flex items-center justify-between text-[#69766F] mb-2">
            <span className="text-xs font-medium">Development Works</span>
            <HardHat className="h-4 w-4 text-[#174C3C]" />
          </div>
          <p className="font-mono-num text-2xl font-bold text-[#1E2925]">{totalWorksCount}</p>
          <p className="mt-1 text-[11px] text-[#69766F]">GPDP &amp; JJM Schemes</p>
        </div>

        <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
          <div className="flex items-center justify-between text-[#69766F] mb-2">
            <span className="text-xs font-medium">Registered Members</span>
            <Users className="h-4 w-4 text-[#236A52]" />
          </div>
          <p className="font-mono-num text-2xl font-bold text-[#1E2925]">1,286</p>
          <p className="mt-1 text-[11px] text-[#69766F]">6 Village Wards</p>
        </div>

        <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
          <div className="flex items-center justify-between text-[#69766F] mb-2">
            <span className="text-xs font-medium">Storage Used</span>
            <HardDrive className="h-4 w-4 text-[#174C3C]" />
          </div>
          <p className="font-mono-num text-xl font-bold text-[#1E2925]">1.8 GB / 5 GB</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-[#EEF4F0] overflow-hidden">
            <div className="h-full w-[36%] bg-[#236A52] rounded-full" />
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="rounded-xl border border-[#DDE5E0] bg-white p-5">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-[#1E2925]">Quick Administrative Actions</h3>
          <span className="text-xs text-[#69766F]">Direct shortcuts for daily Panchayat entry</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => {
              setEditingDoc(null);
              setIsUploadModalOpen(true);
            }}
            className="flex flex-col items-start gap-2 rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-3.5 text-left hover:border-[#174C3C] hover:bg-[#EEF4F0] transition-colors cursor-pointer"
          >
            <Upload className="h-4 w-4 text-[#174C3C]" />
            <span className="text-xs font-semibold text-[#1E2925]">Upload Document</span>
          </button>

          <button
            onClick={() => navigate('/admin/bills?action=new')}
            className="flex flex-col items-start gap-2 rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-3.5 text-left hover:border-[#174C3C] hover:bg-[#EEF4F0] transition-colors cursor-pointer"
          >
            <PlusCircle className="h-4 w-4 text-[#236A52]" />
            <span className="text-xs font-semibold text-[#1E2925]">Add Bill</span>
          </button>

          <button
            onClick={() => navigate('/admin/notices?action=new')}
            className="flex flex-col items-start gap-2 rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-3.5 text-left hover:border-[#174C3C] hover:bg-[#EEF4F0] transition-colors cursor-pointer"
          >
            <Megaphone className="h-4 w-4 text-[#D99528]" />
            <span className="text-xs font-semibold text-[#1E2925]">Publish Notice</span>
          </button>

          <button
            onClick={() => navigate('/admin/development-works?action=new')}
            className="flex flex-col items-start gap-2 rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-3.5 text-left hover:border-[#174C3C] hover:bg-[#EEF4F0] transition-colors cursor-pointer"
          >
            <HardHat className="h-4 w-4 text-[#174C3C]" />
            <span className="text-xs font-semibold text-[#1E2925]">Add Development Work</span>
          </button>

          <button
            onClick={() => navigate('/admin/gallery?action=upload')}
            className="flex flex-col items-start gap-2 rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-3.5 text-left hover:border-[#174C3C] hover:bg-[#EEF4F0] transition-colors cursor-pointer"
          >
            <Camera className="h-4 w-4 text-[#236A52]" />
            <span className="text-xs font-semibold text-[#1E2925]">Upload Photos</span>
          </button>

          <button
            onClick={() => navigate('/admin/meetings?action=new')}
            className="flex flex-col items-start gap-2 rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-3.5 text-left hover:border-[#174C3C] hover:bg-[#EEF4F0] transition-colors cursor-pointer"
          >
            <CalendarPlus className="h-4 w-4 text-[#174C3C]" />
            <span className="text-xs font-semibold text-[#1E2925]">Add Meeting Record</span>
          </button>
        </div>
      </div>

      {/* Financial Summary 2026-27 + Sector Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-xl border border-[#DDE5E0] bg-white p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-[#1E2925]">Financial Summary 2026–27</h3>
              <p className="text-xs text-[#69766F]">
                Sector-wise grant allocation vs actual expenditure (in ₹ Thousands)
              </p>
            </div>
            <Link
              to="/admin/bills"
              className="text-xs font-semibold text-[#174C3C] hover:underline inline-flex items-center gap-1"
            >
              Open Financial Ledger <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDE5E0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#69766F', fontSize: 11 }}
                  axisLine={{ stroke: '#DDE5E0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#69766F', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  unit="k"
                />
                <Tooltip
                  formatter={(value) => [`₹${(Number(value ?? 0) * 1000).toLocaleString('en-IN')}`, '']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DDE5E0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Allocated" fill="#DDE5E0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenditure" fill="#174C3C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Key Totals Column */}
        <div className="lg:col-span-4 rounded-xl border border-[#DDE5E0] bg-white p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1E2925]">Grant &amp; Treasury Balance</h3>
            <p className="text-xs text-[#69766F] mt-0.5">
              15th Finance Commission &amp; Gram Nidhi FY 2026–27
            </p>

            <div className="mt-5 space-y-4">
              <div className="border-b border-[#DDE5E0] pb-3.5">
                <span className="text-xs text-[#69766F]">Total Grants Received</span>
                <p className="font-mono-num text-xl font-bold text-[#1E2925] mt-0.5">
                  {formatINR(fin.totalGrants)}
                </p>
              </div>

              <div className="border-b border-[#DDE5E0] pb-3.5">
                <span className="text-xs text-[#69766F]">Total Expenditure</span>
                <p className="font-mono-num text-xl font-bold text-[#236A52] mt-0.5">
                  {formatINR(fin.totalExpenditure)}
                </p>
                <p className="text-[11px] text-[#69766F] mt-0.5">65.7% utilization across 6 heads</p>
              </div>

              <div>
                <span className="text-xs text-[#69766F]">Available Balance</span>
                <p className="font-mono-num text-xl font-bold text-[#174C3C] mt-0.5">
                  {formatINR(fin.availableBalance)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#DDE5E0] flex items-center justify-between text-xs text-[#69766F]">
            <span>Audit Status: Verified</span>
            <Link to="/admin/reports" className="font-semibold text-[#174C3C] hover:underline">
              Download Statement
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Documents Table */}
      <div className="rounded-xl border border-[#DDE5E0] bg-white overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDE5E0] px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-[#1E2925]">Recent Documents</h3>
            <p className="text-xs text-[#69766F]">
              Latest village records, bills, and resolutions uploaded to the digital repository
            </p>
          </div>
          <Link
            to="/admin/documents"
            className="text-xs font-semibold text-[#174C3C] hover:underline inline-flex items-center gap-1"
          >
            Manage All Documents <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DDE5E0] bg-[#F7F8F5] text-[11px] font-semibold uppercase tracking-wider text-[#69766F]">
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Financial Year</th>
                <th className="py-3 px-4">Uploaded By</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE5E0] text-sm">
              {recentDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#EEF4F0]/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#1E2925]">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="text-left hover:text-[#174C3C] hover:underline cursor-pointer"
                    >
                      {doc.title}
                    </button>
                    <div className="font-mono-num text-xs font-normal text-[#69766F]">
                      {doc.documentNumber}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-[#69766F]">{doc.category}</td>
                  <td className="py-3 px-4 font-mono-num text-xs text-[#1E2925]">
                    {doc.financialYear}
                  </td>
                  <td className="py-3 px-4 text-xs text-[#1E2925]">{doc.uploadedBy}</td>
                  <td className="py-3 px-4 font-mono-num text-xs text-[#69766F] whitespace-nowrap">
                    {formatDate(doc.date)}
                  </td>
                  <td className="py-3 px-4 text-xs font-medium">
                    <span
                      className={
                        doc.status === 'Published' || doc.status === 'Verified'
                          ? 'text-[#174C3C]'
                          : doc.status === 'Internal'
                          ? 'text-[#D99528]'
                          : 'text-[#69766F]'
                      }
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="rounded border border-[#DDE5E0] bg-white px-2.5 py-1 text-xs font-medium text-[#1E2925] hover:bg-[#EEF4F0] transition-colors cursor-pointer"
                        title="Preview Document"
                      >
                        <Eye className="h-3.5 w-3.5 inline mr-1 text-[#174C3C]" />
                        View
                      </button>
                      <button
                        onClick={() => {
                          triggerDummyDownload(doc.file, doc.title, {
                            Category: doc.category,
                            Reference: doc.documentNumber,
                          });
                          showToast(`Downloaded ${doc.file.split('/').pop()}`, 'info');
                        }}
                        className="rounded border border-[#DDE5E0] bg-white p-1.5 text-[#69766F] hover:bg-[#EEF4F0] hover:text-[#174C3C] transition-colors cursor-pointer"
                        title="Download File"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
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
