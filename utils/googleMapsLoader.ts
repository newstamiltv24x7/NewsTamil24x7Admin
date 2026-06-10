/**
 * Utility hook to conditionally load Google Maps script
 * Prevents loading Maps on pages that don't need it
 * Expected impact: ~230KB JS reduction on non-map pages
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const MAP_PAGES = [
  'map',
  'location',
  'maps',
  'geography',
  'gis',
];

export const useGoogleMapsLoader = () => {
  const pathname = usePathname();
  
  useEffect(() => {
    // Check if current page needs Google Maps
    const needsMaps = MAP_PAGES.some((page) => 
      pathname.toLowerCase().includes(page)
    );

    if (needsMaps && !(window as any).google?.maps) {
      // Dynamically load Google Maps only when needed
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [pathname]);
};

/**
 * Alternative: Load Google Maps script in layout with conditional rendering
 * Use in RootLayout for more control
 */
export const shouldLoadGoogleMaps = (pathname: string): boolean => {
  return MAP_PAGES.some((page) => pathname.toLowerCase().includes(page));
};
