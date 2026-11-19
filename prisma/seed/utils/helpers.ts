// prisma/seed/utils/helpers.ts
//
// Small helpers for writing seed versions. Deliberately no generic "upsert":
// a blind upsert overwrites administrator edits, which this system must never do.
//
// Inserting new records (never touches existing rows):
//   const result = await tx.category.createMany({ data: rows, skipDuplicates: true });
//   ctx.log.info(describeInsert("Category", result.count, rows.length));
//
// Intentional update of an existing system record (only in a NEW version file):
//   const result = await tx.category.updateMany({
//     where: { slug: "engineering", nameEn: "Engineering" }, // still the known old value
//     data: { nameEn: "Software Engineering" },              // only the intended field
//   });
//   ctx.log.info(describeCompareAndSet("Category engineering nameEn", result.count));
// If an administrator already changed the value, `where` matches nothing and the
// record is left alone.
//
// Retiring a record: set isActive to false the same way (never delete).

export function describeInsert(
  label: string,
  inserted: number,
  total: number,
): string {
  const existing = total - inserted;
  return `${label}: ${inserted} inserted, ${existing} already present (left untouched)`;
}

export function describeCompareAndSet(label: string, matched: number): string {
  return matched > 0
    ? `${label}: updated (${matched} row${matched === 1 ? "" : "s"})`
    : `${label}: skipped (value no longer matches the expected old value)`;
}
