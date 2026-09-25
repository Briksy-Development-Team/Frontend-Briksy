import DesktopCommunity from "./DesktopCommunity";
import MobileCommunity from "./MobileCommunity";

const Community = () => {
  return (
    <>
      <div className="hidden md:block">
        <DesktopCommunity />
      </div>

      <div className="block md:hidden">
        <MobileCommunity />
      </div>
    </>
  );
};

export default Community;