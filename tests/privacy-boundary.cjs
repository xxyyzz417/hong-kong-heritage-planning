const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

const 網址 = process.env.TEST_URL || "http://127.0.0.1:8765";
const 預設瀏覽器路徑 = "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function 測試私隱與服務邊界() {
  const 啟動設定 = fs.existsSync(預設瀏覽器路徑) ? { executablePath: 預設瀏覽器路徑 } : {};
  const 瀏覽器 = await chromium.launch({ headless: true, ...啟動設定 });
  const 頁面 = await 瀏覽器.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });

  try {
    await 頁面.goto(網址, { waitUntil: "domcontentloaded" });
    assert.equal(await 頁面.locator("form, input, select, textarea").count(), 0, "未有正式接收端點前不應收集個人資料");
    assert.equal(await 頁面.getByRole("button", { name: /要求專員回電/ }).count(), 0, "不應保留看似可提交但實際不會傳送的回電按鈕");

    const 支援區 = 頁面.locator("#專業支援");
    await 支援區.scrollIntoViewIfNeeded();
    assert.match(await 支援區.innerText(), /正式免費諮詢服務：待確認/, "應清楚標示尚未啟用的正式服務");
    assert.match(await 支援區.innerText(), /不會要求提供網上銀行密碼、提款卡密碼或一次性驗證碼/, "應顯示具體防詐騙提示");

    const 官方連結名稱 = [
      "查看香港司法機構遺產承辦資料",
      "查找持有執業證書的香港律師",
      "閱讀香港個人資料私隱原則"
    ];
    for (const 名稱 of 官方連結名稱) {
      const 連結 = 頁面.getByRole("link", { name: 名稱 });
      await assert.doesNotReject(() => 連結.waitFor({ state: "visible", timeout: 2000 }), `應提供官方查證入口：${名稱}`);
      assert.equal(await 連結.getAttribute("target"), "_blank", "官方資料應在新分頁開啟，避免遺失整理進度");
      assert.match(await 連結.getAttribute("rel"), /noopener/, "外部連結應隔離原頁控制權");
    }
  } finally {
    await 瀏覽器.close();
  }
}

測試私隱與服務邊界()
  .then(() => console.log("通過：私隱優先服務邊界與官方查證入口"))
  .catch((錯誤) => {
    console.error(錯誤.message);
    process.exit(1);
  });
