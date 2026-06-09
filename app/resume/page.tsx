"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ResumePage() {
    useEffect(() => {
        redirect("/MISSION_AARON_JAMES-RESUME.pdf");
    }, []);
    return <div>Redirecting to the resume...</div>;
}
