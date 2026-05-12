'use client';
import React from 'react';
import Card from 'components/card';
import { MdShoppingBag, MdRemoveRedEye, MdDelete, MdEdit, MdSearch } from 'react-icons/md';
import Image from 'next/image';
import InputField from 'components/fields/InputField';

const productData = [
  {
    id: 1,
    name: 'Wireless Noise-Canceling Headphones',
    seller: 'Tech Haven',
    category: 'Electronics',
    price: 24900,
    stock: 45,
    status: 'In Stock',
    date: '02 May 2026',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 2,
    name: 'Premium Leather Watch',
    seller: 'Urban Style',
    category: 'Fashion',
    price: 12500,
    stock: 8,
    status: 'Low Stock',
    date: '01 May 2026',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 3,
    name: 'Eco-Friendly Yoga Mat',
    seller: 'Organic Roots',
    category: 'Lifestyle',
    price: 3499,
    stock: 0,
    status: 'Out of Stock',
    date: '02 May 2026',
    image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 4,
    name: 'Mechanical Gaming Keyboard',
    seller: 'Gaming Zone',
    category: 'Electronics',
    price: 9999,
    stock: 15,
    status: 'In Stock',
    date: '30 Apr 2026',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 5,
    name: 'Smart Home Speaker',
    seller: 'Tech Haven',
    category: 'Electronics',
    price: 7499,
    stock: 110,
    status: 'In Stock',
    date: '02 May 2026',
    image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=100&q=80',
    verification: 'Verified'
  }
];

import { useSearch } from 'contexts/SearchContext';

