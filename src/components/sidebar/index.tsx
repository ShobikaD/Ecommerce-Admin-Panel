import { HiX } from 'react-icons/hi';
import Links from './components/Links';
import SidebarCard from 'components/sidebar/components/SidebarCard';
import { IRoute } from 'types/navigation';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { 
  renderThumb, 
  renderTrack, 
  renderView 
} from 'components/scrollbar/Scrollbar';

function SidebarHorizon(props: { routes: IRoute[]; [x: string]: any }) {
  const { routes, open, setOpen } = props;
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex h-screen w-[300px] flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? 'translate-x-0' : '-translate-x-96 xl:translate-x-0'
      }`}
    >
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden"
        onClick={() => setOpen(false)}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[50px] flex items-center`}>
        <div className="ml-1 mt-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          Admin <span className="font-medium text-gray-400">Panel</span>
        </div>
      </div>
      <div className="mb-7 mt-[58px] h-px bg-gray-300 dark:bg-white/30" />
      
      {/* Nav items with Custom Scroll */}
      <div className="flex-1 overflow-hidden">
        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
        >
          <ul className="mb-auto pt-1 pb-10">
            <Links routes={routes} />
          </ul>
        </Scrollbars>
      </div>

      {/* Free Horizon Card */}
      <div className="mt-4 flex justify-center">
        <SidebarCard />
      </div>
    </div>
  );
}

export default SidebarHorizon;
