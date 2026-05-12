'use client';
import React from 'react';
import Card from 'components/card';
import { MdCardMembership, MdRemoveRedEye, MdDelete, MdSearch } from 'react-icons/md';
import { useSearch } from 'contexts/SearchContext';

const subscriptionData = [
  {
    id: 1,
    subscriber: 'Tech Haven',
    plan: 'Enterprise',
    amount: 299.99,
    status: 'Active',
    startDate: '02 May 2026',
    expiryDate: '02 May 2027'
  },
  {
    id: 2,
    subscriber: 'Urban Style',
    plan: 'Professional',
    amount: 99.99,
    status: 'Active',
    startDate: '01 May 2026',
    expiryDate: '01 May 2027'
  },
  {
    id: 3,
    subscriber: 'Organic Roots',
    plan: 'Basic',
    amount: 49.99,
    status: 'Expired',
    startDate: '01 Apr 2026',
    expiryDate: '01 May 2026'
  },
  {
    id: 4,
    subscriber: 'Gaming Zone',
    plan: 'Enterprise',
    amount: 299.99,
    status: 'Active',
    startDate: '30 Apr 2026',
    expiryDate: '30 Apr 2027'
  },
  {
    id: 5,
    subscriber: 'Home Comforts',
    plan: 'Professional',
    amount: 99.99,
    status: 'Trial',
    startDate: '02 May 2026',
    expiryDate: '16 May 2026'
  }
];

export default function SubscriptionModule() {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const { searchQuery, setSearchQuery } = useSearch();

  // Filter Logic
  const filteredData = subscriptionData.filter((item) => {
    if (!startDate && !endDate) return true;
    
    const dateObj = new Date(item.startDate);
    dateObj.setHours(0, 0, 0, 0);

    const start = startDate ? new Date(startDate) : null;
    if (start) start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    if (start && end) {
      return dateObj >= start && dateObj <= end;
    } else if (start) {
      return dateObj >= start;
    } else if (end) {
      return dateObj <= end;
    }
    return true;
  });

  return (
    <div className="pt-[130px] md:pt-[80px] xl:pt-[80px]">
      <div className="flex flex-col px-[25px]">
        {/* Header Section */}
        <div className="mb-[30px] flex flex-col justify-between md:flex-row md:items-center">
          <div>
            <h2 className="text-[22px] font-bold text-navy-700 dark:text-white uppercase tracking-tight">
              Subscription Management
            </h2>
            <p className="mt-[5px] text-sm font-normal text-secondaryGray-600">
              Track and manage recurring revenue, plans, and member validity
            </p>
          </div>

          {/* Inline Search Bar */}
          <div className="md:flex-1 md:max-w-md md:mx-10 mt-[10px] md:mt-0">
            <div className="relative flex items-center h-12 w-full rounded-2xl bg-white px-4 shadow-sm border border-gray-100 dark:bg-navy-800 dark:border-white/5 transition-all focus-within:border-brand-500">
              <MdSearch className="h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search subscriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 w-full bg-transparent text-sm font-bold text-navy-700 outline-none placeholder:text-gray-400 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-[10px] flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-navy-800 border border-gray-100 dark:border-white/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
              <MdCardMembership className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Active Subscriptions</p>
              <p className="text-xl font-bold text-navy-700 dark:text-white">
                {filteredData.filter(s => s.status === 'Active').length}
              </p>
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

        {/* Subscription Table */}
        <Card extra="w-full h-full sm:overflow-auto px-6 py-6">
          <div className="relative flex items-center justify-between">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              Subscriber List
            </div>
          </div>

          <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
            <table className="w-full">
              <thead>
                <tr className="!border-px !border-gray-400 text-left">
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Subscriber
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Plan
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Amount
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Status
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Validity Period
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((sub) => (
                  <tr key={sub.id}>
                    <td className="min-w-[150px] border-white/0 py-3 pr-4">
                      <p className="text-sm font-bold text-navy-700 dark:text-white">
                        {sub.subscriber}
                      </p>
                    </td>
                    <td className="min-w-[120px] border-white/0 py-3 pr-4">
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {sub.plan}
                        </p>
                      </div>
                    </td>
                    <td className="min-w-[100px] border-white/0 py-3 pr-4">
                      <p className="text-sm font-bold text-navy-700 dark:text-white">
                        ${sub.amount.toFixed(2)}
                      </p>
                    </td>
                    <td className="min-w-[100px] border-white/0 py-3 pr-4">
                      <div className={`flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold ${
                        sub.status === 'Active' 
                        ? 'bg-green-100 text-green-500 dark:bg-green-500/10' 
                        : sub.status === 'Expired'
                        ? 'bg-red-100 text-red-500 dark:bg-red-500/10'
                        : 'bg-blue-100 text-blue-500 dark:bg-blue-500/10'
                      }`}>
                        {sub.status}
                      </div>
                    </td>
                    <td className="min-w-[200px] border-white/0 py-3 pr-4">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-600">
                          {sub.startDate} - {sub.expiryDate}
                        </p>
                      </div>
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
