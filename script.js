"use strict";

const 總幀數 = 240;
const 影片影格率 = 24;
const 整理儲存鍵 = "遺產規劃安心清單";
const 舊整理儲存鍵 = "安心清單";
const 幕數文字 = ["一", "二", "三", "四", "五", "六"];
const 短標題 = ["整理舊物", "同桌晚飯", "老友閒聊", "陪伴覆診", "接送放學", "安心梳理"];
const 代表影格 = [1, 48, 96, 144, 196, 240];
const 幕定位進度 = 代表影格.map((影格) => (影格 - 1) / (總幀數 - 1));

const 右側漂浮 = {
  標題: [55, 12, 39],
  對話: [56, 34, 40],
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

const 影片 = document.getElementById("場景影片");
const 靜態場景 = document.getElementById("靜態場景");
const 場景替代文字 = document.getElementById("場景替代文字");
const 媒體狀態 = document.getElementById("媒體狀態");
const 媒體切換按鈕 = document.getElementById("切換媒體模式");
const 舞台 = document.getElementById("場景舞台");
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

const 減少動態查詢 = window.matchMedia("(prefers-reduced-motion: reduce)");
const 移動裝置查詢 = window.matchMedia("(max-width: 767px)");
let 減少動態 = 減少動態查詢.matches;
let 移動裝置 = 移動裝置查詢.matches;
const 節省數據 = Boolean(navigator.connection && navigator.connection.saveData);
let 當前幕 = 0;
let 當前影格 = 1;
let 當前進度 = 0;
let 待顯示進度 = 0;
let 影片更新請求 = 0;
let 影片準備工作 = null;
let 使用靜態模式 = 減少動態 || 節省數據;
let 使用者媒體選擇 = "";
let 滾動觸發器 = null;
let 自動捲動請求 = 0;
let 自動捲動原始行為 = null;
let 文案時間軸 = null;
let 整理狀態 = 讀取整理狀態();

function 靜態場景路徑(幕索引) {
  return `assets/media/scene-${String(幕索引 + 1).padStart(2, "0")}-v1.webp`;
}

function 顯示靜態場景(幕索引 = 當前幕) {
  靜態場景.src = 靜態場景路徑(幕索引);
  靜態場景.hidden = false;
  影片.hidden = true;
}

function 更新媒體切換按鈕() {
  媒體切換按鈕.setAttribute("aria-pressed", 使用靜態模式 ? "true" : "false");
  媒體切換按鈕.textContent = 使用靜態模式 ? "開啟流動畫面" : "改用靜態畫面";
}

async function 選擇影片來源() {
  const 裝置記憶體偏低 = Number(navigator.deviceMemory || 8) <= 4;
  let 使用手機版本 = 移動裝置 || 裝置記憶體偏低;

  if (!使用手機版本 && navigator.mediaCapabilities && navigator.mediaCapabilities.decodingInfo) {
    try {
      const 能力 = await navigator.mediaCapabilities.decodingInfo({
        type: "file",
        video: {
          contentType: 'video/mp4; codecs="avc1.64001f"',
          width: 1280,
          height: 720,
          bitrate: 4000000,
          framerate: 24
        }
      });
      使用手機版本 = !能力.supported || !能力.smooth;
    } catch {
      使用手機版本 = false;
    }
  }

  return 使用手機版本 ? 影片.dataset.mobileSrc : 影片.dataset.desktopSrc;
}

function 切換至靜態模式(提示 = "已改用靜態畫面", 清除影片 = false) {
  使用靜態模式 = true;
  影片.pause();
  if (清除影片) {
    影片.removeAttribute("src");
    影片.load();
  }
  顯示靜態場景();
  媒體狀態.textContent = 提示;
  媒體狀態.hidden = false;
  更新媒體切換按鈕();
}

function 準備影片() {
  if (使用靜態模式) {
    顯示靜態場景();
    媒體狀態.textContent = 減少動態 ? "已按系統設定使用靜態畫面" : "已按節省數據設定使用靜態畫面";
    return Promise.resolve(false);
  }
  if (影片.readyState >= 1 && 影片.currentSrc) {
    影片.hidden = false;
    靜態場景.hidden = true;
    媒體狀態.hidden = true;
    安排影片進度(當前進度);
    return Promise.resolve(true);
  }
  if (影片準備工作) return 影片準備工作;

  媒體狀態.textContent = "正在準備流動畫面";
  影片準備工作 = 選擇影片來源().then((來源) => new Promise((完成) => {
    const 成功 = () => {
      影片.removeEventListener("error", 失敗);
      影片.hidden = false;
      靜態場景.hidden = true;
      媒體狀態.hidden = true;
      安排影片進度(當前進度);
      完成(true);
    };
    const 失敗 = () => {
      影片.removeEventListener("loadedmetadata", 成功);
      切換至靜態模式("流動畫面未能載入，已改用靜態畫面", true);
      完成(false);
    };
    影片.addEventListener("loadedmetadata", 成功, { once: true });
    影片.addEventListener("error", 失敗, { once: true });
    影片.src = 來源;
    影片.defaultMuted = true;
    影片.muted = true;
    影片.load();
  }));
  return 影片準備工作;
}

function 安排影片進度(進度) {
  待顯示進度 = Math.max(0, Math.min(1, 進度));
  當前影格 = 計算影格(待顯示進度);
  更新文案位置(當前影格);
  if (使用靜態模式) {
    顯示靜態場景(取得最近幕(待顯示進度));
    return;
  }
  if (影片.readyState < 1 || !影片.duration || 影片更新請求) return;

  影片更新請求 = window.requestAnimationFrame(() => {
    影片更新請求 = 0;
    const 最後影格時間 = Math.max(0, 影片.duration - (1 / 影片影格率));
    const 目標時間 = 待顯示進度 >= 1 ? 最後影格時間 : 待顯示進度 * 影片.duration;
    if (Math.abs(影片.currentTime - 目標時間) >= 1 / 影片影格率) 影片.currentTime = 目標時間;
    影片.dataset.currentFrame = String(Math.round(目標時間 * 影片影格率) + 1);
    影片.dataset.mediaProgress = 待顯示進度.toFixed(4);
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
    標題: ["--標題左值", "--標題頂值", "--標題寬值"],
    對話: ["--對話左值", "--對話頂值", "--對話寬值"],
    資產: ["--資產左值", "--資產頂值", "--資產寬值"],
    選擇: ["--選擇左值", "--選擇頂值", "--選擇寬值"]
  };

  Object.entries(對照).forEach(([區塊, 屬性]) => {
    屬性.forEach((名稱, 索引) => 場景卡.style.setProperty(名稱, 佈局[區塊][索引].toFixed(2)));
  });
}

function 計算影格(進度) {
  const 線性進度 = Math.max(0, Math.min(1, 進度));
  return Math.floor(線性進度 * (總幀數 - 1)) + 1;
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
    場景替代文字.textContent = `第${幕數文字[幕索引]}幕，${資料.標題}。${資料.畫面}`;
    進度按鈕.forEach((按鈕, 索引) => {
      if (索引 === 幕索引) 按鈕.setAttribute("aria-current", "step");
      else 按鈕.removeAttribute("aria-current");
    });
    上一幕按鈕.hidden = 幕索引 === 0;
    下一幕按鈕.innerHTML = 幕索引 === 5
      ? "<span>查看專業支援</span><span aria-hidden=\"true\">→</span>"
      : "<span>前往下一幕</span><span aria-hidden=\"true\">→</span>";
    下一幕按鈕.setAttribute("aria-label", 幕索引 === 5 ? "查看專業支援" : "前往下一幕");
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
  當前進度 = Math.max(0, Math.min(1, 進度));
  const 幕索引 = 取得最近幕(進度);
  進度線.style.setProperty("--旅程進度", Math.max(0, Math.min(1, 進度)).toFixed(4));
  安排影片進度(進度);
  if (幕索引 !== 當前幕) 更新場景(幕索引);
}

function 停止自動捲動() {
  if (!自動捲動請求) return;
  window.cancelAnimationFrame(自動捲動請求);
  自動捲動請求 = 0;
  if (自動捲動原始行為 !== null) {
    document.documentElement.style.scrollBehavior = 自動捲動原始行為;
    自動捲動原始行為 = null;
  }
  上一幕按鈕.disabled = false;
  下一幕按鈕.disabled = false;
}

function 勻速捲動至(目標位置, 時長 = 6500) {
  停止自動捲動();
  if (減少動態) {
    window.scrollTo(0, 目標位置);
    return;
  }

  const 起點位置 = window.scrollY;
  const 開始時間 = window.performance.now();
  自動捲動原始行為 = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
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
    document.documentElement.style.scrollBehavior = 自動捲動原始行為 || "";
    自動捲動原始行為 = null;
    上一幕按鈕.disabled = false;
    下一幕按鈕.disabled = false;
  };

  自動捲動請求 = window.requestAnimationFrame(更新位置);
}

function 前往幕(幕索引, 勻速播放 = false) {
  const 安全索引 = Math.max(0, Math.min(5, 幕索引));
  if (!滾動觸發器) {
    更新場景(安全索引);
    安排影片進度(幕定位進度[安全索引]);
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
    end: () => `+=${減少動態 ? Math.max(window.innerHeight * 6, 4200) : Math.max(window.innerHeight * 13, 9000)}`,
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
    const 新資料 = JSON.parse(window.localStorage.getItem(整理儲存鍵) || "null");
    if (新資料 && 新資料.版本 === 1 && typeof 新資料.選擇 === "object" && 新資料.選擇) return 新資料.選擇;
    const 舊資料 = JSON.parse(window.localStorage.getItem(舊整理儲存鍵) || "{}");
    return typeof 舊資料 === "object" && 舊資料 ? 舊資料 : {};
  } catch {
    return {};
  }
}

function 儲存整理狀態() {
  try {
    window.localStorage.setItem(整理儲存鍵, JSON.stringify({
      版本: 1,
      更新時間: new Date().toISOString(),
      選擇: 整理狀態
    }));
    window.localStorage.removeItem(舊整理儲存鍵);
  } catch {
    return;
  }
}

function 更新選擇按鈕() {
  const 狀態 = 整理狀態[當前幕];
  加入清單按鈕.classList.toggle("已選擇", 狀態 === "加入");
  稍後再想按鈕.classList.toggle("已選擇", 狀態 === "稍後");
  加入清單按鈕.setAttribute("aria-pressed", 狀態 === "加入" ? "true" : "false");
  稍後再想按鈕.setAttribute("aria-pressed", 狀態 === "稍後" ? "true" : "false");
  加入清單按鈕.querySelector("span").textContent = 狀態 === "加入" ? "已放進我的安心清單" : "放進我的安心清單";
  稍後再想按鈕.querySelector("span").textContent = 狀態 === "稍後" ? "已記下：稍後再想" : "稍後再想";
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

function 建立安心摘要文字() {
  const 已加入 = 場景資料
    .map((資料, 索引) => ({ 資料, 索引 }))
    .filter(({ 索引 }) => 整理狀態[索引] === "加入");
  const 日期 = new Intl.DateTimeFormat("zh-HK", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date());
  const 內容 = 已加入.length
    ? 已加入.flatMap(({ 資料, 索引 }) => [
      `第${幕數文字[索引]}幕｜${資料.標題}`,
      `我的想法：希望優先整理`,
      `涉及事項：${資料.資產.join("、")}`,
      ""
    ])
    : ["目前尚未把任何事項放進安心清單。", ""];

  return [
    "香港遺產規劃｜我的安心摘要",
    `整理日期：${日期}`,
    "",
    ...內容,
    "這份摘要只整理您的初步想法，不構成法律、稅務或投資意見。",
    "正式安排前，請向具備相應資格的香港專業人士查詢。"
  ].join("\r\n");
}

function 下載安心摘要() {
  const 檔案 = new Blob([建立安心摘要文字()], { type: "text/plain;charset=utf-8" });
  const 下載網址 = URL.createObjectURL(檔案);
  const 連結 = document.createElement("a");
  const 日期 = new Date().toISOString().slice(0, 10);
  連結.href = 下載網址;
  連結.download = `我的安心摘要-${日期}.txt`;
  document.body.append(連結);
  連結.click();
  連結.remove();
  window.setTimeout(() => URL.revokeObjectURL(下載網址), 1000);
}

async function 分享安心摘要() {
  const 分享資料 = {
    title: "香港遺產規劃｜我的安心摘要",
    text: 建立安心摘要文字(),
    url: window.location.href.split("#")[0]
  };
  const 摘要狀態 = document.getElementById("摘要狀態");

  try {
    if (navigator.share) {
      await navigator.share(分享資料);
      摘要狀態.textContent = "摘要已準備分享";
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(分享資料.text);
      摘要狀態.textContent = "摘要已複製，您可貼到訊息中分享";
      return;
    }
    下載安心摘要();
    摘要狀態.textContent = "這個瀏覽器未提供分享功能，已改為下載摘要";
  } catch (錯誤) {
    摘要狀態.textContent = 錯誤 && 錯誤.name === "AbortError" ? "已取消分享" : "未能分享，請改用下載摘要";
  }
}

function 列印安心摘要() {
  window.print();
}

document.getElementById("開始旅程").addEventListener("click", () => {
  void 準備影片();
  document.getElementById("人生時間軸").scrollIntoView({ behavior: 減少動態 ? "auto" : "smooth" });
  window.setTimeout(() => document.getElementById("人生時間軸").focus({ preventScroll: true }), 減少動態 ? 0 : 700);
});

媒體切換按鈕.addEventListener("click", () => {
  if (!使用靜態模式) {
    使用者媒體選擇 = "靜態";
    切換至靜態模式("已按您的選擇改用靜態畫面");
    return;
  }
  使用者媒體選擇 = "流動";
  使用靜態模式 = false;
  媒體狀態.hidden = false;
  媒體狀態.textContent = "正在準備流動畫面";
  更新媒體切換按鈕();
  影片準備工作 = null;
  void 準備影片();
});

document.getElementById("返回時間軸").addEventListener("click", () => {
  前往幕(當前幕);
  window.setTimeout(() => document.getElementById("人生時間軸").focus({ preventScroll: true }), 減少動態 ? 0 : 700);
});
document.getElementById("下載摘要").addEventListener("click", 下載安心摘要);
document.getElementById("分享摘要").addEventListener("click", 分享安心摘要);
document.getElementById("列印摘要").addEventListener("click", 列印安心摘要);
進度按鈕.forEach((按鈕, 索引) => 按鈕.addEventListener("click", () => 前往幕(索引)));
上一幕按鈕.addEventListener("click", () => 前往幕(當前幕 - 1, true));
下一幕按鈕.addEventListener("click", () => {
  if (當前幕 === 5) {
    const 支援區 = document.getElementById("專業支援");
    支援區.scrollIntoView({ behavior: 減少動態 ? "auto" : "smooth" });
    window.setTimeout(() => 支援區.focus({ preventScroll: true }), 減少動態 ? 0 : 700);
  } else 前往幕(當前幕 + 1, true);
});
加入清單按鈕.addEventListener("click", () => 記錄選擇("加入"));
稍後再想按鈕.addEventListener("click", () => 記錄選擇("稍後"));

document.getElementById("支援下載摘要").addEventListener("click", 下載安心摘要);

window.addEventListener("wheel", 停止自動捲動, { passive: true });
window.addEventListener("touchstart", 停止自動捲動, { passive: true });
window.addEventListener("keydown", (事件) => {
  if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(事件.key)) 停止自動捲動();
});

document.querySelectorAll(".略過連結").forEach((連結) => {
  連結.addEventListener("click", () => {
    const 目標 = document.querySelector(連結.getAttribute("href"));
    if (目標) window.setTimeout(() => 目標.focus({ preventScroll: true }), 0);
  });
});

減少動態查詢.addEventListener("change", (事件) => {
  減少動態 = 事件.matches;
  if (減少動態 && 使用者媒體選擇 !== "流動") 切換至靜態模式("已按系統設定使用靜態畫面");
  if (!減少動態 && !節省數據 && 使用者媒體選擇 !== "靜態") {
    使用靜態模式 = false;
    影片準備工作 = null;
    更新媒體切換按鈕();
    void 準備影片();
  }
  if (window.ScrollTrigger) window.ScrollTrigger.refresh();
});

移動裝置查詢.addEventListener("change", (事件) => {
  移動裝置 = 事件.matches;
  更新文案位置(當前影格);
  if (window.ScrollTrigger) window.ScrollTrigger.refresh();
});

document.getElementById("清除記錄").addEventListener("click", () => {
  const 確定清除 = window.confirm("確定清除這部裝置上的安心清單嗎？清除後不能復原。");
  if (!確定清除) return;
  整理狀態 = {};
  try {
    window.localStorage.removeItem(整理儲存鍵);
    window.localStorage.removeItem(舊整理儲存鍵);
  } catch {}
  更新選擇按鈕();
  更新安心清單();
});

let 尺寸計時器 = 0;
window.addEventListener("resize", () => {
  window.clearTimeout(尺寸計時器);
  尺寸計時器 = window.setTimeout(() => {
    更新文案位置(當前影格);
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }, 180);
});

更新場景(0, true);
更新安心清單();
安排影片進度(0);
更新媒體切換按鈕();
建立滾動體驗();

if ("IntersectionObserver" in window) {
  const 媒體觀察器 = new IntersectionObserver((項目) => {
    if (!項目.some((觀察項目) => 觀察項目.isIntersecting)) return;
    媒體觀察器.disconnect();
    void 準備影片();
  }, { rootMargin: "-10% 0px" });
  媒體觀察器.observe(document.getElementById("人生時間軸"));
}
