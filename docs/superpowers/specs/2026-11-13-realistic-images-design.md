# Ảnh thật cho game nhận diện đồ vật — Thiết kế (Batch 1)

## Vì sao
App "Bé Vui Chơi" hiện vẽ mọi con vật/xe cộ/trái cây bằng emoji. Mục tiêu: những game dạy bé **nhận diện vật thật** (con vật, xe cộ, trái cây...) dùng ảnh chụp thật để hấp dẫn và đúng với đời thực hơn, mà không phá vỡ app 1-file, chạy offline hoàn toàn (PWA + service worker) và không tốn dung lượng tải quá nhiều trên mạng di động.

## Mục tiêu / Không làm
- **Làm:** thay emoji bằng ảnh thật cho các game "nhận diện vật thể thật" (con vật, xe cộ, trái cây, các game liên quan dùng chung bộ item này).
- **Không làm ở batch này:** game trừu tượng (màu sắc, hình khối, số, chữ cái) vẫn giữ emoji/hình vẽ — không đổi.
- **Không làm:** đổi toàn bộ 79 game trong 1 lần — chia nhiều đợt, mỗi đợt xong mới làm đợt sau.
- **Anti-goal:** không để app nặng hơn đáng kể (ảnh phải tối ưu, có fallback emoji nếu ảnh lỗi/chưa tải — tránh màn hình trống với bé 1-2 tuổi).

## Cách làm
1. **Tổng quát hoá renderer dùng chung:** `makeBoard()` ([index.html:2149](../../../index.html#L2149)) hiện render `<span class="be">{emoji}</span>`. Thêm khả năng nhận 1 field ảnh tuỳ chọn trong mỗi item (ví dụ item thêm `img:'img/animals/dog.webp'`); khi có field này, render `<img>` thay emoji, emoji vẫn giữ làm `alt`/fallback nếu ảnh lỗi (`onerror` trả về emoji). `makeQuiz()` ([index.html:1821](../../../index.html#L1821)) cũng cần sửa tương tự cho các game dạng câu hỏi dùng chung item.
2. **Ảnh:** lấy từ nguồn ảnh miễn phí bản quyền (Pixabay/Pexels — license cho phép dùng tự do, không cần ghi nguồn), nền trong/đơn giản, vuông, resize nhỏ (~400–600px), nén `webp` để nhẹ (ước lượng 15–40KB/ảnh).
3. **Lưu trữ:** thư mục `img/animals/`, `img/vehicles/` ở gốc project, copy vào `www/` qua `scripts/build.mjs` giống cách copy icon hiện tại, và thêm vào danh sách cache của `sw.js` để vẫn chơi offline được.
4. **Không đổi logic game** (âm thanh, số vòng, cách chấm điểm) — chỉ đổi phần hiển thị item.

## Phạm vi Batch 1
- `AnimalBoard` (Con vật, [index.html:2162](../../../index.html#L2162)) — 6 ảnh: chó, mèo, bò, gà, vịt, heo.
- `VehicleBoard` (Xe cộ, [index.html:2164](../../../index.html#L2164)) — 6 ảnh: ô tô, tàu hỏa, máy bay, xe cứu hoả, xe buýt, xe đạp.
- Tổng ~12 ảnh, ước lượng thêm ~300–500KB cho toàn app.

## Để sau (các đợt tiếp theo, chưa làm ở đợt này)
- Trái cây (FruitBoard, FruitQ), "Con gì kêu?" (SoundQ), "Cho thú ăn/Ai ăn gì" (Feed/EatQ), "Nhà của ai" (HomeQ), "Đua xe/Xe đi đâu" — sẽ dùng lại đúng cơ chế ảnh đã xây ở batch 1, chỉ cần thêm ảnh + field `img` cho từng item.

## Việc người thực hiện (mình) sẽ tự quyết
- Chọn ảnh cụ thể từ Pixabay/Pexels cho 12 vật trên, xin phép tải trước khi tải (nêu rõ nguồn/license/kích thước).
- Cách resize/nén ảnh (webp, kích thước cụ thể).
