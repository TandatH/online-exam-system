// Student.js - Quản lý giao diện học sinh

let currentExam = null;
let studentName = '';
let examCode = '';
let startTime = null;
let timerInterval = null;
let studentAnswers = {};
let tabSwitchDetected = false;
let examSubmitted = false;

// Đăng nhập học sinh
function studentLogin() {
    const nameInput = document.getElementById('studentName').value.trim();
    const codeInput = document.getElementById('examCodeInput').value.trim().toUpperCase();
    
    if (!nameInput) {
        alert('Vui lòng nhập họ tên!');
        return;
    }
    
    if (!codeInput) {
        alert('Vui lòng nhập mã đề thi!');
        return;
    }
    
    // Lấy đề thi từ localStorage
    const exams = JSON.parse(localStorage.getItem('exams') || '{}');
    
    if (!exams[codeInput]) {
        alert('Mã đề thi không hợp lệ!');
        return;
    }
    
    studentName = nameInput;
    examCode = codeInput;
    currentExam = exams[codeInput];
    
    // Hiển thị màn hình chờ
    document.getElementById('studentLoginSection').classList.add('hidden');
    document.getElementById('waitingSection').classList.remove('hidden');
    
    // Hiển thị thông tin đề thi
    document.getElementById('welcomeMessage').textContent = `Chào ${studentName}!`;
    document.getElementById('examTitleDisplay').textContent = currentExam.title;
    document.getElementById('examDurationDisplay').textContent = currentExam.duration;
    document.getElementById('questionCountDisplay').textContent = currentExam.questions.length;
}

// Bắt đầu làm bài
function startExam() {
    document.getElementById('waitingSection').classList.add('hidden');
    document.getElementById('examSection').classList.remove('hidden');
    
    // Hiển thị tiêu đề
    document.getElementById('examTitle').textContent = currentExam.title;
    
    // Khởi tạo đáp án
    studentAnswers = {};
    
    // Hiển thị câu hỏi
    displayQuestions();
    
    // Bắt đầu đếm ngược
    startTimer();
    
    // Theo dõi chuyển tab
    setupTabSwitchDetection();
    
    // Hiển thị cảnh báo
    document.getElementById('warningMessage').classList.remove('hidden');
}

// Hiển thị câu hỏi
function displayQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    
    currentExam.questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-container';
        
        let html = `
            <div class="question-number">Câu ${index + 1}</div>
            <div class="question-content">${q.question}</div>
            <div class="choices">
        `;
        
        q.choices.forEach((choice, i) => {
            const choiceId = `q${index}_c${i}`;
            html += `
                <label class="choice-label">
                    <input type="radio" name="question${index}" value="${i}" id="${choiceId}" onchange="saveAnswer(${index}, ${i})">
                    <span>${String.fromCharCode(65 + i)}. ${choice}</span>
                </label>
            `;
        });
        
        html += '</div>';
        questionDiv.innerHTML = html;
        container.appendChild(questionDiv);
    });
}

// Lưu đáp án
function saveAnswer(questionIndex, choiceIndex) {
    studentAnswers[questionIndex] = choiceIndex;
}

// Bắt đầu đồng hồ đếm ngược
function startTimer() {
    startTime = Date.now();
    const duration = currentExam.duration * 60; // Chuyển sang giây
    let remainingTime = duration;
    
    timerInterval = setInterval(() => {
        remainingTime--;
        
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        
        const timerElement = document.getElementById('timer');
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Cảnh báo khi còn 5 phút
        if (remainingTime <= 300 && remainingTime > 0) {
            timerElement.classList.add('warning');
        }
        
        // Hết giờ
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            submitExam(true); // Tự động nộp bài
        }
    }, 1000);
}

// Theo dõi chuyển tab
function setupTabSwitchDetection() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !examSubmitted) {
            tabSwitchDetected = true;
            
            // Tự động nộp bài khi chuyển tab
            alert('⚠️ Bạn đã chuyển tab! Bài thi sẽ được nộp tự động.');
            submitExam(true);
        }
    });
}

// Nộp bài thi
function submitExam(autoSubmit = false) {
    if (examSubmitted) return;
    
    examSubmitted = true;
    
    // Dừng đồng hồ
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Tính điểm
    let correctCount = 0;
    const totalQuestions = currentExam.questions.length;
    
    currentExam.questions.forEach((q, index) => {
        if (studentAnswers[index] === q.correctAnswer) {
            correctCount++;
        }
    });
    
    const score = ((correctCount / totalQuestions) * 10).toFixed(1);
    
    // Ẩn phần thi
    document.getElementById('examSection').classList.add('hidden');
    
    // Hiển thị kết quả
    displayResult(correctCount, totalQuestions, score, autoSubmit);
    
    // Lưu kết quả vào localStorage
    saveResult(correctCount, totalQuestions, score);
    
    // Gửi lên Google Sheets (nếu có)
    sendToGoogleSheets(correctCount, totalQuestions, score);
}

