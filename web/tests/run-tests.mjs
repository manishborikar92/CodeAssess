import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testFiles = [
  "question-catalog.test.mjs",
  "practice-session.test.mjs",
  "exam-session.test.mjs",
  "assessment-config.test.mjs",
  "submission-state.test.mjs",
];

let failed = false;

for (const testFile of testFiles) {
  const result = spawnSync(process.execPath, [path.join(__dirname, testFile)], {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    failed = true;
    break;
  }
}

if (failed) {
  process.exitCode = 1;
}
