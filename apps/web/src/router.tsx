import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Layout from "./layouts/DashboardLayout";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Dashboard/>},
            { path: 'orders', element: <Orders />},
            { path: 'support', element: ''}
        ]
    }
])