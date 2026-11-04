import type { Metadata } from "next";
import { connection } from "next/server";
import PageContainer from "@/components/common/page-container";
import { ServiceStorefront } from "@/components/services/service-storefront";
import { getServices } from "@/lib/services";

export const metadata: Metadata = {
    title: "Services",
    description: "Personal websites, business websites, and ecommerce stores built by Aaron James Mission. Explore packages and request a quote.",
};

export default async function ServicesPage() {
    await connection();
    const catalog = await getServices();
    return (
        <PageContainer title="Let's build your next idea." description="Choose a starting point. I'll take care of turning it into a website that feels like you.">
            <ServiceStorefront services={catalog} />
        </PageContainer>
    );
}
