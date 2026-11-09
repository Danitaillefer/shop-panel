
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center text-sm text-muted">
                Cargando…
            </main>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace/>
    }

    return children;
}