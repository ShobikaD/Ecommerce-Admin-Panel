'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Card from 'components/card';
import { 
  MdPalette, 
  MdVpnKey, 
  MdPayments, 
  MdGroup, 
  MdSave, 
  MdCloudUpload,
  MdColorLens,
  MdContentCopy,
  MdCheckCircle,
  MdErrorOutline,
  MdRotateLeft,
  MdSync,
  MdRefresh,
  MdLocationOn,
  MdGavel,
  MdShield,
  MdSearch,
  MdManageSearch,
  MdVisibility
} from 'react-icons/md';
import Image from 'next/image';
import { useSearch } from 'contexts/SearchContext';

const INITIAL_STATE = {
  branding: {
    siteName: 'Elite Marketplace',
    logo: 'https://images.unsplash.com/photo-1614850523296-d8c1afc3d400?auto=format&fit=crop&w=100&q=80',
    favicon: 'https://images.unsplash.com/photo-1614850523296-d8c1afc3d400?auto=format&fit=crop&w=32&q=80',
    primaryColor: '#4318FF',
    secondaryColor: '#6AD2FF'
  },
  api: {
    baseUrl: 'https://api.yourapp.com',
    imageBaseUrl: 'https://cdn.yourapp.com'
  },
  payment: {
    enabled: true,
    currency: '₹',
    listingFee: 99,
    boostFee: 499,
    commission: 10
  },
  controls: {
    allowRegistration: true,
    allowPosting: true,
    allowReels: true,
    maxProducts: 50,
    maxReelDuration: 60
  },
  location: {
    defaultLocation: 'Bangalore, India',
    enableDetection: true,
    maxDeliveryRadius: 25,
    distanceUnit: 'km',
    enableLocationSearch: true,
    maxSearchRadius: 50
  },
  moderation: {
    enableReportSystem: true,
    maxReportsBeforeFlag: 5,
    autoHideProduct: true,
    autoFlagSeller: true,
    enableContentModeration: true
  },
  search: {
    enableSmartSearch: true,
    enableImageSearch: false,
    defaultSorting: 'distance',
    showOutOfStock: false,
    prioritizeNearby: true,
    maxSearchRadius: 50,
    weights: {
      distance: 50,
      price: 30,
      rating: 20
    }
  }
};

