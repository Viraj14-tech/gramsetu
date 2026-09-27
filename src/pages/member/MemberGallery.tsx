import React, { useState } from 'react';
import { Calendar, MapPin, X } from 'lucide-react';
import { usePortal } from '../../utils/PortalContext';
import { formatDate } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { GalleryPhoto } from '../../types';

export const MemberGallery: React.FC = () => {
  const { gallery } = usePortal();
  const [selectedAlbumId, setSelectedAlbumId] = useState('All');
  const [lightboxPhoto, setLightboxPhoto] = useState<(GalleryPhoto & { albumTitle: string }) | null>(null);

  const displayedAlbums =
    selectedAlbumId === 'All'
      ? gallery
      : gallery.filter((a) => a.id === selectedAlbumId);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Village Photo Gallery' },
        ]}
      />

      <div className="border-b border-[#DDE5E0] pb-5">
        <h2 className="text-2xl font-bold text-[#1E2925] tracking-tight">
          Lakhlgoan Village Activities &amp; Development Gallery
        </h2>
        <p className="mt-1 text-sm text-[#69766F]">
          Photographs from Gram Sabha meetings, Independence Day, cleanliness drives, tree plantation, and road/water projects.
        </p>
      </div>

      {/* Album Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedAlbumId('All')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            selectedAlbumId === 'All'
              ? 'bg-[#174C3C] text-white'
              : 'border border-[#DDE5E0] bg-white text-[#69766F] hover:bg-[#EEF4F0]'
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
                : 'border border-[#DDE5E0] bg-white text-[#69766F] hover:bg-[#EEF4F0]'
            }`}
          >
            {alb.title}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="space-y-8">
        {displayedAlbums.map((album) => (
          <div
            key={album.id}
            className="rounded-xl border border-[#DDE5E0] bg-white p-5 space-y-4"
          >
            <div className="border-b border-[#DDE5E0] pb-3">
              <div className="flex items-center gap-2 text-xs text-[#69766F]">
                <span className="font-semibold text-[#174C3C]">{album.category}</span>
                <span>·</span>
                <span>{formatDate(album.date)}</span>
              </div>
              <h3 className="text-lg font-bold text-[#1E2925]">{album.title}</h3>
              <p className="text-xs text-[#69766F] mt-0.5">{album.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {album.photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setLightboxPhoto({ ...photo, albumTitle: album.title })}
                  className="group rounded-lg border border-[#DDE5E0] bg-[#F7F8F5] overflow-hidden cursor-pointer hover:border-[#174C3C] transition-colors"
                >
                  <div className="h-48 w-full overflow-hidden">
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
                    <h4 className="text-sm font-bold text-[#1E2925]">{photo.title}</h4>
                    <p className="text-xs text-[#69766F] mt-1">{photo.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
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
                className="rounded-lg p-1.5 text-[#69766F] hover:bg-white"
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
            <div className="p-4 bg-white flex items-center justify-between text-xs">
              <p className="text-sm text-[#1E2925]">{lightboxPhoto.caption}</p>
              <div className="flex items-center gap-3 text-[#69766F] shrink-0">
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
    </div>
  );
};
