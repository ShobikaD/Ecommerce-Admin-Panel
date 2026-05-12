'use client';

import React from 'react';
import Card from 'components/card';
import { MdPeople, MdArrowBack, MdShoppingCart, MdFavorite, MdLocationOn, MdVideoLibrary, MdCheckCircle, MdPending, MdRemoveRedEye, MdDelete, MdSearch } from 'react-icons/md';
import Image from 'next/image';
import { useSearch } from 'contexts/SearchContext';
import Widget from 'components/widget/Widget';

const userData = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    status: 'Active',
    date: '20 Apr 2026',
    location: 'Indiranagar, Bangalore',
    engagement: 'High',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80',
    stats: { requests: 12, following: 8, likedReels: 45 }
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    status: 'Pending',
    date: '22 Apr 2026',
    location: 'Koramangala, Bangalore',
    engagement: 'Medium',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    cover: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    stats: { requests: 2, following: 15, likedReels: 5 }
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    status: 'Active',
    date: '24 Apr 2026',
    location: 'HSR Layout, Bangalore',
    engagement: 'Low',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    cover: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=800&q=80',
    stats: { requests: 0, following: 3, likedReels: 120 }
  }
];

export default function UserInfoPage() {
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [activeTab, setActiveTab] = React.useState('requests');
  const { searchQuery, setSearchQuery } = useSearch();

  const filteredData = userData.filter((user) => {
    return user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (selectedUser) {
    return (
      <div className="flex flex-col px-[25px]">
        {/* Deep Dive Header */}
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => setSelectedUser(null)}
            className="flex items-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-600 transition"
          >
            <MdArrowBack className="h-5 w-5" />
            BACK TO CUSTOMERS
          </button>
          <div className="flex gap-2">
            <button className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-100 dark:bg-red-500/10">
              Restrict Access
            </button>
            <button className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600 shadow-lg shadow-brand-500/20">
              Send Notification
            </button>
          </div>
        </div>

        {/* Cinematic Customer Header */}
        <div className="relative mb-6 overflow-hidden rounded-[20px]">
          {/* Cover Image */}
          <div className="h-32 w-full relative">
            <Image src={selectedUser.cover} alt="cover" fill className="object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-navy-800 to-transparent" />
          </div>
          
          <Card extra="relative -mt-12 mx-6 p-6 border-none !bg-white/80 dark:!bg-navy-800/80 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white dark:border-navy-700 shadow-2xl">
                <Image src={selectedUser.avatar} alt={selectedUser.name} fill className="object-cover" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold text-navy-700 dark:text-white leading-tight">{selectedUser.name}</h2>
                <div className="mt-1 flex items-center justify-center md:justify-start gap-2 text-gray-500 dark:text-gray-400 font-bold text-sm tracking-wide">
                  <MdLocationOn className="text-brand-500" />
                  {selectedUser.location.toUpperCase()}
                </div>
                <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="rounded-lg bg-brand-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter text-brand-500">{selectedUser.engagement} ENGAGEMENT</span>
                  <span className="rounded-lg bg-green-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter text-green-500 dark:bg-green-500/10">{selectedUser.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 dark:border-white/5 pt-4 md:pt-0 md:pl-8">
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Requests</p>
                  <p className="text-2xl font-black text-navy-700 dark:text-white">{selectedUser.stats.requests}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Following</p>
                  <p className="text-2xl font-black text-navy-700 dark:text-white">{selectedUser.stats.following}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reels</p>
                  <p className="text-2xl font-black text-navy-700 dark:text-white">{selectedUser.stats.likedReels}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tab System */}
        <div className="mb-6 flex border-b border-gray-200 dark:border-white/10">
          {['requests', 'following', 'interactions', 'cart'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-bold capitalize transition-all ${
                activeTab === tab 
                ? 'border-b-2 border-brand-500 text-brand-500' 
                : 'text-gray-400 hover:text-navy-700 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 gap-6">
          {activeTab === 'requests' && (
            <Card extra="p-6 overflow-hidden">
              <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-6">Buy Requests to Local Shops</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-3 text-xs font-bold uppercase text-gray-400">Shop Name</th>
                      <th className="pb-3 text-xs font-bold uppercase text-gray-400">Product Requested</th>
                      <th className="pb-3 text-xs font-bold uppercase text-gray-400">Date</th>
                      <th className="pb-3 text-xs font-bold uppercase text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { shop: 'Tech Haven', product: 'iPhone 15 Pro Max', date: '02 May 2026', status: 'Pending', icon: <MdPending className="text-orange-500" /> },
                      { shop: 'Urban Style', product: 'Leather Jacket', date: '01 May 2026', status: 'Confirmed', icon: <MdCheckCircle className="text-green-500" /> },
                      { shop: 'Organic Roots', product: 'Weekly Grocery Kit', date: '28 Apr 2026', status: 'Delivered', icon: <MdCheckCircle className="text-blue-500" /> },
                    ].map((req, idx) => (
                      <tr key={idx} className="border-t border-gray-100 dark:border-white/5">
                        <td className="py-4 text-sm font-bold text-navy-700 dark:text-white">{req.shop}</td>
                        <td className="py-4 text-sm font-medium text-gray-600 dark:text-gray-400">{req.product}</td>
                        <td className="py-4 text-sm font-medium text-gray-600 dark:text-gray-400">{req.date}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-1">
                            {req.icon}
                            <span className="text-xs font-bold">{req.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
          {activeTab === 'following' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { name: 'Tech Haven', category: 'Electronics', logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=100&q=80' },
                { name: 'Urban Style', category: 'Fashion', logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=100&q=80' },
                { name: 'Gaming Zone', category: 'Entertainment', logo: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=100&q=80' },
              ].map((shop, idx) => (
                <Card key={idx} extra="p-4 flex flex-row items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-xl relative flex-shrink-0">
                    <Image src={shop.logo} alt={shop.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy-700 dark:text-white">{shop.name}</p>
                    <p className="text-xs font-medium text-gray-400">{shop.category}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {activeTab === 'cart' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Widget icon={<MdShoppingCart className="h-6 w-6"/>} title="Items in Cart" subtitle="4 Items" />
              <Widget icon={<MdFavorite className="h-6 w-6"/>} title="Wishlist Count" subtitle="12 Items" />
              <Widget icon={<MdShoppingCart className="h-6 w-6"/>} title="Cart Value" subtitle="Rs. 12,450" />
            </div>
          )}
          {activeTab === 'interactions' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title: 'Liked Tech Haven Reel', type: 'Like', time: '2 hrs ago' },
                { title: 'Commented on Urban Style Post', type: 'Comment', time: '5 hrs ago' },
                { title: 'Shared Store Opening Reel', type: 'Share', time: 'Yesterday' },
              ].map((log, idx) => (
                <Card key={idx} extra="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MdVideoLibrary className="text-brand-500" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{log.type}</span>
                  </div>
                  <p className="text-sm font-bold text-navy-700 dark:text-white">{log.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{log.time}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-[25px]">
      <div className="mb-[30px] flex flex-col justify-between md:flex-row md:items-center">
        <div>
          <h2 className="text-[22px] font-bold text-navy-700 dark:text-white">Customer Information</h2>
          <p className="mt-[5px] text-sm font-normal text-secondaryGray-600">Overview and management of all registered customers</p>
        </div>

        {/* Inline Search Bar */}
        <div className="md:flex-1 md:max-w-md md:mx-10 mt-[10px] md:mt-0">
          <div className="relative flex items-center h-12 w-full rounded-2xl bg-white px-4 shadow-sm border border-gray-100 dark:bg-navy-800 dark:border-white/5 transition-all focus-within:border-brand-500">
            <MdSearch className="h-5 w-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 w-full bg-transparent text-sm font-bold text-navy-700 outline-none placeholder:text-gray-400 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-[10px] md:mt-0 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-navy-800 border border-gray-100 dark:border-white/5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500"><MdPeople className="h-6 w-6" /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Customers</p>
            <p className="text-xl font-bold text-navy-700 dark:text-white">{filteredData.length}</p>
          </div>
        </div>
      </div>


      <Card extra="w-full h-full sm:overflow-auto px-6 py-6">
        <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
          <table className="w-full">
            <thead>
              <tr className="!border-px !border-gray-400 text-left">
                <th className="border-b border-gray-200 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:border-white/10">Customer Name</th>
                <th className="border-b border-gray-200 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:border-white/10">Email</th>
                <th className="border-b border-gray-200 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:border-white/10">Engagement Status</th>
                <th className="border-b border-gray-200 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:border-white/10 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((user, idx) => (
                <tr key={idx} className="border-b border-gray-50 dark:border-white/5 last:border-none">
                  <td className="py-4 pr-4">
                    <p className="text-sm font-bold text-navy-700 dark:text-white">{user.name}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <p className="text-sm font-medium text-gray-600">{user.email}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="rounded-lg bg-brand-500/10 px-2 py-1 text-xs font-bold text-brand-500">{user.engagement}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-600 shadow-sm"
                      >
                        <MdRemoveRedEye className="h-4 w-4" />
                        VIEW PULSE
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 dark:bg-red-500/10">
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
  );
}
