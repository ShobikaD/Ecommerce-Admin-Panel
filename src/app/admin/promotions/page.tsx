'use client';

import React, { useState } from 'react';
import Card from 'components/card';
import { 
  MdCampaign, 
  MdPhotoSizeSelectActual, 
  MdStore, 
  MdCategory, 
  MdAdd, 
  MdDelete, 
  MdEdit, 
  MdLink, 
  MdDateRange,
  MdSave,
  MdCloudUpload,
  MdVisibility,
  MdSearch
} from 'react-icons/md';
import Image from 'next/image';
import { useSearch } from 'contexts/SearchContext';

const INITIAL_BANNERS = [
  { id: 1, title: 'Summer Mega Sale', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80', link: '/sale/summer', status: 'Active' },
  { id: 2, title: 'Tech Extravaganza', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80', link: '/categories/electronics', status: 'Draft' },
];

const INITIAL_STORES = [
  { id: 1, name: 'Royal Electronics', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=80', rating: 4.8 },
  { id: 2, name: 'Organic Fresh', logo: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=100&q=80', rating: 4.5 },
];

export default function PromotionsPage() {
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [activeTab, setActiveTab] = useState('banners');
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div className="flex flex-col px-[25px]">
      {/* Header */}
      <div className="mb-[30px] flex flex-col justify-between md:flex-row md:items-center">
        <div>
          <h2 className="text-[22px] font-bold text-navy-700 dark:text-white uppercase tracking-tight">
            Promotion & Engagement Hub
          </h2>
          <p className="mt-[5px] text-sm font-normal text-secondaryGray-600">
            Control home screen visibility and featured platform content
          </p>
        </div>

        {/* Inline Search Bar */}
        <div className="md:flex-1 md:max-w-md md:mx-10 mt-[10px] md:mt-0">
          <div className="relative flex items-center h-12 w-full rounded-2xl bg-white px-4 shadow-sm border border-gray-100 dark:bg-navy-800 dark:border-white/5 transition-all focus-within:border-brand-500">
            <MdSearch className="h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search promotions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 w-full bg-transparent text-sm font-bold text-navy-700 outline-none placeholder:text-gray-400 dark:text-white"
            />
          </div>
        </div>
        <button className="mt-[10px] flex items-center gap-2 rounded-xl bg-brand-500 px-8 py-3 text-sm font-bold text-white transition hover:bg-brand-600 active:bg-brand-700 shadow-lg shadow-brand-500/20">
          <MdAdd className="h-5 w-5" />
          CREATE NEW PROMOTION
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-6 border-b border-gray-100 dark:border-white/5 pb-2">
        {[
          { id: 'banners', label: 'Home Banners', icon: <MdPhotoSizeSelectActual className="h-4 w-4" /> },
          { id: 'stores', label: 'Featured Stores', icon: <MdStore className="h-4 w-4" /> },
          { id: 'categories', label: 'Flash Categories', icon: <MdCategory className="h-4 w-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 text-sm font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'border-b-2 border-brand-500 text-brand-500' : 'text-gray-400 hover:text-navy-700 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Banner Management */}
        {activeTab === 'banners' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <Card key={banner.id} extra="p-6">
                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-2xl bg-gray-50 dark:bg-navy-700">
                   <Image src={banner.image} alt={banner.title} fill className="object-cover" />
                   <div className="absolute top-4 right-4 flex gap-2">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${banner.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}>
                         {banner.status}
                      </span>
                   </div>
                </div>
                <div className="flex flex-col gap-4">
                   <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-navy-700 dark:text-white uppercase tracking-tight">{banner.title}</h4>
                      <div className="flex gap-2">
                         <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-navy-800 dark:text-white"><MdEdit className="h-4 w-4" /></button>
                         <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/10"><MdDelete className="h-4 w-4" /></button>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 dark:bg-navy-800">
                         <MdLink className="h-4 w-4 text-gray-400" />
                         <p className="text-xs font-bold text-gray-500 truncate">{banner.link}</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 dark:bg-navy-800">
                         <MdDateRange className="h-4 w-4 text-gray-400" />
                         <p className="text-xs font-bold text-gray-500">Exp: 30 Dec 2026</p>
                      </div>
                   </div>
                </div>
              </Card>
            ))}
            {/* Add Banner Placeholder */}
            <button className="group flex flex-col items-center justify-center h-[340px] rounded-[20px] border-2 border-dashed border-gray-200 bg-white/50 transition-all hover:border-brand-500 hover:bg-white dark:border-white/10 dark:hover:border-brand-500">
               <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10 text-brand-500 group-hover:scale-110 transition-all">
                  <MdCloudUpload className="h-7 w-7" />
               </div>
               <p className="text-sm font-black text-navy-700 dark:text-white uppercase tracking-widest">Upload New Home Banner</p>
               <p className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Recommended: 1200x400px (Max 5MB)</p>
            </button>
          </div>
        )}

        {/* Featured Stores */}
        {activeTab === 'stores' && (
          <Card extra="p-8">
             <div className="mb-8 flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-bold text-navy-700 dark:text-white uppercase tracking-tight">Home Screen "Stores to Follow"</h3>
                   <p className="text-sm text-gray-400">Select top-performing merchants for premium visibility</p>
                </div>
                <button className="rounded-xl border border-brand-500 px-6 py-2 text-xs font-black text-brand-500 transition hover:bg-brand-500 hover:text-white uppercase tracking-widest">Add Merchant</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {INITIAL_STORES.map((store) => (
                  <div key={store.id} className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4 dark:border-white/5 hover:shadow-lg transition-all">
                     <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-gray-50 dark:bg-navy-700">
                        <Image src={store.logo} alt={store.name} fill className="object-cover" />
                     </div>
                     <div className="flex-1">
                        <p className="text-sm font-black text-navy-700 dark:text-white uppercase tracking-tight">{store.name}</p>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                           <span>⭐ {store.rating}</span>
                           <span className="text-gray-300 ml-2">Rating</span>
                        </div>
                     </div>
                     <button className="text-gray-400 hover:text-red-500"><MdDelete className="h-5 w-5" /></button>
                  </div>
                ))}
             </div>
          </Card>
        )}

        {/* Flash Categories */}
        {activeTab === 'categories' && (
          <Card extra="p-8">
             <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
                   <MdCategory className="h-10 w-10" />
                </div>
                <h4 className="text-xl font-bold text-navy-700 dark:text-white uppercase tracking-tight">Flash Categories Engine</h4>
                <p className="mt-2 max-w-sm text-sm text-gray-400">Pin specific product categories to the top of the app discovery feed for festive or seasonal sales.</p>
                <button className="mt-8 rounded-xl bg-brand-500 px-10 py-3 text-sm font-black text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-600 active:scale-95 uppercase tracking-widest">Initialize Module</button>
             </div>
          </Card>
        )}
      </div>
    </div>
  );
}
