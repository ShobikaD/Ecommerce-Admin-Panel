'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Card from 'components/card';
import { 
  MdCategory, 
  MdRemoveRedEye, 
  MdDelete, 
  MdSearch, 
  MdAdd, 
  MdEdit,
  MdClose,
  MdCloudUpload,
  MdLayers,
  MdCheckCircle,
  MdCollections,
  MdImage,
  MdSettings,
  MdLabel,
  MdAutoGraph
} from 'react-icons/md';
import { useSearch } from 'contexts/SearchContext';

// Types based on provided schemas
interface Category {
  category_id: string;
  category_name: string;
  category_slug: string;
  category_description: string;
  category_image: string;
  category_banner: string;
  category_icon: string;
  parent_category_id: string | null;
  level: number;
  is_featured: boolean;
  is_popular: boolean;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface SubCategory {
  sub_category_id: string;
  category_id: string;
  sub_category_name: string;
  sub_category_slug: string;
  sub_category_description: string;
  sub_category_images: string[];
  sub_category_banners: string[];
  total_products: number;
  is_featured: boolean;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function CategoryManagementHub() {
  const [activeTab, setActiveTab] = useState<'Categories' | 'SubCategories'>('Categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>('');
  
  const { searchQuery, setSearchQuery } = useSearch();

  // Modals
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory | null>(null);

  // Form States
  const [categoryForm, setCategoryForm] = useState({
    category_name: '',
    category_slug: '',
    category_description: '',
    category_image: '',
    category_banner: '',
    category_icon: '',
    parent_category_id: null as string | null,
    is_featured: false,
    is_popular: false,
    status: true
  });

  const [subCategoryForm, setSubCategoryForm] = useState({
    category_id: '',
    sub_category_name: '',
    sub_category_slug: '',
    sub_category_description: '',
    sub_category_images: [] as string[],
    sub_category_banners: [] as string[],
    is_featured: false,
    status: true
  });

  const [categoryImagePreview, setCategoryImagePreview] = useState<string | null>(null);
  const [subCategoryImagesPreviews, setSubCategoryImagesPreviews] = useState<string[]>([]);

  const BASE_URL = 'http://192.168.29.178:8000';

  // API Calls
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/v1/customer/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok && (result.status === 200 || result.success)) {
        setCategories(Array.isArray(result.data) ? result.data : []);
      } else {
        // Fallback for when GET /categories might not be implemented exactly as POST
        // or if it returns 404/other because no data exists yet
        if (response.status !== 404) setError(result.message || 'Failed to load categories.');
      }
    } catch (err) {
      setError('Connection to backend failed.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSubCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/v1/customer/sub-categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok && (result.status === 200 || result.success)) {
        setSubCategories(Array.isArray(result.data) ? result.data : []);
      }
    } catch (err) {
      console.error("Sub-categories fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, [fetchCategories, fetchSubCategories]);

  // Category Actions
  const handleSaveCategory = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const method = currentCategory ? 'PUT' : 'POST';
      const endpoint = currentCategory 
        ? `${BASE_URL}/api/v1/admin/categories/${currentCategory.category_id}`
        : `${BASE_URL}/api/v1/admin/categories`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryForm)
      });

