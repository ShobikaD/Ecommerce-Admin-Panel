import { MdLogout } from 'react-icons/md';

const SidebarCard = () => {
  return (
    <div className="relative flex w-[256px] justify-center pb-4">
      <button 
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-50 py-3 text-sm font-bold text-red-500 transition duration-200 hover:bg-red-100 active:bg-red-200 dark:bg-red-500/10 dark:text-red-500 dark:hover:bg-red-500/20"
        onClick={() => {
          // Clear session and logout
          console.log('Logging out...');
          localStorage.removeItem('isLoggedIn');
          window.location.href = '/auth/sign-in';
        }}
      >
        <MdLogout className="h-5 w-5" />
        Log Out
      </button>
    </div>
  );
};

export default SidebarCard;
