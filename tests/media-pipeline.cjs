const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

const 網址 = process.env.TEST_URL || "http://127.0.0.1:8765";
const 預設瀏覽器路徑 = "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function 測試完整幀率影片映射() {
  const 啟動設定 = fs.existsSync(預設瀏覽器路徑) ? { executablePath: 預設瀏覽器路徑 } : {};
  const 瀏覽器 = await chromium.launch({ headless: true, ...啟動設定 });
  const 頁面 = await 瀏覽器.newPage({ viewport: { width: 1440, height: 1000 } });
  const 請求網址 = [];
  頁面.on("request", (請求) => 請求網址.push(請求.url()));

  try {
    await 頁面.goto(網址, { waitUntil: "domcontentloaded" });
    const 影片 = 頁面.locator("#場景影片");
    await assert.doesNotReject(() => 影片.waitFor({ state: "attached", timeout: 2000 }), "時間軸應使用原生影片元素");
    assert.equal(await 頁面.locator("#場景畫布").count(), 0, "正式版不應再以畫布繪製 PNG 序列");
    await 頁面.waitForTimeout(400);
    assert.equal(請求網址.filter((網址字串) => /\.mp4(?:$|\?)/.test(網址字串)).length, 0, "用戶仍停留開篇時不應提前下載影片");

    await 頁面.getByRole("button", { name: "開始這段旅程" }).click();
    await 頁面.waitForFunction(() => {
      const 元素 = document.getElementById("場景影片");
      return 元素 && 元素.readyState >= 1 && 元素.duration > 70;
    }, null, { timeout: 15000 });

    const 媒體設定 = await 影片.evaluate((元素) => ({
      來源: 元素.currentSrc,
      靜音: 元素.muted,
      自動播放: 元素.autoplay,
      時長: 元素.duration
    }));
    assert.match(媒體設定.來源, /\.mp4(?:$|\?)/, "場景來源應為 MP4 影片");
    assert.equal(媒體設定.靜音, true, "場景影片必須靜音");
    assert.equal(媒體設定.自動播放, false, "場景影片不可自動播放");
    const 影片請求 = [...new Set(請求網址.filter((網址字串) => /\.mp4(?:$|\?)/.test(網址字串)))];
    assert.equal(影片請求.length, 1, "每部裝置只應下載一個合適解像度的影片版本");

    await 頁面.evaluate(() => {
      const 觸發器 = window.ScrollTrigger.getAll().find((項目) =>項目.trigger && 項目.trigger.id === "人生時間軸");
      window.scrollTo(0, 觸發器.start + (觸發器.end - 觸發器.start) * 0.5);
    });
    await 頁面.waitForFunction(() => {
      const 元素 = document.getElementById("場景影片");
      return Math.abs(元素.currentTime - 元素.duration * 0.5) < 1.5;
    }, null, { timeout: 5000 });

    const 舊序列請求 = 請求網址.filter((網址字串) => 網址字串.includes("video%20split%20to%20png") || /ezgif-frame-\d+\.png/.test(網址字串));
    assert.deepEqual(舊序列請求, [], "瀏覽旅程時不應再請求舊 PNG 序列");
  } finally {
    await 瀏覽器.close();
  }
}

測試完整幀率影片映射()
  .then(() => console.log("通過：完整幀率影片隨捲動線性映射"))
  .catch((錯誤) => {
    console.error(錯誤.message);
    process.exit(1);
  });
