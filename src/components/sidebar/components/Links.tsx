/* eslint-disable */
import React, { useState } from 'react';
import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import NavLink from 'components/link/NavLink';
import DashIcon from 'components/icons/DashIcon';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';

export const SidebarLinks = (props: { routes: RoutesType[] }): JSX.Element => {
  const pathname = usePathname();
  const { routes } = props;
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName);
    },
    [pathname],
  );

  const createLinks = (routes: RoutesType[], isChild = false) => {
    return routes.map((route, index) => {
      if (
        route.layout === '/admin' ||
        route.layout === '/auth' ||
        route.layout === '/rtl'
      ) {
        const hasChildren = route.children && route.children.length > 0;
        const isOpen = openMenus[route.name];

        return (
          <div key={index}>
            {hasChildren ? (
              <div
                className="relative mb-2 flex hover:cursor-pointer group"
                onClick={() => toggleMenu(route.name)}
              >
                <li className="my-[3px] flex cursor-pointer items-center w-full py-2.5 px-6 rounded-xl group-hover:bg-brand-500/5 dark:group-hover:bg-white/5 transition-all duration-300 ease-in-out">
                  <span
                    className={`${
                      activeRoute(route.path) === true
                        ? 'font-bold text-brand-500 dark:text-white'
                        : 'font-medium text-gray-400 group-hover:text-brand-500 dark:group-hover:text-brand-400'
                    } transition-all duration-300 group-hover:scale-110`}
                  >
                    {route.icon ? route.icon : <DashIcon />}{' '}
                  </span>
                  <p
                    className={`leading-1 ml-4 flex flex-1 ${
                      activeRoute(route.path) === true
                        ? 'font-bold text-navy-700 dark:text-white'
                        : 'font-medium text-gray-500 group-hover:text-navy-700 dark:group-hover:text-white'
                    } transition-all duration-300`}
                  >
                    {route.name}
                  </p>
                  <span className={`text-gray-400 group-hover:text-brand-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <MdKeyboardArrowDown />
                  </span>
                </li>
              </div>
            ) : (
              <NavLink href={route.layout + '/' + route.path}>
                <div className="relative mb-2 flex hover:cursor-pointer group">
                  <li
                    className={`my-[3px] flex cursor-pointer items-center w-full py-2.5 rounded-xl ${
                      isChild ? 'pl-14 pr-6' : 'px-6'
                    } group-hover:bg-brand-500/5 dark:group-hover:bg-white/5 transition-all duration-300 ease-in-out`}
                  >
                    <span
                      className={`${
                        activeRoute(route.path) === true
                          ? 'font-bold text-brand-500 dark:text-white'
                          : 'font-medium text-gray-400 group-hover:text-brand-500 dark:group-hover:text-brand-400'
                      } transition-all duration-300 group-hover:scale-110`}
                    >
                      {route.icon ? route.icon : <DashIcon />}{' '}
                    </span>
                    <p
                      className={`leading-1 ml-4 flex ${
                        activeRoute(route.path) === true
                          ? 'font-bold text-navy-700 dark:text-white'
                          : 'font-medium text-gray-500 group-hover:text-navy-700 dark:group-hover:text-white'
                      } transition-all duration-300`}
                    >
                      {route.name}
                    </p>
                  </li>
                  {activeRoute(route.path) ? (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-lg bg-brand-500 dark:bg-brand-400 shadow-[0_0_8px_rgba(66,33,255,0.5)]" />
                  ) : null}
                </div>
              </NavLink>
            )}
            {hasChildren && isOpen && (
              <div className="mt-1 space-y-1 overflow-hidden transition-all duration-500 ease-in-out">
                {createLinks(route.children, true)}
              </div>
            )}
          </div>
        );
      }
    });
  };

  return <>{createLinks(routes)}</>;
};

export default SidebarLinks;
