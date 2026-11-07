# Bé Vui Chơi 🎈

Bộ mini-game giáo dục cho trẻ nhỏ, chạy trên iPad (Safari) — giao diện tiếng Việt, có giọng đọc, chữ và hình to, thao tác đơn giản.

## Các game

| Game | Kỹ năng |
|---|---|
| 🏎️ Đua xe | Nhận biết số 1–9 |
| 🔧 Lắp ráp | Hình khối, màu sắc, kéo thả |
| 🐼 Lật thẻ | Trí nhớ, tên con vật (Việt + Anh) |
| 🎈 Bóng bay | Màu sắc, đếm số |
| 🎨 Tô màu | Sáng tạo, tên màu |
| 🧩 Ghép hình | Tư duy không gian |
| 🔤 Chữ cái | Bảng chữ cái & từ vựng tiếng Anh |
| 🥕 Cho thú ăn | Đếm 1–5 |
| 🎹 Đàn piano | Âm nhạc, nốt nhạc, chơi theo bài |

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
