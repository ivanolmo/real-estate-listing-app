import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      const auth = getAuth();

      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true);
        }
        setLoadingStatus(false);
      });
    }

    return () => (isMounted.current = false);
  }, [isMounted]);

  return { loggedIn, loadingStatus };
};

// custom hook using info from:
// https://stackoverflow.com/questions/65505665/protected-route-with-firebase

// react unmounted component memory leak fix from:
// https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks
