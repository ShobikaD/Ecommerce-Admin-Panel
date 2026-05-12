'use client';

import React from 'react';
import MiniCalendar from 'components/calendar/MiniCalendar';
import WeeklyRevenue from 'components/admin/default/WeeklyRevenue';
import TotalSpent from 'components/admin/default/TotalSpent';
import PieChartCard from 'components/admin/default/PieChartCard';
import { IoMdPerson, IoMdCart, IoMdPricetag } from 'react-icons/io';
import { IoDocuments } from 'react-icons/io5';
import { MdBarChart, MdDashboard, MdOutlineInventory, MdPendingActions, MdSearch } from 'react-icons/md';
import { useSearch } from 'contexts/SearchContext';

import Widget from 'components/widget/Widget';
import CheckTable from 'components/admin/default/CheckTable';
import ComplexTable from 'components/admin/default/ComplexTable';
import DailyTraffic from 'components/admin/default/DailyTraffic';
import TaskCard from 'components/admin/default/TaskCard';

// Mock Data
const ecommerceCheckData = [
  { name: 'Electronics Store', status: 'Approved', date: '02 May 2026', progress: 85 },
  { name: 'Fashion Hub', status: 'Disable', date: '01 May 2026', progress: 45 },
  { name: 'Daily Groceries', status: 'Error', date: '30 Apr 2026', progress: 95 },
  { name: 'Home Comforts', status: 'Approved', date: '28 Apr 2026', progress: 78 },
];

export default function Dashboard() {
  const [activeDashboard, setActiveDashboard] = React.useState<'customer' | 'seller'>('customer');
  const { searchQuery, setSearchQuery } = useSearch();

  // Dashboard Data for Customers
  const customerStats = [
    { name: 'Total Customers', value: '12,450', icon: <IoMdPerson className="h-7 w-7" /> },
    { name: 'Active Users', value: '3,210', icon: <MdBarChart className="h-7 w-7" /> },
    { name: 'Total Orders', value: '45,600', icon: <IoMdCart className="h-7 w-7" /> },
    { name: 'Sales Requests', value: '120', icon: <MdPendingActions className="h-7 w-7" /> },
  ];

  // Dashboard Data for Sellers
  const sellerStats = [
    { name: 'Total Sellers', value: '850', icon: <MdDashboard className="h-7 w-7" /> },
    { name: 'Active Shops', value: '620', icon: <MdOutlineInventory className="h-7 w-7" /> },
    { name: 'Sub. Revenue', value: 'Rs. 2.4M', icon: <IoMdPricetag className="h-7 w-7" /> },
    { name: 'Purchase Req.', value: '45', icon: <IoDocuments className="h-7 w-7" /> },
  ];

  const currentStats = activeDashboard === 'customer' ? customerStats : sellerStats;

  return (
    <div className="flex flex-col px-[25px]">
      {/* Perspective Toggle */}
      <div className="mb-[30px] flex flex-col justify-between md:flex-row md:items-center">
        <div>
          <h2 className="text-[22px] font-bold text-navy-700 dark:text-white capitalize">
            {activeDashboard} Dashboard
          </h2>
          <p className="mt-[5px] text-sm font-normal text-secondaryGray-600">
            Monitoring the heart of your {activeDashboard} ecosystem
          </p>
        </div>

        {/* Inline Search Bar */}
        <div className="md:flex-1 md:max-w-md md:mx-10 mt-[10px] md:mt-0">
          <div className="relative flex items-center h-12 w-full rounded-2xl bg-white px-4 shadow-sm border border-gray-100 dark:bg-navy-800 dark:border-white/5 transition-all focus-within:border-brand-500">
            <MdSearch className="h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search dashboard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 w-full bg-transparent text-sm font-bold text-navy-700 outline-none placeholder:text-gray-400 dark:text-white"
            />
          </div>
        </div>
        
        <div className="mt-4 flex bg-gray-100 dark:bg-navy-800 p-1 rounded-2xl border border-gray-200 dark:border-white/5 shadow-inner md:mt-0">
          <button
            onClick={() => setActiveDashboard('customer')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeDashboard === 'customer' 
              ? 'bg-white dark:bg-brand-500 text-brand-500 dark:text-white shadow-md' 
              : 'text-gray-500 hover:text-navy-700 dark:hover:text-white'
            }`}
          >
            For Customer
          </button>
          <button
            onClick={() => setActiveDashboard('seller')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeDashboard === 'seller' 
              ? 'bg-white dark:bg-brand-500 text-brand-500 dark:text-white shadow-md' 
              : 'text-gray-500 hover:text-navy-700 dark:hover:text-white'
            }`}
          >
            For Seller
          </button>
        </div>
      </div>

      {/* Dynamic Widgets */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {currentStats.map((stat, index) => (
          <Widget
            key={index}
            icon={stat.icon}
            title={stat.name}
            subtitle={stat.value}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        {activeDashboard === 'customer' ? (
          <>
            <TotalSpent />
            <WeeklyRevenue />
          </>
        ) : (
          <>
            <DailyTraffic />
            <PieChartCard />
          </>
        )}
      </div>

      {/* Dynamic Tables & Feed */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div>
          <CheckTable 
            tableData={ecommerceCheckData} 
            title={activeDashboard === 'customer' ? "Recent Customer Activity" : "Recent Seller Activity"} 
          />
        </div>

        <div className="grid grid-cols-1 gap-5">
          {activeDashboard === 'customer' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TaskCard />
              <MiniCalendar />
            </div>
          ) : (
            <ComplexTable 
              tableData={ecommerceCheckData} 
              title="Global Seller Performance" 
            />
          )}
        </div>
      </div>
    </div>
  );
}
