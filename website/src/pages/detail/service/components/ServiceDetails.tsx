import { ShieldCheck, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Approves from "../../../../assets/logo/apprrove.svg";
import { loadGoogleMapsScript } from "../../../../utils/googleMapsLoader";

type ServiceAreaGeometry = { type: "Polygon"; coordinates: number[][][] };

const geometryToPath = (geometry?: ServiceAreaGeometry | null) =>
  (geometry?.coordinates?.[0] ?? [])
    .map(([lng, lat]) =>
      Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null,
    )
    .filter((point): point is { lat: number; lng: number } => point !== null);

export function ServiceList({ servicesData }: { servicesData: any }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-[1.25rem] font-medium text-primary-brown">
        Services
      </h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full">
        {servicesData.list.map((s: any) => (
          <div
            key={s.id}
            className="flex items-center gap-5 p-2 rounded-[1.5rem]  border bg-[#FFFFFF] border-gray-50 "
          >
            <div className="w-32 h-32 md:w-24 md:h-24  shrink-0 rounded-[1.5rem] overflow-hidden bg-gray-100">
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-full rounded-[1.5rem] object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-[0.875rem]  md:text-xs lg:text-sm font-medium text-primary-brown leading-snug">
                {s.title}
              </p>
              <p className="text-[0.875rem] md:text-xs lg:text-sm text-primary-light-brown mt-1 leading-snug">
                {s.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ServiceQualifications({
  companyName,
  companyLogo,
  qualifications,
}: {
  companyName: string;
  companyLogo: string;
  qualifications: any[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[1.5rem] font-medium text-primary-brown">
        My qualifications
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full lg:w-[30%] bg-white rounded-3xl p-3 xl:p-6 border border-gray-50 shadow-sm hidden md:flex md:flex-col items-center justify-center text-center gap-3">
          <div className="flex w-fit flex-col  items-center">
            <img
              loading="lazy"
              src={companyLogo}
              alt="dewd"
              className="mb-[-24px] h-[78px] w-[78px] rounded-full object-cover"
            />
            <div className="relative h-8 w-8 rounded-full border border-[#f8f4ee] bg-[#e2cbb3] overflow-hidden">
              <img
                loading="lazy"
                src={Approves}
                alt="Verified"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className="font-medium text-[0.875rem] xl:text-[1.25rem] text-primary-brown">
              {companyName}
            </p>
            <p className="text-[0.75rem] text-primary-light-brown mt-1">
              Employer / Company
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-6">
          {qualifications.map((q, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <div className="mt-1 text-primary-brown">
                {idx === 0 ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                ) : idx === 1 ? (
                  <ShieldCheck size={20} />
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v4l3 3"></path>
                  </svg>
                )}
              </div>
              <div>
                <p className="text-[1.25rem] md:text-[0.875rem] font-medium text-primary-brown leading-snug">
                  {q.title}
                </p>
                <p className="text-[0.75rem] text-primary-light-brown leading-snug mt-1">
                  {q.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { PhotoTourModal } from "../../../../components/custom/PhotoTourModal";

export function ServiceRecentWork({
  recentWork,
  title = "My gallery",
}: {
  recentWork: any;
  title?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [initialGalleryIndex, setInitialGalleryIndex] = useState(0);

  const allMedia = (recentWork.allItems ?? recentWork.items).map(
    (item: any, idx: number) => ({
      id: `gallery-item-${idx}`,
      src: item.type === "video" ? undefined : item.src,
      type: item.type,
      videoSrc: item.type === "video" ? item.src : undefined,
    }),
  );

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-[1.5rem] font-medium text-primary-brown">{title}</h2>

      <div className="flex gap-2 h-[280px] md:h-[400px]">
        <div
          className="flex-1 rounded-xl overflow-hidden cursor-pointer bg-white-100 relative group"
          onClick={() => {
            setInitialGalleryIndex(0);
            setModalOpen(true);
          }}
        >
          {recentWork.items[0]?.type === "video" ? (
            <>
              <video
                src={`${recentWork.items[0].src}#t=0.1`}
                preload="metadata"
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-primary-brown">
                  <Play size={20} className="ml-1" fill="currentColor" />
                </div>
              </div>
            </>
          ) : (
            <img
              src={recentWork.items[0]?.src}
              alt="Recent work"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>

        <div className="w-[35%] flex flex-col gap-2 h-full">
          <div
            className="flex-1 rounded-xl overflow-hidden cursor-pointer relative bg-white-100 group"
            onClick={() => {
              setInitialGalleryIndex(1);
              setModalOpen(true);
            }}
          >
            {recentWork.items[1]?.type === "video" ? (
              <>
                <video
                  src={`${recentWork.items[1].src}#t=0.1`}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-primary-brown">
                    <Play size={16} className="ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </>
            ) : (
              <img
                src={recentWork.items[1]?.src}
                alt="Recent work"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
          </div>

          <div
            className="flex-1 rounded-xl overflow-hidden cursor-pointer bg-white-100 relative group"
            onClick={() => {
              setInitialGalleryIndex(2);
              setModalOpen(true);
            }}
          >
            {recentWork.items[2]?.type === "video" ? (
              <>
                <video
                  src={`${recentWork.items[2].src}#t=0.1`}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-primary-brown">
                    <Play size={16} className="ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </>
            ) : (
              <img
                src={recentWork.items[2]?.src}
                alt="Recent work"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}

            {allMedia.length > 3 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-3xl font-light">
                  +{allMedia.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <PhotoTourModal
          media={allMedia}
          initialIndex={initialGalleryIndex}
          onClose={() => setModalOpen(false)}
          title={`Gallery · ${recentWork.totalPhotos} photos${recentWork.totalVideos ? `, ${recentWork.totalVideos} videos` : ""}`}
          subtitle="My gallery"
        />
      )}
    </div>
  );
}

function ServiceAreaMap({ location }: { location: any }) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const polygonPath = useMemo(
    () => geometryToPath(location.geometry),
    [location.geometry],
  );

  useEffect(() => {
    let active = true;

    loadGoogleMapsScript()
      .then(() => {
        if (!active || !mapElementRef.current || !(window as any).google?.maps)
          return;
        const googleMaps = (window as any).google.maps;
        const fallbackCenter = { lat: -25.2744, lng: 133.7751 };
        mapRef.current = new googleMaps.Map(mapElementRef.current, {
          center: polygonPath[0] || fallbackCenter,
          zoom: polygonPath.length >= 3 ? 10 : 11,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        if (polygonPath.length >= 3) {
          polygonRef.current = new googleMaps.Polygon({
            paths: polygonPath,
            map: mapRef.current,
            fillColor: "#f05537",
            fillOpacity: 0.22,
            strokeColor: "#f05537",
            strokeOpacity: 0.9,
            strokeWeight: 2,
          });
          const bounds = new googleMaps.LatLngBounds();
          polygonPath.forEach((point: { lat: number; lng: number }) =>
            bounds.extend(point),
          );
          mapRef.current.fitBounds(bounds);
          return;
        }

        if (location.serviceArea) {
          const geocoder = new googleMaps.Geocoder();
          geocoder.geocode(
            { address: location.serviceArea },
            (results: any[], status: string) => {
              if (
                !active ||
                status !== "OK" ||
                !results?.[0]?.geometry?.location
              )
                return;
              const position = results[0].geometry.location;
              mapRef.current.setCenter(position);
              markerRef.current = new googleMaps.Marker({
                map: mapRef.current,
                position,
              });
            },
          );
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
      polygonRef.current?.setMap(null);
      markerRef.current?.setMap(null);
      mapRef.current = null;
    };
  }, [location.serviceArea, polygonPath]);

  return <div ref={mapElementRef} className="h-full w-full" />;
}

export function ServiceLocation({ location }: { location: any }) {
  return (
    <div className="flex flex-col gap-[1.5rem]">
      <div className="space-y-[1.5rem]">
        <h2 className="text-[1.5rem] font-medium text-primary-brown">
          I'll come to you
        </h2>
        <p className="text-[0.875rem] text-primary-light-brown">
          {location.description}
        </p>
      </div>

      <div className="w-full h-[25.875rem] rounded-[1.5rem] overflow-hidden">
        {location.geometry || location.serviceArea ? (
          <ServiceAreaMap location={location} />
        ) : location.mapSrc ? (
          <iframe
            src={location.mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Service area map"
          />
        ) : (
          <div className="h-full w-full bg-white flex items-center justify-center text-sm text-primary-light-brown">
            Service location will be confirmed after enquiry.
          </div>
        )}
      </div>

      <p className="text-[0.75rem] text-primary-light-brown">
        {location.address
          ? `Service location: ${location.address}`
          : "Contact this business to confirm the service location."}
      </p>
    </div>
  );
}
