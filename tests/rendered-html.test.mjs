import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("builds the public SNIAJ page", async () => {
  const html = await readFile(new URL("../docs/index.html", import.meta.url), "utf8");
  assert.match(html, /<title>SNIAJ Sonora \+ CDMX<\/title>/i);
  assert.match(html, /\/sniaj-sonora-cdmx-app\/assets\//);
});
