// src/types/api.ts
import { z } from "zod";

// ============================================
// Role Enum for Global Type Safety
// ============================================

export const UserRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  BRANCH_ADMIN: "BRANCH_ADMIN",
  EMPLOYEE_COUNTER: "EMPLOYEE_COUNTER",
  EMPLOYEE_SUPPORT_AGENT: "EMPLOYEE_SUPPORT_AGENT",
  EMPLOYEE_WAREHOUSE: "EMPLOYEE_WAREHOUSE",
  CUSTOMER: "CUSTOMER",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

// ============================================
// Base Standards (Base Contracts)
// ============================================

export interface ActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
}

// ============================================
// Standard Error Codes (Error Catalog)
// ============================================

export const ErrorCodes = {
  // Auth errors (1000-1999)
  UNAUTHORIZED: "AUTH_1000",
  INVALID_CREDENTIALS: "AUTH_1001",
  TOKEN_EXPIRED: "AUTH_1002",
  ACCOUNT_DISABLED: "AUTH_1003",
  ACCESS_DENIED: "AUTH_1004",
  INVALID_LOGIN_SOURCE: "AUTH_1005",

  // Branch errors (2000-2999)
  BRANCH_NOT_FOUND: "BRANCH_2000",
  BRANCH_ALREADY_EXISTS: "BRANCH_2001",
  BRANCH_HAS_STAFF: "BRANCH_2002",
  INVALID_CITY: "BRANCH_2003",

  // Staff errors (3000-3999)
  STAFF_NOT_FOUND: "STAFF_3000",
  STAFF_ALREADY_EXISTS: "STAFF_3001",
  CROSS_BRANCH_ACCESS: "STAFF_3002",
  STAFF_ACCESS_DENIED: "STAFF_3003",

  // Inventory errors (4000-4999)
  INVENTORY_NOT_FOUND: "INV_4000",
  INSUFFICIENT_STOCK: "INV_4001",
  RESERVED_EXCEEDS_QUANTITY: "INV_4002",
  INVENTORY_ACCESS_DENIED: "INV_4003",
  // Order errors (5000-5999)
  ORDER_NOT_FOUND: "ORDER_5000",
  INVALID_ORDER_STATUS: "ORDER_5001",

  // Product errors (6000-6499)
  PRODUCT_NOT_FOUND: "PRD_6000",
  PRODUCT_INACTIVE: "PRD_6001",
  PRODUCT_SKU_EXISTS: "PRD_6002",

  // Reservation errors (6500-6999)
  RESERVATION_NOT_FOUND: "RES_6501",
  RESERVATION_EXPIRED: "RES_6502",

  // General errors (9000-9999)
  VALIDATION_ERROR: "GEN_9000",
  INTERNAL_ERROR: "GEN_9999",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

// ============================================
// User-friendly Error Messages
// ============================================

export const ErrorMessages: Record<ErrorCode, string> = {
  // Auth
  [ErrorCodes.UNAUTHORIZED]: "Please login to continue",
  [ErrorCodes.INVALID_CREDENTIALS]: "Invalid email or password",
  [ErrorCodes.TOKEN_EXPIRED]: "Session expired. Please login again",
  [ErrorCodes.ACCOUNT_DISABLED]: "Your account has been disabled",
  [ErrorCodes.ACCESS_DENIED]:
    "You don't have permission to access this resource",
  [ErrorCodes.INVALID_LOGIN_SOURCE]: "Please login from the correct portal",

  // Branch
  [ErrorCodes.BRANCH_NOT_FOUND]: "Branch not found",
  [ErrorCodes.BRANCH_ALREADY_EXISTS]: "Branch with this code already exists",
  [ErrorCodes.BRANCH_HAS_STAFF]: "Cannot delete branch with existing staff",
  [ErrorCodes.INVALID_CITY]: "Selected city is not valid",

  // Staff
  [ErrorCodes.STAFF_NOT_FOUND]: "Staff member not found",
  [ErrorCodes.STAFF_ALREADY_EXISTS]: "User with this email already exists",
  [ErrorCodes.STAFF_ACCESS_DENIED]: "Staff member not found or access denied",
  [ErrorCodes.CROSS_BRANCH_ACCESS]: "Cannot access staff from another branch",

  // Inventory
  [ErrorCodes.INVENTORY_NOT_FOUND]: "Inventory record not found",
  [ErrorCodes.INSUFFICIENT_STOCK]: "Insufficient stock available",
  [ErrorCodes.RESERVED_EXCEEDS_QUANTITY]:
    "Reserved quantity cannot exceed available stock",
  [ErrorCodes.INVENTORY_ACCESS_DENIED]:
    "Inventory item not found or access denied",

  // Order
  [ErrorCodes.ORDER_NOT_FOUND]: "Order not found",
  [ErrorCodes.INVALID_ORDER_STATUS]: "Invalid order status transition",

  // Product
  [ErrorCodes.PRODUCT_NOT_FOUND]: "Product not found",
  [ErrorCodes.PRODUCT_INACTIVE]: "Product is no longer active",
  [ErrorCodes.PRODUCT_SKU_EXISTS]: "A product with this SKU already exists",

  // Reservation
  [ErrorCodes.RESERVATION_NOT_FOUND]: "Reservation not found or expired",
  [ErrorCodes.RESERVATION_EXPIRED]:
    "Your reservation has expired. Please try again",

  // General
  [ErrorCodes.VALIDATION_ERROR]: "Validation failed",
  [ErrorCodes.INTERNAL_ERROR]: "Something went wrong. Please try again",
};

// ============================================
// Validation Schemas
// ============================================

export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: UserRoleType;
    branchId: string | null;
  };
  token: string;
}

export const RegisterRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
  role: z
    .enum([
      UserRole.BRANCH_ADMIN,
      UserRole.EMPLOYEE_COUNTER,
      UserRole.EMPLOYEE_SUPPORT_AGENT,
      UserRole.EMPLOYEE_WAREHOUSE,
    ])
    .optional(),
  branchId: z.string().cuid().optional(),
  cityId: z.string().cuid().optional(),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: UserRoleType;
    branchId: string | null;
    cityId: string | null;
  };
  token?: string;
}


// ============================================
// Role Hierarchy & Access Control
// ============================================

// Roles that BRANCH_ADMIN can act as a substitute for
const BRANCH_ADMIN_CAN_ACT_AS: UserRoleType[] = [
  UserRole.EMPLOYEE_COUNTER,
  UserRole.EMPLOYEE_WAREHOUSE,
  UserRole.EMPLOYEE_SUPPORT_AGENT,
];

/**
 Checks whether a user with a given role can access a required role  
 */
export function canAccess(
  userRole: UserRoleType,
  requiredRole: UserRoleType,
): boolean {
  // Rule 1: Exact role match
  if (userRole === requiredRole) return true;

  // Rule 2: Super admin has access to everything
  if (userRole === UserRole.SUPER_ADMIN) return true;

  // Rule 3: Branch admin can substitute employee roles
  if (
    userRole === UserRole.BRANCH_ADMIN &&
    BRANCH_ADMIN_CAN_ACT_AS.includes(requiredRole)
  ) {
    return true;
  }

  // Rule 4: All other cases are denied
  return false;
}


// ============================================
// Helper function to get error message
// ============================================

export function getErrorMessage(
  code?: ErrorCode,
  defaultMessage?: string,
): string {
  if (code && ErrorMessages[code]) {
    return ErrorMessages[code];
  }
  return defaultMessage || ErrorMessages[ErrorCodes.INTERNAL_ERROR];
}
