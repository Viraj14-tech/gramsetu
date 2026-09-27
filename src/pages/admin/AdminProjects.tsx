import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  HardHat,
  FileText,
  Image as ImageIcon,
  Calendar,
  Building2,
  X,
  Download,
  Eye,
  LayoutGrid,
  List,
} from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { formatDate, formatINR, triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { DevelopmentProject, ProjectStatus } from '../../types';

export const AdminProjects: React.FC = () => {
  const { projects, addProject, updateProjectProgress, showToast } = usePortal();
  const [searchParams, setSearchParams] = useSearchParams();

  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedProject, setSelectedProject] = useState<DevelopmentProject | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add project form state
  const [name, setName] = useState('');
  const [ward, setWard] = useState('Ward 1');
  const [scheme, setScheme] = useState('15th Finance Commission');
  const [contractor, setContractor] = useState('');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [expectedCompletion, setExpectedCompletion] = useState('2027-01-31');
  const [budget, setBudget] = useState('');
  const [spent, setSpent] = useState('');
  const [progress, setProgress] = useState('25');
  const [status, setStatus] = useState<ProjectStatus>('In Progress');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setIsAddModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filteredProjects = projects.filter(
    (p) => statusFilter === 'All' || p.status === statusFilter
  );

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !budget) return;

    addProject({
      name: name.trim(),
      ward,
      scheme,
      contractor: contractor.trim() || 'Gram Panchayat Department Execution',
      startDate,
      expectedCompletion,
      budget: Number(budget) || 0,
      spent: Number(spent) || 0,
      progress: Number(progress) || 0,
      status,
      description:
        description.trim() ||
        `Rural infrastructure work sanctioned under ${scheme} in ${ward}.`,
      documents: [
        {
          title: `Sanction Order & Estimate – ${name.trim()}`,
          file: '/documents/village-development-plan.pdf',
        },
      ],
      photos: [
        {
          title: `${name.trim()} Site Inspection`,
          url: '/images/road-development.jpg',
          caption: `Work site inspection in ${ward}.`,
        },
      ],
    });

    setName('');
    setContractor('');
    setBudget('');
    setSpent('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Development Works' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE5E0] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
            Village Development Works
          </h2>
          <p className="mt-1 text-sm text-[#69766F]">
            Track physical progress, contractor budgets, and geo-tagged site photos of Gram Panchayat infrastructure projects.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-lg border border-[#DDE5E0] bg-white p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#174C3C] text-white'
                  : 'text-[#69766F] hover:text-[#1E2925]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5 inline mr-1" />
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#174C3C] text-white'
                  : 'text-[#69766F] hover:text-[#1E2925]'
              }`}
            >
              <List className="h-3.5 w-3.5 inline mr-1" />
              Table
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#174C3C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#236A52] transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add Development Work</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 rounded-lg border border-[#DDE5E0] bg-white p-1">
          {['All', 'In Progress', 'Completed', 'Planning'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#174C3C] text-white'
                  : 'text-[#69766F] hover:text-[#1E2925]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#69766F]">
          Click any project to inspect engineering details, documents, and site photographs
        </span>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map((prj) => (
            <div
              key={prj.id}
              onClick={() => setSelectedProject(prj)}
              className="rounded-xl border border-[#DDE5E0] bg-white p-5 hover:border-[#236A52] transition-colors cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-[#69766F] mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-num font-bold text-[#174C3C]">{prj.id}</span>
                    <span>·</span>
                    <span>{prj.ward}</span>
                    <span>·</span>
                    <span>{prj.scheme}</span>
                  </div>
                  <span
                    className={`font-semibold ${
                      prj.status === 'Completed'
                        ? 'text-[#174C3C]'
                        : prj.status === 'In Progress'
                        ? 'text-[#236A52]'
                        : 'text-[#D99528]'
                    }`}
                  >
                    {prj.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#1E2925]">{prj.name}</h3>
                <p className="mt-1 text-xs text-[#69766F] line-clamp-2 leading-relaxed">
                  {prj.description}
                </p>

                {/* Budget & Expenditure Grid */}
                <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-[#F7F8F5] p-3 border border-[#DDE5E0]/70">
                  <div>
                    <span className="text-[11px] text-[#69766F]">Sanctioned Budget</span>
                    <p className="font-mono-num text-sm font-bold text-[#1E2925]">
                      {formatINR(prj.budget)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#69766F]">Expenditure</span>
                    <p className="font-mono-num text-sm font-bold text-[#236A52]">
                      {formatINR(prj.spent)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#69766F]">Completion Date</span>
                    <p className="font-mono-num text-xs font-semibold text-[#1E2925] mt-0.5">
                      {formatDate(prj.expectedCompletion)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-[#69766F]">Physical Progress</span>
                    <span className="font-mono-num font-bold text-[#174C3C]">{prj.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#EEF4F0] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#174C3C] transition-all duration-300"
                      style={{ width: `${prj.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DDE5E0] flex items-center justify-between text-xs text-[#69766F]">
                <span>Contractor: {prj.contractor}</span>
                <span className="font-semibold text-[#174C3C] inline-flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> View Details ({prj.photos.length} photos)
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl border border-[#DDE5E0] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DDE5E0] bg-[#F7F8F5] text-[11px] font-semibold uppercase tracking-wider text-[#69766F]">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">Ward</th>
                  <th className="py-3 px-4">Scheme</th>
                  <th className="py-3 px-4 text-right">Budget</th>
                  <th className="py-3 px-4 text-right">Spent</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE5E0] text-sm">
                {filteredProjects.map((prj) => (
                  <tr key={prj.id} className="hover:bg-[#EEF4F0]/40 transition-colors">
                    <td className="py-3 px-4 font-mono-num text-xs font-bold text-[#174C3C]">
                      {prj.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1E2925]">{prj.name}</td>
                    <td className="py-3 px-4 text-xs text-[#69766F]">{prj.ward}</td>
                    <td className="py-3 px-4 text-xs text-[#69766F]">{prj.scheme}</td>
                    <td className="py-3 px-4 font-mono-num text-xs font-semibold text-right">
                      {formatINR(prj.budget)}
                    </td>
                    <td className="py-3 px-4 font-mono-num text-xs text-[#236A52] text-right">
                      {formatINR(prj.spent)}
                    </td>
                    <td className="py-3 px-4 font-mono-num text-xs font-bold text-[#174C3C]">
                      {prj.progress}%
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-[#1E2925]">
                      {prj.status}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedProject(prj)}
                        className="rounded border border-[#DDE5E0] bg-white px-2.5 py-1 text-xs font-medium text-[#174C3C] hover:bg-[#EEF4F0]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Project View Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden my-8">
            <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-6 py-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#69766F]">
                  <span className="font-mono-num font-bold text-[#174C3C]">
                    {selectedProject.id}
                  </span>
                  <span>·</span>
                  <span>{selectedProject.ward}</span>
                  <span>·</span>
                  <span>{selectedProject.scheme}</span>
                </div>
                <h3 className="text-lg font-bold text-[#1E2925]">{selectedProject.name}</h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="rounded-lg p-1.5 text-[#69766F] hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
              <p className="text-sm text-[#1E2925] leading-relaxed">
                {selectedProject.description}
              </p>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-[#DDE5E0] bg-[#F7F8F5] p-4 text-xs">
                <div>
                  <span className="text-[#69766F]">Contractor</span>
                  <p className="font-semibold text-[#1E2925] mt-0.5">
                    {selectedProject.contractor}
                  </p>
                </div>
                <div>
                  <span className="text-[#69766F]">Start Date</span>
                  <p className="font-mono-num font-semibold text-[#1E2925] mt-0.5">
                    {formatDate(selectedProject.startDate)}
                  </p>
                </div>
                <div>
                  <span className="text-[#69766F]">Expected Completion</span>
                  <p className="font-mono-num font-semibold text-[#1E2925] mt-0.5">
                    {formatDate(selectedProject.expectedCompletion)}
                  </p>
                </div>
                <div>
                  <span className="text-[#69766F]">Current Status</span>
                  <p className="font-bold text-[#174C3C] mt-0.5">{selectedProject.status}</p>
                </div>
              </div>

              {/* Quick Progress Update Control for Admin */}
              <div className="rounded-xl border border-[#DDE5E0] bg-white p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#174C3C]">
                      Update Work Progress (Admin Control)
                    </h4>
                    <p className="text-xs text-[#69766F]">
                      Budget: {formatINR(selectedProject.budget)} · Spent:{' '}
                      {formatINR(selectedProject.spent)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => {
                          const newStatus: ProjectStatus =
                            pct === 100 ? 'Completed' : 'In Progress';
                          const newSpent = Math.round((selectedProject.budget * pct) / 100);
                          updateProjectProgress(
                            selectedProject.id,
                            pct,
                            newSpent,
                            newStatus
                          );
                          setSelectedProject({
                            ...selectedProject,
                            progress: pct,
                            spent: newSpent,
                            status: newStatus,
                          });
                        }}
                        className={`rounded border px-2.5 py-1 text-xs font-mono-num font-semibold cursor-pointer ${
                          selectedProject.progress === pct
                            ? 'border-[#174C3C] bg-[#174C3C] text-white'
                            : 'border-[#DDE5E0] bg-[#F7F8F5] text-[#1E2925] hover:bg-[#EEF4F0]'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Linked Documents */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#69766F] mb-2.5 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-[#174C3C]" /> Project Documents &amp; Work
                  Orders
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedProject.documents.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] px-3.5 py-2.5"
                    >
                      <span className="text-xs font-medium text-[#1E2925] truncate pr-2">
                        {doc.title}
                      </span>
                      <button
                        onClick={() => {
                          triggerDummyDownload(doc.file, doc.title);
                          showToast(`Downloaded ${doc.title}`, 'info');
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#174C3C] hover:underline shrink-0 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" /> PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Site Photos */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#69766F] mb-2.5 flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-[#236A52]" /> Geo-Tagged Site Photographs
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedProject.photos.map((ph, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-[#DDE5E0] overflow-hidden bg-[#F7F8F5]"
                    >
                      <img
                        src={ph.url}
                        alt={ph.title}
                        referrerPolicy="no-referrer"
                        className="h-44 w-full object-cover"
                      />
                      <div className="p-3">
                        <p className="text-xs font-bold text-[#1E2925]">{ph.title}</p>
                        <p className="text-[11px] text-[#69766F] mt-0.5">{ph.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Development Work Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden my-8">
            <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-[#1E2925]">Add Development Work</h3>
                <p className="text-xs text-[#69766F]">
                  Register new village infrastructure project under GPDP / JJM
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1.5 text-[#69766F] hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., RCC Culvert & Approach Road – Ward 4"
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">Ward</label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                  >
                    <option value="Ward 1">Ward 1</option>
                    <option value="Ward 2">Ward 2</option>
                    <option value="Ward 3">Ward 3</option>
                    <option value="Ward 4">Ward 4</option>
                    <option value="Ward 5">Ward 5</option>
                    <option value="Ward 6">Ward 6</option>
                    <option value="All Wards">All Wards</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">Scheme</label>
                  <input
                    type="text"
                    value={scheme}
                    onChange={(e) => setScheme(e.target.value)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Sanctioned Budget (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="500000"
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm font-mono-num focus:border-[#174C3C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Expenditure So Far (₹)
                  </label>
                  <input
                    type="number"
                    value={spent}
                    onChange={(e) => setSpent(e.target.value)}
                    placeholder="125000"
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm font-mono-num focus:border-[#174C3C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Contractor Name
                  </label>
                  <input
                    type="text"
                    value={contractor}
                    onChange={(e) => setContractor(e.target.value)}
                    placeholder="Omkar Construction"
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                    Progress (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm font-mono-num focus:border-[#174C3C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Scope of Work Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Technical details of the road, water, or sanitation work..."
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#DDE5E0]">
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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
