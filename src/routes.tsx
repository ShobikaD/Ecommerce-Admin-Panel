import React from 'react';
import {
  MdHome,
  MdPerson,
  MdStore,
  MdSubscriptions,
  MdShoppingBag,
  MdCategory,
  MdInfo,
  MdVideoLibrary,
  MdShoppingCart,
  MdAssignment,
  MdPostAdd,
  MdDescription,
  MdSettings,
  MdBuild,
  MdPayment,
} from 'react-icons/md';

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: 'dashboard',
    icon: <MdHome className="h-6 w-6" />,
  },
  {
    name: 'User',
    layout: '/admin',
    path: 'user',
    icon: <MdPerson className="h-6 w-6" />,
    children: [
      {
        name: 'User Info',
        layout: '/admin',
        path: 'user/info',
        icon: <MdInfo className="h-6 w-6" />,
      },
      {
        name: 'Reels',
        layout: '/admin',
        path: 'user/reels',
        icon: <MdVideoLibrary className="h-6 w-6" />,
      },
      {
        name: 'Cart Details',
        layout: '/admin',
        path: 'user/cart',
        icon: <MdShoppingCart className="h-6 w-6" />,
      },
      {
        name: 'Sales Request',
        layout: '/admin',
        path: 'user/sales-request',
        icon: <MdAssignment className="h-6 w-6" />,
      },
    ],
  },
  {
    name: 'Seller',
    layout: '/admin',
    path: 'seller',
    icon: <MdStore className="h-6 w-6" />,
    children: [
      {
        name: 'Seller Info',
        layout: '/admin',
        path: 'seller/info',
        icon: <MdInfo className="h-6 w-6" />,
      },
      {
        name: 'Ad Creation',
        layout: '/admin',
        path: 'seller/ad-creation',
        icon: <MdPostAdd className="h-6 w-6" />,
      },
      {
        name: 'Purchase Request',
        layout: '/admin',
        path: 'seller/purchase-request',
        icon: <MdDescription className="h-6 w-6" />,
      },
    ],
  },
  {
    name: 'Subscriptions',
    layout: '/admin',
    path: 'subscriptions',
    icon: <MdSubscriptions className="h-6 w-6" />,
  },
  {
    name: 'Products',
    layout: '/admin',
    path: 'products',
    icon: <MdShoppingBag className="h-6 w-6" />,
  },
  {
    name: 'Category',
    layout: '/admin',
    path: 'categories',
    icon: <MdCategory className="h-6 w-6" />,
  },
  {
    name: 'Payment',
    layout: '/admin',
    path: 'payment',
    icon: <MdPayment className="h-6 w-6" />,
  },
  {
    name: 'Admin Settings',
    layout: '/admin',
    path: 'admin-management',
    icon: <MdSettings className="h-6 w-6" />,
  },
  {
    name: 'Web Settings',
    layout: '/admin',
    path: 'web-settings',
    icon: <MdBuild className="h-6 w-6" />,
  },
];

export default routes;
