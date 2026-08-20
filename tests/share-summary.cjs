const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

const 網址 = process.env.TEST_URL || "http://127.0.0.1:8765";
const 預設瀏覽器路徑 = "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function 測試摘要分享與列印() {
  const 啟動設定 = fs.existsSync(預設瀏覽器路徑) ? { executablePath: 預設瀏覽器路徑 } : {};
  const 瀏覽器 = await chromium.launch({ headless: true, ...啟動設定 });
  const 頁面 = await 瀏覽器.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  await 頁面.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (資料) => { window.__分享資料 = 資料; }
    });
    window.print = () => { window.__已要求列印 = true; };
  });

  try {
    await 頁面.goto(網址, { waitUntil: "domcontentloaded" });
    await 頁面.getByRole("button", { name: /放進我的安心清單/ }).click();
    await 頁面.locator("#安心清單").scrollIntoViewIfNeeded();

    const 分享按鈕 = 頁面.getByRole("button", { name: "分享安心摘要" });
    await assert.doesNotReject(() => 分享按鈕.waitFor({ state: "visible", timeout: 2000 }), "應提供系統分享按鈕");
    await 分享按鈕.click();
    const 分享資料 = await 頁面.evaluate(() => window.__分享資料);
    assert.equal(分享資料.title, "香港遺產規劃｜我的安心摘要", "分享標題應清楚說明內容");
    assert.match(分享資料.text, /物業產權、流動資產、身份證明/, "分享內容應包括使用者選下的事項");

    await 頁面.getByRole("button", { name: "列印安心摘要" }).click();
    assert.equal(await 頁面.evaluate(() => window.__已要求列印), true, "列印按鈕應呼叫瀏覽器列印功能");
    assert.match(await 頁面.locator("#摘要狀態").textContent(), /摘要已準備分享/, "完成分享後應提供可讀狀態");
  } finally {
    await 瀏覽器.close();
  }
}

測試摘要分享與列印()
  .then(() => console.log("通過：安心摘要分享與列印"))
  .catch((錯誤) => {
    console.error(錯誤.message);
    process.exit(1);
  });
