import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { lenisInstance } from "../../App";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (lenisInstance.current) {
        lenisInstance.current.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
