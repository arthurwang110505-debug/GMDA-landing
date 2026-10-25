# GMDA Pixel Mascot System — v2

日期：2026-10-25

## 已確認的設計方向

不再沿用原網站機器人外形，也不是替同一個輪廓換色。四隻都要像生物，由一格格可辨識的方形色塊拼成，留有縫隙、降低密度，不做細密像素插畫、漸層或機械面罩。

| 角色 | 工作 | 身體色（固定） | 輪廓與辨識細節 | 個性 |
| --- | --- | --- | --- | --- |
| MORI | Research | `#F5F0E6` | 有機圓形、綠色植物天線、發現亮點、大眼睛 | 溫柔、聰明、好奇、善於觀察 |
| PIP | Writing | `#FFD56B` | 不對稱活潑輪廓、誇張姿勢、寫作工具細節、大眼睛 | 最活潑、富創意、開朗 |
| KODA | Coding | `#8BC5FF` | 緊湊柔角方形、狀態燈、技術細節；仍是生物而非機器人 | 安靜、專注、沉穩 |
| MILO | Monitoring | `#C6A7FF` | 圓形、雷達天線、收斂姿勢、大眼睛 | 溫和、警覺、內斂 |

品牌配色：Midnight Indigo `#14142B`、Electric Lime `#C8F23C`、Warm Ivory `#F5F3EC`、Deep Periwinkle `#2A2A55`、Soft Slate `#A8A5BC`。四種身體色是指定的 mascot 延伸色，不替換品牌主色。

## 本輪原型範圍（已實作）

- `src/data/mascot-maps.json`：唯一的 12×12 色塊地圖來源。
- `src/data/mascots.ts`：四隻名字、角色、特徵與眨眼幀。
- `src/lib/pixel.ts`：驗證地圖與解析色塊，快取解析結果。
- `src/components/PixelMascot.tsx`：共用 SVG rect renderer，每顆色塊之間保留縫隙，不合併相鄰方塊。
- 填格率約 24–30%，作為「不要 dense」的第一版方向；不是已核准的最終造型。
- `HeroMascots.tsx`：替換原本五個向量配色版本，改放四隻新角色，保留既有浮動與游標互動。
- `mascot-lab.html`：獨立預覽頁，可切主題、大小、眨眼及檢視不同背景。
- `scripts/build-mascots.mjs`：由同一份 JSON 匯出透明 SVG / PNG 與角色總覽圖，執行 `npm run mascots:build` 更新。
- `public/gmda-pixel-icon.svg`：暫用四角色配色圖示，取代頁面原機器人圖示引用；原始 `app-icon.svg` 檔案保留。
- reduced-motion 下停用眨眼與 Hero 浮動。

## 下一步（待造型確認，不在本輪擴充）

1. 先確認四隻輪廓、眼睛比例、色塊間距和角色辨識度；尤其確認 Mori 植物與 Milo 雷達是否需要更大的剪影差異。
2. 再合併 agent registry，把 ProductPreview 與 WorkflowScene 的三位示範 agent 改成 Mori / Pip / Koda / Milo，補上對應工作內容。現在這兩處仍保留舊資料，避免把視覺試作與產品內容重寫混在一起。
3. 將 renderer 套用到列表、訊息與 workflow；小尺寸必要時另外設計簡化幀，而不是硬縮大圖。
4. 確認是否採用目前的暫用圖示，再處理 CTA、正式 favicon 與 OG metadata。總覽 PNG 已匯出，但尚未接入 og:image。
5. 視需要拆分 App sections；不是這次角色原型的必要前置。

## 驗收項目

- 四隻確實是方塊拼接，不依賴原向量機器人輪廓。
- 身體使用指定的四個 hex 色碼。
- 深淺主題和不同背景下仍能辨識眼睛與輪廓；需以瀏覽器實際檢視確認，不宣稱已通過對比標準。
- 320px 至桌面尺寸確認 Hero 不遮字、不溢出；目前尚未完成瀏覽器視覺驗收。
- informative 圖像提供 label；decorative 圖像 aria-hidden。
- typecheck、lint、production build 通過。
