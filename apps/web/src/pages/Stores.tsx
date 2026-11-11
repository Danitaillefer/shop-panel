import { useEffect, useState, type SubmitEvent } from "react";
import { connectStoreUrl, getStores, type Store } from "../lib/stores";
import { PageHeader } from "../components/PageHeader";
import { StoreIcon } from "lucide-react";
import { dateFormatter } from "../lib/formatters";

export function Stores() {
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [shop, setShop] = useState('');

    function handleConnect(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        window.location.href = connectStoreUrl(shop);
    }
    useEffect(() => {
        getStores()
            .then(setStores)
            .catch(() => setError('No se pudieron cargar las tiendas'))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <>
            <PageHeader eyebrow="Integraciones" title="Tus" highlight="tiendas." />

            <div className="flex flex-col gap-8">
                <form
                    onSubmit={handleConnect}
                    className="glass-card flex flex-col gap-4 p-6 sm:flex-row sm:items-end"
                >
                    <div className="flex flex-1 flex-col gap-1.5">
                        <label htmlFor="shop" className="text-xs font-medium text-muted">
                            Dominio de tu tienda Shopify
                        </label>
                        <input
                            id="shop"
                            type="text"
                            placeholder="mitienda.myshopify.com"
                            value={shop}
                            onChange={(e) => setShop(e.target.value)}
                            required
                            className="control w-full px-4 text-sm placeholder:text-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-brand-gradient h-10 rounded-full px-6 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                    >
                        Conectar tienda
                    </button>
                </form>

                <section className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold">Tiendas conectadas</h2>

                    {error && (
                        <p role="alert" className="rounded-xl bg-negative/15 px-4 py-2.5 text-sm text-negative">
                            {error}
                        </p>
                    )}

                    {isLoading ? (
                        <p className="text-sm text-muted">Cargando…</p>
                    ) : stores.length === 0 ? (
                        <p className="glass-card p-6 text-sm text-muted">
                            Aún no has conectado ninguna tienda.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {stores.map((store) => (
                                <li key={store.id} className="glass-card flex items-center gap-4 p-5">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface">
                                        <StoreIcon size={20} aria-hidden="true" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium">{store.shopDomain}</p>
                                        <p className="text-xs text-muted">
                                            Conectada el {dateFormatter.format(new Date(store.createdAt))}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </>
    );


}