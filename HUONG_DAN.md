# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG THI TRỰC TUYẾN

## 📋 CÁC FILE TRONG HỆ THỐNG

1. **teacher.html** - Giao diện giáo viên (tạo đề thi)
2. **student.html** - Giao diện học sinh (làm bài thi)
3. **styles.css** - File CSS chung cho cả hai giao diện
4. **teacher.js** - JavaScript cho giao diện giáo viên
5. **student.js** - JavaScript cho giao diện học sinh

## 🎓 HƯỚNG DẪN CHO GIÁO VIÊN

### Bước 1: Đăng nhập
- Mở file `teacher.html`
- Nhập tên giáo viên (mặc định: admin, giaovien, teacher, hoặc bất kỳ tên nào có chữ "giáo viên")
- Nhấn "Đăng Nhập"

### Bước 2: Tạo đề thi

1. **Nhập thông tin đề thi:**
   - Tên đề thi
   - Thời gian làm bài (phút)

2. **Nhập mã LaTeX theo định dạng:**

```latex
\question Câu hỏi 1: 2 + 2 bằng mấy?
\choice 3
\choice 5
\CorrectChoice 4
\choice 6

\question Câu hỏi 2: Thủ đô của Việt Nam là?
\choice Hồ Chí Minh
\CorrectChoice Hà Nội
\choice Đà Nẵng
\choice Cần Thơ
```

**Lưu ý về cú pháp LaTeX:**
- `\question` - Bắt đầu câu hỏi mới
- `\choice` - Đáp án sai
- `\CorrectChoice` - Đáp án đúng (CHỈ MỘT đáp án đúng cho mỗi câu)

### Bước 3: Xem trước và lưu đề thi
- Nhấn "Xem Trước Đề Thi"
- Kiểm tra câu hỏi và đáp án
- Nhấn "Lưu Đề Thi & Tạo Mã"
- Hệ thống sẽ tạo mã 6 ký tự (VD: ABC123)

### Bước 4: Chia sẻ với học sinh
- Copy mã đề thi
- Gửi cho học sinh link `student.html` và mã đề thi

### Bước 5: Theo dõi kết quả
- Kết quả sẽ tự động hiển thị trong phần "Kết Quả Thi"
- Có thể theo dõi:
  - Họ tên học sinh
  - Điểm số
  - Thời gian nộp bài
  - Cảnh báo chuyển tab

## 👨‍🎓 HƯỚNG DẪN CHO HỌC SINH

### Bước 1: Đăng nhập
- Mở file `student.html`
- Nhập họ tên
- Nhập mã đề thi (do giáo viên cung cấp)
- Nhấn "Đăng Nhập"

### Bước 2: Bắt đầu làm bài
- Đọc thông tin đề thi (tên, thời gian, số câu)
- Nhấn "Bắt Đầu Làm Bài"
- **CHÚ Ý:** Không chuyển tab trong khi làm bài!

### Bước 3: Làm bài thi
- Chọn đáp án cho từng câu hỏi
- Theo dõi đồng hồ đếm ngược ở góc phải
- Có thể nộp bài sớm hoặc đợi hết giờ

### Bước 4: Xem kết quả
- Sau khi nộp bài, xem ngay điểm số
- Xem chi tiết từng câu trả lời đúng/sai
- Kết quả tự động gửi về giáo viên

## ⚠️ CÁC QUY TẮC QUAN TRỌNG

### Đối với học sinh:
1. **KHÔNG CHUYỂN TAB** - Nếu chuyển tab, bài thi sẽ tự động nộp
2. Không tải lại trang trong khi làm bài
3. Đảm bảo kết nối internet ổn định
4. Làm bài trong môi trường yên tĩnh

### Hệ thống tự động:
- ✅ Tự động nộp bài khi hết giờ
- ✅ Tự động nộp bài khi phát hiện chuyển tab
- ✅ Tự động tính điểm theo thang 10
- ✅ Tự động lưu kết quả

## 📊 TÍCH HỢP GOOGLE SHEETS (TÙY CHỌN)

Để tự động gửi kết quả lên Google Sheets:

### Bước 1: Tạo Google Apps Script

1. Truy cập [Google Sheets](https://sheets.google.com)
2. Tạo spreadsheet mới
3. Vào **Extensions > Apps Script**
4. Copy đoạn code sau:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Parse dữ liệu
  var data = JSON.parse(e.postData.contents);
  
  // Thêm dòng mới
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

5. Nhấn **Deploy > New deployment**
6. Chọn type: **Web app**
7. Execute as: **Me**
8. Who has access: **Anyone**
9. Nhấn **Deploy**
10. Copy **Web app URL**

### Bước 2: Cấu hình trong hệ thống

1. Mở `teacher.html`
2. Đăng nhập
3. Paste URL vào ô "Google Sheets URL"
4. Mọi kết quả sẽ tự động gửi về Google Sheets

## 🎨 TÙY CHỈNH

### Thay đổi màu sắc
Chỉnh sửa file `styles.css`:
- Màu chủ đạo: `#667eea`
- Màu gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

### Thay đổi thang điểm
Trong file `student.js`, tìm dòng:
```javascript
const score = ((correctCount / totalQuestions) * 10).toFixed(1);
```
Đổi `* 10` thành số khác (VD: `* 100` cho thang 100)

### Thêm tên giáo viên hợp lệ
Trong file `teacher.js`, tìm:
```javascript
const validTeachers = ['admin', 'giaovien', 'teacher', 'GV'];
```
Thêm tên vào mảng này.

## 🔧 XỬ LÝ SỰ CỐ

### Quên mã đề thi
- Giáo viên mở Console (F12)
- Chạy: `localStorage.getItem('exams')`
- Tìm mã trong kết quả

### Xóa tất cả dữ liệu
```javascript
localStorage.clear();
```

### Xem kết quả đã lưu
```javascript
console.log(JSON.parse(localStorage.getItem('examResults')));
```

## 📱 TƯƠNG THÍCH

- ✅ Chrome, Firefox, Edge, Safari
- ✅ Desktop, Tablet, Mobile
- ✅ Hoạt động offline (không cần internet)
- ⚠️ Cần internet nếu dùng Google Sheets

## 💡 MẸO VÀ THỦ THUẬT

### Cho giáo viên:
1. Chuẩn bị đề thi trong file text trước
2. Test đề thi trước khi chia sẻ
3. Backup mã LaTeX để tái sử dụng
4. Đặt tên đề thi rõ ràng (VD: "Toán 10 - Chương 1")

### Cho học sinh:
1. Đọc kỹ đề trước khi bắt đầu
2. Trả lời câu dễ trước
3. Kiểm tra lại trước khi nộp
4. Không đóng trình duyệt trong khi thi

## 📞 HỖ TRỢ

Nếu gặp lỗi:
1. Kiểm tra Console (F12)
2. Xóa cache và thử lại
3. Đảm bảo JavaScript được bật
4. Thử trình duyệt khác

---

**Phát triển bởi:** Claude AI Assistant
**Phiên bản:** 1.0
**Ngày cập nhật:** 2025
