const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

const 網址 = process.env.TEST_URL || "http://127.0.0.1:8765";
const 預設瀏覽器路徑 = "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function 測試減少動態時只顯示代表影格() {
  const 啟動設定 = fs.existsSync(預設瀏覽器路徑) ? { executablePath: 預設瀏覽器路徑 } : {};
  const 瀏覽器 = await chromium.launch({ headless: true, ...啟動設定 });
  try {
    const 頁面 = await 瀏覽器.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    await 頁面.goto(網址, { waitUntil: "domcontentloaded" });
    await 頁面.waitForFunction(() => Number(document.getElementById("場景畫布")?.dataset.drawnFrame) >= 1, null, { timeout: 15000 });
    await 頁面.waitForFunction(() => window.ScrollTrigger?.getAll().length > 0, null, { timeout: 15000 });
    await 頁面.waitForTimeout(1000);
    await 頁面.evaluate(() => {
      const 觸發器 = window.ScrollTrigger.getAll()[0];
      window.scrollTo(0, 觸發器.start + (觸發器.end - 觸發器.start) * 0.82);
    });
    await 頁面.waitForFunction(() => {
      const 影格 = Number(document.getElementById("場景畫布")?.dataset.currentFrame);
      return 影格 >= 780 && 影格 <= 790;
    });
    const 當前影格 = Number(await 頁面.locator("#場景畫布").getAttribute("data-current-frame"));
    assert.ok(當前影格 >= 780 && 當前影格 <= 790, `減少動態時應停在第五幕代表影格，實際為 ${當前影格}`);
  } finally {
    await 瀏覽器.close();
  }
}

測試減少動態時只顯示代表影格()
  .then(() => console.log("通過：減少動態時使用六幕代表影格"))
  .catch((錯誤) => {
    console.error(錯誤.message);
    process.exit(1);
  });
