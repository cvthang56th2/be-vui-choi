# Thêm game chủ đề bong bóng mới — Thiết kế ngắn

## Vì sao
Người dùng nói con mình thích nhất "Bơm bóng" (Pump) và muốn có thêm vài game chủ đề bong bóng, làm "tốt nhất, hay nhất, cuốn hút trẻ em nhất", tự quyết không cần hỏi lại (đang AFK).

## Đã có gì (để không làm trùng)
- **Bơm bóng** (Pump, 1–2 tuổi): bấm nút 6 lần để bơm 1 quả bóng chở 1 bạn thú, bóng bay lên trời, lặp lại.
- **Bóng bay** (Balloon, 2–3 tuổi): bóng bay lên từ dưới màn hình liên tục, bé chạm đúng màu được giao để nổ bóng (game phản xạ có mục tiêu).

## 2 game mới (my call, không trùng 2 game trên)
1. **"Thả bóng bay" — 1–2 tuổi.** Chạm bất kỳ đâu trên màn hình → thả ngay 1 quả bóng bay màu ngẫu nhiên có mặt cười, bay lên và tự nổ thành ngôi sao lấp lánh khi tới đỉnh màn hình. Không giới hạn số lần chạm, không có đáp án sai (đúng tinh thần nhóm 1–2 tuổi). Khác Bơm bóng ở chỗ: không cần bấm nhiều lần/đếm, thả tức thì, nhiều bóng cùng lúc trên màn hình — đơn giản và tức thời hơn, hợp bé nhỏ nhất.
2. **"Đếm bóng bay" — 4–5 tuổi.** Màn hình hiện 1 chùm bóng bay (1–10 quả), 3 đáp án số để chọn, bé bấm đúng số lượng → cả chùm bóng nổ tung vui nhộn (dùng chung cơ chế quiz có sẵn, giống game Đếm số/Đếm 1-2-3). Gắn chủ đề bong bóng vào việc học đếm cho nhóm tuổi lớn hơn.

## Cách làm kỹ thuật
- Tái dùng CSS `.bb`/`.balloon`/mảng `COLS_B` đã có sẵn (từ Pump/Balloon) để hình bóng bay đồng bộ phong cách, không vẽ lại từ đầu.
- "Thả bóng bay": component riêng, giống cấu trúc `Balloon`/`Pump` (IIFE có `start()`/`stop()`), gắn vào `#rlstage` (ví dụ).
- "Đếm bóng bay": dùng `makeQuiz()` có sẵn, giống cấu trúc `Count3Q`.
- Thêm vào `AGES` (1–2 tuổi và 4–5 tuổi), `GAMES`, `CARDS`, và 2 `<section>` HTML mới theo đúng khuôn mẫu các game hiện có.

## Không làm
- Không đổi/đụng vào Bơm bóng hay Bóng bay hiện có.
- Không dùng ảnh thật cho 2 game này — bóng bay vẽ bằng CSS cho đồng bộ với 2 game bóng bay gốc, phù hợp phong cách "trừu tượng" (không phải vật thể nhận diện thật).
