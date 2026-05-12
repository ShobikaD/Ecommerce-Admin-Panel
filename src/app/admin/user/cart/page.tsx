'use client';
import React from 'react';
import Card from 'components/card';
import { MdShoppingCart, MdRemoveRedEye, MdDelete, MdSearch } from 'react-icons/md';

const cartData = [
  {
    id: 1,
    customer: 'Alice Freeman',
    email: 'alice@example.com',
    items: 3,
    total: 1250.00,
    status: 'Active',
    lastUpdated: '2 mins ago',
    date: '02 May 2026',
    products: ['Wireless Headphones', 'Phone Case', 'Screen Protector']
  },
  {
    id: 2,
    customer: 'John Smith',
    email: 'john.s@test.com',
    items: 1,
    total: 899.99,
    status: 'Abandoned',
    lastUpdated: '4 hours ago',
    date: '01 May 2026',
    products: ['Smart Watch']
  },
  {
    id: 3,
    customer: 'Sarah Chen',
    email: 'schen@web.com',
    items: 5,
    total: 245.50,
    status: 'Active',
    lastUpdated: '15 mins ago',
    date: '02 May 2026',
    products: ['Organic Coffee', 'Mug', 'Filter Papers', 'Sugar', 'Spoon']
  },
  {
    id: 4,
    customer: 'Michael Brown',
    email: 'mbrown@mail.com',
    items: 2,
    total: 45.00,
    status: 'Abandoned',
    lastUpdated: 'Yesterday',
    date: '30 Apr 2026',
    products: ['T-Shirt', 'Socks']
  },
  {
    id: 5,
    customer: 'Emma Wilson',
    email: 'emma.w@domain.com',
    items: 4,
    total: 3200.00,
    status: 'Active',
    lastUpdated: 'Just now',
    date: '02 May 2026',
    products: ['Laptop', 'Mouse', 'Keyboard', 'Webcam']
  }
];

import { useSearch } from 'contexts/SearchContext';

export default function CartDetails() {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const { searchQuery, setSearchQuery } = useSearch();

  // Filter Logic
  const filteredData = cartData.filter((cart) => {
    // 1. Search Filter
    const matchesSearch = 
      cart.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cart.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cart.products.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // 2. Date Filter
    if (!startDate && !endDate) return true;
    
    const activityDate = new Date(cart.date);
    activityDate.setHours(0, 0, 0, 0);

    const start = startDate ? new Date(startDate) : null;
    if (start) start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    if (start && end) {
      return activityDate >= start && activityDate <= end;
    } else if (start) {
      return activityDate >= start;
    } else if (end) {
      return activityDate <= end;
    }
    return true;
  });

  return (
    <div>
      <div className="flex flex-col px-[25px]">
        {/* Header Section */}
        <div className="mb-[30px] flex flex-col justify-between md:flex-row md:items-center">
          <div>
            <h2 className="text-[22px] font-bold text-navy-700 dark:text-white uppercase tracking-tight">
              Cart Details
            </h2>
            <p className="mt-[5px] text-sm font-normal text-secondaryGray-600">
              Monitor active shopping sessions and recover abandoned carts
            </p>
          </div>

          {/* Inline Search Bar */}
          <div className="md:flex-1 md:max-w-md md:mx-10 mt-[10px] md:mt-0">
            <div className="relative flex items-center h-12 w-full rounded-2xl bg-white px-4 shadow-sm border border-gray-100 dark:bg-navy-800 dark:border-white/5 transition-all focus-within:border-brand-500">
              <MdSearch className="h-5 w-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search carts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 w-full bg-transparent text-sm font-bold text-navy-700 outline-none placeholder:text-gray-400 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-[10px] flex items-center gap-4">
             <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-navy-800 border border-gray-100 dark:border-white/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
                <MdShoppingCart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400">TOTAL CARTS</p>
                <p className="text-xl font-bold text-navy-700 dark:text-white">
                  {filteredData.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-[30px] flex flex-wrap items-center gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-xl border border-gray-200 p-2 text-sm outline-none transition-all focus:border-brand-500 dark:border-white/10 dark:bg-navy-800 dark:text-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-xl border border-gray-200 p-2 text-sm outline-none transition-all focus:border-brand-500 dark:border-white/10 dark:bg-navy-800 dark:text-white"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="mt-5 text-sm font-bold text-red-500 hover:text-red-600 transition-all"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Carts Table */}
        <Card extra="w-full h-full sm:overflow-auto px-6 py-6">
          <div className="relative flex items-center justify-between">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              Recent Activity
            </div>
          </div>

          <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
            <table className="w-full">
              <thead>
                <tr className="!border-px !border-gray-400 text-left">
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Customer
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Items
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Total Value
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Status
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Last Updated
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Added Date
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((cart) => (
                  <tr key={cart.id}>
                    <td className="min-w-[150px] border-white/0 py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
                          {cart.customer.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {cart.customer}
                          </p>
                          <p className="text-xs text-gray-600">{cart.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="min-w-[150px] border-white/0 py-3 pr-4">
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {cart.items} Items
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[150px]">
                          {cart.products.join(', ')}
                        </p>
                      </div>
                    </td>
                    <td className="min-w-[100px] border-white/0 py-3 pr-4">
                      <p className="text-sm font-bold text-navy-700 dark:text-white">
                        Rs. {cart.total.toLocaleString()}
                      </p>
                    </td>
                    <td className="min-w-[100px] border-white/0 py-3 pr-4">
                      <div className={`flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold ${
                        cart.status === 'Active' 
                        ? 'bg-green-100 text-green-500 dark:bg-green-500/10' 
                        : 'bg-orange-100 text-orange-500 dark:bg-orange-500/10'
                      }`}>
                        {cart.status}
                      </div>
                    </td>
                    <td className="min-w-[100px] border-white/0 py-3 pr-4">
                      <p className="text-sm font-medium text-gray-600">
                        {cart.lastUpdated}
                      </p>
                    </td>
                    <td className="min-w-[100px] border-white/0 py-3 pr-4">
                      <p className="text-sm font-medium text-gray-600">
                        {cart.date}
                      </p>
                    </td>
                    <td className="min-w-[100px] border-white/0 py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-navy-700 transition hover:bg-gray-200 dark:bg-navy-800 dark:text-white dark:hover:bg-navy-700">
                          <MdRemoveRedEye className="h-4 w-4" />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20">
                          <MdDelete className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
