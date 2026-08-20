const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

const 網址 = process.env.TEST_URL || "http://127.0.0.1:8765";
const 預設瀏覽器路徑 = "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function 取得可見尺寸問題(頁面) {
  return 頁面.evaluate(() => {
    const 可見 = (元素) => {
      const 樣式 = getComputedStyle(元素);
      const 範圍 = 元素.getBoundingClientRect();
      return 樣式.display !== "none" && 樣式.visibility !== "hidden" && 範圍.width > 0 && 範圍.height > 0;
    };
    const 字體問題 = Array.from(document.querySelectorAll("p, li, a, button, small, strong, h1, h2, h3"))
      .filter((元素) => 可見(元素) && 元素.textContent.trim())
      .filter((元素) => Number.parseFloat(getComputedStyle(元素).fontSize) < 20)
      .map((元素) => `${元素.tagName.toLowerCase()}.${元素.className || "無類別"}:${getComputedStyle(元素).fontSize}`);
    const 行距問題 = Array.from(document.querySelectorAll("p, li, a, button, small, strong"))
      .filter((元素) => 可見(元素) && !元素.closest('[aria-hidden="true"]') && !元素.classList.contains("視覺隱藏") && 元素.textContent.trim())
      .filter((元素) => {
        const 樣式 = getComputedStyle(元素);
        return Number.parseFloat(樣式.lineHeight) / Number.parseFloat(樣式.fontSize) < 1.59;
      })
      .map((元素) => `${元素.tagName.toLowerCase()}.${元素.className || "無類別"}:${getComputedStyle(元素).lineHeight}`);
    const 觸控問題 = Array.from(document.querySelectorAll("button, a.按鈕, .頁首 a, .官方資源 a, .略過連結"))
      .filter(可見)
      .filter((元素) => {
        const 範圍 = 元素.getBoundingClientRect();
        return 範圍.width < 48 || 範圍.height < 48;
      })
      .map((元素) => `${元素.tagName.toLowerCase()}.${元素.className || "無類別"}`);
    return { 字體問題, 行距問題, 觸控問題 };
  });
}

async function 驗證小型畫面(瀏覽器, 寬度, 高度) {
  const 頁面 = await 瀏覽器.newPage({ viewport: { width: 寬度, height: 高度 }, reducedMotion: "reduce" });
  await 頁面.goto(網址, { waitUntil: "domcontentloaded" });
  await 頁面.getByRole("button", { name: "開始這段旅程" }).click();

  for (let 幕索引 = 0; 幕索引 < 6; 幕索引 += 1) {
    await 頁面.locator("#進度線 button").nth(幕索引).click();
    await 頁面.waitForTimeout(60);
    const 結果 = await 頁面.evaluate(() => {
      const 範圍 = (選擇器) => {
        const 元素 = document.querySelector(選擇器);
        const 矩形 = 元素.getBoundingClientRect();
        return { 選擇器, 上: 矩形.top, 下: 矩形.bottom, 左: 矩形.left, 右: 矩形.right };
      };
      const 相交 = (甲, 乙) => 甲.左 < 乙.右 - 1 && 甲.右 > 乙.左 + 1 && 甲.上 < 乙.下 - 1 && 甲.下 > 乙.上 + 1;
      const 區塊 = [".漂浮標題", ".場景對話", ".資產區", ".對話選擇"].map(範圍);
      const 重疊 = [];
      for (let 甲 = 0; 甲 < 區塊.length; 甲 += 1) {
        for (let 乙 = 甲 + 1; 乙 < 區塊.length; 乙 += 1) {
          if (相交(區塊[甲], 區塊[乙])) 重疊.push(`${區塊[甲].選擇器} 與 ${區塊[乙].選擇器}`);
        }
      }
      const 舞台 = 範圍("#場景舞台");
      const 場景卡 = document.getElementById("場景卡");
      const 卡範圍 = 範圍("#場景卡");
      const 控制 = 範圍(".場景控制");
      const 需要內捲 = Math.max(...區塊.map((項目) => 項目.下)) > 卡範圍.下 + 1;
      const 可內捲 = ["auto", "scroll"].includes(getComputedStyle(場景卡).overflowY);
      const 可見區塊 = 可內捲
        ? 區塊.map((項目) => ({ ...項目, 上: Math.max(項目.上, 卡範圍.上), 下: Math.min(項目.下, 卡範圍.下) }))
        : 區塊;
      return {
        重疊,
        舞台,
        卡範圍,
        控制,
        控制重疊: 可見區塊.filter((項目) => 項目.下 > 項目.上 && 相交(項目, 控制)).map((項目) => 項目.選擇器),
        需要內捲,
        可內捲,
        橫向寬度: document.documentElement.scrollWidth,
        提示可見: getComputedStyle(document.querySelector(".短幕提示")).display !== "none"
      };
    });
    assert.deepEqual(結果.重疊, [], `${寬度}×${高度} 第${幕索引 + 1}幕文字不可互相重疊：${結果.重疊.join("、")}`);
    assert.ok(結果.舞台.上 >= -1 && 結果.舞台.下 <= 高度 + 1, `${寬度}×${高度} 場景舞台不可離開視窗`);
    assert.ok(結果.控制.上 >= -1 && 結果.控制.下 <= 高度 + 1, `${寬度}×${高度} 場景控制不可離開視窗`);
    assert.deepEqual(結果.控制重疊, [], `${寬度}×${高度} 文案內容不可與場景控制重疊：${結果.控制重疊.join("、")}`);
    assert.ok(結果.橫向寬度 <= 寬度, `${寬度}×${高度} 不可出現橫向溢位`);
    if (結果.需要內捲) {
      assert.ok(結果.可內捲 && 結果.提示可見, `${寬度}×${高度} 內容超高時必須可捲動並提供繁體中文提示`);
    }
  }

  await 頁面.close();
}

