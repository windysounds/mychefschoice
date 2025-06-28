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
            { id: 'q_reason', text: {ko: '오늘 메뉴를 고민하는 진짜 이유는?', en: 'What\'s the real reason for your menu indecision?'}, options: [ { text: {ko: '가볍게 먹고 싶어서', en: 'I want something light'}, tags: ['#가벼운', '#건강한'] }, { text: {ko: '든든하게 먹고 싶어서', en: 'I want something heavy'}, tags: ['#든든한', '#푸짐한'] }, { text: {ko: '만들기 귀찮아서', en: 'I\'m too lazy to cook'}, tags: ['#간편한', '#배달'] } ]},
            { id: 'q_staple', text: {ko: '가장 익숙한 주식은 무엇인가요?', en: 'What\'s your go-to carb?'}, options: [ { text: {ko: '빵', en: 'Bread'}, tags: ['#빵', '#서양식'] }, { text: {ko: '면', en: 'Noodles'}, tags: ['#면요리'] }, { text: {ko: '밥', en: 'Rice'}, tags: ['#밥', '#아시안'] } ]},
            { id: 'q_hunger', text: {ko: '지금 허기진 정도는 어떤가요?', en: 'How hungry are you right now?'}, options: [ { text: {ko: '배가 너무 고파요', en: 'I\'m starving'}, tags: ['#푸짐한'] }, { text: {ko: '그냥 밥 먹을 때라서', en: 'It\'s just mealtime'}, tags: ['#적당한'] }, { text: {ko: '눈앞에 음식이 떠다녀요', en: 'I\'m craving something special'}, tags: ['#기분전환'] } ]},
            { id: 'q_weather', text: {ko: '지금 날씨는 어떤가요?', en: 'How\'s the weather?'}, options: [ { text: {ko: '흐림', en: 'Cloudy'}, tags: ['#따뜻한', '#국물'] }, { text: {ko: '맑음', en: 'Sunny'}, tags: ['#상쾌한', '#가벼운'] }, { text: {ko: '비 혹은 눈', en: 'Rainy or Snowy'}, tags: ['#따뜻한', '#배달', '#집밥'] } ]},
            { id: 'q_color', text: {ko: '마음에 드는 색깔을 하나 골라보세요.', en: 'Pick a color you like.'}, isColor: true, options: [ { text: {ko: '빨강', en: 'Red'} }, { text: {ko: '주황', en: 'Orange'} }, { text: {ko: '노랑', en: 'Yellow'} }, { text: {ko: '초록', en: 'Green'} }, { text: {ko: '파랑', en: 'Blue'} }, { text: {ko: '보라', en: 'Purple'} }, { text: {ko: '분홍', en: 'Pink'} }, { text: {ko: '검정', en: 'Black'} } ]}
        ],
        // ★★★★★ 언어별로 분리된 음식 데이터베이스 ★★★★★
        food: {
            ko: [
                { name: '스시', description: '넌 지금 와사비가 필요해.', tags: ['#밥', '#아시안', '#상쾌한', '#집중', '#외식'] },
                { name: '갈비', description: '달콤하고 진한 맛을 느껴봐.', tags: ['#밥', '#한식', '#푸짐한', '#보상', '#팀워크', '#외식'] },
                { name: '빵 (베이커리)', description: '빵 하나면 충분해. 그래야 내일 고민 안 할 거야.', tags: ['#빵', '#서양식', '#가벼운', '#여유', '#간편한'] },
                { name: '샌드위치', description: '가장 맛있는 조합은 네 입이 알고 있어.', tags: ['#빵', '#건강한', '#가벼운', '#적당한', '#간편한'] },
                { name: '치킨', description: '언제나 옳아. 바삭한 튀김을 느껴봐.', tags: ['#배달', '#푸짐한', '#보상', '#짜릿한', '#에너지', '#팀워크'] },
                { name: '김밥', description: '널 위한 선물 세트야. 야채를 챙겨야 할 때가 됐지?', tags: ['#밥', '#한식', '#간편한', '#건강한', '#적당한'] },
                { name: '파스타', description: '면이 주는 위로를 느껴봐.', tags: ['#면요리', '#서양식', '#기분전환', '#따뜻한', '#여유'] },
                { name: '피자', description: '다 함께 즐기는 최고의 선택!', tags: ['#빵', '#서양식', '#팀워크', '#푸짐한', '#배달', '#보상'] },
                { name: '라면', description: '세상에서 가장 완벽한 국물 요리 중 하나.', tags: ['#면요리', '#국물', '#간편한', '#짜릿한', '#집밥'] },
                { name: '된장찌개', description: '구수한 맛이 일품인 한국인의 소울푸드.', tags: ['#밥', '#한식', '#국물', '#집밥', '#따뜻한', '#건강한'] },
                { name: '비빔밥', description: '다양한 야채와 고추장의 조화, 건강하고 든든하게.', tags: ['#밥', '#한식', '#건강한', '#적당한', '#집밥'] },
                { name: '떡볶이', description: '매콤달콤한 맛으로 스트레스를 날려버려.', tags: ['#간식', '#기분전환', '#짜릿한', '#배달', '#팀워크'] },
                { name: '제육볶음', description: '밥도둑이 여기 있었네. 말이 필요 없는 맛.', tags: ['#밥', '#한식', '#푸짐한', '#에너지', '#집밥', '#외식'] },
                { name: '부대찌개', description: '햄과 라면사리의 환상적인 콜라보!', tags: ['#밥', '#국물', '#푸짐한', '#팀워크', '#외식', '#짜릿한'] },
                { name: '짜장면', description: '고민될 땐 그냥 짜장면으로 가자.', tags: ['#면요리', '#아시안', '#배달', '#적당한', '#간편한'] },
                { name: '짬뽕', description: '얼큰한 국물이 생각날 때, 최고의 선택.', tags: ['#면요리', '#아시안', '#국물', '#짜릿한', '#외식'] },
                { name: '탕수육', description: '바삭함과 달콤함, 둘 다 놓칠 수 없지.', tags: ['#요리', '#아시안', '#팀워크', '#보상', '#배달'] },
                { name: '마라탕', description: '요즘 대세! 얼얼한 맛에 중독될 준비 됐어?', tags: ['#국물', '#아시안', '#기분전환', '#짜릿한', '#외식'] },
                { name: '돈까스', description: '바삭한 튀김옷과 두툼한 고기의 완벽한 만남.', tags: ['#밥', '#글로벌', '#푸짐한', '#보상', '#외식'] },
                { name: '카레', description: '향긋한 카레 향이 입맛을 돋울 거야.', tags: ['#밥', '#아시안', '#따뜻한', '#집밥', '#적당한'] },
                { name: '편의점 만찬', description: '오늘의 셰프는 바로 너! 최고의 조합을 만들어봐.', tags: ['#간편한', '#가성비', '#기분전환', '#보상'] },
                { name: '볶음밥', description: '냉장고에 남은 재료도 훌륭한 요리가 될 수 있지.', tags: ['#밥', '#집밥', '#간편한', '#적당한'] },
                { name: '햄버거', description: '클래식한 맛의 정석, 빠르게 에너지를 채워봐.', tags: ['#빵', '#서양식', '#간편한', '#외식', '#에너지'] },
                { name: '도시락', description: '정성스럽게 담은 한 끼 식사, 간단하고 든든하게.', tags: ['#밥', '#한식', '#간편한', '#건강한', '#적당한'] },
                { name: '해물찜', description: '매콤한 양념에 버무린 신선한 해산물의 향연.', tags: ['#외식', '#한식', '#푸짐한', '#짜릿한', '#팀워크'] },
                { name: '안동찜닭', description: '짭짤하고 달콤한 간장 소스가 밴 닭고기와 당면.', tags: ['#외식', '#한식', '#밥', '#푸짐한', '#팀워크'] },
                { name: '닭볶음탕', description: '매콤하고 칼칼한 국물, 밥 비벼 먹으면 최고지.', tags: ['#집밥', '#한식', '#국물', '#푸짐한', '#에너지'] },
                { name: '칼국수', description: '구수한 국물과 쫄깃한 면발이 마음을 위로해줄 거야.', tags: ['#면요리', '#한식', '#국물', '#따뜻한', '#적당한'] },
                { name: '만두', description: '찐만두, 군만두, 만둣국. 어떻게 먹어도 맛있지.', tags: ['#간식', '#아시안', '#간편한', '#팀워크'] },
                { name: '닭갈비', description: '매콤한 양념에 볶아낸 닭고기, 볶음밥은 필수 코스.', tags: ['#외식', '#한식', '#푸짐한', '#에너지', '#팀워크'] },
                { name: '김치찌개', description: '잘 익은 김치와 돼지고기의 완벽한 조화. 밥 두 공기 예약!', tags: ['#밥', '#한식', '#국물', '#집밥', '#짜릿한'] },
                { name: '국밥', description: '뚝배기 한 그릇에 담긴 든든함, 마음까지 따뜻해져.', tags: ['#밥', '#한식', '#국물', '#든든한', '#가성비', '#외식'] }
            ],
            en: [
                { name: 'Sushi', description: 'You need some wasabi right now.', tags: ['#밥', '#아시안', '#상쾌한', '#집중', '#외식'] },
                { name: 'Galbi (Korean BBQ Ribs)', description: 'Feel the sweet and rich flavor.', tags: ['#밥', '#한식', '#푸짐한', '#보상', '#팀워크', '#외식'] },
                { name: 'Bakery Bread', description: 'One bread is enough. So you won\'t worry tomorrow.', tags: ['#빵', '#서양식', '#가벼운', '#여유', '#간편한'] },
                { name: 'Sandwich', description: 'Your mouth knows the best combination.', tags: ['#빵', '#건강한', '#가벼운', '#적당한', '#간편한'] },
                { name: 'Fried Chicken', description: 'It\'s always right. Feel the crispy crust.', tags: ['#배달', '#푸짐한', '#보상', '#짜릿한', '#에너지', '#팀워크'] },
                { name: 'Pasta', description: 'Feel the comfort that noodles give.', tags: ['#면요리', '#서양식', '#기분전환', '#따뜻한', '#여유'] },
                { name: 'Pizza', description: 'The best choice to enjoy together!', tags: ['#빵', '#서양식', '#팀워크', '#푸짐한', '#배달', '#보상'] },
                { name: 'Ramen', description: 'One of the most perfect soup dishes in the world.', tags: ['#면요리', '#국물', '#간편한', '#짜릿한', '#집밥'] },
                { name: 'Bibimbap', description: 'A harmony of various vegetables, healthy and satisfying.', tags: ['#밥', '#한식', '#건강한', '#적당한', '#집밥'] },
                { name: 'Tteokbokki', description: 'Blow away stress with its spicy and sweet taste.', tags: ['#간식', '#기분전환', '#짜릿한', '#배달', '#팀워크'] },
                { name: 'Jajangmyeon', description: 'When in doubt, just go for Jajangmyeon.', tags: ['#면요리', '#아시안', '#배달', '#적당한', '#간편한'] },
                { name: 'Malatang', description: 'The current trend! Ready to get addicted to the numbing taste?', tags: ['#국물', '#아시안', '#기분전환', '#짜릿한', '#외식'] },
                { name: 'Curry', description: 'The fragrant curry smell will whet your appetite.', tags: ['#밥', '#아시안', '#따뜻한', '#집밥', '#적당한'] },
                { name: 'Fried Rice', description: 'Leftover ingredients can become a great dish.', tags: ['#밥', '#집밥', '#간편한', '#적당한'] },
                { name: 'Hamburger', description: 'The standard of classic taste, quickly fill up your energy.', tags: ['#빵', '#서양식', '#간편한', '#외식', '#에너지'] },
                { name: 'Donkatsu', description: 'The perfect meeting of crispy batter and thick meat.', tags: ['#밥', '#글로벌', '#푸짐한', '#보상', '#외식'] },
                { name: 'Sweet and Sour Pork', description: 'Crispiness and sweetness, can\'t miss both.', tags: ['#요리', '#아시안', '#팀워크', '#보상', '#배달'] },
                { name: 'Seafood Bake', description: 'A medley of ocean treasures, baked to perfection.', tags: ['#해산물', '#서양식', '#푸짐한', '#보상', '#팀워크'] },
                { name: 'Bento Box', description: 'A perfectly balanced and beautiful meal box.', tags: ['#밥', '#아시안', '#건강한', '#적당한', '#간편한'] },
                { name: 'Taco Plate', description: 'Build your own happiness with fresh toppings.', tags: ['#외식', '#서양식', '#기분전환', '#팀워크', '#짜릿한'] },
                { name: 'Hot Dog', description: 'A simple classic that never disappoints.', tags: ['#빵', '#간편한', '#가성비', '#외식'] },
                { name: 'Spaghetti Carbonara', description: 'Creamy, cheesy, and oh-so-satisfying.', tags: ['#면요리', '#서양식', '#푸짐한', '#보상', '#따뜻한'] },
                { name: 'Tomato Basil Pasta', description: 'Simple, fresh, and bursting with Italian sunshine.', tags: ['#면요리', '#서양식', '#가벼운', '#건강한', '#상쾌한'] },
                { name: 'Chicken Caesar Wrap', description: 'A healthy and delicious classic on the go.', tags: ['#빵', '#가벼운', '#건강한', '#적당한', '#간편한'] },
                { name: 'Mac and Cheese', description: 'The ultimate comfort food. Pure, cheesy bliss.', tags: ['#면요리', '#서양식', '#집밥', '#보상', '#따뜻한'] },
                { name: 'Fish and Chips', description: 'Crispy battered fish and golden fries. A seaside classic.', tags: ['#외식', '#서양식', '#푸짐한', '#짜릿한'] },
                { name: 'Cajun Shrimp Bowl', description: 'Spicy, savory, and packed with flavor.', tags: ['#밥', '#해산물', '#짜릿한', '#기분전환'] },
                { name: 'Grilled Cheese Sandwich', description: 'Golden toasted bread with a gooey, cheesy center.', tags: ['#빵', '#집밥', '#간편한', '#따뜻한', '#보상'] },
                { name: 'Chicken Quesadilla', description: 'Cheesy, savory, and perfect for dipping.', tags: ['#빵', '#팀워크', '#간편한', '#가성비'] },
                { name: 'Falafel Wrap', description: 'A delicious and healthy Mediterranean delight.', tags: ['#빵', '#건강한', '#가벼운', '#채식'] },
                { name: 'Pulled Pork Burger', description: 'Slow-cooked, tender, and smothered in BBQ sauce.', tags: ['#빵', '#푸짐한', '#보상', '#에너지'] },
                { name: 'Breakfast Burrito', description: 'All your breakfast favorites wrapped in a warm tortilla.', tags: ['#빵', '#푸짐한', '#에너지', '#간편한'] }
            ]
        }
    };
    
    // --- 이하 로직은 언어별 DB를 사용하도록 수정 ---
    let currentLang = 'ko';
    const langSwitcher = document.getElementById('lang-switcher');
    const introTitle = document.getElementById('intro-title');
    const startBtn = document.getElementById('start-btn');
    const resultTitle = document.getElementById('result-title');
    const retryBtn = document.getElementById('retry-btn');
    const disclaimerText = document.getElementById('disclaimer-text');
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

    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        langSwitcher.querySelectorAll('button').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
        introTitle.textContent = translations.ui.intro_title[lang];
        startBtn.textContent = translations.ui.start_btn[lang];
        resultTitle.textContent = translations.ui.result_title[lang];
        retryBtn.textContent = translations.ui.retry_btn[lang];
        disclaimerText.textContent = translations.ui.disclaimer[lang];
    }

    function showScreen(screen) {
        introScreen.classList.add('hidden');
        questionArea.classList.add('hidden');
        resultContainer.classList.add('hidden');
        disclaimer.classList.add('hidden');
        mainContent.classList.add('hidden');
        if (screen === 'intro') { introScreen.classList.remove('hidden'); mainContent.classList.remove('hidden'); } 
        else if (screen === 'question') { questionArea.classList.remove('hidden'); mainContent.classList.remove('hidden'); } 
        else if (screen === 'result') { resultContainer.classList.remove('hidden'); disclaimer.classList.remove('hidden'); }
    }
    
    function startGame() {
        showScreen('question');
        currentQuestionIndex = 0;
        userTags = [];
        const shuffled = [...translations.questions].sort(() => 0.5 - Math.random());
        selectedQuestions = shuffled.slice(0, 3);
        displayQuestion();
    }

    function displayQuestion() {
        const question = selectedQuestions[currentQuestionIndex];
        let currentOptions = question.options;
        if (question.isDynamic || question.isColor) {
            currentOptions = [...question.options].sort(() => 0.5 - Math.random()).slice(0, 3);
        }
        let optionsHTML = '';
        currentOptions.forEach(opt => {
            const tags = opt.tags ? opt.tags.join(',') : '';
            optionsHTML += `<button class="option-btn" data-tags="${tags}">${opt.text[currentLang]}</button>`;
        });
        questionArea.innerHTML = `<div class="question-box"><h3>${question.text[currentLang]}</h3><div class="options">${optionsHTML}</div></div>`;
        document.querySelectorAll('.option-btn').forEach(btn => btn.addEventListener('click', handleOptionClick));
    }
    
    function handleOptionClick(e) {
        const tags = e.target.dataset.tags.split(',');
        if (tags[0] !== '') { userTags.push(...tags); }
        currentQuestionIndex++;
        if (currentQuestionIndex < selectedQuestions.length) { displayQuestion(); } 
        else { getRecommendation(); }
    }

    function getRecommendation() {
        showScreen('result');
        let bestMatch = { food: null, score: -1 };
        
        // ★★★★★ 현재 언어에 맞는 음식 DB에서 추천 ★★★★★
        translations.food[currentLang].forEach(food => {
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
            foodNameEl.textContent = bestMatch.food.name;
            foodDescEl.textContent = bestMatch.food.description;
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

    startBtn.addEventListener('click', startGame);
    retryBtn.addEventListener('click', startGame);
    langSwitcher.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const lang = e.target.dataset.lang;
            if (lang !== currentLang) { setLanguage(lang); }
        }
    });

    initializePage();
    setLanguage(currentLang);
