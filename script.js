document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 데이터베이스 ---
    const allQuestions = [
        { id: 'q_reason', text: '오늘 메뉴를 고민하는 진짜 이유는?', options: [
            { text: '가볍게 먹고 싶어서', tags: ['#가벼운', '#건강한'] },
            { text: '든든하게 먹고 싶어서', tags: ['#든든한', '#푸짐한'] },
            { text: '만들기 귀찮아서', tags: ['#간편한', '#배달'] }
        ]},
        { id: 'q_staple', text: '가장 익숙한 주식은 무엇인가요?', options: [
            { text: '빵', tags: ['#빵', '#서양식'] },
            { text: '면', tags: ['#면요리'] },
            { text: '밥', tags: ['#밥', '#한식', '#아시안'] }
        ]},
        { id: 'q_hunger', text: '지금 허기진 정도는 어떤가요?', options: [
            { text: '배가 너무 고파요', tags: ['#푸짐한'] },
            { text: '그냥 밥 먹을 때라서', tags: ['#적당한'] },
            { text: '눈앞에 음식이 떠다녀요', tags: ['#기분전환'] }
        ]},
        { id: 'q_yesterday', text: '어제 저녁 식사는 어땠나요?', options: [
            { text: '과하게 먹었어요', tags: ['#가벼운', '#샐러드'] },
            { text: '건강하지 못했어요', tags: ['#건강한', '#집밥'] },
            { text: '다이어트식이었어요', tags: ['#보상', '#든든한'] }
        ]},
        { id: 'q_sports', text: '지금 떠오르는 스포츠는?', isDynamic: true, options: [
            { text: '축구', tags: ['#에너지'] }, { text: '야구', tags: ['#여유'] }, 
            { text: '농구', tags: ['#활기찬'] }, { text: '핸드볼', tags: ['#팀워크'] },
            { text: '배구', tags: ['#높이'] }, { text: '탁구', tags: ['#집중'] },
            { text: '배드민턴', tags: ['#가벼운'] }, { text: '테니스', tags: ['#파워'] }
        ]},
        { id: 'q_drink', text: '식후에 마시고 싶은 것은?', isDynamic: true, options: [
            { text: '커피', tags: ['#집중', '#여유'] }, { text: '차(Tea)', tags: ['#차분한', '#따뜻한'] },
            { text: '시원한 물', tags: ['#상쾌한'] }, { text: '뜨거운 물', tags: ['#따뜻한'] },
            { text: '탄산음료', tags: ['#짜릿한', '#기분전환'] }, { text: '에너지 드링크', tags: ['#에너지', '#파워'] }
        ]},
        { id: 'q_weather', text: '지금 날씨는 어떤가요?', options: [
            { text: '흐림', tags: ['#따뜻한', '#국물'] },
            { text: '맑음', tags: ['#상쾌한', '#가벼운'] },
            { text: '비 혹은 눈', tags: ['#따뜻한', '#배달', '#집밥'] }
        ]},
        { id: 'q_color', text: '마음에 드는 색깔을 하나 골라보세요.', isColor: true, options: [
            { text: '빨강' }, { text: '주황' }, { text: '노랑' }, { text: '초록' }, { text: '파랑' }, 
            { text: '남색' }, { text: '보라' }, { text: '분홍' }, { text: '검정' }, { text: '하양' }
        ]}
    ];

    const foodDB = [
        { name: '스시', description: '넌 지금 와사비가 필요해.', tags: ['#밥', '#아시안', '#상쾌한', '#집중'] },
        { name: '갈비', description: '달콤하고 진한 맛을 느껴봐.', tags: ['#밥', '#한식', '#푸짐한', '#보상', '#팀워크'] },
        { name: '빵 (베이커리)', description: '빵 하나면 충분해. 그래야 내일 고민 안 할 거야.', tags: ['#빵', '#서양식', '#가벼운', '#여유'] },
        { name: '샌드위치', description: '가장 맛있는 조합은 네 입이 알고 있어.', tags: ['#빵', '#건강한', '#가벼운', '#적당한'] },
        { name: '치킨', description: '언제나 옳아. 바삭한 튀김을 느껴봐.', tags: ['#배달', '#푸짐한', '#보상', '#짜릿한', '#에너지'] },
        { name: '김밥', description: '널 위한 선물 세트야. 야채를 챙겨야 할 때가 됐지?', tags: ['#밥', '#한식', '#간편한', '#건강한'] },
        { name: '파스타', description: '면이 주는 위로를 느껴봐.', tags: ['#면요리', '#서양식', '#기분전환', '#따뜻한'] },
        { name: '피자', description: '다 함께 즐기는 최고의 선택!', tags: ['#빵', '#서양식', '#팀워크', '#푸짐한', '#배달'] },
        { name: '라면', description: '세상에서 가장 완벽한 국물 요리 중 하나.', tags: ['#면요리', '#국물', '#간편한', '#짜릿한'] }
    ];

    // --- 2. 요소 선택 ---
    const mainContent = document.getElementById('main-content');
    const introScreen = document.querySelector('.intro');
    const startBtn = document.getElementById('start-btn');
    const questionArea = document.getElementById('question-area');
    const resultContainer = document.getElementById('result-container');
    const chefImageEl = document.getElementById('chef-image');
    const foodNameEl = document.getElementById('food-name');
    const foodDescEl = document.getElementById('food-description');
    const retryBtn = document.getElementById('retry-btn');
    const disclaimer = document.querySelector('.disclaimer'); // 하단 문구 요소

    // --- 3. 상태 변수 ---
    let selectedQuestions = [];
    let currentQuestionIndex = 0;
    let userTags = [];

    // --- 4. 함수 ---

    function showScreen(screen) {
        // 모든 화면 숨기기
        introScreen.classList.add('hidden');
        questionArea.classList.add('hidden');
        resultContainer.classList.add('hidden');
        disclaimer.classList.add('hidden');
        mainContent.classList.add('hidden');

        // 요청된 화면만 보여주기
        if (screen === 'intro') {
            introScreen.classList.remove('hidden');
            mainContent.classList.remove('hidden');
        } else if (screen === 'question') {
            questionArea.classList.remove('hidden');
            mainContent.classList.remove('hidden');
        } else if (screen === 'result') {
            resultContainer.classList.remove('hidden');
            disclaimer.classList.remove('hidden'); // 결과 화면에서만 문구 표시
        }
    }

    function startGame() {
        showScreen('question');
        currentQuestionIndex = 0;
        userTags = [];
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        selectedQuestions = shuffled.slice(0, 3);
        displayQuestion();
    }

    function displayQuestion() {
        const question = selectedQuestions[currentQuestionIndex];
        let currentOptions = question.options;

        if (question.isDynamic || question.isColor) {
            const shuffledOptions = [...question.options].sort(() => 0.5 - Math.random());
            currentOptions = shuffledOptions.slice(0, 3); // 3개의 랜덤 선택지
        }
        
        let optionsHTML = '';
        currentOptions.forEach(opt => {
            const tags = opt.tags ? opt.tags.join(',') : '';
            optionsHTML += `<button class="option-btn" data-tags="${tags}">${opt.text}</button>`;
        });

        questionArea.innerHTML = `
            <div class="question-box">
                <h3>${question.text}</h3>
                <div class="options">
                    ${optionsHTML}
                </div>
            </div>
        `;

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', handleOptionClick);
        });
    }
    
    function handleOptionClick(e) {
        const tags = e.target.dataset.tags.split(',');
        if (tags[0] !== '') {
            userTags.push(...tags);
        }
        
        currentQuestionIndex++;
        
        if (currentQuestionIndex < selectedQuestions.length) {
            displayQuestion();
        } else {
            getRecommendation();
        }
    }

    function getRecommendation() {
        showScreen('result');
        let bestMatch = { food: null, score: -1 };
        
        foodDB.forEach(food => {
            const uniqueUserTags = [...new Set(userTags)];
            let currentScore = 0;
            
            food.tags.forEach(foodTag => {
                if (uniqueUserTags.includes(foodTag)) {
                    currentScore++;
                }
            });

            if (currentScore > bestMatch.score) {
                bestMatch = { food, score: currentScore };
            } else if (currentScore === bestMatch.score && Math.random() < 0.5) {
                bestMatch = { food, score: currentScore };
            }
        });
        
        chefImageEl.src = 'chef-result.png';

        if (bestMatch.food) {
            foodNameEl.textContent = bestMatch.food.name;
            foodDescEl.textContent = bestMatch.food.description;
        } else {
            foodNameEl.textContent = '이런...';
            foodDescEl.textContent = '오늘은 마땅한 메뉴를 찾지 못했군요. 다시 시도해보시죠.';
        }
    }
    
    function initializePage() {
        const introChefImage = document.createElement('img');
        introChefImage.src = 'chef-intro.png';
        introChefImage.alt = '근엄한 셰프';
        introChefImage.className = 'chef-image';
        introScreen.prepend(introChefImage);
    }

    // --- 5. 이벤트 리스너 연결 ---
    startBtn.addEventListener('click', startGame);
    retryBtn.addEventListener('click', startGame);

    // --- 6. 앱 시작 ---
    initializePage();
    showScreen('intro');
});
