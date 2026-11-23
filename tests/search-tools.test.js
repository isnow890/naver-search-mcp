import test from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import {
  createNaverSearchServer,
  resetServerInstance,
} from "../dist/src/index.js";
import { NaverSearchClient } from "../dist/src/clients/naver-search.client.js";

// 실제 서버에 MCP 클라이언트를 붙이고, 네이버 호출은 요청 파라미터만 기록하는 스텁으로 바꾼다.
async function connect() {
  resetServerInstance();
  const server = createNaverSearchServer({
    config: { NCP_APIGW_API_KEY_ID: "id", NCP_APIGW_API_KEY: "secret" },
  });
  const sent = [];
  const naver = NaverSearchClient.getInstance();
  naver.search = async (type, params) => {
    sent.push({ type, params: JSON.parse(JSON.stringify(params)) });
    return { items: [] };
  };
  naver.searchLocal = async (params) => {
    sent.push({ type: "local", params: JSON.parse(JSON.stringify(params)) });
    return { items: [] };
  };
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test", version: "0" });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  return { client, sent };
}

async function call(client, name, args) {
  const res = await client.callTool({ name, arguments: args });
  assert.ok(!res.isError, `${name}: ${res.content?.[0]?.text}`);
  return res;
}

async function rejected(client, sent, name, args) {
  const before = sent.length;
  await assert.rejects(
    () => client.callTool({ name, arguments: args }),
    /Invalid arguments/,
    `${name} ${JSON.stringify(args)}가 거절되지 않았다`
  );
  assert.equal(sent.length, before, `${name}: 거절해야 할 입력으로 네이버를 호출했다`);
}

test("웹문서·지식백과는 API가 무시하는 sort를 노출하지 않는다", async () => {
  const { client, sent } = await connect();
  const { tools } = await client.listTools();
  for (const name of ["search_webkr", "search_encyc"]) {
    const { properties } = tools.find((t) => t.name === name).inputSchema;
    assert.equal("sort" in properties, false, `${name}에 sort가 있다`);

    // 기존 호출과의 호환: sort를 보내도 에러 없이 무시된다.
    await call(client, name, { query: "인공지능", sort: "date" });
    assert.equal("sort" in sent.at(-1).params, false);
  }
  await client.close();
  resetServerInstance();
});

test("지식iN은 평점순(point) 정렬을 네이버까지 전달한다", async () => {
  const { client, sent } = await connect();
  const { tools } = await client.listTools();
  const { properties } = tools.find((t) => t.name === "search_kin").inputSchema;
  assert.deepEqual(properties.sort.enum, ["sim", "date", "point"]);

  await call(client, "search_kin", { query: "아이폰", sort: "point" });
  assert.deepEqual(sent.at(-1), { type: "kin", params: { query: "아이폰", sort: "point" } });

  // 다른 검색 툴은 point를 받지 않는다.
  await rejected(client, sent, "search_blog", { query: "아이폰", sort: "point" });
  await client.close();
  resetServerInstance();
});

test("이미지 검색은 크기 filter를 네이버까지 전달한다", async () => {
  const { client, sent } = await connect();
  const { tools } = await client.listTools();
  const { properties } = tools.find((t) => t.name === "search_image").inputSchema;
  assert.deepEqual(properties.filter.enum, ["all", "large", "medium", "small"]);

  await call(client, "search_image", { query: "고양이", filter: "small" });
  assert.deepEqual(sent.at(-1), { type: "image", params: { query: "고양이", filter: "small" } });

  await rejected(client, sent, "search_image", { query: "고양이", filter: "huge" });
  await client.close();
  resetServerInstance();
});

test("display/start는 API 허용 범위 안에서만 받는다", async () => {
  const { client, sent } = await connect();
  for (const name of [
    "search_webkr",
    "search_news",
    "search_blog",
    "search_image",
    "search_kin",
    "search_encyc",
    "search_cafearticle",
  ]) {
    await call(client, name, { query: "카메라", display: 100, start: 1000 });
    await rejected(client, sent, name, { query: "카메라", display: 101 });
    await rejected(client, sent, name, { query: "카메라", display: 0 });
    await rejected(client, sent, name, { query: "카메라", start: 1001 });
    await rejected(client, sent, name, { query: "카메라", start: 0 });
  }
  await client.close();
  resetServerInstance();
});

test("지역 검색은 display 5개까지, start는 1만 받는다", async () => {
  const { client, sent } = await connect();
  await call(client, "search_local", { query: "강남 맛집", display: 5, start: 1 });
  assert.deepEqual(sent.at(-1).params, { query: "강남 맛집", display: 5, start: 1 });

  // API는 display를 5로 줄이고, start가 2 이상이어도 첫 결과를 그대로 준다.
  await rejected(client, sent, "search_local", { query: "강남 맛집", display: 6 });
  await rejected(client, sent, "search_local", { query: "강남 맛집", start: 2 });
  await client.close();
  resetServerInstance();
});
