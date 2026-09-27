export type UserRole = 'admin' | 'member';

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  name: string;
  designation: string;
  panchayat: string;
  initials: string;
  ward?: string;
  memberId?: string;
  mobile?: string;
  houseNo?: string;
  memberSince?: string;
}

export type DocumentCategory =
  | 'Gram Sabha Records'
  | 'Government Orders'
  | 'Resolutions'
  | 'Tax Records'
  | 'Property Records'
  | 'Water Supply'
  | 'Sanitation'
  | 'Schemes'
  | 'Audit Reports'
  | 'Development Works'
  | 'Certificates'
  | 'Bills & Vouchers'
  | 'General'
  | 'Meeting Records';

export type FinancialYear = '2026-27' | '2025-26' | '2024-25' | '2023-24';

export type DocumentStatus = 'Published' | 'Verified' | 'Internal' | 'Draft' | 'Archived';
export type DocumentVisibility = 'public' | 'admin';

export interface DocumentRecord {
  id: string;
  title: string;
  category: DocumentCategory;
  financialYear: FinancialYear;
  documentNumber: string;
  date: string;
  uploadedBy: string;
  department: string;
  description: string;
  visibility: DocumentVisibility;
  status: DocumentStatus;
  file: string;
  fileSize: string;
  fileType: string;
}

export type BillStatus = 'Paid' | 'Pending';

export interface BillRecord {
  id: string;
  vendor: string;
  purpose: string;
  department: string;
  amount: number;
  date: string;
  financialYear: FinancialYear;
  status: BillStatus;
  document: string;
  visibility: DocumentVisibility;
  voucherRef: string;
}

export type NoticeCategory =
  | 'General'
  | 'Gram Sabha'
  | 'Water Supply'
  | 'Tax'
  | 'Health'
  | 'Government Scheme'
  | 'Emergency'
  | 'Tender';

export type NoticeStatus = 'Active' | 'Expired' | 'Draft';

export interface NoticeRecord {
  id: string;
  title: string;
  description: string;
  category: NoticeCategory;
  publishDate: string;
  expiryDate: string;
  attachment: string;
  status: NoticeStatus;
  important?: boolean;
  issuedBy: string;
}

export type ProjectStatus = 'In Progress' | 'Completed' | 'Planning';

export interface DevelopmentProject {
  id: string;
  name: string;
  ward: string;
  scheme: string;
  contractor: string;
  startDate: string;
  expectedCompletion: string;
  budget: number;
  spent: number;
  progress: number;
  status: ProjectStatus;
  description: string;
  documents: { title: string; file: string }[];
  photos: { title: string; url: string; caption: string }[];
}

export type MeetingType = 'Gram Sabha' | 'Monthly Panchayat Meeting' | 'Special Meeting';

export interface MeetingRecord {
  id: string;
  title: string;
  type: MeetingType;
  date: string;
  time: string;
  venue: string;
  attendance: string;
  agendaCount: number;
  agendaItems: string[];
  resolutionsCount: number;
  resolutionsSummary: string[];
  minutesPdf: string;
  status: 'Completed' | 'Scheduled';
}

export type FormCategory =
  | 'Birth Related'
  | 'Death Related'
  | 'Residence'
  | 'Income'
  | 'Property'
  | 'Water Connection'
  | 'Tax'
  | 'No Objection'
  | 'Government Schemes';

export interface CertificateForm {
  id: string;
  title: string;
  category: FormCategory;
  formCode: string;
  description: string;
  requiredDocs: string[];
  processingDays: string;
  file: string;
  fileSize: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  date: string;
  url: string;
  ward?: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  category: string;
  date: string;
  coverUrl: string;
  description: string;
  photos: GalleryPhoto[];
}

export interface MemberRecord {
  id: string;
  name: string;
  ward: string;
  mobile: string;
  houseNo: string;
  memberSince: string;
  status: 'Active' | 'Inactive';
  familyMembersCount: number;
  taxStatus: 'Paid' | 'Due';
}

export interface VillageOfficial {
  role: string;
  name: string;
  contact: string;
  officeHours: string;
}

export interface WardBreakdown {
  ward: string;
  households: number;
  population: number;
  representative: string;
  keyLandmark: string;
}

export interface VillageInfo {
  village: string;
  marathiName: string;
  type: string;
  state: string;
  country: string;
  population: number;
  households: number;
  totalWards: number;
  literacy: string;
  pin: string;
  taluka: string;
  district: string;
  areaSqKm: string;
  gramPanchayatCode: string;
  establishedYear: string;
  officials: VillageOfficial[];
  wards: WardBreakdown[];
  financialSummary: {
    financialYear: string;
    totalGrants: number;
    totalExpenditure: number;
    availableBalance: number;
    categoryBreakdown: {
      category: string;
      allocated: number;
      spent: number;
    }[];
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'notice' | 'document' | 'project' | 'bill';
  read: boolean;
  link: string;
}
