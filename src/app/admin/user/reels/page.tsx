'use client';

import React from 'react';
import Card from 'components/card';
import { 
  MdVideoLibrary, 
  MdVisibility, 
  MdFavorite, 
  MdDelete, 
  MdEdit, 
  MdRemoveRedEye,
  MdAdd,
  MdLink,
  MdSearch
} from 'react-icons/md';
import Image from 'next/image';
import { useSearch } from 'contexts/SearchContext';

// Mock Data for Reels
const reelsData = [
  {
    id: 1,
    title: 'Summer Collection 2026',
    username: '@alice_trends',
    views: '12.4K',
    likes: '1.2K',
    thumbnail: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80',
    date: '28 Apr 2026',
  },
  {
    id: 2,
    title: 'New Product Unboxing',
    username: '@tech_guru',
    views: '45.2K',
    likes: '5.8K',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    date: '27 Apr 2026',
  },
  {
    id: 3,
    title: 'E-commerce Tips & Tricks',
    username: '@shop_master',
    views: '8.9K',
    likes: '950',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
    date: '26 Apr 2026',
  },
  {
    id: 4,
    title: 'Minimalist Lifestyle',
    username: '@zen_living',
    views: '3.1K',
    likes: '420',
    thumbnail: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=400&q=80',
    date: '25 Apr 2026',
  },
  {
    id: 5,
    title: 'Tech Gadgets Review',
    username: '@gadget_pro',
    views: '22.8K',
    likes: '2.1K',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
    date: '24 Apr 2026',
  },
  {
    id: 6,
    title: 'Nature & Serenity',
    username: '@wild_explorer',
    views: '15.6K',
    likes: '3.4K',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
    date: '23 Apr 2026',
  },
  {
    id: 7,
    title: 'Urban Fashion Highlights',
    username: '@style_icon',
    views: '33.1K',
    likes: '4.2K',
    thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
    date: '22 Apr 2026',
  },
  {
    id: 8,
    title: 'Cozy Home Office Setup',
    username: '@work_from_home',
    views: '11.2K',
    likes: '1.8K',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=80',
    date: '21 Apr 2026',
  },
  {
    id: 9,
    title: 'Healthy Morning Recipes',
    username: '@chef_amy',
    views: '9.4K',
    likes: '1.1K',
    thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80',
    date: '20 Apr 2026',
  },
  {
    id: 10,
    title: 'Daily Fitness Motivation',
    username: '@gym_beast',
    views: '54.2K',
    likes: '7.8K',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80',
    date: '19 Apr 2026',
  },
];

