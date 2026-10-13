import { Mail, Phone, UserRound } from "lucide-react";
import { SafeImage } from "../../../components/custom/SafeImage";
import BusinessPlaceholder from "../../../assets/place holder/bussinessholder.svg";

export type PublicHost = {
  id: string;
  name: string;
  email?: string | null;
  mobile_number?: string | null;
};

type Props = {
  host: PublicHost;
  avatar?: string | null;
  organizationName?: string | null;
};

export default function HostProfileCard({ host, avatar, organizationName }: Props) {
  return (
    <div className="flex h-[18rem] w-[19.4375rem] flex-col overflow-hidden rounded-[20px] bg-white text-primary-brown">
      <div className="flex items-center gap-4 bg-[#bed6d7] px-5 py-5">
        <SafeImage
          src={avatar || BusinessPlaceholder}
          alt={host.name}
          className="h-20 w-20 rounded-full border-4 border-white object-cover"
        />
        <div className="min-w-0">
          <h3 className="truncate text-base font-medium">{host.name}</h3>
          <p className="mt-1 text-sm text-primary-brown">Property host</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-5 py-4 text-sm">
        {organizationName && <p className="text-primary-light-brown">Listed by {organizationName}</p>}
        {host.email && <a href={`mailto:${host.email}`} className="flex items-center gap-2 truncate hover:underline"><Mail size={15} />{host.email}</a>}
        {host.mobile_number && <a href={`tel:${host.mobile_number}`} className="flex items-center gap-2 hover:underline"><Phone size={15} />{host.mobile_number}</a>}
        {!host.email && !host.mobile_number && <p className="flex items-center gap-2 text-primary-light-brown"><UserRound size={15} />Contact through the listing organisation.</p>}
      </div>
    </div>
  );
}
