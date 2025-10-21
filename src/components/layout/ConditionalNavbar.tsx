'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar(): React.JSX.Element | null {
  const pathname = usePathname();

  // Hide navbar on login and register pages
  const hideNavbar = pathname === '/auth/login' || pathname === '/auth/register';

  if (hideNavbar) {
    return null;
  }

  return <Navbar />;
}