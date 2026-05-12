'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Card from 'components/card';
import { 
  MdCardMembership, 
  MdRemoveRedEye, 
  MdDelete, 
  MdSearch, 
  MdAdd, 
  MdCheckCircle, 
  MdEdit,
  MdClose,
  MdCloudUpload,
  MdLayers,
  MdPerson,
  MdToggleOn,
  MdToggleOff,
  MdEventNote,
  MdCalendarMonth,
  MdInventory,
  MdCampaign,
  MdPercent,
  MdTimer,
  MdCurrencyRupee,
  MdHistory,
  MdRestore,
  MdArchive,
  MdDeleteForever
} from 'react-icons/md';
import { useSearch } from 'contexts/SearchContext';

export default function SubscriptionHub() {
  const [activeTab, setActiveTab] = useState<'Plans' | 'Subscribers'>('Plans');
  const [plans, setPlans] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>('');
  
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const { searchQuery, setSearchQuery } = useSearch();
  
  const [previewCycle, setPreviewCycle] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [showArchived, setShowArchived] = useState(false);

  const [planFormData, setPlanFormData] = useState({
    name: '',
    price: '',
    billing_cycle: 'Monthly' as 'Monthly' | 'Yearly',
    description: '',
    features: [''],
    product_limit: '',
    currency: 'INR',
    is_active: true
  });

  const [isEditingSubscriber, setIsEditingSubscriber] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<any>(null);
  const [subscriberFormData, setSubscriberFormData] = useState({
    plan_id: '',
    status: '',
    end_date: ''
  });

  const BASE_URL = 'http://192.168.29.178:8000';

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/v1/admin/subscription-plans`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok && (result.status === 200 || result.success)) {
        const plansData = result.data || result;
        setPlans(Array.isArray(plansData) ? plansData : []);
      } else {
        setError(result.message || 'Failed to load plans.');
      }
    } catch (err) {
      setError('Connection to backend failed.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSubscribers = useCallback(async () => {
    setIsLoadingSubscribers(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/v1/admin/seller-subscriptions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok && (result.status === 200 || result.success)) {
        setSubscribers(result.data || []);
      }
    } catch (err) {
      console.error("Subscribers fetch error:", err);
    } finally {
      setIsLoadingSubscribers(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
    fetchSubscribers();
  }, [fetchPlans, fetchSubscribers]);

  const handleUpdateSubscriber = async () => {
    if (!selectedSubscriber) return;
    setIsProcessingId(selectedSubscriber.subscription_id);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/v1/admin/seller-subscriptions/${selectedSubscriber.subscription_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscriberFormData)
      });
      const result = await response.json();
      if (response.ok && (result.status === 200 || result.success)) {
        setIsEditingSubscriber(false);
        fetchSubscribers();
      } else {
        alert(result.message || "Failed to update subscription");
      }
    } catch (err) {
      alert("Network error updating subscription");
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!window.confirm("PERMANENT TERMINATION: This will immediately revoke seller access. Continue?")) return;
    setIsProcessingId(id);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/v1/admin/seller-subscriptions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok && (result.status === 200 || result.success)) {
        fetchSubscribers();
      } else {
        alert(result.message || "Failed to delete subscription");
      }
    } catch (err) {
      alert("Network error deleting subscription");
    } finally {
      setIsProcessingId(null);
    }
  };

  const startEditSubscriber = (sub: any) => {
    setSelectedSubscriber(sub);
    setSubscriberFormData({
      plan_id: plans.find(p => p.name === sub.plan_name)?.id || '',
      status: sub.status || '',
      end_date: sub.end_date ? sub.end_date.split('T')[0] : ''
    });
    setIsEditingSubscriber(true);
  };

  const handleSavePlan = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const method = currentPlan ? 'PUT' : 'POST';
      const endpoint = currentPlan 
        ? `${BASE_URL}/api/v1/admin/subscription-plans/${currentPlan.id}`
        : `${BASE_URL}/api/v1/admin/subscription-plans`;

      const payload = {
        name: planFormData.name,
        price: Number(planFormData.price),
        billing_cycle: planFormData.billing_cycle,
        description: planFormData.description,
        features: planFormData.features.filter(f => f.trim() !== ''),
        product_limit: Number(planFormData.product_limit) || 0,
        currency: planFormData.currency,
        is_active: planFormData.is_active
      };

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (response.ok && (result.status === 200 || result.success)) {
        setIsEditingPlan(false);
        fetchPlans();
      } else {
        alert(result.message || 'Action failed.');
      }
    } catch (err) {
      alert('Network error.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchivePlan = async (id: string) => {
    if (!confirm('ARCHIVE PLAN: This will hide the plan from the website. Continue?')) return;
    setIsProcessingId(id);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/v1/admin/subscription-plans/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok || result.status === 200) {
        fetchPlans(); 
      } else {
        alert(result.message || 'Failed to archive plan.');
      }
    } catch (err) {
      alert('Error connecting to server.');
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleHardDeletePlan = async (id: string) => {
    if (!confirm('PERMANENT WIPE: This action cannot be undone. Continue?')) return;
    setIsProcessingId(id);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/v1/admin/subscription-plans/${id}/hard-delete`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok || result.status === 200) {
        fetchPlans(); 
      } else {
        alert(result.message || 'Failed to delete plan.');
      }
    } catch (err) {
      alert('Error connecting to server.');
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleRestorePlan = async (id: string) => {
    setIsProcessingId(id);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/v1/admin/subscription-plans/${id}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok || result.status === 200) {
        fetchPlans();
      } else {
        alert(result.message || 'Failed to restore plan.');
      }
    } catch (err) {
      alert('Error restoring plan.');
    } finally {
      setIsProcessingId(null);
    }
  };

  const startNewPlan = () => {
    setPlanFormData({ name: '', price: '', billing_cycle: 'Monthly', description: '', features: [''], product_limit: '', currency: 'INR', is_active: true });
    setCurrentPlan(null);
    setIsEditingPlan(true);
  };

  const startEditPlan = (plan: any) => {
    setCurrentPlan(plan);
    setPlanFormData({ 
      name: plan.name || '',
      price: plan.price !== undefined && plan.price !== null ? plan.price.toString() : '',
      billing_cycle: (plan.billing_cycle || 'Monthly') as 'Monthly' | 'Yearly',
      description: plan.description || '',
      features: Array.isArray(plan.features) && plan.features.length > 0 
        ? plan.features.map((f: any) => (f || '').toString()) 
        : [''],
      product_limit: plan.product_limit !== undefined && plan.product_limit !== null ? plan.product_limit.toString() : '0',
      currency: plan.currency || 'INR',
      is_active: plan.is_active ?? true
    });
    setIsEditingPlan(true);
  };

  const handleAddFeature = () => {
    setPlanFormData({ ...planFormData, features: [...planFormData.features, ''] });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...planFormData.features];
    newFeatures[index] = value;
    setPlanFormData({ ...planFormData, features: newFeatures });
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = planFormData.features.filter((_, i) => i !== index);
    setPlanFormData({ ...planFormData, features: newFeatures.length > 0 ? newFeatures : [''] });
  };

  const filteredPlans = plans.filter(p => {
    const matchesCycle = p.billing_cycle === previewCycle;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const visibilityMatch = showArchived ? true : p.is_active === true;
    return matchesCycle && matchesSearch && visibilityMatch;
  });

  return (
    <div className="flex flex-col px-[25px] pb-20 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="mb-8 flex flex-col justify-between md:flex-row md:items-center px-2">
        <div>
          <h2 className="text-[22px] font-bold text-navy-700 dark:text-white uppercase italic tracking-tighter">
            Subscription Management
          </h2>
          <p className="mt-1 text-xs font-medium text-secondaryGray-600">
            Manage and monitor all seller subscription plans and active memberships.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex bg-gray-100 dark:bg-navy-800 p-1 rounded-2xl border border-gray-200 dark:border-white/5">
            <button 
              onClick={() => setActiveTab('Plans')}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'Plans' ? 'bg-white dark:bg-navy-700 text-brand-500 shadow-lg' : 'text-navy-700/40 hover:text-navy-700'}`}
            >
              Subscription Plans
            </button>
            <button 
              onClick={() => setActiveTab('Subscribers')}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'Subscribers' ? 'bg-white dark:bg-navy-700 text-brand-500 shadow-lg' : 'text-navy-700/40 hover:text-navy-700'}`}
            >
              Active Subscriptions
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'Plans' && (
        <div className="animate-in slide-in-from-left duration-500 px-2">
           {/* Plan Header with Cycle & Archive Toggle */}
           <div className="mb-8 flex flex-col lg:flex-row items-center justify-between bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm gap-6">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                 <div>
                    <h3 className="text-lg font-black text-navy-700 italic uppercase tracking-tighter">Plan Management</h3>
                    <p className="text-[11px] text-gray-500 font-medium">Viewing <span className="text-brand-500 font-bold">{showArchived ? 'All' : 'Active'} {previewCycle}</span> strategic rules</p>
                 </div>
                 
                 <div className="flex items-center bg-gray-50 p-1 rounded-2xl border border-gray-100">
                    <button 
                       onClick={() => setPreviewCycle('Monthly')}
                       className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${previewCycle === 'Monthly' ? 'bg-navy-700 text-white shadow-lg' : 'text-navy-700/40'}`}
                    >
                       <MdEventNote className="h-4 w-4" /> Monthly
                    </button>
                    <button 
                       onClick={() => setPreviewCycle('Yearly')}
                       className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${previewCycle === 'Yearly' ? 'bg-brand-500 text-white shadow-lg' : 'text-navy-700/40'}`}
                    >
                       <MdCalendarMonth className="h-4 w-4" /> Yearly
                    </button>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 {/* ARCHIVE TOGGLE */}
                 <div 
                    onClick={() => setShowArchived(!showArchived)}
                    className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-all shadow-sm"
                 >
                    {showArchived ? <MdHistory className="h-4 w-4 text-brand-500" /> : <MdHistory className="h-4 w-4 text-gray-400" />}
                    <span className={`text-[9px] font-black uppercase tracking-widest ${showArchived ? 'text-brand-500' : 'text-gray-400'}`}>
                       {showArchived ? 'Hide Archived' : 'Show Archived'}
                    </span>
                 </div>

                 <button onClick={startNewPlan} className="flex items-center gap-2 bg-brand-500 rounded-xl px-8 py-3 text-[10px] font-black text-white uppercase tracking-widest hover:bg-brand-600 transition-all shadow-xl shadow-brand-500/30 active:scale-95">
                   <MdAdd className="h-4 w-4" /> Add New Plan
                 </button>
              </div>
           </div>

           {error && <div className="mb-8 p-4 bg-red-50 text-red-500 rounded-2xl border border-red-100 text-sm font-bold uppercase italic tracking-widest">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {isLoading && plans.length === 0 ? (
                 Array(3).fill(0).map((_, i) => <div key={i} className="h-[500px] bg-gray-50 rounded-[40px] animate-pulse" />)
               ) : filteredPlans.length === 0 ? (
                 <div className="col-span-full py-32 text-center bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-200">
                    <MdCardMembership className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-sm font-black text-navy-700/30 uppercase tracking-[4px]">No Blueprint Matches Found</p>
                 </div>
               ) : filteredPlans.map((plan) => (
                 <Card key={plan.id} extra={`p-8 rounded-[40px] border-2 ${plan.is_active ? 'border-gray-50 hover:border-brand-500 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_70px_rgba(67,24,255,0.1)]' : 'border-dashed border-gray-200 grayscale opacity-60'} transition-all duration-700 relative group bg-white overflow-hidden flex flex-col h-full max-w-[400px] mx-auto w-full`}>
                    {/* Visual Accents */}
                    <div className="absolute -top-24 -left-24 h-48 w-48 bg-brand-500/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 h-48 w-48 bg-amber-500/5 rounded-full blur-3xl" />

                    {!plan.is_active && (
                      <div className="absolute top-6 right-6 bg-navy-800 text-white text-[8px] font-black uppercase tracking-[3px] px-3 py-1.5 rounded-2xl shadow-xl z-10">
                         OFFLINE
                      </div>
                    )}
                    
                    <div className="mb-8 flex items-start justify-between">
                       <div className={`h-16 w-16 ${plan.is_active ? 'bg-gradient-to-br from-brand-50 to-brand-100/50 text-brand-500 shadow-inner' : 'bg-gray-100 text-gray-400'} rounded-[24px] flex flex-col items-center justify-center transition-transform group-hover:scale-110 duration-500 border border-brand-100/50`}>
                          <span className="text-xl font-black italic tracking-tighter leading-none">{plan.product_limit === 9999 ? '∞' : plan.product_limit}</span>
                          <span className="text-[8px] font-black opacity-40 uppercase tracking-widest mt-1">Products</span>
                       </div>
                       <div className="text-right">
                          <span className="text-[9px] font-black text-brand-500/40 uppercase tracking-[3px] block mb-1">ID: {plan.id?.split('-')[0]}</span>
                          <h4 className="text-2xl font-black text-navy-700 italic uppercase tracking-tighter leading-none">{plan.name}</h4>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mt-2 block italic">/ {plan.billing_cycle}</span>
                       </div>
                    </div>

                    <div className="mb-8">
                       <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-50 text-center relative overflow-hidden group-hover:bg-brand-50/30 transition-colors">
                          <div className="flex items-baseline justify-center gap-2">
                             <span className="text-xl font-black text-brand-500">{plan.currency === 'INR' ? '₹' : '$'}</span>
                             <span className="text-5xl font-black text-navy-700 italic tracking-tighter">{plan.price}</span>
                          </div>
                          <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12 transition-transform group-hover:scale-125 duration-700">
                             <MdCurrencyRupee className="h-24 w-24" />
                          </div>
                       </div>
                    </div>

                    {plan.description && (
                      <p className="mb-6 text-xs font-bold text-gray-500/80 leading-relaxed px-1 text-center">
                         {plan.description}
                      </p>
                    )}

                    {plan.features && plan.features.length > 0 && (
                      <div className="mb-8 space-y-4 px-2 flex-grow">
                         {plan.features.map((feature: string, idx: number) => (
                           <div key={idx} className="flex items-center gap-3 group/item">
                              <div className="h-5 w-5 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0 group-hover/item:bg-brand-500 transition-colors">
                                 <MdCheckCircle className="h-3 w-3 text-brand-500 group-hover/item:text-white" />
                              </div>
                              <p className="text-[10px] font-black text-navy-700/80 uppercase tracking-wider leading-none">{feature}</p>
                           </div>
                         ))}
                      </div>
                    )}

                    <div className="flex gap-3 pt-6 border-t border-gray-100 mt-auto">
                       {plan.is_active ? (
                         <>
                           <button onClick={() => startEditPlan(plan)} className="flex-1 flex items-center justify-center gap-3 h-12 bg-navy-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-navy-800 transition-all shadow-xl shadow-navy-700/10 active:scale-95">
                             <MdEdit className="h-4 w-4" /> Edit
                           </button>
                           <button 
                             onClick={() => handleArchivePlan(plan.id)} 
                             disabled={isProcessingId === plan.id}
                             className="h-12 w-12 flex items-center justify-center bg-gray-50 text-navy-700 rounded-2xl hover:bg-navy-700 hover:text-white transition-all shadow-sm border border-gray-100"
                             title="Archive Plan"
                           >
                              {isProcessingId === plan.id ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-navy-700 border-t-transparent" /> : <MdArchive className="h-5 w-5" />}
                           </button>
                           <button 
                             onClick={() => handleHardDeletePlan(plan.id)} 
                             disabled={isProcessingId === plan.id}
                             className="h-12 w-12 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
                             title="Permanent Wipe"
                           >
                              {isProcessingId === plan.id ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" /> : <MdDeleteForever className="h-6 w-6" />}
                           </button>
                         </>
                       ) : (
                         <>
                           <button 
                             onClick={() => handleRestorePlan(plan.id)}
                             disabled={isProcessingId === plan.id}
                             className="flex-1 flex items-center justify-center gap-3 h-12 bg-brand-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-brand-600 transition-all shadow-2xl shadow-brand-500/20 active:scale-95"
                           >
                             {isProcessingId === plan.id ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <MdRestore className="h-5 w-5" />} Restore
                           </button>
                           <button 
                             onClick={() => handleHardDeletePlan(plan.id)} 
                             disabled={isProcessingId === plan.id}
                             className="h-12 w-12 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
                             title="Permanent Wipe"
                           >
                              {isProcessingId === plan.id ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" /> : <MdDeleteForever className="h-6 w-6" />}
                           </button>
                         </>
                       )}
                    </div>
                 </Card>
               ))}
            </div>
        </div>
      )}

      {/* Subscriber Registry Tab */}
      {activeTab === 'Subscribers' && (
        <div className="animate-in slide-in-from-right duration-500 px-2">
           <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="p-8 text-[10px] font-black text-navy-700/40 uppercase tracking-[3px]">Store Details</th>
                          <th className="p-8 text-[10px] font-black text-navy-700/40 uppercase tracking-[3px]">Plan Type</th>
                          <th className="p-8 text-[10px] font-black text-navy-700/40 uppercase tracking-[3px]">Status</th>
                          <th className="p-8 text-[10px] font-black text-navy-700/40 uppercase tracking-[3px]">Subscription Dates</th>
                          <th className="p-8 text-[10px] font-black text-navy-700/40 uppercase tracking-[3px] text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {isLoadingSubscribers ? (
                          Array(5).fill(0).map((_, i) => (
                             <tr key={i} className="animate-pulse">
                                <td colSpan={5} className="p-8"><div className="h-12 bg-gray-50 rounded-2xl w-full" /></td>
                             </tr>
                          ))
                       ) : subscribers.length === 0 ? (
                          <tr>
                             <td colSpan={5} className="p-20 text-center">
                                <MdPerson className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-[10px] font-black text-navy-700/20 uppercase tracking-[3px]">No Active Subscribers Found</p>
                             </td>
                          </tr>
                       ) : subscribers.map((sub) => (
                          <tr key={sub.subscription_id} className="hover:bg-gray-50/50 transition-colors group">
                             <td className="p-8">
                                <div className="flex flex-col">
                                   <span className="text-sm font-black text-navy-700 italic uppercase">{sub.shop_name}</span>
                                   <span className="text-[9px] font-bold text-gray-400 mt-1">{sub.owner_name}</span>
                                </div>
                             </td>
                             <td className="p-8">
                                <div className="flex flex-col">
                                   <span className="text-xs font-black text-brand-500 uppercase tracking-tighter">{sub.plan_name}</span>
                                   <span className="text-[10px] font-bold text-navy-700/40 mt-1">₹{sub.price}</span>
                                </div>
                             </td>
                             <td className="p-8">
                                <span className={`inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[2px] ${
                                   sub.status?.toLowerCase() === 'active' ? 'bg-green-50 text-green-600' : 
                                   sub.status?.toLowerCase() === 'expired' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                   {sub.status || 'Unknown'}
                                </span>
                             </td>
                             <td className="p-8">
                                <div className="flex flex-col gap-1">
                                   <div className="flex items-center gap-2">
                                      <MdCalendarMonth className="h-3.5 w-3.5 text-gray-300" />
                                      <span className="text-[10px] font-bold text-navy-700/60 uppercase">
                                         {sub.start_date ? new Date(sub.start_date).toLocaleDateString() : 'N/A'}
                                      </span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                      <MdHistory className="h-3.5 w-3.5 text-red-300/40" />
                                      <span className="text-[10px] font-black text-red-500/40 uppercase tracking-widest">
                                         {sub.end_date ? new Date(sub.end_date).toLocaleDateString() : 'LIFETIME / NO EXPIRY'}
                                      </span>
                                   </div>
                                </div>
                             </td>
                             <td className="p-8 text-right">
                                <div className="flex items-center justify-end gap-3">
                                   <button 
                                      onClick={() => startEditSubscriber(sub)}
                                      className="h-10 w-10 flex items-center justify-center bg-navy-700 text-white rounded-xl hover:bg-navy-800 shadow-lg shadow-navy-700/10 transition-all"
                                   >
                                      <MdEdit className="h-4 w-4" />
                                   </button>
                                   <button 
                                      onClick={() => handleDeleteSubscriber(sub.subscription_id)}
                                      className="h-10 w-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                   >
                                      <MdDeleteForever className="h-5 w-5" />
                                   </button>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {/* PLAN ARCHITECT MODAL (The Edit Suite) */}
      {isEditingPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/40 backdrop-blur-md p-4 animate-in fade-in duration-500">
           <Card extra="w-full max-w-3xl p-0 max-h-[90vh] overflow-hidden bg-white shadow-[0_50px_100px_rgba(0,0,0,0.15)] border-none rounded-[40px] relative flex flex-col">
              {/* Header Suite */}
              <div className="bg-navy-700 p-8 flex items-center justify-between relative overflow-hidden">
                 <div className="absolute top-0 right-0 h-64 w-64 bg-brand-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                 <div className="relative z-10">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
                       {currentPlan ? 'Update Plan' : 'Add New Plan'}
                    </h3>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[4px] mt-2 italic">Manage Plan Details</p>
                 </div>
                 <button onClick={() => setIsEditingPlan(false)} className="h-12 w-12 flex items-center justify-center bg-white/10 text-white rounded-2xl hover:bg-red-500 transition-all z-10"><MdClose className="h-6 w-6" /></button>
              </div>

              <div className="p-10 space-y-10 overflow-y-auto flex-grow custom-scrollbar">
                 {/* Section 1: Core Strategy */}
                 <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="h-8 w-1 bg-brand-500 rounded-full" />
                       <h4 className="text-xs font-black text-navy-700 uppercase tracking-[3px] italic">Basic Details</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="group">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Plan Name</label>
                          <input type="text" value={planFormData.name} onChange={(e) => setPlanFormData({...planFormData, name: e.target.value})} className="w-full h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 text-sm font-bold text-navy-700 outline-none focus:border-brand-500 focus:bg-white transition-all shadow-sm" placeholder="e.g. Enterprise Elite" />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Billing Cycle</label>
                          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-2 rounded-2xl border-2 border-gray-100">
                             <button onClick={() => setPlanFormData({...planFormData, billing_cycle: 'Monthly'})} className={`h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${planFormData.billing_cycle === 'Monthly' ? 'bg-navy-700 text-white shadow-lg' : 'text-navy-700/30 hover:text-navy-700'}`}>Monthly</button>
                             <button onClick={() => setPlanFormData({...planFormData, billing_cycle: 'Yearly'})} className={`h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${planFormData.billing_cycle === 'Yearly' ? 'bg-brand-500 text-white shadow-lg' : 'text-navy-700/30 hover:text-navy-700'}`}>Yearly</button>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Section 2: Economics & Limits */}
                 <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="h-8 w-1 bg-amber-500 rounded-full" />
                       <h4 className="text-xs font-black text-navy-700 uppercase tracking-[3px] italic">Pricing & Limits</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Price (INR)</label>
                          <div className="relative">
                             <div className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 bg-brand-50 rounded-lg flex items-center justify-center text-brand-500 font-black">₹</div>
                             <input type="number" value={planFormData.price} onChange={(e) => setPlanFormData({...planFormData, price: e.target.value})} className="w-full h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl pl-16 pr-6 text-sm font-black text-navy-700 outline-none focus:border-brand-500 focus:bg-white transition-all shadow-sm" placeholder="499" />
                          </div>
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Product Limit</label>
                          <div className="relative">
                             <div className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500"><MdInventory className="h-4 w-4" /></div>
                             <input type="number" value={planFormData.product_limit} onChange={(e) => setPlanFormData({...planFormData, product_limit: e.target.value})} className="w-full h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl pl-16 pr-6 text-sm font-black text-navy-700 outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm" placeholder="999" />
                          </div>
                       </div>
                    </div>
                    <div className="mt-8">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Plan Description</label>
                       <textarea value={planFormData.description} onChange={(e) => setPlanFormData({...planFormData, description: e.target.value})} className="w-full h-28 bg-gray-50 border-2 border-gray-100 rounded-[24px] p-6 text-sm font-bold text-navy-700 outline-none focus:border-brand-500 focus:bg-white transition-all shadow-sm resize-none" placeholder="Describe the strategic advantage of this plan..." />
                    </div>
                 </div>

                 {/* Section 3: Value Addons (Features) */}
                 <div className="animate-in slide-in-from-bottom-4 duration-500 delay-200">
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-1 bg-green-500 rounded-full" />
                          <h4 className="text-xs font-black text-navy-700 uppercase tracking-[3px] italic">Plan Features</h4>
                       </div>
                       <button onClick={handleAddFeature} className="flex items-center gap-2 h-10 px-5 bg-navy-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-500 transition-all shadow-lg active:scale-95"><MdAdd className="h-4 w-4" /> Add Feature</button>
                    </div>
                    <div className="space-y-4">
                       {planFormData.features.map((feature, idx) => (
                          <div key={idx} className="flex gap-4 group/item animate-in fade-in slide-in-from-left-4">
                             <div className="flex-1 relative">
                                <MdCheckCircle className={`absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 ${feature ? 'text-brand-500' : 'text-gray-200'}`} />
                                <input type="text" value={feature} onChange={(e) => handleFeatureChange(idx, e.target.value)} className="w-full h-14 bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-6 text-[11px] font-black text-navy-700 uppercase tracking-wider outline-none focus:border-brand-500 focus:bg-white transition-all" placeholder="Feature definition..." />
                             </div>
                             <button onClick={() => handleRemoveFeature(idx)} className="h-14 w-14 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all flex-shrink-0 shadow-sm"><MdClose className="h-6 w-6" /></button>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Section 4: Lifecycle Controls */}
                 <div className="animate-in slide-in-from-bottom-4 duration-500 delay-300 bg-gray-50 p-8 rounded-[32px] border-2 border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                       <h4 className="text-xs font-black text-navy-700 uppercase tracking-[3px] italic mb-1">Plan Status</h4>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Toggle availability in the public market</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-2 rounded-[24px] shadow-sm border border-gray-100">
                       <button onClick={() => setPlanFormData({...planFormData, is_active: true})} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${planFormData.is_active ? 'bg-brand-500 text-white shadow-lg' : 'text-gray-400'}`}>
                          <MdToggleOn className="h-5 w-5" /> Online
                       </button>
                       <button onClick={() => setPlanFormData({...planFormData, is_active: false})} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${!planFormData.is_active ? 'bg-navy-700 text-white shadow-lg' : 'text-gray-400'}`}>
                          <MdToggleOff className="h-5 w-5" /> Archived
                       </button>
                    </div>
                 </div>
              </div>

              {/* Action Suite */}
              <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-4 mt-auto">
                 <button onClick={() => setIsEditingPlan(false)} className="flex-1 h-16 bg-white text-navy-700 border-2 border-gray-100 rounded-2xl text-xs font-black uppercase tracking-[3px] hover:bg-gray-100 transition-all active:scale-95">Cancel</button>
                 <button onClick={handleSavePlan} disabled={isSaving} className="flex-[2] h-16 bg-brand-500 text-white rounded-2xl text-xs font-black uppercase tracking-[3px] shadow-2xl shadow-brand-500/30 hover:bg-brand-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3">
                    {isSaving ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <MdCloudUpload className="h-6 w-6" />}
                    {currentPlan ? 'Update Plan' : 'Create Plan'}
                 </button>
              </div>
           </Card>
        </div>
      )}
      {/* SUBSCRIPTION ARCHITECTURE MODIFIER (Edit Subscriber) */}
      {isEditingSubscriber && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/40 backdrop-blur-md p-4 animate-in fade-in duration-500">
           <Card extra="w-full max-w-xl p-0 max-h-[90vh] overflow-hidden bg-white shadow-[0_50px_100px_rgba(0,0,0,0.15)] border-none rounded-[40px] relative flex flex-col">
              <div className="bg-navy-700 p-10 flex items-center justify-between relative overflow-hidden">
                 <div className="absolute top-0 right-0 h-48 w-48 bg-brand-500/10 rounded-full -mr-10 -mt-10 blur-3xl" />
                 <div className="relative z-10">
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Edit Subscription</h3>
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-[4px] mt-3">Adjusting: {selectedSubscriber?.shop_name}</p>
                 </div>
                 <button onClick={() => setIsEditingSubscriber(false)} className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white hover:text-navy-700 transition-all z-10">
                    <MdClose className="h-6 w-6" />
                 </button>
              </div>

              <div className="p-10 space-y-8 overflow-y-auto flex-grow custom-scrollbar">
                 {/* Plan Selection */}
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-navy-700/40 uppercase tracking-[3px] ml-1">Select New Plan</label>
                    <div className="relative">
                       <MdLayers className="absolute left-5 top-1/2 -translate-y-1/2 text-navy-700/20 h-5 w-5" />
                       <select 
                          value={subscriberFormData.plan_id}
                          onChange={(e) => setSubscriberFormData({ ...subscriberFormData, plan_id: e.target.value })}
                          className="w-full h-14 pl-14 pr-6 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold text-navy-700 focus:border-brand-500 focus:bg-white outline-none transition-all appearance-none"
                       >
                          <option value="">Select Plan</option>
                          {plans.map(p => (
                             <option key={p.id} value={p.id}>{p.name} ({p.currency} {p.price})</option>
                          ))}
                       </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
                    {/* Start Date (Read-only) */}
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-navy-700/30 uppercase tracking-[3px] ml-1">Start Date</label>
                       <div className="h-14 flex items-center gap-4 bg-white px-5 rounded-2xl border border-gray-100 opacity-60">
                          <MdCalendarMonth className="text-navy-700/20 h-5 w-5" />
                          <span className="text-sm font-bold text-navy-700">
                             {selectedSubscriber?.start_date ? new Date(selectedSubscriber.start_date).toLocaleDateString() : 'N/A'}
                          </span>
                       </div>
                    </div>

                    {/* End Date Selection */}
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-brand-500 uppercase tracking-[3px] ml-1">Expiry Date</label>
                       <div className="relative">
                          <MdCalendarMonth className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-500/30 h-5 w-5" />
                          <input 
                             type="date"
                             value={subscriberFormData.end_date}
                             onChange={(e) => setSubscriberFormData({ ...subscriberFormData, end_date: e.target.value })}
                             className="w-full h-14 pl-14 pr-6 bg-white border-2 border-brand-500/20 rounded-2xl text-sm font-bold text-navy-700 focus:border-brand-500 outline-none transition-all shadow-sm"
                          />
                       </div>
                    </div>
                 </div>

                 {/* Status Selection */}
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-navy-700/40 uppercase tracking-[3px] ml-1">Deployment Status</label>
                    <div className="relative">
                       <MdCheckCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-navy-700/20 h-5 w-5" />
                       <select 
                          value={subscriberFormData.status}
                          onChange={(e) => setSubscriberFormData({ ...subscriberFormData, status: e.target.value })}
                          className="w-full h-14 pl-14 pr-6 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold text-navy-700 focus:border-brand-500 focus:bg-white outline-none transition-all appearance-none"
                       >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="EXPIRED">EXPIRED</option>
                          <option value="CANCELED">CANCELED</option>
                          <option value="PENDING">PENDING</option>
                       </select>
                    </div>
                 </div>
              </div>

              {/* Actions */}
              <div className="p-10 pt-0 flex gap-4">
                 <button 
                    onClick={() => setIsEditingSubscriber(false)}
                    className="flex-1 h-16 rounded-[24px] text-xs font-black text-navy-700 uppercase tracking-widest bg-gray-100 hover:bg-gray-200 transition-all active:scale-95"
                 >
                    Discard Changes
                 </button>
                 <button 
                    onClick={handleUpdateSubscriber}
                    disabled={isProcessingId === selectedSubscriber?.subscription_id}
                    className="flex-[2] h-16 rounded-[24px] text-xs font-black text-white uppercase tracking-widest bg-brand-500 hover:bg-brand-600 shadow-xl shadow-brand-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                 >
                    {isProcessingId === selectedSubscriber?.subscription_id ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <MdCloudUpload className="h-6 w-6" />}
                    Confirm Adjustment
                 </button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
