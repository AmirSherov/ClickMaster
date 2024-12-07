'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import  style  from './nav.module.scss';

const NAV_ITEMS = [
  { path: '/', label: 'Menu' },
  { path: '/accaunt', label: 'Account' },
  { path: '/rating', label: 'Rating' },
  { path: '/mini-games', label: 'Games' }, 
];

const NavItem = ({ path, label, isActive }) => (
  <Link
    href={path}
    className={`${style.navItem} ${isActive ? style.activeNavigation : ''}`}
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
        <nav className={style.bottomNavigation}>
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