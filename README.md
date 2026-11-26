# Bé Vui Chơi 🎈

Bộ mini-game giáo dục cho trẻ nhỏ, chạy trên iPad (Safari) — giao diện tiếng Việt, có giọng đọc, chữ và hình to, thao tác đơn giản.

## Các game (chia theo lứa tuổi) — 112 lượt game

Màn hình chính có 4 tab tuổi + 2 tab cho bố mẹ (app nhớ tab đang chọn). Một số game dùng chung nhiều tuổi và tự chỉnh độ khó.

### 👶 1–2 tuổi (36 game) — không có đáp án sai, mọi lần chạm đều có phản hồi
Nút 🏠 bị khoá: bố mẹ **giữ 1 giây** mới thoát.
Chạm là vui · Ú òa! · Bong bóng · Con vật · Xe cộ · Vẽ ngón tay · Đàn piano · Trái cây · Màu sắc · Cơ thể bé · Nhạc cụ · Gia đình · Bể cá · Ngày & đêm · Pháo hoa · Trứng nở · Các hình · Dắt cún · Lau kính · Bơm bóng · Vườn hoa · Tàu hỏa · Nhảy múa · Làm kem · Xếp khối · Soi đèn · Điện thoại · Thổi bong bóng · Tắm cho thú · Đào cát tìm đồ · Vũng bùn · Nghịch cát · Bong bóng màu · Xây lâu đài cát · Thả bóng bay · **Mưa rơi**

### 🐣 2–3 tuổi (24 game)
Bóng bay · Con gì kêu? · Hộp hình khối · Cho thú ăn · Đàn piano · Tô màu · Tìm trái cây · Tìm màu · To – nhỏ · Mũi đâu? · Tìm giống nhau · Ai ăn gì? · Nhà của ai? · Đếm 1-2-3 · Tìm hình · Xếp theo màu · **Tìm con vật · Dùng để làm gì? · Thời tiết · Đôi bạn · Cao – thấp · Trên – dưới · Một – nhiều · Dọn đồ**

### 🐥 4–5 tuổi (28 game)
Đua xe · Đếm số · Quy luật · Tìm bóng · Lắp ráp · Ghép hình · Lật thẻ · Chữ cái ABC · Số nào lớn? · Chữ tiếng Việt · Nhiều – ít · Cái nào khác? · Trái nghĩa · Cảm xúc · Số tiếp theo · Đập chuột số · Nhớ thứ tự · Xe đi đâu? · Đếm bóng bay · **Chữ hoa – thường · Nghề nghiệp · Xếp thứ tự · Thêm – bớt · Nổi hay chìm? · Nối điểm · Trước – sau · Xúc xắc · Trộn màu**

### 🦉 6–7 tuổi (24 game)
Cộng trừ · Đánh vần tiếng Anh · Xem giờ · Mê cung · Ghép hình 3×3 · Lật thẻ · Chữ cái · Đàn piano · Toán đến 20 · So sánh > < = · Tập đọc · Nghe tiếng Anh · Thứ trong tuần · Chẵn – lẻ · Chục & đơn vị · Sudoku mini · Đua toán · Trái – phải · **Phép nhân · Đo độ dài · Phân số · Điền chữ · Hình học · Lập trình robot**

### 👨‍👩‍👧 Bố mẹ (6 game) — bố mẹ tự chơi lúc bé ngủ
Đố vui nuôi con · Thật hay đùa? · Gộp đồ bé (vuốt gộp 🍼 → 🎓) · Trượt số (3×3, 4×4) · Bố mẹ kiểu gì? (trắc nghiệm vui) · Hít thở 1 phút

### 🤝 Cùng bé (6 game) — bố mẹ và bé chơi chung trên một máy
Kéo co (chia đôi màn hình, bố mẹ kéo nhẹ hơn cho công bằng) · Ai nhanh hơn? (bé ít lựa chọn hơn) · Trốn tìm · Bắt chước nào · Cờ ca-rô (🐱 bé – 🐶 bố mẹ) · Kể chuyện (xúc xắc nhân vật – nơi chốn – đồ vật)

## Song ngữ Việt / English

Nút **🇻🇳 VI / 🇬🇧 EN** ở góc trên màn hình chính (hoặc ⚙️ → Ngôn ngữ) đổi toàn bộ chữ và giọng đọc sang tiếng Anh; lựa chọn được lưu lại.
- Mọi chuỗi trong code dùng `T('tiếng Việt', 'English')`; số đếm, giờ, số nhiều/mạo từ tiếng Anh xử lý bằng `enNum`, `pl`, `art`.
- `say(text)` đọc theo ngôn ngữ đang chọn; `say(text,'vi-VN!')` luôn đọc tiếng Việt (dùng cho phần song ngữ: Lật thẻ, ABC, Đánh vần, Nghe tiếng Anh vẫn đọc nghĩa tiếng Việt).
- Game "Chữ tiếng Việt" chỉ hiện ở chế độ tiếng Việt; "Tập đọc" ở chế độ tiếng Anh thành tập đọc từ tiếng Anh.

## Giọng đọc thu sẵn (VieNeu-TTS)

Câu tiếng Việt được thu sẵn bằng [VieNeu-TTS](https://pypi.org/project/vieneu/) (giọng `Mỹ Duyên`) vào `audio/voice/` (mỗi câu một file mp3, tra theo `audio/voice/manifest.json`). `say()` tách văn bản thành từng câu: câu có file thu sẵn thì phát file, câu chưa có thì đọc bằng giọng máy. Tắt được ở ⚙️ → *Giọng tiếng Việt tự nhiên*. Tiếng Anh vẫn dùng giọng máy.

Tạo lại sau khi thêm/sửa câu thoại (chỉ thu các câu mới):

```bash
python3.13 -m venv .venv-voice && .venv-voice/bin/pip install vieneu   # lần đầu
npm run voice
```

- `scripts/voice-harvest.mjs` chạy app trong jsdom, gọi thử mọi game câu hỏi (`makeQuiz`) hàng nghìn lần để gom câu ghép từ dữ liệu → `scripts/voice-phrases.json`.
- `scripts/gen-voice.py` lấy thêm các câu cố định `T('…','…')` trong `index.html` và `scripts/voice-extra.json` (tự thêm, dạng `[["vi","Câu cần thu"]]`), rồi thu bằng VieNeu (6 tiến trình song song, khoảng 12 phút cho toàn bộ). Tuỳ chọn: `--voice`, `--lang vi,en`, `--jobs`, `--dry-run`.
- Câu app nói mà chưa có file được ghi vào `localStorage.bevui_voice_miss` — chép sang `scripts/voice-extra.json` rồi chạy lại.

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
