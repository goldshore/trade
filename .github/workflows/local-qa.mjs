import { execSync } from "node:child_process";

const run = (command) => {
  execSync(command, { stdio: "inherit" });
};

console.log("Running Gold Shore local QA checks…");
run("npm install --workspaces --include-workspace-root");
run("node packages/image-tools/process-images.mjs");
run("npm run --workspace apps/web build");
run("npm run --if-present lint --workspace apps/web-ui");
run("npm run --if-present lint --workspace apps/ops-console");
console.log("Running Python lint + tests…");
run("python -m pip install -r requirements-dev.txt");
run("ruff check services libs adapters");
run("pytest");
console.log("\nLighthouse: run 'npx http-server apps/web/dist -p 4173' then 'npx lighthouse http://localhost:4173' for manual scoring.");
