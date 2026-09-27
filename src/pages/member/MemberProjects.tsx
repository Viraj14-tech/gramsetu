import React, { useState } from 'react';
import { Eye, Download, FileText, Image as ImageIcon, X } from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { formatDate, formatINR, triggerDummyDownload } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { DevelopmentProject } from '../../types';

export const MemberProjects: React.FC = () => {
  const { projects, showToast } = usePortal();
  const [selectedProject, setSelectedProject] = useState<DevelopmentProject | null>(null);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Development Works' },
        ]}
      />

      <div className="border-b border-[#DDE5E0] pb-5">
        <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
          Village Development Works &amp; Citizen Transparency
        </h2>
        <p className="mt-1 text-sm text-[#69766F]">
          Track ward-wise road construction, drinking water pipelines, solar street lighting, and sanitation works.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((prj) => (
          <div
            key={prj.id}
            onClick={() => setSelectedProject(prj)}
            className="rounded-xl border border-[#DDE5E0] bg-white p-5 hover:border-[#174C3C] transition-colors cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#69766F] mb-2">
                <span>
                  <strong className="text-[#174C3C]">{prj.ward}</strong> · {prj.scheme}
                </span>
                <span className="font-semibold text-[#174C3C]">{prj.status}</span>
              </div>

              <h3 className="text-lg font-bold text-[#1E2925]">{prj.name}</h3>
              <p className="mt-1 text-xs text-[#69766F] leading-relaxed">{prj.description}</p>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-[#69766F]">Work Completion Progress</span>
                  <span className="font-mono-num font-bold text-[#174C3C]">{prj.progress}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-[#EEF4F0] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#174C3C]"
                    style={{ width: `${prj.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-[#F7F8F5] p-3 border border-[#DDE5E0]/70 text-xs">
                <div>
                  <span className="text-[#69766F]">Sanctioned Budget</span>
                  <p className="font-mono-num text-sm font-bold text-[#1E2925] mt-0.5">
                    {formatINR(prj.budget)}
                  </p>
                </div>
                <div>
                  <span className="text-[#69766F]">Expected Completion</span>
                  <p className="font-mono-num text-sm font-semibold text-[#1E2925] mt-0.5">
                    {formatDate(prj.expectedCompletion)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#DDE5E0] flex items-center justify-between text-xs">
              <span className="text-[#69766F]">Project ID: {prj.id}</span>
              <span className="font-semibold text-[#174C3C] inline-flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> View Site Photos &amp; Details
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Citizen Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden my-8">
            <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-6 py-4">
              <div>
                <p className="text-xs font-semibold text-[#174C3C]">
                  {selectedProject.ward} · {selectedProject.scheme}
                </p>
                <h3 className="text-lg font-bold text-[#1E2925]">{selectedProject.name}</h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="rounded-lg p-1.5 text-[#69766F] hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <p className="text-sm text-[#1E2925] leading-relaxed">
                {selectedProject.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-lg bg-[#F7F8F5] p-4 border border-[#DDE5E0] text-xs">
                <div>
                  <span className="text-[#69766F]">Sanctioned Budget</span>
                  <p className="font-mono-num font-bold text-[#1E2925] mt-0.5">
                    {formatINR(selectedProject.budget)}
                  </p>
                </div>
                <div>
                  <span className="text-[#69766F]">Funds Utilized</span>
                  <p className="font-mono-num font-bold text-[#236A52] mt-0.5">
                    {formatINR(selectedProject.spent)}
                  </p>
                </div>
                <div>
                  <span className="text-[#69766F]">Physical Progress</span>
                  <p className="font-mono-num font-bold text-[#174C3C] mt-0.5">
                    {selectedProject.progress}% ({selectedProject.status})
                  </p>
                </div>
              </div>

              {/* Site Photos */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#69766F] mb-2.5 flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-[#174C3C]" /> Site Photographs
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedProject.photos.map((ph, idx) => (
                    <div
                      key={idx}
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

              {/* Public Documents */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#69766F] mb-2 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-[#174C3C]" /> Public Sanction Documents
                </h4>
                <div className="space-y-2">
                  {selectedProject.documents.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] px-3.5 py-2 text-xs"
                    >
                      <span className="font-medium text-[#1E2925]">{d.title}</span>
                      <button
                        onClick={() => {
                          triggerDummyDownload(d.file, d.title);
                          showToast(`Downloaded ${d.title}`, 'info');
                        }}
                        className="inline-flex items-center gap-1 font-semibold text-[#174C3C] hover:underline cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
