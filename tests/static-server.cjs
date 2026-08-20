const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const 根目錄 = path.resolve(process.cwd());
const 連接埠 = Number(process.env.PORT || 8765);
const 類型對照 = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function 取得檔案路徑(要求網址) {
  const 路徑名稱 = decodeURIComponent(new URL(要求網址, "http://127.0.0.1").pathname);
  const 相對路徑 = 路徑名稱 === "/" ? "index.html" : 路徑名稱.replace(/^\/+/, "");
  const 完整路徑 = path.resolve(根目錄, 相對路徑);
  return 完整路徑.startsWith(根目錄 + path.sep) || 完整路徑 === 根目錄 ? 完整路徑 : null;
}

const 伺服器 = http.createServer((要求, 回應) => {
  const 檔案路徑 = 取得檔案路徑(要求.url || "/");
  if (!檔案路徑 || !fs.existsSync(檔案路徑) || !fs.statSync(檔案路徑).isFile()) {
    回應.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    回應.end("找不到檔案");
    return;
  }

  const 大小 = fs.statSync(檔案路徑).size;
  const 類型 = 類型對照[path.extname(檔案路徑).toLowerCase()] || "application/octet-stream";
  const 範圍 = 要求.headers.range;
  const 共用標頭 = {
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-cache",
    "Content-Type": 類型
  };

  if (範圍) {
    const 符合 = /bytes=(\d*)-(\d*)/.exec(範圍);
    const 開始 = 符合 && 符合[1] ? Number(符合[1]) : 0;
    const 結束 = 符合 && 符合[2] ? Math.min(Number(符合[2]), 大小 - 1) : 大小 - 1;
    if (!符合 || 開始 > 結束 || 開始 >= 大小) {
      回應.writeHead(416, { ...共用標頭, "Content-Range": `bytes */${大小}` });
      回應.end();
      return;
    }
    回應.writeHead(206, {
      ...共用標頭,
      "Content-Length": 結束 - 開始 + 1,
      "Content-Range": `bytes ${開始}-${結束}/${大小}`
    });
    if (要求.method === "HEAD") 回應.end();
    else fs.createReadStream(檔案路徑, { start: 開始, end: 結束 }).pipe(回應);
    return;
  }

  回應.writeHead(200, { ...共用標頭, "Content-Length": 大小 });
  if (要求.method === "HEAD") 回應.end();
  else fs.createReadStream(檔案路徑).pipe(回應);
});

伺服器.listen(連接埠, "127.0.0.1", () => {
  console.log(`測試伺服器已啟動：http://127.0.0.1:${連接埠}`);
});