// Hiển thị kết quả
function displayResult(correctCount, totalQuestions, score, autoSubmit) {
    document.getElementById('resultSection').classList.remove('hidden');
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('resultName').textContent = studentName;
    document.getElementById('correctAnswers').textContent = correctCount;
    document.getElementById('totalQuestions').textContent = totalQuestions;
    
    let statusMessage = autoSubmit ? 
        (tabSwitchDetected ? '⚠️ Bài thi đã được nộp tự động do chuyển tab!' : '⏰ Bài thi đã được nộp tự động do hết giờ!') :
        '✓ Bài thi đã được nộp thành công!';
    
    document.getElementById('submissionStatus').textContent = statusMessage;
    
    // Hiển thị chi tiết từng câu
    displayDetailedResults();
}

// Hiển thị chi tiết kết quả
function displayDetailedResults() {
    const container = document.getElementById('detailedResults');
    container.innerHTML = '<h3>Chi Tiết Các Câu:</h3>';
    
    currentExam.questions.forEach((q, index) => {
        const studentChoice = studentAnswers[index];
        const correctChoice = q.correctAnswer;
        const isCorrect = studentChoice === correctChoice;
        
        const resultDiv = document.createElement('div');
        resultDiv.className = `result-question ${isCorrect ? 'correct' : 'incorrect'}`;
        
        let html = `
            <div class="question-text">Câu ${index + 1}: ${q.question}</div>
            <div class="answer-info">
        `;
        
        if (studentChoice !== undefined) {
            html += `Bạn chọn: <span class="${isCorrect ? 'correct-answer' : 'wrong-answer'}">${String.fromCharCode(65 + studentChoice)}. ${q.choices[studentChoice]}</span><br>`;
        } else {
            html += `Bạn chọn: <span class="wrong-answer">Không trả lời</span><br>`;
        }
        
        if (!isCorrect) {
            html += `Đáp án đúng: <span class="correct-answer">${String.fromCharCode(65 + correctChoice)}. ${q.choices[correctChoice]}</span>`;
        }
        
        html += '</div>';
        resultDiv.innerHTML = html;
        container.appendChild(resultDiv);
    });
}

// Lưu kết quả vào localStorage
function saveResult(correctCount, totalQuestions, score) {
    const results = JSON.parse(localStorage.getItem('examResults') || '[]');
    
    const result = {
        studentName: studentName,
        examCode: examCode,
        examTitle: currentExam.title,
        score: parseFloat(score),
        correctCount: correctCount,
        totalQuestions: totalQuestions,
        answers: studentAnswers,
        tabSwitch: tabSwitchDetected,
        submittedAt: new Date().toISOString()
    };
    
    results.push(result);
    localStorage.setItem('examResults', JSON.stringify(results));
}

// Gửi kết quả lên Google Sheets
async function sendToGoogleSheets(correctCount, totalQuestions, score) {
    // Lấy URL Google Sheets từ localStorage (giáo viên đã cài đặt)
    const sheetsUrl = localStorage.getItem('sheetsUrl');
    
    if (!sheetsUrl) {
        console.log('Chưa cấu hình Google Sheets URL');
        return;
    }
    
    const data = {
        studentName: studentName,
        examCode: examCode,
        examTitle: currentExam.title,
        score: score,
        correctCount: correctCount,
        totalQuestions: totalQuestions,
        tabSwitch: tabSwitchDetected ? 'Có' : 'Không',
        submittedAt: new Date().toLocaleString('vi-VN'),
        timestamp: new Date().getTime()
    };
    
    try {
        const response = await fetch(sheetsUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('Đã gửi kết quả lên Google Sheets');
    } catch (error) {
        console.error('Lỗi khi gửi lên Google Sheets:', error);
    }
}

// Khởi tạo khi trang load
window.addEventListener('load', () => {
    // Ngăn không cho quay lại nếu đã nộp bài
    window.addEventListener('beforeunload', (e) => {
        if (!examSubmitted && startTime) {
            e.preventDefault();
            e.returnValue = 'Bạn có chắc muốn rời khỏi trang? Bài thi chưa được nộp!';
        }
    });
});
