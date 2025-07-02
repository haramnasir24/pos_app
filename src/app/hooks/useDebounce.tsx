import { useEffect, useRef } from "react";


// used for waiting for the user to stop typing before making the api call
// the callback here is the api request 
function useDebounce<T>(callback: () => void, delay: number, deps: T[] = []) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === 0) return;
    const handler = setTimeout(() => {
      callbackRef.current();
    }, delay);

    return () => clearTimeout(handler);
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}

export default useDebounce;