export default function ProductsPage() {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<any>(null);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const { searchQuery, setSearchQuery } = useSearch();

  // Modal handlers
  const openEditModal = (product: any) => {
    setEditingProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = () => {
    // Logic to save changes would go here
    console.log('Saving product:', editingProduct);
    closeEditModal();
  };

  // Filter Logic
  const filteredData = productData.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (!startDate && !endDate) return true;
    
    const dateObj = new Date(item.date);
    dateObj.setHours(0, 0, 0, 0);

    const start = startDate ? new Date(startDate) : null;
    if (start) start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    if (start && end) {
      return dateObj >= start && dateObj <= end;
    } else if (start) {
      return dateObj >= start;
    } else if (end) {
      return dateObj <= end;
    }
    return true;
  });

  if (selectedProduct) {
    return (
      <div className="flex flex-col px-[25px]">
        {/* Audit Header */}
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => setSelectedProduct(null)}
            className="flex items-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-600 transition uppercase tracking-widest"
          >
            ← Back to Inventory
          </button>
          <div className="flex gap-3">
             <div className="rounded-full bg-green-500 px-4 py-1 text-[10px] font-black uppercase text-white shadow-lg shadow-green-500/20 tracking-widest">
               Status: {selectedProduct.verification || 'Verified'}
             </div>
          </div>
        </div>

        <div className="mb-8">
           <h2 className="text-3xl font-black text-navy-700 dark:text-white uppercase tracking-tight italic">
             Product Audit: {selectedProduct.name}
           </h2>
           <p className="text-sm text-gray-500 font-medium">Full investigative view of merchant listing and stock health</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Visual Assets */}
           <Card extra="p-6 lg:col-span-1">
              <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-xl">
                 <Image src={selectedProduct.image} alt="" fill className="object-cover" />
              </div>
              <div className="mt-6 space-y-4 border-t border-gray-100 dark:border-white/5 pt-4">
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Merchant Owner</p>
                    <p className="text-sm font-black text-navy-700 dark:text-white uppercase tracking-tighter italic">{selectedProduct.seller}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Catalog Category</p>
                    <span className="rounded-lg bg-brand-500 px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest">{selectedProduct.category}</span>
                 </div>
              </div>
           </Card>

           {/* Performance & Logic */}
           <Card extra="p-8 lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-gray-50 dark:bg-navy-800 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center">Market Price</p>
                    <p className="text-2xl font-black text-navy-700 dark:text-white text-center">Rs. {selectedProduct.price.toLocaleString()}</p>
                 </div>
                 <div className="bg-gray-50 dark:bg-navy-800 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center">Current Stock</p>
                    <p className="text-2xl font-black text-navy-700 dark:text-white text-center">{selectedProduct.stock} Units</p>
                 </div>
                 <div className="bg-gray-50 dark:bg-navy-800 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center">Inventory Status</p>
                    <p className={`text-sm font-black text-center uppercase tracking-widest ${selectedProduct.stock > 10 ? 'text-green-500' : 'text-red-500'}`}>
                       {selectedProduct.status}
                    </p>
                 </div>
              </div>

              <div className="mb-8">
                 <h4 className="text-sm font-black text-navy-700 dark:text-white uppercase tracking-widest mb-4">Merchant Description Preview</h4>
                 <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed italic border-l-4 border-brand-500 pl-4">
                   This high-performance {selectedProduct.name} is a top-tier listing from {selectedProduct.seller}. It features premium build quality and has been a trending item in the {selectedProduct.category} niche over the last 30 days.
                 </p>
              </div>

              <div className="flex gap-4">
                 <button className="flex-1 rounded-2xl bg-green-500 py-4 text-xs font-black text-white shadow-lg shadow-green-500/20 hover:bg-green-600 transition uppercase tracking-widest">
                    Confirm Verification
                 </button>
                 <button className="flex-1 rounded-2xl bg-red-50 text-red-500 py-4 text-xs font-black hover:bg-red-100 transition uppercase tracking-widest border border-red-100">
                    Flag Listing
                 </button>
              </div>
           </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col px-[25px]">
        {/* Header Section */}
        <div className="mb-[30px] flex flex-col justify-between md:flex-row md:items-center">
          <div>
            <h2 className="text-[22px] font-bold text-navy-700 dark:text-white uppercase tracking-tight">
              Product Management
            </h2>
            <p className="mt-[5px] text-sm font-normal text-secondaryGray-600">
              Manage, monitor, and moderate the entire product catalog
            </p>
          </div>

          {/* Inline Search Bar */}
          <div className="md:flex-1 md:max-w-md md:mx-10 mt-[10px] md:mt-0">
            <div className="relative flex items-center h-12 w-full rounded-2xl bg-white px-4 shadow-sm border border-gray-100 dark:bg-navy-800 dark:border-white/5 transition-all focus-within:border-brand-500">
              <MdSearch className="h-5 w-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 w-full bg-transparent text-sm font-bold text-navy-700 outline-none placeholder:text-gray-400 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-[10px] flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-navy-800 border border-gray-100 dark:border-white/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
              <MdShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Total Products</p>
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
              className="mt-5 text-sm font-bold text-red-500 hover:text-red-600 transition-all"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Products Table */}
        <Card extra="w-full h-full sm:overflow-auto px-6 py-6">
          <div className="relative flex items-center justify-between">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              Inventory List
            </div>
          </div>

          <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
            <table className="w-full">
              <thead>
                <tr className="!border-px !border-gray-400 text-left">
                  <th className="border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Product
                  </th>
                  <th className="border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Seller
                  </th>
                  <th className="border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Category
                  </th>
                  <th className="border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Price
                  </th>
                  <th className="border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Stock
                  </th>
                  <th className="border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10">
                    Status
                  </th>
                  <th className="border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400 dark:border-white/10 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((prod) => (
                  <tr key={prod.id} className="border-b border-gray-50 dark:border-white/5 last:border-none">
                    <td className="min-w-[250px] py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={prod.image}
                            alt={prod.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {prod.name}
                        </p>
                      </div>
                    </td>
                    <td className="min-w-[150px] py-4 pr-4">
                      <p className="text-sm font-medium text-gray-600">
                        {prod.seller}
                      </p>
                    </td>
                    <td className="min-w-[120px] py-4 pr-4">
                      <span className="rounded-lg bg-brand-500/10 px-2 py-1 text-xs font-bold text-brand-500">
                        {prod.category}
                      </span>
                    </td>
                    <td className="min-w-[100px] py-4 pr-4">
                      <p className="text-sm font-bold text-navy-700 dark:text-white">
                        Rs. {prod.price.toLocaleString()}
                      </p>
                    </td>
                    <td className="min-w-[80px] py-4 pr-4">
                      <p className="text-sm font-bold text-navy-700 dark:text-white">
                        {prod.stock}
                      </p>
                    </td>
                    <td className="min-w-[120px] py-4 pr-4">
                      <div className={`flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold ${
                        prod.status === 'In Stock' 
                        ? 'bg-green-50 text-green-500 dark:bg-green-500/10' 
                        : prod.status === 'Low Stock'
                        ? 'bg-orange-50 text-orange-500 dark:bg-orange-500/10'
                        : 'bg-red-50 text-red-500 dark:bg-red-500/10'
                      }`}>
                        {prod.status}
                      </div>
                    </td>
                    <td className="min-w-[120px] py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setSelectedProduct(prod)}
                          title="View" 
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-500 transition hover:bg-brand-500 hover:text-white shadow-sm"
                        >
                          <MdRemoveRedEye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(prod)}
                          title="Edit" 
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500 transition hover:bg-brand-500/20"
                        >
                          <MdEdit className="h-4 w-4" />
                        </button>
                        <button title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20">
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

      {/* Edit Modal */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeEditModal}
          />
          
          {/* Modal Content */}
          <Card extra="relative z-[101] w-[90%] max-w-[500px] bg-white p-8 dark:bg-navy-800 shadow-2xl transition-all scale-100">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
                Edit Product
              </h3>
              <button 
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <MdDelete className="h-6 w-6 rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 dark:bg-navy-700 rounded-xl">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                  <Image
                    src={editingProduct.image}
                    alt={editingProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product ID</p>
                  <p className="text-sm font-bold text-navy-700 dark:text-white">#{editingProduct.id}</p>
                </div>
              </div>

              <InputField
                id="edit-name"
                label="Product Name"
                placeholder="Enter product name"
                value={editingProduct.name}
                onChange={(e: any) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  id="edit-price"
                  label="Price (Rs.)"
                  placeholder="24,900"
                  value={editingProduct.price.toString()}
                  onChange={(e: any) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                />
                <InputField
                  id="edit-stock"
                  label="Stock Quantity"
                  placeholder="45"
                  value={editingProduct.stock.toString()}
                  onChange={(e: any) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-navy-700 dark:text-white ml-3 mb-2">Category</label>
                <select 
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="flex w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={closeEditModal}
                className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-bold text-navy-700 transition hover:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-navy-600"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 rounded-xl bg-brand-500 py-3 text-sm font-bold text-white transition hover:bg-brand-600 active:bg-brand-700 shadow-lg shadow-brand-500/20"
              >
                Save Changes
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
