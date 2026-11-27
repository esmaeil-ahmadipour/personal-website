import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { approveEntries, approveTarget, verifyPins } from "../content/manifest";
import { ContentError } from "../content/types";

const HASH_A = "a".repeat(64);
const HASH_B = "b".repeat(64);

describe("manifest entries of other kinds", () => {
  it("builds the approve argument: bare for posts, prefixed for the rest", () => {
    assert.equal(approveTarget("post", "hello"), "hello");
    assert.equal(approveTarget("newsletter", "5"), "newsletter:5");
    assert.equal(approveTarget("project", "demo"), "project:demo");
  });

  it("pins a newsletter issue and a project at their current hash", () => {
    const issues = approveEntries([{ slug: "4", sourceHash: HASH_B }], [{ slug: "5", sourceHash: HASH_A }], ["5"], "newsletter");
    assert.deepEqual(issues, [{ slug: "4", sourceHash: HASH_B }, { slug: "5", sourceHash: HASH_A }]);
    const projects = approveEntries([], [{ slug: "demo", sourceHash: HASH_A }], ["demo"], "project");
    assert.deepEqual(projects, [{ slug: "demo", sourceHash: HASH_A }]);
  });

  it("names the kind and directory of an unknown target", () => {
    assert.throws(
      () => approveEntries([], [], ["9"], "newsletter"),
      (error: unknown) =>
        error instanceof ContentError && error.issues[0] === 'No newsletter issue "9" in content/newsletter.',
    );
    assert.throws(
      () => approveEntries([], [], ["x"], "project"),
      (error: unknown) => error instanceof ContentError && error.issues[0] === 'No project "x" in content/projects.',
    );
    assert.throws(
      () => approveEntries([], [], ["x"]),
      (error: unknown) => error instanceof ContentError && error.issues[0] === 'No post "x" in content/posts.',
    );
  });

  it("reports unpinned and changed entries with the kind-specific fix", () => {
    const problems = verifyPins(
      [{ slug: "5" }, { slug: "6", sourceHash: HASH_A }],
      [{ slug: "5", sourceHash: HASH_A }, { slug: "6", sourceHash: HASH_B }],
      "newsletter",
    );
    assert.equal(problems.length, 2);
    assert.match(problems[0], /newsletter "5" is not approved.*pnpm content:approve newsletter:5/);
    assert.match(problems[1], /newsletter "6" changed since it was approved.*pnpm content:approve newsletter:6/);
  });

  it("keeps the post messages unchanged", () => {
    const [problem] = verifyPins([{ slug: "hello" }], [{ slug: "hello", sourceHash: HASH_A }]);
    assert.equal(problem, 'manifest.json: "hello" is not approved; review it, then run: pnpm content:approve hello');
  });
});
