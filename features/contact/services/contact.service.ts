import { prisma } from "@/lib/prisma";
import { ContactSchema, type ContactData } from "../schemas/contact.schema";

export async function createContactRequest(data: ContactData) {
  // ۱. اعتبارسنجی با Zod
  const validated = ContactSchema.parse(data);

  // ۲. ذخیره در دیتابیس
  const contact = await prisma.contact.create({
    data: {
      fullName: validated.fullName,
      email: validated.email,
      service: validated.service,
      message: validated.message,
      status: "pending",
    },
  });

  return contact;
}
