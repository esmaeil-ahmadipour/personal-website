import { NextRequest, NextResponse } from "next/server";
import { createEarlyAccessRequest } from "@/features/early-access/services/early-access.service";
import { EarlyAccessSchema } from "@/features/early-access/schemas/early-access.schema";
import { ActionResponseBuilder } from "@/lib/response-builder";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = EarlyAccessSchema.parse(body);
    const result = await createEarlyAccessRequest(validated);

    return NextResponse.json(
      {
        success: true,
        message: "Request submitted successfully",
        data: result,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return new ActionResponseBuilder()
        .setError(error.message)
        .setStatus(400)
        .build();
    }
    return new ActionResponseBuilder()
      .setError("Internal server error")
      .setStatus(500)
      .build();
  }
}
