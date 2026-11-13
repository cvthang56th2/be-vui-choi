# Bé Vui Chơi 🎈

Bộ mini-game giáo dục cho trẻ nhỏ, chạy trên iPad (Safari) — giao diện tiếng Việt, có giọng đọc, chữ và hình to, thao tác đơn giản.

## Các game (chia theo lứa tuổi) — 79 lượt game

Màn hình chính có 4 tab tuổi (app nhớ tab bé chọn). Một số game dùng chung nhiều tuổi và tự chỉnh độ khó.

### 👶 1–2 tuổi (27 game) — không có đáp án sai, mọi lần chạm đều có phản hồi
Nút 🏠 bị khoá: bố mẹ **giữ 1 giây** mới thoát.
Chạm là vui · Ú òa! · Bong bóng · Con vật · Xe cộ · Vẽ ngón tay · Đàn piano · Trái cây · Màu sắc · Cơ thể bé · Nhạc cụ · Gia đình · Bể cá · Ngày & đêm · Pháo hoa · Trứng nở · Các hình · Dắt cún · Lau kính · Bơm bóng · Vườn hoa · Tàu hỏa · Nhảy múa · Làm kem · Xếp khối · Soi đèn · Điện thoại

### 🐣 2–3 tuổi (16 game)
Bóng bay · Con gì kêu? · Hộp hình khối · Cho thú ăn · Đàn piano · Tô màu · Tìm trái cây · Tìm màu · To – nhỏ · Mũi đâu? · Tìm giống nhau · Ai ăn gì? · Nhà của ai? · Đếm 1-2-3 · Tìm hình · Xếp theo màu

### 🐥 4–5 tuổi (18 game)
Đua xe · Đếm số · Quy luật · Tìm bóng · Lắp ráp · Ghép hình · Lật thẻ · Chữ cái ABC · Số nào lớn? · Chữ tiếng Việt · Nhiều – ít · Cái nào khác? · Trái nghĩa · Cảm xúc · Số tiếp theo · Đập chuột số · Nhớ thứ tự · Xe đi đâu?

### 🦉 6–7 tuổi (18 game)
Cộng trừ · Đánh vần tiếng Anh · Xem giờ · Mê cung · Ghép hình 3×3 · Lật thẻ · Chữ cái · Đàn piano · Toán đến 20 · So sánh > < = · Tập đọc · Nghe tiếng Anh · Thứ trong tuần · Chẵn – lẻ · Chục & đơn vị · Sudoku mini · Đua toán · Trái – phải

## Song ngữ Việt / English

Nút **🇻🇳 VI / 🇬🇧 EN** ở góc trên màn hình chính (hoặc ⚙️ → Ngôn ngữ) đổi toàn bộ chữ và giọng đọc sang tiếng Anh; lựa chọn được lưu lại.
- Mọi chuỗi trong code dùng `T('tiếng Việt', 'English')`; số đếm, giờ, số nhiều/mạo từ tiếng Anh xử lý bằng `enNum`, `pl`, `art`.
- `say(text)` đọc theo ngôn ngữ đang chọn; `say(text,'vi-VN!')` luôn đọc tiếng Việt (dùng cho phần song ngữ: Lật thẻ, ABC, Đánh vần, Nghe tiếng Anh vẫn đọc nghĩa tiếng Việt).
- Game "Chữ tiếng Việt" chỉ hiện ở chế độ tiếng Việt; "Tập đọc" ở chế độ tiếng Anh thành tập đọc từ tiếng Anh.

## Chạy thử

Một file HTML duy nhất, không cần build, không phụ thuộc thư viện:

```bash
npx serve .        # hoặc: python3 -m http.server 8000
```

Mở `http://<ip-máy>:3000` trên iPad/iPhone (cùng mạng Wi-Fi) → Chia sẻ → **Thêm vào MH chính** để chơi toàn màn hình.

