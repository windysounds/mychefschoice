document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 데이터베이스: 모든 텍스트, 질문, 음식을 한 곳에서 관리 ---
    const translations = {
        // ★★★★★ 1. 페이지 제목과 설명 추가 ★★★★★
        pageMeta: {
            title: {
                ko: "오늘의 메뉴 추천 | My Chef의 선택",
                en: "Menu Recommendation | My Chef's Choice"
            },
            description: {
                ko: "선택장애 해결! 버튼 하나로 점심, 저녁 메뉴를 랜덤으로 추천받으세요. 한식, 중식, 일식, 양식 등 다양한 메뉴를 지금 바로 확인해보세요.",
                en: "Can't decide what to eat? Get random menu recommendations for lunch and dinner with a single click. Korean, Chinese, Japanese, Western, and more!"
            }
        },
        ui: {
            intro_title: { ko: "생각 멈추고 나에게 맡겨.", en: "Stop thinking. Leave it to me." },
            start_btn: { ko: "오늘은?", en: "Let's Start!" },
            result_title: { ko: "오늘은? 이거야!", en: "Today? It's this!" },
            retry_btn: { ko: "다시 추천받기", en: "Try Again" },
            disclaimer: { ko: "건강이 가장 중요합니다. 현재 건강을 위한 선택을 하세요.", en: "Your health is most important. Please make a healthy choice." }
        },
        
        questions: [
            // (질문 데이터는 변경 없음 - 그대로 유지)
            { id: 'q_reason', text: {ko: '오늘 메뉴를 고민하는 진짜 이유는?', en: 'What\'s the real reason for your menu indecision?'}, options: [ { text: {ko: '가볍게 먹고 싶어서', en: 'I want something light'} }, { text: {ko: '든든하게 먹고 싶어서', en: 'I want something heavy'} }, { text: {ko: '만들기 귀찮아서', en: 'I\'m too lazy to cook'} } ]},
            { id: 'q_staple', text: {ko: '가장 익숙한 주식은 무엇인가요?', en: 'What\'s your go-to carb?'}, options: [ { text: {ko: '빵', en: 'Bread'} }, { text: {ko: '면', en: 'Noodles'} }, { text: {ko: '밥', en: 'Rice'} } ]},
            { id: 'q_mood', text: {ko: '오늘 기분은 어때?', en: 'How are you feeling today?'}, options: [ { text: {ko: '행복해', en: 'Happy'} }, { text: {ko: '심심해', en: 'Bored'} }, { text: {ko: '지쳤어', en: 'Tired'} } ]},
            { id: 'q_weather', text: {ko: '지금 날씨는 어떤가요?', en: 'How\'s the weather?'}, options: [ { text: {ko: '흐림', en: 'Cloudy'} }, { text: {ko: '맑음', en: 'Sunny'} }, { text: {ko: '비 혹은 눈', en: 'Rainy or Snowy'} } ]},
            { id: 'q_drink', text: {ko: '식사 후에 마시고 싶은 건?', en: 'What would you like to drink after your meal?'}, isRandomOptions: true, options: [ { text: {ko: '커피', en: 'Coffee'} }, { text: {ko: '차', en: 'Tea'} }, { text: {ko: '시원한 물', en: 'Cold Water'} }, { text: {ko: '뜨거운 물', en: 'Hot Water'} }, { text: {ko: '탄산 음료', en: 'Soda'} }, { text: {ko: '에너지 드링크', en: 'Energy Drink'} } ]},
            { id: 'q_dessert', text: {ko: '디저트를 먹는다면 뭐가 좋겠어?', en: 'If you were to have dessert, what would you choose?'}, options: [ { text: {ko: '초콜릿', en: 'Chocolate'} }, { text: {ko: '과자', en: 'Cookies'} }, { text: {ko: '스무디', en: 'Smoothie'} } ]},
            { id: 'q_sport', text: {ko: '갑자기 끌리는 스포츠는?', en: 'Which sport are you suddenly drawn to?'}, isRandomOptions: true, options: [ { text: {ko: '야구', en: 'Baseball'} }, { text: {ko: '농구', en: 'Basketball'} }, { text: {ko: '배구', en: 'Volleyball'} }, { text: {ko: '축구', en: 'Soccer'} }, { text: {ko: '테니스', en: 'Tennis'} }, { text: {ko: '배드민턴', en: 'Badminton'} }, { text: {ko: '핸드볼', en: 'Handball'} } ]},
            { id: 'q_movie', text: {ko: '영화를 본다면 장르는?', en: 'If you were to watch a movie, what genre?'}, isRandomOptions: true, options: [ { text: {ko: '로맨스', en: 'Romance'} }, { text: {ko: '판타지', en: 'Fantasy'} }, { text: {ko: '공포', en: 'Horror'} }, { text: {ko: '액션', en: 'Action'} }, { text: {ko: '코미디', en: 'Comedy'} }, { text: {ko: '드라마', en: 'Drama'} } ]},
            { id: 'q_animal', text: {ko: '친구가 되고 싶은 동물은?', en: 'Which animal would you want as a friend?'}, isRandomOptions: true, options: [ { text: {ko: '코끼리', en: 'Elephant'} }, { text: {ko: '호랑이', en: 'Tiger'} }, { text: {ko: '사자', en: 'Lion'} }, { text: {ko: '말', en: 'Horse'} }, { text: {ko: '강아지', en: 'Dog'} }, { text: {ko: '고양이', en: 'Cat'} }, { text: {ko: '도마뱀', en: 'Lizard'} }, { text: {ko: '앵무새', en: 'Parrot'} } ]},
            { id: 'q_transport', text: {ko: '선호하는 이동 수단은?', en: 'What is your preferred mode of transport?'}, options: [ { text: {ko: '비행기', en: 'Airplane'} }, { text: {ko: '자동차', en: 'Car'} }, { text: {ko: '걷기', en: 'Walking'} } ]},
            { id: 'q_scientist', text: {ko: '과학자가 된다면?', en: 'If you were a scientist?'}, options: [ { text: {ko: '우주 개척', en: 'Space Exploration'} }, { text: {ko: '심해 탐사', en: 'Deep Sea Exploration'} }, { text: {ko: '자연 보호', en: 'Nature Conservation'} } ]}
        ],
        
        food: {
            // (음식 데이터는 변경 없음 - 그대로 유지)
            ko: [
                { name: '스시', description: '넌 지금 와사비가 필요해.' }, { name: '갈비', description: '달콤하고 진한 맛을 느껴봐.' }, { name: '빵 (베이커리)', description: '빵 하나면 충분해. 그래야 내일 고민 안 할 거야.' }, { name: '샌드위치', description: '가장 맛있는 조합은 네 입이 알고 있어.' }, { name: '치킨', description: '언제나 옳아. 바삭한 튀김을 느껴봐.' }, { name: '김밥', description: '널 위한 선물 세트야. 야채를 챙겨야 할 때가 됐지?' }, { name: '파스타', description: '면이 주는 위로를 느껴봐.' }, { name: '피자', description: '다 함께 즐기는 최고의 선택!' }, { name: '라면', description: '세상에서 가장 완벽한 국물 요리 중 하나.' }, { name: '된장찌개', description: '구수한 맛이 일품인 한국인의 소울푸드.' }, { name: '비빔밥', description: '다양한 야채와 고추장의 조화, 건강하고 든든하게.' }, { name: '떡볶이', description: '매콤달콤한 맛으로 스트레스를 날려버려.' }, { name: '제육볶음', description: '밥도둑이 여기 있었네. 말이 필요 없는 맛.' }, { name: '부대찌개', description: '햄과 라면사리의 환상적인 콜라보!' }, { name: '짜장면', description: '고민될 땐 그냥 짜장면으로 가자.' }, { name: '짬뽕', description: '얼큰한 국물이 생각날 때, 최고의 선택.' }, { name: '탕수육', description: '바삭함과 달콤함, 둘 다 놓칠 수 없지.' }, { name: '마라탕', description: '요즘 대세! 얼얼한 맛에 중독될 준비 됐어?' }, { name: '돈까스', description: '바삭한 튀김옷과 두툼한 고기의 완벽한 만남.' }, { name: '카레', description: '향긋한 카레 향이 입맛을 돋울 거야.' }, { name: '편의점 만찬', description: '오늘의 셰프는 바로 너! 최고의 조합을 만들어봐.' }, { name: '볶음밥', description: '냉장고에 남은 재료도 훌륭한 요리가 될 수 있지.' }, { name: '햄버거', description: '클래식한 맛의 정석, 빠르게 에너지를 채워봐.' }, { name: '도시락', description: '정성스럽게 담은 한 끼 식사, 간단하고 든든하게.' }, { name: '해물찜', description: '매콤한 양념에 버무린 신선한 해산물의 향연.' }, { name: '안동찜닭', description: '짭짤하고 달콤한 간장 소스가 밴 닭고기와 당면.' }, { name: '닭볶음탕', description: '매콤하고 칼칼한 국물, 밥 비벼 먹으면 최고지.' }, { name: '칼국수', description: '구수한 국물과 쫄깃한 면발이 마음을 위로해줄 거야.' }, { name: '만두', description: '찐만두, 군만두, 만둣국. 어떻게 먹어도 맛있지.' }, { name: '닭갈비', description: '매콤한 양념에 볶아낸 닭고기, 볶음밥은 필수 코스.' }, { name: '김치찌개', description: '잘 익은 김치와 돼지고기의 완벽한 조화. 밥 두 공기 예약!' }, { name: '국밥', description: '뚝배기 한 그릇에 담긴 든든함, 마음까지 따뜻해져.' }, { name: '순대국', description: '뜨끈한 국물에 속이 꽉 찬 순대, 든든함의 대명사.' }, { name: '백반 정식', description: '매일 바뀌는 반찬의 즐거움, 집밥보다 더 집밥 같아.' }, { name: '기사 식당 불백', description: '불패 신화여서 불백이야. 실패 없는 완벽한 한 끼.' }, { name: '뷔페', description: '고민은 그만! 오늘만큼은 세상 모든 걸 맛보자.' }, { name: '냉면', description: '냉면은 사실 사계절용이야. 이한치한, 이열치열!' }, { name: '삼겹살', description: '대패든 뭐든 괜찮아. 일단 3겹. 지글지글 소리가 들리지?' }, { name: '불고기', description: '달콤한 간장 양념의 정석, 남녀노소 모두의 사랑.' }, { name: '덮밥', description: '흰 쌀밥 위에 펼쳐지는 맛의 향연, 한 그릇의 행복.' }, { name: '감자탕', description: '진한 국물에 부드러운 등뼈, 술 안주로도 식사로도 최고.' }, { name: '토스트', description: '바삭한 빵에 달콤한 잼, 간단하지만 완벽한 시작.' }
            ],
            en: [
                { name: 'Sushi', description: 'You need some wasabi right now.' }, { name: 'Galbi (Korean BBQ Ribs)', description: 'Feel the sweet and rich flavor.' }, { name: 'Bakery Bread', description: 'One bread is enough. So you won\'t worry tomorrow.' }, { name: 'Sandwich', description: 'Your mouth knows the best combination.' }, { name: 'Fried Chicken', description: 'It\'s always right. Feel the crispy crust.' }, { name: 'Pasta', description: 'Feel the comfort that noodles give.' }, { name: 'Pizza', description: 'The best choice to enjoy together!' }, { name: 'Ramen', description: 'One of the most perfect soup dishes in the world.' }, { name: 'Bibimbap', description: 'A harmony of various vegetables, healthy and satisfying.' }, { name: 'Tteokbokki', description: 'Blow away stress with its spicy and sweet taste.' }, { name: 'Jajangmyeon', description: 'When in doubt, just go for Jajangmyeon.' }, { name: 'Malatang', description: 'The current trend! Ready to get addicted to the numbing taste?' }, { name: 'Curry', description: 'The fragrant curry smell will whet your appetite.' }, { name: 'Fried Rice', description: 'Leftover ingredients can become a great dish.' }, { name: 'Hamburger', description: 'The standard of classic taste, quickly fill up your energy.' }, { name: 'Donkatsu', description: 'The perfect meeting of crispy batter and thick meat.' }, { name: 'Sweet and Sour Pork', description: 'Crispiness and sweetness, can\'t miss both.' }, { name: 'Seafood Bake', description: 'A medley of ocean treasures, baked to perfection.' }, { name: 'Bento Box', description: 'A perfectly balanced and beautiful meal box.' }, { name: 'Taco Plate', description: 'Build your own happiness with fresh toppings.' }, { name: 'Hot Dog', description: 'A simple classic that never disappoints.' }, { name: 'Spaghetti Carbonara', description: 'Creamy, cheesy, and oh-so-satisfying.' }, { name: 'Tomato Basil Pasta', description: 'Simple, fresh, and bursting with Italian sunshine.' }, { name: 'Chicken Caesar Wrap', description: 'A healthy and delicious classic on the go.' }, { name: 'Fish and Chips', description: 'Crispy battered fish and golden fries. A seaside classic.' }, { name: 'Cajun Shrimp Bowl', description: 'Spicy, savory, and packed with flavor.' }, { name: 'Grilled Cheese Sandwich', description: 'Golden toasted bread with a gooey, cheesy center.' }, { name: 'Chicken Quesadilla', description: 'Cheesy, savory, and perfect for dipping.' }, { name: 'Falafel Wrap', description: 'A delicious and healthy Mediterranean delight.' }, { name: 'Pulled Pork Burger', description: 'Slow-cooked, tender, and smothered in BBQ sauce.' }, { name: 'Breakfast Burrito', description: 'All your breakfast favorites wrapped in a warm tortilla.' }, { name: 'Buffalo Wings', description: 'Tangy, spicy, and perfectly messy. Napkins required.' }, { name: 'Chili', description: 'A hearty bowl of warmth and spice. Comfort in every spoonful.' }, { name: 'Cobb Salad', description: 'A perfectly arranged masterpiece of flavors. Almost too pretty to eat.' }, { name: 'BBQ Ribs', description: 'Fall-off-the-bone tender. Get your hands dirty.' }, { name: 'Clam Chowder', description: 'A creamy, seaside classic. Perfect for a cool day.' }, { name: 'Mac and Cheese', description: 'The ultimate comfort food. Pure, cheesy bliss.' }, { name: 'Fried Green Tomatoes', description: 'A southern classic. Crispy, tangy, and delightful.' }, { name: 'Jambalaya', description: 'A spicy celebration of rice and flavor from the bayou.' }, { name: 'Shrimp Scampi', description: 'Garlicky, buttery shrimp over pasta. Simply elegant.' }, { name: 'Beef Stew', description: 'Slow-cooked perfection. A hug in a bowl.' }
            ]
        },
        
        staticPages: {
            // (정적 페이지 데이터는 변경 없음 - 그대로 유지)
            ko: {
                navHome: "홈", navAbout: "소개", navPrivacy: "개인정보 처리방침", navContact: "문의하기",
                about: `<h1>My Chef의 선택을 소개합니다</h1><img src="chef-intro.png" alt="My Chef's Choice" class="static-page-image"><section><h2>"오늘 뭐 먹지?"</h2><p>이 질문은 우리의 하루에서 끊임없이 반복됩니다. 때로는 즐거운 고민이지만, 때로는 사소한 스트레스가 되기도 하죠.</p><p><strong>"누가 대신 좀 정해줬으면 좋겠다!"</strong></p><p>My Chef의 선택은 바로 그 생각에서 시작되었습니다. 메뉴를 고민하는 시간을 아껴, 당신의 소중한 오늘을 더 즐겁게 보낼 수 있도록 돕고 싶었습니다.</p></section>`,
                privacy: `<h1>개인정보 처리방침</h1><section><p><strong>시행일: 2024-05-22</strong></p><p>My Chef's Choice(이하 '사이트')는 이용자의 개인정보를 매우 중요하게 생각하며, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법규를 준수하고 있습니다. 본 개인정보 처리방침을 통해 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.</p><h2>1. 광고</h2><p>본 사이트는 Google 애드센스 광고를 사용하고 있습니다. Google과 같은 제3자 광고 사업자는 쿠키를 사용하여 사용자의 웹사이트 방문 기록을 기반으로 맞춤형 광고를 제공할 수 있습니다. 사용자는 Google 광고 설정에서 맞춤형 광고를 비활성화할 수 있습니다.</p><h2>2. 쿠키</h2><p>본 사이트는 서비스 개선 및 통계 분석, 광고 게재를 위해 쿠키를 사용합니다. 쿠키는 이용자 컴퓨터에 저장되는 작은 데이터 조각으로, 이용자는 웹 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</p></section>`,
                contact: `<h1>문의하기</h1><section><h2>My Chef's Choice에 궁금한 점이 있으신가요?</h2><p>서비스 관련 문의사항이 있으시면 아래 이메일로 연락 주시기 바랍니다.</p><p><strong>공식 이메일:</strong> <a href="mailto:mychef.recommends@gmail.com">mychef.recommends@gmail.com</a></p></section>`
            },
            en: {
                navHome: "Home", navAbout: "About", navPrivacy: "Privacy Policy", navContact: "Contact",
                about: `<h1>About My Chef's Choice</h1><img src="chef-intro.png" alt="My Chef's Choice" class="static-page-image"><section><h2>"What should I eat today?"</h2><p>This question repeats endlessly in our day. Sometimes it's a pleasant dilemma, but other times it can be a minor stress.</p><p><strong>"I wish someone would just decide for me!"</strong></p><p>My Chef's Choice started from that very thought. We wanted to help you save time worrying about menus and enjoy your precious day more.</p></section>`,
                privacy: `<h1>Privacy Policy</h1><section><p><strong>Effective Date: 2024-05-22</strong></p><p>My Chef's Choice (the 'Site') values your privacy and complies with relevant regulations such as the Act on Promotion of Information and Communications Network Utilization and Information Protection, etc. This policy explains how we use your information and what measures we take to protect it.</p><h2>1. Advertising</h2><p>This Site uses Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website. You may opt out of personalized advertising by visiting Google's Ads Settings.</p><h2>2. Cookies</h2><p>This Site uses cookies for service improvement, statistical analysis, and ad delivery. Cookies are small data pieces stored on your computer. You can refuse to accept cookies by adjusting your browser settings. Refusing cookies may cause difficulties in using personalized services.</p></section>`,
                contact: `<h1>Contact Us</h1><section><h2>Do you have any questions about My Chef's Choice?</h2><p>If you have any inquiries regarding the service, please contact us at the email address below.</p><p><strong>Official Email:</strong> <a href="mailto:mychef.recommends@gmail.com">mychef.recommends@gmail.com</a></p></section>`
            }
        }
    };
    
    // --- 2. DOM 요소 및 상태 변수 ---
    // (기존 코드와 동일)
    let currentLang = 'ko';
    let selectedQuestions = [];
    let currentQuestionIndex = 0;

    const langSwitcher = document.getElementById('lang-switcher');
    const introTitle = document.getElementById('intro-title');
    const startBtn = document.getElementById('start-btn');
    const resultTitle = document.getElementById('result-title');
    const retryBtn = document.getElementById('retry-btn');
    const disclaimerText = document.getElementById('disclaimer-text');
    const introScreen = document.querySelector('.intro');
    const questionArea = document.getElementById('question-area');
    const chefImageEl = document.getElementById('chef-image');
    const foodNameEl = document.getElementById('food-name');
    const foodDescEl = document.getElementById('food-description');
    const disclaimer = document.getElementById('disclaimer');
    
    const mainContent = document.getElementById('main-content');
    const resultContainer = document.getElementById('result-container');
    const staticContent = document.getElementById('static-content');
    const navButtons = document.querySelectorAll('.nav-btn');

    // --- 3. 핵심 함수들 ---
    
    // (switchView 함수는 기존 코드와 동일)
    function switchView(viewName) {
        mainContent.classList.add('hidden');
        resultContainer.classList.add('hidden');
        staticContent.classList.add('hidden');
        disclaimer.classList.add('hidden');
        
        if (viewName === 'main') mainContent.classList.remove('hidden');
        else if (viewName === 'result') {
            resultContainer.classList.remove('hidden');
            disclaimer.classList.remove('hidden');
        } else if (viewName.startsWith('static-')) {
            const pageKey = viewName.split('-')[1];
            staticContent.innerHTML = translations.staticPages[currentLang][pageKey];
            staticContent.classList.remove('hidden');
        }
    }
    
    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        langSwitcher.querySelectorAll('button').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
        
        // ★★★★★ 2. 페이지 타이틀과 설명을 동적으로 변경하는 코드 추가 ★★★★★
        document.title = translations.pageMeta.title[lang];
        const descriptionTag = document.querySelector('meta[name="description"]');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', translations.pageMeta.description[lang]);
        }
        
        // (나머지 UI 텍스트 변경 코드는 그대로 유지)
        introTitle.textContent = translations.ui.intro_title[lang];
        startBtn.textContent = translations.ui.start_btn[lang];
        resultTitle.textContent = translations.ui.result_title[lang];
        retryBtn.textContent = translations.ui.retry_btn[lang];
        disclaimerText.textContent = translations.ui.disclaimer[lang];

        navButtons.forEach(btn => {
            const pageKey = btn.dataset.page;
            const textKey = 'nav' + pageKey.charAt(0).toUpperCase() + pageKey.slice(1);
            btn.textContent = translations.staticPages[lang][textKey];
        });

        const activeStaticPage = document.querySelector('.nav-btn.active')?.dataset.page;
        if (activeStaticPage && activeStaticPage !== 'home') {
            staticContent.innerHTML = translations.staticPages[currentLang][activeStaticPage];
        }
    }
    
    // (startGame, displayQuestion, handleOptionClick, getRecommendation, initializePage 함수는 기존 코드와 동일)
    function startGame() {
        switchView('main');
        introScreen.classList.add('hidden');
        questionArea.classList.remove('hidden');
        currentQuestionIndex = 0;
        
        const shuffled = [...translations.questions].sort(() => 0.5 - Math.random());
        selectedQuestions = shuffled.slice(0, 3);
        displayQuestion();
    }

    function displayQuestion() {
        const question = selectedQuestions[currentQuestionIndex];
        let currentOptions = [...question.options];
        
        if (question.isRandomOptions) {
            currentOptions = currentOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
        }

        const optionsHTML = currentOptions.map(opt => 
            `<button class="option-btn">${opt.text[currentLang]}</button>`
        ).join('');

        questionArea.innerHTML = `<div class="question-box"><h3>${question.text[currentLang]}</h3><div class="options">${optionsHTML}</div></div>`;
        document.querySelectorAll('.option-btn').forEach(btn => btn.addEventListener('click', handleOptionClick));
    }
    
    function handleOptionClick() {
        currentQuestionIndex++;
        if (currentQuestionIndex < selectedQuestions.length) {
            displayQuestion();
        } else {
            getRecommendation();
        }
    }

    function getRecommendation() {
        const foodList = translations.food[currentLang];
        const randomIndex = Math.floor(Math.random() * foodList.length);
        const recommendedFood = foodList[randomIndex];
        
        switchView('result');
        chefImageEl.src = 'chef-result.png';

        if (recommendedFood) {
            foodNameEl.textContent = recommendedFood.name;
            foodDescEl.textContent = recommendedFood.description;
        } else {
            foodNameEl.textContent = (currentLang === 'ko') ? '이런...' : 'Oops...';
            foodDescEl.textContent = (currentLang === 'ko') ? '오늘은 마땅한 메뉴를 찾지 못했군요.' : 'I couldn\'t find a suitable menu today.';
        }
    }
    
    function initializePage() {
        if (!introScreen.querySelector('.chef-image')) {
            const introChefImage = document.createElement('img');
            introChefImage.src = 'chef-intro.png';
            introChefImage.alt = 'A serious chef';
            introChefImage.className = 'chef-image';
            introScreen.prepend(introChefImage);
        }
    }

    // --- 4. 이벤트 리스너 ---
    // (기존 코드와 동일)
    startBtn.addEventListener('click', startGame);
    retryBtn.addEventListener('click', () => {
        switchView('main');
        introScreen.classList.remove('hidden');
        questionArea.classList.add('hidden');
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.nav-btn[data-page="home"]').classList.add('active');
    });

    langSwitcher.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const lang = e.target.dataset.lang;
            if (lang !== currentLang) setLanguage(lang);
        }
    });

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pageKey = e.target.dataset.page;
            navButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            if (pageKey === 'home') {
                switchView('main');
                introScreen.classList.remove('hidden');
                questionArea.classList.add('hidden');
            } else {
                switchView(`static-${pageKey}`);
            }
        });
    });

    // --- 5. 초기화 ---
    // (기존 코드와 동일)
    initializePage();
    setLanguage(currentLang); // 이 함수가 호출되면서 초기 타이틀이 설정됩니다.
    switchView('main');
    document.querySelector('.nav-btn[data-page="home"]').classList.add('active');
});
