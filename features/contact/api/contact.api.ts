import type { ContactData } from "../schemas/contact.schema";

export async function submitContact(data: ContactData) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit contact request");
  }

  return result;
}
