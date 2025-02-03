import { useEffect, useMemo, useRef } from "react";

export const useAppHeight = () => {
  const appHeight = useMemo(() => window.innerHeight, []);

  return appHeight * 50;
};

export const useScrollOffset = () => {
  const scrollOffset = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY / (window.innerHeight * 50 - 1000);
      scrollOffset.current = offset;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollOffset;
};
