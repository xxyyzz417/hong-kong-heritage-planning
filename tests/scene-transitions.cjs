const assert = require("node:assert/strict");
const { chromium } = require("playwright");

const 網址 = "http://127.0.0.1:8765";
const 瀏覽器路徑 = "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function 開啟時間軸(瀏覽器) {
  const 頁面 = await 瀏覽器.newPage({ viewport: { width: 1440, height: 1000 } });
  await 頁面.goto(網址, { waitUntil: "domcontentloaded" });
  await 頁面.waitForFunction(() => document.getElementById("載入畫面").hidden, null, { timeout: 15000 });
  await 頁面.evaluate(() => {
    const 觸發器 = window.ScrollTrigger.getAll()[0];
    window.scrollTo(0, 觸發器.start);
  });
  await 頁面.waitForTimeout(400);
  return 頁面;
}

async function 測試相鄰幕勻速慢放(瀏覽器) {
  const 頁面 = await 開啟時間軸(瀏覽器);
  const 開始時間 = Date.now();
  const 樣本 = [];
  await 頁面.getByRole("button", { name: "前往下一幕" }).click();

  while (Date.now() - 開始時間 < 6000) {
    const 影格 = await 頁面.locator("#場景畫布").getAttribute("data-current-frame");
    樣本.push({ 時間: Date.now() - 開始時間, 影格: Number(影格) });
    const 播放中 = await 頁面.getByRole("button", { name: "前往下一幕" }).isDisabled();
    if (!播放中 && 樣本.length > 2) break;
    await 頁面.waitForTimeout(200);
  }

  const 耗時 = 樣本.at(-1).時間;
  assert.ok(耗時 >= 3000 && 耗時 <= 4500, `相鄰幕應在三至四點五秒內勻速完成，實際為 ${耗時} 毫秒`);

  const 中段樣本 = 樣本.filter((樣本) => 樣本.影格 > 5 && 樣本.影格 < 44);
  assert.ok(中段樣本.length >= 8, "應取得足夠的中段影格樣本");
  const 最大偏差 = Math.max(...中段樣本.map((樣本) => {
    const 時間進度 = 樣本.時間 / 耗時;
    const 影格進度 = (樣本.影格 - 1) / (48 - 1);
    return Math.abs(時間進度 - 影格進度);
  }));
  assert.ok(最大偏差 < 0.12, `播放速度不夠均勻，最大進度偏差為 ${最大偏差.toFixed(3)}`);
  await 頁面.close();
}

async function 測試文案依序浮現(瀏覽器) {
  const 頁面 = await 開啟時間軸(瀏覽器);
  await 頁面.getByRole("button", { name: "前往下一幕" }).click();
  await 頁面.waitForFunction(() => document.getElementById("場景情緒").textContent.includes("第二幕"), null, { timeout: 5000 });
  await 頁面.waitForTimeout(220);

  const 透明度 = await 頁面.evaluate(() => ({
    標題: Number(getComputedStyle(document.querySelector(".漂浮標題")).opacity),
    提問: Number(getComputedStyle(document.querySelector(".場景對話")).opacity),
    資產: Number(getComputedStyle(document.querySelector(".資產區")).opacity),
    選項: Number(getComputedStyle(document.querySelector(".對話選擇")).opacity)
  }));

  assert.ok(透明度.標題 > 透明度.提問, `標題應先於提問浮現：${JSON.stringify(透明度)}`);
  assert.equal(透明度.資產, 0, "資產安排在第三段才可浮現");
  assert.equal(透明度.選項, 0, "安心清單選項在最後一段才可浮現");
  await 頁面.close();
}

async function 測試手機文案依閱讀順序排列(瀏覽器) {
  const 頁面 = await 瀏覽器.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await 頁面.goto(網址, { waitUntil: "domcontentloaded" });
  await 頁面.waitForFunction(() => document.getElementById("載入畫面").hidden, null, { timeout: 15000 });
  await 頁面.evaluate(() => {
    const 觸發器 = window.ScrollTrigger.getAll()[0];
    window.scrollTo(0, 觸發器.start + (觸發器.end - 觸發器.start) * ((196 - 1) / (240 - 1)));
  });
  await 頁面.waitForFunction(() => document.getElementById("場景情緒").textContent.includes("第五幕"), null, { timeout: 5000 });
  await 頁面.waitForTimeout(2400);

  const 範圍 = await 頁面.evaluate(() => {
    const 讀取範圍 = (選擇器) => {
      const 矩形 = document.querySelector(選擇器).getBoundingClientRect();
      return { 頂: Math.round(矩形.top), 底: Math.round(矩形.bottom) };
    };
    return {
      標題: 讀取範圍(".漂浮標題"),
      提問: 讀取範圍(".場景對話"),
      資產: 讀取範圍(".資產區"),
      選項: 讀取範圍(".對話選擇")
    };
  });

  assert.ok(範圍.標題.底 + 12 <= 範圍.提問.頂, `標題與提問不可重疊：${JSON.stringify(範圍)}`);
  assert.ok(範圍.提問.底 + 12 <= 範圍.資產.頂, `提問與資產不可重疊：${JSON.stringify(範圍)}`);
  assert.ok(範圍.資產.底 + 12 <= 範圍.選項.頂, `資產與選項不可重疊：${JSON.stringify(範圍)}`);
  await 頁面.close();
}

(async () => {
  const 瀏覽器 = await chromium.launch({ headless: true, executablePath: 瀏覽器路徑 });
  try {
    await 測試相鄰幕勻速慢放(瀏覽器);
    console.log("通過：相鄰幕勻速慢放");
    await 測試文案依序浮現(瀏覽器);
    console.log("通過：文案依序浮現");
    await 測試手機文案依閱讀順序排列(瀏覽器);
    console.log("通過：手機文案依閱讀順序排列");
  } finally {
    await 瀏覽器.close();
  }
})().catch((錯誤) => {
  console.error(錯誤.message);
  process.exit(1);
});
