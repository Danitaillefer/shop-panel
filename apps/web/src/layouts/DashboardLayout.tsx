import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'



function Layout() {
  return (
    <div className='flex min-h-screen'>
        <Sidebar/>
        <main className='relative isolate flex-1 overflow-hidden p-10'>
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-brand-gradient opacity-20 blur-[120px]" ></div>
          <Outlet />
        </main>
    </div>
  )
}

export default Layout