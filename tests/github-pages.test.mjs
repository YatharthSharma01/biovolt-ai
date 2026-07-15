import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("GitHub Pages build has a deployable root document", async () => {
  const html = await readFile("github-dist/index.html", "utf8");

  assert.match(html, /<div id="root"><\/div>/);
  assert.match(html, /\.\/assets\/[^\"]+\.js/);
  assert.match(html, /BioVolt AI \| MFC Digital Twin/);
});

test("historical MFC images are included in the static artifact", async () => {
  await Promise.all([
    access("github-dist/images/historical-mfc-setup.png"),
    access("github-dist/images/graphite-electrodes.png"),
    access("github-dist/images/voltage-evidence.png"),
    access("github-dist/og.png"),
  ]);
});
