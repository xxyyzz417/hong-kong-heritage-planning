"use strict";

const 總幀數 = 240;
const 影格目錄 = "./video split to png for scrolltriger/";
const 幕數文字 = ["一", "二", "三", "四", "五", "六"];
const 短標題 = ["整理舊物", "同桌晚飯", "老友閒聊", "陪伴覆診", "接送放學", "安心梳理"];
const 代表影格 = [1, 48, 96, 144, 196, 240];
const 幕定位進度 = 代表影格.map((影格) => (影格 - 1) / (總幀數 - 1));

const 右側漂浮 = {
  標題: [55, 12, 39],
  對話: [58, 37, 36],
  資產: [56, 55, 38],
  選擇: [54, 66, 41]
};

const 左側漂浮 = {
  標題: [5, 12, 41],
  對話: [7, 38, 38],
  資產: [5, 56, 40],
  選擇: [5, 67, 42]
};

const 上下分散 = {
  標題: [5, 11, 42],
  對話: [5, 58, 43],
  資產: [60, 12, 34],
  選擇: [55, 64, 40]
};

const 第三幕左上分散 = {
  標題: [3, 10, 48],
  對話: [5, 58, 43],
  資產: [63, 16, 31],
  選擇: [55, 64, 40]
};

const 左側分散 = {
  標題: [4, 11, 42],
  對話: [4, 48, 42],
  資產: [58, 12, 36],
  選擇: [4, 66, 43]
};

const 文案位置關鍵點 = [
  { 影格: 1, 佈局: 右側漂浮 },
  { 影格: 34, 佈局: 右側漂浮 },
  { 影格: 41, 佈局: 上下分散 },
  { 影格: 75, 佈局: 上下分散 },
  { 影格: 82, 佈局: 第三幕左上分散 },
  { 影格: 121, 佈局: 第三幕左上分散 },
  { 影格: 128, 佈局: 右側漂浮 },
  { 影格: 155, 佈局: 右側漂浮 },
  { 影格: 163, 佈局: 左側分散 },
  { 影格: 200, 佈局: 左側分散 },
  { 影格: 207, 佈局: 右側漂浮 },
  { 影格: 240, 佈局: 右側漂浮 }
];

const 場景資料 = [
  {
    標題: "居家獨處整理老物件",
    情緒: "平和懷舊",
    畫面: "晨光灑進睡房，您坐在藤椅上，慢慢翻開抽屜裡的銀行月結單與樓契，取出泛黃全家福輕拭相框，動作緩慢而細心。",
    對話: "這些陪伴您多年的物件，您希望日後由哪位家人繼續保管？",
    資產: ["物業產權", "流動資產", "身份證明"]
  },
  {
    標題: "吃飯日常同桌聚餐",
    情緒: "溫暖煙火氣",
    畫面: "晚飯時分，兒女返家圍坐餐桌，您不停為孫兒夾菜，飯桌聊著街坊近況與學業，燈光溫暖，笑聲此起彼落。",
    對話: "看著兒孫平安長大，您最放心不下的，是他們未來的生活開支嗎？",
    資產: ["生活開支保障", "定期存款與投資"]
  },
  {
    標題: "屋苑樓下老友閒聊",
    情緒: "若有所思",
    畫面: "午後屋苑的休憩座椅，幾位老友閒話家常，有人嘆息子女因遺產認證手續奔波，您靜靜聆聽，指尖輕敲扶手。",
    對話: "若不想讓親人為繁複的遺產管理書程序傷神，您願意現在就理清分配意向嗎？",
    資產: ["遺產分配意向", "授權書與遺囑意向"]
  },
  {
    標題: "陪同老伴診所覆診",
    情緒: "溫柔牽掛",
    畫面: "您攙扶老伴緩步前往普通科診所，排隊取藥時互相叮嚀保重，您輕聲說：年紀漸長，把身後事務安排交代清楚才安心。",
    對話: "為了應對突發狀況，您希望指定哪位信任的家人，為您預先處理財務與醫療決定？",
    資產: ["醫療決定權", "財務授權", "緊急聯絡人"]
  },
  {
    標題: "看望孫輩接送放學",
    情緒: "柔軟期許",
    畫面: "校門外等候孫兒放學，牽著小手漫步回家，看著孩子追逐嬉戲，您心中暗想：要留給他們穩妥保障，而非待理文件。",
    對話: "您希望為孫輩的學業與成長基金，設定專屬的撥款安排嗎？",
    資產: ["教育基金", "信託安排", "特定資產撥款"]
  },
  {
    標題: "回到家中從容梳理",
    情緒: "踏實釋懷",
    畫面: "您坐回書桌前，在家人陪伴下翻閱規劃指引，逐項確認資產分配，望向牆上全家福，嘴角浮現釋然笑容。",
    對話: "這份為您量身梳理的安排，是否已讓您感到安心？我們可為您預約專員作最後確認。",
    資產: ["綜合資產分配方案", "法律文件意向確認"]
  }
];

