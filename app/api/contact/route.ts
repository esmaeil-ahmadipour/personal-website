import { NextRequest, NextResponse } from "next/server";
import { createContactRequest } from "@/features/contact/services/contact.service";
import { ContactSchema } from "@/features/contact/schemas/contact.schema";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    // ۱. دریافت و اعتبارسنجی
    const body = await req.json();
    const validated = ContactSchema.parse(body);

    // ۲. ذخیره در دیتابیس
    const result = await createContactRequest(validated);

    // ۳. پاسخ موفقیت
    return NextResponse.json(
      {
        success: true,
        message: "Contact request submitted successfully",
        data: result,
      },
      { status: 201 },
    );
  } catch (error) {
    // ۴. خطای اعتبارسنجی Zod
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
        { status: 400 },
      );
    }

    // ۵. سایر خطاها
    console.error("Contact API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 },
    );
  }
}
