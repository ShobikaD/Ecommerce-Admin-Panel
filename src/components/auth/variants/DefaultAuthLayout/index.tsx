import authImg from '/public/img/auth/auth.png';
import NavLink from 'components/link/NavLink';
import Footer from 'components/footer/FooterAuthDefault';
import { MdShoppingCart } from 'react-icons/md';
function Default(props: { maincard: JSX.Element }) {
  const { maincard } = props;
  return (
    <div className="relative flex">
      <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%] lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:min-h-[100vh] xl:max-w-[1383px] xl:px-0 xl:pl-[70px]">
        <div className="mb-auto flex flex-col pl-5 pr-5 md:pl-12 md:pr-0 lg:max-w-[48%] lg:pl-0 xl:max-w-full">
          <NavLink href="/admin" className="mt-0 w-max lg:pt-10">
            <div className="mx-auto flex h-fit w-fit items-center hover:cursor-pointer">
              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.70994 2.11997L2.82994 5.99997L6.70994 9.87997C7.09994 10.27 7.09994 10.9 6.70994 11.29C6.31994 11.68 5.68994 11.68 5.29994 11.29L0.709941 6.69997C0.319941 6.30997 0.319941 5.67997 0.709941 5.28997L5.29994 0.699971C5.68994 0.309971 6.31994 0.309971 6.70994 0.699971C7.08994 1.08997 7.09994 1.72997 6.70994 2.11997V2.11997Z"
                  fill="#A3AED0"
                />
              </svg>
              <p className="ml-3 text-sm text-gray-600">Back to Dashboard</p>
            </div>
          </NavLink>
          {maincard}
          <div className="absolute right-0 hidden h-full min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]">
            <div
              className={`absolute flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-400 to-brand-600 lg:rounded-bl-[120px] xl:rounded-bl-[200px] shadow-2xl`}
            >
              <div className="relative flex flex-col items-center justify-center text-white">
                {/* 3D-style Shopping Cart Illustration */}
                <div className="relative mb-8 flex h-48 w-48 items-center justify-center rounded-[40px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                  <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-yellow-400/80 blur-2xl opacity-50" />
                  <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-brand-300/80 blur-3xl opacity-50" />
                  <MdShoppingCart className="h-24 w-24 text-white drop-shadow-2xl" />
                </div>
                
                <h2 className="text-4xl font-bold text-center leading-tight">
                  Administrative <br /> 
                  <span className="text-brand-100 uppercase tracking-wider text-2xl">Dashboard</span>
                </h2>
                <p className="mt-4 text-center text-lg text-white/70 max-w-[320px] font-medium">
                  Powerful tools to manage your entire ecommerce ecosystem with precision and security.
                </p>

                {/* Decorative Elements */}
                <div className="mt-12 flex gap-4">
                  <div className="h-1.5 w-12 rounded-full bg-white/40" />
                  <div className="h-1.5 w-6 rounded-full bg-white/20" />
                  <div className="h-1.5 w-6 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Default;