const 畫布 = document.getElementById("場景畫布");
const 繪圖環境 = 畫布.getContext("2d", { alpha: false });
const 舞台 = document.getElementById("場景舞台");
const 載入畫面 = document.getElementById("載入畫面");
const 載入進度條 = document.getElementById("載入進度條");
const 載入數值 = document.getElementById("載入數值");
const 靜態繼續 = document.getElementById("靜態繼續");
const 場景卡 = document.getElementById("場景卡");
const 場景情緒 = document.getElementById("場景情緒");
const 場景標題 = document.getElementById("場景標題");
const 場景畫面 = document.getElementById("場景畫面");
const 場景對話 = document.getElementById("場景對話");
const 資產標籤 = document.getElementById("資產標籤");
const 大型幕數 = document.getElementById("大型幕數");
const 進度文字 = document.getElementById("進度文字");
const 進度線 = document.getElementById("進度線");
const 進度按鈕 = Array.from(document.querySelectorAll("#進度線 button"));
const 上一幕按鈕 = document.getElementById("上一幕");
const 下一幕按鈕 = document.getElementById("下一幕");
const 加入清單按鈕 = document.getElementById("加入清單");
const 稍後再想按鈕 = document.getElementById("稍後再想");
const 清單內容 = document.getElementById("清單內容");

const 已載入影格 = new Map();
const 正在載入影格 = new Set();
const 減少動態 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const 移動裝置 = window.matchMedia("(max-width: 767px)").matches;
const 節省數據 = Boolean(navigator.connection && navigator.connection.saveData);
const 取樣間隔 = 節省數據 ? 2 : 1;
const 鄰近半徑 = 節省數據 ? 4 : (移動裝置 ? 8 : 12);
let 當前幕 = 0;
let 當前影格 = 1;
let 待繪影格 = 1;
let 繪製請求 = 0;
let 滾動觸發器 = null;
let 自動捲動請求 = 0;
let 文案時間軸 = null;
let 載入逾時計時器 = 0;
let 整理狀態 = 讀取整理狀態();

function 影格路徑(影格編號) {
  return `${影格目錄}ezgif-frame-${String(影格編號).padStart(3, "0")}.png`;
}

function 載入影格(影格編號) {
  const 安全影格 = Math.max(1, Math.min(總幀數, 影格編號));
  if (已載入影格.has(安全影格)) return Promise.resolve(已載入影格.get(安全影格));

  return new Promise((完成, 失敗) => {
    if (正在載入影格.has(安全影格)) {
      const 等候 = window.setInterval(() => {
        if (已載入影格.has(安全影格)) {
          window.clearInterval(等候);
          完成(已載入影格.get(安全影格));
        }
      }, 40);
      window.setTimeout(() => {
        window.clearInterval(等候);
        if (!已載入影格.has(安全影格)) 失敗(new Error("影格載入逾時"));
      }, 10000);
      return;
    }

    正在載入影格.add(安全影格);
    const 圖像 = new Image();
    圖像.decoding = "async";
    圖像.onload = () => {
      正在載入影格.delete(安全影格);
      已載入影格.set(安全影格, 圖像);
      完成(圖像);
    };
    圖像.onerror = () => {
      正在載入影格.delete(安全影格);
      失敗(new Error(`未能載入第${安全影格}幀`));
    };
    圖像.src = 影格路徑(安全影格);
  });
}

