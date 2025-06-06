import { useDispatch } from 'react-redux';
import { setIsMobile } from '@/features/settings/settingSlice';
import { useEffect } from 'react';

const useMobileDetector = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkIsMobile = () => {
      dispatch(setIsMobile(window.innerWidth <= 768));
    };

    checkIsMobile(); // Initial check
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, [dispatch]);
};

export default useMobileDetector;
