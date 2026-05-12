'use client';
import React from 'react';
import Card from 'components/card';
import { MdCampaign, MdRemoveRedEye, MdDelete, MdCheckCircle, MdCancel } from 'react-icons/md';

const adData = [
  {
    id: 1,
    adTitle: 'Summer Mega Sale',
    seller: 'Urban Style',
    type: 'Banner',
    status: 'Live',
    date: '02 May 2026'
  },
  {
    id: 2,
    adTitle: 'New Arrival: Tech X',
    seller: 'Tech Haven',
    type: 'Sponsored',
    status: 'Reviewing',
    date: '01 May 2026'
  },
  {
    id: 3,
    adTitle: 'Organic Living Promo',
    seller: 'Organic Roots',
    type: 'Video Ad',
    status: 'Live',
    date: '02 May 2026'
  },
  {
    id: 4,
    adTitle: 'Gaming Weekend Deal',
    seller: 'Gaming Zone',
    type: 'Popup',
    status: 'Completed',
    date: '30 Apr 2026'
  },
  {
    id: 5,
    adTitle: 'Cozy Home Collection',
    seller: 'Home Comforts',
    type: 'Banner',
    status: 'Live',
    date: '02 May 2026'
  }
];

import { useSearch } from 'contexts/SearchContext';

export default function AdCreation() {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const { searchQuery } = useSearch();

  // Filter Logic
  const filteredData = adData.filter((item) => {
    // 1. Search Filter
    const matchesSearch = 
      item.adTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Date Filter
    if (!startDate && !endDate) return true;
    
    const dateObj = new Date(item.date);
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
    <div>
      <div className="flex flex-col px-[25px]">
        {/* Header Section */}
        <div className="mb-[30px] flex flex-col justify-between md:flex-row md:items-center">
          <div>
            <h2 className="text-[22px] font-bold text-navy-700 dark:text-white">
              Ad Creation Management
            </h2>
            <p className="mt-[5px] text-sm font-normal text-secondaryGray-600">
              Review and moderate advertising campaigns from your sellers
            </p>
          </div>
          <div className="mt-[10px] flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-navy-800 border border-gray-100 dark:border-white/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
              <MdCampaign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Total Ads</p>
              <p className="text-xl font-bold text-navy-700 dark:text-white">
                {filteredData.length}
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

        {/* Ads Table */}
        <Card extra="w-full h-full sm:overflow-auto px-6 py-6">
          <div className="relative flex items-center justify-between">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              Campaign List
            </div>
          </div>

          <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
            <table className="w-full">
              <thead>
                <tr className="!border-px !border-gray-400 text-left">
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Campaign Info
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Merchant
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Analytics
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10 text-center">
                    Status
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10 text-center">
                    Moderation
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((ad) => (
                  <tr key={ad.id} className="border-b border-gray-50 dark:border-white/5 last:border-none">
                    <td className="min-w-[180px] py-4 pr-4">
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-navy-700 dark:text-white">{ad.adTitle}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-black uppercase text-gray-500 dark:bg-navy-800">{ad.type}</span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{ad.date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="min-w-[150px] py-4 pr-4">
                      <p className="text-sm font-bold text-navy-700 dark:text-white uppercase tracking-tighter">
                        {ad.seller}
                      </p>
                    </td>
                    <td className="min-w-[140px] py-4 pr-4">
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <p className="text-xs font-black text-navy-700 dark:text-white">1.2K</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Views</p>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-xs font-black text-brand-500">4.2%</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">CTR</p>
                        </div>
                      </div>
                    </td>
                    <td className="min-w-[100px] py-4 pr-4 text-center">
                      <div className={`mx-auto w-fit items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                        ad.status === 'Live' 
                        ? 'bg-green-100 text-green-500 shadow-sm shadow-green-500/10' 
                        : ad.status === 'Reviewing'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-gray-100 text-gray-500'
                      }`}>
                        {ad.status}
                      </div>
                    </td>
                    <td className="min-w-[150px] py-4">
                      <div className="flex items-center justify-center gap-2">
                        {ad.status === 'Reviewing' ? (
                          <>
                            <button title="Approve" className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all active:scale-95">
                              <MdCheckCircle className="h-5 w-5" />
                            </button>
                            <button title="Reject" className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                              <MdCancel className="h-5 w-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button title="View Analytics" className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-navy-700 hover:bg-gray-100 dark:bg-navy-800 dark:text-white">
                              <MdRemoveRedEye className="h-4 w-4" />
                            </button>
                            <button title="Stop Campaign" className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100">
                              <MdDelete className="h-4 w-4" />
                            </button>
                          </>
                        )}
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
