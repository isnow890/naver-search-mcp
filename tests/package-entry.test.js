import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const PKG = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

// main/types/bin이 빌드 결과물에 실제로 있어야 npm 사용자에게 전달된다.
// types가 없는 파일을 가리키면 TS 사용자는 TS7016(implicit any)을 받는다.
test("package.json 진입점은 빌드된 파일을 가리킨다", () => {
  for (const field of ["main", "types"]) {
    assert.ok(existsSync(root + PKG[field]), `${field}: ${PKG[field]} 이 없다`);
  }
  for (const [name, path] of Object.entries(PKG.bin)) {
    assert.ok(existsSync(root + path), `bin.${name}: ${path} 이 없다`);
  }
});

test("진입점은 배포 대상(files)에 포함된다", () => {
  for (const path of [PKG.main, PKG.types, ...Object.values(PKG.bin)]) {
    assert.ok(
      PKG.files.some((dir) => path.replace(/^\.\//, "").startsWith(dir + "/")),
      `${path} 이 files(${PKG.files.join(", ")})에 포함되지 않는다`
    );
  }
});