### Chơi trên iPhone / iPad qua GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → Branch `main` / `(root)` → Save. Sau ~1 phút mở `https://cvthang56th2.github.io/be-vui-choi/` bằng Safari → nút Chia sẻ → **Thêm vào Màn hình chính**. App có biểu tượng riêng (bạn Mít) và mở toàn màn hình như app thật.

Giao diện tự co giãn cho iPhone (dọc & ngang) và iPad. Nếu không nghe hiệu ứng âm thanh trên iPhone, kiểm tra công tắc im lặng / âm lượng.

## Giọng đọc

Dùng Web Speech API có sẵn trên thiết bị. Để giọng rõ hơn trên iPad: Cài đặt → Trợ năng → Nội dung được đọc → Giọng nói → Tiếng Việt → tải **Linh (Nâng cao)**; tiếng Anh tải **Ava/Samantha (Nâng cao)**. Bố mẹ chỉnh giọng & tốc độ ở nút ⚙️ trên màn hình chính.

## Hướng phát triển

- Chuyển sang Expo / React Native (`react-native-skia`, `expo-speech`, `expo-av`)
- Thay giọng máy bằng file âm thanh thu sẵn
- Thêm game & cấp độ theo tuổi

## Deploy lên Vercel

`vercel.json` đã cấu hình sẵn: Vercel chạy `npm install` → `npm run build` (script `scripts/build.mjs` copy `index.html`, `sw.js`, `manifest.webmanifest` và icon vào `www/`) → phục vụ thư mục `www/`. `sw.js` được gửi kèm header `no-cache` để bản mới luôn được cập nhật. Không cần chỉnh gì thêm trong Project Settings (Framework Preset: *Other*).

Kiểm tra build tại máy: `npm install && npm run build` hoặc `npx vercel build`.

## ⭐ Cách khuyên dùng: web app trên màn hình chính (không hết hạn, không cần cáp)

1. Push code, bật **Settings → Pages → Branch `main` / `(root)`**.
2. Trên iPhone/iPad mở `https://cvthang56th2.github.io/be-vui-choi/` bằng **Safari** → nút Chia sẻ → **Thêm vào Màn hình chính** → Thêm.
3. Mở app từ biểu tượng Mít: chạy toàn màn hình, **chơi được cả khi không có mạng** (service worker lưu sẵn).

Cập nhật: chỉ cần `git push`. App tự tải bản mới ngầm, lần mở sau là bản mới.

## Cài app iOS lên iPhone/iPad qua cáp (Capacitor + Xcode)

Thư mục `ios/` là project Xcode bọc `index.html` thành app thật (Capacitor 8, Swift Package Manager — không cần CocoaPods).

```bash
npm install          # lần đầu
npm run ios          # copy index.html vào app, sync, mở Xcode
```

Trong Xcode:
1. Chọn target **App** → tab **Signing & Capabilities** → *Team*: chọn Apple ID của bạn (Add Account… nếu chưa có). Nếu báo trùng Bundle ID, đổi `com.cvthang.bevuichoi` thành tên khác.
2. Thanh trên cùng: chọn iPhone đang cắm cáp làm thiết bị chạy → bấm ▶ (Cmd+R).
3. Lần đầu trên iPhone: **Cài đặt → Quyền riêng tư & Bảo mật → Chế độ nhà phát triển** → Bật (máy khởi động lại); sau đó **Cài đặt → Cài đặt chung → VPN & Quản lý thiết bị** → tin cậy tài khoản nhà phát triển.

Với Apple ID miễn phí, app hết hạn sau **7 ngày** — cắm cáp và bấm ▶ lại để gia hạn. Tài khoản Apple Developer (99 USD/năm) cho 1 năm và cài qua TestFlight được.

Mỗi khi sửa `index.html`: chạy `npm run ios` rồi ▶ lại.

## Âm thanh

"Monkeys Spinning Monkeys" Kevin MacLeod (incompetech.com) Licensed under Creative Commons: By Attribution 4.0 License (http://creativecommons.org/licenses/by/4.0/)
