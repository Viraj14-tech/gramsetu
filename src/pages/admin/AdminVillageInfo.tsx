import React, { useState } from 'react';
import {
  Landmark,
  Users,
  Home,
  BookOpen,
  MapPin,
  Phone,
  Clock,
  Info,
  Pencil,
  X,
} from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';

interface AdminVillageInfoProps {
  isMemberView?: boolean;
}

export const AdminVillageInfo: React.FC<AdminVillageInfoProps> = ({ isMemberView = false }) => {
  const { village, updateVillageInfo } = usePortal();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [population, setPopulation] = useState(String(village.population));
  const [households, setHouseholds] = useState(String(village.households));
  const [literacy, setLiteracy] = useState(village.literacy);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateVillageInfo({
      ...village,
      population: Number(population) || 4860,
      households: Number(households) || 1145,
      literacy: literacy.trim() || '78.4%',
    });
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: isMemberView ? '/member/dashboard' : '/admin/dashboard' },
          { label: 'Village Information' },
        ]}
      />

      {/* Subtle Academic Disclaimer Banner */}
      <div className="flex items-center justify-between gap-3 rounded-lg border border-[#D99528]/35 bg-[#D99528]/10 px-4 py-2.5 text-xs text-[#1E2925]">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 shrink-0 text-[#174C3C]" />
          <span className="font-semibold">Prototype data for academic demonstration</span>
          <span className="hidden sm:inline text-[#69766F]">
            — Administrative details and contact names shown below are simulated demo records.
          </span>
        </div>
        {!isMemberView && (
          <button
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center gap-1 rounded border border-[#174C3C] bg-white px-2.5 py-1 text-xs font-semibold text-[#174C3C] hover:bg-[#EEF4F0] shrink-0 cursor-pointer"
          >
            <Pencil className="h-3 w-3" /> Edit Profile
          </button>
        )}
      </div>

      {/* Hero Village Profile Card */}
      <div className="rounded-xl border border-[#DDE5E0] bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 relative min-h-[240px] bg-[#174C3C]">
            <img
              src="/images/gram-panchayat-office.jpg"
              alt="Lakhlgoan Gram Panchayat Karyalaya"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-5 text-white">
              <p className="font-marathi text-xl font-bold">{village.marathiName}</p>
              <p className="text-sm font-semibold text-[#EEF4F0]">
                {village.village} {village.type} • {village.state}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DDE5E0] pb-3">
                <div>
                  <h2 className="text-xl font-bold text-[#1E2925]">
                    {village.village} Gram Panchayat Profile
                  </h2>
                  <p className="text-xs text-[#69766F]">
                    Census &amp; Administrative Overview • Code: {village.gramPanchayatCode}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#174C3C] bg-[#EEF4F0] px-3 py-1 rounded-md">
                  {village.state}, {village.country}
                </span>
              </div>

              {/* Key Demographic Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-[#DDE5E0]">
                <div>
                  <span className="text-xs text-[#69766F] flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-[#174C3C]" /> Population
                  </span>
                  <p className="font-mono-num text-xl font-bold text-[#1E2925] mt-1">
                    {village.population.toLocaleString('en-IN')}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-[#69766F] flex items-center gap-1">
                    <Home className="h-3.5 w-3.5 text-[#236A52]" /> Households
                  </span>
                  <p className="font-mono-num text-xl font-bold text-[#1E2925] mt-1">
                    {village.households.toLocaleString('en-IN')}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-[#69766F] flex items-center gap-1">
                    <Landmark className="h-3.5 w-3.5 text-[#174C3C]" /> Total Wards
                  </span>
                  <p className="font-mono-num text-xl font-bold text-[#1E2925] mt-1">
                    {village.totalWards}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-[#69766F] flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-[#236A52]" /> Literacy
                  </span>
                  <p className="font-mono-num text-xl font-bold text-[#174C3C] mt-1">
                    {village.literacy}
                  </p>
                </div>
              </div>

              {/* Administrative Jurisdiction Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 pt-4 text-xs">
                <div>
                  <span className="text-[#69766F]">Village Name:</span>
                  <p className="font-semibold text-[#1E2925]">{village.village}</p>
                </div>
                <div>
                  <span className="text-[#69766F]">Local Body Type:</span>
                  <p className="font-semibold text-[#1E2925]">{village.type}</p>
                </div>
                <div>
                  <span className="text-[#69766F]">PIN Code:</span>
                  <p className="font-mono-num font-semibold text-[#1E2925]">{village.pin}</p>
                </div>
                <div>
                  <span className="text-[#69766F]">Taluka:</span>
                  <p className="font-semibold text-[#1E2925]">{village.taluka}</p>
                </div>
                <div>
                  <span className="text-[#69766F]">District:</span>
                  <p className="font-semibold text-[#1E2925]">{village.district}</p>
                </div>
                <div>
                  <span className="text-[#69766F]">State / Country:</span>
                  <p className="font-semibold text-[#1E2925]">
                    {village.state}, {village.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Administrative Contacts */}
      <div className="rounded-xl border border-[#DDE5E0] bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#1E2925]">Administrative Contacts</h3>
            <p className="text-xs text-[#69766F]">
              Key office bearers and administrative staff (Demo Contacts)
            </p>
          </div>
          <span className="text-xs text-[#69766F]">Prototype Demo Directory</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {village.officials.map((off, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] p-4 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#174C3C]">
                  {off.role}
                </span>
                <h4 className="text-base font-bold text-[#1E2925] mt-1">{off.name}</h4>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DDE5E0] space-y-1 text-xs text-[#69766F]">
                <p className="flex items-center gap-1.5 font-mono-num">
                  <Phone className="h-3.5 w-3.5 text-[#236A52]" />
                  <span>{off.contact}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#236A52]" />
                  <span>{off.officeHours}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ward-wise Breakdown Table */}
      <div className="rounded-xl border border-[#DDE5E0] bg-white overflow-hidden">
        <div className="border-b border-[#DDE5E0] px-5 py-4">
          <h3 className="text-base font-bold text-[#1E2925]">
            Ward-Wise Demographic &amp; Representation Summary
          </h3>
          <p className="text-xs text-[#69766F]">
            Distribution of households and population across all 6 wards of Lakhlgoan
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DDE5E0] bg-[#F7F8F5] text-[11px] font-semibold uppercase tracking-wider text-[#69766F]">
                <th className="py-3 px-4">Ward Number</th>
                <th className="py-3 px-4 text-right">Households</th>
                <th className="py-3 px-4 text-right">Population</th>
                <th className="py-3 px-4">Ward Member (Demo)</th>
                <th className="py-3 px-4">Key Civic Landmark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE5E0] text-sm">
              {village.wards.map((w) => (
                <tr key={w.ward} className="hover:bg-[#EEF4F0]/40">
                  <td className="py-3 px-4 font-bold text-[#174C3C]">{w.ward}</td>
                  <td className="py-3 px-4 font-mono-num text-right text-[#1E2925]">
                    {w.households}
                  </td>
                  <td className="py-3 px-4 font-mono-num text-right text-[#1E2925]">
                    {w.population}
                  </td>
                  <td className="py-3 px-4 text-xs font-medium text-[#1E2925]">
                    {w.representative}
                  </td>
                  <td className="py-3 px-4 text-xs text-[#69766F]">
                    <MapPin className="h-3.5 w-3.5 inline mr-1 text-[#236A52]" />
                    {w.keyLandmark}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal for Admin */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-6 py-4">
              <h3 className="text-base font-bold text-[#1E2925]">
                Update Village Census Metrics
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="rounded-lg p-1 text-[#69766F] hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Population
                </label>
                <input
                  type="number"
                  value={population}
                  onChange={(e) => setPopulation(e.target.value)}
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm font-mono-num"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Total Households
                </label>
                <input
                  type="number"
                  value={households}
                  onChange={(e) => setHouseholds(e.target.value)}
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm font-mono-num"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Literacy Rate
                </label>
                <input
                  type="text"
                  value={literacy}
                  onChange={(e) => setLiteracy(e.target.value)}
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm font-mono-num"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#DDE5E0]">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="rounded-lg border border-[#DDE5E0] px-4 py-2 text-sm text-[#69766F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#174C3C] px-5 py-2 text-sm font-semibold text-white hover:bg-[#236A52]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
