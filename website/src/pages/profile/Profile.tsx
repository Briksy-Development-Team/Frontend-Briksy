import { useEffect, useState } from "react";
import ProfileDesktop from "./profiledesktop/ProfileDesktop";
import ProfileMobile from "./profilemobile/ProfileMobile";

export default function Profile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return isMobile ? <ProfileMobile /> : <ProfileDesktop />;
}