function 預載鄰近影格(中心影格) {
  const 待載入 = [];
  for (let 偏移 = -鄰近半徑; 偏移 <= 鄰近半徑; 偏移 += 取樣間隔) {
    const 編號 = Math.max(1, Math.min(總幀數, 中心影格 + 偏移));
    if (!已載入影格.has(編號) && !正在載入影格.has(編號)) 待載入.push(編號);
  }
  待載入.forEach((編號) => 載入影格(編號).catch(() => {}));
}

function 找出可用影格(目標影格) {
  if (已載入影格.has(目標影格)) return 已載入影格.get(目標影格);
  for (let 距離 = 1; 距離 <= 鄰近半徑 + 4; 距離 += 1) {
    if (已載入影格.has(目標影格 - 距離)) return 已載入影格.get(目標影格 - 距離);
    if (已載入影格.has(目標影格 + 距離)) return 已載入影格.get(目標影格 + 距離);
  }
  return 已載入影格.get(代表影格[當前幕]) || 已載入影格.get(1);
}

function 調整畫布尺寸() {
  const 像素比例 = Math.min(window.devicePixelRatio || 1, 移動裝置 ? 1.5 : 2);
  const 寬度 = Math.max(1, Math.round(舞台.clientWidth * 像素比例));
  const 高度 = Math.max(1, Math.round(舞台.clientHeight * 像素比例));
  if (畫布.width !== 寬度 || 畫布.height !== 高度) {
    畫布.width = 寬度;
    畫布.height = 高度;
  }
  安排繪製(當前影格);
}

function 繪製影格(影格編號) {
  const 圖像 = 找出可用影格(影格編號);
  if (!圖像) return;

  const 畫布比例 = 畫布.width / 畫布.height;
  const 圖像比例 = 圖像.naturalWidth / 圖像.naturalHeight;
  let 繪製寬度;
  let 繪製高度;
  let 水平位置;
  let 垂直位置;

  if (圖像比例 > 畫布比例) {
    繪製高度 = 畫布.height;
    繪製寬度 = 繪製高度 * 圖像比例;
    水平位置 = (畫布.width - 繪製寬度) / 2;
    垂直位置 = 0;
  } else {
    繪製寬度 = 畫布.width;
    繪製高度 = 繪製寬度 / 圖像比例;
    水平位置 = 0;
    垂直位置 = (畫布.height - 繪製高度) / 2;
  }

  繪圖環境.fillStyle = "#2b1b10";
  繪圖環境.fillRect(0, 0, 畫布.width, 畫布.height);
  繪圖環境.drawImage(圖像, 水平位置, 垂直位置, 繪製寬度, 繪製高度);
}

function 安排繪製(影格編號) {
  待繪影格 = 影格編號;
  if (繪製請求) return;
  繪製請求 = window.requestAnimationFrame(() => {
    繪製請求 = 0;
    當前影格 = 待繪影格;
    畫布.setAttribute("data-current-frame", String(待繪影格));
    繪製影格(待繪影格);
    更新文案位置(待繪影格);
  });
}

function 內插數值(起點, 終點, 進度) {
  return 起點 + (終點 - 起點) * 進度;
}

function 平滑位置進度(進度) {
  return 進度 * 進度 * (3 - 2 * 進度);
}

