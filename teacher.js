// Teacher Firebase.js - Hỗ trợ nhiều máy thi cùng lúc

let db = null;
let currentExam = null;
let examResults = [];
let firebaseInitialized = false;
let resultsListener = null;

// Khởi tạo Firebase
function initializeFirebase(config) {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        db = firebase.database();
        firebaseInitialized = true;
        updateConnectionStatus(true);
        
        // Lắng nghe kết nối
        const connectedRef = db.ref('.info/connected');
        connectedRef.on('value', (snap) => {
            updateConnectionStatus(snap.val());
        });
        
        return true;
    } catch (error) {
        console.error('Lỗi khởi tạo Firebase:', error);
        alert('Lỗi kết nối Firebase: ' + error.message);
        return false;
    }
}

// Cập nhật trạng thái kết nối
function updateConnectionStatus(isConnected) {
    const statusEl = document.getElementById('connectionStatus');
    const onlineEl = document.getElementById('onlineIndicator');
    
    if (statusEl) {
        statusEl.textContent = isConnected ? '🟢 Đã kết nối Firebase' : '🔴 Mất kết nối';
        statusEl.className = 'status-badge ' + (isConnected ? 'online' : 'offline');
    }
    
    if (onlineEl) {
        onlineEl.textContent = isConnected ? '🟢 Online' : '🔴 Offline';
        onlineEl.className = 'online-badge ' + (isConnected ? 'online' : 'offline');
    }
}

// Lưu cấu hình Firebase
function saveFirebaseConfig() {
    const config = {
        apiKey: document.getElementById('apiKey').value.trim(),
        authDomain: document.getElementById('authDomain').value.trim(),
        projectId: document.getElementById('projectId').value.trim(),
        databaseURL: document.getElementById('databaseURL').value.trim()
    };
    
    if (!config.apiKey || !config.authDomain || !config.projectId || !config.databaseURL) {
        alert('Vui lòng điền đầy đủ thông tin Firebase!');
        return;
    }
    
    // Lưu config vào localStorage
    localStorage.setItem('firebaseConfig', JSON.stringify(config));
    
    // Khởi tạo Firebase
    if (initializeFirebase(config)) {
        document.getElementById('firebaseConfigSection').classList.add('hidden');
        document.getElementById('loginSection').classList.remove('hidden');
        alert('✅ Đã kết nối Firebase thành công!');
    }
}

