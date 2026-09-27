import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserAccount,
  UserRole,
  DocumentRecord,
  BillRecord,
  NoticeRecord,
  DevelopmentProject,
  MeetingRecord,
  CertificateForm,
  GalleryAlbum,
  MemberRecord,
  VillageInfo,
  NotificationItem,
} from '../types';

import initialUsers from '../data/users.json';
import initialDocuments from '../data/documents.json';
import initialBills from '../data/bills.json';
import initialNotices from '../data/notices.json';
import initialProjects from '../data/projects.json';
import initialMeetings from '../data/meetings.json';
import initialMembers from '../data/members.json';
import initialForms from '../data/forms.json';
import initialGallery from '../data/gallery.json';
import initialVillage from '../data/village.json';
import initialNotifications from '../data/notifications.json';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface PortalContextType {
  currentUser: UserAccount | null;
  login: (username: string, password: string, role: UserRole) => { success: boolean; error?: string };
  logout: () => void;

  documents: DocumentRecord[];
  addDocument: (doc: Omit<DocumentRecord, 'id'>) => void;
  updateDocument: (doc: DocumentRecord) => void;
  deleteDocument: (id: string) => void;

  bills: BillRecord[];
  addBill: (bill: Omit<BillRecord, 'id'>) => void;
  toggleBillStatus: (id: string) => void;
  deleteBill: (id: string) => void;

  notices: NoticeRecord[];
  addNotice: (notice: Omit<NoticeRecord, 'id'>) => void;
  updateNoticeStatus: (id: string, status: NoticeRecord['status']) => void;
  deleteNotice: (id: string) => void;

  projects: DevelopmentProject[];
  addProject: (project: Omit<DevelopmentProject, 'id'>) => void;
  updateProjectProgress: (id: string, progress: number, spent: number, status: DevelopmentProject['status']) => void;

  meetings: MeetingRecord[];
  addMeeting: (meeting: Omit<MeetingRecord, 'id'>) => void;

  members: MemberRecord[];
  addMember: (member: Omit<MemberRecord, 'id'>) => void;
  updateMember: (member: MemberRecord) => void;
  toggleMemberStatus: (id: string) => void;

  forms: CertificateForm[];
  addForm: (form: Omit<CertificateForm, 'id'>) => void;

  gallery: GalleryAlbum[];
  addAlbum: (album: Omit<GalleryAlbum, 'id'>) => void;
  addPhotoToAlbum: (albumId: string, photo: { title: string; caption: string; date: string; url: string; ward?: string }) => void;

  village: VillageInfo;
  updateVillageInfo: (info: VillageInfo) => void;

  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;

  previewDoc: DocumentRecord | null;
  setPreviewDoc: (doc: DocumentRecord | null) => void;

  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  editingDoc: DocumentRecord | null;
  setEditingDoc: (doc: DocumentRecord | null) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  resetDemoData: () => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SESSION: 'lgp_session_user_v1',
  DOCUMENTS: 'lgp_documents_v1',
  BILLS: 'lgp_bills_v1',
  NOTICES: 'lgp_notices_v1',
  PROJECTS: 'lgp_projects_v1',
  MEETINGS: 'lgp_meetings_v1',
  MEMBERS: 'lgp_members_v1',
  FORMS: 'lgp_forms_v1',
  GALLERY: 'lgp_gallery_v1',
  VILLAGE: 'lgp_village_v1',
  NOTIFICATIONS: 'lgp_notifications_v1',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    loadFromStorage<UserAccount | null>(STORAGE_KEYS.SESSION, null)
  );

  const [documents, setDocuments] = useState<DocumentRecord[]>(() =>
    loadFromStorage<DocumentRecord[]>(STORAGE_KEYS.DOCUMENTS, initialDocuments as DocumentRecord[])
  );

  const [bills, setBills] = useState<BillRecord[]>(() =>
    loadFromStorage<BillRecord[]>(STORAGE_KEYS.BILLS, initialBills as BillRecord[])
  );

  const [notices, setNotices] = useState<NoticeRecord[]>(() =>
    loadFromStorage<NoticeRecord[]>(STORAGE_KEYS.NOTICES, initialNotices as NoticeRecord[])
  );

  const [projects, setProjects] = useState<DevelopmentProject[]>(() =>
    loadFromStorage<DevelopmentProject[]>(STORAGE_KEYS.PROJECTS, initialProjects as DevelopmentProject[])
  );

  const [meetings, setMeetings] = useState<MeetingRecord[]>(() =>
    loadFromStorage<MeetingRecord[]>(STORAGE_KEYS.MEETINGS, initialMeetings as MeetingRecord[])
  );

  const [members, setMembers] = useState<MemberRecord[]>(() =>
    loadFromStorage<MemberRecord[]>(STORAGE_KEYS.MEMBERS, initialMembers as MemberRecord[])
  );

  const [forms, setForms] = useState<CertificateForm[]>(() =>
    loadFromStorage<CertificateForm[]>(STORAGE_KEYS.FORMS, initialForms as CertificateForm[])
  );

  const [gallery, setGallery] = useState<GalleryAlbum[]>(() =>
    loadFromStorage<GalleryAlbum[]>(STORAGE_KEYS.GALLERY, initialGallery as GalleryAlbum[])
  );

  const [village, setVillage] = useState<VillageInfo>(() =>
    loadFromStorage<VillageInfo>(STORAGE_KEYS.VILLAGE, initialVillage as VillageInfo)
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications as NotificationItem[])
  );

  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentRecord | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    } catch {
      // ignore storage errors
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
    } catch {}
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
    } catch {}
  }, [bills]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
    } catch {}
  }, [notices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch {}
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(meetings));
    } catch {}
  }, [meetings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    } catch {}
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify(forms));
    } catch {}
  }, [forms]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    } catch {}
  }, [gallery]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VILLAGE, JSON.stringify(village));
    } catch {}
  }, [village]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = `tst-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = (username: string, password: string, role: UserRole) => {
    const trimmedUser = username.trim().toLowerCase();
    const matched = (initialUsers as UserAccount[]).find(
      (u) => u.username.toLowerCase() === trimmedUser && u.password === password && u.role === role
    );

    if (!matched) {
      const userWithDiffRole = (initialUsers as UserAccount[]).find(
        (u) => u.username.toLowerCase() === trimmedUser && u.password === password
      );
      if (userWithDiffRole) {
        return {
          success: false,
          error: `Account "${username}" belongs to the ${userWithDiffRole.role === 'admin' ? 'Admin' : 'Member'} role. Please select the matching role.`,
        };
      }
      return {
        success: false,
        error: 'Invalid username, password, or role selection. Please check the demo credentials below.',
      };
    }

    const { password: _, ...safeUser } = matched;
    setCurrentUser(safeUser);
    showToast(`Signed in as ${safeUser.name}`, 'success');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('You have been logged out of the portal.', 'info');
  };

  const addDocument = (doc: Omit<DocumentRecord, 'id'>) => {
    const nextNum = documents.length + 1;
    const newDoc: DocumentRecord = {
      ...doc,
      id: `DOC${String(nextNum).padStart(3, '0')}`,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Document Uploaded',
        message: `New ${doc.visibility === 'public' ? 'public' : 'internal'} document uploaded: ${doc.title}`,
        date: 'Just now',
        type: 'document',
        read: false,
        link: '/documents',
      },
      ...prev,
    ]);
    showToast('Document uploaded successfully.', 'success');
  };

  const updateDocument = (updated: DocumentRecord) => {
    setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    showToast('Document record updated successfully.', 'success');
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    showToast('Document removed from records.', 'info');
  };

  const addBill = (bill: Omit<BillRecord, 'id'>) => {
    const nextIdx = 42 + bills.length - 10;
    const newBill: BillRecord = {
      ...bill,
      id: `BL-2026-0${nextIdx}`,
    };
    setBills((prev) => [newBill, ...prev]);
    showToast(`Bill ${newBill.id} added to financial ledger.`, 'success');
  };

  const toggleBillStatus = (id: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: b.status === 'Paid' ? 'Pending' : 'Paid' } : b))
    );
    showToast(`Bill ${id} payment status updated.`, 'success');
  };

  const deleteBill = (id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
    showToast(`Bill ${id} deleted.`, 'info');
  };

  const addNotice = (notice: Omit<NoticeRecord, 'id'>) => {
    const newNotice: NoticeRecord = {
      ...notice,
      id: `NOT-2026-${String(notices.length + 1).padStart(2, '0')}`,
    };
    setNotices((prev) => [newNotice, ...prev]);
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: 'Notice Published',
        message: `${notice.title} (${notice.category})`,
        date: 'Just now',
        type: 'notice',
        read: false,
        link: '/notices',
      },
      ...prev,
    ]);
    showToast('Official notice published successfully.', 'success');
  };

  const updateNoticeStatus = (id: string, status: NoticeRecord['status']) => {
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, status } : n)));
    showToast(`Notice status changed to ${status}.`, 'success');
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    showToast('Notice deleted.', 'info');
  };

  const addProject = (project: Omit<DevelopmentProject, 'id'>) => {
    const newProj: DevelopmentProject = {
      ...project,
      id: `PRJ${String(projects.length + 1).padStart(3, '0')}`,
    };
    setProjects((prev) => [newProj, ...prev]);
    showToast(`Development work "${newProj.name}" added.`, 'success');
  };

  const updateProjectProgress = (
    id: string,
    progress: number,
    spent: number,
    status: DevelopmentProject['status']
  ) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, progress, spent, status } : p))
    );
    showToast('Development work progress updated.', 'success');
  };

  const addMeeting = (meeting: Omit<MeetingRecord, 'id'>) => {
    const newMtg: MeetingRecord = {
      ...meeting,
      id: `MTG-${meeting.date}-${Math.floor(Math.random() * 90 + 10)}`,
    };
    setMeetings((prev) => [newMtg, ...prev]);
    showToast('Meeting record logged successfully.', 'success');
  };

  const addMember = (member: Omit<MemberRecord, 'id'>) => {
    const newMem: MemberRecord = {
      ...member,
      id: `LGP${String(members.length + 1).padStart(3, '0')}`,
    };
    setMembers((prev) => [newMem, ...prev]);
    showToast(`Villager member ${newMem.name} (${newMem.id}) registered.`, 'success');
  };

  const updateMember = (updated: MemberRecord) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    showToast(`Member ${updated.id} details updated.`, 'success');
  };

  const toggleMemberStatus = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } : m))
    );
    showToast(`Member ${id} status updated.`, 'info');
  };

  const addForm = (form: Omit<CertificateForm, 'id'>) => {
    const newForm: CertificateForm = {
      ...form,
      id: `FRM-${String(forms.length + 1).padStart(3, '0')}`,
    };
    setForms((prev) => [newForm, ...prev]);
    showToast(`Citizen application form "${newForm.title}" added.`, 'success');
  };

  const addAlbum = (album: Omit<GalleryAlbum, 'id'>) => {
    const newAlbum: GalleryAlbum = {
      ...album,
      id: `ALB-${String(gallery.length + 1).padStart(2, '0')}`,
    };
    setGallery((prev) => [newAlbum, ...prev]);
    showToast(`Photo album "${newAlbum.title}" created.`, 'success');
  };

  const addPhotoToAlbum = (
    albumId: string,
    photo: { title: string; caption: string; date: string; url: string; ward?: string }
  ) => {
    setGallery((prev) =>
      prev.map((alb) =>
        alb.id === albumId
          ? {
              ...alb,
              photos: [
                {
                  id: `PHT-${Date.now()}`,
                  ...photo,
                },
                ...alb.photos,
              ],
            }
          : alb
      )
    );
    showToast('Photograph uploaded to gallery album.', 'success');
  };

  const updateVillageInfo = (info: VillageInfo) => {
    setVillage(info);
    showToast('Village administrative profile updated.', 'success');
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    Object.values(STORAGE_KEYS).forEach((k) => {
      if (k !== STORAGE_KEYS.SESSION) {
        localStorage.removeItem(k);
      }
    });
    setDocuments(initialDocuments as DocumentRecord[]);
    setBills(initialBills as BillRecord[]);
    setNotices(initialNotices as NoticeRecord[]);
    setProjects(initialProjects as DevelopmentProject[]);
    setMeetings(initialMeetings as MeetingRecord[]);
    setMembers(initialMembers as MemberRecord[]);
    setForms(initialForms as CertificateForm[]);
    setGallery(initialGallery as GalleryAlbum[]);
    setVillage(initialVillage as VillageInfo);
    setNotifications(initialNotifications as NotificationItem[]);
    showToast('All portal records reset to default college demo state.', 'info');
  };

  return (
    <PortalContext.Provider
      value={{
        currentUser,
        login,
        logout,
        documents,
        addDocument,
        updateDocument,
        deleteDocument,
        bills,
        addBill,
        toggleBillStatus,
        deleteBill,
        notices,
        addNotice,
        updateNoticeStatus,
        deleteNotice,
        projects,
        addProject,
        updateProjectProgress,
        meetings,
        addMeeting,
        members,
        addMember,
        updateMember,
        toggleMemberStatus,
        forms,
        addForm,
        gallery,
        addAlbum,
        addPhotoToAlbum,
        village,
        updateVillageInfo,
        notifications,
        markAllNotificationsRead,
        previewDoc,
        setPreviewDoc,
        isUploadModalOpen,
        setIsUploadModalOpen,
        editingDoc,
        setEditingDoc,
        isSearchOpen,
        setIsSearchOpen,
        toasts,
        showToast,
        dismissToast,
        resetDemoData,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return ctx;
}
