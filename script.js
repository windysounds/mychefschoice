document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 데이터베이스 (단순화된 태그) ---
    const allQuestions = [
        { id: 'q1', text: '오늘 메뉴를 고민하는 이유는?', options: [
            { text: '가볍게 먹고 싶어서', tags: ['#가벼운'] },
            { text: '든든하게 먹고 싶어서', tags: ['#든든한'] },
            { text: '만들기 귀찮아서', tags: ['#간편한'] }
        ]},
        { id: 'q2', text: '지금 기분을 색깔로 표현한다면?', options: [
            { text: '블루', tags: ['#차분한'] },
            { text: '레드', tags: ['#활기찬'] },
            { text: '화이트', tags: ['#평범한'] }
        ]},
        { id: 'q3', text: '지금 어디에 계신가요?', options: [
            { text: '집', tags: ['#집밥', '#한식'] },
            { text: '밖', tags: ['#외식', '#글로벌'] },
            { text: '회사/학교', tags: ['#간편한', '#가성비'] }
        ]}
        // 추가 질문을 여기에 넣을 수 있습니다.
    ];

    const foodDB = [
        { name: '김치찌개와 계란말이', description: '집밥의 정석. 따뜻하고 든든하게 속을 채워줍니다.', tags: ['#집밥', '#한식', '#든든한', '#평범한'] },
        { name: '따끈한 쌀국수', description: '담백한 국물이 당신을 위로해줄 겁니다.', tags: ['#외식', '#글로벌', '#차분한', '#가벼운'] },
        { name: '수제버거와 감자튀김', description: '활기찬 에너지가 필요할 땐, 역시 이거죠!', tags: ['#외식', '#글로벌', '#활기찬', '#든든한'] },
        { name: '편의점 도시락 세트', description: '빠르고 간편하게, 하지만 알차게 즐기는 한 끼.', tags: ['#간편한', '#가성비', '#혼밥', '#평범한'] },
        { name: '간장계란밥', description: '요리하기 귀찮을 때, 5분이면 완성되는 최고의 선택.', tags: ['#집밥', '#한식', '#가벼운', '#간편한'] },
        { name: '서브웨이 샌드위치', description: '가볍지만 신선하게, 내 취향대로 만드는 한 끼.', tags: ['#외식', '#글로벌', '#가벼운', '#활기찬'] }
    ];

    // --- 2. 요소 선택 ---
    const mainContent = document.getElementById('main-content');
    const introScreen = document.querySelector('.intro');
    const startBtn = document.getElementById('start-btn');
    const questionArea = document.getElementById('question-area');
    
    const resultContainer = document.getElementById('result-container');
    const chefImageEl = document.getElementById('chef-image'); // chef-image 요소를 가져옵니다.
    const foodNameEl = document.getElementById('food-name');
    const foodDescEl = document.getElementById('food-description');
    const retryBtn = document.getElementById('retry-btn');

    // --- 3. 상태 변수 ---
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

    // 질문 표시
    function displayQuestion() {
        // ... (이 부분은 변경 없음)
        const question = selectedQuestions[currentQuestionIndex];
        
        let optionsHTML = '';
        question.options.forEach(opt => {
            optionsHTML += `<button class="option-btn" data-tags="${opt.tags.join(',')}">${opt.text}</button>`;
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
    
    // 옵션 선택 처리
    function handleOptionClick(e) {
        // ... (이 부분은 변경 없음)
        const tags = e.target.dataset.tags.split(',');
        userTags.push(...tags);
        
        currentQuestionIndex++;
        
        if (currentQuestionIndex < selectedQuestions.length) {
            displayQuestion();
        } else {
            getRecommendation();
        }
    }

    // 결과 계산 및 표시
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

            if (currentScore > bestMatch.score) {
                bestMatch = { food, score: currentScore };
            }
        });

        mainContent.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        
        // ★★★★★ 변경된 부분 ★★★★★
        // 결과 화면의 셰프 이미지를 '엄지 척' 이미지로 변경
        chefImageEl.src = 'chef-result.png';

        if (bestMatch.food) {
            foodNameEl.textContent = bestMatch.food.name;
            foodDescEl.textContent = bestMatch.food.description;
        } else {
            foodNameEl.textContent = '이런...';
            foodDescEl.textContent = '오늘은 마땅한 메뉴를 찾지 못했군요. 다시 시도해보시죠.';
        }
    }
    
    // ★★★★★ 변경된 부분 ★★★★★
    // HTML에 있는 이미지를 시작할 때 한 번만 설정해줍니다.
    function initializePage() {
        const introChefImage = document.createElement('img');
        introChefImage.src = 'chef-intro.png';
        introChefImage.alt = '근엄한 셰프';
        introChefImage.className = 'chef-image';
        introScreen.prepend(introChefImage); // h1 태그 앞에 이미지를 추가합니다.
    }

    // --- 5. 이벤트 리스너 연결 ---
    startBtn.addEventListener('click', startGame);
    retryBtn.addEventListener('click', () => {
        resultContainer.classList.add('hidden');
        introScreen.classList.remove('hidden');
    });

    // --- 6. 앱 시작 ---
    initializePage();

});
