"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getEmbedUrl } from "@/lib/project-media";
import type { ProjectMedia } from "@/types/portfolio";

export function ProjectGallery({ items, projectName }: { items: ProjectMedia[]; projectName: string }) {
    const [selected, setSelected] = useState(0);
    const [failed, setFailed] = useState<string | null>(null);
    if (!items.length) return null;
    const active = items[selected] ?? items[0];
    const embedUrl = active.kind === "embed" ? getEmbedUrl(active.source) : null;
    function select(index: number) { setSelected((index + items.length) % items.length); setFailed(null); }
    return (
        <section aria-label={`${projectName} media gallery`} className="my-8 space-y-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="font-heading text-3xl">Project showcase</h2>
                <div className="flex items-center gap-3">
                    <span aria-live="polite" className="text-sm text-muted-foreground">{selected + 1} / {items.length}</span>
                    {items.length > 1 && <><button type="button" aria-label="Previous media" onClick={() => select(selected - 1)} className="rounded-md border border-border p-2 hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button><button type="button" aria-label="Next media" onClick={() => select(selected + 1)} className="rounded-md border border-border p-2 hover:bg-muted"><ChevronRight className="h-4 w-4" /></button></>}
                </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-muted">
                {active.kind === "image" ? (
                    <Dialog>
                        <DialogTrigger asChild><button type="button" className="group relative block w-full" aria-label={`Expand image: ${active.alt}`}>
                            <Image src={active.source} alt={active.alt} width={1200} height={675} sizes="(max-width: 768px) 100vw, 720px" className="aspect-video w-full object-contain" />
                            <span className="absolute bottom-3 right-3 rounded-full bg-background/90 p-2"><Expand aria-hidden="true" className="h-4 w-4" /></span>
                        </button></DialogTrigger>
                        <DialogContent className="max-w-6xl"><DialogTitle>{active.alt}</DialogTitle><DialogDescription className="sr-only">{active.caption || `Enlarged image from ${projectName}.`}</DialogDescription><Image src={active.source} alt={active.alt} width={1920} height={1080} sizes="95vw" className="max-h-[75vh] w-full object-contain" /></DialogContent>
                    </Dialog>
                ) : active.kind === "video" ? (
                    <video key={active.id} controls playsInline preload="none" poster={active.poster} aria-label={active.alt} className="aspect-video w-full bg-black object-contain" onError={() => setFailed(active.id)}>
                        <source src={active.source} />Your browser cannot play this video. <a href={active.source}>Open the video</a>.
                    </video>
                ) : embedUrl ? (
                    <iframe key={active.id} title={active.alt} src={embedUrl} className="aspect-video w-full" loading="lazy" allow="fullscreen; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
                ) : <p role="status" className="p-6">This video provider cannot be embedded. <a href={active.source} target="_blank" rel="noopener noreferrer" className="underline">Open video</a></p>}
                {failed === active.id && <p role="status" className="p-4 text-sm">The video could not be played. <a href={active.source} target="_blank" rel="noopener noreferrer" className="underline">Open it directly</a>.</p>}
            </div>
            <p aria-live="polite" className="min-h-6 text-sm text-muted-foreground">{active.caption || active.alt}</p>
            {active.kind !== "image" && <a href={active.source} target="_blank" rel="noopener noreferrer" className="inline-block text-sm underline underline-offset-4">Open video separately</a>}
            {items.length > 1 && <div className="flex gap-3 overflow-x-auto pb-2" aria-label="Choose project media">
                {items.map((item, index) => <button key={item.id} type="button" onClick={() => select(index)} aria-label={`Show ${item.kind === "image" ? "image" : "video"}: ${item.alt}`} aria-pressed={selected === index} className={`relative w-28 shrink-0 overflow-hidden rounded-lg border-2 ${selected === index ? "border-primary" : "border-transparent hover:border-border"}`}>
                    {item.kind === "image" || item.poster ? <Image src={item.kind === "image" ? item.source : item.poster!} alt="" width={160} height={90} className="aspect-video w-full object-cover" sizes="112px" /> : <span className="flex aspect-video items-center justify-center bg-muted"><Play aria-hidden="true" className="h-6 w-6" /></span>}
                    {item.kind !== "image" && <span className="absolute inset-0 flex items-center justify-center bg-black/20"><Play aria-hidden="true" className="h-6 w-6 fill-white text-white" /></span>}
                </button>)}
            </div>}
        </section>
    );
}
