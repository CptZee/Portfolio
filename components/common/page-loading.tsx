import { LoaderCircle } from "lucide-react";
import PageHeader from "@/components/common/page-header";

interface PageLoadingProps {
    title: string;
    label: string;
    variant?: "cards" | "timeline" | "detail";
}

function Placeholder({ className = "" }: { className?: string }) {
    return <div className={`rounded-md bg-muted motion-safe:animate-pulse ${className}`} />;
}

export function PageLoading({ title, label, variant = "cards" }: PageLoadingProps) {
    return (
        <section aria-label={label} className="pb-12">
            <div role="progressbar" aria-label={label} className="fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-muted">
                <div className="page-loading-progress h-full w-1/3 bg-primary" />
            </div>
            <PageHeader title={title} description="Getting everything ready for you." />
            <SectionLoading label={label} variant={variant} />
        </section>
    );
}

export function SectionLoading({ label, variant = "cards" }: Omit<PageLoadingProps, "title">) {
    return (
        <div aria-label={label} className="space-y-4 py-2">
            <div role="progressbar" aria-label={label} className="h-1 overflow-hidden rounded-full bg-muted">
                <div className="page-loading-progress h-full w-1/3 bg-primary" />
            </div>
            <p role="status" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle aria-hidden="true" className="h-4 w-4 motion-safe:animate-spin" />
                {label}…
            </p>
            <div aria-hidden="true" className={variant === "cards" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "space-y-6"}>
                {variant === "detail" ? (
                    <div className="mx-auto max-w-3xl space-y-6">
                        <Placeholder className="aspect-video w-full" />
                        <Placeholder className="h-7 w-1/3" />
                        {[0, 1, 2, 3].map(index => <Placeholder key={index} className={`h-4 ${index === 3 ? "w-2/3" : "w-full"}`} />)}
                    </div>
                ) : [0, 1, 2].map(index => (
                    <div key={index} className="space-y-4 rounded-xl border border-border p-6">
                        <Placeholder className={variant === "timeline" ? "h-12 w-12" : "h-40 w-full"} />
                        <Placeholder className="h-7 w-2/3" />
                        <Placeholder className="h-4 w-full" />
                        <Placeholder className="h-4 w-4/5" />
                        <Placeholder className="h-10 w-28" />
                    </div>
                ))}
            </div>
        </div>
    );
}