// Bỏ qua Firebase, dùng localStorage
function skipFirebase() {
    firebaseInitialized = false;
    document.getElementById('firebaseConfigSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
    alert('⚠️ Chế độ Offline: Chỉ lưu trên máy này. Nhiều máy không thể thi cùng lúc.');
}

// Cấu hình lại Firebase
function reconfigFirebase() {
    localStorage.removeItem('firebaseConfig');
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('firebaseConfigSection').classList.remove('hidden');
}

// Đăng nhập giáo viên
function teacherLogin() {
    const teacherName = document.getElementById('teacherName').value.trim();
    
    const validTeachers = ['admin', 'giaovien', 'teacher', 'GV'];
    
    if (validTeachers.includes(teacherName) || teacherName.toLowerCase().includes('giáo viên')) {
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('createExamSection').classList.remove('hidden');
        localStorage.setItem('teacherName', teacherName);
        
        // Load danh sách đề thi và kết quả
        loadActiveExams();
        loadResults();
    } else {
        alert('Tên giáo viên không hợp lệ!');
    }
}

// Đăng xuất
function logout() {
    if (resultsListener) {
        resultsListener.off();
    }
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

// Lưu đề thi
async function saveExam() {
    if (!currentExam) {
        alert('Chưa có đề thi nào!');
        return;
    }
    
    const examCode = generateExamCode();
    
    const examData = {
        ...currentExam,
        code: examCode,
        createdAt: new Date().toISOString(),
        teacherName: localStorage.getItem('teacherName'),
        active: true
    };
    
    if (firebaseInitialized && db) {
        // Lưu vào Firebase
        try {
            await db.ref('exams/' + examCode).set(examData);
            alert('✅ Đã lưu đề thi lên Firebase!');
        } catch (error) {
            alert('Lỗi lưu Firebase: ' + error.message);
            return;
        }
    } else {
        // Lưu vào localStorage (fallback)
        const exams = JSON.parse(localStorage.getItem('exams') || '{}');
        exams[examCode] = examData;
        localStorage.setItem('exams', JSON.stringify(exams));
    }
    
    // Hiển thị mã
    document.getElementById('examCode').textContent = examCode;
    document.getElementById('examCodeSection').classList.remove('hidden');
    
    const studentUrl = window.location.href.replace('teacher-firebase.html', 'student-firebase.html');
    document.getElementById('studentLink').href = studentUrl;
    document.getElementById('studentLink').textContent = studentUrl;
    
    loadActiveExams();
}

// Tạo mã đề thi
function generateExamCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

// Copy mã
function copyCode() {
    const code = document.getElementById('examCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('Đã copy mã: ' + code);
    });
}

// Load các đề thi đang hoạt động
async function loadActiveExams() {
    const container = document.getElementById('activeExamsList');
    
    if (firebaseInitialized && db) {
        db.ref('exams').orderByChild('active').equalTo(true).once('value', (snapshot) => {
            const exams = snapshot.val() || {};
            displayActiveExams(exams, container);
        });
    } else {
        const exams = JSON.parse(localStorage.getItem('exams') || '{}');
        const activeExams = {};
        Object.keys(exams).forEach(code => {
            if (exams[code].active) {
                activeExams[code] = exams[code];
            }
        });
        displayActiveExams(activeExams, container);
    }
}

// Hiển thị đề thi
function displayActiveExams(exams, container) {
    if (Object.keys(exams).length === 0) {
        container.innerHTML = '<p class="hint">Chưa có đề thi nào đang hoạt động.</p>';
        return;
    }
    
    let html = '<table style="width:100%; border-collapse: collapse;">';
    html += '<thead><tr style="background:#f8f9fa;"><th style="padding:10px; border:1px solid #ddd;">Mã</th><th style="padding:10px; border:1px solid #ddd;">Tên đề</th><th style="padding:10px; border:1px solid #ddd;">Thời gian</th><th style="padding:10px; border:1px solid #ddd;">Số câu</th><th style="padding:10px; border:1px solid #ddd;">Thao tác</th></tr></thead><tbody>';
    
    Object.keys(exams).forEach(code => {
        const exam = exams[code];
        html += `<tr>
            <td style="padding:10px; border:1px solid #ddd;"><strong>${code}</strong></td>
            <td style="padding:10px; border:1px solid #ddd;">${exam.title}</td>
            <td style="padding:10px; border:1px solid #ddd;">${exam.duration} phút</td>
            <td style="padding:10px; border:1px solid #ddd;">${exam.questions.length} câu</td>
            <td style="padding:10px; border:1px solid #ddd;">
                <button onclick="deactivateExam('${code}')" class="btn-delete">Vô hiệu hóa</button>
            </td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Vô hiệu hóa đề thi
async function deactivateExam(code) {
    if (!confirm('Vô hiệu hóa đề thi này? Học sinh sẽ không thể truy cập nữa.')) {
        return;
    }
    
    if (firebaseInitialized && db) {
        await db.ref('exams/' + code + '/active').set(false);
    } else {
        const exams = JSON.parse(localStorage.getItem('exams') || '{}');
        if (exams[code]) {
            exams[code].active = false;
            localStorage.setItem('exams', JSON.stringify(exams));
        }
    }
    
    loadActiveExams();
    alert('Đã vô hiệu hóa đề thi!');
}

// Load kết quả
function loadResults() {
    if (firebaseInitialized && db) {
        // Realtime listener
        resultsListener = db.ref('results');
        resultsListener.on('value', (snapshot) => {
            const results = snapshot.val() || {};
            examResults = Object.values(results);
            displayResults();
        });
    } else {
        examResults = JSON.parse(localStorage.getItem('examResults') || '[]');
        displayResults();
        setInterval(() => {
            examResults = JSON.parse(localStorage.getItem('examResults') || '[]');
            displayResults();
        }, 5000);
    }
}

// Hiển thị kết quả
function displayResults() {
    const resultsList = document.getElementById('resultsList');
    
    if (examResults.length === 0) {
        resultsList.innerHTML = '<p class="hint">Chưa có kết quả thi nào.</p>';
        return;
    }
    
    let html = '<table style="width:100%; border-collapse: collapse;">';
    html += '<thead><tr style="background:#f8f9fa;"><th style="padding:10px; border:1px solid #ddd;">Họ tên</th><th style="padding:10px; border:1px solid #ddd;">Mã đề</th><th style="padding:10px; border:1px solid #ddd;">Điểm</th><th style="padding:10px; border:1px solid #ddd;">Thời gian</th><th style="padding:10px; border:1px solid #ddd;">Cảnh báo</th><th style="padding:10px; border:1px solid #ddd;">Thao tác</th></tr></thead><tbody>';
    
    examResults.forEach((result, index) => {
        html += `<tr>
            <td style="padding:10px; border:1px solid #ddd;">${result.studentName}</td>
            <td style="padding:10px; border:1px solid #ddd;">${result.examCode}</td>
            <td style="padding:10px; border:1px solid #ddd;"><strong>${result.score}/10</strong></td>
            <td style="padding:10px; border:1px solid #ddd;">${new Date(result.submittedAt).toLocaleString('vi-VN')}</td>
            <td style="padding:10px; border:1px solid #ddd;">${result.tabSwitch ? '⚠️ Có chuyển tab' : '✓ Bình thường'}</td>
            <td style="padding:10px; border:1px solid #ddd; text-align:center;">
                <button onclick="deleteResult('${result.id || index}')" class="btn-delete" title="Xóa">🗑️</button>
            </td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    resultsList.innerHTML = html;
}

// Xóa kết quả
async function deleteResult(id) {
    if (!confirm('Bạn có chắc muốn xóa kết quả này?')) {
        return;
    }
    
    if (firebaseInitialized && db) {
        await db.ref('results/' + id).remove();
    } else {
        examResults = examResults.filter((r, i) => (r.id || i) != id);
        localStorage.setItem('examResults', JSON.stringify(examResults));
        displayResults();
    }
    
    alert('Đã xóa kết quả!');
}

// Xóa tất cả kết quả
async function clearAllResults() {
    if (!confirm('⚠️ BẠN CÓ CHẮC MUỐN XÓA TẤT CẢ KẾT QUẢ?\n\nHành động này không thể hoàn tác!')) {
        return;
    }
    
    if (!confirm('Xác nhận lần cuối: Xóa tất cả kết quả thi?')) {
        return;
    }
    
    if (firebaseInitialized && db) {
        await db.ref('results').remove();
    } else {
        localStorage.setItem('examResults', JSON.stringify([]));
        examResults = [];
        displayResults();
    }
    
    alert('Đã xóa tất cả kết quả!');
}

// Làm mới kết quả
function refreshResults() {
    loadResults();
    alert('Đã làm mới kết quả!');
}

// Tải Excel
function downloadExcel() {
    if (examResults.length === 0) {
        alert('Không có kết quả nào để tải!');
        return;
    }
    
    const excelData = examResults.map((result, index) => {
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
    
    const ws = XLSX.utils.json_to_sheet(excelData);
    const colWidths = [
        { wch: 5 }, { wch: 25 }, { wch: 12 }, { wch: 30 }, { wch: 8 },
        { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 20 }
    ];
    ws['!cols'] = colWidths;
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kết Quả Thi');
    
    const stats = calculateStatistics(examResults);
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
    
    const now = new Date();
    const fileName = `KetQuaThi_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}.xlsx`;
    
    XLSX.writeFile(wb, fileName);
    alert(`✅ Đã tải file Excel: ${fileName}`);
}

// Tính thống kê
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

// Khởi tạo khi load trang
window.addEventListener('load', () => {
    // Kiểm tra Firebase config
    const savedConfig = localStorage.getItem('firebaseConfig');
    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        if (initializeFirebase(config)) {
            document.getElementById('firebaseConfigSection').classList.add('hidden');
            
            // Kiểm tra login
            const teacherName = localStorage.getItem('teacherName');
            if (teacherName) {
                document.getElementById('loginSection').classList.add('hidden');
                document.getElementById('createExamSection').classList.remove('hidden');
                loadActiveExams();
                loadResults();
            } else {
                document.getElementById('loginSection').classList.remove('hidden');
            }
        }
    }
});
