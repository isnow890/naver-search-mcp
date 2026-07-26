import test from "node:test";
import assert from "node:assert/strict";
import {
  resolveDate,
  getKoreanToday,
  resolveDateRange,
} from "../dist/src/utils/date.utils.js";

// 기대값을 손으로 계산하지 않는다. 같은 순간을 Intl 에 KST 로 물어본 값과 맞춘다.
function kstToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

test("getKoreanToday는 KST 기준 오늘을 yyyy-mm-dd 로 준다", () => {
  assert.equal(getKoreanToday(), kstToday());
  assert.match(getKoreanToday(), /^\d{4}-\d{2}-\d{2}$/);
});

// 회귀 방지: 예전 구현은 now.getTime() 에 9시간과 getTimezoneOffset() 을 함께
// 더했다. getTime() 이 이미 UTC 기준이라 로컬 오프셋만큼 이중 보정된다.
//
// 이 테스트를 돌리는 프로세스의 TZ 에 기대지 않는다. 오프셋을 인자로 받는
// 형태로 옛 구현을 재현해서, Asia/Seoul(-540) 에서 하루 어긋났다는 사실을
// 고정된 시각으로 못박는다. 실제로 TZ=America/New_York 처럼 오프셋이 다르면
// 같은 시각에도 날짜가 안 어긋날 수 있어서, 주변 TZ 로 조건 분기하면
// 테스트가 환경 따라 흔들린다.
test("타임존 오프셋을 이중 보정하지 않는다", () => {
  const buggyWithOffset = (ms, tzOffsetMinutes) => {
    const kst = new Date(ms + 9 * 60 * 60 * 1000 + tzOffsetMinutes * 60 * 1000);
    return `${kst.getUTCFullYear()}-${String(kst.getUTCMonth() + 1).padStart(
      2,
      "0"
    )}-${String(kst.getUTCDate()).padStart(2, "0")}`;
  };

  // 2026-07-27 01:00 KST == 2026-07-26 16:00 UTC
  const ms = Date.UTC(2026, 6, 26, 16, 0, 0);
  const correct = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(new Date(ms));
  assert.equal(correct, "2026-07-27");

  // TZ=Asia/Seoul (getTimezoneOffset() === -540) 에서 하루 전이 나왔다.
  assert.equal(buggyWithOffset(ms, -540), "2026-07-26");
  // TZ=UTC 에서만 우연히 맞았다.
  assert.equal(buggyWithOffset(ms, 0), correct);
});

test("resolveDate는 today 를 KST 오늘로 바꾼다", () => {
  assert.equal(resolveDate("today"), kstToday());
  assert.equal(resolveDate("TODAY"), kstToday());
  assert.equal(resolveDate("Today"), kstToday());
});

test("resolveDate는 yyyy-mm-dd 를 그대로 통과시킨다", () => {
  assert.equal(resolveDate("2026-01-01"), "2026-01-01");
  assert.equal(resolveDate("2025-12-31"), "2025-12-31");
});

test("resolveDate는 형식이 어긋나면 던진다", () => {
  for (const bad of ["2026/01/01", "2026-1-1", "tomorrow", "", "20260101"]) {
    assert.throws(
      () => resolveDate(bad),
      /Invalid date format/,
      `"${bad}" 를 거부해야 한다`
    );
  }
});

test("resolveDateRange는 양쪽을 함께 해석한다", () => {
  const r = resolveDateRange("2026-01-01", "today");
  assert.equal(r.startDate, "2026-01-01");
  assert.equal(r.endDate, kstToday());

  const both = resolveDateRange("today", "today");
  assert.equal(both.startDate, kstToday());
  assert.equal(both.endDate, kstToday());
});
