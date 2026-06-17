import type { EarlyAccessData } from "../schemas/early-access.schema";

export async function submitEarlyAccess(data: EarlyAccessData) {
  const response = await fetch("/api/request-access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to submit request");
  }

  return response.json();
}
