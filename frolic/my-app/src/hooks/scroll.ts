import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Store scroll positions per route
const scrollPositions: Record<string, number> = {};

const useScrollRestoration = (): void => {
  const location = useLocation();

  useEffect(() => {
    const path: string = location.pathname;

    // Restore scroll position
    const savedPosition: number | undefined =
      scrollPositions[path];

    if (savedPosition !== undefined) {
      window.scrollTo({
        top: savedPosition,
        behavior: "auto", // instant jump, no animation
      });
    }

    // Save scroll position before leaving page
    return () => {
      scrollPositions[path] = window.scrollY;
    };
  }, [location]);
};

export default useScrollRestoration;