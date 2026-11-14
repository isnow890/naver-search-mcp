import test from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import {
  createNaverSearchServer,
  resetServerInstance,
} from "../dist/src/index.js";
import { NaverSearchClient } from "../dist/src/clients/naver-search.client.js";

const ARGS = {
  startDate: "2026-08-01",
  endDate: "2026-10-31",
  timeUnit: "month",
  keywordGroups: [{ groupName: "아이폰", keywords: ["아이폰"] }],
};

// 실제 서버에 MCP 클라이언트를 붙이고, 네이버 호출은 요청 본문만 기록하는 스텁으로 바꾼다.
async function connect() {
  resetServerInstance();
  const server = createNaverSearchServer({
    config: { NCP_APIGW_API_KEY_ID: "id", NCP_APIGW_API_KEY: "secret" },
  });
  const sent = [];
  NaverSearchClient.getInstance().searchTrend = async (params) => {
    // axios가 실제로 보내는 JSON과 같게 직렬화한다 (undefined 필드는 빠진다).
    sent.push(JSON.parse(JSON.stringify(params)));
    return { results: [] };
  };
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test", version: "0" });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  return { client, sent };
}

test("datalab_search는 device/gender/ages 선택 필터를 노출한다", async () => {
  const { client } = await connect();
  const { tools } = await client.listTools();
  const { properties, required } = tools.find((t) => t.name === "datalab_search").inputSchema;
  assert.deepEqual(properties.device?.enum, ["pc", "mo"]);
  assert.deepEqual(properties.gender?.enum, ["m", "f"]);
  assert.deepEqual(
    properties.ages?.items?.enum,
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]
  );
  for (const key of ["device", "gender", "ages"]) {
    assert.ok(!required.includes(key), `${key}가 필수다`);
  }
  await client.close();
  resetServerInstance();
});

test("필터는 네이버 요청까지 전달되고, 생략하면 요청에서 빠진다", async () => {
  const { client, sent } = await connect();

  let res = await client.callTool({
    name: "datalab_search",
    arguments: { ...ARGS, device: "mo", gender: "f", ages: ["3", "4"] },
  });
  assert.ok(!res.isError, res.content?.[0]?.text);
  assert.equal(sent.at(-1).device, "mo");
  assert.equal(sent.at(-1).gender, "f");
  assert.deepEqual(sent.at(-1).ages, ["3", "4"]);

  res = await client.callTool({ name: "datalab_search", arguments: ARGS });
  assert.ok(!res.isError, res.content?.[0]?.text);
  for (const key of ["device", "gender", "ages"]) {
    assert.equal(key in sent.at(-1), false, `${key}가 요청에 실렸다`);
  }

  await client.close();
  resetServerInstance();
});

test("쇼핑인사이트 연령 코드(20 등)는 네이버 호출 전에 거절한다", async () => {
  const { client, sent } = await connect();
  // 검색어 트렌드의 연령 코드는 1~11이다. 쇼핑인사이트의 "20"을 그대로 넣는 실수를 막는다.
  const before = sent.length;
  await assert.rejects(
    () =>
      client.callTool({
        name: "datalab_search",
        arguments: { ...ARGS, ages: ["20"] },
      }),
    /Invalid arguments/
  );
  assert.equal(sent.length, before, "잘못된 코드로 네이버를 호출했다");
  await client.close();
  resetServerInstance();
});