function 取得逐幀佈局(影格編號) {
  let 起點 = 文案位置關鍵點[0];
  let 終點 = 文案位置關鍵點[文案位置關鍵點.length - 1];

  for (let 索引 = 0; 索引 < 文案位置關鍵點.length - 1; 索引 += 1) {
    const 當前點 = 文案位置關鍵點[索引];
    const 下一點 = 文案位置關鍵點[索引 + 1];
    if (影格編號 >= 當前點.影格 && 影格編號 <= 下一點.影格) {
      起點 = 當前點;
      終點 = 下一點;
      break;
    }
  }

  const 距離 = Math.max(1, 終點.影格 - 起點.影格);
  const 原始進度 = Math.max(0, Math.min(1, (影格編號 - 起點.影格) / 距離));
  const 進度 = 平滑位置進度(原始進度);
  const 結果 = {};

  ["標題", "對話", "資產", "選擇"].forEach((區塊) => {
    結果[區塊] = 起點.佈局[區塊].map((數值, 索引) => 內插數值(數值, 終點.佈局[區塊][索引], 進度));
  });
  return 結果;
}

function 轉為移動版佈局(佈局) {
  return {
    標題: [4, 15, 92],
    對話: [4, 37, 92],
    資產: [4, 51, 92],
    選擇: [4, 67, 92]
  };
}

function 更新文案位置(影格編號) {
  const 原始佈局 = 取得逐幀佈局(影格編號);
  const 佈局 = 移動裝置 ? 轉為移動版佈局(原始佈局) : 原始佈局;
  const 對照 = {
    標題: ["--標題左", "--標題頂", "--標題寬"],
    對話: ["--對話左", "--對話頂", "--對話寬"],
    資產: ["--資產左", "--資產頂", "--資產寬"],
    選擇: ["--選擇左", "--選擇頂", "--選擇寬"]
  };

  Object.entries(對照).forEach(([區塊, 屬性]) => {
    屬性.forEach((名稱, 索引) => 場景卡.style.setProperty(名稱, `${佈局[區塊][索引].toFixed(2)}%`));
  });
}

function 計算影格(進度) {
  const 線性進度 = Math.max(0, Math.min(1, 進度));
  const 原始影格 = Math.floor(線性進度 * (總幀數 - 1)) + 1;
  if (取樣間隔 === 1 || 代表影格.includes(原始影格)) return 原始影格;
  return Math.min(總幀數, Math.max(1, Math.round((原始影格 - 1) / 取樣間隔) * 取樣間隔 + 1));
}

function 取得最近幕(進度) {
  const 目前影格 = 計算影格(進度);
  return 代表影格.reduce((最近索引, 影格, 索引) => (
    Math.abs(影格 - 目前影格) < Math.abs(代表影格[最近索引] - 目前影格) ? 索引 : 最近索引
  ), 0);
}

function 取得文案區塊() {
  return [
    場景卡.querySelector(".漂浮標題"),
    場景對話,
    場景卡.querySelector(".資產區"),
    場景卡.querySelector(".對話選擇")
  ];
}

function 播放文案浮現() {
  const 文案區塊 = 取得文案區塊();
  if (文案時間軸) 文案時間軸.kill();

  if (減少動態 || !window.gsap) {
    文案區塊.forEach((區塊) => {
      區塊.style.opacity = "1";
      區塊.style.visibility = "visible";
      區塊.style.transform = "none";
    });
    return;
  }

  window.gsap.set(文案區塊, { autoAlpha: 0, y: 22 });
  文案時間軸 = window.gsap.timeline();
  文案時間軸
    .to(文案區塊[0], { autoAlpha: 1, y: 0, duration: 1, ease: "power1.out" }, 0)
    .to(文案區塊[1], { autoAlpha: 1, y: 0, duration: 1, ease: "power1.out" }, 1.5)
    .to(文案區塊[2], { autoAlpha: 1, y: 0, duration: 1, ease: "power1.out" }, 3)
    .to(文案區塊[3], { autoAlpha: 1, y: 0, duration: 1, ease: "power1.out" }, 4.6);
}

