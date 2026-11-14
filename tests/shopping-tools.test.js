import test from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import {
  createNaverSearchServer,
  resetServerInstance,
} from "../dist/src/index.js";
import { NaverSearchClient } from "../dist/src/clients/naver-search.client.js";

const RANGE = { startDate: "2026-08-01", endDate: "2026-10-31", timeUnit: "month" };

// 툴 이름 → 호출되는 클라이언트 메서드, 분석 축(없으면 null), 필수 입력
const TOOLS = {
  datalab_shopping_category: {
    method: "datalabShoppingCategory",
    axis: null,
    args: { category: [{ name: "패션의류", param: ["50000000"] }] },
  },
  datalab_shopping_by_device: {
    method: "datalabShoppingByDevice",
    axis: "device",
    args: { category: "50000000" },
  },
  datalab_shopping_by_gender: {
    method: "datalabShoppingByGender",
    axis: "gender",
    args: { category: "50000000" },
  },
  datalab_shopping_by_age: {
    method: "datalabShoppingByAge",
    axis: "ages",
    args: { category: "50000000" },
  },
  datalab_shopping_keywords: {
    method: "datalabShoppingKeywords",
    axis: null,
    args: { category: "50000000", keyword: [{ name: "원피스", param: ["원피스"] }] },
  },
  datalab_shopping_keyword_by_device: {
    method: "datalabShoppingKeywordByDevice",
    axis: "device",
    args: { category: "50000000", keyword: "원피스" },
  },
  datalab_shopping_keyword_by_gender: {
    method: "datalabShoppingKeywordByGender",
    axis: "gender",
    args: { category: "50000000", keyword: "원피스" },
  },
  datalab_shopping_keyword_by_age: {
    method: "datalabShoppingKeywordByAge",
    axis: "ages",
    args: { category: "50000000", keyword: "원피스" },
  },
};

// 실제 서버에 MCP 클라이언트를 붙이고, 네이버 호출은 요청 본문만 기록하는 스텁으로 바꾼다.
async function connect() {
  resetServerInstance();
  const server = createNaverSearchServer({
    config: { NCP_APIGW_API_KEY_ID: "id", NCP_APIGW_API_KEY: "secret" },
  });
  const sent = [];
  const naver = NaverSearchClient.getInstance();
  for (const { method } of Object.values(TOOLS)) {
    naver[method] = async (params) => {
      // axios가 실제로 보내는 JSON과 같게 직렬화한다 (undefined 필드는 빠진다).
      sent.push(JSON.parse(JSON.stringify(params)));
      return { results: [] };
    };
  }
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test", version: "0" });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  return { client, sent };
}

test("기기별/성별/연령별 툴은 분석 축을 필수로 요구하지 않는다", async () => {
  const { client } = await connect();
  const { tools } = await client.listTools();
  for (const [name, { axis }] of Object.entries(TOOLS)) {
    if (!axis) continue;
    const tool = tools.find((t) => t.name === name);
    assert.ok(tool, `${name}이 등록되지 않았다`);
    assert.ok(!tool.inputSchema.required.includes(axis), `${name}이 ${axis}를 필수로 요구한다`);
  }
  await client.close();
  resetServerInstance();
});

test("쇼핑인사이트 툴 8개 모두 device/gender/ages 선택 필터를 노출한다", async () => {
  const { client } = await connect();
  const { tools } = await client.listTools();
  for (const name of Object.keys(TOOLS)) {
    const { properties } = tools.find((t) => t.name === name).inputSchema;
    assert.deepEqual(properties.device?.enum, ["pc", "mo"], `${name}.device`);
    assert.deepEqual(properties.gender?.enum, ["f", "m"], `${name}.gender`);
    assert.deepEqual(
      properties.ages?.items?.enum,
      ["10", "20", "30", "40", "50", "60"],
      `${name}.ages`
    );
  }
  await client.close();
  resetServerInstance();
});

test("분석 축을 생략하면 요청에서도 빠져 그룹별 결과를 받는다", async () => {
  const { client, sent } = await connect();
  for (const [name, { axis, args }] of Object.entries(TOOLS)) {
    if (!axis) continue;
    const res = await client.callTool({ name, arguments: { ...RANGE, ...args } });
    assert.ok(!res.isError, `${name}: ${res.content?.[0]?.text}`);
    const body = sent.at(-1);
    assert.equal(axis in body, false, `${name} 요청에 ${axis}가 실렸다`);
  }
  await client.close();
  resetServerInstance();
});

test("필터는 툴 8개 모두에서 네이버 요청까지 전달된다", async () => {
  const { client, sent } = await connect();
  const filters = { device: "mo", gender: "f", ages: ["20", "30"] };
  for (const [name, { args }] of Object.entries(TOOLS)) {
    const res = await client.callTool({
      name,
      arguments: { ...RANGE, ...args, ...filters },
    });
    assert.ok(!res.isError, `${name}: ${res.content?.[0]?.text}`);
    const body = sent.at(-1);
    assert.equal(body.device, "mo", `${name}.device`);
    assert.equal(body.gender, "f", `${name}.gender`);
    assert.deepEqual(body.ages, ["20", "30"], `${name}.ages`);
  }
  await client.close();
  resetServerInstance();
});
