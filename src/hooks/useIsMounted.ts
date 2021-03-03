import { useCallback, useEffect, useRef } from "react";

type IsMounted = () => boolean;

const useIsMounted = (): IsMounted => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  });

  return useCallback(() => {
    return isMounted.current;
  }, []);
};

export default useIsMounted;