function 更新場景(幕索引, 不使用動畫 = false) {
  if (幕索引 === 當前幕 && !不使用動畫) return;
  當前幕 = 幕索引;
  const 資料 = 場景資料[幕索引];

  const 套用內容 = () => {
    場景情緒.textContent = `第${幕數文字[幕索引]}幕｜${資料.情緒}`;
    場景標題.textContent = 資料.標題;
    場景畫面.textContent = 資料.畫面;
    場景對話.textContent = 資料.對話;
    資產標籤.replaceChildren(...資料.資產.map((項目) => {
      const 標籤 = document.createElement("li");
      標籤.textContent = 項目;
      return 標籤;
    }));
    大型幕數.textContent = 幕數文字[幕索引];
    進度文字.textContent = `第${幕數文字[幕索引]}幕，共六幕｜${短標題[幕索引]}`;
    畫布.setAttribute("aria-label", `第${幕數文字[幕索引]}幕，${資料.標題}。${資料.畫面}`);
    進度按鈕.forEach((按鈕, 索引) => {
      if (索引 === 幕索引) 按鈕.setAttribute("aria-current", "step");
      else 按鈕.removeAttribute("aria-current");
    });
    上一幕按鈕.hidden = 幕索引 === 0;
    下一幕按鈕.innerHTML = 幕索引 === 5
      ? "<span>免費諮詢</span><span aria-hidden=\"true\">→</span>"
      : "<span>前往下一幕</span><span aria-hidden=\"true\">→</span>";
    下一幕按鈕.setAttribute("aria-label", 幕索引 === 5 ? "前往免費諮詢" : "前往下一幕");
    更新選擇按鈕();
  };

  套用內容();
  if (不使用動畫) {
    取得文案區塊().forEach((區塊) => {
      區塊.style.opacity = "1";
      區塊.style.visibility = "visible";
      區塊.style.transform = "none";
    });
  } else 播放文案浮現();
}

function 處理進度(進度) {
  const 幕索引 = 取得最近幕(進度);
  const 影格編號 = 減少動態 ? 代表影格[幕索引] : 計算影格(進度);
  進度線.style.setProperty("--旅程進度", Math.max(0, Math.min(1, 進度)).toFixed(4));
  安排繪製(影格編號);
  預載鄰近影格(影格編號);
  if (幕索引 !== 當前幕) 更新場景(幕索引);
}

function 停止自動捲動() {
  if (!自動捲動請求) return;
  window.cancelAnimationFrame(自動捲動請求);
  自動捲動請求 = 0;
  上一幕按鈕.disabled = false;
  下一幕按鈕.disabled = false;
}

function 勻速捲動至(目標位置, 時長 = 5200) {
  停止自動捲動();
  if (減少動態) {
    window.scrollTo(0, 目標位置);
    return;
  }

  const 起點位置 = window.scrollY;
  const 開始時間 = window.performance.now();
  上一幕按鈕.disabled = true;
  下一幕按鈕.disabled = true;

  const 更新位置 = (現在時間) => {
    const 進度 = Math.min(1, (現在時間 - 開始時間) / 時長);
    window.scrollTo(0, 起點位置 + (目標位置 - 起點位置) * 進度);
    if (進度 < 1) {
      自動捲動請求 = window.requestAnimationFrame(更新位置);
      return;
    }
    自動捲動請求 = 0;
    上一幕按鈕.disabled = false;
    下一幕按鈕.disabled = false;
  };

  自動捲動請求 = window.requestAnimationFrame(更新位置);
}

function 前往幕(幕索引, 勻速播放 = false) {
  const 安全索引 = Math.max(0, Math.min(5, 幕索引));
  if (!滾動觸發器) {
    更新場景(安全索引);
    安排繪製(代表影格[安全索引]);
    return;
  }
  const 目標位置 = 滾動觸發器.start + 幕定位進度[安全索引] * (滾動觸發器.end - 滾動觸發器.start);
  if (勻速播放) 勻速捲動至(目標位置);
  else window.scrollTo({ top: 目標位置, behavior: 減少動態 ? "auto" : "smooth" });
}

