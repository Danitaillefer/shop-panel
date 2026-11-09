import { useState, type SubmitEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ApiError } from "../lib/api";
import { useAuth } from "../context/useAuth";

export function Register() {
    const navigate = useNavigate();
    const { register, user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        setIsLoading(true);
        try {
            await register(email, password, name.trim() || undefined);
            navigate('/');
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'No se pudo conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
    }

    if (user) {
        return <Navigate to="/" replace />
    }
    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="glass-card flex w-full max-w-sm flex-col gap-6 p-8"
            >
                <div className="flex flex-col gap-3">
                    <div className="bg-brand-gradient size-10 rounded-xl" aria-hidden="true" />
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Registrate</h1>
                        <p className="mt-1 text-sm text-muted">Crea tu cuenta de Pulse</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-xs font-medium text-muted">
                            Nombre
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Tu nombre"
                            autoComplete="name"
                            maxLength={100}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="control w-full px-4 text-sm placeholder:text-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-xs font-medium text-muted">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="control w-full px-4 text-sm placeholder:text-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-xs font-medium text-muted">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="control w-full px-4 text-sm placeholder:text-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="confirmPassword" className="text-xs font-medium text-muted">
                            Repite la Contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="control w-full px-4 text-sm placeholder:text-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                        />
                    </div>
                    {passwordsMismatch && (
                        <p className="text-xs text-negative">Las contraseñas no coinciden</p>
                    )}
                </div>

                {error && (
                    <p role="alert" className="rounded-xl bg-negative/15 px-4 py-2.5 text-sm text-negative">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-brand-gradient h-11 rounded-full text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? 'Registrando...' : 'Regístrate'}
                </button>
                <p className="text-center text-sm text-muted">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="font-medium text-foreground hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </form>
        </main>
    );
}