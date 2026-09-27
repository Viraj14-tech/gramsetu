import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Eye,
  Pencil,
  UserX,
  UserCheck,
  X,
} from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { MemberRecord } from '../../types';

export const AdminMembers: React.FC = () => {
  const { members, addMember, updateMember, toggleMemberStatus } = usePortal();

  const [search, setSearch] = useState('');
  const [wardFilter, setWardFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [viewingMember, setViewingMember] = useState<MemberRecord | null>(null);
  const [editingMember, setEditingMember] = useState<MemberRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [ward, setWard] = useState('Ward 1');
  const [mobile, setMobile] = useState('98XXXXXX45');
  const [houseNo, setHouseNo] = useState('');
  const [memberSince, setMemberSince] = useState('2026');

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      !search.trim() ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.houseNo.toLowerCase().includes(search.toLowerCase());
    const matchesWard = wardFilter === 'All' || m.ward === wardFilter;
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesWard && matchesStatus;
  });

  const openEdit = (m: MemberRecord) => {
    setEditingMember(m);
    setName(m.name);
    setWard(m.ward);
    setMobile(m.mobile);
    setHouseNo(m.houseNo);
    setMemberSince(m.memberSince);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !houseNo.trim()) return;

    if (editingMember) {
      updateMember({
        ...editingMember,
        name: name.trim(),
        ward,
        mobile: mobile.trim(),
        houseNo: houseNo.trim(),
        memberSince,
      });
      setEditingMember(null);
    } else {
      addMember({
        name: name.trim(),
        ward,
        mobile: mobile.trim() || '98XXXXXX00',
        houseNo: houseNo.trim(),
        memberSince,
        status: 'Active',
        familyMembersCount: 4,
        taxStatus: 'Paid',
      });
      setIsAddModalOpen(false);
    }

    setName('');
    setHouseNo('');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Members Management' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE5E0] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
            Registered Villagers &amp; Members Directory
          </h2>
          <p className="mt-1 text-sm text-[#69766F]">
            Manage citizen portal accounts, ward-wise household numbers, and member verification status.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingMember(null);
            setName('');
            setHouseNo('');
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#174C3C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#236A52] transition-colors whitespace-nowrap cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>+ Register Member</span>
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
              placeholder="Search by Member ID (LGP001), name, or house no..."
              className="w-full rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] pl-9 pr-3 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="w-full rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] px-3 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:bg-white focus:outline-none"
          >
            <option value="All">All Wards (Ward 1 – Ward 6)</option>
            <option value="Ward 1">Ward 1</option>
            <option value="Ward 2">Ward 2</option>
            <option value="Ward 3">Ward 3</option>
            <option value="Ward 4">Ward 4</option>
            <option value="Ward 5">Ward 5</option>
            <option value="Ward 6">Ward 6</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] px-3 py-2 text-sm text-[#1E2925] focus:border-[#174C3C] focus:bg-white focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-xl border border-[#DDE5E0] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DDE5E0] bg-[#F7F8F5] text-[11px] font-semibold uppercase tracking-wider text-[#69766F]">
                <th className="py-3 px-4">Member ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Ward</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">House No.</th>
                <th className="py-3 px-4">Member Since</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE5E0] text-sm">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-[#EEF4F0]/40 transition-colors">
                  <td className="py-3 px-4 font-mono-num text-xs font-bold text-[#174C3C]">
                    {m.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#1E2925]">{m.name}</td>
                  <td className="py-3 px-4 text-xs text-[#69766F]">{m.ward}</td>
                  <td className="py-3 px-4 font-mono-num text-xs text-[#1E2925]">{m.mobile}</td>
                  <td className="py-3 px-4 font-mono-num text-xs text-[#1E2925]">{m.houseNo}</td>
                  <td className="py-3 px-4 font-mono-num text-xs text-[#69766F]">
                    {m.memberSince}
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold">
                    <span
                      className={
                        m.status === 'Active' ? 'text-[#174C3C]' : 'text-[#C74A4A]'
                      }
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setViewingMember(m)}
                        className="rounded border border-[#DDE5E0] bg-white px-2.5 py-1 text-xs font-medium text-[#1E2925] hover:bg-[#EEF4F0] cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 inline mr-1 text-[#174C3C]" />
                        View
                      </button>
                      <button
                        onClick={() => openEdit(m)}
                        className="rounded border border-[#DDE5E0] bg-white px-2.5 py-1 text-xs font-medium text-[#1E2925] hover:bg-[#EEF4F0] cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5 inline mr-1 text-[#236A52]" />
                        Edit
                      </button>
                      <button
                        onClick={() => toggleMemberStatus(m.id)}
                        className={`rounded border px-2.5 py-1 text-xs font-medium cursor-pointer ${
                          m.status === 'Active'
                            ? 'border-[#C74A4A]/30 bg-white text-[#C74A4A] hover:bg-[#C74A4A]/10'
                            : 'border-[#174C3C]/30 bg-white text-[#174C3C] hover:bg-[#EEF4F0]'
                        }`}
                      >
                        {m.status === 'Active' ? (
                          <>
                            <UserX className="h-3.5 w-3.5 inline mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-3.5 w-3.5 inline mr-1" />
                            Activate
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Member Modal */}
      {viewingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-6 py-4">
              <div>
                <span className="font-mono-num text-xs font-bold text-[#174C3C]">
                  {viewingMember.id}
                </span>
                <h3 className="text-base font-bold text-[#1E2925]">{viewingMember.name}</h3>
              </div>
              <button
                onClick={() => setViewingMember(null)}
                className="rounded-lg p-1 text-[#69766F] hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div className="flex justify-between border-b border-[#DDE5E0] pb-2">
                <span className="text-[#69766F]">Ward</span>
                <span className="font-semibold text-[#1E2925]">{viewingMember.ward}</span>
              </div>
              <div className="flex justify-between border-b border-[#DDE5E0] pb-2">
                <span className="text-[#69766F]">House Number (Namuna 8)</span>
                <span className="font-mono-num font-semibold text-[#1E2925]">
                  House No. {viewingMember.houseNo}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#DDE5E0] pb-2">
                <span className="text-[#69766F]">Registered Mobile</span>
                <span className="font-mono-num font-semibold text-[#1E2925]">
                  {viewingMember.mobile}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#DDE5E0] pb-2">
                <span className="text-[#69766F]">Family Members</span>
                <span className="font-mono-num font-semibold text-[#1E2925]">
                  {viewingMember.familyMembersCount} Persons
                </span>
              </div>
              <div className="flex justify-between border-b border-[#DDE5E0] pb-2">
                <span className="text-[#69766F]">Property Tax Status (2026–27)</span>
                <span className="font-semibold text-[#174C3C]">{viewingMember.taxStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#69766F]">Portal Account Status</span>
                <span className="font-bold text-[#174C3C]">{viewingMember.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Member Modal */}
      {(isAddModalOpen || editingMember) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-6 py-4">
              <h3 className="text-base font-bold text-[#1E2925]">
                {editingMember ? `Edit Member ${editingMember.id}` : 'Register New Villager Member'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingMember(null);
                }}
                className="rounded-lg p-1 text-[#69766F] hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveMember} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Ganeshrao Patil"
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">Ward</label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm"
                  >
                    <option value="Ward 1">Ward 1</option>
                    <option value="Ward 2">Ward 2</option>
                    <option value="Ward 3">Ward 3</option>
                    <option value="Ward 4">Ward 4</option>
                    <option value="Ward 5">Ward 5</option>
                    <option value="Ward 6">Ward 6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    House No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                    placeholder="e.g., 145"
                    className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Member Since
                  </label>
                  <input
                    type="text"
                    value={memberSince}
                    onChange={(e) => setMemberSince(e.target.value)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm font-mono-num"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#DDE5E0]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingMember(null);
                  }}
                  className="rounded-lg border border-[#DDE5E0] px-4 py-2 text-sm text-[#69766F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#174C3C] px-5 py-2 text-sm font-semibold text-white hover:bg-[#236A52]"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
