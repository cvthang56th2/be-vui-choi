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
