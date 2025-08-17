import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useRouteLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.key]);

  return isLoading;
};