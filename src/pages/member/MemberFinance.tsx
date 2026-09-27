import React from 'react';
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
import { Download, ShieldCheck } from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { formatDate, formatINR, triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export const MemberFinance: React.FC = () => {
  const { village, bills, showToast } = usePortal();
  const fin = village.financialSummary;

  // Strictly show only public bills in citizen transparency view
  const publicBills = bills.filter((b) => b.visibility === 'public' && b.status === 'Paid');

  const chartData = fin.categoryBreakdown.map((c) => ({
    name: c.category,
    'Allocated Budget': c.allocated / 1000,
    'Actual Expenditure': c.spent / 1000,
  }));

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Financial Transparency' },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE5E0] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
            Gram Panchayat Financial Transparency
          </h2>
          <p className="mt-1 text-sm text-[#69766F]">
            Citizen summary of annual grants received, sector-wise utilization, and verified public works expenditure for FY {fin.financialYear}.
          </p>
        </div>
        <button
          onClick={() => {
            triggerDummyDownload(
              '/documents/annual-budget-2026-27.pdf',
              'Annual Gram Panchayat Budget & Citizen Audit Statement 2026–27'
            );
            showToast('Downloaded Annual Budget Statement PDF', 'info');
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#174C3C] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#236A52] transition-colors cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Download Budget Summary PDF</span>
        </button>
      </div>

      {/* 4 Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
          <span className="text-xs font-medium text-[#69766F]">Annual Budget FY</span>
          <p className="font-mono-num text-2xl font-bold text-[#1E2925] mt-1">
            {fin.financialYear}
          </p>
          <p className="text-[11px] text-[#69766F] mt-1">Approved by Gram Sabha</p>
        </div>

        <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
          <span className="text-xs font-medium text-[#69766F]">Total Funds Received</span>
          <p className="font-mono-num text-2xl font-bold text-[#1E2925] mt-1">
            {formatINR(fin.totalGrants)}
          </p>
          <p className="text-[11px] text-[#69766F] mt-1">15th FC + State Grants + Tax</p>
        </div>

        <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
          <span className="text-xs font-medium text-[#69766F]">Total Expenditure</span>
          <p className="font-mono-num text-2xl font-bold text-[#236A52] mt-1">
            {formatINR(fin.totalExpenditure)}
          </p>
          <p className="text-[11px] text-[#69766F] mt-1">65.7% Utilized on Village Works</p>
        </div>

        <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
          <span className="text-xs font-medium text-[#69766F]">Available Balance</span>
          <p className="font-mono-num text-2xl font-bold text-[#174C3C] mt-1">
            {formatINR(fin.availableBalance)}
          </p>
          <p className="text-[11px] text-[#69766F] mt-1">Reserved for Q3–Q4 works</p>
        </div>
      </div>

      {/* Category-Wise Expenditure Chart & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-xl border border-[#DDE5E0] bg-white p-5">
          <h3 className="text-base font-bold text-[#1E2925] mb-1">
            Category-Wise Expenditure (FY {fin.financialYear})
          </h3>
          <p className="text-xs text-[#69766F] mb-4">
            Comparison of allocated budget vs actual expenditure (in ₹ Thousands)
          </p>

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
                  formatter={(val) => [`₹${(Number(val ?? 0) * 1000).toLocaleString('en-IN')}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Allocated Budget" fill="#DDE5E0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual Expenditure" fill="#174C3C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-xl border border-[#DDE5E0] bg-white p-5">
          <h3 className="text-base font-bold text-[#1E2925] mb-1">Sector Allocation Table</h3>
          <p className="text-xs text-[#69766F] mb-4">
            Public disclosure of funds spent per development head
          </p>

          <div className="divide-y divide-[#DDE5E0] text-xs">
            {fin.categoryBreakdown.map((item) => {
              const pct = Math.round((item.spent / item.allocated) * 100);
              return (
                <div key={item.category} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#1E2925]">{item.category}</p>
                    <p className="text-[11px] text-[#69766F]">
                      Allocated: <span className="font-mono-num">{formatINR(item.allocated)}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono-num font-bold text-[#174C3C]">
                      {formatINR(item.spent)}
                    </p>
                    <p className="font-mono-num text-[11px] text-[#69766F]">{pct}% utilized</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Verified Public Works Expenditure Register */}
      <div className="rounded-xl border border-[#DDE5E0] bg-white overflow-hidden">
        <div className="border-b border-[#DDE5E0] px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1E2925]">
              Public Works Disbursed Payments Summary
            </h3>
            <p className="text-xs text-[#69766F]">
              Publicly disclosed work payments ratified by the Panchayat Committee
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#174C3C]">
            <ShieldCheck className="h-4 w-4" /> Social Audit Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DDE5E0] bg-[#F7F8F5] text-[11px] font-semibold uppercase tracking-wider text-[#69766F]">
                <th className="py-3 px-4">Voucher Ref</th>
                <th className="py-3 px-4">Public Work / Purpose</th>
                <th className="py-3 px-4">Sector / Department</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Disbursed Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE5E0] text-sm">
              {publicBills.map((b) => (
                <tr key={b.id} className="hover:bg-[#EEF4F0]/40">
                  <td className="py-3 px-4 font-mono-num text-xs font-semibold text-[#174C3C]">
                    {b.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#1E2925]">{b.purpose}</td>
                  <td className="py-3 px-4 text-xs text-[#69766F]">{b.department}</td>
                  <td className="py-3 px-4 font-mono-num text-xs text-[#69766F]">
                    {formatDate(b.date)}
                  </td>
                  <td className="py-3 px-4 font-mono-num text-sm font-bold text-[#1E2925] text-right">
                    {formatINR(b.amount)}
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
