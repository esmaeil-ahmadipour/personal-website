import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAdminAuthorized, requireAdmin } from "../admin-auth";

const TOKEN = "k".repeat(40);
const env = { ADMIN_API_TOKEN: TOKEN };

describe("admin auth", () => {
  it("accepts the exact bearer token", () => {
    assert.equal(isAdminAuthorized(`Bearer ${TOKEN}`, env), true);
  });

  it("rejects wrong, same-length wrong, missing and non-bearer credentials", () => {
    assert.equal(isAdminAuthorized(`Bearer ${"x".repeat(40)}`, env), false);
    assert.equal(isAdminAuthorized(`Bearer ${TOKEN}x`, env), false);
    assert.equal(isAdminAuthorized(null, env), false);
    assert.equal(isAdminAuthorized("", env), false);
    assert.equal(isAdminAuthorized(`Basic ${TOKEN}`, env), false);
    assert.equal(isAdminAuthorized(TOKEN, env), false);
  });

  it("fails closed when the token is unset, empty or shorter than 32 characters", () => {
    assert.equal(isAdminAuthorized(`Bearer ${TOKEN}`, {}), false);
    assert.equal(isAdminAuthorized("Bearer ", { ADMIN_API_TOKEN: "" }), false);
    assert.equal(isAdminAuthorized("Bearer short", { ADMIN_API_TOKEN: "short" }), false);
  });

  it("requireAdmin returns null when authorized and a 401 without echoing the token otherwise", async () => {
    const ok = new Request("http://x/api", { headers: { authorization: `Bearer ${TOKEN}` } });
    assert.equal(requireAdmin(ok, env), null);

    const bad = new Request("http://x/api", { headers: { authorization: "Bearer nope" } });
    const res = requireAdmin(bad, env);
    assert.ok(res);
    assert.equal(res.status, 401);
    assert.equal(res.headers.get("www-authenticate"), "Bearer");
    const text = await res.text();
    assert.ok(!text.includes(TOKEN));
    assert.deepEqual(JSON.parse(text), { success: false, message: "Unauthorized" });
  });
});
