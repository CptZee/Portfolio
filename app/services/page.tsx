import type { Metadata } from "next";
import { connection } from "next/server";
import PageContainer from "@/components/common/page-container";
import { ServiceStorefront } from "@/components/services/service-storefront";
import { getServices } from "@/lib/services";

export const metadata: Metadata = {
    title: "Services",
    description: "Websites, ecommerce stores, games, and mobile apps built by Aaron James Mission. Explore development packages and request a quote.",
};

export default async function ServicesPage() {
    await connection();
    const catalog = await getServices();
    return (
        <PageContainer title="Let's build your next idea." description="Websites, games, and mobile apps. Choose a starting point and let's bring your idea to life.">
            <ServiceStorefront services={catalog} />
        </PageContainer>
    );
}
