// Teacher.js - Quản lý giao diện giáo viên

let currentExam = null;
let examResults = [];

// Đăng nhập giáo viên
function teacherLogin() {
    const teacherName = document.getElementById('teacherName').value.trim();
    
    // Kiểm tra tên giáo viên (có thể thêm logic kiểm tra phức tạp hơn)
    const validTeachers = ['admin', 'giaovien', 'teacher', 'GV'];
    
    if (validTeachers.includes(teacherName) || teacherName.toLowerCase().includes('giáo viên')) {
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('createExamSection').classList.remove('hidden');
        localStorage.setItem('teacherName', teacherName);
    } else {
        alert('Tên giáo viên không hợp lệ!');
    }
}

// Đăng xuất
function logout() {
    localStorage.removeItem('teacherName');
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('createExamSection').classList.add('hidden');
    document.getElementById('teacherName').value = '';
}

// Parse LaTeX thành câu hỏi
function parseLatex() {
    const latexInput = document.getElementById('latexInput').value;
    const examTitle = document.getElementById('examTitle').value.trim();
    const examDuration = parseInt(document.getElementById('examDuration').value);
    
    if (!examTitle) {
        alert('Vui lòng nhập tên đề thi!');
        return;
    }
    
    if (!latexInput.trim()) {
        alert('Vui lòng nhập mã LaTeX!');
        return;
    }
    
    try {
        const questions = parseLatexQuestions(latexInput);
        
        if (questions.length === 0) {
            alert('Không tìm thấy câu hỏi nào trong mã LaTeX!');
            return;
        }
        
        currentExam = {
            title: examTitle,
            duration: examDuration,
            questions: questions
        };
        
        displayPreview(questions);
        document.getElementById('previewSection').classList.remove('hidden');
        
    } catch (error) {
        alert('Lỗi khi phân tích mã LaTeX: ' + error.message);
    }
}

// Phân tích cú pháp LaTeX
function parseLatexQuestions(latex) {
    const questions = [];
    
    // Tách các câu hỏi dựa trên \question
    const questionBlocks = latex.split('\\question').filter(block => block.trim());
    
    questionBlocks.forEach((block, index) => {
        const lines = block.split('\n').map(line => line.trim()).filter(line => line);
        
        if (lines.length === 0) return;
        
        const questionText = lines[0].replace(/^[\s\S]*?([^\s\\].*)$/, '$1');
        const choices = [];
        let correctIndex = -1;
        
        lines.slice(1).forEach(line => {
            if (line.startsWith('\\choice')) {
                const choiceText = line.replace('\\choice', '').trim();
                choices.push(choiceText);
            } else if (line.startsWith('\\CorrectChoice')) {
                const choiceText = line.replace('\\CorrectChoice', '').trim();
                correctIndex = choices.length;
                choices.push(choiceText);
            }
        });
        
        if (questionText && choices.length > 0 && correctIndex !== -1) {
            questions.push({
                id: index + 1,
                question: questionText,
                choices: choices,
                correctAnswer: correctIndex
            });
        }
    });
    
    return questions;
}

// Hiển thị xem trước
function displayPreview(questions) {
    const previewContainer = document.getElementById('questionsPreview');
    previewContainer.innerHTML = '';
    
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-preview';
        
        let html = `<div class="question-text">Câu ${index + 1}: ${q.question}</div>`;
        
        q.choices.forEach((choice, i) => {
            const isCorrect = i === q.correctAnswer;
            html += `<div class="choice-item ${isCorrect ? 'correct-choice' : ''}">
                ${String.fromCharCode(65 + i)}. ${choice} ${isCorrect ? '✓ (Đúng)' : ''}
            </div>`;
        });
        
        questionDiv.innerHTML = html;
        previewContainer.appendChild(questionDiv);
    });
}