      const result = await response.json();
      if (response.ok || result.status === 200 || result.status === 201) {
        setShowCategoryModal(false);
        fetchCategories();
      } else {
        alert(result.message || 'Operation failed.');
      }
    } catch (err) {
      alert('Network error.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('DELETE CATEGORY: This will permanently remove this category. Continue?')) return;
    setIsProcessingId(id);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/v1/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok || result.status === 200) {
        fetchCategories();
      } else {
        alert(result.message || 'Failed to delete category.');
      }
    } catch (err) {
      alert('Network error.');
    } finally {
      setIsProcessingId(null);
    }
  };

  // Sub-category Actions
  const handleSaveSubCategory = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const method = currentSubCategory ? 'PUT' : 'POST';
      const endpoint = currentSubCategory 
        ? `${BASE_URL}/api/v1/admin/sub-categories/${currentSubCategory.sub_category_id}`
        : `${BASE_URL}/api/v1/admin/sub-categories`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subCategoryForm)
      });

      const result = await response.json();
      if (response.ok || result.status === 200 || result.status === 201) {
        setShowSubCategoryModal(false);
        fetchSubCategories();
      } else {
        alert(result.message || 'Operation failed.');
      }
    } catch (err) {
      alert('Network error.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubCategory = async (id: string) => {
    if (!confirm('DELETE SUB-CATEGORY: This will permanently remove this sub-category. Continue?')) return;
    setIsProcessingId(id);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/v1/admin/sub-categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok || result.status === 200) {
        fetchSubCategories();
      } else {
        alert(result.message || 'Failed to delete sub-category.');
      }
    } catch (err) {
      alert('Network error.');
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleCategoryImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCategoryImagePreview(url);
      setCategoryForm({ ...categoryForm, category_image: url });
    }
  };

  const handleSubCategoryImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setSubCategoryImagesPreviews(prev => [...prev, ...urls]);
      setSubCategoryForm({ 
        ...subCategoryForm, 
        sub_category_images: [...subCategoryForm.sub_category_images, ...urls] 
      });
    }
  };

  // Modal Handlers
  const openCategoryModal = (cat: Category | null = null) => {
    setCurrentCategory(cat);
    if (cat) {
      setCategoryForm({
        category_name: cat.category_name,
        category_slug: cat.category_slug,
        category_description: cat.category_description,
        category_image: cat.category_image,
        category_banner: cat.category_banner,
        category_icon: cat.category_icon,
        parent_category_id: cat.parent_category_id,
        is_featured: cat.is_featured,
        is_popular: cat.is_popular,
        status: cat.status
      });
      setCategoryImagePreview(cat.category_image);
    } else {
      setCategoryForm({
        category_name: '',
        category_slug: '',
        category_description: '',
        category_image: '',
        category_banner: '',
        category_icon: '',
        parent_category_id: null,
        is_featured: false,
        is_popular: false,
        status: true
      });
      setCategoryImagePreview(null);
    }
    setShowCategoryModal(true);
  };

  const openSubCategoryModal = (sub: SubCategory | null = null, parentId: string | null = null) => {
    setCurrentSubCategory(sub);
    if (sub) {
      setSubCategoryForm({
        category_id: sub.category_id,
        sub_category_name: sub.sub_category_name,
        sub_category_slug: sub.sub_category_slug,
        sub_category_description: sub.sub_category_description,
        sub_category_images: sub.sub_category_images,
        sub_category_banners: sub.sub_category_banners,
        is_featured: sub.is_featured,
        status: sub.status
      });
      setSubCategoryImagesPreviews(sub.sub_category_images || []);
    } else {
      setSubCategoryForm({
        category_id: parentId || '',
        sub_category_name: '',
        sub_category_slug: '',
        sub_category_description: '',
        sub_category_images: [],
        sub_category_banners: [],
        is_featured: false,
        status: true
      });
      setSubCategoryImagesPreviews([]);
    }
    setShowSubCategoryModal(true);
  };

  const filteredCategories = categories.filter(c => 
    c.parent_category_id === null &&
    c.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubCategories = subCategories.filter(s => 
    s.sub_category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col px-[25px] pb-20 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="mb-8 flex flex-col justify-between md:flex-row md:items-center px-2">
        <div>
          <h2 className="text-[22px] font-bold text-navy-700 dark:text-white uppercase italic tracking-tighter">
            Category Management
          </h2>
          <p className="mt-1 text-xs font-medium text-secondaryGray-600">
            Manage your store's categories and sub-categories to organize products
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex bg-gray-100 dark:bg-navy-800 p-1 rounded-2xl border border-gray-200 dark:border-white/5">
            <button 
              onClick={() => setActiveTab('Categories')}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'Categories' ? 'bg-white dark:bg-navy-700 text-brand-500 shadow-lg' : 'text-navy-700/40 hover:text-navy-700'}`}
            >
              Main Categories
            </button>
            <button 
              onClick={() => setActiveTab('SubCategories')}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'SubCategories' ? 'bg-white dark:bg-navy-700 text-brand-500 shadow-lg' : 'text-navy-700/40 hover:text-navy-700'}`}
            >
              Sub-Categories
            </button>
          </div>
        </div>
      </div>

      {/* Main Categories Tab */}
      {activeTab === 'Categories' && (
        <div className="animate-in slide-in-from-left duration-500 px-2">
           <div className="mb-8 flex flex-col lg:flex-row items-center justify-between bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm gap-6">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                    <MdCategory className="h-6 w-6" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-navy-700 italic uppercase tracking-tighter">Main Categories</h3>
                    <p className="text-[11px] text-gray-500 font-medium">Total categories: <span className="text-brand-500 font-bold">{categories.length}</span></p>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="relative flex items-center h-12 w-64 rounded-2xl bg-gray-50 px-4 border border-gray-100 transition-all focus-within:border-brand-500 focus-within:bg-white">
                    <MdSearch className="h-5 w-5 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="Search categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="ml-2 w-full bg-transparent text-xs font-bold text-navy-700 outline-none placeholder:text-gray-400"
                    />
                 </div>
                 <button onClick={() => openCategoryModal()} className="flex items-center gap-2 bg-brand-500 rounded-xl px-8 py-3 text-[10px] font-black text-white uppercase tracking-widest hover:bg-brand-600 transition-all shadow-xl shadow-brand-500/30 active:scale-95">
                    <MdAdd className="h-4 w-4" /> Add Category
                 </button>
              </div>
           </div>

           {error && <div className="mb-8 p-4 bg-red-50 text-red-500 rounded-2xl border border-red-100 text-sm font-bold uppercase italic tracking-widest">{error}</div>}

           <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="p-8 text-[10px] font-black text-navy-700/40 uppercase tracking-[3px]">Category Details</th>
                          <th className="p-8 text-[10px] font-black text-navy-700/40 uppercase tracking-[3px]">Settings</th>
                          <th className="p-8 text-[10px] font-black text-navy-700/40 uppercase tracking-[3px]">Status</th>
                          <th className="p-8 text-[10px] font-black text-navy-700/40 uppercase tracking-[3px] text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {isLoading ? (
                          Array(5).fill(0).map((_, i) => (
                             <tr key={i} className="animate-pulse">
                                <td colSpan={4} className="p-8"><div className="h-12 bg-gray-50 rounded-2xl w-full" /></td>
                             </tr>
                          ))
                       ) : filteredCategories.length === 0 ? (
                          <tr>
                             <td colSpan={4} className="p-20 text-center">
                                <MdCategory className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-[10px] font-black text-navy-700/20 uppercase tracking-[3px]">No Categories Found</p>
                             </td>
                          </tr>
                       ) : filteredCategories.map((cat) => (
                          <tr key={cat.category_id} className="hover:bg-gray-50/50 transition-colors group">
                             <td className="p-8">
                                <div className="flex items-center gap-4">
                                   <div className="h-12 w-12 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                                      {cat.category_image ? (
                                        <img src={cat.category_image} alt="" className="h-full w-full object-cover" />
                                      ) : (
                                        <MdCategory className="h-6 w-6 text-gray-300" />
                                      )}
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-sm font-black text-navy-700 italic uppercase">{cat.category_name}</span>
                                      <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{cat.category_slug}</span>
                                   </div>
                                </div>
                             </td>
                             <td className="p-8">
                                <div className="flex gap-2">
                                   {cat.is_featured && <span className="bg-brand-50 text-brand-500 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Featured</span>}
                                   {cat.is_popular && <span className="bg-amber-50 text-amber-500 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Popular</span>}
                                   <span className="bg-gray-50 text-gray-500 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Lvl {cat.level}</span>
                                </div>
                             </td>
                             <td className="p-8">
                                <span className={`inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[2px] ${
                                   cat.status ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                   {cat.status ? 'Active' : 'Disabled'}
                                </span>
                             </td>
                             <td className="p-8 text-right">
                                <div className="flex items-center justify-end gap-3">
                                   <button 
                                      onClick={() => openSubCategoryModal(null, cat.category_id)}
                                      className="h-10 px-4 flex items-center justify-center bg-brand-50 text-brand-500 rounded-xl hover:bg-brand-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest gap-2"
                                   >
                                      <MdAdd className="h-4 w-4" /> Add Sub
                                   </button>
                                   <button 
                                      onClick={() => openCategoryModal(cat)}
                                      className="h-10 w-10 flex items-center justify-center bg-navy-700 text-white rounded-xl hover:bg-navy-800 shadow-lg shadow-navy-700/10 transition-all"
                                   >
                                      <MdEdit className="h-4 w-4" />
                                   </button>
                                   <button 
                                      onClick={() => handleDeleteCategory(cat.category_id)}
                                      disabled={isProcessingId === cat.category_id}
                                      className="h-10 w-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                   >
                                      {isProcessingId === cat.category_id ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" /> : <MdDelete className="h-4 w-4" />}
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

      {/* Sub-Categories Tab */}
      {activeTab === 'SubCategories' && (
        <div className="animate-in slide-in-from-right duration-500 px-2">
           <div className="mb-8 flex flex-col lg:flex-row items-center justify-between bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm gap-6">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <MdLayers className="h-6 w-6" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-navy-700 italic uppercase tracking-tighter">Sub-Categories</h3>
                    <p className="text-[11px] text-gray-500 font-medium">Total sub-categories: <span className="text-amber-500 font-bold">{subCategories.length}</span></p>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="relative flex items-center h-12 w-64 rounded-2xl bg-gray-50 px-4 border border-gray-100 transition-all focus-within:border-brand-500 focus-within:bg-white">
                    <MdSearch className="h-5 w-5 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="Search sub-categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="ml-2 w-full bg-transparent text-xs font-bold text-navy-700 outline-none placeholder:text-gray-400"
                    />
                 </div>
                 <button onClick={() => openSubCategoryModal()} className="flex items-center gap-2 bg-brand-500 rounded-xl px-8 py-3 text-[10px] font-black text-white uppercase tracking-widest hover:bg-brand-600 transition-all shadow-xl shadow-brand-500/30 active:scale-95">
                    <MdAdd className="h-4 w-4" /> Add Sub-Category
                 </button>
              </div>
           </div>

           <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="p-8 text-[10px] font-black text-navy-700/40 uppercase tracking-[3px]">Sub-Category Details</th>
                          <th className="p-8 text-[10px] font-black text-navy-700/40 uppercase tracking-[3px]">Main Category</th>
                          <th className="p-8 text-[10px] font-black text-navy-700/40 uppercase tracking-[3px]">Product Count</th>
                          <th className="p-8 text-[10px] font-black text-navy-700/40 uppercase tracking-[3px] text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {isLoading ? (
                          Array(5).fill(0).map((_, i) => (
                             <tr key={i} className="animate-pulse">
                                <td colSpan={4} className="p-8"><div className="h-12 bg-gray-50 rounded-2xl w-full" /></td>
                             </tr>
                          ))
                       ) : filteredSubCategories.length === 0 ? (
                          <tr>
                             <td colSpan={4} className="p-20 text-center">
                                <MdLayers className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-[10px] font-black text-navy-700/20 uppercase tracking-[3px]">No Sub-Categories Found</p>
                             </td>
                          </tr>
                       ) : filteredSubCategories.map((sub) => {
                          const parent = categories.find(c => c.category_id === sub.category_id);
                          return (
                          <tr key={sub.sub_category_id} className="hover:bg-gray-50/50 transition-colors group">
                             <td className="p-8">
                                <div className="flex items-center gap-4">
                                   <div className="h-12 w-12 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                                      {sub.sub_category_images && sub.sub_category_images.length > 0 ? (
                                        <img src={sub.sub_category_images[0]} alt="" className="h-full w-full object-cover" />
                                      ) : (
                                        <MdLabel className="h-6 w-6 text-gray-300" />
                                      )}
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-sm font-black text-navy-700 italic uppercase">{sub.sub_category_name}</span>
                                      <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{sub.sub_category_slug}</span>
                                   </div>
                                </div>
                             </td>
                             <td className="p-8">
                                <span className="bg-navy-50 text-navy-700 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-navy-100">
                                   {parent ? parent.category_name : 'Unknown Root'}
                                </span>
                             </td>
                             <td className="p-8">
                                <div className="flex flex-col">
                                   <span className="text-sm font-black text-navy-700">{sub.total_products}</span>
                                   <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Products</span>
                                </div>
                             </td>
                             <td className="p-8 text-right">
                                <div className="flex items-center justify-end gap-3">
                                   <button 
                                      onClick={() => openSubCategoryModal(sub)}
                                      className="h-10 w-10 flex items-center justify-center bg-navy-700 text-white rounded-xl hover:bg-navy-800 shadow-lg shadow-navy-700/10 transition-all"
                                   >
                                      <MdEdit className="h-4 w-4" />
                                   </button>
                                   <button 
                                      onClick={() => handleDeleteSubCategory(sub.sub_category_id)}
                                      disabled={isProcessingId === sub.sub_category_id}
                                      className="h-10 w-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                   >
                                      {isProcessingId === sub.sub_category_id ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" /> : <MdDelete className="h-4 w-4" />}
                                   </button>
                                </div>
                             </td>
                          </tr>
                       )})}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {/* CATEGORY ARCHITECT MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/40 backdrop-blur-md p-4 animate-in fade-in duration-500">
           <Card extra="w-full max-w-3xl p-0 max-h-[90vh] overflow-hidden bg-white shadow-[0_50px_100px_rgba(0,0,0,0.15)] border-none rounded-[40px] relative flex flex-col">
              <div className="bg-navy-700 p-8 flex items-center justify-between relative overflow-hidden">
                 <div className="absolute top-0 right-0 h-64 w-64 bg-brand-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                 <div className="relative z-10">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
                       {currentCategory ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[4px] mt-2 italic">Manage Category Details</p>
                 </div>
                 <button onClick={() => setShowCategoryModal(false)} className="h-12 w-12 flex items-center justify-center bg-white/10 text-white rounded-2xl hover:bg-red-500 transition-all z-10"><MdClose className="h-6 w-6" /></button>
              </div>

              <div className="p-10 space-y-10 overflow-y-auto flex-grow custom-scrollbar">
                 {/* Section 1: Core Identity */}
                 <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="h-8 w-1 bg-brand-500 rounded-full" />
                       <h4 className="text-xs font-black text-navy-700 uppercase tracking-[3px] italic">Category Details</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="group">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Category Name</label>
                          <input 
                            type="text" 
                            value={categoryForm.category_name} 
                            onChange={(e) => setCategoryForm({...categoryForm, category_name: e.target.value})} 
                            className="w-full h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 text-sm font-bold text-navy-700 outline-none focus:border-brand-500 focus:bg-white transition-all shadow-sm" 
                            placeholder="e.g. Consumer Electronics" 
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Slug (URL)</label>
                          <input 
                            type="text" 
                            value={categoryForm.category_slug} 
                            onChange={(e) => setCategoryForm({...categoryForm, category_slug: e.target.value})} 
                            className="w-full h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 text-sm font-bold text-navy-700 outline-none focus:border-brand-500 focus:bg-white transition-all shadow-sm" 
                            placeholder="consumer-electronics" 
                          />
                       </div>
                    </div>
                 </div>

                  <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="h-8 w-1 bg-amber-500 rounded-full" />
                       <h4 className="text-xs font-black text-navy-700 uppercase tracking-[3px] italic">Category Visuals</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="flex flex-col gap-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Main Image</label>
                          <div className="relative group">
                             <div className={`h-40 w-full rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${categoryImagePreview ? 'border-brand-500 bg-white' : 'border-gray-200 bg-gray-50 hover:border-brand-500 hover:bg-white'}`}>
                                {categoryImagePreview ? (
                                   <>
                                      <img src={categoryImagePreview} alt="" className="h-full w-full object-cover" />
                                      <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                         <button onClick={() => setCategoryImagePreview(null)} className="h-10 w-10 flex items-center justify-center bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"><MdDelete className="h-5 w-5" /></button>
                                      </div>
                                   </>
                                ) : (
                                   <label className="flex flex-col items-center cursor-pointer">
                                      <MdCloudUpload className="h-10 w-10 text-gray-300 mb-2" />
                                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Image</span>
                                      <input type="file" className="hidden" accept="image/*" onChange={handleCategoryImageSelect} />
                                   </label>
                                )}
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col gap-6">
                          <div>
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Icon Identifier</label>
                             <div className="relative">
                                <MdImage className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 h-5 w-5" />
                                <input 
                                  type="text" 
                                  value={categoryForm.category_icon} 
                                  onChange={(e) => setCategoryForm({...categoryForm, category_icon: e.target.value})} 
                                  className="w-full h-14 bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-6 text-xs font-bold text-navy-700 outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm" 
                                  placeholder="e.g. computer" 
                                />
                             </div>
                          </div>
                          <div>
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Banner Color / ID</label>
                             <div className="relative">
                                <MdCollections className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 h-5 w-5" />
                                <input 
                                  type="text" 
                                  value={categoryForm.category_banner} 
                                  onChange={(e) => setCategoryForm({...categoryForm, category_banner: e.target.value})} 
                                  className="w-full h-14 bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-6 text-xs font-bold text-navy-700 outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm" 
                                  placeholder="Banner theme" 
                                />
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                 {/* Section 3: Hierarchy & Meta */}
                 <div className="animate-in slide-in-from-bottom-4 duration-500 delay-200">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="h-8 w-1 bg-green-500 rounded-full" />
                       <h4 className="text-xs font-black text-navy-700 uppercase tracking-[3px] italic">Settings & Parent</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Parent Category</label>
                          <select 
                            value={categoryForm.parent_category_id || ''} 
                            onChange={(e) => setCategoryForm({...categoryForm, parent_category_id: e.target.value || null})}
                            className="w-full h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 text-sm font-bold text-navy-700 outline-none focus:border-brand-500 focus:bg-white transition-all appearance-none"
                          >
                             <option value="">No Parent (Main Category)</option>
                             {categories.filter(c => c.category_id !== currentCategory?.category_id).map(c => (
                               <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                             ))}
                          </select>
                       </div>
                       <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-2xl border-2 border-gray-100 h-16 mt-7">
                          <label className="flex items-center gap-3 cursor-pointer group">
                             <input 
                                type="checkbox" 
                                checked={categoryForm.is_featured} 
                                onChange={(e) => setCategoryForm({...categoryForm, is_featured: e.target.checked})}
                                className="hidden"
                             />
                             <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${categoryForm.is_featured ? 'bg-brand-500 border-brand-500' : 'bg-white border-gray-200'}`}>
                                {categoryForm.is_featured && <MdCheckCircle className="text-white h-4 w-4" />}
                             </div>
                             <span className="text-[10px] font-black text-navy-700 uppercase tracking-widest">Featured</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer group">
                             <input 
                                type="checkbox" 
                                checked={categoryForm.is_popular} 
                                onChange={(e) => setCategoryForm({...categoryForm, is_popular: e.target.checked})}
                                className="hidden"
                             />
                             <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${categoryForm.is_popular ? 'bg-amber-500 border-amber-500' : 'bg-white border-gray-200'}`}>
                                {categoryForm.is_popular && <MdCheckCircle className="text-white h-4 w-4" />}
                             </div>
                             <span className="text-[10px] font-black text-navy-700 uppercase tracking-widest">Popular</span>
                          </label>
                       </div>
                    </div>
                    <div className="mt-8">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Description</label>
                       <textarea 
                         value={categoryForm.category_description} 
                         onChange={(e) => setCategoryForm({...categoryForm, category_description: e.target.value})}
                         className="w-full h-28 bg-gray-50 border-2 border-gray-100 rounded-[24px] p-6 text-sm font-bold text-navy-700 outline-none focus:border-brand-500 focus:bg-white transition-all shadow-sm resize-none" 
                         placeholder="Describe the scope of this taxonomy cluster..." 
                       />
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-4 mt-auto">
                 <button onClick={() => setShowCategoryModal(false)} className="flex-1 h-16 bg-white text-navy-700 border-2 border-gray-100 rounded-2xl text-xs font-black uppercase tracking-[3px] hover:bg-gray-100 transition-all active:scale-95">Cancel</button>
                 <button 
                   onClick={handleSaveCategory} 
                   disabled={isSaving} 
                   className="flex-[2] h-16 bg-brand-500 text-white rounded-2xl text-xs font-black uppercase tracking-[3px] shadow-2xl shadow-brand-500/30 hover:bg-brand-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                 >
                    {isSaving ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <MdCloudUpload className="h-6 w-6" />}
                    {currentCategory ? 'Update Cluster' : 'Deploy Category'}
                 </button>
              </div>
           </Card>
        </div>
      )}

      {/* SUB-CATEGORY ARCHITECT MODAL */}
      {showSubCategoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/40 backdrop-blur-md p-4 animate-in fade-in duration-500">
           <Card extra="w-full max-w-2xl p-0 max-h-[90vh] overflow-hidden bg-white shadow-[0_50px_100px_rgba(0,0,0,0.15)] border-none rounded-[40px] relative flex flex-col">
              <div className="bg-navy-700 p-8 flex items-center justify-between relative overflow-hidden">
                 <div className="absolute top-0 right-0 h-64 w-64 bg-amber-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                 <div className="relative z-10">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
                       {currentSubCategory ? 'Edit Sub-Category' : 'Add Sub-Category'}
                    </h3>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[4px] mt-2 italic">Manage Sub-Category Details</p>
                 </div>
                 <button onClick={() => setShowSubCategoryModal(false)} className="h-12 w-12 flex items-center justify-center bg-white/10 text-white rounded-2xl hover:bg-red-500 transition-all z-10"><MdClose className="h-6 w-6" /></button>
              </div>

              <div className="p-10 space-y-10 overflow-y-auto flex-grow custom-scrollbar">
                 <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Parent Category Selection</label>
                    <select 
                      value={subCategoryForm.category_id} 
                      onChange={(e) => setSubCategoryForm({...subCategoryForm, category_id: e.target.value})}
                      className="w-full h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 text-sm font-black text-navy-700 outline-none focus:border-brand-500 focus:bg-white transition-all appearance-none"
                    >
                       <option value="">Select Parent Root</option>
                       {categories.map(c => (
                         <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                       ))}
                    </select>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Sub-Category Name</label>
                       <input 
                         type="text" 
                         value={subCategoryForm.sub_category_name} 
                         onChange={(e) => setSubCategoryForm({...subCategoryForm, sub_category_name: e.target.value})}
                         className="w-full h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 text-sm font-bold text-navy-700 focus:border-brand-500 focus:bg-white transition-all" 
                         placeholder="e.g. Wireless Audio" 
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Slug (URL)</label>
                       <input 
                         type="text" 
                         value={subCategoryForm.sub_category_slug} 
                         onChange={(e) => setSubCategoryForm({...subCategoryForm, sub_category_slug: e.target.value})}
                         className="w-full h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 text-sm font-bold text-navy-700 focus:border-brand-500 focus:bg-white transition-all" 
                         placeholder="wireless-audio" 
                       />
                    </div>
                 </div>

                 {/* Section 2: Visual Assets */}
                 <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="h-8 w-1 bg-brand-500 rounded-full" />
                       <h4 className="text-xs font-black text-navy-700 uppercase tracking-[3px] italic">Visual Assets</h4>
                    </div>
                    
                    <div className="space-y-6">
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {subCategoryImagesPreviews.map((url, idx) => (
                             <div key={idx} className="relative h-24 w-full rounded-2xl overflow-hidden group border border-gray-100">
                                <img src={url} alt="" className="h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                   <button 
                                      onClick={() => {
                                         const newPreviews = subCategoryImagesPreviews.filter((_, i) => i !== idx);
                                         setSubCategoryImagesPreviews(newPreviews);
                                         setSubCategoryForm({...subCategoryForm, sub_category_images: newPreviews});
                                      }}
                                      className="h-8 w-8 flex items-center justify-center bg-red-500 text-white rounded-lg"
                                   >
                                      <MdDelete className="h-4 w-4" />
                                   </button>
                                </div>
                             </div>
                          ))}
                          <label className="h-24 w-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-white transition-all">
                             <MdCloudUpload className="h-6 w-6 text-gray-300" />
                             <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Add Image</span>
                             <input type="file" multiple className="hidden" accept="image/*" onChange={handleSubCategoryImageSelect} />
                          </label>
                       </div>
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Description</label>
                    <textarea 
                      value={subCategoryForm.sub_category_description} 
                      onChange={(e) => setSubCategoryForm({...subCategoryForm, sub_category_description: e.target.value})}
                      className="w-full h-24 bg-gray-50 border-2 border-gray-100 rounded-[24px] p-6 text-sm font-bold text-navy-700 focus:border-brand-500 focus:bg-white transition-all resize-none" 
                      placeholder="Defining the boundaries of this niche..." 
                    />
                 </div>

                 <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
                    <label className="flex items-center gap-3 cursor-pointer group">
                       <input 
                          type="checkbox" 
                          checked={subCategoryForm.is_featured} 
                          onChange={(e) => setSubCategoryForm({...subCategoryForm, is_featured: e.target.checked})}
                          className="hidden"
                       />
                       <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${subCategoryForm.is_featured ? 'bg-brand-500 border-brand-500' : 'bg-white border-gray-200'}`}>
                          {subCategoryForm.is_featured && <MdCheckCircle className="text-white h-4 w-4" />}
                       </div>
                       <span className="text-[10px] font-black text-navy-700 uppercase tracking-widest">Featured Niche</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                       <input 
                          type="checkbox" 
                          checked={subCategoryForm.status} 
                          onChange={(e) => setSubCategoryForm({...subCategoryForm, status: e.target.checked})}
                          className="hidden"
                       />
                       <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${subCategoryForm.status ? 'bg-green-500 border-green-500' : 'bg-white border-gray-200'}`}>
                          {subCategoryForm.status && <MdCheckCircle className="text-white h-4 w-4" />}
                       </div>
                       <span className="text-[10px] font-black text-navy-700 uppercase tracking-widest">Active Status</span>
                    </label>
                 </div>
              </div>

              <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-4 mt-auto">
                 <button onClick={() => setShowSubCategoryModal(false)} className="flex-1 h-16 bg-white text-navy-700 border-2 border-gray-100 rounded-2xl text-xs font-black uppercase tracking-[3px] hover:bg-gray-100 transition-all active:scale-95">Cancel</button>
                 <button 
                   onClick={handleSaveSubCategory} 
                   disabled={isSaving} 
                   className="flex-[2] h-16 bg-brand-500 text-white rounded-2xl text-xs font-black uppercase tracking-[3px] shadow-2xl shadow-brand-500/30 hover:bg-brand-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                 >
                    {isSaving ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <MdCloudUpload className="h-6 w-6" />}
                    {currentSubCategory ? 'Update Niche' : 'Finalize Niche'}
                 </button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
