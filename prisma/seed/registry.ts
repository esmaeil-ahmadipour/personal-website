// prisma/seed/registry.ts
//
// The ordered list of system seed versions. To add a version:
//   1. create prisma/seed/versions/vX.Y.Z.ts exporting a SeedVersion,
//   2. append it to `seedVersions` below (strictly ascending order).
// Released versions are immutable.

import type { SeedVersion } from "./types";
import { v1_0_0 } from "./versions/v1.0.0";
import { v1_1_0 } from "./versions/v1.1.0";

export const seedVersions: readonly SeedVersion[] = [v1_0_0, v1_1_0];

const VERSION_PATTERN = /^v(\d+)\.(\d+)\.(\d+)$/;

export function parseSeedVersion(version: string): [number, number, number] {
  const match = VERSION_PATTERN.exec(version);
  if (!match) {
    throw new Error(
      `Invalid seed version "${version}": expected the format vMAJOR.MINOR.PATCH (for example v1.2.0).`,
    );
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/** Negative when a < b, zero when equal, positive when a > b. */
export function compareSeedVersions(a: string, b: string): number {
  const left = parseSeedVersion(a);
  const right = parseSeedVersion(b);
  for (let i = 0; i < 3; i++) {
    if (left[i] !== right[i]) return left[i] - right[i];
  }
  return 0;
}

export function validateSeedVersions(versions: readonly SeedVersion[]): void {
  const seen = new Set<string>();
  let previous: string | null = null;
  for (const entry of versions) {
    parseSeedVersion(entry.version);
    if (seen.has(entry.version)) {
      throw new Error(`Duplicate seed version "${entry.version}" in the registry.`);
    }
    seen.add(entry.version);
    if (previous !== null && compareSeedVersions(previous, entry.version) >= 0) {
      throw new Error(
        `Seed versions must be listed in strictly ascending order: "${entry.version}" comes after "${previous}".`,
      );
    }
    previous = entry.version;
    if (!entry.description.trim()) {
      throw new Error(`Seed version "${entry.version}" needs a description.`);
    }
  }
}
