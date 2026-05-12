'use client';

import React from 'react';
import Card from 'components/card';
import { MdVideoLibrary, MdVisibility, MdFavorite, MdDelete, MdEdit, MdRemoveRedEye, MdSearch, MdCheckCircle, MdCancel } from 'react-icons/md';
import Image from 'next/image';
import { useSearch } from 'contexts/SearchContext';

// Mock Data for Seller Reels
const sellerReelsData = [
  {
    id: 1,
    title: 'New Gadget Showcase',
    username: 'Tech Haven',
    views: '24.5K',
    likes: '3.1K',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
    date: '02 May 2026',
  },
  {
    id: 2,
    title: 'Warehouse Tour',
    username: 'Global Logistics',
    views: '12.2K',
    likes: '850',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
    date: '01 May 2026',
  },
  {
    id: 3,
    title: 'Behind the Scenes: Organic Tea',
    username: 'Organic Roots',
    views: '8.4K',
    likes: '1.2K',
    thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80',
    date: '30 Apr 2026',
  },
  {
    id: 4,
    title: 'Store Grand Opening',
    username: 'Urban Style',
    views: '45.1K',
    likes: '6.4K',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
    date: '29 Apr 2026',
  },
];

export default function SellerReelsPage() {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const { searchQuery, setSearchQuery } = useSearch();

  const filteredData = sellerReelsData.filter((reel) => {
    const matchesSearch = 
      reel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reel.username.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (!startDate && !endDate) return true;
    
    const postDate = new Date(reel.date);
    postDate.setHours(0, 0, 0, 0);

    const start = startDate ? new Date(startDate) : null;
    if (start) start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    if (start && end) {
      return postDate >= start && postDate <= end;
    } else if (start) {
      return postDate >= start;
    } else if (end) {
      return postDate <= end;
    }
    return true;
  });

  return (
    <div className="flex flex-col px-[25px]">
      {/* Header Section */}
      <div className="mb-[30px] flex flex-col justify-between md:flex-row md:items-center">
        <div>
          <h2 className="text-[22px] font-bold text-navy-700 dark:text-white uppercase tracking-tight">
            Seller Reels Management
          </h2>
          <p className="mt-[5px] text-sm font-normal text-secondaryGray-600">
            Moderate and track promotional content uploaded by merchants
          </p>
        </div>

        {/* Inline Search Bar */}
        <div className="md:flex-1 md:max-w-md md:mx-10 mt-[10px] md:mt-0">
          <div className="relative flex items-center h-12 w-full rounded-2xl bg-white px-4 shadow-sm border border-gray-100 dark:bg-navy-800 dark:border-white/5 transition-all focus-within:border-brand-500">
            <MdSearch className="h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search merchant reels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 w-full bg-transparent text-sm font-bold text-navy-700 outline-none placeholder:text-gray-400 dark:text-white"
            />
          </div>
        </div>
        <div className="mt-[10px] flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-navy-800 border border-gray-100 dark:border-white/5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
            <MdVideoLibrary className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400">TOTAL REELS</p>
            <p className="text-xl font-bold text-navy-700 dark:text-white">
              {filteredData.length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-[30px] flex flex-wrap items-center gap-4">
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 mb-1 uppercase">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl border border-gray-200 p-2 text-sm outline-none dark:border-white/10 dark:bg-navy-800 dark:text-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 mb-1 uppercase">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-xl border border-gray-200 p-2 text-sm outline-none dark:border-white/10 dark:bg-navy-800 dark:text-white"
          />
        </div>
        {(startDate || endDate) && (
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
            className="mt-5 text-sm font-bold text-red-500 hover:text-red-600"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Reels Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredData.map((reel) => (
          <Card key={reel.id} extra="pb-4 overflow-hidden group">
            <div className="relative w-full">
              <Image
                src={reel.thumbnail}
                width={400}
                height={250}
                className="mb-3 h-[250px] w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-110"
                alt={reel.title}
              />
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <div className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                  <MdVisibility className="h-3 w-3" />
                  {reel.views}
                </div>
                {parseInt(reel.views) > 20 && (
                  <div className="rounded-full bg-brand-500 px-2 py-1 text-[8px] font-black text-white uppercase tracking-widest shadow-lg">
                    Trending
                  </div>
                )}
              </div>
            </div>
            <div className="px-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-lg font-bold text-navy-700 dark:text-white truncate pr-2">
                  {reel.title}
                </p>
                <div className="flex items-center gap-1 text-brand-500">
                  <MdFavorite className="h-4 w-4" />
                  <span className="text-sm font-bold">{reel.likes}</span>
                </div>
              </div>
              <div className="mb-4 flex items-center justify-between bg-gray-50 dark:bg-navy-800 p-2 rounded-xl border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 font-bold text-[10px]">
                    {reel.username.charAt(0)}
                  </div>
                  <p className="text-xs font-bold text-navy-700 dark:text-white uppercase tracking-tighter">
                    {reel.username}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                   <p className="text-[9px] font-black text-brand-500 uppercase">Linked Item</p>
                   <p className="text-[10px] font-bold text-gray-400 truncate max-w-[80px]">Pro Series X</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{reel.date}</p>
                <div className="flex gap-2">
                  <button title="Approve" className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all active:scale-95">
                    <MdCheckCircle className="h-4 w-4" />
                  </button>
                  <button title="Reject" className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                    <MdCancel className="h-4 w-4" />
                  </button>
                  <button title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-navy-800 transition-all">
                    <MdDelete className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
