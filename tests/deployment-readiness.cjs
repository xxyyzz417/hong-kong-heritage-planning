const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const 根目錄 = path.resolve(__dirname, "..");
const 讀取文字 = (相對路徑) => fs.readFileSync(path.join(根目錄, 相對路徑), "utf8");
const 檔案大小 = (相對路徑) => fs.statSync(path.join(根目錄, 相對路徑)).size;

function 加總資料夾大小(資料夾) {
  return fs.readdirSync(資料夾, { withFileTypes: true }).reduce((總數, 項目) => {
    const 完整路徑 = path.join(資料夾, 項目.name);
    return 總數 + (項目.isDirectory() ? 加總資料夾大小(完整路徑) : fs.statSync(完整路徑).size);
  }, 0);
}

function 測試正式部署準備度() {
  const 必要檔案 = [
    "package.json",
    "pnpm-lock.yaml",
    "scripts/build.cjs",
    "vercel.json",
    "404.html",
    "robots.txt",
    "sitemap.xml",
    ".github/workflows/website-quality.yml"
  ];
  必要檔案.forEach((相對路徑) => assert.ok(fs.existsSync(path.join(根目錄, 相對路徑)), `缺少正式部署檔案：${相對路徑}`));

  assert.ok(檔案大小("assets/media/heritage-scroll-1280-v1.mp4") < 40 * 1024 * 1024, "桌面影片必須低於四十百萬位元組");
  assert.ok(檔案大小("assets/media/heritage-scroll-960-v1.mp4") < 20 * 1024 * 1024, "手機影片必須低於二十百萬位元組");
  const 靜態圖總量 = fs.readdirSync(path.join(根目錄, "assets/media"))
    .filter((名稱) => 名稱.endsWith(".webp"))
    .reduce((總數, 名稱) => 總數 + 檔案大小(path.join("assets/media", 名稱)), 0);
  assert.ok(靜態圖總量 < 1024 * 1024, "六張靜態備援圖總量必須低於一百萬位元組");

  const 網頁 = 讀取文字("index.html");
  assert.doesNotMatch(網頁, /\.png|場景畫布|video split to png/i, "正式網頁不得再引用舊圖片序列或畫布");
  assert.match(網頁, /rel="canonical" href="https:\/\//, "正式網頁必須提供絕對標準網址");
  assert.match(網頁, /property="og:locale" content="zh_HK"/, "正式網頁必須提供香港繁體中文分享語系");

  const 設定 = JSON.parse(讀取文字("vercel.json"));
  assert.equal(設定.outputDirectory, "dist", "Vercel 只可部署白名單成品資料夾");
  const 全站標頭 = 設定.headers.find((項目) => 項目.source === "/(.*)");
  const 標頭名稱 = new Set(全站標頭.headers.map((項目) => 項目.key));
  ["Content-Security-Policy", "X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy"].forEach((名稱) => {
    assert.ok(標頭名稱.has(名稱), `缺少安全標頭：${名稱}`);
  });
  const 媒體標頭 = 設定.headers.find((項目) => 項目.source.includes("assets/media"));
  assert.match(JSON.stringify(媒體標頭), /max-age=31536000.*immutable/, "版本化媒體必須設定一年不可變快取");

  const 建立結果 = spawnSync(process.execPath, [path.join(根目錄, "scripts/build.cjs")], { cwd: 根目錄, encoding: "utf8" });
  assert.equal(建立結果.status, 0, `正式成品建立失敗：${建立結果.stderr || 建立結果.stdout}`);
  const 成品目錄 = path.join(根目錄, "dist");
  assert.ok(fs.existsSync(path.join(成品目錄, "index.html")), "正式成品必須包含首頁");
  assert.equal(fs.existsSync(path.join(成品目錄, "tests")), false, "正式成品不可包含測試程式");
  assert.equal(fs.existsSync(path.join(成品目錄, "docs")), false, "正式成品不可包含內部工程紀錄");
  assert.equal(fs.existsSync(path.join(成品目錄, "video split to png for scrolltriger")), false, "正式成品不可包含舊圖片序列");
  assert.ok(加總資料夾大小(成品目錄) < 100 * 1024 * 1024, "正式部署成品必須低於一百百萬位元組");
}

try {
  測試正式部署準備度();
  console.log("通過：正式部署白名單、效能預算、搜尋資料與安全標頭");
} catch (錯誤) {
  console.error(錯誤.message);
  process.exit(1);
}
