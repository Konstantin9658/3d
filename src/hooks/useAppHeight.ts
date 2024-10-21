import { useMemo } from "react";

export const useAppHeight = () => {
  const appHeight = useMemo(() => window.innerHeight, []);

  return appHeight * 50;
};
