# Trang Sinh Nhật - Hướng Dẫn Tính Năng

## URL
`/kl` hoặc `/kl.tsx`

## Tính Năng Chính

### 1. **Carousel Ảnh Vòng Tròn** 🎠
- Tất cả ảnh xoay theo vòng tròn
- Ảnh ở giữa được highlight với glow effect
- Ảnh khác có độ mờ và scale nhỏ hơn
- Responsive: tự động fit trên tất cả các thiết bị (desktop, tablet, mobile)

### 2. **Hiệu Ứng Xoay & Zoom** ✨
- **Khi di chuyển**: Click lên một ảnh khác để chuyển đến ảnh đó
- **Click ảnh giữa**: Phóng to (zoom 1.5x) và xoay lần nữa
- **Zoom Animation**: Mượt mà với cubic-bezier easing

### 3. **Âm Thanh Sinh Nhật** 🎵
- File: `/birthday.mp3` (38KB)
- Phát tự động khi tải trang
- Button mute/unmute ở góc trên phải
- Lặp lại liên tục

### 4. **Icons Sinh Nhật** 🎂
- 2 icon bánh sinh nhật (Cake từ lucide-react)
- Nổi lên xuống liên tục
- Màu hồng và xanh lam (matching theme)

### 5. **Tương Tác**
- **Chuột**: Di chuyển để xoay carousel, click ảnh
- **Touch**: Swipe để di chuyển (mobile)
- **Bàn phím**: Arrow Left/Right
- **Dots**: Click các chấm dưới để chọn ảnh trực tiếp
- **Progress bar**: Hiển thị tiến độ autoplay

## Ảnh
Tất cả ảnh được tải từ `/public/images/`:
- `birthday-1.jpg` - Balloons & Confetti
- `birthday-2.jpg` - Birthday Cake
- `birthday-3.jpg` - Party People
- `birthday-4.jpg` - Glamorous Party
- `birthday-5.jpg` - Magical Lights

## Cách Thêm Ảnh Mới

### Thêm vào `/public/images/`
1. Lưu ảnh trong thư mục `/public/images/`
2. Hỗ trợ format: JPG, PNG, GIF, WebP
3. API tự động load tất cả ảnh từ thư mục

Ví dụ:
```
/public/images/
├── birthday-1.jpg
├── birthday-2.jpg
├── my-custom-photo.jpg ← sẽ được load tự động
└── ...
```

## Responsive Design
- **Desktop (1024px+)**: w-600px carousel
- **Tablet (768px-1024px)**: w-500px carousel
- **Mobile (480px-768px)**: w-400px carousel
- **Small Mobile (<480px)**: w-300px carousel

Tất cả điều chỉnh tự động theo screen size!

## Cách Tùy Chỉnh

### Thay Đổi Màu
Sửa trong `kl.tsx`:
```tsx
const [color, setColor] = useState({ r: 0, g: 217, b: 255 }) // Hiện tại: Cyan
```

### Thay Đổi Âm Thanh
Thay file `/public/birthday.mp3` bằng file mới

### Thay Đổi Tiêu Đề
Sửa phần:
```tsx
<h1 className="text-3xl md:text-5xl font-bold ...">
  HAPPY BIRTHDAY
</h1>
```

## API Endpoint
- **GET** `/api/images` - Trả về mảng đường dẫn ảnh từ `/public/images/`

Ví dụ response:
```json
[
  "/images/birthday-1.jpg",
  "/images/birthday-2.jpg",
  "/images/birthday-3.jpg",
  "/images/birthday-4.jpg",
  "/images/birthday-5.jpg"
]
```

## Browser Compatibility
- Chrome/Edge: ✅ Đầy đủ
- Firefox: ✅ Đầy đủ
- Safari: ✅ Đầy đủ
- Mobile browsers: ✅ Responsive

Trang sẽ tự động phát âm thanh. Nếu browser block autoplay, user có thể click button unmute để phát.
