import { X, ShieldCheck } from "lucide-react";
import { useState } from "react";
import Approves from "../../../../assets/logo/apprrove.svg";


export function ServiceList({ servicesData }: { servicesData: any }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-[1.25rem] font-medium text-primary-brown">
        Services & Rates
      </h2>
      <p className="text-[0.875rem] text-primary-light-brown">
        General estimate due to external variables involved
      </p>

      <div className="flex flex-col gap-4 w-full">
        {servicesData.list.map((s: any) => (
          <div
            key={s.id}
            className="flex items-center gap-5 p-2 rounded-[1.5rem]  border bg-[#FFFFFF] border-gray-50 "
          >
            <div className="w-32 h-32  shrink-0 rounded-[1.5rem] overflow-hidden bg-gray-100">
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-full rounded-[1.5rem] object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-[0.875rem] font-medium text-primary-brown leading-snug">
                {s.title}
              </p>
              <p className="text-[0.875rem] text-primary-light-brown mt-1 leading-snug">
                {s.description}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[0.875rem]">
                <span className="font-medium text-primary-brown">
                  {s.price}
                </span>
                <span className="text-gray-300">/</span>
                <span className="text-primary-light-brown font-medium">
                  {s.duration}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[0.75rem] text-[#6C6C6C] mt-2">
        *Actual price will change after on-site review changes
      </p>
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
        <div className="w-full md:w-[30%] bg-white rounded-3xl p-6 border border-gray-50 shadow-sm flex flex-col items-center justify-center text-center gap-3">
            <div className="flex w-fit flex-col items-center">
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
            <p className="font-medium text-[1.25rem] text-primary-brown">
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
                <p className="text-[0.875rem] font-medium text-primary-brown leading-snug">
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

      <button className="w-full py-3.5 bg-[#EFEBE4] rounded-xl text-primary-brown font-medium  text-[0.9375rem] hover:bg-[#e4dfd5] transition-colors mt-2">
        Message {companyName.split(" ")[0]}
      </button>
    </div>
  );
}

export function ServiceRecentWork({ recentWork }: { recentWork: any }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-[1.5rem] font-medium text-primary-brown">
        My gallery
      </h2>

      <div className="flex gap-2 h-[280px] md:h-[400px]">
        <div
          className="flex-1 rounded-xl overflow-hidden cursor-pointer bg-white-100"
          onClick={() => setModalOpen(true)}
        >
          <img
            src={recentWork.items[0].src}
            alt="Recent work"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-[35%] flex flex-col gap-2 h-full">
          <div
            className="flex-1 rounded-xl overflow-hidden cursor-pointer relative bg-white-100"
            onClick={() => setModalOpen(true)}
          >
            <img
              src={recentWork.items[1].src}
              alt="Recent work"
              className="w-full h-full object-cover"
            />
          </div>

          <div
            className="flex-1 rounded-xl overflow-hidden cursor-pointer bg-white-100 relative"
            onClick={() => setModalOpen(true)}
          >
            <img
              src={recentWork.items[2].src}
              alt="Recent work"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-white text-3xl">...</span>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={() => setModalOpen(false)}
          >
            <X size={22} />
          </button>

          <div className="w-full max-w-5xl h-[85vh] bg-white rounded-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-[1.125rem] font-bold text-primary-brown">
                Gallery · {recentWork.totalPhotos} photos
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {recentWork.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-xl overflow-hidden relative bg-white-100"
                  >
                    <img
                      src={item.src}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
      </div>

      <p className="text-[0.75rem] text-primary-light-brown">
        You can also come to me once the job is booked: Flinders Street Station,
        Melbourne, VIC 3000
      </p>
    </div>
  );
}
