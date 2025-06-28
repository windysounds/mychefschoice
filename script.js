document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 데이터베이스 (질문 풀 확장 및 음식 추가) ---
    const allQuestions = [
        { id: 'q_reason', text: '오늘 메뉴를 고민하는 진짜 이유는?', options: [
            { text: '가볍게 먹고 싶어서', tags: ['#가벼운', '#건강한'] },
            { text: '든든하게 먹고 싶어서', tags: ['#든든한', '#푸짐한'] },
            { text: '만들기 귀찮아서', tags: ['#간편한', '#배달'] }
        ]},
        { id: 'q_staple', text: '가장 익숙한 주식은 무엇인가요?', options: [
            { text: '빵', tags: ['#서양식', '#빵'] },
            { text: '면', tags: ['#면요리', '#글로벌'] },
            { text: '밥', tags: ['#한식', '#아시안', '#밥'] }
        ]},
        { id: 'q_hunger', text: '지금 허기진 정도는 어떤가요?', options: [
            { text: '배가 너무 고파요', tags: ['#든든한', '#푸짐한'] },
            { text: '그냥 밥 먹을 때라서', tags: ['#적당한', '#평범한'] },
            { text: '눈앞에 음식이 떠다녀요', tags: ['#특이한', '#기분전환'] }
        ]},
        { id: 'q_yesterday', text: '어제 저녁 식사는 어땠나요?', options: [
            { text: '과하게 먹었어요', tags: ['#가벼운', '#샐러드'] },
            { text: '건강하지 못했어요', tags: ['#건강한', '#집밥'] },
            { text: '다이어트식이었어요', tags: ['#든든한', '#보상'] }
        ]},
        { id: 'q_location', text: '지금 어디에 계신가요?', options: [
            { text: '집', tags: ['#집밥', '#배달'] },
            { text: '밖', tags: ['#외식'] },
            { text: '회사/학교', tags: ['#간편한', '#가성비'] }
        ]},
        { id: 'q_color', text: '마음에 드는 색깔을 하나 골라보세요.', isColor: true, // 색깔 질문을 위한 특별 속성
          options: [
            { text: '빨강' }, { text: '주황' }, { text: '노랑' }, { text: '초록' },
            { text: '파랑' }, { text: '남색' }, { text: '보라' }, { text: '분홍' },
            { text: '검정' }, { text: '하양' }, { text: '회색' }, { text: '금색' }
        ]}
    ];

    const foodDB = [
        { name: '김치찌개와 계란말이', description: '집밥의 정석. 따뜻하고 든든하게 속을 채워줍니다.', tags: ['#집밥', '#한식', '#든든한', '#밥'] },
        { name: '크림 리조또', description: '부드러운 쌀과 크림의 조화. 특별한 기분전환이 될 거예요.', tags: ['#서양식', '#밥', '#기분전환', '#보상']},
        { name: '따끈한 쌀국수', description: '담백한 국물이 당신을 위로해줄 겁니다.', tags: ['#외식', '#아시안', '#면요리', '#가벼운'] },
        { name: '수제버거와 감자튀김', description: '활기찬 에너지가 필요할 땐, 역시 이거죠!', tags: ['#외식', '#서양식', '#빵', '#푸짐한', '#보상'] },
        { name: '편의점 도시락 세트', description: '빠르고 간편하게, 하지만 알차게 즐기는 한 끼.', tags: ['#간편한', '#가성비', '#평범한'] },
        { name: '간장계란밥', description: '요리하기 귀찮을 때, 5분이면 완성되는 최고의 선택.', tags: ['#집밥', '#한식', '#밥', '#간편한'] },
        { name: '콥 샐러드', description: '어제 과식했다면 오늘은 가볍고 건강하게!', tags: ['#가벼운', '#건강한', '#샐러드', '#외식'] },
        { name: '매콤한 마라샹궈', description: '눈앞에 음식이 아른거린다면? 이 강력한 맛으로 해결!', tags: ['#특이한', '#기분전환', '#외식', '#아시안']}
    ];

    // --- 2. 요소 선택 (변경 없음) ---
    const mainContent = document.getElementById('main-content');
    const introScreen = document.querySelector('.intro');
    const startBtn = document.getElementById('start-btn');
    const questionArea = document.getElementById('question-area');
    const resultContainer = document.getElementById('result-container');
    const chefImageEl = document.getElementById('chef-image');
    const foodNameEl = document.getElementById('food-name');
    const foodDescEl = document.getElementById('food-description');
    const retryBtn = document.getElementById('retry-btn');

    // --- 3. 상태 변수 (변경 없음) ---
    let selectedQuestions = [];
    let currentQuestionIndex = 0;
    let userTags = [];

    // --- 4. 함수 ---

    // 게임 시작
    function startGame() {
        introScreen.classList.add('hidden');
        questionArea.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        mainContent.classList.remove('hidden');

        currentQuestionIndex = 0;
        userTags = [];
        
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        selectedQuestions = shuffled.slice(0, 3);
        
        displayQuestion();
    }

    // 질문 표시 (색깔 질문 로직 추가)
    function displayQuestion() {
        const question = selectedQuestions[currentQuestionIndex];
        let currentOptions = question.options;

        // ★★★★★ 색깔 질문 특별 처리 ★★★★★
        if (question.isColor) {
            const shuffledColors = [...question.options].sort(() => 0.5 - Math.random());
            currentOptions = shuffledColors.slice(0, 4); // 4개의 랜덤 색상 보여주기
        }
        
        let optionsHTML = '';
        currentOptions.forEach(opt => {
            // 태그가 없는 경우(색깔 질문)를 대비해 기본값 설정
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
    
    // 옵션 선택 처리 (변경 없음)
    function handleOptionClick(e) {
        const tags = e.target.dataset.tags.split(',');
        if (tags[0] !== '') { // 빈 태그는 추가하지 않음
            userTags.push(...tags);
        }
        
        currentQuestionIndex++;
        
        if (currentQuestionIndex < selectedQuestions.length) {
            displayQuestion();
        } else {
            getRecommendation();
        }
    }

    // 결과 계산 및 표시 (변경 없음)
    function getRecommendation() {
        let bestMatch = { food: null, score: -1 };
        
        foodDB.forEach(food => {
            const uniqueUserTags = [...new Set(userTags)];
            let currentScore = 0;
            
            food.tags.forEach(foodTag => {
                if (uniqueUserTags.includes(foodTag)) {
                    currentScore++;
                }
            });

            // 가장 높은 점수를 가진 음식을 찾되, 동점일 경우 랜덤성을 부여하기 위해
            if (currentScore > bestMatch.score) {
                bestMatch = { food, score: currentScore };
            } else if (currentScore === bestMatch.score && Math.random() < 0.5) {
                bestMatch = { food, score: currentScore };
            }
        });

        mainContent.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        
        chefImageEl.src = 'chef-result.png';

        if (bestMatch.food) {
            foodNameEl.textContent = bestMatch.food.name;
            foodDescEl.textContent = bestMatch.food.description;
        } else {
            foodNameEl.textContent = '이런...';
            foodDescEl.textContent = '오늘은 마땅한 메뉴를 찾지 못했군요. 다시 시도해보시죠.';
        }
    }
    
    // 초기화 함수 (변경 없음)
    function initializePage() {
        const introChefImage = document.createElement('img');
        introChefImage.src = 'chef-intro.png';
        introChefImage.alt = '근엄한 셰프';
        introChefImage.className = 'chef-image';
        introScreen.prepend(introChefImage);
    }

    // --- 5. 이벤트 리스너 연결 ---
    startBtn.addEventListener('click', startGame);
    
    // ★★★★★ '다시 추천받기' 버튼 로직 수정 ★★★★★
    retryBtn.addEventListener('click', startGame); // 이제 이 버튼이 바로 게임을 다시 시작합니다.

    // --- 6. 앱 시작 ---
    initializePage();
});
