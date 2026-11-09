import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Layout from "./layouts/DashboardLayout";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
    {path: '/login', element: <Login />},
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Dashboard/>},
            { path: 'orders', element: <Orders />},
            { path: 'support', element: ''}
        ]
    }
])