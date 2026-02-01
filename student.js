// Student Firebase.js - Hỗ trợ nhiều máy thi cùng lúc

let db = null;
let currentExam = null;
let studentName = '';
let examCode = '';
let startTime = null;
let timerInterval = null;
let studentAnswers = {};
let tabSwitchDetected = false;
let examSubmitted = false;
let resultId = null;

// Khởi tạo Firebase tự động
function initializeFirebase() {
    const savedConfig = localStorage.getItem('firebaseConfig');
    
    if (savedConfig) {
        try {
            const config = JSON.parse(savedConfig);
            if (!firebase.apps.length) {
                firebase.initializeApp(config);
            }
            db = firebase.database();
            updateConnectionStatus(true);
            
            // Monitor connection
            const connectedRef = db.ref('.info/connected');
            connectedRef.on('value', (snap) => {
                updateConnectionStatus(snap.val());
            });
            
            return true;
        } catch (error) {
            console.error('Lỗi Firebase:', error);
            return false;
        }
    }
    
    return false;
}

// Cập nhật trạng thái kết nối
function updateConnectionStatus(isConnected) {
    const statusEl = document.getElementById('connectionStatus');
    if (statusEl) {
        statusEl.textContent = isConnected ? '🟢 Đã kết nối' : '🔴 Mất kết nối';
        statusEl.className = 'status-badge ' + (isConnected ? 'online' : 'offline');
    }
}

// Đăng nhập học sinh
async function studentLogin() {
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
    
    studentName = nameInput;
    examCode = codeInput;
    
    // Lấy đề thi từ Firebase hoặc localStorage
    if (db) {
        try {
            const snapshot = await db.ref('exams/' + codeInput).once('value');
            const exam = snapshot.val();
            
            if (!exam) {
                alert('Mã đề thi không hợp lệ!');
                return;
            }
            
            if (!exam.active) {
                alert('Đề thi này đã bị vô hiệu hóa!');
                return;
            }
            
            currentExam = exam;
            showWaitingScreen();
            
        } catch (error) {
            alert('Lỗi kết nối: ' + error.message);
        }
    } else {
        // Fallback: localStorage
        const exams = JSON.parse(localStorage.getItem('exams') || '{}');
        
        if (!exams[codeInput]) {
            alert('Mã đề thi không hợp lệ hoặc chưa được tạo!');
            return;
        }
        
        currentExam = exams[codeInput];
        showWaitingScreen();
    }
}

// Hiển thị màn hình chờ
function showWaitingScreen() {
    document.getElementById('studentLoginSection').classList.add('hidden');
    document.getElementById('waitingSection').classList.remove('hidden');
    
    document.getElementById('welcomeMessage').textContent = `Chào ${studentName}!`;
    document.getElementById('examTitleDisplay').textContent = currentExam.title;
    document.getElementById('examDurationDisplay').textContent = currentExam.duration;
    document.getElementById('questionCountDisplay').textContent = currentExam.questions.length;
}

// Bắt đầu làm bài
function startExam() {
    document.getElementById('waitingSection').classList.add('hidden');
    document.getElementById('examSection').classList.remove('hidden');
    
    document.getElementById('examTitle').textContent = currentExam.title;
    
    studentAnswers = {};
    displayQuestions();
    startTimer();
    setupTabSwitchDetection();
    
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

// Bắt đầu đồng hồ
function startTimer() {
    startTime = Date.now();
    const duration = currentExam.duration * 60;
    let remainingTime = duration;
    
    timerInterval = setInterval(() => {
        remainingTime--;
        
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        
        const timerElement = document.getElementById('timer');
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (remainingTime <= 300 && remainingTime > 0) {
            timerElement.classList.add('warning');
        }
        
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            submitExam(true);
        }
    }, 1000);
}

// Theo dõi chuyển tab
function setupTabSwitchDetection() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !examSubmitted) {
            tabSwitchDetected = true;
            alert('⚠️ Bạn đã chuyển tab! Bài thi sẽ được nộp tự động.');
            submitExam(true);
        }
    });
}

// Nộp bài thi
function submitExam(autoSubmit = false) {
    if (examSubmitted) return;
    
    examSubmitted = true;
    
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
    
    document.getElementById('examSection').classList.add('hidden');
    displayResult(correctCount, totalQuestions, score, autoSubmit);
    
    // Lưu kết quả
    saveResult(correctCount, totalQuestions, score);
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
    
    displayDetailedResults();
}

// Hiển thị chi tiết
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

// Lưu kết quả
async function saveResult(correctCount, totalQuestions, score) {
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
    
    if (db) {
        // Lưu vào Firebase
        try {
            const newResultRef = db.ref('results').push();
            resultId = newResultRef.key;
            result.id = resultId;
            await newResultRef.set(result);
            console.log('Đã lưu kết quả lên Firebase');
        } catch (error) {
            console.error('Lỗi lưu Firebase:', error);
            // Fallback: localStorage
            saveToLocalStorage(result);
        }
    } else {
        // Lưu vào localStorage
        saveToLocalStorage(result);
    }
}

// Lưu vào localStorage (fallback)
function saveToLocalStorage(result) {
    const results = JSON.parse(localStorage.getItem('examResults') || '[]');
    results.push(result);
    localStorage.setItem('examResults', JSON.stringify(results));
}

// Khởi tạo khi load
window.addEventListener('load', () => {
    // Tự động kết nối Firebase nếu có config
    initializeFirebase();
    
    // Ngăn reload
    window.addEventListener('beforeunload', (e) => {
        if (!examSubmitted && startTime) {
            e.preventDefault();
            e.returnValue = 'Bạn có chắc muốn rời khỏi trang? Bài thi chưa được nộp!';
        }
    });
});
