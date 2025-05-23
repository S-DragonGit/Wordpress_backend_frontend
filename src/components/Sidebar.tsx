import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import { images } from '../constants';
import { UserLogout } from '../app/redux/userSlice';
import { useDispatch } from 'react-redux';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);


  const handleLogout = () => {
    dispatch(UserLogout())
    navigate("/login")
  }

  return (
    <aside
      ref={sidebar}
      className={`absolute lg:m-2 left-0 top-0 z-9999 flex rounded-e-lg lg:rounded-lg w-72.5 flex-col overflow-y-hidden bg-primary-light duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-75'
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex flex-col items-center bg-primary justify-between gap-2 px-6 py-2.5 lg:py-3.5 text-white">
        <img className='w-[121px] h-[121px]' src={images.ProfileOne} alt="" />

        <h2 className=' text-xl font-bold'>Admin Name</h2>
        <h2 className=''>admin@gmail.com</h2>
        <button onClick={handleLogout} className='bg-primary-light text-primary w-full py-1 rounded-md' >Logout</button>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block  text-white lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear items-center">
        <nav className="w-[90%] pt-2">
          <div>

            <ul className="mb-6 mt-10 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/' || pathname.includes('dashboard')
                }
              >
                {() => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="/"
                        className={`group relative flex items-center justify-center rounded-md gap-2.5 py-2 px-4 font-medium  duration-300 ease-in-out hover:bg-primary hover:text-white  ${(pathname === '/' ||
                          pathname.includes('/dashboard')) ?
                          'bg-primary text-white' : 'text-primary bg-primary-light2'
                          }`}
                      >
                        Dashboard
                      </NavLink>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <li>
                <NavLink
                  to="/eventManagement"
                  className={`group relative flex items-center justify-center gap-2.5 rounded-md py-2 px-4 font-medium  duration-300 ease-in-out hover:bg-primary hover:text-white  
                    ${(pathname.includes('/eventManagement')) ?
                      'bg-primary text-white' : 'text-primary bg-primary-light2'
                    }`}
                >
                  Event Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/notifications"
                  className={`group relative flex items-center justify-center gap-2.5 rounded-md py-2 px-4 font-medium  duration-300 ease-in-out hover:bg-primary hover:text-white  
                    ${(pathname.includes('/notifications')) ?
                      'bg-primary text-white' : 'text-primary bg-primary-light2'
                    }`}
                >
                  Notifications
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/navigatorManagement"
                  className={`group relative flex items-center justify-center gap-2.5 rounded-md py-2 px-4 font-medium  duration-300 ease-in-out hover:bg-primary hover:text-white  
                    ${(pathname.includes('/navigatorManagement')) ?
                      'bg-primary text-white' : 'text-primary bg-primary-light2'
                    }`}
                >
                  Navigator Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/analytics"
                  className={`group relative flex items-center justify-center gap-2.5 rounded-md py-2 px-4 font-medium  duration-300 ease-in-out hover:bg-primary hover:text-white  
                    ${(pathname.includes('/analytics')) ?
                      'bg-primary text-white' : 'text-primary bg-primary-light2'
                    }`}
                >
                  Analytics
                </NavLink>
              </li>

            </ul>
          </div>
        </nav >
        {/* <!-- Sidebar Menu --> */}
      </div >
    </aside >
  );
};

export default Sidebar;
