import { useEffect, useState } from "react";
import Logos from "../../assets/logo/loaderbg.svg";
import DominoLoader from "./DominoLoader";

type Props = {
  appReady: boolean;
  onComplete: () => void;
};

const Loader = ({ appReady, onComplete }: Props) => {
  const [canExit, setCanExit] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const minDisplayTimer = setTimeout(() => {
      setCanExit(true);
    }, 2000);

    return () => clearTimeout(minDisplayTimer);
  }, []);

  useEffect(() => {
    if (appReady && canExit) {
      document.body.style.overflow = "";
      onComplete();
    }
  }, [appReady, canExit, onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center space-y-20 justify-center bg-[#C2B4AA]">
      <img loading="eager" src={Logos} alt="Briksy" className="w-[180px] md:w-[200px]" />

      <DominoLoader barColor="#342511" />
    </div>
  );
};

export default Loader;