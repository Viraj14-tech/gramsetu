import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  FileText,
  Download,
  CheckCircle2,
  Clock,
  Trash2,
  X,
} from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { formatDate, formatINR, triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { BillStatus } from '../../types';

export const AdminBills: React.FC = () => {
  const { bills, addBill, toggleBillStatus, deleteBill, showToast } = usePortal();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for new bill
  const [vendor, setVendor] = useState('');
  const [purpose, setPurpose] = useState('');
  const [department, setDepartment] = useState('Public Works');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('2026-09-27');
  const [status, setStatus] = useState<BillStatus>('Paid');

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setIsModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      !search.trim() ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.vendor.toLowerCase().includes(search.toLowerCase()) ||
      b.purpose.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All' || b.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor.trim() || !purpose.trim() || !amount) return;

    addBill({
      vendor: vendor.trim(),
      purpose: purpose.trim(),
      department,
      amount: Number(amount) || 0,
      date,
      financialYear: '2026-27',
      status,
      document: '/documents/streetlight-maintenance-bill.pdf',
      visibility: 'public',
      voucherRef: `VCH/26-27/${Math.floor(Math.random() * 899 + 100)}`,
    });

    setVendor('');
    setPurpose('');
    setAmount('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Bills & Expenses' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE5E0] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
            Bills &amp; Expenses
          </h2>
          <p className="mt-1 text-sm text-[#69766F]">
            Maintain Gram Panchayat vendor vouchers, payment registers, and departmental expenditure.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#174C3C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#236A52] transition-colors whitespace-nowrap cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add Bill</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
          <span className="text-xs font-medium text-[#69766F]">Total Bills</span>
          <p className="font-mono-num text-2xl font-bold text-[#1E2925] mt-1">
            {46 + Math.max(0, bills.length - 10)}
          </p>
          <p className="text-[11px] text-[#69766F] mt-1">Registered vouchers in FY 2026–27</p>
        </div>

        <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
          <span className="text-xs font-medium text-[#69766F]">Paid</span>
          <p className="font-mono-num text-2xl font-bold text-[#174C3C] mt-1">₹18,75,000</p>
          <p className="text-[11px] text-[#69766F] mt-1">Cleared via PFMS / Gram Nidhi</p>
        </div>

        <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
          <span className="text-xs font-medium text-[#69766F]">Pending</span>
          <p className="font-mono-num text-2xl font-bold text-[#D99528] mt-1">₹2,60,000</p>
          <p className="text-[11px] text-[#69766F] mt-1">Awaiting committee sanction</p>
        </div>

        <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
          <span className="text-xs font-medium text-[#69766F]">Current FY</span>
          <p className="font-mono-num text-2xl font-bold text-[#1E2925] mt-1">2026–27</p>
          <p className="text-[11px] text-[#69766F] mt-1">April 2026 – March 2027</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#69766F]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bill no., vendor or purpose..."
              className="w-full rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] pl-9 pr-3 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] px-3 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:bg-white focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Electricity">Electricity</option>
            <option value="Public Works">Public Works</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Administration">Administration</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] px-3 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:bg-white focus:outline-none"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Bills Table */}
      <div className="rounded-xl border border-[#DDE5E0] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DDE5E0] bg-[#F7F8F5] text-[11px] font-semibold uppercase tracking-wider text-[#69766F]">
                <th className="py-3 px-4">Bill Number</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Bill Date</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE5E0] text-sm">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-[#EEF4F0]/40 transition-colors">
                  <td className="py-3 px-4 font-mono-num text-xs font-semibold text-[#174C3C] whitespace-nowrap">
                    {bill.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#1E2925]">{bill.vendor}</td>
                  <td className="py-3 px-4 text-xs text-[#1E2925]">{bill.purpose}</td>
                  <td className="py-3 px-4 text-xs text-[#69766F] whitespace-nowrap">
                    {bill.department}
                  </td>
                  <td className="py-3 px-4 font-mono-num text-sm font-bold text-[#1E2925] text-right whitespace-nowrap">
                    {formatINR(bill.amount)}
                  </td>
                  <td className="py-3 px-4 font-mono-num text-xs text-[#69766F] whitespace-nowrap">
                    {formatDate(bill.date)}
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold whitespace-nowrap">
                    {bill.status === 'Paid' ? (
                      <span className="inline-flex items-center gap-1 text-[#174C3C]">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#D99528]">
                        <Clock className="h-3.5 w-3.5" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs whitespace-nowrap">
                    <button
                      onClick={() => {
                        triggerDummyDownload(bill.document, `${bill.id} - ${bill.purpose}`, {
                          Vendor: bill.vendor,
                          Department: bill.department,
                          Amount: formatINR(bill.amount),
                          Status: bill.status,
                        });
                        showToast(`Downloaded voucher for ${bill.id}`, 'info');
                      }}
                      className="inline-flex items-center gap-1 font-medium text-[#236A52] hover:underline cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Voucher PDF</span>
                      <Download className="h-3 w-3 ml-0.5" />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => toggleBillStatus(bill.id)}
                        className="rounded border border-[#DDE5E0] bg-white px-2.5 py-1 text-xs font-medium text-[#1E2925] hover:bg-[#EEF4F0] transition-colors cursor-pointer"
                      >
                        Mark {bill.status === 'Paid' ? 'Pending' : 'Paid'}
                      </button>
                      <button
                        onClick={() => deleteBill(bill.id)}
                        className="rounded border border-[#DDE5E0] bg-white p-1.5 text-[#69766F] hover:bg-[#C74A4A]/10 hover:text-[#C74A4A] transition-colors cursor-pointer"
                        title="Delete Bill"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-[#1E2925]">Add New Bill / Voucher</h3>
                <p className="text-xs text-[#69766F]">Record vendor invoice in FY 2026–27 ledger</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-[#69766F] hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateBill} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Vendor / Contractor Name *
                </label>
                <input
                  type="text"
                  required
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="e.g., Shree Ganesh Electricals"
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Purpose / Work Description *
                </label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g., Ward 3 Solar Streetlight Battery Replacement"
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                  >
                    <option value="Public Works">Public Works</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="45000"
                    className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm font-mono-num focus:border-[#174C3C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Bill Date
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
                    Payment Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as BillStatus)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

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
                  Save Bill Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
