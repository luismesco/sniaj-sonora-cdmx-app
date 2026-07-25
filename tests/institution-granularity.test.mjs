import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const dataset = JSON.parse(
  await readFile(
    new URL("../data/processed/app_universities_sonora_cdmx.json", import.meta.url),
    "utf8",
  ),
);

test("publishes one record per official institution, not per department", () => {
  const keys = dataset.records.map((item) => `${item.territory}:${item.name}`);
  assert.equal(new Set(keys).size, dataset.records.length);
  assert.equal(dataset.recordCount, 360);

  const itson = dataset.records.filter(
    (item) =>
      item.territory === "Sonora" &&
      item.name === "INSTITUTO TECNOLÓGICO DE SONORA",
  );
  assert.equal(itson.length, 1);
  assert.equal(itson[0].unitCount, 15);
  assert.ok(
    itson[0].reportedUnits.some((unit) =>
      unit.includes("DEPARTAMENTO DE INGENIERÍA CIVIL"),
    ),
  );
});

test("rolls program and Derecho evidence up to the institution", () => {
  const itson = dataset.records.find(
    (item) =>
      item.territory === "Sonora" &&
      item.name === "INSTITUTO TECNOLÓGICO DE SONORA",
  );
  assert.equal(itson.lawStatus, "Si");
  assert.ok(itson.programCount > 1);
  assert.ok(itson.lawProgramCount > 0);
});
