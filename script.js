document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 데이터베이스: 모든 텍스트를 언어별로 관리 ---
    const translations = {
        // UI 텍스트
        ui: {
            intro_title: { ko: "생각 멈추고 나에게 맡겨.", en: "Stop thinking. Leave it to me." },
            start_btn: { ko: "오늘은?", en: "Let's Start!" },
            result_title: { ko: "오늘은? 이거야!", en: "Today? It's this!" },
            retry_btn: { ko: "다시 추천받기", en: "Try Again" },
            disclaimer: { ko: "건강이 가장 중요합니다. 현재 건강을 위한 선택을 하세요.", en: "Your health is most important. Please make a healthy choice." }
        },
        // 질문 데이터
        questions: [
            { id: 'q_reason', text: {ko: '오늘 메뉴를 고민하는 진짜 이유는?', en: 'What\'s the real reason you\'re thinking about the menu?'}, options: [
                { text: {ko: '가볍게 먹고 싶어서', en: 'I want something light'}, tags: ['#가벼운', '#건강한'] },
                { text: {ko: '든든하게 먹고 싶어서', en: 'I want something heavy'}, tags: ['#든든한', '#푸짐한'] },
                { text: {ko: '만들기 귀찮아서', en: 'I\'m too lazy to cook'}, tags: ['#간편한', '#배달'] }
            ]},
            // ... (다른 질문들도 동일한 구조로 번역 추가)
            { id: 'q_staple', text: {ko: '가장 익숙한 주식은 무엇인가요?', en: 'What is your most familiar staple food?'}, options: [ { text: {ko: '빵', en: 'Bread'}, tags: ['#빵', '#서양식'] }, { text: {ko: '면', en: 'Noodles'}, tags: ['#면요리'] }, { text: {ko: '밥', en: 'Rice'}, tags: ['#밥', '#한식', '#아시안'] } ]},
            { id: 'q_hunger', text: {ko: '지금 허기진 정도는 어떤가요?', en: 'How hungry are you right now?'}, options: [ { text: {ko: '배가 너무 고파요', en: 'I\'m starving'}, tags: ['#푸짐한'] }, { text: {ko: '그냥 밥 먹을 때라서', en: 'It\'s just mealtime'}, tags: ['#적당한'] }, { text: {ko: '눈앞에 음식이 떠다녀요', en: 'I\'m craving something special'}, tags: ['#기분전환'] } ]},
            { id: 'q_weather', text: {ko: '지금 날씨는 어떤가요?', en: 'How\'s the weather?'}, options: [ { text: {ko: '흐림', en: 'Cloudy'}, tags: ['#따뜻한', '#국물'] }, { text: {ko: '맑음', en: 'Sunny'}, tags: ['#상쾌한', '#가벼운'] }, { text: {ko: '비 혹은 눈', en: 'Rainy or Snowy'}, tags: ['#따뜻한', '#배달', '#집밥'] } ]},
            { id: 'q_color', text: {ko: '마음에 드는 색깔을 하나 골라보세요.', en: 'Pick a color you like.'}, isColor: true, options: [
                { text: {ko: '빨강', en: 'Red'} }, { text: {ko: '주황', en: 'Orange'} }, { text: {ko: '노랑', en: 'Yellow'} }, { text: {ko: '초록', en: 'Green'} }, 
                { text: {ko: '파랑', en: 'Blue'} }, { text: {ko: '보라', en: 'Purple'} }, { text: {ko: '분홍', en: 'Pink'} }, { text: {ko: '검정', en: 'Black'} }
            ]}
        ],
        // 음식 데이터
        food: [
            { name: {ko: '스시', en: 'Sushi'}, description: {ko: '넌 지금 와사비가 필요해.', en: 'You need some wasabi right now.'}, tags: ['#밥', '#아시안', '#상쾌한', '#집중', '#외식'] },
            { name: {ko: '갈비', en: 'Galbi (Korean BBQ Ribs)'}, description: {ko: '달콤하고 진한 맛을 느껴봐.', en: 'Feel the sweet and rich flavor.'}, tags: ['#밥', '#한식', '#푸짐한', '#보상', '#팀워크', '#외식'] },
            { name: {ko: '치킨', en: 'Fried Chicken'}, description: {ko: '언제나 옳아. 바삭한 튀김을 느껴봐.', en: 'It\'s always right. Feel the crispy crust.'}, tags: ['#배달', '#푸짐한', '#보상', '#짜릿한', '#에너지', '#팀워크'] },
            { name: {ko: '라면', en: 'Ramen'}, description: {ko: '세상에서 가장 완벽한 국물 요리 중 하나.', en: 'One of the most perfect soup dishes in the world.'}, tags: ['#면요리', '#국물', '#간편한', '#짜릿한', '#집밥'] },
            { name: {ko: '파스타', en: 'Pasta'}, description: {ko: '면이 주는 위로를 느껴봐.', en: 'Feel the comfort that noodles give.'}, tags: ['#면요리', '#서양식', '#기분전환', '#따뜻한', '#여유'] },
            { name: {ko: '피자', en: 'Pizza'}, description: {ko: '다 함께 즐기는 최고의 선택!', en: 'The best choice to enjoy together!'}, tags: ['#빵', '#서양식', '#팀워크', '#푸짐한', '#배달', '#보상'] },
            { name: {ko: '김치찌개', en: 'Kimchi Stew'}, description: {ko: '잘 익은 김치와 돼지고기의 완벽한 조화. 밥 두 공기 예약!', en: 'The perfect harmony of ripe kimchi and pork. Two bowls of rice guaranteed!'}, tags: ['#밥', '#한식', '#국물', '#집밥', '#짜릿한'] }
            // 여기에 더 많은 음식 데이터를 추가할 수 있습니다.
        ]
    };
    
    // --- 2. 상태 변수 ---
    let currentLang = 'ko'; // 기본 언어 설정
    
    // --- 3. 요소 선택 ---
    const langSwitcher = document.getElementById('lang-switcher');
    const introTitle = document.getElementById('intro-title');
    const startBtn = document.getElementById('start-btn');
    const resultTitle = document.getElementById('result-title');
    const retryBtn = document.getElementById('retry-btn');
    const disclaimerText = document.getElementById('disclaimer-text');
    // 나머지 요소들은 이전과 동일
    const mainContent = document.getElementById('main-content');
    const introScreen = document.querySelector('.intro');
    const questionArea = document.getElementById('question-area');
    const resultContainer = document.getElementById('result-container');
    const chefImageEl = document.getElementById('chef-image');
    const foodNameEl = document.getElementById('food-name');
    const foodDescEl = document.getElementById('food-description');
    const disclaimer = document.querySelector('.disclaimer');
    let selectedQuestions = [];
    let currentQuestionIndex = 0;
    let userTags = [];

    // --- 4. 핵심 함수 ---
    
    // 언어 변경 및 UI 업데이트 함수
    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang; // html lang 속성 변경

        // 언어 버튼 활성화/비활성화
        langSwitcher.querySelectorAll('button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // 모든 UI 텍스트 업데이트
        introTitle.textContent = translations.ui.intro_title[lang];
        startBtn.textContent = translations.ui.start_btn[lang];
        resultTitle.textContent = translations.ui.result_title[lang];
        retryBtn.textContent = translations.ui.retry_btn[lang];
        disclaimerText.textContent = translations.ui.disclaimer[lang];
        
        // 현재 화면 상태에 따라 다시 그리기
        if (!introScreen.classList.contains('hidden')) {
            // 특별한 동작 없음
        } else if (!questionArea.classList.contains('hidden')) {
            displayQuestion();
        } else if (!resultContainer.classList.contains('hidden')) {
            // 결과 화면은 이미 표시된 내용이라 언어만 바꿔주면 됨
            // (이 부분은 더 복잡한 앱의 경우 필요할 수 있음)
        }
    }

    // 화면 전환 함수
    function showScreen(screen) {
        introScreen.classList.add('hidden');
        questionArea.classList.add('hidden');
        resultContainer.classList.add('hidden');
        disclaimer.classList.add('hidden');
        mainContent.classList.add('hidden');

        if (screen === 'intro') {
            introScreen.classList.remove('hidden');
            mainContent.classList.remove('hidden');
        } else if (screen === 'question') {
            questionArea.classList.remove('hidden');
            mainContent.classList.remove('hidden');
        } else if (screen === 'result') {
            resultContainer.classList.remove('hidden');
            disclaimer.classList.remove('hidden');
        }
    }
    
    // 게임 시작 함수
    function startGame() {
        showScreen('question');
        currentQuestionIndex = 0;
        userTags = [];
        const shuffled = [...translations.questions].sort(() => 0.5 - Math.random());
        selectedQuestions = shuffled.slice(0, 3);
        displayQuestion();
    }

    // 질문 표시 함수 (다국어 지원)
    function displayQuestion() {
        const question = selectedQuestions[currentQuestionIndex];
        let currentOptions = question.options;

        if (question.isDynamic || question.isColor) {
            const shuffledOptions = [...question.options].sort(() => 0.5 - Math.random());
            currentOptions = shuffledOptions.slice(0, 3);
        }
        
        let optionsHTML = '';
        currentOptions.forEach(opt => {
            const tags = opt.tags ? opt.tags.join(',') : '';
            optionsHTML += `<button class="option-btn" data-tags="${tags}">${opt.text[currentLang]}</button>`;
        });

        questionArea.innerHTML = `
            <div class="question-box">
                <h3>${question.text[currentLang]}</h3>
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
        if (tags[0] !== '') { userTags.push(...tags); }
        currentQuestionIndex++;
        if (currentQuestionIndex < selectedQuestions.length) {
            displayQuestion();
        } else {
            getRecommendation();
        }
    }

    // 결과 추천 함수 (다국어 지원)
    function getRecommendation() {
        showScreen('result');
        let bestMatch = { food: null, score: -1 };
        
        translations.food.forEach(food => {
            const uniqueUserTags = [...new Set(userTags)];
            let currentScore = 0;
            food.tags.forEach(foodTag => { if (uniqueUserTags.includes(foodTag)) { currentScore++; } });
            if (currentScore > bestMatch.score) {
                bestMatch = { food, score: currentScore };
            } else if (currentScore === bestMatch.score && Math.random() < 0.5) {
                bestMatch = { food, score: currentScore };
            }
        });
        
        chefImageEl.src = 'chef-result.png';

        if (bestMatch.food) {
            foodNameEl.textContent = bestMatch.food.name[currentLang];
            foodDescEl.textContent = bestMatch.food.description[currentLang];
        } else {
            foodNameEl.textContent = {ko: '이런...', en: 'Oops...'}[currentLang];
            foodDescEl.textContent = {ko: '오늘은 마땅한 메뉴를 찾지 못했군요. 다시 시도해보시죠.', en: 'I couldn\'t find a suitable menu today. Please try again.'}[currentLang];
        }
    }
    
    function initializePage() {
        const introChefImage = document.createElement('img');
        introChefImage.src = 'chef-intro.png';
        introChefImage.alt = 'A serious chef';
        introChefImage.className = 'chef-image';
        introScreen.prepend(introChefImage);
    }

    // --- 5. 이벤트 리스너 연결 ---
    startBtn.addEventListener('click', startGame);
    retryBtn.addEventListener('click', startGame);
    langSwitcher.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const lang = e.target.dataset.lang;
            if (lang !== currentLang) {
                setLanguage(lang);
            }
        }
    });

    // --- 6. 앱 시작 ---
    initializePage();
    setLanguage(currentLang); // 초기 언어로 UI 설정
    showScreen('intro');
});
