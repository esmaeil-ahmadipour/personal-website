#!/usr/bin/env ts-node
// scripts/validate-env.ts

/**
 * Environment validation script
 * Run during build and startup
 */

interface EnvValidationRule {
  key: string;
  required: boolean;
  validator?: (value: string) => boolean;
  message?: string;
  productionOnly?: boolean;
}

const validationRules: EnvValidationRule[] = [
  {
    key: "JWT_SECRET",
    required: true,
    validator: (value) => value.length >= 32,
    message: "JWT_SECRET must be at least 32 characters long",
  },
  {
    key: "DATABASE_URL",
    required: true,
    validator: (value) => value.startsWith("postgresql://"),
    message: "DATABASE_URL must be a valid PostgreSQL connection string",
  },
  {
    key: "NODE_ENV",
    required: false,
    validator: (value) => ["development", "production", "test"].includes(value),
    message: "NODE_ENV must be development, production, or test",
  },
  {
    key: "NEXT_PUBLIC_APP_URL",
    required: true,
    validator: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message: "NEXT_PUBLIC_APP_URL must be a valid URL",
  },
];

function validateEnvironment(): void {
  console.log("\n🔍 Validating environment variables...\n");

  const errors: string[] = [];
  const warnings: string[] = [];

  for (const rule of validationRules) {
    const value = process.env[rule.key];

    // Skip production-only rules in development
    if (rule.productionOnly && process.env.NODE_ENV !== "production") {
      continue;
    }

    // Validate if value exists and validator provided
    if (value && rule.validator && !rule.validator(value)) {
      errors.push(`❌ Invalid ${rule.key}: ${rule.message}`);
    }

    // Warning for missing optional in production
    if (!value && !rule.required && process.env.NODE_ENV === "production") {
      warnings.push(`⚠️  Missing optional variable in production: ${rule.key}`);
    }
  }

  // Output results
  if (warnings.length > 0) {
    console.log("⚠️  Warnings:");
    warnings.forEach((w) => console.log(`  ${w}`));
    console.log();
  }

  if (errors.length > 0) {
    console.log("❌ Errors:");
    errors.forEach((e) => console.log(`  ${e}`));
    console.log("\n💡 Generate a secure JWT_SECRET with:");
    console.log("   pnpm generate:secret");
    console.log("   or");
    console.log(
      "   node -e \"console.log(crypto.randomBytes(32).toString('hex'))\"",
    );
    console.log();
    process.exit(1);
  }

  console.log("✅ All environment variables are valid!\n");
}

// Run validation
validateEnvironment();
