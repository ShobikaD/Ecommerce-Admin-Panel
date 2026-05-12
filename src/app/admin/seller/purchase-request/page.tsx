'use client';

import React from 'react';
import Card from 'components/card';
import { MdShoppingCartCheckout, MdRemoveRedEye, MdDelete, MdTimer, MdArrowForward, MdPriorityHigh, MdChat, MdCheckCircle, MdCancel, MdPayments, MdSearch } from 'react-icons/md';
import Image from 'next/image';
import { useSearch } from 'contexts/SearchContext';

const procurementData = [
  {
    id: 'REQ-5510',
    time: '10:30 AM',
    date: '02 May 2026',
    customer: { name: 'Alice Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&q=80' },
    product: { name: 'iPhone 15 Pro (Blue)', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=100&q=80' },
    shop: { name: 'Tech Haven', logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=50&q=80' },
    urgency: 'High',
    note: 'Need Blue Titanium 256GB specifically.',
    status: 'Sourcing',
    pulse: 2,
    paymentStatus: 'Paid',
    paymentMode: 'UPI',
    paymentDate: '02 May 2026'
  },
  {
    id: 'REQ-6621',
    time: '11:45 AM',
    date: '01 May 2026',
    customer: { name: 'Bob Smith', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=50&q=80' },
    product: { name: 'Leather Messenger Bag', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=100&q=80' },
    shop: { name: 'Urban Style', logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=50&q=80' },
    urgency: 'Medium',
    note: 'Looking for genuine brown leather.',
    status: 'Stock Found',
    pulse: 3,
    paymentStatus: 'Not Paid',
    paymentMode: '-',
    paymentDate: '-'
  },
  {
    id: 'REQ-7732',
    time: '02:15 PM',
    date: '02 May 2026',
    customer: { name: 'Charlie Brown', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&q=80' },
    product: { name: 'Curved Gaming Monitor', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=100&q=80' },
    shop: { name: 'Gaming Zone', logo: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=50&q=80' },
    urgency: 'High',
    note: 'Must have 144Hz refresh rate.',
    status: 'Converted',
    pulse: 4,
    paymentStatus: 'Paid',
    paymentMode: 'Cash on Delivery',
    paymentDate: '03 May 2026'
  },
  {
    id: 'REQ-8843',
    time: '04:00 PM',
    date: '30 Apr 2026',
    customer: { name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=50&q=80' },
    product: { name: 'Organic Honey Set', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=100&q=80' },
    shop: { name: 'Organic Roots', logo: 'https://images.unsplash.com/photo-1466632311177-0355448ce06e?auto=format&fit=crop&w=50&q=80' },
    urgency: 'Low',
    note: 'Just checking prices for bulk order.',
    status: 'Requested',
    pulse: 1,
    paymentStatus: 'Not Paid',
    paymentMode: '-',
    paymentDate: '-'
  },
];

const ProcurementPulse = ({ step }: { step: number }) => {
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
export default function PurchaseRequest() {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const { searchQuery, setSearchQuery } = useSearch();

  const filteredData = procurementData.filter((item) => {
    // 1. Search Filter
    const matchesSearch = 
      item.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Date Filter
    if (!startDate && !endDate) return true;
    
    const reqDate = new Date(item.date);
    reqDate.setHours(0, 0, 0, 0);

    const start = startDate ? new Date(startDate) : null;
    if (start) start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    if (start && end) {
      return reqDate >= start && reqDate <= end;
    } else if (start) {
      return reqDate >= start;
    } else if (end) {
      return reqDate <= end;
    }
    return true;
  });

  return (
    <div className="flex flex-col px-[25px]">
      {/* Header Section */}
      <div className="mb-[30px] flex flex-col justify-between md:flex-row md:items-center">
        <div>
          <h2 className="text-[22px] font-bold text-navy-700 dark:text-white uppercase tracking-tight">
            Procurement & Inquiry Hub
          </h2>
          <p className="mt-[5px] text-sm font-normal text-secondaryGray-600">
            Monitoring customer-to-merchant sourcing requests and business opportunities
          </p>
        </div>

        {/* Inline Search Bar */}
        <div className="md:flex-1 md:max-w-md md:mx-10 mt-[10px] md:mt-0">
          <div className="relative flex items-center h-12 w-full rounded-2xl bg-white px-4 shadow-sm border border-gray-100 dark:bg-navy-800 dark:border-white/5 transition-all focus-within:border-brand-500">
            <MdSearch className="h-5 w-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search inquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 w-full bg-transparent text-sm font-bold text-navy-700 outline-none placeholder:text-gray-400 dark:text-white"
            />
          </div>
        </div>
        <div className="mt-[10px] flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-navy-800 border border-gray-100 dark:border-white/5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
            <MdTimer className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Inquiries</p>
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

      {/* Procurement Registry Card */}
      <Card extra="w-full h-full sm:overflow-auto px-6 py-6">
        <div className="text-xl font-bold text-navy-700 dark:text-white mb-8 border-b border-gray-100 dark:border-white/5 pb-4">
          Special Request Registry
        </div>

        <div className="overflow-x-scroll xl:overflow-x-hidden">
          <table className="w-full">
            <thead>
              <tr className="!border-px !border-gray-400 text-left">
                <th className="border-b border-gray-200 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:border-white/10">Request ID</th>
                <th className="border-b border-gray-200 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:border-white/10">Intent Journey</th>
                <th className="border-b border-gray-200 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:border-white/10">Payment Settlement</th>
                <th className="border-b border-gray-200 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:border-white/10">Inquiry Pulse</th>
                <th className="border-b border-gray-200 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:border-white/10 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((req) => (
                <tr key={req.id} className="border-b border-gray-50 dark:border-white/5 last:border-none hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all">
                  <td className="py-6 pr-4">
                    <p className="text-sm font-black text-navy-700 dark:text-white">{req.id}</p>
                    <p className="text-[10px] font-bold text-brand-500 uppercase">{req.time} | {req.date}</p>
                  </td>
                  <td className="py-6 pr-4">
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full relative border-2 border-white shadow-sm">
                          <Image src={req.customer.avatar} alt="customer" fill className="object-cover" />
                        </div>
                        <MdArrowForward className="text-gray-300 dark:text-white/20 h-4 w-4" />
                        <div className="h-10 w-10 overflow-hidden rounded-lg relative border border-gray-100 dark:border-white/5 shadow-md">
                          <Image src={req.product.img} alt="product" fill className="object-cover" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-black text-navy-700 dark:text-white">{req.customer.name.split(' ')[0]} wants {req.product.name.toUpperCase()}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">Source: {req.shop.name}</p>
                        <div className="mt-1 flex items-center gap-1">
                           <MdChat className="text-gray-300 h-3 w-3" />
                           <p className="text-[10px] font-bold text-gray-400 italic italic line-clamp-1 italic max-w-[200px]">"{req.note}"</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 pr-4">
                    <div className="flex flex-col gap-1.5">
                       <div className={`flex w-fit items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter ${
                          req.paymentStatus === 'Paid' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'
                       }`}>
                          {req.paymentStatus === 'Paid' ? <MdCheckCircle className="h-3 w-3" /> : <MdCancel className="h-3 w-3" />}
                          {req.paymentStatus}
                       </div>
                       {req.paymentStatus === 'Paid' ? (
                         <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                               <MdPayments className="text-gray-400 h-3 w-3" />
                               <p className="text-[10px] font-black text-navy-700 dark:text-white">{req.paymentMode}</p>
                            </div>
                            <p className="text-[9px] font-bold text-gray-400">DATE: {req.paymentDate}</p>
                         </div>
                       ) : (
                         <p className="text-[10px] font-bold text-gray-400 italic tracking-tight">Payment Pending...</p>
                       )}
                    </div>
                  </td>
                  <td className="py-6 pr-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                         <div className={`flex items-center rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter ${
                          req.status === 'Converted' ? 'bg-green-50 text-green-500' : 'bg-brand-50 text-brand-500'
                        }`}>
                          {req.status}
                        </div>
                        {req.urgency === 'High' && (
                          <div className="flex items-center gap-0.5 bg-red-50 text-red-500 px-1.5 py-0.5 rounded-lg text-[9px] font-black">
                             <MdPriorityHigh />
                             HIGH URGENCY
                          </div>
                        )}
                      </div>
                      <ProcurementPulse step={req.pulse} />
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center justify-center gap-2">
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-navy-700 transition hover:bg-gray-200 dark:bg-navy-800 dark:text-white">
                        <MdRemoveRedEye className="h-4 w-4" />
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
