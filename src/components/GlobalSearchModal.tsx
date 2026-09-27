import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, Bell, HardHat, Users, ArrowRight } from 'lucide-react';
import { usePortal } from '../utils/PortalContext';
import { formatDate, formatINR } from '../utils/formatters';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    currentUser,
    documents,
    notices,
    projects,
    meetings,
    setPreviewDoc,
  } = usePortal();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!isSearchOpen || !currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const basePath = isAdmin ? '/admin' : '/member';
  const q = query.trim().toLowerCase();

  const visibleDocs = isAdmin ? documents : documents.filter((d) => d.visibility === 'public');
  const matchedDocs = q
    ? visibleDocs.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.documentNumber.toLowerCase().includes(q)
      )
    : visibleDocs.slice(0, 3);

  const visibleNotices = isAdmin ? notices : notices.filter((n) => n.status === 'Active');
  const matchedNotices = q
    ? visibleNotices.filter(
        (n) => n.title.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)
      )
    : visibleNotices.slice(0, 2);

  const matchedProjects = q
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.scheme.toLowerCase().includes(q) ||
          p.ward.toLowerCase().includes(q)
      )
    : projects.slice(0, 2);

  const matchedMeetings = q
    ? meetings.filter(
        (m) => m.title.toLowerCase().includes(q) || m.type.toLowerCase().includes(q)
      )
    : meetings.slice(0, 2);

  const handleGo = (path: string) => {
    setIsSearchOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-16 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-xl border border-[#DDE5E0] bg-white shadow-2xl overflow-hidden">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 border-b border-[#DDE5E0] px-4 py-3.5 bg-[#F7F8F5]">
          <Search className="h-5 w-5 text-[#174C3C] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents, notices, Gram Sabha meetings, or development works..."
            className="w-full bg-transparent text-sm text-[#1E2925] placeholder-[#69766F] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#69766F] hover:text-[#1E2925] px-1.5"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="rounded-lg p-1.5 text-[#69766F] hover:bg-white hover:text-[#1E2925]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Results Body */}
        <div className="max-h-[70vh] overflow-y-auto p-5 space-y-5">
          {/* Documents */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#69766F] flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#174C3C]" /> Documents ({matchedDocs.length})
              </span>
              <button
                onClick={() => handleGo(`${basePath}/documents`)}
                className="text-xs font-medium text-[#174C3C] hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            {matchedDocs.length === 0 ? (
              <p className="text-xs text-[#69766F] py-2">No matching documents found.</p>
            ) : (
              <div className="divide-y divide-[#DDE5E0] rounded-lg border border-[#DDE5E0]">
                {matchedDocs.slice(0, 4).map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setPreviewDoc(doc);
                    }}
                    className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left hover:bg-[#EEF4F0]/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#1E2925]">{doc.title}</p>
                      <p className="text-xs text-[#69766F]">
                        {doc.category} · <span className="font-mono-num">{doc.documentNumber}</span> ·{' '}
                        {formatDate(doc.date)}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-[#174C3C] shrink-0">Preview</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notices */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#69766F] flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5 text-[#D99528]" /> Official Notices ({matchedNotices.length})
              </span>
              <button
                onClick={() => handleGo(`${basePath}/notices`)}
                className="text-xs font-medium text-[#174C3C] hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            {matchedNotices.length === 0 ? (
              <p className="text-xs text-[#69766F] py-2">No matching notices found.</p>
            ) : (
              <div className="divide-y divide-[#DDE5E0] rounded-lg border border-[#DDE5E0]">
                {matchedNotices.slice(0, 3).map((nt) => (
                  <button
                    key={nt.id}
                    onClick={() => handleGo(`${basePath}/notices`)}
                    className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left hover:bg-[#EEF4F0]/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#1E2925]">{nt.title}</p>
                      <p className="text-xs text-[#69766F]">
                        {nt.category} · Published {formatDate(nt.publishDate)}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-[#236A52] shrink-0">{nt.status}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Development Projects */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#69766F] flex items-center gap-1.5">
                <HardHat className="h-3.5 w-3.5 text-[#236A52]" /> Development Works ({matchedProjects.length})
              </span>
              <button
                onClick={() => handleGo(`${basePath}/development-works`)}
                className="text-xs font-medium text-[#174C3C] hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            {matchedProjects.length === 0 ? (
              <p className="text-xs text-[#69766F] py-2">No matching development projects found.</p>
            ) : (
              <div className="divide-y divide-[#DDE5E0] rounded-lg border border-[#DDE5E0]">
                {matchedProjects.slice(0, 3).map((prj) => (
                  <button
                    key={prj.id}
                    onClick={() => handleGo(`${basePath}/development-works`)}
                    className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left hover:bg-[#EEF4F0]/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#1E2925]">{prj.name}</p>
                      <p className="text-xs text-[#69766F]">
                        {prj.ward} · {prj.scheme} · Budget {formatINR(prj.budget)}
                      </p>
                    </div>
                    <span className="font-mono-num text-xs font-semibold text-[#174C3C] shrink-0">
                      {prj.progress}%
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Meetings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#69766F] flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#174C3C]" /> Meeting Records ({matchedMeetings.length})
              </span>
              <button
                onClick={() => handleGo(`${basePath}/meetings`)}
                className="text-xs font-medium text-[#174C3C] hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            {matchedMeetings.length === 0 ? (
              <p className="text-xs text-[#69766F] py-2">No matching meeting records found.</p>
            ) : (
              <div className="divide-y divide-[#DDE5E0] rounded-lg border border-[#DDE5E0]">
                {matchedMeetings.slice(0, 2).map((mtg) => (
                  <button
                    key={mtg.id}
                    onClick={() => handleGo(`${basePath}/meetings`)}
                    className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left hover:bg-[#EEF4F0]/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#1E2925]">{mtg.title}</p>
                      <p className="text-xs text-[#69766F]">
                        {mtg.type} · {formatDate(mtg.date)} · {mtg.attendance}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-[#174C3C] shrink-0">{mtg.status}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
