import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import {
  createNaverSearchServer,
  resetServerInstance,
} from "../dist/src/index.js";
import { NaverSearchClient } from "../dist/src/clients/naver-search.client.js";
import { searchToolHandlers } from "../dist/src/handlers/search.handlers.js";
import { datalabToolHandlers } from "../dist/src/handlers/datalab.handlers.js";

const ENTRY = fileURLToPath(new URL("../dist/src/index.js", import.meta.url));
const PKG = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8")
);

const configA = { NCP_APIGW_API_KEY_ID: "a", NCP_APIGW_API_KEY: "a" };
const configB = { NCP_APIGW_API_KEY_ID: "b", NCP_APIGW_API_KEY: "b" };

// 자격증명 환경변수를 비운 채로 실행해야 결과가 개발자 환경에 좌우되지 않는다.
function runNode(args, cwd) {
  const env = { ...process.env };
  for (const key of [
    "NAVER_CLIENT_ID",
    "NAVER_CLIENT_SECRET",
    "NCP_APIGW_API_KEY_ID",
    "NCP_APIGW_API_KEY",
  ]) {
    delete env[key];
  }
  return spawnSync(process.execPath, args, {
    cwd,
    env,
    input: "",
    encoding: "utf8",
    timeout: 10000,
  });
}

test("같은 설정으로 다시 호출해도 같은 Server 인스턴스를 돌려준다", () => {
  resetServerInstance();
  const first = createNaverSearchServer({ config: configA });
  const second = createNaverSearchServer({ config: configA });
  assert.ok(first instanceof Server);
  assert.equal(second, first);
  resetServerInstance();
});

test("serverInfo.version은 package.json 버전을 따른다", async () => {
  resetServerInstance();
  const server = createNaverSearchServer({ config: configA });
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test", version: "0" });
  await server.connect(serverTransport);
  await client.connect(clientTransport);

  assert.deepEqual(client.getServerVersion(), {
    name: "naver-search",
    version: PKG.version,
  });

  await client.close();
  resetServerInstance();
});

test("설정이 바뀌어 클라이언트가 교체돼도 핸들러는 새 인스턴스를 쓴다", async () => {
  resetServerInstance();
  createNaverSearchServer({ config: configA });
  createNaverSearchServer({ config: configB });

  // 교체된 현재 인스턴스만 스텁한다. 핸들러가 옛 인스턴스를 붙잡고 있으면
  // 스텁을 거치지 못하고 "not initialized"로 실패한다.
  const current = NaverSearchClient.getInstance();
  current.search = async (type) => ({ stubbed: type });
  current.searchTrend = async () => ({ stubbed: "trend" });

  assert.deepEqual(await searchToolHandlers.search_news({ query: "x" }), {
    stubbed: "news",
  });
  assert.deepEqual(
    await datalabToolHandlers.datalab_search({
      startDate: "2026-01-01",
      endDate: "2026-02-01",
      timeUnit: "month",
      keywordGroups: [{ groupName: "x", keywords: ["x"] }],
    }),
    { stubbed: "trend" }
  );

  resetServerInstance();
});

test("다른 프로그램이 import만 해서는 서버가 뜨지 않는다", () => {
  // 예전 판별식에 걸리던 조건(경로에 naver-search-mcp, 파일명 index.js)을 일부러 갖춘다.
  const dir = mkdtempSync(join(tmpdir(), "naver-search-mcp-"));
  try {
    const script = join(dir, "index.js");
    writeFileSync(
      script,
      `import(${JSON.stringify(new URL("../dist/src/index.js", import.meta.url).href)});`
    );
    const result = runNode([script], dir);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stderr, /skipping server start/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("직접 실행하거나 bin 심볼릭 링크로 실행하면 서버를 띄운다", () => {
  const dir = mkdtempSync(join(tmpdir(), "bin-"));
  try {
    // npx·전역 설치는 node_modules/.bin 아래 심볼릭 링크로 진입점을 실행한다.
    const link = join(dir, "naver-search-mcp");
    symlinkSync(ENTRY, link);

    for (const entry of [ENTRY, link]) {
      const result = runNode([entry], dir);
      // 자격증명이 없으니 main()까지 가서 안내와 함께 종료해야 한다.
      assert.equal(result.status, 1, `${entry}\n${result.stderr}`);
      assert.match(result.stderr, /Running as main module/);
      assert.match(result.stderr, /자격증명이 설정되지 않았습니다/);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
