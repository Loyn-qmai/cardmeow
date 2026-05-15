# Hướng dẫn quản lý ảnh mèo của bạn

Để ảnh của bạn hiển thị vĩnh viễn trên GitHub và Vercel, hãy làm theo các bước sau:

1. **Copy ảnh**: Chép các file ảnh của bạn vào thư mục này (`public/images/`). Ví dụ: `muoi-1.jpg`, `muoi-2.jpg`.
2. **Sửa file constants.ts**: Thay đổi các đường dẫn URL từ link Unsplash sang đường dẫn cục bộ.
   Ví dụ: 
   - Trước: `url: "https://images.unsplash.com/..."`
   - Sau: `url: "/images/muoi-1.jpg"` (Lưu ý: `/` đại diện cho thư mục public).

3. **Push lên GitHub**: Khi bạn đẩy code lên GitHub, các ảnh này sẽ đi cùng và Vercel sẽ tự động hiển thị chúng.
