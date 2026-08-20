const fs = require("node:fs");
const path = require("node:path");

const 專案根目錄 = path.resolve(__dirname, "..");
const 成品目錄 = path.resolve(專案根目錄, "dist");
const 公開白名單 = [
  "index.html",
  "styles.css",
  "script.js",
  "favicon.svg",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "assets/vendor",
  "assets/media"
];

if (path.dirname(成品目錄) !== 專案根目錄 || path.basename(成品目錄) !== "dist") {
  throw new Error("成品目錄驗證失敗，已停止建立");
}

if (fs.existsSync(成品目錄)) fs.rmSync(成品目錄, { recursive: true, force: true });
fs.mkdirSync(成品目錄, { recursive: true });

for (const 相對路徑 of 公開白名單) {
  const 來源 = path.join(專案根目錄, 相對路徑);
  const 目的地 = path.join(成品目錄, 相對路徑);
  if (!fs.existsSync(來源)) throw new Error(`缺少公開檔案：${相對路徑}`);
  fs.mkdirSync(path.dirname(目的地), { recursive: true });
  fs.cpSync(來源, 目的地, { recursive: true });
}

console.log("正式靜態成品已建立：dist");