async function 測試正式版無障礙佈局() {
  const 啟動設定 = fs.existsSync(預設瀏覽器路徑) ? { executablePath: 預設瀏覽器路徑 } : {};
  const 瀏覽器 = await chromium.launch({ headless: true, ...啟動設定 });

  try {
    const 桌面頁面 = await 瀏覽器.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    await 桌面頁面.goto(網址, { waitUntil: "domcontentloaded" });
    assert.equal(await 桌面頁面.locator(".略過連結").count(), 2, "應同時提供前往時間軸及安心清單的略過連結");
    assert.doesNotMatch(await 桌面頁面.locator("body").innerText(), /[A-Za-z]/, "用戶可見內容不可出現英文字母");

    const 桌面尺寸 = await 取得可見尺寸問題(桌面頁面);
    assert.deepEqual(桌面尺寸.字體問題, [], `桌面可見文字不可小於二十像素：${桌面尺寸.字體問題.join("、")}`);
    assert.deepEqual(桌面尺寸.行距問題, [], `桌面正文與控制文字行距不可小於一點六：${桌面尺寸.行距問題.join("、")}`);
    assert.deepEqual(桌面尺寸.觸控問題, [], `桌面操作目標不可小於四十八像素：${桌面尺寸.觸控問題.join("、")}`);

    const 對比保護 = await 桌面頁面.locator(".場景卡").evaluate((元素) => getComputedStyle(元素).getPropertyValue("--文案對比保護").trim());
    assert.equal(對比保護, "啟用", "影片上的漂浮文案應啟用局部對比保護");

    const 手機頁面 = await 瀏覽器.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    await 手機頁面.goto(網址, { waitUntil: "domcontentloaded" });
    await 手機頁面.getByRole("button", { name: "開始這段旅程" }).click();

    for (let 幕索引 = 0; 幕索引 < 6; 幕索引 += 1) {
      await 手機頁面.locator("#進度線 button").nth(幕索引).click();
      await 手機頁面.waitForTimeout(80);
      const 佈局 = await 手機頁面.evaluate(() => {
        const 選擇器 = [".漂浮標題", ".場景對話", ".資產區", ".對話選擇", ".場景控制"];
        return 選擇器.map((選擇) => {
          const 範圍 = document.querySelector(選擇).getBoundingClientRect();
          return { 選擇, 上: 範圍.top, 下: 範圍.bottom, 左: 範圍.left, 右: 範圍.right };
        });
      });
      for (let 索引 = 0; 索引 < 佈局.length - 1; 索引 += 1) {
        assert.ok(佈局[索引].下 <= 佈局[索引 + 1].上 + 1, `第${幕索引 + 1}幕手機文字不可重疊：${佈局[索引].選擇} 與 ${佈局[索引 + 1].選擇}`);
      }
      佈局.forEach((區塊) => {
        assert.ok(區塊.左 >= -1 && 區塊.右 <= 391, `第${幕索引 + 1}幕 ${區塊.選擇} 不可超出手機左右邊界`);
      });
    }

    const 手機尺寸 = await 取得可見尺寸問題(手機頁面);
    assert.deepEqual(手機尺寸.字體問題, [], `手機可見文字不可小於二十像素：${手機尺寸.字體問題.join("、")}`);
    assert.deepEqual(手機尺寸.行距問題, [], `手機正文與控制文字行距不可小於一點六：${手機尺寸.行距問題.join("、")}`);
    assert.deepEqual(手機尺寸.觸控問題, [], `手機操作目標不可小於四十八像素：${手機尺寸.觸控問題.join("、")}`);

    await 手機頁面.evaluate(() => localStorage.clear());
    await 手機頁面.reload({ waitUntil: "domcontentloaded" });
    await 手機頁面.keyboard.press("Tab");
    const 焦點文字 = await 手機頁面.evaluate(() => document.activeElement && document.activeElement.textContent.trim());
    assert.match(焦點文字, /直接前往/, "鍵盤第一個焦點應為略過連結");

    await 手機頁面.getByRole("button", { name: "開始這段旅程" }).click();
    await 手機頁面.locator("#進度線 button").first().click();
    await 手機頁面.waitForTimeout(80);
    await 手機頁面.locator("#加入清單").click();
    assert.equal(await 手機頁面.locator("#加入清單").getAttribute("aria-pressed"), "true", "加入清單時應提供可讀選取狀態");
    assert.equal(await 手機頁面.locator("#稍後再想").getAttribute("aria-pressed"), "false", "兩個選擇不可同時選取");
    await 手機頁面.locator("#稍後再想").click();
    assert.equal(await 手機頁面.locator("#加入清單").getAttribute("aria-pressed"), "false", "改選稍後再想時應取消上一項");
    assert.equal(await 手機頁面.locator("#稍後再想").getAttribute("aria-pressed"), "true", "稍後再想應提供可讀選取狀態");

    for (const [寬度, 高度] of [[320, 568], [360, 640], [768, 430], [844, 390], [1280, 720]]) {
      await 驗證小型畫面(瀏覽器, 寬度, 高度);
    }
  } finally {
    await 瀏覽器.close();
  }
}

測試正式版無障礙佈局()
  .then(() => console.log("通過：正式版長者無障礙與跨裝置佈局"))
  .catch((錯誤) => {
    console.error(錯誤.message);
    process.exit(1);
  });