function 建立滾動體驗() {
  if (!window.gsap || !window.ScrollTrigger) {
    建立原生備援();
    return;
  }

  window.gsap.registerPlugin(window.ScrollTrigger);
  滾動觸發器 = window.ScrollTrigger.create({
    trigger: "#人生時間軸",
    start: "top top",
    end: () => `+=${Math.max(window.innerHeight * 13, 9000)}`,
    pin: "#場景舞台",
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (狀態) => 處理進度(狀態.progress)
  });
}

function 建立原生備援() {
  const 時間軸 = document.getElementById("人生時間軸");
  時間軸.style.minHeight = "1400vh";
  舞台.style.position = "sticky";
  舞台.style.top = "0";
  window.addEventListener("scroll", () => {
    const 範圍 = 時間軸.getBoundingClientRect();
    const 可捲距離 = 時間軸.offsetHeight - window.innerHeight;
    const 進度 = Math.max(0, Math.min(1, -範圍.top / 可捲距離));
    處理進度(進度);
  }, { passive: true });
}

function 讀取整理狀態() {
  try {
    const 資料 = JSON.parse(window.localStorage.getItem("安心清單") || "{}");
    return typeof 資料 === "object" && 資料 ? 資料 : {};
  } catch {
    return {};
  }
}

function 儲存整理狀態() {
  try {
    window.localStorage.setItem("安心清單", JSON.stringify(整理狀態));
  } catch {
    return;
  }
}

function 更新選擇按鈕() {
  const 狀態 = 整理狀態[當前幕];
  加入清單按鈕.classList.toggle("已選擇", 狀態 === "加入");
  稍後再想按鈕.classList.toggle("已選擇", 狀態 === "稍後");
  加入清單按鈕.querySelector("span").textContent = 狀態 === "加入" ? "已放進我的安心清單" : "建議：放進我的安心清單";
  稍後再想按鈕.querySelector("span").textContent = 狀態 === "稍後" ? "已記下：稍後再想" : "稍後再想（不加入清單）";
}

function 記錄選擇(選擇) {
  整理狀態[當前幕] = 選擇;
  儲存整理狀態();
  更新選擇按鈕();
  更新安心清單();
}

function 更新安心清單() {
  const 已加入 = 場景資料
    .map((資料, 索引) => ({ 資料, 索引 }))
    .filter(({ 索引 }) => 整理狀態[索引] === "加入");

  if (!已加入.length) {
    清單內容.innerHTML = "<p>您的清單目前仍是空白。這沒有問題，您可返回任何一幕慢慢選擇。</p>";
    return;
  }

  const 清單 = document.createElement("ul");
  已加入.forEach(({ 資料, 索引 }) => {
    const 項目 = document.createElement("li");
    const 標題 = document.createElement("strong");
    const 內容 = document.createElement("span");
    標題.textContent = `第${幕數文字[索引]}幕｜${資料.標題}`;
    內容.textContent = 資料.資產.join("、");
    項目.append(標題, 內容);
    清單.append(項目);
  });
  清單內容.replaceChildren(清單);
}

async function 準備首批影格() {
  let 已完成數量 = 0;
  const 首批 = Array.from(new Set(代表影格));
  載入逾時計時器 = window.setTimeout(() => {
    靜態繼續.hidden = false;
    載入數值.textContent = "載入時間較長，您可改以靜態內容繼續";
  }, 10000);

  await Promise.allSettled(首批.map(async (編號) => {
    await 載入影格(編號);
    已完成數量 += 1;
    const 百分比 = Math.round((已完成數量 / 首批.length) * 100);
    載入進度條.style.width = `${百分比}%`;
    載入數值.textContent = `百分之${轉為中文數字(百分比)}`;
    if (編號 === 1) 繪製影格(1);
  }));

  window.clearTimeout(載入逾時計時器);
  if (!已載入影格.size) {
    靜態繼續.hidden = false;
    載入數值.textContent = "未能載入動態場景，請以靜態內容繼續";
    return;
  }
  載入進度條.style.width = "100%";
  載入數值.textContent = "百分之一百";
  window.setTimeout(() => 載入畫面.classList.add("已完成"), 250);
  window.setTimeout(() => { 載入畫面.hidden = true; }, 800);
  預載鄰近影格(1);
}

