# 🚀 HƯỚNG DẪN ĐƯA DỰ ÁN LÊN GITHUB

## 📋 MỤC LỤC
1. [Chuẩn bị](#chuẩn-bị)
2. [Cách 1: Sử dụng GitHub Web (Dễ nhất)](#cách-1-sử-dụng-github-web-dễ-nhất)
3. [Cách 2: Sử dụng Git Command Line](#cách-2-sử-dụng-git-command-line)
4. [Cách 3: Sử dụng GitHub Desktop](#cách-3-sử-dụng-github-desktop)
5. [Kích hoạt GitHub Pages](#kích-hoạt-github-pages)
6. [Sử dụng hệ thống](#sử-dụng-hệ-thống)

---

## 🎯 CHUẨN BỊ

### Bước 1: Tạo tài khoản GitHub
1. Truy cập: https://github.com
2. Click **Sign up**
3. Điền email, mật khẩu, username
4. Xác nhận email

### Bước 2: Tải các file về máy
- Tất cả các file đã được tạo sẵn
- Đảm bảo có đủ 10 file:
  ```
  ✓ teacher.html
  ✓ student.html
  ✓ styles.css
  ✓ teacher.js
  ✓ student.js
  ✓ README.md
  ✓ LICENSE
  ✓ .gitignore
  ✓ HUONG_DAN.md
  ✓ VI_DU_LATEX.txt
  ```

---

## 📦 CÁCH 1: SỬ DỤNG GITHUB WEB (DỄ NHẤT)

### Bước 1: Tạo Repository mới

1. Đăng nhập GitHub
2. Click nút **"+"** góc trên bên phải
3. Chọn **"New repository"**
4. Điền thông tin:
   ```
   Repository name: online-exam-system
   Description: Hệ thống thi trực tuyến với LaTeX
   Public/Private: Chọn Public
   ☑️ Add a README file: BỎ CHỌN (vì ta đã có sẵn)
   ```
5. Click **"Create repository"**

### Bước 2: Upload files

1. Trong repository vừa tạo, click **"uploading an existing file"**
2. Kéo thả tất cả 10 file vào
3. Hoặc click **"choose your files"** và chọn file
4. Ở ô **"Commit changes"**:
   ```
   Title: Initial commit - Hệ thống thi trực tuyến
   Description: (Có thể để trống)
   ```
5. Click **"Commit changes"**

### ✅ XONG! Repository đã sẵn sàng!

---

## 💻 CÁCH 2: SỬ DỤNG GIT COMMAND LINE

### Bước 1: Cài đặt Git

**Windows:**
- Tải Git: https://git-scm.com/download/win
- Cài đặt với các tùy chọn mặc định

**Mac:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get install git  # Ubuntu/Debian
sudo yum install git      # CentOS/Fedora
```

### Bước 2: Cấu hình Git (Lần đầu tiên)

```bash
git config --global user.name "Tên của bạn"
git config --global user.email "email@example.com"
```

### Bước 3: Tạo Repository trên GitHub

1. Đăng nhập GitHub
2. Tạo repository mới tên **"online-exam-system"**
3. Chọn **Public**
4. **KHÔNG** tick "Add a README file"
5. Click **"Create repository"**

### Bước 4: Upload code từ máy

```bash
# 1. Mở terminal/cmd và di chuyển đến thư mục chứa các file
cd /đường/dẫn/đến/thư/mục

# 2. Khởi tạo Git
git init

# 3. Thêm tất cả file
git add .

# 4. Commit
git commit -m "Initial commit - Hệ thống thi trực tuyến"

# 5. Thêm remote (thay YOUR-USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR-USERNAME/online-exam-system.git

# 6. Đổi branch thành main
git branch -M main

# 7. Push lên GitHub
git push -u origin main
```

### Nếu yêu cầu đăng nhập:
- Username: Username GitHub của bạn
- Password: **Personal Access Token** (KHÔNG phải mật khẩu GitHub)

**Tạo Personal Access Token:**
1. GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Click **"Generate new token"** > **"Generate new token (classic)"**
3. Đặt tên: "Git Access"
4. Chọn quyền: **repo** (tick tất cả)
5. Click **"Generate token"**
6. **COPY TOKEN** (chỉ hiện 1 lần!)
7. Dùng token này làm password

---

## 🖥️ CÁCH 3: SỬ DỤNG GITHUB DESKTOP

### Bước 1: Cài đặt GitHub Desktop

- Tải tại: https://desktop.github.com
- Cài đặt và đăng nhập GitHub

### Bước 2: Tạo Repository

1. Mở GitHub Desktop
2. **File** > **New Repository**
3. Điền:
   ```
   Name: online-exam-system
   Description: Hệ thống thi trực tuyến
   Local path: Chọn thư mục chứa code
   ```
4. Click **"Create Repository"**

### Bước 3: Copy file vào thư mục

1. Copy tất cả 10 file vào thư mục vừa tạo
2. GitHub Desktop sẽ tự động phát hiện

### Bước 4: Commit và Push

1. Trong GitHub Desktop, tick tất cả file
2. Ở ô **"Summary"**: nhập "Initial commit"
3. Click **"Commit to main"**
4. Click **"Publish repository"**
5. Chọn **Public** > Click **"Publish repository"**

### ✅ XONG!

---

## 🌐 KÍCH HOẠT GITHUB PAGES

Sau khi upload code lên GitHub, làm theo các bước sau để có link trực tuyến:

### Bước 1: Vào Settings

1. Trong repository, click tab **"Settings"**
2. Kéo xuống menu bên trái, click **"Pages"**

### Bước 2: Cấu hình Pages

1. Ở **"Source"**, chọn:
   ```
   Branch: main
   Folder: / (root)
   ```
2. Click **"Save"**

### Bước 3: Đợi deploy (2-5 phút)

1. Refresh trang
2. Sẽ thấy thông báo:
   ```
   ✅ Your site is live at https://YOUR-USERNAME.github.io/online-exam-system/
   ```

### Bước 4: Truy cập

- **Giao diện Giáo viên:** 
  ```
  https://YOUR-USERNAME.github.io/online-exam-system/teacher.html
  ```

- **Giao diện Học sinh:**
  ```
  https://YOUR-USERNAME.github.io/online-exam-system/student.html
  ```

---

## 🎯 SỬ DỤNG HỆ THỐNG

### Cho Giáo viên:

1. Truy cập link giáo viên
2. Đăng nhập (username: admin)
3. Tạo đề thi
4. Copy mã đề thi (VD: ABC123)
5. Gửi cho học sinh:
   - Link học sinh
   - Mã đề thi

### Cho Học sinh:

1. Nhận link và mã từ giáo viên
2. Mở link học sinh
3. Nhập tên và mã đề
4. Làm bài thi
5. Xem kết quả

---

## 🔄 CẬP NHẬT CODE SAU NÀY

### Nếu dùng GitHub Web:
1. Vào repository
2. Click file cần sửa
3. Click nút **Edit** (biểu tượng bút chì)
4. Sửa code
5. Click **"Commit changes"**

### Nếu dùng Git Command:
```bash
# 1. Sửa file trong máy
# 2. Add file đã sửa
git add .

# 3. Commit
git commit -m "Mô tả thay đổi"

# 4. Push lên GitHub
git push
```

### Nếu dùng GitHub Desktop:
1. Sửa file trong máy
2. GitHub Desktop tự động phát hiện
3. Nhập commit message
4. Click **"Commit to main"**
5. Click **"Push origin"**

---

## 🎨 TÙY CHỈNH URL

### Dùng tên miền riêng (Tùy chọn):

1. Mua domain (VD: thitructuyen.com)
2. Trong Settings > Pages
3. Ở **"Custom domain"**, nhập domain
4. Click **"Save"**
5. Cấu hình DNS ở nhà cung cấp domain:
   ```
   Type: CNAME
   Name: www
   Value: YOUR-USERNAME.github.io
   ```

---

## ❓ GIẢI QUYẾT SỰ CỐ

### Lỗi: "Permission denied"
**Nguyên nhân:** Chưa cấu hình Git hoặc token sai
**Giải pháp:** Tạo lại Personal Access Token

### Lỗi: "Repository not found"
**Nguyên nhân:** URL repository sai
**Giải pháp:** Kiểm tra lại URL trong git remote

### Lỗi: "Failed to push"
**Nguyên nhân:** Branch sai hoặc conflict
**Giải pháp:**
```bash
git pull origin main --rebase
git push origin main
```

### GitHub Pages không hiển thị
**Nguyên nhân:** Chưa deploy xong hoặc cấu hình sai
**Giải pháp:** 
- Đợi 5-10 phút
- Kiểm tra lại Settings > Pages
- Xóa cache trình duyệt

### File không hiển thị
**Nguyên nhân:** Đường dẫn file sai
**Giải pháp:** 
- Đảm bảo tất cả file ở cùng thư mục root
- Tên file phải chính xác (teacher.html, student.html...)

---

## 📝 CHECKLIST HOÀN THÀNH

- [ ] Tạo tài khoản GitHub
- [ ] Tạo repository "online-exam-system"
- [ ] Upload tất cả 10 file
- [ ] Kích hoạt GitHub Pages
- [ ] Test link giáo viên
- [ ] Test link học sinh
- [ ] Tạo đề thi thử
- [ ] Test làm bài thi
- [ ] Chia sẻ link với người dùng

---

## 🎓 VIDEO HƯỚNG DẪN

### YouTube tutorials về GitHub:
- Cách dùng GitHub Web: https://youtube.com/...
- Cách dùng Git Command: https://youtube.com/...
- Cách dùng GitHub Desktop: https://youtube.com/...

---

## 💡 MẸO

1. **Làm README.md đẹp:** Thay thế `YOUR-USERNAME` bằng username thật
2. **Thêm ảnh demo:** Screenshot giao diện và upload vào thư mục `images/`
3. **Tạo nhiều branch:** Dùng branch để test tính năng mới
4. **Viết CHANGELOG:** Ghi lại mọi thay đổi
5. **Backup định kỳ:** Download code về máy định kỳ

---

## 🎉 CHÚC MỪNG!

Bạn đã đưa dự án lên GitHub thành công! 

**Bước tiếp theo:**
- ⭐ Thêm README.md đẹp với screenshots
- 🐛 Test kỹ mọi tính năng
- 📢 Chia sẻ với bạn bè
- 🔔 Watch repository để nhận thông báo
- 🍴 Fork nếu muốn customize

**Cần hỗ trợ?**
- GitHub Docs: https://docs.github.com
- GitHub Community: https://github.community
- Stack Overflow: https://stackoverflow.com/questions/tagged/github
