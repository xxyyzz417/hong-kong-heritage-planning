const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");

const 根目錄 = path.resolve(__dirname, "..");
const 連接埠 = 8800 + (process.pid % 500);
const 測試網址 = `http://127.0.0.1:${連接埠}`;
const 測試檔案 = [
  "media-pipeline.cjs",
  "media-fallback.cjs",
  "scene-transitions.cjs",
  "summary-tools.cjs",
  "share-summary.cjs",
  "privacy-boundary.cjs",
  "accessibility-layout.cjs",
  "deployment-readiness.cjs"
];

function 等候伺服器(程序) {
  return new Promise((完成, 失敗) => {
    const 計時器 = setTimeout(() => 失敗(new Error("測試伺服器啟動逾時")), 8000);
    程序.stdout.on("data", (資料) => {
      if (!資料.toString().includes("測試伺服器已啟動")) return;
      clearTimeout(計時器);
      完成();
    });
    程序.on("exit", (代碼) => {
      clearTimeout(計時器);
      失敗(new Error(`測試伺服器提早結束：${代碼}`));
    });
  });
}

(async () => {
  const 伺服器 = spawn(process.execPath, [path.join(__dirname, "static-server.cjs")], {
    cwd: 根目錄,
    env: { ...process.env, PORT: String(連接埠) },
    stdio: ["ignore", "pipe", "inherit"]
  });

  try {
    await 等候伺服器(伺服器);
    for (const 測試檔案名稱 of 測試檔案) {
      const 結果 = spawnSync(process.execPath, [path.join(__dirname, 測試檔案名稱)], {
        cwd: 根目錄,
        env: { ...process.env, TEST_URL: 測試網址 },
        stdio: "inherit"
      });
      if (結果.status !== 0) process.exitCode = 結果.status || 1;
      if (process.exitCode) break;
    }
  } finally {
    伺服器.kill();
  }
})().catch((錯誤) => {
  console.error(錯誤.message);
  process.exitCode = 1;
});
