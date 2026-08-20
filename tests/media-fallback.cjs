const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

const 網址 = process.env.TEST_URL || "http://127.0.0.1:8765";
const 預設瀏覽器路徑 = "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function 測試靜態畫面控制() {
  const 啟動設定 = fs.existsSync(預設瀏覽器路徑) ? { executablePath: 預設瀏覽器路徑 } : {};
  const 瀏覽器 = await chromium.launch({ headless: true, ...啟動設定 });

  try {
    const 減少動態頁 = await 瀏覽器.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    await 減少動態頁.goto(網址, { waitUntil: "domcontentloaded" });
    await 減少動態頁.getByRole("button", { name: "開始這段旅程" }).click();
    await 減少動態頁.waitForTimeout(300);
    const 初始狀態 = await 減少動態頁.evaluate(() => ({
      影片來源: document.getElementById("場景影片").currentSrc,
      影片隱藏: document.getElementById("場景影片").hidden,
      靜態隱藏: document.getElementById("靜態場景").hidden
    }));
    assert.equal(初始狀態.影片來源, "", "減少動態時不應下載影片");
    assert.equal(初始狀態.影片隱藏, true, "減少動態時應隱藏影片");
    assert.equal(初始狀態.靜態隱藏, false, "減少動態時應顯示代表圖");

    await 減少動態頁.evaluate(() => {
      const 觸發器 = window.ScrollTrigger.getAll()[0];
      window.scrollTo(0, 觸發器.start + (觸發器.end - 觸發器.start) * 0.82);
    });
    await 減少動態頁.waitForFunction(() => document.getElementById("靜態場景").src.includes("scene-05-v1.webp"));
    await 減少動態頁.close();

    const 一般頁 = await 瀏覽器.newPage({ viewport: { width: 1440, height: 1000 } });
    await 一般頁.goto(網址, { waitUntil: "domcontentloaded" });
    await 一般頁.getByRole("button", { name: "開始這段旅程" }).click();
    await 一般頁.waitForFunction(() => document.getElementById("場景影片").readyState >= 1, null, { timeout: 15000 });
    const 切換按鈕 = 一般頁.locator("#切換媒體模式");
    await assert.doesNotReject(() => 切換按鈕.waitFor({ state: "visible", timeout: 2000 }), "旅程應提供可見的靜態畫面控制");
    assert.equal((await 切換按鈕.textContent()).trim(), "改用靜態畫面", "流動畫面開啟時應提供清楚的靜態切換文字");

    await 一般頁.emulateMedia({ reducedMotion: "reduce" });
    await 一般頁.waitForFunction(() => document.getElementById("切換媒體模式").getAttribute("aria-pressed") === "true");
    assert.equal(await 一般頁.locator("#靜態場景").isVisible(), true, "頁面開啟後更改系統設定亦應立即切換靜態畫面");
    await 一般頁.emulateMedia({ reducedMotion: "no-preference" });
    await 一般頁.waitForFunction(() => document.getElementById("切換媒體模式").getAttribute("aria-pressed") === "false");

    await 切換按鈕.click();
    assert.equal(await 切換按鈕.getAttribute("aria-pressed"), "true", "改用靜態畫面後應向輔助科技表明狀態");
    assert.equal(await 一般頁.locator("#場景影片").isHidden(), true, "手動切換後應停止並隱藏影片");
    assert.equal(await 一般頁.locator("#靜態場景").isVisible(), true, "手動切換後應顯示代表圖");
  } finally {
    await 瀏覽器.close();
  }
}

測試靜態畫面控制()
  .then(() => console.log("通過：系統與手動靜態畫面控制"))
  .catch((錯誤) => {
    console.error(錯誤.message);
    process.exit(1);
  });