export default function WebSettingsPage() {
  const [activeSection, setActiveSection] = useState('branding');
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  
  // Dynamic State
  const [branding, setBranding] = useState(INITIAL_STATE.branding);
  const [api, setApi] = useState(INITIAL_STATE.api);
  const [payment, setPayment] = useState(INITIAL_STATE.payment);
  const [controls, setControls] = useState(INITIAL_STATE.controls);
  const [location, setLocation] = useState(INITIAL_STATE.location);
  const [moderation, setModeration] = useState(INITIAL_STATE.moderation);
  const [search, setSearch] = useState(INITIAL_STATE.search);

  // Validation State
  const [apiErrors, setApiErrors] = useState({ baseUrl: '', imageBaseUrl: '' });
  
  const totalWeight = useMemo(() => {
    return search.weights.distance + search.weights.price + search.weights.rating;
  }, [search.weights]);

  // Detect Changes
  const hasChanges = useMemo(() => {
    return JSON.stringify({ branding, api, payment, controls, location, moderation, search }) !== JSON.stringify(INITIAL_STATE);
  }, [branding, api, payment, controls, location, moderation, search]);

  // API Validation Logic
  useEffect(() => {
    const validateUrl = (url: string) => url.length > 0 && !url.startsWith('https://') ? 'URL must start with https://' : '';
    setApiErrors({
      baseUrl: validateUrl(api.baseUrl),
      imageBaseUrl: validateUrl(api.imageBaseUrl)
    });
  }, [api]);

  const handleSave = () => {
    if (!hasChanges || totalWeight !== 100) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  const handleReset = () => {
    if (confirm('Reset all fields to default values? This cannot be undone.')) {
      setBranding(INITIAL_STATE.branding);
      setApi(INITIAL_STATE.api);
      setPayment(INITIAL_STATE.payment);
      setControls(INITIAL_STATE.controls);
      setLocation(INITIAL_STATE.location);
      setModeration(INITIAL_STATE.moderation);
      setSearch(INITIAL_STATE.search);
    }
  };

  const sections = [
    { id: 'branding', label: 'Branding', icon: <MdPalette className="h-5 w-5" />, desc: 'Identity & Visuals' },
    { id: 'api', label: 'API Settings', icon: <MdVpnKey className="h-5 w-5" />, desc: 'Keys & Endpoints' },
    { id: 'payment', label: 'Payment Settings', icon: <MdPayments className="h-5 w-5" />, desc: 'Gateways & Config' },
    { id: 'users', label: 'User Controls', icon: <MdGroup className="h-5 w-5" />, desc: 'Roles & Access' },
    { id: 'location', label: 'Location Settings', icon: <MdLocationOn className="h-5 w-5" />, desc: 'Radius & Delivery' },
    { id: 'moderation', label: 'Moderation Settings', icon: <MdGavel className="h-5 w-5" />, desc: 'Safety & Reports' },
    { id: 'search', label: 'Search Settings', icon: <MdManageSearch className="h-5 w-5" />, desc: 'Ranking & Discovery' },
  ];

  return (
    <div className="flex flex-col px-[25px] relative">
      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-10 right-10 z-[100] flex items-center gap-3 rounded-2xl bg-green-500 p-4 text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <MdCheckCircle className="h-6 w-6" />
          <p className="font-bold">Settings synchronized successfully!</p>
        </div>
      )}

      {/* Header */}
      <div className="mb-[30px] flex flex-col justify-between md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
             <h2 className="text-[22px] font-bold text-navy-700 dark:text-white uppercase tracking-tight">
               System Control Center
             </h2>
             {hasChanges && (
               <span className="rounded-full bg-brand-500/10 px-2 py-1 text-[10px] font-black text-brand-500 uppercase animate-pulse">
                 Unsaved Changes
               </span>
             )}
          </div>
          <p className="mt-[5px] text-sm font-normal text-secondaryGray-600">
            Configure core marketplace infrastructure and visual identity
          </p>
        </div>

        {/* Inline Search Bar */}
        <div className="md:flex-1 md:max-w-md md:mx-10 mt-[10px] md:mt-0">
          <div className="relative flex items-center h-12 w-full rounded-2xl bg-white px-4 shadow-sm border border-gray-100 dark:bg-navy-800 dark:border-white/5 transition-all focus-within:border-brand-500">
            <MdSearch className="h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 w-full bg-transparent text-sm font-bold text-navy-700 outline-none placeholder:text-gray-400 dark:text-white"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-[10px]">
          <button 
            onClick={handleReset}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-gray-200 dark:bg-navy-800 dark:text-white"
            title="Reset to Default"
          >
            <MdRefresh className="h-6 w-6" />
          </button>
          <button 
            onClick={handleSave}
            disabled={!hasChanges || isSaving || Object.values(apiErrors).some(e => e) || totalWeight !== 100}
            className={`flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-white transition shadow-lg ${
              !hasChanges || isSaving || Object.values(apiErrors).some(e => e) || totalWeight !== 100
              ? 'bg-gray-300 cursor-not-allowed grayscale'
              : 'bg-brand-500 hover:bg-brand-600 shadow-brand-500/20 active:scale-95'
            }`}
          >
            {isSaving ? <MdSync className="h-5 w-5 animate-spin" /> : <MdSave className="h-5 w-5" />}
            {isSaving ? 'SYNCHRONIZING...' : 'PUBLISH CHANGES'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <Card extra="p-4 h-fit">
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 transition-all ${
                    activeSection === section.id
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                      : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    activeSection === section.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-navy-700'
                  }`}>
                    {section.icon}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-bold ${activeSection === section.id ? 'text-white' : 'text-navy-700 dark:text-white'}`}>
                      {section.label}
                    </p>
                    <p className={`text-[10px] font-medium ${activeSection === section.id ? 'text-white/70' : 'text-gray-400'}`}>
                      {section.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeSection === 'branding' && (
            <Card extra="p-8">
              <div className="mb-8 flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                  <MdPalette className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-navy-700 dark:text-white">Branding & Identity</h3>
              </div>
              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Marketplace Name</label>
                  <input type="text" value={branding.siteName} onChange={(e) => setBranding({...branding, siteName: e.target.value})} className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm font-bold text-navy-700 outline-none transition-all focus:border-brand-500 dark:border-white/10 dark:bg-navy-800 dark:text-white" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Platform Logo</label>
                    <div className="flex flex-col gap-4 rounded-2xl border-2 border-dashed border-gray-100 p-6 dark:border-white/10">
                      <div className="relative h-20 w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-navy-700 border border-gray-100 dark:border-white/5">
                        <Image src={branding.logo} alt="logo" fill className="object-contain p-2" />
                      </div>
                      <div className="flex items-center justify-between">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Recommended: 200x80px (PNG/SVG)</p>
                         <button className="text-xs font-black text-brand-500 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition uppercase tracking-wider">Replace Logo</button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">App Favicon</label>
                    <div className="flex flex-col gap-4 rounded-2xl border-2 border-dashed border-gray-100 p-6 dark:border-white/10">
                      <div className="flex h-20 w-full items-center justify-center rounded-xl bg-gray-50 dark:bg-navy-700 border border-gray-100 dark:border-white/5">
                        <div className="relative h-10 w-10 shadow-lg rounded-md overflow-hidden">
                          <Image src={branding.favicon} alt="favicon" fill className="object-contain" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Recommended: 32x32px (ICO)</p>
                         <button className="text-xs font-black text-brand-500 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition uppercase tracking-wider">Replace Icon</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50/50 dark:bg-white/5 rounded-[20px]">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Primary Theme Color</label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input type="text" value={branding.primaryColor} onChange={(e) => setBranding({...branding, primaryColor: e.target.value})} className="w-full rounded-2xl border border-gray-200 bg-white p-4 pl-12 text-sm font-black text-navy-700 outline-none transition-all focus:border-brand-500 dark:border-white/10 dark:bg-navy-800 dark:text-white" />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full shadow-lg ring-2 ring-white" style={{ backgroundColor: branding.primaryColor }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Secondary Accent Color</label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input type="text" value={branding.secondaryColor} onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})} className="w-full rounded-2xl border border-gray-200 bg-white p-4 pl-12 text-sm font-black text-navy-700 outline-none transition-all focus:border-brand-500 dark:border-white/10 dark:bg-navy-800 dark:text-white" />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full shadow-lg ring-2 ring-white" style={{ backgroundColor: branding.secondaryColor }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'api' && (
            <Card extra="p-8">
              <div className="mb-8 flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                  <MdVpnKey className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-navy-700 dark:text-white">API Core Settings</h3>
              </div>
              <div className="space-y-8">
                {[
                  { key: 'baseUrl', label: 'Base API Endpoint', placeholder: 'https://api.domain.com' },
                  { key: 'imageBaseUrl', label: 'Image Content Delivery (CDN)', placeholder: 'https://cdn.domain.com' }
                ].map((field) => (
                  <div key={field.key} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                       <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">{field.label}</label>
                       {(api as any)[field.key] && (
                         <button 
                            onClick={() => navigator.clipboard.writeText((api as any)[field.key])}
                            className="flex items-center gap-1 text-[10px] font-black text-brand-500 uppercase hover:underline"
                         >
                           <MdContentCopy className="h-3 w-3" /> Copy URL
                         </button>
                       )}
                    </div>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={(api as any)[field.key]} 
                        placeholder={field.placeholder}
                        onChange={(e) => setApi({...api, [field.key]: e.target.value})} 
                        className={`w-full rounded-2xl border bg-white p-4 text-sm font-bold text-navy-700 outline-none transition-all ${
                          (apiErrors as any)[field.key] ? 'border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-brand-500 dark:border-white/10 dark:bg-navy-800 dark:text-white'
                        }`} 
                      />
                      {(apiErrors as any)[field.key] && (
                        <div className="mt-2 flex items-center gap-1 text-red-500">
                           <MdErrorOutline className="h-4 w-4" />
                           <p className="text-xs font-bold">{(apiErrors as any)[field.key]}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="rounded-2xl bg-brand-50 dark:bg-brand-500/10 p-4 flex items-center justify-between border border-brand-100 dark:border-brand-500/20">
                   <div className="flex items-center gap-3">
                      <MdRotateLeft className="h-6 w-6 text-brand-500 animate-spin-slow" />
                      <div>
                         <p className="text-sm font-black text-brand-500 uppercase">Test Connection</p>
                         <p className="text-[10px] text-brand-500/70 font-bold">Validate endpoints against server heartbeat</p>
                      </div>
                   </div>
                   <button className="rounded-xl bg-brand-500 px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest shadow-sm">Test Now</button>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'payment' && (
            <Card extra="p-8">
              <div className="mb-8 flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                  <MdPayments className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-navy-700 dark:text-white">Financial Reconciliation</h3>
              </div>
              <div className="space-y-8">
                <div className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${
                  payment.enabled ? 'bg-brand-50/30 border-brand-100 dark:bg-brand-500/5 dark:border-brand-500/20' : 'bg-gray-50 border-gray-100'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${payment.enabled ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                       <MdPayments className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-navy-700 dark:text-white uppercase tracking-widest">Platform Payments</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{payment.enabled ? 'Live Gateway Operational' : 'Gateway Disabled'}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" checked={payment.enabled} onChange={() => setPayment({...payment, enabled: !payment.enabled})} className="peer sr-only" />
                    <div className="peer h-7 w-12 rounded-full bg-gray-200 after:absolute after:top-[4px] after:left-[4px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 shadow-inner"></div>
                  </label>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${!payment.enabled ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Platform Currency</label>
                    <input type="text" value={payment.currency} onChange={(e) => setPayment({...payment, currency: e.target.value})} className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm font-black text-navy-700 outline-none focus:border-brand-500 dark:bg-navy-800 dark:text-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">System Commission (%)</label>
                    <input type="number" value={payment.commission} onChange={(e) => setPayment({...payment, commission: parseInt(e.target.value)})} className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm font-black text-navy-700 outline-none focus:border-brand-500 dark:bg-navy-800 dark:text-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Default Listing Fee ({payment.currency})</label>
                    <input type="number" value={payment.listingFee} onChange={(e) => setPayment({...payment, listingFee: parseInt(e.target.value)})} className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm font-black text-navy-700 outline-none focus:border-brand-500 dark:bg-navy-800 dark:text-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Global Boost Fee ({payment.currency})</label>
                    <input type="number" value={payment.boostFee} onChange={(e) => setPayment({...payment, boostFee: parseInt(e.target.value)})} className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm font-black text-navy-700 outline-none focus:border-brand-500 dark:bg-navy-800 dark:text-white" />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'users' && (
            <Card extra="p-8">
              <div className="mb-8 flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                  <MdGroup className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-navy-700 dark:text-white">System Permission Logic</h3>
              </div>
              <div className="space-y-10">
                <div>
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-6 border-l-2 border-brand-500 pl-3">Operational Permissions</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { key: 'allowRegistration', label: 'Merchants', desc: 'New Store Creation' },
                      { key: 'allowPosting', label: 'Products', desc: 'Listing Management' },
                      { key: 'allowReels', label: 'Social Reels', desc: 'Video Uploads' },
                    ].map((ctrl) => (
                      <div key={ctrl.key} className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-brand-500/20 transition-all">
                        <div>
                          <p className="text-[11px] font-black text-navy-700 dark:text-white uppercase tracking-tight">{ctrl.label}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">{ctrl.desc}</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" checked={(controls as any)[ctrl.key]} onChange={() => setControls({...controls, [ctrl.key]: !(controls as any)[ctrl.key]})} className="peer sr-only" />
                          <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-6">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-6 border-l-2 border-brand-500 pl-3">Quota & Constraint Constraints</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Merchant Product Quota</label>
                      <div className="relative">
                         <input type="number" value={controls.maxProducts} onChange={(e) => setControls({...controls, maxProducts: parseInt(e.target.value)})} className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm font-black text-navy-700 outline-none focus:border-brand-500 dark:bg-navy-800 dark:text-white" />
                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">Items</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Max Reel Playback Duration</label>
                      <div className="relative">
                         <input type="number" value={controls.maxReelDuration} onChange={(e) => setControls({...controls, maxReelDuration: parseInt(e.target.value)})} className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm font-black text-navy-700 outline-none focus:border-brand-500 dark:bg-navy-800 dark:text-white" />
                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">Seconds</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'location' && (
            <Card extra="p-8">
              <div className="mb-8 flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                  <MdLocationOn className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-navy-700 dark:text-white">Location Intelligence</h3>
              </div>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Default Platform City</label>
                    <input type="text" value={location.defaultLocation} onChange={(e) => setLocation({...location, defaultLocation: e.target.value})} className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm font-black text-navy-700 outline-none focus:border-brand-500 dark:bg-navy-800 dark:text-white" />
                  </div>
                  <div className="flex flex-col justify-end pb-1">
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                      <div>
                        <p className="text-[10px] font-black text-navy-700 dark:text-white uppercase tracking-widest">Auto-Detection</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase italic">Use Browser Geolocation</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" checked={location.enableDetection} onChange={() => setLocation({...location, enableDetection: !location.enableDetection})} className="peer sr-only" />
                        <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-6 border-l-2 border-brand-500 pl-3">Logistics & Range</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Max Delivery Radius</label>
                        <div className="relative">
                           <input type="number" value={location.maxDeliveryRadius} onChange={(e) => setLocation({...location, maxDeliveryRadius: parseInt(e.target.value)})} className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm font-black text-navy-700 outline-none focus:border-brand-500 dark:bg-navy-800 dark:text-white" />
                           <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">{location.distanceUnit}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Distance Metric</label>
                        <select value={location.distanceUnit} onChange={(e) => setLocation({...location, distanceUnit: e.target.value})} className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm font-black text-navy-700 outline-none focus:border-brand-500 dark:bg-navy-800 dark:text-white appearance-none">
                           <option value="km">Kilometers (km)</option>
                           <option value="miles">Miles (mi)</option>
                        </select>
                      </div>
                   </div>
                </div>
                <div>
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-6 border-l-2 border-brand-500 pl-3">Discovery Optimization</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                          <div>
                            <p className="text-[10px] font-black text-navy-700 dark:text-white uppercase tracking-widest">Location-Based Search</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase italic">Prioritize nearby results</p>
                          </div>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input type="checkbox" checked={location.enableLocationSearch} onChange={() => setLocation({...location, enableLocationSearch: !location.enableLocationSearch})} className="peer sr-only" />
                            <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                          </label>
                        </div>
                      </div>
                      <div className={`flex flex-col gap-2 transition-all ${!location.enableLocationSearch ? 'opacity-30 pointer-events-none' : ''}`}>
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Max Search Visibility Radius</label>
                        <div className="relative">
                           <input type="number" value={location.maxSearchRadius} onChange={(e) => setLocation({...location, maxSearchRadius: parseInt(e.target.value)})} className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm font-black text-navy-700 outline-none focus:border-brand-500 dark:bg-navy-800 dark:text-white" />
                           <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">{location.distanceUnit}</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'moderation' && (
            <Card extra="p-8">
              <div className="mb-8 flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                  <MdGavel className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-navy-700 dark:text-white">Moderation & Compliance</h3>
              </div>
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center justify-between p-5 bg-red-50/20 dark:bg-red-500/5 rounded-2xl border border-red-100 dark:border-red-500/20">
                      <div className="flex items-center gap-3">
                         <MdShield className="h-6 w-6 text-red-500" />
                         <div>
                            <p className="text-[10px] font-black text-navy-700 dark:text-white uppercase tracking-widest">Community Report System</p>
                            <p className="text-[9px] text-red-400 font-bold uppercase italic">Enable User-Driven Flagging</p>
                         </div>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" checked={moderation.enableReportSystem} onChange={() => setModeration({...moderation, enableReportSystem: !moderation.enableReportSystem})} className="peer sr-only" />
                        <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-500 peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                      </label>
                    </div>
                  </div>
                  <div className={`flex flex-col gap-2 transition-all ${!moderation.enableReportSystem ? 'opacity-30 pointer-events-none' : ''}`}>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Reports Threshold before Review</label>
                    <div className="relative">
                       <input type="number" value={moderation.maxReportsBeforeFlag} onChange={(e) => setModeration({...moderation, maxReportsBeforeFlag: parseInt(e.target.value)})} className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm font-black text-navy-700 outline-none focus:border-brand-500 dark:bg-navy-800 dark:text-white" />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">Flags</span>
                    </div>
                  </div>
                </div>
                <div>
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-6 border-l-2 border-red-500 pl-3">Automated Safety Actions</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'autoHideProduct', label: 'Auto-Hide Listings', desc: 'Hide items with high reports' },
                      { key: 'autoFlagSeller', label: 'Auto-Flag Merchants', desc: 'Restrict suspicious accounts' },
                    ].map((ctrl) => (
                      <div key={ctrl.key} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${!moderation.enableReportSystem ? 'opacity-30 pointer-events-none' : 'bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/5 hover:border-red-500/20'}`}>
                        <div>
                          <p className="text-[11px] font-black text-navy-700 dark:text-white uppercase tracking-tight">{ctrl.label}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">{ctrl.desc}</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" checked={(moderation as any)[ctrl.key]} onChange={() => setModeration({...moderation, [ctrl.key]: !(moderation as any)[ctrl.key]})} className="peer sr-only" />
                          <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-500 peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-6 border-l-2 border-red-500 pl-3">Content Intelligence</h4>
                   <div className="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                           <MdShield className="h-7 w-7" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-navy-700 dark:text-white uppercase tracking-widest">Global Content Filter</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Restrict sensitive text & media via AI</p>
                        </div>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" checked={moderation.enableContentModeration} onChange={() => setModeration({...moderation, enableContentModeration: !moderation.enableContentModeration})} className="peer sr-only" />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-500 peer-checked:after:translate-x-full dark:bg-gray-700 shadow-inner"></div>
                      </label>
                   </div>
                </div>
              </div>
            </Card>
          )}

          {/* Search Settings Module */}
          {activeSection === 'search' && (
            <Card extra="p-8">
              <div className="mb-8 flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <MdManageSearch className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-navy-700 dark:text-white">Search & Visibility Algorithm</h3>
              </div>
              <div className="space-y-10">
                {/* Search Behavior */}
                <div>
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-6 border-l-2 border-blue-500 pl-3">Search Behavior</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                        <div>
                          <p className="text-[11px] font-black text-navy-700 dark:text-white uppercase tracking-tight">Smart Search</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">Enable AI Ranking Logic</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" checked={search.enableSmartSearch} onChange={() => setSearch({...search, enableSmartSearch: !search.enableSmartSearch})} className="peer sr-only" />
                          <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                        <div>
                          <p className="text-[11px] font-black text-navy-700 dark:text-white uppercase tracking-tight">Image Search</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">Enable Visual Discovery</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" checked={search.enableImageSearch} onChange={() => setSearch({...search, enableImageSearch: !search.enableImageSearch})} className="peer sr-only" />
                          <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                        </label>
                      </div>
                   </div>
                </div>

                {/* Sorting & Visibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Default Result Sorting</label>
                    <select value={search.defaultSorting} onChange={(e) => setSearch({...search, defaultSorting: e.target.value})} className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm font-black text-navy-700 outline-none focus:border-brand-500 dark:bg-navy-800 dark:text-white appearance-none">
                       <option value="distance">Distance (Nearest First)</option>
                       <option value="price_low">Price (Low → High)</option>
                       <option value="price_high">Price (High → Low)</option>
                       <option value="rating">Rating (Highest Rated)</option>
                       <option value="newest">Newest (Recent First)</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-end gap-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                      <p className="text-[10px] font-black text-navy-700 dark:text-white uppercase tracking-widest">Show Out-of-Stock</p>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" checked={search.showOutOfStock} onChange={() => setSearch({...search, showOutOfStock: !search.showOutOfStock})} className="peer sr-only" />
                        <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Radius & Nearby */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                   <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Max Discovery Radius</label>
                    <div className="relative">
                       <input type="number" value={search.maxSearchRadius} onChange={(e) => setSearch({...search, maxSearchRadius: parseInt(e.target.value)})} className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm font-black text-navy-700 outline-none focus:border-brand-500 dark:bg-navy-800 dark:text-white" />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">KM</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                      <div>
                        <p className="text-[10px] font-black text-navy-700 dark:text-white uppercase tracking-widest">Prioritize Nearby</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase italic">Enforce strict location ranking</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" checked={search.prioritizeNearby} onChange={() => setSearch({...search, prioritizeNearby: !search.prioritizeNearby})} className="peer sr-only" />
                        <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Ranking Controls - CORE FEATURE */}
                <div className={`pt-6 transition-all duration-300 ${!search.enableSmartSearch ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
                   <div className="flex items-center justify-between mb-6">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] border-l-2 border-blue-500 pl-3">Ranking Weight Distribution</h4>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${totalWeight === 100 ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500 animate-pulse'}`}>
                         Total: {totalWeight}% {totalWeight !== 100 && ' (Must be 100%)'}
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { key: 'distance', label: 'Distance Weight' },
                      { key: 'price', label: 'Price Weight' },
                      { key: 'rating', label: 'Rating Weight' }
                    ].map((w) => (
                      <div key={w.key} className="flex flex-col gap-2 p-5 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{w.label}</label>
                        <div className="relative">
                           <input 
                              type="number" 
                              value={(search.weights as any)[w.key]} 
                              onChange={(e) => setSearch({...search, weights: {...search.weights, [w.key]: parseInt(e.target.value) || 0}})} 
                              className="w-full bg-transparent border-b-2 border-gray-200 focus:border-blue-500 outline-none text-xl font-black text-navy-700 dark:text-white py-2" 
                           />
                           <span className="absolute right-0 bottom-2 text-sm font-black text-gray-400">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
