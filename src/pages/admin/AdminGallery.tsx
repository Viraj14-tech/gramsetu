import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FolderPlus,
  Upload,
  Image as ImageIcon,
  X,
  Calendar,
  MapPin,
} from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { formatDate } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { GalleryAlbum, GalleryPhoto } from '../../types';

export const AdminGallery: React.FC = () => {
  const { gallery, addAlbum, addPhotoToAlbum } = usePortal();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('All');
  const [lightboxPhoto, setLightboxPhoto] = useState<(GalleryPhoto & { albumTitle: string }) | null>(null);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isUploadPhotoOpen, setIsUploadPhotoOpen] = useState(false);

  // Create Album state
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumCategory, setAlbumCategory] = useState('Village Events');
  const [albumDesc, setAlbumDesc] = useState('');

  // Upload Photo state
  const [targetAlbumId, setTargetAlbumId] = useState(gallery[0]?.id || 'ALB-01');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoWard, setPhotoWard] = useState('Ward 2');
  const [photoPresetUrl, setPhotoPresetUrl] = useState('/images/road-development.jpg');

  useEffect(() => {
    if (searchParams.get('action') === 'upload') {
      setIsUploadPhotoOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const displayedAlbums: GalleryAlbum[] =
    selectedAlbumId === 'All'
      ? gallery
      : gallery.filter((a) => a.id === selectedAlbumId);

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumTitle.trim()) return;

    addAlbum({
      title: albumTitle.trim(),
      category: albumCategory,
      date: new Date().toISOString().split('T')[0],
      coverUrl: '/images/gram-panchayat-office.jpg',
      description:
        albumDesc.trim() ||
        `Official photo documentation for ${albumTitle.trim()} at Lakhlgoan Gram Panchayat.`,
      photos: [
        {
          id: `PHT-${Date.now()}`,
          title: `${albumTitle.trim()} – Photo 1`,
          caption: albumDesc.trim() || 'Recorded at Lakhlgoan Gram Panchayat.',
          date: formatDate(new Date().toISOString()),
          url: '/images/gram-panchayat-office.jpg',
          ward: 'Ward 2',
        },
      ],
    });

    setAlbumTitle('');
    setAlbumDesc('');
    setIsAlbumModalOpen(false);
  };

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) return;

    addPhotoToAlbum(targetAlbumId, {
      title: photoTitle.trim(),
      caption: photoCaption.trim() || 'Uploaded via Gram Panchayat Admin Portal.',
      date: formatDate(new Date().toISOString()),
      url: photoPresetUrl,
      ward: photoWard,
    });

    setPhotoTitle('');
    setPhotoCaption('');
    setIsUploadPhotoOpen(false);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Photo Gallery' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE5E0] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
            Village Photo Gallery &amp; Work Documentation
          </h2>
          <p className="mt-1 text-sm text-[#69766F]">
            Organise photographs of Gram Sabha sessions, cleanliness drives, tree plantation, and infrastructure projects.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAlbumModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#174C3C] bg-white px-4 py-2.5 text-xs font-semibold text-[#174C3C] hover:bg-[#EEF4F0] transition-colors whitespace-nowrap cursor-pointer"
          >
            <FolderPlus className="h-4 w-4" />
            <span>+ Create Album</span>
          </button>
          <button
            onClick={() => setIsUploadPhotoOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#174C3C] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#236A52] transition-colors whitespace-nowrap cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            <span>+ Upload Photos</span>
          </button>
        </div>
      </div>

      {/* Album Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedAlbumId('All')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            selectedAlbumId === 'All'
              ? 'bg-[#174C3C] text-white'
              : 'border border-[#DDE5E0] bg-white text-[#69766F] hover:bg-[#EEF4F0] hover:text-[#1E2925]'
          }`}
        >
          All Albums ({gallery.length})
        </button>
        {gallery.map((alb) => (
          <button
            key={alb.id}
            onClick={() => setSelectedAlbumId(alb.id)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              selectedAlbumId === alb.id
                ? 'bg-[#174C3C] text-white'
                : 'border border-[#DDE5E0] bg-white text-[#69766F] hover:bg-[#EEF4F0] hover:text-[#1E2925]'
            }`}
          >
            {alb.title} ({alb.photos.length})
          </button>
        ))}
      </div>

      {/* Albums & Photos Display */}
      <div className="space-y-8">
        {displayedAlbums.map((album) => (
          <div
            key={album.id}
            className="rounded-xl border border-[#DDE5E0] bg-white p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDE5E0] pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#69766F]">
                  <span className="font-semibold text-[#174C3C]">{album.category}</span>
                  <span>·</span>
                  <span>{formatDate(album.date)}</span>
                  <span>·</span>
                  <span>{album.photos.length} Photographs</span>
                </div>
                <h3 className="text-lg font-bold text-[#1E2925]">{album.title}</h3>
                <p className="text-xs text-[#69766F] mt-0.5">{album.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {album.photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setLightboxPhoto({ ...photo, albumTitle: album.title })}
                  className="group rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] overflow-hidden cursor-pointer hover:border-[#174C3C] transition-colors"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-[#174C3C]/10">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-3.5">
                    <div className="flex items-center justify-between text-[11px] text-[#69766F] mb-1">
                      <span>{photo.date}</span>
                      {photo.ward && <span>{photo.ward}</span>}
                    </div>
                    <h4 className="text-sm font-bold text-[#1E2925] group-hover:text-[#174C3C]">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-[#69766F] mt-1 line-clamp-2">{photo.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-xl bg-white overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#DDE5E0] px-5 py-3.5 bg-[#F7F8F5]">
              <div>
                <p className="text-xs font-semibold text-[#174C3C]">{lightboxPhoto.albumTitle}</p>
                <h3 className="text-base font-bold text-[#1E2925]">{lightboxPhoto.title}</h3>
              </div>
              <button
                onClick={() => setLightboxPhoto(null)}
                className="rounded-lg p-1.5 text-[#69766F] hover:bg-white hover:text-[#1E2925]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-xs sm:text-sm text-[#1E2925]">{lightboxPhoto.caption}</p>
              <div className="flex items-center gap-3 text-xs text-[#69766F] shrink-0">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {lightboxPhoto.date}
                </span>
                {lightboxPhoto.ward && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {lightboxPhoto.ward}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Album Modal */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-6 py-4">
              <h3 className="text-base font-bold text-[#1E2925]">Create New Photo Album</h3>
              <button
                onClick={() => setIsAlbumModalOpen(false)}
                className="rounded-lg p-1 text-[#69766F] hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAlbum} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Album Title *
                </label>
                <input
                  type="text"
                  required
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  placeholder="e.g., Gandhi Jayanti Gram Sabha 2026"
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Category
                </label>
                <select
                  value={albumCategory}
                  onChange={(e) => setAlbumCategory(e.target.value)}
                  className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                >
                  <option value="Village Events">Village Events</option>
                  <option value="Gram Sabha">Gram Sabha</option>
                  <option value="Development Works">Development Works</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Water Infrastructure">Water Infrastructure</option>
                  <option value="Environment">Environment</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={albumDesc}
                  onChange={(e) => setAlbumDesc(e.target.value)}
                  placeholder="Short description of the event or project work..."
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#DDE5E0]">
                <button
                  type="button"
                  onClick={() => setIsAlbumModalOpen(false)}
                  className="rounded-lg border border-[#DDE5E0] px-4 py-2 text-sm text-[#69766F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#174C3C] px-5 py-2 text-sm font-semibold text-white hover:bg-[#236A52]"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Photo Modal */}
      {isUploadPhotoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#DDE5E0] bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#DDE5E0] bg-[#EEF4F0] px-6 py-4">
              <h3 className="text-base font-bold text-[#1E2925]">Upload Photograph to Album</h3>
              <button
                onClick={() => setIsUploadPhotoOpen(false)}
                className="rounded-lg p-1 text-[#69766F] hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUploadPhoto} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Select Album
                </label>
                <select
                  value={targetAlbumId}
                  onChange={(e) => setTargetAlbumId(e.target.value)}
                  className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                >
                  {gallery.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="e.g., Ward 2 Concrete Road Inspection"
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2925] mb-1">Ward</label>
                  <select
                    value={photoWard}
                    onChange={(e) => setPhotoWard(e.target.value)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
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
                    Demo Image Asset
                  </label>
                  <select
                    value={photoPresetUrl}
                    onChange={(e) => setPhotoPresetUrl(e.target.value)}
                    className="w-full rounded-lg border border-[#DDE5E0] px-3 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                  >
                    <option value="/images/road-development.jpg">Road Development</option>
                    <option value="/images/gram-sabha.jpg">Gram Sabha</option>
                    <option value="/images/water-project.jpg">Water Project</option>
                    <option value="/images/tree-plantation.jpg">Tree Plantation</option>
                    <option value="/images/gram-panchayat-office.jpg">Panchayat Office</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E2925] mb-1">Caption</label>
                <textarea
                  rows={2}
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="Describe the activity shown in the photograph..."
                  className="w-full rounded-lg border border-[#DDE5E0] px-3.5 py-2 text-sm focus:border-[#174C3C] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#DDE5E0]">
                <button
                  type="button"
                  onClick={() => setIsUploadPhotoOpen(false)}
                  className="rounded-lg border border-[#DDE5E0] px-4 py-2 text-sm text-[#69766F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#174C3C] px-5 py-2 text-sm font-semibold text-white hover:bg-[#236A52]"
                >
                  Upload Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
