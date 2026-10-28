import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'



function Layout() {
  return (
    <div className='flex min-h-screen'>
        <Sidebar/>
        <main className='relative isolate flex-1 overflow-hidden p-10'>
          
          <Outlet />
        </main>
    </div>
  )
}

export default Layout