import { Montserrat } from 'next/font/google';

/**
 * Optimized Montserrat font for News Tamil Admin
 * - Uses next/font for automatic optimization
 * - font-display: swap to prevent FOIT (Flash of Invisible Text)
 * - Preloaded for faster initial paint
 */
export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});
