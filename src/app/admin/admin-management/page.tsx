'use client';

import React, { useState } from 'react';
import Card from 'components/card';
import { 
  MdPersonAdd, 
  MdAdminPanelSettings, 
  MdSecurity, 
  MdRemoveRedEye, 
  MdEdit, 
  MdDelete,
  MdCheckCircle,
  MdError,
  MdSearch,
  MdGroup
} from 'react-icons/md';
import Image from 'next/image';
import { useSearch } from 'contexts/SearchContext';

const adminTeam = [
  {
    id: 1,
    name: 'Shobi Admin',
    email: 'shobi@platform.com',
    role: 'Super Admin',
    status: 'Active',
    lastActive: '2 mins ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 2,
    name: 'Marcus Aurelius',
    email: 'marcus@platform.com',
    role: 'Moderator',
    status: 'Active',
    lastActive: '1 hour ago',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 3,
    name: 'Jessica Bloom',
    email: 'jessica@platform.com',
    role: 'Manager',
    status: 'Suspended',
    lastActive: '2 days ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 4,
    name: 'David Chen',
    email: 'david@platform.com',
    role: 'Moderator',
    status: 'Active',
    lastActive: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
  }
];

export default function AdminManagement() {
  const { searchQuery, setSearchQuery } = useSearch();
  const [selectedRole, setSelectedRole] = useState('All');

  const filteredAdmins = adminTeam.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         admin.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'All' || admin.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col px-[25px]">
      {/* Header Section */}
      <div className="mb-[30px] flex flex-col justify-between md:flex-row md:items-center">
        <div>
          <h2 className="text-[22px] font-bold text-navy-700 dark:text-white uppercase tracking-tight">
            Administrative Team
          </h2>
          <p className="mt-[5px] text-sm font-normal text-secondaryGray-600">
            Govern platform access and assign hierarchical roles to team members
          </p>
        </div>

        {/* Inline Search Bar */}
        <div className="md:flex-1 md:max-w-md md:mx-10 mt-[10px] md:mt-0">
          <div className="relative flex items-center h-12 w-full rounded-2xl bg-white px-4 shadow-sm border border-gray-100 dark:bg-navy-800 dark:border-white/5 transition-all focus-within:border-brand-500">
            <MdSearch className="h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 w-full bg-transparent text-sm font-bold text-navy-700 outline-none placeholder:text-gray-400 dark:text-white"
            />
          </div>
        </div>

        <button className="mt-[10px] flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-black text-white transition hover:bg-brand-600 active:scale-95 shadow-lg shadow-brand-500/20 uppercase tracking-widest">
          <MdPersonAdd className="h-5 w-5" />
          Invite Admin
        </button>
      </div>

      {/* Stats Grid */}
      <div className="mb-[30px] grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card extra="p-5 flex items-center gap-4 border border-brand-100 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-500 shadow-inner">
            <MdAdminPanelSettings className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Admin Force</p>
            <p className="text-2xl font-black text-navy-700 dark:text-white italic">{adminTeam.length}</p>
          </div>
        </Card>
        <Card extra="p-5 flex items-center gap-4 border border-green-100 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-500 shadow-inner">
            <MdCheckCircle className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Active Sessions</p>
            <p className="text-2xl font-black text-navy-700 dark:text-white italic">3 ONLINE</p>
          </div>
        </Card>
        <Card extra="p-5 flex items-center gap-4 border border-purple-100 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-purple-500 shadow-inner">
            <MdSecurity className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Pending Clearance</p>
            <p className="text-2xl font-black text-navy-700 dark:text-white italic">0 ISSUES</p>
          </div>
        </Card>
      </div>

      {/* Role Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {['All', 'Super Admin', 'Moderator', 'Manager'].map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${
              selectedRole === role 
              ? 'bg-navy-700 text-white shadow-lg' 
              : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Admin Table */}
      <Card extra="w-full h-full px-6 py-6">
        <div className="overflow-x-scroll xl:overflow-x-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-white/10 uppercase tracking-[2px]">
                <th className="pb-4 text-[10px] font-black text-gray-400">Team Member</th>
                <th className="pb-4 text-[10px] font-black text-gray-400">Governance Role</th>
                <th className="pb-4 text-[10px] font-black text-gray-400">System Status</th>
                <th className="pb-4 text-[10px] font-black text-gray-400">Last Pulse</th>
                <th className="pb-4 text-[10px] font-black text-gray-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-50 dark:border-white/5 last:border-none group hover:bg-gray-50/50 transition-all">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-xl border-2 border-gray-100 shadow-sm">
                        <Image src={admin.avatar} alt={admin.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-navy-700 dark:text-white italic">{admin.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-2">
                       <MdSecurity className={`h-4 w-4 ${admin.role === 'Super Admin' ? 'text-red-500' : 'text-brand-500'}`} />
                       <p className="text-xs font-black text-navy-700 dark:text-white uppercase tracking-widest">{admin.role}</p>
                    </div>
                  </td>
                  <td className="py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      admin.status === 'Active' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
                    }`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="py-5">
                    <p className="text-[10px] font-black text-gray-400 uppercase italic">{admin.lastActive}</p>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-500 transition hover:bg-brand-100">
                        <MdEdit className="h-4 w-4" />
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100">
                        <MdDelete className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAdmins.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                     <MdGroup className="mx-auto h-12 w-12 text-gray-200 mb-4" />
                     <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No team members found matching your pulse</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
