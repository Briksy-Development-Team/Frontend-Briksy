import { useEffect, useState } from "react";
import Logos from "../../assets/loader/Logos.svg";
import LoaderA from "../../assets/loader/LoaderA.svg"; 

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
    <div className="fixed inset-0 z-[9999] flex flex-col items-center space-y-3 justify-center bg-[#f4f8ee]">
      <img loading="eager" src={Logos} alt="Briksy" className="w-[180px] md:w-[300px]" />

      <img loading="lazy"
        src={LoaderA}
        alt="Loading..."
        className="w-[220px] md:w-[350px]"
      />
    </div>
  );
};

export default Loader;