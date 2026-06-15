// app/api/request-access/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema
const RequestAccessSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format"),
  role: z.string().optional(),
  company: z.string().optional(),
  githubUsername: z
    .string()
    .min(1, "GitHub username is required")
    .regex(
      /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,
      "Invalid GitHub username format"
    ),
  preferredStack: z.enum(["flutter", "react", "django", "nestjs"]).default("flutter"),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();

    // Validate with Zod
    const validated = RequestAccessSchema.parse(body);

    // Store in database using Prisma
    const request = await prisma.requestAccess.create({
      data: {
        fullName: validated.fullName,
        email: validated.email,
        role: validated.role || null,
        company: validated.company || null,
        githubUsername: validated.githubUsername,
        preferredStack: validated.preferredStack,
        message: validated.message || null,
        status: "pending",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Request received successfully",
        data: {
          id: request.id,
          status: request.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("Request access error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}