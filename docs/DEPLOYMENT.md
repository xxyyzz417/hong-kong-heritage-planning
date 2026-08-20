# 發布與回復紀錄

最後更新：二〇二六年八月二十一日

## 正式成品

執行 `pnpm run build` 後，只會把公開白名單複製至 `dist`：首頁、樣式、程式、圖示、錯誤頁、搜尋引擎檔案、動畫程式庫及新媒體。測試、工程紀錄、設計稿、原始影片及舊圖片序列不會公開部署。

## GitHub

- 儲存庫：<https://github.com/xxyyzz417/hong-kong-heritage-planning>
- GitHub Pages：<https://xxyyzz417.github.io/hong-kong-heritage-planning/>
- 正式分支：`main`
- 已驗證應用提交：`fc7c6e8`
- 品質流程：`32403665295`，成功
- Pages 流程：`32403664116`，成功

推送至 `main` 後，GitHub Actions 會安裝鎖定套件、建立 `dist` 並執行完整瀏覽器測試。GitHub Pages 現為已驗證的公開正式網址；首頁、六幕互動、影片範圍請求及七組線上瀏覽器測試均通過。

## Vercel

- 團隊識別碼：`team_C83TZYxBGJP5DTxpT1VoudGp`
- 團隊名稱：`xxyyzz417s-projects`
- 外掛回報的正式網址：<https://hong-kong-heritage-planning-xxyyzz417s-projects.vercel.app/>
- 最近部署識別碼：`dpl_GWEjvVZW9H3GMZPHku3mvzobJrKt`
- 最近部署狀態：已建立，但 Vercel Authentication 會把未登入訪客重新導向登入頁
- 公開驗收狀態：未通過；在解除保護前不可把此網址宣稱為公開正式站

儲存庫的標準 Vercel 流程會以根目錄的 `vercel.json` 執行 `pnpm run build`，只發布 `dist`。本輪因命令列需要使用者親自完成帳戶登入，改由已授權的 Vercel 外掛直接建立部署；外掛的文字檔上載不適合承載約五千八百萬位元組影片，因此該部署把 `/assets/media/` 重寫至已驗證的 GitHub Pages 媒體來源。若日後完成命令列登入，應改回儲存庫白名單建置，讓 Vercel 自行託管版本化媒體。

解除公開阻塞有兩條安全路徑：

1. 在 Vercel 專案設定的部署保護頁，把正式環境的 Vercel Authentication 關閉，再重新發布及執行下列完整驗收。
2. 在本機完成 `vercel login`，連結此儲存庫後執行標準正式部署；仍須確認正式環境沒有登入保護。

未解除前不要把標準網址、分享網址或搜尋引擎檔案改指向 Vercel；目前它們正確指向可公開存取的 GitHub Pages。

## 正式發布後必驗

1. 首頁、樣式、程式、代表圖及影片均成功回應。
2. 影片位元組範圍請求回應 `206`，並包含正確範圍及一千零二十四位元組內容長度。
3. 桌面及手機只下載一個合適影片，首屏未接近時間軸時不下載影片。
4. 百分之十、五十及九十捲動位置與影片時間一致。
5. 六幕、上一幕、下一幕、靜態模式、安心清單、下載、分享、列印及清除記錄正常。
6. 390 × 844、320 × 568、768 × 430、1440 × 1000、鍵盤及減少動態均正常。
7. 不存在路徑回應真正的 `404`；標準網址、分享網址、搜尋引擎檔案一致。
8. 瀏覽器控制台沒有錯誤，Vercel 沒有建置或執行錯誤。

## 回復方式

若 Vercel 正式部署出現阻斷問題，先保留 GitHub Pages 作公開正式站；只有在 Vercel 完整驗收通過後才切換標準網址。不要把舊圖片序列重新加入正式成品；影片載入問題應先切換既有六張靜態圖作回退。