function 轉為中文數字(數值) {
  const 字 = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  if (數值 === 100) return "一百";
  if (數值 < 10) return 字[數值];
  const 十位 = Math.floor(數值 / 10);
  const 個位 = 數值 % 10;
  return `${十位 === 1 ? "" : 字[十位]}十${個位 ? 字[個位] : ""}`;
}

const 回電對話 = document.getElementById("回電對話");
const 回電標題 = document.getElementById("回電標題");
const 對話步驟 = document.getElementById("對話步驟");
const 回電內容 = document.getElementById("回電內容");
let 回電資料 = { 時段: "", 稱呼: "", 電話: "" };

function 顯示回電步驟(步驟) {
  if (步驟 === 1) {
    對話步驟.textContent = "第一步，共三步";
    回電標題.textContent = "甚麼時候聯絡您較方便？";
    回電內容.innerHTML = `
      <div class="回電選項">
        <button type="button">上午</button>
        <button type="button">下午</button>
        <button type="button">其他時間，由專員先與我確認</button>
      </div>`;
    Array.from(回電內容.querySelectorAll("button")).forEach((按鈕) => {
      按鈕.addEventListener("click", () => {
        回電資料.時段 = 按鈕.textContent.trim();
        顯示回電步驟(2);
      });
    });
  }

  if (步驟 === 2) {
    對話步驟.textContent = "第二步，共三步";
    回電標題.textContent = "專員應如何稱呼您？";
    回電內容.innerHTML = `
      <div class="回電欄位">
        <label for="回電稱呼">您的稱呼</label>
        <input id="回電稱呼" type="text" autocomplete="name" maxlength="30" placeholder="請輸入稱呼">
        <small>只需填寫您希望專員使用的稱呼。</small>
      </div>
      <div class="回電操作">
        <button type="button" id="返回時段">返回</button>
        <button class="繼續按鈕" type="button" id="前往電話">繼續</button>
      </div>`;
    document.getElementById("回電稱呼").value = 回電資料.稱呼;
    document.getElementById("返回時段").addEventListener("click", () => 顯示回電步驟(1));
    document.getElementById("前往電話").addEventListener("click", () => {
      const 稱呼 = document.getElementById("回電稱呼").value.trim();
      if (!稱呼) {
        document.getElementById("回電稱呼").focus();
        return;
      }
      回電資料.稱呼 = 稱呼;
      顯示回電步驟(3);
    });
    document.getElementById("回電稱呼").focus();
  }

  if (步驟 === 3) {
    對話步驟.textContent = "第三步，共三步";
    回電標題.textContent = "專員可致電哪個號碼？";
    回電內容.innerHTML = `
      <div class="回電欄位">
        <label for="回電電話">香港聯絡電話</label>
        <input id="回電電話" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" placeholder="請輸入聯絡電話">
        <small>正式接收預約的方式仍待確認，現階段資料不會傳送。</small>
      </div>
      <div class="回電操作">
        <button type="button" id="返回稱呼">返回</button>
        <button class="繼續按鈕" type="button" id="核對回電">核對資料</button>
      </div>`;
    document.getElementById("回電電話").value = 回電資料.電話;
    document.getElementById("返回稱呼").addEventListener("click", () => 顯示回電步驟(2));
    document.getElementById("核對回電").addEventListener("click", () => {
      const 電話 = document.getElementById("回電電話").value.trim();
      if (!電話) {
        document.getElementById("回電電話").focus();
        return;
      }
      回電資料.電話 = 電話;
      顯示回電摘要();
    });
    document.getElementById("回電電話").focus();
  }
}

