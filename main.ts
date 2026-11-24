// Funniest Time Machine Warning Label
// make.fun bounty: u-eager-stork-81-9647-funniest-time-machine-warning-f8add151
//
// The entry is a single one-line warning label for a time machine, at most
// 120 characters. The program writes it to /output/entry.txt, where the
// sealed gate scorer checks it is UTF-8 text of 1-120 characters.
//
// The joke, written to the judge's brief:
//   1. It IS a time machine warning label, phrased like a real safety notice.
//   2. It turns a real hazard of time travel - meeting your duplicate self -
//      into the joke, instead of naming the paradox flatly.
//   3. It saves the surprise for the last few words ("you are not in it").
//   4. It keeps a straight face throughout: official, calm, bureaucratic.
//   5. Every phrase does work inside the 120-character limit.

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry line. 111 characters, one line, no trailing newline in the file
// (the gate counts characters, so the file holds exactly this text).
const ENTRY =
  "WARNING: Do not meet yourself. If you do, do not wave. " +
  "The warranty covers one timeline, and you are not in it.";

const MAX_CHARS = 120;
const OUTPUT_DIR = process.env.OUTPUT_DIR ?? "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

function clearOutputDir(dir: string): void {
  // Create the directory when it does not exist; clear only the files
  // inside it. Never remove the directory itself: the grader mounts it
  // and runs as an unprivileged user, so removing it fails the run.
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }
}

function validate(line: string): void {
  // Count code points, not UTF-16 units, so the check matches the gate's
  // character count even if the label ever gains non-ASCII punctuation.
  const chars = [...line].length;
  if (chars === 0 || chars > MAX_CHARS) {
    throw new Error(`Entry must be 1-${MAX_CHARS} characters, got ${chars}.`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Entry must be a single line.");
  }
  if (line !== line.trim()) {
    throw new Error("Entry must not start or end with whitespace.");
  }
}

function main(): void {
  const line = ENTRY.trim();
  validate(line);
  clearOutputDir(OUTPUT_DIR);
  writeFileSync(OUTPUT_FILE, line, "utf8");
  // Round-trip check: what the gate reads must be exactly the label.
  const written = readFileSync(OUTPUT_FILE, "utf8");
  if (written !== line) {
    throw new Error("Round-trip mismatch: entry.txt does not match the label.");
  }
  console.log(`Wrote ${[...line].length} characters to ${OUTPUT_FILE}:`);
  console.log(line);
}

main();
