# Lakhlgoan Gram Panchayat Digital Records Portal

**Project Type:** College Prototype / Demonstration Application  
**Note:** Prototype developed for academic demonstration purposes using local JSON datasets and `localStorage` persistence. Not an official government portal.

---

## Demo Login Credentials

The application opens directly at `/login`. You can click the **Demo Credentials** cards on the login screen to auto-fill credentials:

### 1. Admin Role (Gram Sevak / Panchayat Administration)
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** `Admin`
- **Redirects to:** `/admin/dashboard`

### 2. Member / Villager Role (Registered Citizen)
- **Username:** `member`
- **Password:** `member123`
- **Role:** `Member`
- **Redirects to:** `/member/dashboard`

---

## Project Structure

```text
public/
  images/
    login-village-hero.jpg
    gram-panchayat-office.jpg
    village-road.jpg
    water-project.jpg
    tree-plantation.jpg
    gram-sabha.jpg
    road-development.jpg
    village-cleanliness.jpg
  documents/
src/
  assets/
    images/              # Generated rural Maharashtra Gram Panchayat & village visuals
  components/
    Breadcrumbs.tsx
    CivicEmblem.tsx
    DocumentPreviewModal.tsx
    GlobalSearchModal.tsx
    ProtectedRoute.tsx
    ToastContainer.tsx
    UploadDocumentModal.tsx
  data/
    users.json
    documents.json
    bills.json
    notices.json
    projects.json
    meetings.json
    members.json
    forms.json
    gallery.json
    village.json
    notifications.json
  layouts/
    AdminLayout.tsx
    MemberLayout.tsx
  pages/
    LoginPage.tsx
    admin/
      AdminDashboard.tsx
      AdminDocuments.tsx
      AdminBills.tsx
      AdminNotices.tsx
      AdminProjects.tsx
      AdminMeetings.tsx
      AdminForms.tsx
      AdminGallery.tsx
      AdminVillageInfo.tsx
      AdminMembers.tsx
      AdminUploadCenter.tsx
      AdminReports.tsx
      AdminSettings.tsx
    member/
      MemberDashboard.tsx
      MemberDocuments.tsx
      MemberNotices.tsx
      MemberProjects.tsx
      MemberFinance.tsx
      MemberMeetings.tsx
      MemberForms.tsx
      MemberGallery.tsx
      MemberProfile.tsx
    errors/
      AccessDeniedPage.tsx
      NotFoundPage.tsx
  types/
    index.ts
  utils/
    PortalContext.tsx
    formatters.ts
```
