// prisma/seed/versions/v1.1.0.ts
//
// Author data update on top of v1.0.0 (which is immutable):
//  - adds the job title (role) in three languages,
//  - replaces the placeholder social links and the contact email with the
//    real Tarvix ones,
//  - removes the placeholder Twitter link (no real account yet).
//
// Every change is a compare-and-set: it applies only while the field still holds
// the value v1.0.0 wrote (or is still empty), so an administrator edit is never
// overwritten. The website link already has its final value in v1.0.0.

import type { Prisma } from "@prisma/client";
import type { SeedVersion } from "../types";
import { describeCompareAndSet } from "../utils/helpers";
import { author as v1Author } from "./v1.0.0";

const SLUG = v1Author.slug;

export const v1_1_0: SeedVersion = {
  version: "v1.1.0",
  description: "Author: job title, real social links and contact email",
  async run(tx, ctx) {
    async function compareAndSet(
      label: string,
      where: Prisma.AuthorWhereInput,
      data: Prisma.AuthorUpdateManyMutationInput,
    ): Promise<void> {
      const result = await tx.author.updateMany({ where: { slug: SLUG, ...where }, data });
      ctx.log.info(describeCompareAndSet(`Author ${SLUG} ${label}`, result.count));
    }

    await compareAndSet("roleEn", { roleEn: null }, { roleEn: "Software Engineer" });
    await compareAndSet("roleFa", { roleFa: null }, { roleFa: "مهندس نرم‌افزار" });
    await compareAndSet("roleAr", { roleAr: "" }, { roleAr: "مهندس برمجيات" });

    await compareAndSet(
      "github",
      { github: v1Author.github },
      { github: "https://github.com/tarvix" },
    );
    await compareAndSet(
      "linkedin",
      { linkedin: v1Author.linkedin },
      { linkedin: "https://www.linkedin.com/company/tarvix/" },
    );
    await compareAndSet("twitter", { twitter: v1Author.twitter }, { twitter: null });
    await compareAndSet("email", { email: v1Author.email }, { email: "contact@tarvix.org" });
  },
};
