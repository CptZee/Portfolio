import { z } from "zod";

export const serviceInquirySchema = z.object({
    serviceId: z.string().min(1).max(80),
    name: z.string().trim().min(2, "Please enter your name.").max(100),
    email: z.string().trim().email("Please enter a valid email.").max(254),
    message: z.string().trim().min(20, "Please share at least 20 characters about your project.").max(5000),
    website: z.string().max(0),
});

export const serviceEmail = "ajmission28@gmail.com";

export function inquiryText(service: string, name: string, email: string, message: string) {
    return `Service: ${service}\nName: ${name}\nEmail: ${email}\n\nProject brief:\n${message}`;
}
