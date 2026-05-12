import React from 'react';
import { FiAlignJustify } from 'react-icons/fi';
import NavLink from 'components/link/NavLink';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';

import { useSearch } from 'contexts/SearchContext';
import { usePathname } from 'next/navigation';

const Navbar = (props: {
  onOpenSidenav: () => void;
  brandText: string;
  secondary?: boolean | string;
  [x: string]: any;
}) => {
  const { onOpenSidenav, brandText, mini, hovered } = props;
  const pathname = usePathname();
  const { searchQuery, setSearchQuery } = useSearch();
  const [darkmode, setDarkmode] = React.useState(
    document.body.classList.contains('dark'),
  );

  // Clear search when switching pages
  React.useEffect(() => {
    setSearchQuery('');
  }, [pathname, setSearchQuery]);

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-2xl bg-white/30 p-2 backdrop-blur-2xl border border-white/20 shadow-lg transition-all duration-300 dark:bg-[#0b14374d] dark:border-white/10">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            Pages
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {' '}
              /{' '}
            </span>
          </a>
          <NavLink
            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href="#"
          >
            {brandText}
          </NavLink>
        </div>
      </div>

      <div className="relative mt-[3px] flex h-[50px] w-fit items-center gap-4 rounded-full bg-white/80 backdrop-blur-md px-6 py-2 shadow-xl shadow-shadow-500 border border-white/20 dark:!bg-navy-800 dark:border-white/5 dark:shadow-none">
        {/* User Info Chip */}
        <div className="flex items-center gap-2 border-r border-gray-200 pr-4 dark:border-white/10">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white shadow-lg shadow-brand-500/30">
            AD
          </div>
          <div className="flex flex-col">
            <p className="text-[11px] font-black text-navy-700 dark:text-white uppercase tracking-wider leading-none">
              Super Admin
            </p>
            <p className="text-[9px] font-bold text-gray-400 uppercase leading-none mt-1">
              Active Session
            </p>
          </div>
        </div>

        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        
        <div
          className="cursor-pointer text-gray-600 transition-all hover:scale-110 active:scale-95"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove('dark');
              setDarkmode(false);
            } else {
              document.body.classList.add('dark');
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-5 w-5 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-5 w-5 text-gray-600 dark:text-white" />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
