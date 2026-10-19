import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'

function Layout() {
  return (
    <div>
        <Sidebar/>
        <main className='flex-1'>
            <Outlet />
        </main>
    </div>
  )
}

export default Layout