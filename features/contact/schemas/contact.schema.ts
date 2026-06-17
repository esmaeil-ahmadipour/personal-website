import { z } from "zod";

export const ContactSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  service: z.enum([
    "flutter",
    "web",
    "web3",
    "consulting",
    "foundation",
    "audit",
  ]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactData = z.infer<typeof ContactSchema>;
