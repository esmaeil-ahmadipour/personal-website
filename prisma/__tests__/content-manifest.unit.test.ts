import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { approveEntries, serializeManifest, toEntries, verifyPins } from "../content/manifest";
import { parseManifest } from "../content/parse";
import { ContentError } from "../content/types";

const H1 = "a".repeat(64);
const H2 = "b".repeat(64);
const posts = [
  { slug: "alpha", sourceHash: H1 },
  { slug: "beta", sourceHash: H2 },
];

describe("manifest parsing", () => {
  it("accepts bare slugs and pinned objects", () => {
    const parsed = parseManifest(JSON.stringify({ posts: ["alpha", { slug: "beta", sourceHash: H2 }] }));
    assert.deepEqual(toEntries(parsed.posts), [{ slug: "alpha" }, { slug: "beta", sourceHash: H2 }]);
  });

  it("rejects malformed hashes, extra keys, bad slugs and non-entries", () => {
    const bad = [
      { posts: [{ slug: "alpha", sourceHash: "abc" }] },
      { posts: [{ slug: "alpha", sourceHash: H1.toUpperCase() }] },
      { posts: [{ slug: "alpha", sourceHash: H1, extra: true }] },
      { posts: [{ slug: "Not A Slug", sourceHash: H1 }] },
      { posts: [42] },
    ];
    for (const manifest of bad) {
      assert.throws(() => parseManifest(JSON.stringify(manifest)), ContentError, JSON.stringify(manifest));
    }
  });
});

describe("pin verification", () => {
  it("passes when every entry is pinned to the current hash", () => {
    const entries = [{ slug: "alpha", sourceHash: H1 }, { slug: "beta", sourceHash: H2 }];
    assert.deepEqual(verifyPins(entries, posts), []);
    assert.deepEqual(verifyPins([], posts), []);
  });

  it("reports unpinned entries and changed content, naming the fix", () => {
    const problems = verifyPins([{ slug: "alpha" }, { slug: "beta", sourceHash: H1 }], posts);
    assert.equal(problems.length, 2);
    assert.match(problems[0], /"alpha" is not approved.*pnpm content:approve alpha/);
    assert.match(problems[1], /"beta" changed since it was approved \(approved aaaaaaaaaaaa, now bbbbbbbbbbbb\)/);
  });

  it("leaves a missing post directory to the content validation", () => {
    assert.deepEqual(verifyPins([{ slug: "gone", sourceHash: H1 }], posts), []);
  });
});

describe("approving", () => {
  it("pins new and unpinned entries and re-pins changed ones, keeping the rest", () => {
    const entries = [{ slug: "alpha", sourceHash: H2 }, { slug: "beta" }];
    const next = approveEntries(entries, posts, ["alpha", "alpha"]);
    assert.deepEqual(next, [{ slug: "alpha", sourceHash: H1 }, { slug: "beta" }]);
    assert.deepEqual(approveEntries([], posts, ["beta"]), [{ slug: "beta", sourceHash: H2 }]);
  });

  it("refuses slugs that are not posts and does not modify its input", () => {
    const entries = [{ slug: "alpha", sourceHash: H1 }];
    assert.throws(() => approveEntries(entries, posts, ["missing"]), /No post "missing"/);
    approveEntries(entries, posts, ["beta"]);
    assert.deepEqual(entries, [{ slug: "alpha", sourceHash: H1 }]);
  });
});

describe("serializing", () => {
  it("writes sorted, stable JSON with a trailing newline and round-trips", () => {
    const text = serializeManifest([{ slug: "beta", sourceHash: H2 }, { slug: "alpha" }]);
    assert.equal(
      text,
      `{\n  "posts": [\n    "alpha",\n    {\n      "slug": "beta",\n      "sourceHash": "${H2}"\n    }\n  ]\n}\n`,
    );
    assert.deepEqual(toEntries(parseManifest(text).posts), [{ slug: "alpha" }, { slug: "beta", sourceHash: H2 }]);
  });

  it("serializes an empty manifest like the file in the repository", () => {
    assert.equal(serializeManifest([]), '{\n  "posts": []\n}\n');
  });
});
