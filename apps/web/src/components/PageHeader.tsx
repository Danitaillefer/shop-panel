import type { ReactNode } from "react";


interface PageHeaderProps {
    title: string;
    eyebrow ?: string;
    highlight ?: string;
    children ?: ReactNode;
}

export function PageHeader({title, eyebrow, highlight, children}: PageHeaderProps){
    return (
        <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col ">
                {eyebrow && <span className="text-sm font-medium text-muted">{eyebrow}</span>}
                <h1 className="mt-2 text-5xl font-bold tracking-tighter md:text-6xl">{title} { highlight && <span className="bg-brand-gradient bg-clip-text text-transparent">{highlight}</span>}</h1>
            </div>
            {children}
        </div>
    )
}
