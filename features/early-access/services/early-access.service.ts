import { prisma } from "@/lib/prisma";
import {
  EarlyAccessSchema,
  type EarlyAccessData,
} from "../schemas/early-access.schema";

export async function createEarlyAccessRequest(
  data: EarlyAccessData,
  userId?: string,
) {
  const validated = EarlyAccessSchema.parse(data);

  return prisma.$transaction(async (tx) => {
    const request = await tx.requestAccess.create({
      data: {
        fullName: validated.fullName,
        email: validated.workEmail,
        role: validated.roleTitle || null,
        company: validated.companyTeam || null,
        githubUsername: validated.ghUsername,
        preferredStack: validated.prefStack,
        message: validated.whyAccess || null,
        status: "pending",
      },
    });

    // Audit log (اختیاری)
    // await tx.auditLog.create({...});

    return request;
  });
}
