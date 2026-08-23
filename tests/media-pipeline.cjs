const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

const 網址 = process.env.TEST_URL || "http://127.0.0.1:8765";
const 預設瀏覽器路徑 = "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function 測試高密度圖片序列映射() {
  const 啟動設定 = fs.existsSync(預設瀏覽器路徑) ? { executablePath: 預設瀏覽器路徑 } : {};
  const 瀏覽器 = await chromium.launch({ headless: true, ...啟動設定 });
  const 頁面 = await 瀏覽器.newPage({ viewport: { width: 1440, height: 1000 } });
  const 請求網址 = [];
  頁面.on("request", (請求) => 請求網址.push(請求.url()));

  try {
    await 頁面.goto(網址, { waitUntil: "domcontentloaded" });
    const 畫布 = 頁面.locator("#場景畫布");
    await assert.doesNotReject(() => 畫布.waitFor({ state: "attached", timeout: 2000 }), "時間軸應使用畫布繪製圖片序列");
    assert.equal(await 頁面.locator("#場景影片").count(), 0, "圖片序列版不應再依賴遠端影片定位");
    await 頁面.waitForFunction(() => Number(document.getElementById("場景畫布")?.dataset.drawnFrame) >= 1, null, { timeout: 15000 });
    const 首畫面請求 = [...new Set(請求網址.filter((網址字串) => /frame-\d+\.webp(?:$|\?)/.test(網址字串)))];
    assert.equal(首畫面請求.length, 1, "首畫面只可等候第一格，其餘影格必須在背景準備");
    await 頁面.waitForTimeout(400);
    assert.ok(請求網址.filter((網址字串) => /frame-\d+\.webp(?:$|\?)/.test(網址字串)).length < 40, "開篇只可準備代表影格與第一幕鄰近影格");

    await 頁面.getByRole("button", { name: "開始這段旅程" }).click();
    await 頁面.waitForFunction(() => Number(document.getElementById("場景畫布")?.dataset.drawnFrame) >= 1, null, { timeout: 15000 });
    const 初始請求 = [...new Set(請求網址.filter((網址字串) => /frame-\d+\.webp(?:$|\?)/.test(網址字串)))];
    assert.ok(初始請求.length > 0 && 初始請求.length < 80, `初始只可預載小量鄰近影格，實際為 ${初始請求.length}`);
    assert.equal(請求網址.filter((網址字串) => /\.mp4(?:$|\?)/.test(網址字串)).length, 0, "旅程不可再下載需要遠端定位的整段影片");

    await 頁面.waitForTimeout(2500);
    await 頁面.evaluate(() => {
      const 觸發器 = window.ScrollTrigger.getAll().find((項目) => 項目.trigger && 項目.trigger.id === "人生時間軸");
      window.scrollTo(0, 觸發器.start);
    });
    await 頁面.waitForTimeout(300);
    const 滾輪前位置 = await 頁面.evaluate(() => window.scrollY);
    const 滾輪前影格 = Number(await 畫布.getAttribute("data-current-frame"));
    await 頁面.mouse.move(720, 500);
    await 頁面.mouse.wheel(0, 300);
    await 頁面.waitForFunction(({ 位置, 影格 }) => {
      const 畫面 = document.getElementById("場景畫布");
      return window.scrollY > 位置 && Number(畫面?.dataset.currentFrame) > 影格;
    }, { 位置: 滾輪前位置, 影格: 滾輪前影格 }, { timeout: 3000 });
    const 滾輪目標影格 = Number(await 畫布.getAttribute("data-current-frame"));
    await 頁面.waitForFunction((目標) => Number(document.getElementById("場景畫布")?.dataset.drawnFrame) >= 目標 - 1, 滾輪目標影格, { timeout: 5000 });

    await 頁面.evaluate(() => {
      const 觸發器 = window.ScrollTrigger.getAll().find((項目) =>項目.trigger && 項目.trigger.id === "人生時間軸");
      window.scrollTo(0, 觸發器.start + (觸發器.end - 觸發器.start) * 0.5);
    });
    await 頁面.waitForFunction(() => {
      const 元素 = document.getElementById("場景畫布");
      const 影格 = Number(元素?.dataset.drawnFrame);
      return 影格 >= 470 && 影格 <= 490;
    }, null, { timeout: 5000 });

    const 舊媒體請求 = 請求網址.filter((網址字串) => 網址字串.includes("video%20split%20to%20png") || /ezgif-frame-\d+\.png/.test(網址字串) || /\.mp4(?:$|\?)/.test(網址字串));
    assert.deepEqual(舊媒體請求, [], "瀏覽旅程時不應再請求舊 PNG 或 MP4 媒體");
  } finally {
    await 瀏覽器.close();
  }
}

測試高密度圖片序列映射()
  .then(() => console.log("通過：高密度圖片序列隨捲動線性映射"))
  .catch((錯誤) => {
    console.error(錯誤.message);
    process.exit(1);
  });