// Lưu đề thi và tạo mã
function saveExam() {
    if (!currentExam) {
        alert('Chưa có đề thi nào!');
        return;
    }
    
    // Tạo mã ngẫu nhiên 6 ký tự
    const examCode = generateExamCode();
    
    // Lưu vào localStorage
    const exams = JSON.parse(localStorage.getItem('exams') || '{}');
    exams[examCode] = {
        ...currentExam,
        createdAt: new Date().toISOString(),
        teacherName: localStorage.getItem('teacherName')
    };
    localStorage.setItem('exams', JSON.stringify(exams));
    
    // Hiển thị mã
    document.getElementById('examCode').textContent = examCode;
    document.getElementById('examCodeSection').classList.remove('hidden');
    
    // Tạo link học sinh
    const studentUrl = window.location.href.replace('teacher.html', 'student.html');
    document.getElementById('studentLink').href = studentUrl;
    document.getElementById('studentLink').textContent = studentUrl;
    
    alert('Đề thi đã được lưu thành công!');
}

// Tạo mã đề thi ngẫu nhiên
function generateExamCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

// Copy mã đề thi
function copyCode() {
    const code = document.getElementById('examCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('Đã copy mã: ' + code);
    });
}

// Tải kết quả từ localStorage
function loadResults() {
    const results = JSON.parse(localStorage.getItem('examResults') || '[]');
    const resultsList = document.getElementById('resultsList');
    
    if (results.length === 0) {
        resultsList.innerHTML = '<p class="hint">Chưa có kết quả thi nào.</p>';
        return;
    }
    
    let html = '<table style="width:100%; border-collapse: collapse;">';
    html += '<thead><tr style="background:#f8f9fa;"><th style="padding:10px; border:1px solid #ddd;">Họ tên</th><th style="padding:10px; border:1px solid #ddd;">Mã đề</th><th style="padding:10px; border:1px solid #ddd;">Điểm</th><th style="padding:10px; border:1px solid #ddd;">Thời gian</th><th style="padding:10px; border:1px solid #ddd;">Cảnh báo</th><th style="padding:10px; border:1px solid #ddd;">Thao tác</th></tr></thead><tbody>';
    
    results.forEach((result, index) => {
        html += `<tr>
            <td style="padding:10px; border:1px solid #ddd;">${result.studentName}</td>
            <td style="padding:10px; border:1px solid #ddd;">${result.examCode}</td>
            <td style="padding:10px; border:1px solid #ddd;"><strong>${result.score}/10</strong></td>
            <td style="padding:10px; border:1px solid #ddd;">${new Date(result.submittedAt).toLocaleString('vi-VN')}</td>
            <td style="padding:10px; border:1px solid #ddd;">${result.tabSwitch ? '⚠️ Có chuyển tab' : '✓ Bình thường'}</td>
            <td style="padding:10px; border:1px solid #ddd; text-align:center;">
                <button onclick="deleteResult(${index})" class="btn-delete" title="Xóa">🗑️</button>
            </td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    resultsList.innerHTML = html;
}

// Khởi tạo khi trang load
window.addEventListener('load', () => {
    // Kiểm tra nếu đã đăng nhập
    const teacherName = localStorage.getItem('teacherName');
    if (teacherName) {
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('createExamSection').classList.remove('hidden');
    }
    
    // Load kết quả
    loadResults();
    
    // Cập nhật kết quả mỗi 5 giây
    setInterval(loadResults, 5000);
});

// Xóa một kết quả cụ thể
function deleteResult(index) {
    if (!confirm('Bạn có chắc muốn xóa kết quả này?')) {
        return;
    }
    
    const results = JSON.parse(localStorage.getItem('examResults') || '[]');
    results.splice(index, 1);
    localStorage.setItem('examResults', JSON.stringify(results));
    loadResults();
    alert('Đã xóa kết quả!');
}

// Xóa tất cả kết quả
function clearAllResults() {
    if (!confirm('⚠️ BẠN CÓ CHẮC MUỐN XÓA TẤT CẢ KẾT QUẢ?\n\nHành động này không thể hoàn tác!')) {
        return;
    }
    
    // Xác nhận lần 2 để đảm bảo
    if (!confirm('Xác nhận lần cuối: Xóa tất cả kết quả thi?')) {
        return;
    }
    
    localStorage.setItem('examResults', JSON.stringify([]));
    loadResults();
    alert('Đã xóa tất cả kết quả!');
}

// Tải file Excel
function downloadExcel() {
    const results = JSON.parse(localStorage.getItem('examResults') || '[]');
    
    if (results.length === 0) {
        alert('Không có kết quả nào để tải!');
        return;
    }
    
    // Chuẩn bị dữ liệu cho Excel
    const excelData = results.map((result, index) => {
        return {
            'STT': index + 1,
            'Họ và tên': result.studentName,
            'Mã đề thi': result.examCode,
            'Tên đề thi': result.examTitle || 'N/A',
            'Điểm': result.score,
            'Số câu đúng': result.correctCount || 'N/A',
            'Tổng số câu': result.totalQuestions || 'N/A',
            'Tỷ lệ (%)': result.totalQuestions ? ((result.correctCount / result.totalQuestions) * 100).toFixed(1) : 'N/A',
            'Chuyển tab': result.tabSwitch ? 'Có' : 'Không',
            'Thời gian nộp': new Date(result.submittedAt).toLocaleString('vi-VN')
        };
    });
    
    // Tạo worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Tự động điều chỉnh độ rộng cột
    const colWidths = [
        { wch: 5 },  // STT
        { wch: 25 }, // Họ và tên
        { wch: 12 }, // Mã đề thi
        { wch: 30 }, // Tên đề thi
        { wch: 8 },  // Điểm
        { wch: 12 }, // Số câu đúng
        { wch: 12 }, // Tổng số câu
        { wch: 10 }, // Tỷ lệ
        { wch: 12 }, // Chuyển tab
        { wch: 20 }  // Thời gian nộp
    ];
    ws['!cols'] = colWidths;
    
    // Tạo workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kết Quả Thi');
    
    // Tạo sheet thống kê
    const stats = calculateStatistics(results);
    const statsData = [
        { 'Chỉ số': 'Tổng số học sinh', 'Giá trị': stats.total },
        { 'Chỉ số': 'Điểm trung bình', 'Giá trị': stats.average },
        { 'Chỉ số': 'Điểm cao nhất', 'Giá trị': stats.max },
        { 'Chỉ số': 'Điểm thấp nhất', 'Giá trị': stats.min },
        { 'Chỉ số': 'Số HS đạt ≥ 8.0', 'Giá trị': stats.excellent },
        { 'Chỉ số': 'Số HS đạt ≥ 6.5', 'Giá trị': stats.good },
        { 'Chỉ số': 'Số HS đạt ≥ 5.0', 'Giá trị': stats.average_count },
        { 'Chỉ số': 'Số HS < 5.0', 'Giá trị': stats.below },
        { 'Chỉ số': 'Số HS chuyển tab', 'Giá trị': stats.tabSwitch }
    ];
    const wsStats = XLSX.utils.json_to_sheet(statsData);
    wsStats['!cols'] = [{ wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsStats, 'Thống Kê');
    
    // Tạo tên file với ngày giờ
    const now = new Date();
    const fileName = `KetQuaThi_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}.xlsx`;
    
    // Tải file
    XLSX.writeFile(wb, fileName);
    
    alert(`✅ Đã tải file Excel: ${fileName}`);
}

// Tính toán thống kê
function calculateStatistics(results) {
    const scores = results.map(r => r.score);
    const total = results.length;
    
    return {
        total: total,
        average: (scores.reduce((a, b) => a + b, 0) / total).toFixed(2),
        max: Math.max(...scores).toFixed(1),
        min: Math.min(...scores).toFixed(1),
        excellent: scores.filter(s => s >= 8.0).length,
        good: scores.filter(s => s >= 6.5).length,
        average_count: scores.filter(s => s >= 5.0).length,
        below: scores.filter(s => s < 5.0).length,
        tabSwitch: results.filter(r => r.tabSwitch).length
    };
}
