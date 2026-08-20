const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

const 網址 = process.env.TEST_URL || "http://127.0.0.1:8765";
const 預設瀏覽器路徑 = "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function 測試安心摘要下載() {
  const 啟動設定 = fs.existsSync(預設瀏覽器路徑) ? { executablePath: 預設瀏覽器路徑 } : {};
  const 瀏覽器 = await chromium.launch({ headless: true, ...啟動設定 });
  const 頁面 = await 瀏覽器.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", acceptDownloads: true });

  try {
    await 頁面.goto(網址, { waitUntil: "domcontentloaded" });
    await 頁面.getByRole("button", { name: /放進我的安心清單/ }).click();

    const 儲存資料 = await 頁面.evaluate(() => JSON.parse(localStorage.getItem("遺產規劃安心清單") || "null"));
    assert.equal(儲存資料.版本, 1, "本機資料應包含可遷移的版本編號");
    assert.equal(儲存資料.選擇[0], "加入", "第一幕的選擇應保存在版本化資料內");

    await 頁面.locator("#安心清單").scrollIntoViewIfNeeded();
    await assert.doesNotReject(
      () => 頁面.locator("#下載摘要").waitFor({ state: "visible", timeout: 2000 }),
      "安心清單應提供下載摘要按鈕"
    );
    const 下載工作 = 頁面.waitForEvent("download");
    await 頁面.locator("#下載摘要").click();
    const 下載 = await 下載工作;
    assert.match(下載.suggestedFilename(), /^我的安心摘要-\d{4}-\d{2}-\d{2}\.txt$/, "下載檔名應清楚標示日期與內容");
    const 下載路徑 = await 下載.path();
    const 內容 = fs.readFileSync(下載路徑, "utf8");
    assert.match(內容, /香港遺產規劃｜我的安心摘要/, "摘要應有清楚標題");
    assert.match(內容, /居家獨處整理老物件/, "摘要應包含已選場景");
    assert.match(內容, /物業產權、流動資產、身份證明/, "摘要應包含已選場景涉及的資產");
    assert.match(內容, /不構成法律、稅務或投資意見/, "摘要應保留服務邊界提示");
  } finally {
    await 瀏覽器.close();
  }
}

測試安心摘要下載()
  .then(() => console.log("通過：版本化保存與安心摘要下載"))
  .catch((錯誤) => {
    console.error(錯誤.message);
    process.exit(1);
  });
