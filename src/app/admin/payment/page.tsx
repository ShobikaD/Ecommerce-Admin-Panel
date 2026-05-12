'use client';
import React, { useState } from 'react';
import Card from 'components/card';
import { MdPayment, MdCheckCircle, MdPending, MdError, MdFileDownload } from 'react-icons/md';
import { useSearch } from 'contexts/SearchContext';

const paymentData = [
  { id: 'TRX-9821', shop: 'Tech Haven', customer: 'Alice Johnson', date: '02 May 2026', amount: 1250, settlement: 1125, commission: 125, status: 'Success', method: 'UPI' },
  { id: 'TRX-9822', shop: 'Urban Style', customer: 'Bob Smith', date: '01 May 2026', amount: 450, settlement: 405, commission: 45, status: 'Pending', method: 'Card' },
  { id: 'TRX-9823', shop: 'Gaming Zone', customer: 'Charlie Brown', date: '30 Apr 2026', amount: 2999, settlement: 2699, commission: 300, status: 'Success', method: 'Net Banking' },
  { id: 'TRX-9824', shop: 'Organic Roots', customer: 'David Wilson', date: '29 Apr 2026', amount: 1250, settlement: 1125, commission: 125, status: 'Failed', method: 'UPI' },
  { id: 'TRX-9825', shop: 'Home Comforts', customer: 'Eva Garcia', date: '28 Apr 2026', amount: 450, settlement: 405, commission: 45, status: 'Success', method: 'Card' },
];

export default function PaymentPage() {
  const { searchQuery } = useSearch();

  const filteredData = paymentData.filter(item => 
    item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.shop.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col px-[25px]">
      {/* Header & Stats */}
      <div className="mb-[30px] flex flex-col justify-between md:flex-row md:items-center">
        <div>
          <h2 className="text-[22px] font-bold text-navy-700 dark:text-white">
            Payment Management
          </h2>
          <p className="mt-[5px] text-sm font-normal text-secondaryGray-600">
            Monitor and track all financial transactions across the platform
          </p>
        </div>
        <button className="mt-[10px] flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-600 active:bg-brand-700">
          <MdFileDownload className="h-5 w-5" />
          Export Reports
        </button>
      </div>

      {/* Payment Stats */}
      <div className="mb-[30px] grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card extra="p-5 flex items-center gap-4 border border-green-100 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-500 dark:bg-green-500/10 shadow-inner">
            <MdCheckCircle className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Commission</p>
            <p className="text-2xl font-black text-navy-700 dark:text-white italic">Rs. 14,250</p>
          </div>
        </Card>
        <Card extra="p-5 flex items-center gap-4 border border-amber-100 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-500/10 shadow-inner">
            <MdPending className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Settlements</p>
            <p className="text-2xl font-black text-navy-700 dark:text-white italic">Rs. 8,400</p>
          </div>
        </Card>
        <Card extra="p-5 flex items-center gap-4 border border-brand-100 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/10 shadow-inner">
            <MdPayment className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Merchant Disbursed</p>
            <p className="text-2xl font-black text-navy-700 dark:text-white italic">Rs. 62,500</p>
          </div>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card extra="w-full h-full px-6 py-6">
        <div className="text-xl font-bold text-navy-700 dark:text-white mb-6">
          Recent Transactions
        </div>
        <div className="overflow-x-scroll xl:overflow-x-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-white/10 uppercase tracking-widest">
                <th className="pb-4 text-[10px] font-black text-gray-400">Audit ID</th>
                <th className="pb-4 text-[10px] font-black text-gray-400">Merchant Shop</th>
                <th className="pb-4 text-[10px] font-black text-gray-400">Settlement Split</th>
                <th className="pb-4 text-[10px] font-black text-gray-400 text-center">Status</th>
                <th className="pb-4 text-[10px] font-black text-gray-400">Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 dark:border-white/5 last:border-none group hover:bg-gray-50/50 transition-all">
                  <td className="py-5">
                    <p className="text-sm font-black text-navy-700 dark:text-white">{item.id}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{item.date}</p>
                  </td>
                  <td className="py-5">
                    <p className="text-sm font-black text-navy-700 dark:text-white uppercase tracking-tighter italic">{item.shop}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">FROM: {item.customer}</p>
                  </td>
                  <td className="py-5">
                    <div className="flex gap-4">
                       <div className="flex flex-col">
                          <p className="text-xs font-black text-green-600">Rs. {item.settlement}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Payout</p>
                       </div>
                       <div className="flex flex-col">
                          <p className="text-xs font-black text-brand-500">Rs. {item.commission}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Fee</p>
                       </div>
                    </div>
                  </td>
                  <td className="py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                      item.status === 'Success' ? 'bg-green-100 text-green-500' :
                      item.status === 'Pending' ? 'bg-amber-100 text-amber-500' :
                      'bg-red-100 text-red-500'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-1.5">
                       <div className="h-1.5 w-1.5 rounded-full bg-brand-500"></div>
                       <p className="text-[10px] font-black text-navy-700 dark:text-white uppercase">{item.method}</p>
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
