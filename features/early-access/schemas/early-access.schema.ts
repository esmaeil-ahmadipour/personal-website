import { z } from "zod";

export const EarlyAccessSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  workEmail: z.string().email("Valid email is required"),
  roleTitle: z.string().optional(),
  companyTeam: z.string().optional(),
  ghUsername: z
    .string()
    .min(1, "GitHub username is required")
    .regex(
      /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,
      "Invalid GitHub username format",
    ),
  prefStack: z.enum(["flutter", "react", "django", "nestjs"]),
  whyAccess: z.string().optional(),
});

export type EarlyAccessData = z.infer<typeof EarlyAccessSchema>;
