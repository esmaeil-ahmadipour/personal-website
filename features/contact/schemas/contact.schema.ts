import { z } from "zod";

/** Stored in Contact.service (a free String column, so no migration needed). */
export const CONTACT_TOPICS = [
  "mobile",
  "engineering",
  "fintech",
  "education",
  "site",
  "suggest",
] as const;

// Messages are error codes; the form maps them to translated text.
export const ContactSchema = z.object({
  fullName: z.string().trim().min(2, "name"),
  email: z.string().trim().email("email"),
  service: z.enum(CONTACT_TOPICS, { errorMap: () => ({ message: "topic" }) }),
  message: z.string().trim().min(10, "message").max(5000, "message"),
  // Honeypot, must stay empty (checked in the API route, never stored).
  website: z.string().optional(),
});

export type ContactData = z.infer<typeof ContactSchema>;
