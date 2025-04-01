import { useState, useEffect } from 'react';
import { isMobileDevice } from '@/lib/utils';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Initial check
    setIsMobile(isMobileDevice());
    
    // Add listener for screen size changes
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return isMobile;
}

// Media query breakpoints hook for more specific screen sizes
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState({
    sm: false,  // < 640px 
    md: false,  // < 768px
    lg: false,  // < 1024px
    xl: false,  // < 1280px
    xxl: false, // < 1536px
  });
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setBreakpoint({
        sm: width < 640,
        md: width < 768,
        lg: width < 1024,
        xl: width < 1280,
        xxl: width < 1536,
      });
    };
    
    // Initial check
    updateBreakpoint();
    
    // Add listener for screen size changes
    window.addEventListener('resize', updateBreakpoint);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', updateBreakpoint);
    };
  }, []);
  
  return breakpoint;
} 