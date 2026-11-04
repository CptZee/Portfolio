"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, Heart, ShoppingBag, Store, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatServicePrice } from "@/lib/service-content";
import type { Service } from "@/types/portfolio";
import { inquiryText, serviceEmail, serviceInquirySchema } from "@/lib/service-inquiry";

const packageIcons: Record<string, typeof Heart> = { "personal-website": Heart, "business-website": Store, "ecommerce-website": ShoppingBag };

export function ServiceStorefront({ services }: { services: readonly Service[] }) {
    const [selected, setSelected] = useState<string>(services[0]?.id ?? "");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
    const selectRef = useRef<HTMLSelectElement>(null);
    const service = services.find(item => item.id === selected);
    const emailHref = `mailto:${serviceEmail}?subject=${encodeURIComponent(`Service inquiry: ${service?.name ?? "Custom project"}`)}&body=${encodeURIComponent(inquiryText(service?.name ?? "Custom project", name, email, message))}`;

    function choose(id: string) {
        setSelected(id);
        setResult(null);
        document.getElementById("project-brief")?.scrollIntoView({ behavior: "smooth", block: "start" });
        selectRef.current?.focus({ preventScroll: true });
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy) return;
        setResult(null);
        const data = new FormData(event.currentTarget);
        const payload = { serviceId: selected, name, email, message, website: String(data.get("website") ?? "") };
        const parsed = serviceInquirySchema.safeParse(payload);
        if (!parsed.success) {
            setResult({ ok: false, text: parsed.error.issues[0].message });
            return;
        }
        setBusy(true);
        try {
            window.location.href = emailHref;
            setResult({ ok: true, text: "Your email app will open with your brief. Please send the message there to complete your inquiry." });
        } catch (error) {
            setResult({ ok: false, text: error instanceof Error ? error.message : "Could not connect. Please use the email option below." });
        } finally { setBusy(false); }
    }

    return (
        <div className="space-y-16 pb-12">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="rounded-full border border-border bg-muted px-4 py-2 text-foreground">Built by Aaron, for you</span>
                <span>Custom design</span><span aria-hidden="true">·</span><span>Mobile-ready</span><span aria-hidden="true">·</span><span>Personal handover</span>
            </div>
            <section aria-label="Website packages" className="grid gap-6 lg:grid-cols-3">
                {services.map((item, index) => {
                    const Icon = packageIcons[item.id] ?? Store;
                    return (
                        <article key={item.id} id={item.id} className="flex scroll-mt-28 flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground">
                            <div className="relative flex h-44 items-center justify-center overflow-hidden border-b border-border bg-muted">
                                <div aria-hidden="true" className="absolute h-48 w-48 rounded-full border border-foreground/10" />
                                <div aria-hidden="true" className="absolute h-32 w-32 rounded-full border border-foreground/10" />
                                <span className="absolute left-5 top-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">0{index + 1} / {item.category}</span>
                                <Icon aria-hidden="true" className="relative h-12 w-12" strokeWidth={1.25} />
                            </div>
                            <div className="flex flex-1 flex-col p-6">
                                <h2 className="font-heading text-2xl">{item.name}</h2>
                                <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{item.tagline}</p>
                                <div className="my-6 border-y border-border py-5">
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Starting at</p>
                                    <p className="mt-1 font-heading text-4xl">{formatServicePrice(item.price)}</p>
                                    <p className="mt-2 text-sm text-muted-foreground">{item.timeline}</p>
                                </div>
                                <ul className="mb-6 flex-1 space-y-3 text-sm">
                                    {item.features.map(feature => <li key={feature} className="flex gap-3"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /><span>{feature}</span></li>)}
                                </ul>
                                {item.example && <Link href={item.example} className="mb-5 text-sm underline underline-offset-4">{item.exampleLabel || "View example"}</Link>}
                                <Button type="button" className="w-full" onClick={() => choose(item.id)}>Request this package <ArrowRight className="ml-2 h-4 w-4" /></Button>
                            </div>
                        </article>
                    );
                })}
            </section>
            <p className="!mt-5 max-w-3xl text-sm leading-6 text-muted-foreground">Starting prices are in Philippine pesos. Final pricing and delivery dates depend on your brief and content readiness. Domain, hosting, paid assets, ongoing maintenance, and payment-provider fees are quoted separately.</p>
            <section className="grid gap-8 rounded-2xl border border-border bg-muted/40 p-6 md:grid-cols-3 md:p-8" aria-label="How it works">
                {[ ["01", "Share your idea", "Pick a package and tell me what you have in mind."], ["02", "Agree on the details", "We'll confirm the scope, timeline, quote, and payment schedule before work begins."], ["03", "Build, refine, launch", "Review the design, share your feedback, and get a website ready to make its debut."] ].map(([step, title, text]) => <div key={step}><p className="text-sm text-muted-foreground">{step}</p><h2 className="mt-2 font-heading text-xl">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>)}
            </section>
            <section id="project-brief" className="grid scroll-mt-28 gap-10 lg:grid-cols-[1fr_1.3fr]">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your idea starts here</p>
                    <h2 className="mt-4 font-heading text-4xl">Tell me what you want to build.</h2>
                    <p className="mt-4 leading-7 text-muted-foreground">A surprise for someone special? Your first online shop? Share a few details and we can figure out the right fit together.</p>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">Send your brief through your email app. I'll confirm availability and a final quote with you before any work or payment.</p>
                    <a className="mt-6 inline-flex items-center gap-2 text-sm underline underline-offset-4" href={`mailto:${serviceEmail}`}><Mail className="h-4 w-4" />{serviceEmail}</a>
                </div>
                <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border p-6 sm:p-8">
                    <div className="space-y-2"><Label htmlFor="service">Your package</Label><select ref={selectRef} id="service" value={selected} onChange={e => { setSelected(e.target.value); setResult(null); }} className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{services.map(item => <option key={item.id} value={item.id}>{item.name} — from {formatServicePrice(item.price)}</option>)}</select></div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2"><Label htmlFor="inquiry-name">Name</Label><Input id="inquiry-name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={100} placeholder="Your name" /></div>
                        <div className="space-y-2"><Label htmlFor="inquiry-email">Email</Label><Input id="inquiry-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} placeholder="you@example.com" /></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="inquiry-message">Project brief</Label><Textarea id="inquiry-message" rows={6} value={message} onChange={e => setMessage(e.target.value)} required minLength={20} maxLength={5000} placeholder="What's your idea? Include the pages or features you need, your budget, and any target date." /></div>
                    <div hidden aria-hidden="true"><label htmlFor="inquiry-website">Website</label><input id="inquiry-website" name="website" tabIndex={-1} autoComplete="off" /></div>
                    <p className="text-xs leading-5 text-muted-foreground">This opens your email app with your name, email, and project brief. Send the message there to contact Aaron.</p>
                    {result && <p role={result.ok ? "status" : "alert"} className={`rounded-md border p-3 text-sm ${result.ok ? "border-border" : "border-destructive text-destructive"}`}>{result.text}</p>}
                    <Button type="submit" disabled={busy} className="w-full">{busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Opening…</> : <>Open inquiry in email app <ArrowRight className="ml-2 h-4 w-4" /></>}</Button>
                    <a href={emailHref} className="block text-center text-sm underline underline-offset-4">Send this brief with my email app instead</a>
                </form>
            </section>
        </div>
    );
}
