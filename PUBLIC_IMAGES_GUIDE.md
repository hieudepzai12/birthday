# Hướng dẫn sử dụng trang Sinh Nhật (KL)

## Tính năng

Trang `kl.tsx` bao gồm các hiệu ứng tuyệt vời:

### 1. **Hiệu ứng Xoay Vòng (Spin)**
- Ảnh hiện tại xoay vòng liên tục
- Tạo cảm giác động lực và cuốn hút

### 2. **Hiệu ứng Zoom**
- Khi click vào ảnh chính, nó sẽ xoay vòng nhanh hơn và phóng to
- Zoom vào ảnh cao nhất là 1.5x kích thước gốc

### 3. **Icon Sinh Nhật**
- Biểu tượng bánh sinh nhật nổi lên xuống
- Hai icon ở hai bên tiêu đề "HAPPY BIRTHDAY"

### 4. **Carousel Coverflow**
- Tương tác với chuột: kéo trái/phải để chuyển ảnh
- Tương tác với bàn phím: mũi tên trái/phải
- Tự động chuyển ảnh sau 3 giây
- Phản chiếu ảnh phía dưới

### 5. **Ảnh từ Public Folder**
- Tất cả ảnh tự động tải từ `/public/images/`
- API tự động quét folder và lấy tất cả file ảnh

## Cách thêm ảnh

### Cách 1: Thêm ảnh vào thư mục public
1. Đặt ảnh vào thư mục `/public/images/`
2. Ảnh sẽ tự động hiển thị trên trang (không cần reload server)
3. Hỗ trợ các định dạng: JPG, PNG, GIF, WebP

### Cách 2: Sử dụng upload (nếu có)
- Có thể sử dụng endpoint `/api/upload` nếu được cấu hình

## Cách tùy chỉnh

### Thay đổi tốc độ xoay
Mở file `app/kl.tsx` và tìm dòng:
```css
animation: spin 6s linear infinite;
```
- Thay `6s` thành giá trị khác (ví dụ: `3s` cho xoay nhanh hơn)

### Thay đổi màu gradient tiêu đề
Tìm dòng:
```tsx
bg-gradient-to-r from-pink-400 to-cyan-400
```
Đổi màu theo ý thích

### Thay đổi tốc độ autoplay
Tìm dòng:
```typescript
}, 3000)
```
- `3000` = 3 giây, có thể thay đổi thành giá trị khác (ms)

## Cấu trúc file

```
/public
  /images
    birthday-1.jpg
    birthday-2.jpg
    birthday-3.jpg
    birthday-4.jpg
    birthday-5.jpg

/app
  kl.tsx          (Component chính)
  /kl
    page.tsx      (Route page)
  /api
    /images
      route.ts    (API lấy danh sách ảnh)
```

## API Endpoint

**GET `/api/images`**
- Trả về: Mảng JSON với đường dẫn ảnh
- Ví dụ: `["/images/birthday-1.jpg", "/images/birthday-2.jpg"]`

## Ghi chú
- Ảnh tự động sắp xếp theo tên file
- API ưu tiên folder `public/images` trước
- Động ảnh mượt mà nhờ transition CSS
