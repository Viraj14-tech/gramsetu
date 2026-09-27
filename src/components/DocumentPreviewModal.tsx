import React, { useState } from 'react';
import { X, FileText, Download, Eye, Printer, ShieldCheck, Calendar, User, Folder, Hash } from 'lucide-react';
import { usePortal } from '../utils/PortalContext';
import { formatDate, triggerDummyDownload } from '../utils/formatters';
import { CivicEmblem } from './CivicEmblem';

export const DocumentPreviewModal: React.FC = () => {
  const { previewDoc, setPreviewDoc, showToast } = usePortal();
  const [showSimulatedPdf, setShowSimulatedPdf] = useState(true);

  if (!previewDoc) return null;

  const handleDownload = () => {
    triggerDummyDownload(previewDoc.file, previewDoc.title, {
      'Document ID': previewDoc.id,
      'Reference No': previewDoc.documentNumber,
      Category: previewDoc.category,
      'Financial Year': previewDoc.financialYear,
      'Document Date': previewDoc.date,
      Department: previewDoc.department,
      'Uploaded By': previewDoc.uploadedBy,
      Visibility: previewDoc.visibility === 'public' ? 'Public / Citizen Access' : 'Internal Admin Only',
      Description: previewDoc.description,
    });
    showToast(`Downloading "${previewDoc.file.split('/').pop()}"...`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden my-8">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0]/70 px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#174C3C] text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-[#69766F]">
                <span className="font-mono-num font-medium text-[#174C3C]">{previewDoc.documentNumber}</span>
                <span>·</span>
                <span>{previewDoc.category}</span>
                <span>·</span>
                <span>FY {previewDoc.financialYear}</span>
              </div>
              <h2 className="truncate text-lg font-bold text-[#1E2925]">{previewDoc.title}</h2>
            </div>
          </div>
          <button
            onClick={() => setPreviewDoc(null)}
            className="rounded-lg p-2 text-[#69766F] hover:bg-white hover:text-[#1E2925] transition-colors"
            aria-label="Close document preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Grid: Metadata + Simulated Official Document Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[75vh] overflow-y-auto">
          {/* Left Metadata Column */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#DDE5E0] bg-[#F7F8F5] p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#69766F] mb-2">
                  Record Metadata
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-start justify-between gap-2 border-b border-[#DDE5E0]/70 pb-2">
                    <span className="text-[#69766F] flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5" /> Document No.
                    </span>
                    <span className="font-mono-num font-medium text-[#1E2925] text-right">
                      {previewDoc.documentNumber}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 border-b border-[#DDE5E0]/70 pb-2">
                    <span className="text-[#69766F] flex items-center gap-1.5">
                      <Folder className="h-3.5 w-3.5" /> Category
                    </span>
                    <span className="font-medium text-[#1E2925] text-right">{previewDoc.category}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2 border-b border-[#DDE5E0]/70 pb-2">
                    <span className="text-[#69766F] flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Document Date
                    </span>
                    <span className="font-mono-num font-medium text-[#1E2925]">
                      {formatDate(previewDoc.date)}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 border-b border-[#DDE5E0]/70 pb-2">
                    <span className="text-[#69766F] flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" /> Uploaded By
                    </span>
                    <span className="font-medium text-[#1E2925]">{previewDoc.uploadedBy}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2 border-b border-[#DDE5E0]/70 pb-2">
                    <span className="text-[#69766F] flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5" /> Visibility
                    </span>
                    <span className="font-medium text-[#1E2925]">
                      {previewDoc.visibility === 'public' ? 'Public / Citizen' : 'Admin Only'} · {previewDoc.status}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 pb-1">
                    <span className="text-[#69766F]">File Path</span>
                    <span className="font-mono-num text-xs text-[#236A52] break-all text-right">
                      {previewDoc.file} ({previewDoc.fileSize})
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#69766F] mb-1.5">
                  Abstract / Description
                </h3>
                <p className="text-sm leading-relaxed text-[#1E2925] bg-white p-3.5 rounded-lg border border-[#DDE5E0]">
                  {previewDoc.description}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#DDE5E0] flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowSimulatedPdf(!showSimulatedPdf)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[#174C3C] bg-white px-4 py-2.5 text-sm font-semibold text-[#174C3C] hover:bg-[#EEF4F0] transition-colors whitespace-nowrap"
                >
                  <Eye className="h-4 w-4" />
                  {showSimulatedPdf ? 'Refresh Preview' : 'Show Preview'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#174C3C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#236A52] transition-colors whitespace-nowrap"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Right Simulated PDF Document Sheet */}
          <div className="lg:col-span-7 bg-[#E6ECE8] p-5 sm:p-7 flex flex-col items-center justify-center">
            <div className="w-full max-w-lg rounded-lg border border-[#DDE5E0] bg-white p-6 sm:p-8 shadow-sm">
              {/* Official Gram Panchayat Letterhead Simulation */}
              <div className="border-b-2 border-[#174C3C] pb-4 mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CivicEmblem size={40} className="text-[#174C3C] shrink-0" />
                  <div>
                    <p className="font-marathi text-base font-bold text-[#174C3C]">
                      ग्रामपंचायत कार्यालय लाखलगाव
                    </p>
                    <p className="text-xs font-bold tracking-wide text-[#1E2925] uppercase">
                      Gram Panchayat Karyalaya Lakhlgoan
                    </p>
                    <p className="text-[11px] text-[#69766F]">
                      Digital Record Copy • Prototype Demonstration System
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono-num text-[11px] text-[#69766F]">
                  <p>Ref: {previewDoc.documentNumber}</p>
                  <p>Date: {formatDate(previewDoc.date)}</p>
                  <p>FY: {previewDoc.financialYear}</p>
                </div>
              </div>

              {/* Document Body Content */}
              <div className="space-y-4 text-xs sm:text-sm text-[#1E2925]">
                <div className="bg-[#EEF4F0] px-3.5 py-2 rounded border border-[#DDE5E0]">
                  <p className="text-[11px] font-semibold uppercase text-[#236A52]">Subject / Title</p>
                  <p className="font-bold text-[#1E2925] mt-0.5">{previewDoc.title}</p>
                </div>

                <div className="space-y-2 leading-relaxed text-[#1E2925]/90 text-xs">
                  <p>
                    <strong>Department:</strong> {previewDoc.department} &nbsp;|&nbsp;{' '}
                    <strong>Category:</strong> {previewDoc.category}
                  </p>
                  <p>{previewDoc.description}</p>
                  <p className="text-[#69766F] pt-2">
                    Certified that this digital record is maintained in the Lakhlgoan Gram Panchayat Digital
                    Register under reference number <span className="font-mono-num">{previewDoc.documentNumber}</span>{' '}
                    for the financial year <span className="font-mono-num">{previewDoc.financialYear}</span>.
                  </p>
                </div>

                {/* Stamp & Signature Block */}
                <div className="pt-6 mt-6 border-t border-dashed border-[#DDE5E0] flex items-end justify-between">
                  <div className="text-[11px] text-[#69766F]">
                    <p className="font-mono-num">File: {previewDoc.file.split('/').pop()}</p>
                    <p>Format: {previewDoc.fileType} ({previewDoc.fileSize})</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block rounded border border-[#236A52]/40 bg-[#EEF4F0]/60 px-3 py-1.5 text-center">
                      <p className="text-[10px] font-semibold uppercase text-[#174C3C]">Digitally Indexed</p>
                      <p className="text-xs font-bold text-[#1E2925]">{previewDoc.uploadedBy}</p>
                      <p className="text-[10px] text-[#69766F]">Gram Panchayat Lakhlgoan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between w-full max-w-lg text-xs text-[#69766F]">
              <span>Simulated PDF Preview • Academic Prototype</span>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 text-[#174C3C] font-medium hover:underline"
              >
                <Printer className="h-3.5 w-3.5" /> Print Record
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
