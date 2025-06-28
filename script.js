document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 데이터베이스: 모든 텍스트를 한 곳에서 관리 ---
    const translations = {
        // UI 텍스트 (기존 로직)
        ui: {
            intro_title: { ko: "생각 멈추고 나에게 맡겨.", en: "Stop thinking. Leave it to me." },
            start_btn: { ko: "오늘은?", en: "Let's Start!" },
            result_title: { ko: "오늘은? 이거야!", en: "Today? It's this!" },
            retry_btn: { ko: "다시 추천받기", en: "Try Again" },
            disclaimer: { ko: "건강이 가장 중요합니다. 현재 건강을 위한 선택을 하세요.", en: "Your health is most important. Please make a healthy choice." }
        },
        // 질문 데이터 (기존 로직)
        questions: [
            { id: 'q_reason', text: {ko: '오늘 메뉴를 고민하는 진짜 이유는?', en: 'What\'s the real reason for your menu indecision?'}, options: [ { text: {ko: '가볍게 먹고 싶어서', en: 'I want something light'}, tags: ['#가벼운', '#건강한'] }, { text: {ko: '든든하게 먹고 싶어서', en: 'I want something heavy'}, tags: ['#든든한', '#푸짐한'] }, { text: {ko: '만들기 귀찮아서', en: 'I\'m too lazy to cook'}, tags: ['#간편한', '#배달'] } ]},
            { id: 'q_staple', text: {ko: '가장 익숙한 주식은 무엇인가요?', en: 'What\'s your go-to carb?'}, options: [ { text: {ko: '빵', en: 'Bread'}, tags: ['#빵', '#서양식'] }, { text: {ko: '면', en: 'Noodles'}, tags: ['#면요리'] }, { text: {ko: '밥', en: 'Rice'}, tags: ['#밥', '#아시안'] } ]},
            { id: 'q_hunger', text: {ko: '지금 허기진 정도는 어떤가요?', en: 'How hungry are you right now?'}, options: [ { text: {ko: '배가 너무 고파요', en: 'I\'m starving'}, tags: ['#푸짐한'] }, { text: {ko: '그냥 밥 먹을 때라서', en: 'It\'s just mealtime'}, tags: ['#적당한'] }, { text: {ko: '눈앞에 음식이 떠다녀요', en: 'I\'m craving something special'}, tags: ['#기분전환'] } ]},
            { id: 'q_weather', text: {ko: '지금 날씨는 어떤가요?', en: 'How\'s the weather?'}, options: [ { text: {ko: '흐림', en: 'Cloudy'}, tags: ['#따뜻한', '#국물'] }, { text: {ko: '맑음', en: 'Sunny'}, tags: ['#상쾌한', '#가벼운'] }, { text: {ko: '비 혹은 눈', en: 'Rainy or Snowy'}, tags: ['#따뜻한', '#배달', '#집밥'] } ]},
            { id: 'q_color', text: {ko: '마음에 드는 색깔을 하나 골라보세요.', en: 'Pick a color you like.'}, isColor: true, options: [ { text: {ko: '빨강', en: 'Red'} }, { text: {ko: '주황', en: 'Orange'} }, { text: {ko: '노랑', en: 'Yellow'} }, { text: {ko: '초록', en: 'Green'} }, { text: {ko: '파랑', en: 'Blue'} }, { text: {ko: '보라', en: 'Purple'} }, { text: {ko: '분홍', en: 'Pink'} }, { text: {ko: '검정', en: 'Black'} } ]}
        ],
        // 음식 데이터 (기존 로직 - 단, en 버전 태그는 한글로 유지하여 매칭되도록 함)
        food: {
            ko: [ { name: '스시', description: '넌 지금 와사비가 필요해.', tags: ['#밥', '#아시안', '#상쾌한', '#집중', '#외식'] }, { name: '갈비', description: '달콤하고 진한 맛을 느껴봐.', tags: ['#밥', '#한식', '#푸짐한', '#보상', '#팀워크', '#외식'] } /* ... 나머지 한국 음식 데이터 ... */ ],
            en: [ { name: 'Sushi', description: 'You need some wasabi right now.', tags: ['#밥', '#아시안', '#상쾌한', '#집중', '#외식'] }, { name: 'Galbi (Korean BBQ Ribs)', description: 'Feel the sweet and rich flavor.', tags: ['#밥', '#한식', '#푸짐한', '#보상', '#팀워크', '#외식'] } /* ... 나머지 영어 음식 데이터 ... */ ]
        },
        
        // ★★★ 추가된 부분: 소개, 개인정보, 문의 페이지 콘텐츠 ★★★
        staticPages: {
            ko: {
                // 네비게이션 버튼 텍스트
                navHome: "홈",
                navAbout: "소개",
                navPrivacy: "개인정보 처리방침",
                navContact: "문의하기",
                // 페이지 HTML 콘텐츠
                about: `
                    <h1>My Chef를 소개합니다</h1>
                    <img src="chef-intro.png" alt="My Chef" class="static-page-image">
                    <section>
                        <h2>"오늘 뭐 먹지?"</h2>
                        <p>이 질문은 우리의 하루에서 끊임없이 반복됩니다. 때로는 즐거운 고민이지만, 때로는 사소한 스트레스가 되기도 하죠.</p>
                        <p><strong>"누가 대신 좀 정해줬으면 좋겠다!"</strong></p>
                        <p>My Chef는 바로 그 생각에서 시작되었습니다. 메뉴를 고민하는 시간을 아껴, 당신의 소중한 오늘을 더 즐겁게 보낼 수 있도록 돕고 싶었습니다.</p>
                    </section>
                `,
                privacy: `
                    <h1>개인정보 처리방침</h1>
                    <section>
                        <p><strong>시행일: 2024-05-22</strong></p>
                        <p>My Chef(이하 '사이트')는 이용자의 개인정보를 매우 중요하게 생각하며, 관련 법규를 준수하고 있습니다. 본 개인정보 처리방침을 통해 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.</p>
                        <h2>1. 광고</h2>
                        <p>본 사이트는 Google 애드센스 광고를 사용하고 있습니다. Google과 같은 제3자 광고 사업자는 쿠키를 사용하여 사용자의 웹사이트 방문 기록을 기반으로 맞춤형 광고를 제공할 수 있습니다. 사용자는 Google 광고 설정에서 맞춤형 광고를 비활성화할 수 있습니다.</p>
                        <h2>2. 쿠키</h2>
                        <p>본 사이트는 서비스 개선 및 통계 분석, 광고 게재를 위해 쿠키를 사용합니다. 쿠키는 이용자 컴퓨터에 저장되는 작은 데이터 조각으로, 이용자는 웹 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.</p>
                    </section>
                `,
                contact: `
                    <h1>문의하기</h1>
                    <section>
                        <h2>My Chef에 궁금한 점이 있으신가요?</h2>
                        <p>서비스 관련 문의사항이 있으시면 아래 이메일로 연락 주시기 바랍니다.</p>
                        <p><strong>공식 이메일:</strong> <a href="mailto:mychef.recommends@gmail.com">mychef.recommends@gmail.com</a></p>
                    </section>
                `
            },
            en: {
                navHome: "Home",
                navAbout: "About",
                navPrivacy: "Privacy Policy",
                navContact: "Contact",
                about: `
                    <h1>About My Chef</h1>
                    <img src="chef-intro.png" alt="My Chef" class="static-page-image">
                    <section>
                        <h2>"What should I eat today?"</h2>
                        <p>This question repeats endlessly in our day. Sometimes it's a pleasant dilemma, but other times it can be a minor stress.</p>
                        <p><strong>"I wish someone would just decide for me!"</strong></p>
                        <p>My Chef started from that very thought. We wanted to help you save time worrying about menus and enjoy your precious day more.</p>
                    </section>
                `,
                privacy: `
                    <h1>Privacy Policy</h1>
                    <section>
                        <p><strong>Effective Date: 2024-05-22</strong></p>
                        <p>My Chef (the 'Site') values your privacy and complies with relevant regulations. This policy explains how we use your information and what measures we take to protect it.</p>
                        <h2>1. Advertising</h2>
                        <p>This Site uses Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website. You may opt out of personalized advertising by visiting Google's Ads Settings.</p>
                        <h2>2. Cookies</h2>
                        <p>This Site uses cookies for service improvement, statistical analysis, and ad delivery. Cookies are small data pieces stored on your computer. You can refuse to accept cookies by adjusting your browser settings.</p>
                    </section>
                `,
                contact: `
                    <h1>Contact Us</h1>
                    <section>
                        <h2>Do you have any questions about My Chef?</h2>
                        <p>If you have any inquiries regarding the service, please contact us at the email address below.</p>
                        <p><strong>Official Email:</strong> <a href="mailto:mychef.recommends@gmail.com">mychef.recommends@gmail.com</a></p>
                    </section>
                `
            }
        }
    };
    
    // --- 2. DOM 요소 및 상태 변수 ---
    let currentLang = 'ko';
    let selectedQuestions = [];
    let currentQuestionIndex = 0;
    let userTags = [];

    // 기존 DOM 요소
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

    // ★★★ 추가된 DOM 요소 ★★★
    const mainContent = document.getElementById('main-content');
    const resultContainer = document.getElementById('result-container');
    const staticContent = document.getElementById('static-content');
    const navButtons = document.querySelectorAll('.nav-btn');


    // --- 3. 핵심 함수들 ---

    // ★★★ 모든 뷰를 관리하는 통합 함수 ★★★
    function switchView(viewName) {
        // 모든 뷰 영역을 일단 숨긴다
        mainContent.classList.add('hidden');
        resultContainer.classList.add('hidden');
        staticContent.classList.add('hidden');
        disclaimer.classList.add('hidden'); // 결과 화면의 하단 문구
        
        // 요청된 뷰만 보여준다
        if (viewName === 'main') {
            mainContent.classList.remove('hidden');
        } else if (viewName === 'result') {
            resultContainer.classList.remove('hidden');
            disclaimer.classList.remove('hidden');
        } else if (viewName.startsWith('static-')) {
            const pageKey = viewName.split('-')[1];
            staticContent.innerHTML = translations.staticPages[currentLang][pageKey];
            staticContent.classList.remove('hidden');
        }
    }
    
    // 언어 설정 함수 (기존 + SPA 기능 통합)
    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        langSwitcher.querySelectorAll('button').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
        
        // 메뉴 추천 관련 UI 텍스트 업데이트
        introTitle.textContent = translations.ui.intro_title[lang];
        startBtn.textContent = translations.ui.start_btn[lang];
        resultTitle.textContent = translations.ui.result_title[lang];
        retryBtn.textContent = translations.ui.retry_btn[lang];
        disclaimerText.textContent = translations.ui.disclaimer[lang];

        // ★ 추가: 네비게이션 버튼 텍스트 변경
        navButtons.forEach(btn => {
            const pageKey = btn.dataset.page;
            const textKey = 'nav' + pageKey.charAt(0).toUpperCase() + pageKey.slice(1);
            btn.textContent = translations.staticPages[lang][textKey];
        });

        // ★ 추가: 현재 보고 있는 정적 페이지가 있다면 언어에 맞게 새로고침
        if (!staticContent.classList.contains('hidden')) {
            const currentPageKey = document.querySelector('.nav-btn.active')?.dataset.page;
            if(currentPageKey && currentPageKey !== 'home') {
                 staticContent.innerHTML = translations.staticPages[currentLang][currentPageKey];
            }
        }
    }
    
    function startGame() {
        switchView('main'); // 질문 영역이 main-content 안에 있으므로 main을 보여줌
        introScreen.classList.add('hidden');
        questionArea.classList.remove('hidden');
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
        if (currentQuestionIndex < selectedQuestions.length) { 
            displayQuestion(); 
        } else { 
            getRecommendation(); 
        }
    }

    function getRecommendation() {
        let bestMatch = { food: null, score: -1 };
        
        const foodList = translations.food[currentLang];
        foodList.forEach(food => {
            const uniqueUserTags = [...new Set(userTags)];
            let currentScore = 0;
            // 음식의 태그들이 사용자가 선택한 태그를 얼마나 포함하는지 계산
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
        
        switchView('result'); // 결과 화면으로 전환
        
        chefImageEl.src = 'chef-result.png';

        if (bestMatch.food) {
            foodNameEl.textContent = bestMatch.food.name;
            foodDescEl.textContent = bestMatch.food.description;
        } else {
            foodNameEl.textContent = (currentLang === 'ko') ? '이런...' : 'Oops...';
            foodDescEl.textContent = (currentLang === 'ko') ? '오늘은 마땅한 메뉴를 찾지 못했군요. 다시 시도해보시죠.' : 'I couldn\'t find a suitable menu today. Please try again.';
        }
    }
    
    function initializePage() {
        const introChefImage = document.createElement('img');
        introChefImage.src = 'chef-intro.png';
        introChefImage.alt = 'A serious chef';
        introChefImage.className = 'chef-image';
        introScreen.prepend(introChefImage);
    }

    // --- 4. 이벤트 리스너 ---
    startBtn.addEventListener('click', startGame);
    retryBtn.addEventListener('click', () => {
        switchView('main');
        introScreen.classList.remove('hidden');
        questionArea.classList.add('hidden');
    });

    langSwitcher.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const lang = e.target.dataset.lang;
            if (lang !== currentLang) { setLanguage(lang); }
        }
    });

    // ★★★ 추가: 하단 네비게이션 버튼 이벤트 리스너 ★★★
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pageKey = e.target.dataset.page;
            // 모든 버튼에서 active 클래스 제거
            navButtons.forEach(b => b.classList.remove('active'));
            // 클릭된 버튼에만 active 클래스 추가
            e.target.classList.add('active');

            if (pageKey === 'home') {
                // 홈 버튼 클릭 시, 메인 추천 화면으로 돌아감
                switchView('main');
                introScreen.classList.remove('hidden');
                questionArea.classList.add('hidden');
            } else {
                // 다른 버튼 클릭 시, 해당 정적 페이지를 보여줌
                switchView(`static-${pageKey}`);
            }
        });
    });

    // --- 5. 초기화 ---
    initializePage();
    setLanguage(currentLang);
    switchView('main'); // 시작 시 메인 뷰를 보여줌
    document.querySelector('.nav-btn[data-page="home"]').classList.add('active'); // 홈 버튼을 기본 활성 상태로
});
