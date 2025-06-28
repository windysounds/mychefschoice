document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 데이터베이스 ---
    // 질문 데이터 (확장 가능)
    const allQuestions = [
        { id: 'q1', text: '오늘 메뉴를 고민한 진짜 이유는?', options: [
            { text: '배가 덜 고파서', tags: ['#가벼운', '#간단한'] },
            { text: '배가 너무 고파서', tags: ['#든든한', '#푸짐한', '#고기'] },
            { text: '그냥 귀찮아서', tags: ['#배달', '#간편식'] }
        ]},
        { id: 'q2', text: '지금 기분을 색깔로 표현한다면?', options: [
            { text: '파랑 (차분, 우울)', tags: ['#따뜻한', '#국물', '#위로'] },
            { text: '빨강 (열정, 스트레스)', tags: ['#매운', '#자극적인', '#에너지'] },
            { text: '하양 (평온, 무난함)', tags: ['#담백한', '#깔끔한', '#기본'] }
        ]},
        { id: 'q3', text: '다음 중 가장 익숙한 것은?', options: [
            { text: '빵', tags: ['#서양식', '#밀가루'] },
            { text: '밥', tags: ['#한식', '#아시안', '#쌀'] },
            { text: '면', tags: ['#면요리', '#글로벌'] }
        ]},
        // ... 여기에 7개의 질문을 더 추가할 수 있습니다.
        { id: 'q4', text: '선호하는 식감은?', options: [
            { text: '아삭아삭', tags: ['#채소', '#신선한'] },
            { text: '쫄깃쫄깃', tags: ['#면요리', '#떡'] },
            { text: '부드러움', tags: ['#국물', '#크림'] }
        ]}
    ];

    // 음식 데이터 (태그 기반)
    const foodDB = [
        { name: '제육볶음', description: '매콤달콤한 돼지고기로 스트레스를 날려버리세요!', tags: ['#한식', '#고기', '#매운', '#든든한', '#쌀'] },
        { name: '크림 파스타', description: '부드러운 크림 소스가 당신의 마음을 감싸줄 거예요.', tags: ['#서양식', '#면요리', '#부드러움', '#따뜻한'] },
        { name: '마라탕', description: '얼얼한 마라의 맛으로 정신이 번쩍 들게!', tags: ['#아시안', '#국물', '#매운', '#자극적인', '#에너지'] },
        { name: '치킨 샐러드', description: '가볍지만 든든하게, 상큼한 하루를 원한다면.', tags: ['#가벼운', '#신선한', '#채소', '#간단한'] },
        { name: '돈까스', description: '바삭함의 대명사! 남녀노소 모두의 사랑.', tags: ['#글로벌', '#고기', '#든든한', '#기본'] },
        { name: '잔치국수', description: '따뜻한 멸치육수가 마음까지 채워주는 맛.', tags: ['#한식', '#국물', '#면요리', '#따뜻한', '#가벼운'] }
        // ... 여기에 수십, 수백 개의 음식 데이터를 추가
    ];

    // --- 2. 요소 선택 ---
    const questionContainer = document.getElementById('question-container');
    const getResultBtn = document.getElementById('get-result-btn');
    const mainContent = document.getElementById('main-content');
    const resultContainer = document.getElementById('result-container');
    const foodNameEl = document.getElementById('food-name');
    const foodDescEl = document.getElementById('food-description');
    const retryBtn = document.getElementById('retry-btn');
    
    let selectedQuestions = [];
    let userTags = {};

    // --- 3. 핵심 함수 ---
    
    // 3-1. 랜덤 질문 3개 표시
    function displayRandomQuestions() {
        // 기존 내용 초기화
        questionContainer.innerHTML = '';
        userTags = {};
        mainContent.classList.remove('hidden');
        resultContainer.classList.add('hidden');

        // 질문 섞어서 3개 선택
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        selectedQuestions = shuffled.slice(0, 3);

        // HTML로 질문 생성
        selectedQuestions.forEach(q => {
            const questionBox = document.createElement('div');
            questionBox.className = 'question-box';
            
            let optionsHTML = '';
            q.options.forEach((opt, index) => {
                optionsHTML += `<button data-qid="${q.id}" data-tags="${opt.tags.join(',')}">${opt.text}</button>`;
            });

            questionBox.innerHTML = `
                <h3>${q.text}</h3>
                <div class="options" id="${q.id}">
                    ${optionsHTML}
                </div>
            `;
            questionContainer.appendChild(questionBox);
        });

        // 각 옵션 버튼에 클릭 이벤트 추가
        document.querySelectorAll('.options button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const qid = e.target.dataset.qid;
                // 같은 질문의 다른 버튼 선택 해제
                document.querySelectorAll(`#${qid} button`).forEach(b => b.classList.remove('selected'));
                // 현재 버튼 선택
                e.target.classList.add('selected');
            });
        });
    }

    // 3-2. 결과 계산 및 표시
    function getRecommendation() {
        // 1. 선택된 답변들로부터 태그 수집
        const finalTags = [];
        const selectedButtons = document.querySelectorAll('.options button.selected');

        if (selectedButtons.length < 3) {
            alert('모든 질문에 답변해주세요!');
            return;
        }

        selectedButtons.forEach(btn => {
            const tags = btn.dataset.tags.split(',');
            finalTags.push(...tags);
        });

        // 2. 태그 점수 계산
        let bestMatch = { food: null, score: -1 };
        foodDB.forEach(food => {
            let currentScore = 0;
            food.tags.forEach(foodTag => {
                if (finalTags.includes(foodTag)) {
                    currentScore++;
                }
            });

            if (currentScore > bestMatch.score) {
                bestMatch = { food, score: currentScore };
            }
        });

        // 3. 결과 표시
        mainContent.classList.add('hidden');
        resultContainer.classList.remove('hidden');

        if (bestMatch.food) {
            foodNameEl.textContent = bestMatch.food.name;
            foodDescEl.textContent = bestMatch.food.description;
        } else {
            foodNameEl.textContent = '이런...';
            foodDescEl.textContent = '셰프님이 오늘은 마땅한 메뉴를 찾지 못하셨습니다. 다시 시도해보세요!';
        }
    }

    // --- 4. 이벤트 리스너 연결 ---
    getResultBtn.addEventListener('click', getRecommendation);
    retryBtn.addEventListener('click', displayRandomQuestions);

    // --- 5. 앱 시작 ---
    displayRandomQuestions();

});
