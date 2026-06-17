// src/lib/api/action-response-builder.ts
import { NextResponse } from "next/server";
import type { ActionResponse, ErrorCode } from "@/types/api";
import { ErrorMessages } from "@/types/api";

export class ActionResponseBuilder {
  /**
   * پاسخ موفقیت‌آمیز
   */
  static success<T>(
    data?: T,
    message?: string,
    status: number = 200,
  ): NextResponse<ActionResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        message: message || "Operation completed successfully",
        data,
      },
      { status },
    );
  }

  /**
   * پاسخ خطا - بدون اطلاعات فنی
   */
  static error(
    code: ErrorCode | string,
    customMessage?: string,
    status: number = 400,
  ): NextResponse<ActionResponse> {
    const message = customMessage || ErrorMessages[code as ErrorCode] || "Operation failed";
    
    return NextResponse.json(
      {
        success: false,
        code,
        message,
      },
      { status },
    );
  }

  /**
   * خطای موجودی ناکافی (409) با جزئیات
   */
  static insufficientStock(
    errors?: unknown,
    customMessage?: string,
  ): NextResponse<ActionResponse> {
    const response: any = {
      success: false,
      code: "INSUFFICIENT_STOCK",
      message: customMessage || "برخی محصولات موجودی کافی ندارند",
    };

    // فقط در صورت وجود خطاها، آنها را اضافه کن
    if (errors) {
      response.errors = errors;  // استفاده از فیلد errors به جای details
    }
    
    return NextResponse.json(response, { status: 409 });
  }

  /**
   * خطای اعتبارسنجی (Validation Error)
   */
  static validationError(
    errors: unknown,
  ): NextResponse<ActionResponse> {
    return NextResponse.json(
      {
        success: false,
        code: "GEN_9000",
        message: "Validation failed",
        errors,  // استفاده از errors
      },
      { status: 400 },
    );
  }

  /**
   * منبع پیدا نشد (404)
   */
  static notFound(resource: string): NextResponse<ActionResponse> {
    return NextResponse.json(
      {
        success: false,
        code: "GEN_9001",
        message: `${resource} not found`,
      },
      { status: 404 },
    );
  }

  /**
   * خطای داخلی سرور - بدون جزئیات فنی
   */
  static internalError(): NextResponse<ActionResponse> {
    return NextResponse.json(
      {
        success: false,
        code: "GEN_9999",
        message: ErrorMessages["GEN_9999"],
      },
      { status: 500 },
    );
  }

  /**
   * خطای احراز هویت (401)
   */
  static unauthorized(message?: string): NextResponse<ActionResponse> {
    return NextResponse.json(
      {
        success: false,
        code: "AUTH_1000",
        message: message || ErrorMessages["AUTH_1000"],
      },
      { status: 401 },
    );
  }

  /**
   * خطای دسترسی ممنوع (403)
   */
  static forbidden(message?: string): NextResponse<ActionResponse> {
    return NextResponse.json(
      {
        success: false,
        code: "AUTH_1004",
        message: message || ErrorMessages["AUTH_1004"],
      },
      { status: 403 },
    );
  }
}