'use client';

import React from 'react';
import Card from 'components/card';
import { MdAssignment, MdRemoveRedEye, MdDelete, MdLocalShipping, MdAccountBalanceWallet, MdPayments, MdEventAvailable, MdSearch } from 'react-icons/md';
import Image from 'next/image';
import { useSearch } from 'contexts/SearchContext';

const salesData = [
  {
    id: 'ORD-7721',
    customer: { name: 'James Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=50&q=80' },
    product: { name: 'Enterprise Workstation', img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=100&q=80' },
    shop: { name: 'Tech Haven', logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=50&q=80' },
    amount: 45000.00,
    paymentMethod: 'UPI',
    paymentDate: '02 May 2026',
    status: 'Pending',
    partner: 'Local Express',
    tracking: 1,
    orderDate: '02 May 2026',
    deliveryDate: '07 May 2026'
  },
  {
    id: 'ORD-8832',
    customer: { name: 'Maria Garcia', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&q=80' },
    product: { name: 'Ergonomic Office Chair', img: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=100&q=80' },
    shop: { name: 'Urban Style', logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=50&q=80' },
    amount: 12500.00,
    paymentMethod: 'COD',
    paymentDate: '04 May 2026',
    status: 'Shipped',
    partner: 'BlueDart',
    tracking: 3,
    orderDate: '01 May 2026',
    deliveryDate: '04 May 2026'
  },
  {
    id: 'ORD-9941',
    customer: { name: 'Robert Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&q=80' },
    product: { name: 'Mechanical Keyboard G-Pro', img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=100&q=80' },
    shop: { name: 'Gaming Zone', logo: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=50&q=80' },
    amount: 8999.00,
    paymentMethod: 'UPI',
    paymentDate: '02 May 2026',
    status: 'Accepted',
    partner: 'Delhivery',
    tracking: 2,
    orderDate: '02 May 2026',
    deliveryDate: '06 May 2026'
  },
  {
    id: 'ORD-4412',
    customer: { name: 'Linda Ross', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=50&q=80' },
    product: { name: 'Wireless Smart Projector', img: 'https://images.unsplash.com/photo-1535016120720-40c646bebbfc?auto=format&fit=crop&w=100&q=80' },
    shop: { name: 'Tech Haven', logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=50&q=80' },
    amount: 24999.00,
    paymentMethod: 'UPI',
    paymentDate: '30 Apr 2026',
    status: 'Delivered',
    partner: 'Local Courier',
    tracking: 4,
    orderDate: '30 Apr 2026',
    deliveryDate: '02 May 2026'
  },
];

const TrackingPulse = ({ step }: { step: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4].map((i) => (
        <React.Fragment key={i}>
          <div className={`h-2 w-2 rounded-full ${i <= step ? (step === 4 ? 'bg-green-500' : 'bg-brand-500') : 'bg-gray-200 dark:bg-navy-700'}`} />
          {i < 4 && <div className={`h-[2px] w-4 ${i < step ? (step === 4 ? 'bg-green-500' : 'bg-brand-500') : 'bg-gray-200 dark:bg-navy-700'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
};
export default function SalesRequest() {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const { searchQuery, setSearchQuery } = useSearch();

  const filteredData = salesData.filter((item) => {
    // 1. Search Filter
    const matchesSearch = 
      item.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Date Filter
    if (!startDate && !endDate) return true;
    
    const orderDate = new Date(item.orderDate);
    orderDate.setHours(0, 0, 0, 0);

    const start = startDate ? new Date(startDate) : null;
    if (start) start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    if (start && end) {
      return orderDate >= start && orderDate <= end;
    } else if (start) {
      return orderDate >= start;
    } else if (end) {
      return orderDate <= end;
    }
    return true;
  });

  return (
    <div className="flex flex-col px-[25px]">
      {/* Header Section */}
      <div className="mb-[30px] flex flex-col justify-between md:flex-row md:items-center">
        <div>
          <h2 className="text-[22px] font-bold text-navy-700 dark:text-white uppercase tracking-tight">
            Sales & Settlement Hub
          </h2>
          <p className="mt-[5px] text-sm font-normal text-secondaryGray-600">
            Fulfillment tracking and detailed financial reconciliation
          </p>
        </div>

        {/* Inline Search Bar */}
        <div className="md:flex-1 md:max-w-md md:mx-10 mt-[10px] md:mt-0">
          <div className="relative flex items-center h-12 w-full rounded-2xl bg-white px-4 shadow-sm border border-gray-100 dark:bg-navy-800 dark:border-white/5 transition-all focus-within:border-brand-500">
            <MdSearch className="h-5 w-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search sales..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 w-full bg-transparent text-sm font-bold text-navy-700 outline-none placeholder:text-gray-400 dark:text-white"
            />
          </div>
        </div>
        <div className="mt-[10px] flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-navy-800 border border-gray-100 dark:border-white/5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
            <MdLocalShipping className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Shipments</p>
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
            className="mt-5 text-sm font-bold text-red-500 hover:text-red-600 transition-all uppercase tracking-widest"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Main Table Card */}
      <Card extra="w-full h-full sm:overflow-auto px-6 py-6">
        <div className="text-xl font-bold text-navy-700 dark:text-white mb-8 border-b border-gray-100 dark:border-white/5 pb-4">
          Order Processing Registry
        </div>

        <div className="overflow-x-scroll xl:overflow-x-hidden">
          <table className="w-full">
            <thead>
              <tr className="!border-px !border-gray-400 text-left">
                <th className="border-b border-gray-200 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:border-white/10">Lifecycle</th>
                <th className="border-b border-gray-200 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:border-white/10">Customer</th>
                <th className="border-b border-gray-200 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:border-white/10">Fulfillment</th>
                <th className="border-b border-gray-200 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:border-white/10">Financials</th>
                <th className="border-b border-gray-200 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:border-white/10">Logistics</th>
                <th className="border-b border-gray-200 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:border-white/10 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 dark:border-white/5 last:border-none hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all">
                  <td className="py-6 pr-4">
                    <p className="text-sm font-black text-navy-700 dark:text-white">{order.id}</p>
                    <div className="mt-1 flex flex-col gap-0.5">
                       <p className="text-[9px] font-bold text-gray-400">PLACED: {order.orderDate}</p>
                       <p className="text-[9px] font-bold text-brand-500">EST: {order.deliveryDate}</p>
                    </div>
                  </td>
                  <td className="py-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full relative border border-gray-100 dark:border-white/5 shadow-sm">
                        <Image src={order.customer.avatar} alt="customer" fill className="object-cover" />
                      </div>
                      <p className="text-sm font-bold text-navy-700 dark:text-white">{order.customer.name}</p>
                    </div>
                  </td>
                  <td className="py-6 pr-4">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-xl relative border border-gray-100 dark:border-white/5 shadow-md flex-shrink-0">
                        <Image src={order.product.img} alt="product" fill className="object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-black text-navy-700 dark:text-white leading-tight">{order.product.name}</p>
                        <div className="mt-2 flex items-center gap-1.5">
                           <div className="h-5 w-5 overflow-hidden rounded-full relative border border-gray-100 dark:border-white/10">
                              <Image src={order.shop.logo} alt="shop" fill className="object-cover" />
                           </div>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Sourced From: <span className="text-navy-700 dark:text-white">{order.shop.name}</span></p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 pr-4">
                    <p className="text-sm font-black text-navy-700 dark:text-white">Rs. {order.amount.toLocaleString()}</p>
                    <div className="mt-2 flex flex-col gap-1">
                       <div className="flex items-center gap-1">
                          <MdPayments className="text-gray-400 h-3 w-3" />
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${order.paymentMethod === 'UPI' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>{order.paymentMethod}</span>
                       </div>
                       <div className="flex items-center gap-1">
                          <MdEventAvailable className="text-gray-400 h-3 w-3" />
                          <p className="text-[9px] font-bold text-gray-400">Paid: {order.paymentDate}</p>
                       </div>
                    </div>
                  </td>
                  <td className="py-6 pr-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                         <div className={`flex items-center rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter ${
                          order.status === 'Pending' ? 'bg-orange-50 text-orange-500' :
                          order.status === 'Delivered' ? 'bg-green-50 text-green-500' : 'bg-brand-50 text-brand-500'
                        }`}>
                          {order.status}
                        </div>
                        <span className="text-[9px] font-black text-gray-400 italic">via {order.partner}</span>
                      </div>
                      <TrackingPulse step={order.tracking} />
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center justify-center gap-2">
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-navy-700 transition hover:bg-gray-200 dark:bg-navy-800 dark:text-white">
                        <MdRemoveRedEye className="h-4 w-4" />
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500 transition hover:bg-brand-500/20">
                        <MdAssignment className="h-4 w-4" />
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100">
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
