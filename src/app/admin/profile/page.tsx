'use client';
import Banner from 'components/admin/profile/Banner';
import General from 'components/admin/profile/General';
import Notification from 'components/admin/profile/Notification';
import Project from 'components/admin/profile/Project';
import Storage from 'components/admin/profile/Storage';
import Upload from 'components/admin/profile/Upload';
import { MdSearch, MdPerson } from 'react-icons/md';
import { useSearch } from 'contexts/SearchContext';

const ProfileOverview = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  return (
    <div className="flex w-full flex-col px-[25px]">
      {/* Header Section */}
      <div className="mb-[30px] flex flex-col justify-between md:flex-row md:items-center">
        <div>
          <h2 className="text-[22px] font-bold text-navy-700 dark:text-white uppercase tracking-tight">
            Administrator Profile
          </h2>
          <p className="mt-[5px] text-sm font-normal text-secondaryGray-600">
            Manage your personal identity, security, and platform preferences
          </p>
        </div>

        {/* Inline Search Bar */}
        <div className="md:flex-1 md:max-w-md md:mx-10 mt-[10px] md:mt-0">
          <div className="relative flex items-center h-12 w-full rounded-2xl bg-white px-4 shadow-sm border border-gray-100 dark:bg-navy-800 dark:border-white/5 transition-all focus-within:border-brand-500">
            <MdSearch className="h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search profile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 w-full bg-transparent text-sm font-bold text-navy-700 outline-none placeholder:text-gray-400 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-[10px] flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-navy-800 border border-gray-100 dark:border-white/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
            <MdPerson className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Session</p>
            <p className="text-lg font-bold text-navy-700 dark:text-white">Admin Hub</p>
          </div>
        </div>
      </div>
      <div className="w-ful mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="col-span-4 lg:!mb-0">
          <Banner />
        </div>

        <div className="col-span-3 lg:!mb-0">
          <Storage />
        </div>

        <div className="z-0 col-span-5 lg:!mb-0">
          <Upload />
        </div>
      </div>
      {/* all project & ... */}

      <div className="mb-4 grid h-full grid-cols-1 gap-5 lg:!grid-cols-12">
        <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-4">
          <Project />
        </div>
        <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-5">
          <General />
        </div>

        <div className="col-span-5 lg:col-span-12 lg:mb-0 3xl:!col-span-3">
          <Notification />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
