import type { Metadata } from "next";
import { connection } from "next/server";
import PageContainer from "@/components/common/page-container";
import { ServiceStorefront } from "@/components/services/service-storefront";
import { getServices } from "@/lib/services";
import { Suspense } from "react";
import { SectionLoading } from "@/components/common/page-loading";

export const metadata: Metadata = {
    title: "Services",
    description: "Websites, ecommerce stores, games, and mobile apps built by Aaron James Mission. Explore development packages and request a quote.",
};

async function ServiceContent() {
    await connection();
    const catalog = await getServices();
    return <ServiceStorefront services={catalog} />;
}

export default function ServicesPage() {
    return (
        <PageContainer title="Let's build your next idea." description="Websites, games, and mobile apps. Choose a starting point and let's bring your idea to life.">
            <Suspense fallback={<SectionLoading label="Loading service packages" />}>
                <ServiceContent />
            </Suspense>
        </PageContainer>
    );
}