export default function ReelsPage() {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { searchQuery, setSearchQuery } = useSearch();

  // Create Reel State
  const [newReel, setNewReel] = React.useState({
    title: '',
    video: null as File | null,
    linkedProduct: '',
    isPriority: true
  });

  // Filter Logic
  const filteredData = reelsData.filter((reel) => {
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
      {/* Create Reel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/50 backdrop-blur-sm p-4">
          <Card extra="w-full max-w-[500px] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
              <h3 className="text-xl font-black text-navy-700 dark:text-white uppercase tracking-tight">Create Platform Reel</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-navy-700 dark:hover:text-white transition-all text-xl">✕</button>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reel Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Summer Collection Launch"
                  value={newReel.title}
                  onChange={(e) => setNewReel({...newReel, title: e.target.value})}
                  className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm font-bold text-navy-700 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-navy-800 dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Video Source</label>
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 p-8 dark:border-white/10 hover:border-brand-500 transition-all cursor-pointer group">
                   <div className="mb-2 h-12 w-12 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 group-hover:scale-110 transition-all">
                      <MdVideoLibrary className="h-6 w-6" />
                   </div>
                   <p className="text-xs font-black text-navy-700 dark:text-white uppercase tracking-widest">Select MP4/MOV File</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Link to Product</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search product..."
                    value={newReel.linkedProduct}
                    onChange={(e) => setNewReel({...newReel, linkedProduct: e.target.value})}
                    className="w-full rounded-2xl border border-gray-100 bg-white p-4 pl-12 text-sm font-bold text-navy-700 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-navy-800 dark:text-white"
                  />
                  <MdLink className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-brand-50/30 dark:bg-brand-500/5 rounded-2xl border border-brand-100 dark:border-brand-500/20">
                <p className="text-[11px] font-black text-brand-500 uppercase tracking-widest">Priority Boost</p>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" checked={newReel.isPriority} onChange={() => setNewReel({...newReel, isPriority: !newReel.isPriority})} className="peer sr-only" />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand-500 peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                </label>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full rounded-2xl bg-brand-500 py-4 text-sm font-black text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all uppercase tracking-widest"
              >
                Publish Platform Reel
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-[30px] flex flex-col justify-between md:flex-row md:items-center">
        <div>
          <h2 className="text-[22px] font-bold text-navy-700 dark:text-white uppercase tracking-tight">
            Video Engagement Suite
          </h2>
          <p className="mt-[5px] text-sm font-normal text-secondaryGray-600">
            Moderate and track engagement of user-uploaded reels
          </p>
        </div>

        {/* Inline Search Bar */}
        <div className="md:flex-1 md:max-w-md md:mx-10 mt-[10px] md:mt-0">
          <div className="relative flex items-center h-12 w-full rounded-2xl bg-white px-4 shadow-sm border border-gray-100 dark:bg-navy-800 dark:border-white/5 transition-all focus-within:border-brand-500">
            <MdSearch className="h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search reels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 w-full bg-transparent text-sm font-bold text-navy-700 outline-none placeholder:text-gray-400 dark:text-white"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-[10px]">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-xs font-black text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-600 active:scale-95 uppercase tracking-widest"
          >
            <MdAdd className="h-5 w-5" />
            Create New Reel
          </button>
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-navy-800 border border-gray-100 dark:border-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
              <MdVideoLibrary className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">TOTAL REELS</p>
              <p className="text-lg font-bold text-navy-700 dark:text-white">
                {filteredData.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-[30px] flex flex-wrap items-center gap-4">
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl border border-gray-200 p-2 text-sm outline-none dark:border-white/10 dark:bg-navy-800 dark:text-white font-bold"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-xl border border-gray-200 p-2 text-sm outline-none dark:border-white/10 dark:bg-navy-800 dark:text-white font-bold"
          />
        </div>
        {(startDate || endDate) && (
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
            className="mt-5 text-xs font-black text-red-500 hover:text-red-600 uppercase tracking-widest"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Reels Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredData.map((reel) => (
          <Card key={reel.id} extra="pb-4">
            <div className="relative w-full">
              <Image
                src={reel.thumbnail}
                width={400}
                height={250}
                className="mb-3 h-[250px] w-full rounded-xl object-cover"
                alt={reel.title}
              />
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs font-bold text-white backdrop-blur-md">
                <MdVisibility className="h-3 w-3" />
                {reel.views}
              </div>
            </div>
            <div className="px-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-lg font-bold text-navy-700 dark:text-white truncate pr-2 tracking-tight">
                  {reel.title}
                </p>
                <div className="flex items-center gap-1 text-brand-500">
                  <MdFavorite className="h-4 w-4" />
                  <span className="text-sm font-bold">{reel.likes}</span>
                </div>
              </div>
              <div className="mb-4 flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-navy-700" />
                <p className="text-sm font-medium text-secondaryGray-600 uppercase tracking-tighter">
                  {reel.username}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 dark:border-white/5 pt-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{reel.date}</p>
                <div className="flex gap-2">
                  <button title="View" className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-500/10"><MdRemoveRedEye className="h-4 w-4" /></button>
                  <button title="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 dark:bg-navy-800"><MdEdit className="h-4 w-4" /></button>
                  <button title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-500/10"><MdDelete className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
