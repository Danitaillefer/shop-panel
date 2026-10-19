import { NavLink } from "react-router-dom";


function Sidebar(){
    return(
        <nav className="flex flex-col">
            <NavLink to="/" className={({ isActive }) => isActive ? "text-red-500 bg-gray-50" : ""}end>Dashboard</NavLink>
            <NavLink to="/orders" className={({ isActive }) => isActive ? "text-red-500 bg-gray-50" : ""} end>Pedidos</NavLink>
        </nav>
    )
}

export default Sidebar;