function 顯示回電摘要() {
  對話步驟.textContent = "資料核對";
  回電標題.textContent = "請核對您的回電安排";
  回電內容.innerHTML = `
    <div class="回電摘要">
      <p><strong>稱呼：</strong><span id="摘要稱呼"></span></p>
      <p><strong>方便時段：</strong><span id="摘要時段"></span></p>
      <p><strong>聯絡電話：</strong><span id="摘要電話"></span></p>
    </div>
    <p>待確認：正式預約接收方式。現階段不會把以上資料傳送至任何地方。</p>
    <div class="回電操作">
      <button type="button" id="返回修改">返回修改</button>
      <button class="繼續按鈕" type="button" id="完成整理">完成整理</button>
    </div>`;
  document.getElementById("摘要稱呼").textContent = 回電資料.稱呼;
  document.getElementById("摘要時段").textContent = 回電資料.時段;
  document.getElementById("摘要電話").textContent = 回電資料.電話;
  document.getElementById("返回修改").addEventListener("click", () => 顯示回電步驟(3));
  document.getElementById("完成整理").addEventListener("click", () => {
    回電標題.textContent = "回電資料已整理";
    對話步驟.textContent = "已完成";
    回電內容.innerHTML = "<p>您的資料仍只保留在這個畫面。待正式預約接收方式確認後，才可提交回電要求。</p><div class=\"回電操作\"><button class=\"繼續按鈕\" type=\"button\" id=\"關閉完成\">關閉</button></div>";
    document.getElementById("關閉完成").addEventListener("click", () => 回電對話.close());
  });
}

document.getElementById("開始旅程").addEventListener("click", () => {
  document.getElementById("人生時間軸").scrollIntoView({ behavior: 減少動態 ? "auto" : "smooth" });
});

document.getElementById("返回時間軸").addEventListener("click", () => 前往幕(當前幕));
進度按鈕.forEach((按鈕, 索引) => 按鈕.addEventListener("click", () => 前往幕(索引)));
上一幕按鈕.addEventListener("click", () => 前往幕(當前幕 - 1, true));
下一幕按鈕.addEventListener("click", () => {
  if (當前幕 === 5) document.getElementById("免費諮詢").scrollIntoView({ behavior: 減少動態 ? "auto" : "smooth" });
  else 前往幕(當前幕 + 1, true);
});
加入清單按鈕.addEventListener("click", () => 記錄選擇("加入"));
稍後再想按鈕.addEventListener("click", () => 記錄選擇("稍後"));

document.getElementById("要求回電").addEventListener("click", () => {
  回電資料 = { 時段: "", 稱呼: "", 電話: "" };
  顯示回電步驟(1);
  回電對話.showModal();
});
document.getElementById("關閉回電").addEventListener("click", () => 回電對話.close());
回電對話.addEventListener("click", (事件) => {
  if (事件.target === 回電對話) 回電對話.close();
});

document.getElementById("清除記錄").addEventListener("click", () => {
  const 確定清除 = window.confirm("確定清除這部裝置上的安心清單嗎？清除後不能復原。");
  if (!確定清除) return;
  整理狀態 = {};
  try { window.localStorage.removeItem("安心清單"); } catch {}
  更新選擇按鈕();
  更新安心清單();
});

靜態繼續.addEventListener("click", () => {
  window.clearTimeout(載入逾時計時器);
  載入畫面.hidden = true;
  更新場景(0, true);
});

let 尺寸計時器 = 0;
window.addEventListener("resize", () => {
  window.clearTimeout(尺寸計時器);
  尺寸計時器 = window.setTimeout(() => {
    調整畫布尺寸();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }, 180);
});

更新場景(0, true);
更新安心清單();
調整畫布尺寸();
準備首批影格().then(建立滾動體驗);
