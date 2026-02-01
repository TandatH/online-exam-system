# 🎓 Hệ Thống Thi Trực Tuyến

Hệ thống thi trực tuyến đầy đủ tính năng cho giáo viên và học sinh, hỗ trợ tạo đề thi từ mã LaTeX, tự động chấm điểm, phát hiện gian lận và xuất kết quả Excel.

![Version](https://img.shields.io/badge/version-1.1-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![HTML](https://img.shields.io/badge/HTML-5-orange.svg)
![CSS](https://img.shields.io/badge/CSS-3-blue.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)

## 🌟 Tính Năng Chính

### Dành cho Giáo Viên:
- ✅ Đăng nhập đơn giản
- ✅ Tạo đề thi từ mã LaTeX
- ✅ Xem trước đề thi trước khi lưu
- ✅ Tạo mã đề thi ngẫu nhiên tự động
- ✅ Theo dõi kết quả theo thời gian thực
- ✅ Xuất kết quả ra file Excel với thống kê chi tiết
- ✅ Xóa kết quả (từng cái hoặc tất cả)
- ✅ Tích hợp Google Sheets (tùy chọn)

### Dành cho Học Sinh:
- ✅ Đăng nhập bằng mã đề thi
- ✅ Đồng hồ đếm ngược
- ✅ Tự động nộp bài khi hết giờ
- ✅ **Phát hiện chuyển tab** - tự động nộp bài và cảnh báo
- ✅ Tính điểm tự động (thang 10)
- ✅ Xem kết quả chi tiết ngay sau khi nộp bài
- ✅ Gửi kết quả về Google Sheets

## 🚀 Demo Trực Tuyến

🔗 **[Xem Demo Tại Đây](https://your-username.github.io/online-exam-system/teacher.html)**

- Giao diện Giáo viên: [teacher.html](https://your-username.github.io/online-exam-system/teacher.html)
- Giao diện Học sinh: [student.html](https://your-username.github.io/online-exam-system/student.html)

## 📦 Cài Đặt

### Phương pháp 1: Tải về và chạy trực tiếp

```bash
# Clone repository
git clone https://github.com/your-username/online-exam-system.git

# Mở thư mục
cd online-exam-system

# Mở file trong trình duyệt
# Giáo viên: Mở teacher.html
# Học sinh: Mở student.html
```

### Phương pháp 2: Deploy lên GitHub Pages

1. Fork repository này
2. Vào **Settings** > **Pages**
3. Chọn **Branch: main** > **Save**
4. Đợi vài phút và truy cập: `https://your-username.github.io/online-exam-system/`

### Phương pháp 3: Chạy với Live Server (VSCode)

```bash
# Cài đặt Live Server extension trong VSCode
# Nhấn chuột phải vào teacher.html
# Chọn "Open with Live Server"
```

## 📖 Hướng Dẫn Sử Dụng

### Cho Giáo Viên:

1. **Đăng nhập:**
   - Mở `teacher.html`
   - Nhập tên (mặc định: admin, giaovien, teacher)
   - Click "Đăng Nhập"

2. **Tạo đề thi:**
   - Nhập tên đề thi
   - Nhập thời gian làm bài (phút)
   - Nhập mã LaTeX (xem ví dụ dưới đây)
   - Click "Xem Trước Đề Thi"
   - Click "Lưu Đề Thi & Tạo Mã"

3. **Chia sẻ với học sinh:**
   - Copy mã 6 ký tự (VD: ABC123)
   - Gửi link `student.html` và mã cho học sinh

4. **Quản lý kết quả:**
   - Xem kết quả trong bảng
   - Click "📥 Tải Excel" để tải file kết quả
   - Click 🗑️ để xóa từng kết quả
   - Click "🗑️ Xóa Tất Cả" để xóa hết

### Ví dụ mã LaTeX:

```latex
\question Câu hỏi 1: 2 + 2 bằng mấy?
\choice 3
\CorrectChoice 4
\choice 5
\choice 6

\question Câu hỏi 2: Thủ đô Việt Nam là?
\choice TP.HCM
\CorrectChoice Hà Nội
\choice Đà Nẵng
\choice Huế
```

**Lưu ý:** 
- `\question` - Bắt đầu câu hỏi
- `\choice` - Đáp án sai
- `\CorrectChoice` - Đáp án đúng (chỉ 1 đáp án đúng/câu)

### Cho Học Sinh:

1. **Đăng nhập:**
   - Mở `student.html`
   - Nhập họ tên
   - Nhập mã đề thi (do GV cung cấp)
   - Click "Đăng Nhập"

2. **Làm bài thi:**
   - Đọc thông tin đề thi
   - Click "Bắt Đầu Làm Bài"
   - Chọn đáp án cho từng câu
   - **⚠️ KHÔNG CHUYỂN TAB!**
   - Click "Nộp Bài" hoặc đợi hết giờ

3. **Xem kết quả:**
   - Xem điểm ngay sau khi nộp
   - Xem chi tiết từng câu đúng/sai

## 📊 File Excel Xuất Ra

File Excel bao gồm 2 sheet:

### Sheet 1: "Kết Quả Thi"
- STT, Họ tên, Mã đề, Tên đề thi
- Điểm, Số câu đúng/tổng, Tỷ lệ %
- Cảnh báo chuyển tab, Thời gian nộp

### Sheet 2: "Thống Kê"
- Tổng số học sinh
- Điểm trung bình, cao nhất, thấp nhất
- Phân loại học lực (Giỏi, Khá, TB, Yếu)
- Số học sinh chuyển tab

## 🔧 Cấu Trúc Thư Mục

```
online-exam-system/
├── teacher.html          # Giao diện giáo viên
├── student.html          # Giao diện học sinh
├── styles.css            # File CSS chung
├── teacher.js            # JavaScript giáo viên
├── student.js            # JavaScript học sinh
├── HUONG_DAN.md         # Hướng dẫn chi tiết
├── VI_DU_LATEX.txt      # Ví dụ mã LaTeX
├── CAP_NHAT_TINH_NANG.md # Tính năng mới
└── README.md            # File này
```

## 🔌 Tích Hợp Google Sheets (Tùy chọn)

1. Tạo Google Spreadsheet mới
2. Vào **Extensions** > **Apps Script**
3. Paste code này:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.studentName,
    data.examCode,
    data.examTitle,
    data.score,
    data.correctCount + '/' + data.totalQuestions,
    data.tabSwitch,
    data.submittedAt
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. **Deploy** > **New deployment** > **Web app**
5. Copy URL và paste vào ô "Google Sheets URL" trong giao diện giáo viên

## 🎨 Tùy Chỉnh

### Thay đổi màu sắc:
Chỉnh sửa `styles.css`:
```css
/* Màu chủ đạo */
--primary-color: #667eea;
--gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Thay đổi thang điểm:
Trong `student.js`, tìm dòng:
```javascript
const score = ((correctCount / totalQuestions) * 10).toFixed(1);
```
Đổi `* 10` thành `* 100` cho thang 100.

### Thêm tên giáo viên:
Trong `teacher.js`:
```javascript
const validTeachers = ['admin', 'giaovien', 'teacher', 'GV'];
```

## 🛡️ Bảo Mật

- ✅ Mã đề thi ngẫu nhiên 6 ký tự
- ✅ Phát hiện chuyển tab tự động
- ✅ Không cho phép quay lại sau khi nộp bài
- ✅ Dữ liệu lưu trên LocalStorage (chỉ trên máy)
- ✅ Tự động nộp bài khi hết giờ

## 📱 Tương Thích

- ✅ Chrome, Firefox, Edge, Safari
- ✅ Desktop, Tablet, Mobile
- ✅ Responsive design
- ✅ Hoạt động offline (không cần internet)

## ❓ FAQ

**Q: Làm sao để học sinh không gian lận?**
A: Hệ thống tự động phát hiện chuyển tab và nộp bài ngay lập tức.

**Q: Dữ liệu lưu ở đâu?**
A: LocalStorage của trình duyệt. Mỗi máy lưu riêng.

**Q: Có cần server không?**
A: Không! Chạy hoàn toàn trên trình duyệt.

**Q: Có giới hạn số học sinh không?**
A: Không giới hạn.

**Q: File Excel có thể chỉnh sửa không?**
A: Có, hoàn toàn có thể chỉnh sửa bằng Excel/Google Sheets.

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! 

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 Changelog

### v1.1 (02/02/2025)
- ✅ Thêm tính năng xóa kết quả
- ✅ Thêm tính năng xuất Excel
- ✅ Thêm sheet thống kê trong Excel
- ✅ Cải thiện giao diện

### v1.0 (01/02/2025)
- ✅ Release đầu tiên
- ✅ Tạo đề thi từ LaTeX
- ✅ Phát hiện chuyển tab
- ✅ Tự động chấm điểm

## 📄 License

Dự án này được phát hành dưới giấy phép MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👨‍💻 Tác Giả

- **Tên của bạn** - [GitHub Profile](https://github.com/your-username)

## 🙏 Cảm Ơn

- [SheetJS](https://sheetjs.com/) - Thư viện xuất Excel
- [Google Fonts](https://fonts.google.com/) - Font chữ
- Cộng đồng GitHub

## 📞 Liên Hệ

- Email: your-email@example.com
- GitHub: [@your-username](https://github.com/your-username)
- Website: https://your-website.com

---

⭐ Nếu thấy hữu ích, hãy cho dự án một ngôi sao nhé! ⭐
