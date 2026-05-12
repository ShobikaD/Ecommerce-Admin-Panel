'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Card from 'components/card';
import { 
  MdStore, 
  MdRemoveRedEye, 
  MdArrowBack, 
  MdVerified, 
  MdError, 
  MdSearch,
  MdLocationOn,
  MdEdit,
  MdClose,
  MdInventory,
  MdHistory,
  MdStars,
  MdGavel,
  MdPerson,
  MdCloudUpload,
  MdEvent,
  MdBlock,
  MdDeleteForever,
  MdLockOpen,
  MdArrowForward
} from 'react-icons/md';
import { useSearch } from 'contexts/SearchContext';

export default function SellerInfo() {
  const { searchQuery, setSearchQuery } = useSearch();
  const [sellers, setSellers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const BASE_URL = 'http://192.168.29.178:8000';

  const formatJoinDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const fetchSellers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: searchQuery
      });

      if (startDate) queryParams.append('start_date', startDate);
      if (endDate) queryParams.append('end_date', endDate);

      const response = await fetch(`${BASE_URL}/api/v1/admin/sellers?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setSellers(result.data || []);
        setTotalRecords(result.pagination?.total || 0);
      } else {
        setError(result.message || 'Could not load sellers.');
      }
    } catch (err) {
      setError('Connection error.');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchQuery, startDate, endDate]);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const handleUpdateSeller = async (statusOverride?: string) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const payload = {
        shop_name: editFormData.shop_name,
        owner_name: editFormData.owner_name,
        gstin_no: editFormData.gstin_no,
        pan_no: editFormData.pan_no,
        kyc_status: statusOverride || editFormData.kyc_status,
        is_active: editFormData.is_active,
        city: editFormData.city,
        state: editFormData.state,
        pincode: editFormData.pincode,
        address_line_1: editFormData.address_line_1,
        address_line_2: editFormData.address_line_2,
        landmark: editFormData.landmark
      };

      const response = await fetch(`${BASE_URL}/api/v1/admin/sellers/${selectedSeller.seller_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (response.ok && (result.success || result.status === 200)) {
        const updatedData = result.data || { ...selectedSeller, ...payload };
        setSelectedSeller(updatedData);
        setIsEditing(false);
        setHasChanges(false);
        fetchSellers();
      } else {
        alert(result.message || 'Failed to update.');
      }
    } catch (err) {
      alert('Error updating information.');
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = () => {
    setEditFormData({ ...selectedSeller });
    setIsEditing(true);
    setHasChanges(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setHasChanges(false);
    setEditFormData({});
  };

  const handleInputChange = (field: string, value: any) => {
    setEditFormData({ ...editFormData, [field]: value });
    setHasChanges(true);
  };

  const updateSellerStatus = async (sellerId: string, updates: { kyc_status?: string, is_active?: boolean }) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/v1/admin/sellers/${sellerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      const result = await response.json();
      if (response.ok && (result.success || result.status === 200)) {
        setSelectedSeller(prev => ({ ...prev, ...updates }));
        fetchSellers();
      } else {
        alert(result.message || 'Update failed.');
      }
    } catch (err) {
      alert('Network error.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuspendToggle = async (sellerId: string) => {
    const actionLabel = selectedSeller.is_active ? 'SUSPEND' : 'ACTIVATE';
    if (!confirm(`Are you sure you want to ${actionLabel.toLowerCase()} this shop?`)) return;
    updateSellerStatus(sellerId, { is_active: !selectedSeller.is_active });
  };

  const handleBlockToggle = async (sellerId: string) => {
    const isBlocked = selectedSeller.kyc_status === 'REJECTED';
    const actionLabel = isBlocked ? 'UNBLOCK' : 'BLOCK';
    if (!confirm(`Are you sure you want to ${actionLabel} this shop?`)) return;
    const status = isBlocked ? 'PENDING' : 'REJECTED';
    updateSellerStatus(sellerId, { kyc_status: status });
  };

  const handleApproveKYC = async (sellerId: string) => {
    if (!confirm('Are you sure you want to APPROVE this shop?')) return;
    updateSellerStatus(sellerId, { kyc_status: 'APPROVED', is_active: true });
  };

  const handlePermanentDelete = async (sellerId: string) => {
    if (!confirm('CRITICAL: PERMANENTLY DELETE this shop from the database? This action is irreversible.')) return;
    const confirmation = prompt(`Type "${selectedSeller.shop_name}" to confirm:`);
    if (confirmation?.trim() !== selectedSeller.shop_name.trim()) {
      alert('Confirmation failed. Shop name does not match.');
      return;
    }
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/v1/admin/sellers/${sellerId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.status === 204 || response.ok) {
        alert('Shop deleted permanently.');
        setSelectedSeller(null);
        fetchSellers();
        return;
      }

      const result = await response.json();
      alert(result.message || 'Delete failed.');
    } catch (err) {
      console.error('Delete error:', err);
      // If we're here, it might be a 204 that fetch tried to parse as JSON or a network error
      alert('Action completed or network error. Please check the list.');
      setSelectedSeller(null);
      fetchSellers();
    } finally {
      setIsSaving(false);
    }
  };

  if (selectedSeller) {
    return (
      <div className="flex flex-col px-[25px] pb-40 relative overflow-hidden">
        {/* Header (Uniform Button Shapes) */}
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => { setSelectedSeller(null); cancelEditing(); setActiveTab('Overview'); }} className="flex items-center gap-2 text-base font-bold text-brand-500 hover:text-brand-600 transition"><MdArrowBack className="h-5 w-5" />Back to List</button>
          
          <div className="flex flex-wrap items-center gap-4">
            {!isEditing ? (
              <button onClick={startEditing} className="h-10 flex items-center gap-2 rounded-xl bg-brand-500 px-6 text-xs font-black text-white uppercase tracking-widest transition hover:bg-brand-600 shadow-lg shadow-brand-500/20">
                <MdEdit className="h-4 w-4" /> Edit Profile
              </button>
            ) : (
              <button onClick={cancelEditing} className="h-10 flex items-center gap-2 rounded-xl bg-gray-100 px-6 text-xs font-black text-navy-700 uppercase tracking-widest transition hover:bg-gray-200">
                <MdClose className="h-4 w-4" /> Exit Edit
              </button>
            )}

            {/* UNIFORM ACTION GROUP */}
            <div className="flex items-center gap-2 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100">
              {selectedSeller.kyc_status === 'PENDING' && (
                <button onClick={() => handleApproveKYC(selectedSeller.seller_id)} className="h-10 flex items-center gap-2 rounded-xl bg-green-500 px-6 text-[10px] font-black text-white uppercase tracking-[2px] transition hover:bg-green-600">
                  <MdVerified className="h-4 w-4" /> Approve Shop
                </button>
              )}

              <button onClick={() => handleSuspendToggle(selectedSeller.seller_id)} className="h-10 flex items-center justify-center rounded-xl bg-navy-700 px-6 text-[10px] font-black text-white uppercase tracking-[2px] transition hover:bg-navy-800">
                {selectedSeller.is_active ? 'Suspend' : 'Activate'}
              </button>
              
              <button onClick={() => handleBlockToggle(selectedSeller.seller_id)} className="h-10 flex items-center gap-2 rounded-xl bg-amber-500 px-6 text-[10px] font-black text-white uppercase tracking-[2px] transition hover:bg-amber-600">
                {selectedSeller.kyc_status === 'REJECTED' ? <><MdLockOpen className="h-4 w-4" /> Unblock</> : <><MdBlock className="h-4 w-4" /> Block</>}
              </button>

              <button onClick={() => handlePermanentDelete(selectedSeller.seller_id)} className="h-10 flex items-center gap-2 rounded-xl bg-red-500 px-6 text-[10px] font-black text-white uppercase tracking-[2px] transition hover:bg-red-600">
                <MdDeleteForever className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <Card extra={`p-8 mb-8 border transition-all duration-500 ${isEditing ? 'border-brand-500 shadow-xl bg-brand-50/5' : 'border-gray-100 shadow-sm'}`}>
          <div className="flex flex-col xl:flex-row items-center justify-between gap-10">
            <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
              <div className="relative h-28 w-28 rounded-3xl border-4 border-gray-50 flex items-center justify-center bg-brand-50"><MdStore className="h-12 w-12 text-brand-500" /></div>
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  {!isEditing ? <h2 className="text-4xl font-black text-navy-700 tracking-tighter italic uppercase">{selectedSeller.shop_name}</h2> : <input type="text" value={editFormData.shop_name} onChange={(e) => handleInputChange('shop_name', e.target.value)} className="text-4xl font-black text-brand-500 tracking-tighter italic uppercase bg-transparent border-b-2 border-brand-500 outline-none w-full max-w-md" />}
                  {selectedSeller.kyc_status === 'APPROVED' ? <MdVerified className="text-blue-500 h-8 w-8" /> : selectedSeller.kyc_status === 'REJECTED' ? <MdBlock className="text-red-500 h-8 w-8" /> : <MdError className="text-orange-500 h-8 w-8" />}
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <div className="bg-brand-50 px-3 py-1 rounded-lg border border-brand-100 flex items-center gap-2"><span className="text-[10px] font-black text-navy-700/40 uppercase tracking-widest">Shop Token:</span><span className="text-xs font-black text-brand-500 uppercase tracking-[2px]">{selectedSeller.seller_id.split('-')[0]}</span></div>
                  <div className="flex items-center gap-2 text-navy-700/60 font-bold text-[10px] uppercase tracking-[2px]"><MdEvent className="h-4 w-4 text-brand-500" />Joined On {formatJoinDate(selectedSeller.join_date)}</div>
                </div>
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${selectedSeller.kyc_status === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-200' : selectedSeller.kyc_status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>Status: {selectedSeller.kyc_status}</span></div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
               <div className="flex flex-col items-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100 w-32"><p className="text-[10px] font-black text-navy-700/60 uppercase tracking-widest mb-1">Total Products</p><p className="text-2xl font-black text-navy-700 italic">12</p></div>
               <div className="flex flex-col items-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100 w-32"><p className="text-[10px] font-black text-navy-700/60 uppercase tracking-widest mb-1">Total Sales</p><p className="text-2xl font-black text-navy-700 italic">45</p></div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-100 mb-8 px-2 overflow-x-auto no-scrollbar">
           {['Overview', 'Products', 'Subscription', 'Sales History'].map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-xs font-black uppercase tracking-[3px] relative transition-all ${activeTab === tab ? 'text-brand-500' : 'text-navy-700/60 hover:text-navy-700'}`}>{tab}{activeTab === tab && <div className="absolute bottom-0 left-0 h-1 w-full bg-brand-500 rounded-full animate-in slide-in-from-left duration-300" />}</button>
           ))}
        </div>

        {/* Content */}
        <div className="animate-in fade-in duration-500">
           {activeTab === 'Overview' && (
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card extra={`lg:col-span-3 p-8 border transition-all ${isEditing ? 'border-brand-200 bg-brand-50/5' : 'border-gray-100'}`}><div className="flex items-center gap-3 mb-8"><MdGavel className="h-5 w-5 text-brand-500" /><h4 className="text-sm font-black text-navy-700 uppercase tracking-widest italic">GST & PAN Details</h4></div><div className="space-y-8"><div><p className="text-[10px] font-black text-navy-700/60 uppercase tracking-widest mb-2">GST Number</p>{!isEditing ? <p className="text-base font-bold text-navy-700 italic uppercase tracking-tighter">{selectedSeller.gstin_no || 'Not Provided'}</p> : <input type="text" value={editFormData.gstin_no} onChange={(e) => handleInputChange('gstin_no', e.target.value)} className="w-full bg-white border border-gray-100 rounded-xl p-4 text-sm font-bold text-brand-500 outline-none" />}</div><div><p className="text-[10px] font-black text-navy-700/60 uppercase tracking-widest mb-2">PAN Number</p>{!isEditing ? <p className="text-base font-bold text-navy-700 italic uppercase tracking-tighter">{selectedSeller.pan_no || 'Not Provided'}</p> : <input type="text" value={editFormData.pan_no} onChange={(e) => handleInputChange('pan_no', e.target.value)} className="w-full bg-white border border-gray-100 rounded-xl p-4 text-sm font-bold text-brand-500 outline-none" />}</div></div></Card>
                <Card extra={`lg:col-span-6 p-8 border transition-all ${isEditing ? 'border-brand-200 bg-brand-50/5' : 'border-gray-100'}`}><div className="flex items-center gap-3 mb-8"><MdLocationOn className="h-5 w-5 text-green-500" /><h4 className="text-sm font-black text-navy-700 uppercase tracking-widest italic">Store Address</h4></div><div className="grid grid-cols-2 gap-6"><div className="col-span-2"><p className="text-[10px] font-black text-navy-700/60 uppercase tracking-widest mb-1">Address Line 1</p>{!isEditing ? <p className="text-sm font-bold text-navy-700 italic">{selectedSeller.address_line_1 || 'N/A'}</p> : <input type="text" value={editFormData.address_line_1} onChange={(e) => handleInputChange('address_line_1', e.target.value)} className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm font-bold text-brand-500 outline-none" />}</div><div className="col-span-2"><p className="text-[10px] font-black text-navy-700/60 uppercase tracking-widest mb-1">Area / Street</p>{!isEditing ? <p className="text-sm font-bold text-navy-700 italic">{selectedSeller.address_line_2 || 'N/A'}</p> : <input type="text" value={editFormData.address_line_2} onChange={(e) => handleInputChange('address_line_2', e.target.value)} className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm font-bold text-brand-500 outline-none" />}</div><div><p className="text-[10px] font-black text-navy-700/60 uppercase tracking-widest mb-1">Landmark</p>{!isEditing ? <p className="text-sm font-bold text-navy-700 italic">{selectedSeller.landmark || 'N/A'}</p> : <input type="text" value={editFormData.landmark} onChange={(e) => handleInputChange('landmark', e.target.value)} className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm font-bold text-brand-500 outline-none" />}</div><div><p className="text-[10px] font-black text-navy-700/60 uppercase tracking-widest mb-1">City</p>{!isEditing ? <p className="text-sm font-bold text-navy-700 italic">{selectedSeller.city}</p> : <input type="text" value={editFormData.city} onChange={(e) => handleInputChange('city', e.target.value)} className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm font-bold text-brand-500 outline-none" />}</div><div><p className="text-[10px] font-black text-navy-700/60 uppercase tracking-widest mb-1">State</p>{!isEditing ? <p className="text-sm font-bold text-navy-700 italic">{selectedSeller.state}</p> : <input type="text" value={editFormData.state} onChange={(e) => handleInputChange('state', e.target.value)} className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm font-bold text-brand-500 outline-none" />}</div><div><p className="text-[10px] font-black text-navy-700/60 uppercase tracking-widest mb-1">Pincode</p>{!isEditing ? <p className="text-sm font-bold text-navy-700 italic">{selectedSeller.pincode}</p> : <input type="text" value={editFormData.pincode} onChange={(e) => handleInputChange('pincode', e.target.value)} className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm font-bold text-brand-500 outline-none" />}</div></div></Card>
                <Card extra={`lg:col-span-3 p-8 border transition-all ${isEditing ? 'border-brand-200 bg-brand-50/5' : 'border-gray-100'}`}><div className="flex items-center gap-3 mb-8"><MdPerson className="h-5 w-5 text-purple-500" /><h4 className="text-sm font-black text-navy-700 uppercase tracking-widest italic">Owner Details</h4></div><div className="space-y-8"><div><p className="text-[10px] font-black text-navy-700/60 uppercase tracking-widest mb-2">Full Name</p>{!isEditing ? <p className="text-base font-bold text-navy-700 italic uppercase">{selectedSeller.owner_name}</p> : <input type="text" value={editFormData.owner_name} onChange={(e) => handleInputChange('owner_name', e.target.value)} className="w-full bg-white border border-gray-100 rounded-xl p-4 text-sm font-bold text-brand-500 outline-none" />}</div><div><p className="text-[10px] font-black text-navy-700/60 uppercase tracking-widest mb-2">Phone Number</p><p className="text-base font-bold text-navy-700 italic tracking-widest">{selectedSeller.contact_info}</p><p className="text-[9px] font-medium text-navy-700/40 mt-1 uppercase tracking-widest">* Verified contact number</p></div></div></Card>
             </div>
           )}
           {activeTab === 'Products' && (<Card extra="p-8 border border-gray-100 min-h-[400px]"><div className="flex items-center justify-between mb-10"><div className="flex items-center gap-3"><MdInventory className="h-6 w-6 text-brand-500" /><h3 className="text-xl font-black text-navy-700 uppercase tracking-widest italic">Product List</h3></div></div><div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-left border-b border-gray-50 uppercase tracking-[2px]"><th className="pb-4 text-[10px] font-black text-navy-700/60">Product Name</th><th className="pb-4 text-[10px] font-black text-navy-700/60">Category</th><th className="pb-4 text-[10px] font-black text-navy-700/60 text-right">Price</th><th className="pb-4 text-[10px] font-black text-navy-700/60 text-center">Status</th></tr></thead><tbody>{[1,2,3].map((_,i)=>(<tr key={i} className="border-b border-gray-50 last:border-none group"><td className="py-5"><div className="flex items-center gap-4"><div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center"><MdStore className="h-5 w-5 text-gray-300" /></div><div><p className="text-sm font-black text-navy-700 italic group-hover:text-brand-500 transition">Ultra HD 4K Smart Monitor</p><p className="text-[10px] font-bold text-navy-700/40 uppercase tracking-widest">SKU: HDM-2241</p></div></div></td><td className="py-5 text-[10px] font-black text-navy-700/50 uppercase tracking-widest">Electronics</td><td className="py-5 text-right"><p className="text-sm font-black text-navy-700">₹42,999</p></td><td className="py-5 text-center"><span className="px-3 py-1 rounded bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest">Active</span></td></tr>))}</tbody></table></div></Card>)}
           {activeTab === 'Subscription' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-8"><Card extra="p-10 border-2 border-brand-500 bg-brand-50/10"><div className="flex items-center justify-between mb-10"><div className="h-16 w-16 bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-xl"><MdStars className="h-8 w-8" /></div><div className="text-right"><p className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-1">Current Plan</p><h4 className="text-2xl font-black text-navy-700 italic uppercase">Elite Platinum</h4></div></div><div className="space-y-4 mb-10"><div className="flex justify-between items-center text-xs font-bold text-navy-700 uppercase italic"><span>Listing Usage</span><span className="text-brand-500">250 / 1000</span></div><div className="h-2 w-full bg-brand-200 rounded-full overflow-hidden"><div className="h-full bg-brand-500 rounded-full" style={{ width: '45%' }} /></div></div><p className="text-3xl font-black text-navy-700 italic">₹24,999<span className="text-xs text-navy-700/40 font-bold uppercase ml-2 tracking-widest">/ Year</span></p></Card><Card extra="p-10 border border-gray-100"><h4 className="text-[10px] font-black text-navy-700/40 uppercase tracking-[4px] mb-8">Account Growth</h4><div className="flex items-center gap-6 mb-10"><div className="flex flex-col"><p className="text-4xl font-black text-navy-700 italic tracking-tighter">28</p><p className="text-[10px] font-black text-brand-500 uppercase tracking-widest">Days Left</p></div><div className="h-12 w-[1px] bg-gray-100" /><div className="flex flex-col"><p className="text-4xl font-black text-navy-700 italic tracking-tighter">15%</p><p className="text-[10px] font-black text-navy-700/40 uppercase tracking-widest">Increase</p></div></div><div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between"><div className="flex items-center gap-3 text-amber-600"><MdError className="h-5 w-5" /><p className="text-[10px] font-black uppercase tracking-widest">Renewal Required</p></div><MdArrowForward className="h-5 w-5 text-amber-600" /></div></Card></div>)}
           {activeTab === 'Sales History' && (<Card extra="p-8 border border-gray-100 min-h-[400px]"><div className="flex items-center gap-3 mb-10"><MdHistory className="h-6 w-6 text-brand-500" /><h3 className="text-xl font-black text-navy-700 uppercase tracking-widest italic">Sales History</h3></div><div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-left border-b border-gray-50 uppercase tracking-[2px]"><th className="pb-4 text-[10px] font-black text-navy-700/60">Order ID</th><th className="pb-4 text-[10px] font-black text-navy-700/60">Customer Name</th><th className="pb-4 text-[10px] font-black text-navy-700/60">Order Date</th><th className="pb-4 text-[10px] font-black text-navy-700/60 text-right">Amount</th></tr></thead><tbody>{[1,2,3].map((_,i)=>(<tr key={i} className="border-b border-gray-50 last:border-none group"><td className="py-5 text-sm font-black text-navy-700 tracking-tighter">#ORD-TK-99281</td><td className="py-5 text-sm font-bold text-navy-700/60 italic">Johnathan Wick</td><td className="py-5 text-[10px] font-black text-navy-700/40 uppercase tracking-widest">08 May 2026</td><td className="py-5 text-right text-sm font-black text-navy-700 italic">₹1,49,900</td></tr>))}</tbody></table></div></Card>)}
        </div>

        {/* Floating Save Button */}
        {isEditing && hasChanges && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom duration-500">
             <button onClick={() => handleUpdateSeller()} disabled={isSaving} className="flex items-center gap-3 bg-brand-500 rounded-2xl px-16 py-5 text-[14px] font-black text-white uppercase tracking-[4px] shadow-[0_20px_50px_rgba(67,24,255,0.3)] hover:bg-brand-600 transition-all active:scale-95 disabled:opacity-50">
                {isSaving ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <MdCloudUpload className="h-6 w-6" />} Save Changes
              </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col px-[25px]">
      <div className="mb-[30px] flex flex-col justify-between md:flex-row md:items-center">
        <div><h2 className="text-[22px] font-bold text-navy-700 uppercase italic tracking-tighter">Seller List</h2><p className="mt-[5px] text-sm font-normal text-secondaryGray-600">Manage all registered shops and merchants</p></div>
        <div className="flex-1 flex justify-center px-4"><div className="relative flex items-center h-14 w-full max-w-xl rounded-2xl bg-white px-5 shadow-sm border border-gray-100 focus-within:border-brand-500 transition-all"><MdSearch className="h-6 w-6 text-gray-400" /><input type="text" placeholder="Search by shop, owner, or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="ml-3 w-full bg-transparent text-base font-semibold text-navy-700 outline-none placeholder:text-gray-400" /></div></div>
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-gray-100"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500"><MdStore className="h-6 w-6" /></div><div><p className="text-xs font-bold text-navy-700/40 uppercase tracking-widest">Total Shops</p><p className="text-xl font-bold text-navy-700 italic">{totalRecords}</p></div></div>
      </div>

      <div className="mb-[30px] flex flex-wrap items-center gap-4">
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-xl border border-gray-200 p-2 text-sm outline-none transition-all focus:border-brand-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-xl border border-gray-200 p-2 text-sm outline-none transition-all focus:border-brand-500" />
        </div>
        {(startDate || endDate) && (<button onClick={() => { setStartDate(''); setEndDate(''); }} className="mt-5 text-sm font-bold text-red-500 hover:text-red-600 transition-all">Clear Filter</button>)}
      </div>

      <Card extra="w-full h-full px-6 py-6 border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-50 uppercase tracking-[2px]"><th className="pb-4 text-[10px] font-black text-navy-700/60">Shop Name</th><th className="pb-4 text-[10px] font-black text-navy-700/60">Owner Name</th><th className="pb-4 text-[10px] font-black text-navy-700/60 text-center">Status</th><th className="pb-4 text-[10px] font-black text-navy-700/60">Joined On</th><th className="pb-4 text-[10px] font-black text-navy-700/60">City / State</th><th className="pb-4 text-[10px] font-black text-navy-700/60 text-center">Actions</th></tr>
            </thead>
            <tbody>
              {isLoading ? Array(3).fill(0).map((_, i) => (<tr key={i} className="animate-pulse"><td colSpan={6} className="py-6 border-b border-gray-50"><div className="h-10 bg-gray-50 rounded-xl" /></td></tr>)) : sellers.map((seller) => (
                <tr key={seller.seller_id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-all group">
                  <td className="py-5">
                    <p className="text-sm font-bold text-navy-700 italic uppercase group-hover:text-brand-500 transition-all">{seller.shop_name}</p>
                    <p className="text-[9px] font-black text-brand-500 uppercase tracking-[2px] mt-0.5">Token: {seller.seller_id.split('-')[0]}</p>
                  </td>
                  <td className="py-5 text-xs font-semibold text-navy-700/60 uppercase tracking-widest">{seller.owner_name}</td>
                  <td className="py-5 text-center"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${seller.kyc_status === 'APPROVED' ? 'bg-green-50 text-green-600' : seller.kyc_status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>{seller.kyc_status}</span></td>
                  <td className="py-5 text-[11px] font-black text-navy-700 italic uppercase tracking-tighter">{formatJoinDate(seller.join_date)}</td>
                  <td className="py-5"><p className="text-sm font-bold text-navy-700 uppercase tracking-widest">{seller.city}</p><p className="text-xs font-semibold text-navy-700/40 uppercase tracking-widest">{seller.state}</p></td>
                  <td className="py-5 text-center"><button onClick={() => setSelectedSeller(seller)} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest hover:bg-brand-600 shadow-sm transition-all active:scale-95"><MdRemoveRedEye className="h-4 w-4" /> View Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
