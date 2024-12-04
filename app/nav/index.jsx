'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import './nav.scss';

const NAV_ITEMS = [
  { path: '/', label: 'Menu' },
  { path: '/accaunt', label: 'Account' },
  // { path: '/tasks', label: 'Tasks' },
  { path: '/rating', label: 'Rating' }
];

const NavItem = ({ path, label, isActive }) => (
  <Link
    href={path}
    className={`nav-item ${isActive ? 'active' : ''}`}
    prefetch={true}
  >
    {label}
  </Link>
);

export default function Nav() {
    const pathname = usePathname();

    const navItems = useMemo(() => 
      NAV_ITEMS.map(item => ({
        ...item,
        isActive: pathname === item.path
      })),
      [pathname]
    );

    return (
        <nav className="bottom-navigation">
            {navItems.map(({ path, label, isActive }) => (
                <NavItem
                    key={path}
                    path={path}
                    label={label}
                    isActive={isActive}
                />
            ))}
        </nav>
    );
}