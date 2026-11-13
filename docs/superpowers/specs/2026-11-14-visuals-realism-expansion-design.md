# Mở rộng "ảnh thật": icon trang chủ + các đợt game còn lại — Thiết kế

## Vì sao
Đợt 1 (Con vật, Xe cộ) đã đổi emoji sang ảnh thật cho 2 game. Người dùng muốn tiếp tục cho **toàn bộ** các game còn lại, và mở rộng sang **icon** ở 3 chỗ: icon từng game trên màn hình chính, icon 4 tab tuổi, và icon app (riêng icon app giữ nhân vật Mít, chỉ nâng cấp hình vẽ — không đổi sang ảnh chụp, theo lựa chọn của người dùng).

## Mục tiêu / Không làm
- **Làm:** tiếp tục đổi ảnh thật cho các game nhận diện vật thể còn lại (trái cây, "con gì kêu", "cho thú ăn/ai ăn gì", "nhà của ai", "xe đi đâu"...), theo từng đợt như đợt 1.
- **Làm:** tổng quát hoá renderer icon ở màn hình chính (`CARDS`, hiện render `<span class="ico">${emoji}</span>` tại [index.html:2935](index.html#L2935)) để nhận ảnh thật, giống cách đã làm với `makeBoard()`.
- **Làm:** đổi icon tab tuổi (👶🐣🐥🦉) sang ảnh thật tương ứng (em bé/gà con/gà/cú — vẫn cần cân nhắc an toàn, xem phần "Việc cần người dùng lưu ý" bên dưới).
- **Không đổi ảnh chụp:** icon app (biểu tượng Mít) — giữ nhân vật, chỉ nâng cấp hình vẽ (xem mục riêng).
- **Không có ảnh thật hợp lý:** một số icon/game thuần trừu tượng (ví dụ "Trái nghĩa", "Quy luật", "Hình khối", "Màu sắc", "Số nào lớn hơn") — xử lý theo nguyên tắc ở dưới, không chặn các đợt khác.

## Nguyên tắc xử lý từng loại icon (để không phải hỏi lại cho từng cái)
1. **Vật thể cụ thể** (trái cây, con vật, xe cộ, đồ vật quen thuộc) → ảnh thật, như đợt 1.
2. **Khái niệm trừu tượng nhưng có vật đại diện** (đếm số → ảnh quả táo; xem giờ → ảnh đồng hồ thật; lịch tuần → ảnh lịch thật; chẵn lẻ → ảnh xúc xắc thật) → dùng ảnh thật của vật đại diện, không cố "chụp" khái niệm.
3. **Khái niệm hoàn toàn trừu tượng, không có vật đại diện hợp lý** (trái nghĩa, quy luật dãy số, hình khối cơ bản, màu sắc) → giữ icon vẽ/emoji, không ép thành ảnh thật. Sẽ liệt kê rõ danh sách này khi đến lượt, để người dùng duyệt lại nếu muốn.
4. **An toàn:** không dùng ảnh thật có khuôn mặt người/trẻ em làm đại diện chung chung (gia đình, cảm xúc, bộ phận cơ thể, tab tuổi) — dùng ảnh không nhận diện được danh tính (tay, chân, đồ vật liên quan) hoặc vẫn giữ hình vẽ/emoji cho các mục này. Đây là lựa chọn của mình để tránh rủi ro quyền riêng tư/hình ảnh, sẽ nói rõ khi đến batch đó.

## Icon app (Mít) — nhánh riêng
Mình **không có công cụ tạo ảnh (AI vẽ tranh)** — chỉ có thể vẽ icon bằng code (SVG vector), không "vẽ tay" như một họa sĩ. Icon Mít hiện tại đã khá ổn (hình phẳng, rõ nét ở favicon 32px). Đề xuất: mình thử vẽ lại bằng SVG chi tiết hơn (bóng đổ mềm hơn, nét mượt hơn) và cho người dùng xem trước khi áp dụng — nếu không ưng, giữ nguyên icon cũ. Việc này tách riêng, làm sau cùng vì rủi ro thấp (không mất gì nếu không ưng).

## Cách làm kỹ thuật
- Tổng quát `CARDS` icon renderer giống `makeBoard`: thêm phần tử thứ 6 (ảnh) tuỳ chọn trong mỗi entry, `<img class="icoimg" onerror="...">` thay cho `<span class="ico">` khi có ảnh, giữ nguyên khi không có — không phá vỡ entry nào chưa có ảnh.
- Mỗi đợt: nguồn ảnh từ Pexels (miễn phí, không cần ghi công — như đợt 1), resize vuông ~500px, nén JPEG ~500px, ≤50KB/ảnh.
- Thêm vào `sw.js` precache ngay trong đợt đó (rút kinh nghiệm từ đợt 1 — không để SWR-only nữa).

## Thứ tự các đợt tiếp theo (đề xuất, sẽ làm liên tục, không dừng hỏi giữa chừng)
1. **Đợt 2:** Trái cây (FruitBoard, FruitQ) — 7 ảnh trái cây.
2. **Đợt 3:** Tổng quát hoá icon màn hình chính (`CARDS`) + áp dụng ảnh cho các icon vật thể cụ thể đã có sẵn ảnh (Con vật, Xe cộ, Trái cây tái dùng).
3. **Đợt 4:** "Con gì kêu?", "Cho thú ăn/Ai ăn gì", "Nhà của ai" — tái dùng ảnh con vật đã có + thêm ảnh môi trường sống.
4. **Đợt 5:** "Xe đi đâu", Đua xe — tái dùng ảnh xe cộ.
5. **Đợt 6+:** các icon khái niệm-có-vật-đại-diện (đếm số, giờ, lịch, chẵn lẻ...) — sẽ liệt kê cụ thể khi tới.
6. Icon tab tuổi + icon app Mít — làm sau cùng.

## Việc người thực hiện (mình) sẽ tự quyết
- Chọn ảnh cụ thể từng đợt, xin phép tải trước khi tải (nêu nguồn/license/kích thước) — vẫn theo đúng quy tắc đã thống nhất.
- Phân loại icon nào thuộc nhóm 1/2/3 ở trên khi đến lượt; nếu không chắc, sẽ hỏi lại đúng lúc đó thay vì hỏi trước.
