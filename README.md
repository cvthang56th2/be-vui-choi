# Bé Vui Chơi 🎈

Bộ mini-game giáo dục cho trẻ nhỏ, chạy trên iPad (Safari) — giao diện tiếng Việt, có giọng đọc, chữ và hình to, thao tác đơn giản.

## Các game (chia theo lứa tuổi)

Màn hình chính có 4 tab tuổi; app nhớ tab bé chọn lần trước. Một số game tự chỉnh độ khó theo tuổi (Lật thẻ, Ghép hình, Cho thú ăn, Đếm số, Mê cung).

### 👶 1–2 tuổi
Không có đáp án sai — mọi lần chạm đều có âm thanh, hình ảnh và giọng đọc. Nút 🏠 bị khoá: bố mẹ **giữ 1 giây** mới thoát được, tránh bé bấm nhầm.

| Game | Kỹ năng |
|---|---|
| 👆 Chạm là vui | Nguyên nhân – kết quả, từ vựng |
| 🙈 Ú òa! | Bất ngờ, tên & tiếng con vật |
| 🫧 Bong bóng | Vận động tay, phối hợp tay–mắt |
| 🐶 Con vật | Tên & tiếng kêu con vật |
| 🚒 Xe cộ | Tên & âm thanh xe cộ |
| 🖍️ Vẽ ngón tay | Sáng tạo, vận động tinh |
| 🎹 Đàn piano | Âm nhạc |

### 🐣 2–3 tuổi
| Game | Kỹ năng |
|---|---|
| 🎈 Bóng bay | Màu sắc, đếm |
| 🐮 Con gì kêu? | Tiếng kêu & tên con vật |
| 🔺 Hộp hình khối | Hình dạng, kéo thả (vận động tinh) |
| 🥕 Cho thú ăn | Đếm 1–3 |
| 🎹 Đàn piano | Âm nhạc |
| 🎨 Tô màu | Sáng tạo, tên màu |

### 🐥 4–5 tuổi
| Game | Kỹ năng |
|---|---|
| 🏎️ Đua xe | Nhận biết số 1–9 |
| 🔢 Đếm số | Đếm 1–10 |
| 🧠 Quy luật | Tư duy logic (AB, AAB, ABC…) |
| 🌑 Tìm bóng | Quan sát hình dạng |
| 🔧 Lắp ráp | Hình khối, màu sắc |
| 🧩 Ghép hình | Tư duy không gian (2×2) |
| 🐼 Lật thẻ | Trí nhớ, con vật Việt–Anh |
| 🔤 Chữ cái | Bảng chữ cái tiếng Anh |

### 🦉 6–7 tuổi
| Game | Kỹ năng |
|---|---|
| ➕ Cộng trừ | Toán trong phạm vi 10, có hình minh hoạ |
| 🔡 Đánh vần | Đánh vần từ tiếng Anh 3–4 chữ |
| 🕐 Xem giờ | Đọc đồng hồ kim (giờ đúng, giờ rưỡi) |
| 🌀 Mê cung | Định hướng, lập kế hoạch |
| 🧩 Ghép hình | 3×3 |
| 🐼 Lật thẻ | Bắt đầu từ 8 thẻ |
| 🔤 Chữ cái | Bảng chữ cái tiếng Anh |
| 🎹 Đàn piano | Học bài theo phím sáng |

## Chạy thử

Một file HTML duy nhất, không cần build, không phụ thuộc thư viện:

```bash
npx serve .        # hoặc: python3 -m http.server 8000
```

Mở `http://<ip-máy>:3000` trên iPad (cùng mạng Wi-Fi) → Chia sẻ → **Thêm vào MH chính** để chơi toàn màn hình.

## Giọng đọc

Dùng Web Speech API có sẵn trên thiết bị. Để giọng rõ hơn trên iPad: Cài đặt → Trợ năng → Nội dung được đọc → Giọng nói → Tiếng Việt → tải **Linh (Nâng cao)**; tiếng Anh tải **Ava/Samantha (Nâng cao)**. Bố mẹ chỉnh giọng & tốc độ ở nút ⚙️ trên màn hình chính.

## Hướng phát triển

- Chuyển sang Expo / React Native (`react-native-skia`, `expo-speech`, `expo-av`)
- Thay giọng máy bằng file âm thanh thu sẵn
- Thêm game & cấp độ theo tuổi
