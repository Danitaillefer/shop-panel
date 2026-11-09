import { useState, type SubmitEvent } from "react";
import { PageHeader } from "../components/PageHeader";
import { login } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../lib/api";

export function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'No se pudo conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
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
                        <h1 className="text-2xl font-bold tracking-tight">Inicia sesión</h1>
                        <p className="mt-1 text-sm text-muted">Accede a tu panel de Pulse</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
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
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="control w-full px-4 text-sm placeholder:text-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                        />
                    </div>
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
                    {isLoading ? 'Entrando…' : 'Entrar'}
                </button>
            </form>
        </main>
    );
}