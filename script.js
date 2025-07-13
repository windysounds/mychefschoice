document.addEventListener('DOMContentLoaded', () => {

    // --- 데이터 영역 ---
    const translations = {
        pageMeta: { title: { ko: "오늘의 메뉴 추천 | My Chef의 선택", en: "Menu Recommendation | My Chef's Choice" }, description: { ko: "선택장애 해결! 버튼 하나로 점심, 저녁 메뉴를 랜덤으로 추천받으세요. 한식, 중식, 일식, 양식 등 다양한 메뉴를 지금 바로 확인해보세요.", en: "Can't decide what to eat? Get random menu recommendations for lunch and dinner with a single click. Korean, Chinese, Japanese, Western, and more!" } },
        ui: { 
            intro_title: { ko: "생각 멈추고 나에게 맡겨.", en: "Stop thinking. Leave it to me." }, 
            start_btn: { ko: "오늘은?", en: "Let's Start!" }, 
            result_title: { ko: "오늘은? 이거야!", en: "Today? It's this!" }, 
            retry_btn: { ko: "다시 추천받기", en: "Try Again" }, 
            disclaimer: { ko: "건강이 가장 중요합니다. 현재 건강을 위한 선택을 하세요.", en: "Your health is most important. Please make a healthy choice." },
            
            standalone_search_title: { ko: "너의 선택은?", en: "Your Choice?" },
            menu_placeholder: { ko: "메뉴 입력 (예: 파스타)", en: "Enter menu (e.g., Pasta)" },
            location_placeholder: { ko: "지역 입력 (예: 홍대, 강남역)", en: "Enter location (e.g., NYC)" },
            search_btn_text: { ko: "맛집 검색", en: "Search Restaurants" },
            alert_msg: { ko: "메뉴와 지역을 모두 입력해주세요!", en: "Please enter both menu and location!" }
        },
        questions: [ { id: 'q_reason', text: {ko: '오늘 메뉴를 고민하는 진짜 이유는?', en: 'What\'s the real reason for your menu indecision?'}, options: [ { text: {ko: '가볍게 먹고 싶어서', en: 'I want something light'} }, { text: {ko: '든든하게 먹고 싶어서', en: 'I want something heavy'} }, { text: {ko: '만들기 귀찮아서', en: 'I\'m too lazy to cook'} } ]}, { id: 'q_staple', text: {ko: '가장 익숙한 주식은 무엇인가요?', en: 'What\'s your go-to carb?'}, options: [ { text: {ko: '빵', en: 'Bread'} }, { text: {ko: '면', en: 'Noodles'} }, { text: {ko: '밥', en: 'Rice'} } ]}, { id: 'q_mood', text: {ko: '오늘 기분은 어때?', en: 'How are you feeling today?'}, options: [ { text: {ko: '행복해', en: 'Happy'} }, { text: {ko: '심심해', en: 'Bored'} }, { text: {ko: '지쳤어', en: 'Tired'} } ]}, { id: 'q_weather', text: {ko: '지금 날씨는 어떤가요?', en: 'How\'s the weather?'}, options: [ { text: {ko: '흐림', en: 'Cloudy'} }, { text: {ko: '맑음', en: 'Sunny'} }, { text: {ko: '비 혹은 눈', en: 'Rainy or Snowy'} } ]}, { id: 'q_drink', text: {ko: '식사 후에 마시고 싶은 건?', en: 'What would you like to drink after your meal?'}, isRandomOptions: true, options: [ { text: {ko: '커피', en: 'Coffee'} }, { text: {ko: '차', en: 'Tea'} }, { text: {ko: '시원한 물', en: 'Cold Water'} }, { text: {ko: '뜨거운 물', en: 'Hot Water'} }, { text: {ko: '탄산 음료', en: 'Soda'} }, { text: {ko: '에너지 드링크', en: 'Energy Drink'} } ]}, { id: 'q_dessert', text: {ko: '디저트를 먹는다면 뭐가 좋겠어?', en: 'If you were to have dessert, what would you choose?'}, options: [ { text: {ko: '초콜릿', en: 'Chocolate'} }, { text: {ko: '과자', en: 'Cookies'} }, { text: {ko: '스무디', en: 'Smoothie'} } ]}, { id: 'q_sport', text: {ko: '갑자기 끌리는 스포츠는?', en: 'Which sport are you suddenly drawn to?'}, isRandomOptions: true, options: [ { text: {ko: '야구', en: 'Baseball'} }, { text: {ko: '농구', en: 'Basketball'} }, { text: {ko: '배구', en: 'Volleyball'} }, { text: {ko: '축구', en: 'Soccer'} }, { text: {ko: '테니스', en: 'Tennis'} }, { text: {ko: '배드민턴', en: 'Badminton'} }, { text: {ko: '핸드볼', en: 'Handball'} } ]}, { id: 'q_movie', text: {ko: '영화를 본다면 장르는?', en: 'If you were to watch a movie, what genre?'}, isRandomOptions: true, options: [ { text: {ko: '로맨스', en: 'Romance'} }, { text: {ko: '판타지', en: 'Fantasy'} }, { text: {ko: '공포', en: 'Horror'} }, { text: {ko: '액션', en: 'Action'} }, { text: {ko: '코미디', en: 'Comedy'} }, { text: {ko: '드라마', en: 'Drama'} } ]}, { id: 'q_animal', text: {ko: '친구가 되고 싶은 동물은?', en: 'Which animal would you want as a friend?'}, isRandomOptions: true, options: [ { text: {ko: '코끼리', en: 'Elephant'} }, { text: {ko: '호랑이', en: 'Tiger'} }, { text: {ko: '사자', en: 'Lion'} }, { text: {ko: '말', en: 'Horse'} }, { text: {ko: '강아지', en: 'Dog'} }, { text: {ko: '고양이', en: 'Cat'} }, { text: {ko: '도마뱀', en: 'Lizard'} }, { text: {ko: '앵무새', en: 'Parrot'} } ]}, { id: 'q_transport', text: {ko: '선호하는 이동 수단은?', en: 'What is your preferred mode of transport?'}, options: [ { text: {ko: '비행기', en: 'Airplane'} }, { text: {ko: '자동차', en: 'Car'} }, { text: {ko: '걷기', en: 'Walking'} } ]}, { id: 'q_scientist', text: {ko: '과학자가 된다면?', en: 'If you were a scientist?'}, options: [ { text: {ko: '우주 개척', en: 'Space Exploration'} }, { text: {ko: '심해 탐사', en: 'Deep Sea Exploration'} }, { text: {ko: '자연 보호', en: 'Nature Conservation'} } ]} ],
        food: {
            ko: [
                { key: 'sushi', name: '스시', description: '넌 지금 와사비가 필요해.' }, { key: 'galbi', name: '갈비', description: '달콤하고 진한 맛을 느껴봐.' }, { key: 'bread', name: '빵 (베이커리)', description: '빵 하나면 충분해. 그래야 내일 고민 안 할 거야.' }, { key: 'sandwich', name: '샌드위치', description: '가장 맛있는 조합은 네 입이 알고 있어.' }, { key: 'chicken', name: '치킨', description: '언제나 옳아. 바삭한 튀김을 느껴봐.' }, { key: 'kimbap', name: '김밥', description: '널 위한 선물 세트야. 야채를 챙겨야 할 때가 됐지?' }, { key: 'pasta', name: '파스타', description: '면이 주는 위로를 느껴봐.' }, { key: 'pizza', name: '피자', description: '다 함께 즐기는 최고의 선택!' }, { key: 'ramen', name: '라면', description: '세상에서 가장 완벽한 국물 요리 중 하나.' }, { key: 'doenjang', name: '된장찌개', description: '구수한 맛이 일품인 한국인의 소울푸드.' }, { key: 'bibimbap', name: '비빔밥', description: '다양한 야채와 고추장의 조화, 건강하고 든든하게.' }, { key: 'tteokbokki', name: '떡볶이', description: '매콤달콤한 맛으로 스트레스를 날려버려.' }, { key: 'jeyuk', name: '제육볶음', description: '밥도둑이 여기 있었네. 말이 필요 없는 맛.' }, { key: 'budae', name: '부대찌개', description: '햄과 라면사리의 환상적인 콜라보!' }, { key: 'jajangmyeon', name: '짜장면', description: '고민될 땐 그냥 짜장면으로 가자.' }, { key: 'jjamppong', name: '짬뽕', description: '얼큰한 국물이 생각날 때, 최고의 선택.' }, { key: 'tangsuyuk', name: '탕수육', description: '바삭함과 달콤함, 둘 다 놓칠 수 없지.' }, { key: 'malatang', name: '마라탕', description: '요즘 대세! 얼얼한 맛에 중독될 준비 됐어?' }, { key: 'donkatsu', name: '돈까스', description: '바삭한 튀김옷과 두툼한 고기의 완벽한 만남.' }, { key: 'curry', name: '카레', description: '향긋한 카레 향이 입맛을 돋울 거야.' }, { key: 'conveniencestore', name: '편의점 만찬', description: '오늘의 셰프는 바로 너! 최고의 조합을 만들어봐.' }, { key: 'friedrice', name: '볶음밥', description: '냉장고에 남은 재료도 훌륭한 요리가 될 수 있지.' }, { key: 'hamburger', name: '햄버거', description: '클래식한 맛의 정석, 빠르게 에너지를 채워봐.' }, { key: 'dosirak', name: '도시락', description: '정성스럽게 담은 한 끼 식사, 간단하고 든든하게.' }
            ],
            en: [
                { key: 'sushi', name: 'Sushi', description: 'You need some wasabi right now.' }, { key: 'galbi', name: 'Galbi (Korean BBQ Ribs)', description: 'Feel the sweet and rich flavor.' }, { key: 'bread', name: 'Bakery Bread', description: 'One bread is enough. So you won\'t worry tomorrow.' }, { key: 'sandwich', name: 'Sandwich', description: 'Your mouth knows the best combination.' }, { key: 'chicken', name: 'Fried Chicken', description: 'It\'s always right. Feel the crispy crust.' }, { key: 'pasta', name: 'Pasta', description: 'Feel the comfort that noodles give.' }, { key: 'pizza', name: 'Pizza', description: 'The best choice to enjoy together!' }, { key: 'ramen', name: 'Ramen', description: 'One of the most perfect soup dishes in the world.' }, { key: 'bibimbap', name: 'Bibimbap', description: 'A harmony of various vegetables, healthy and satisfying.' }, { key: 'tteokbokki', name: 'Tteokbokki', description: 'Blow away stress with its spicy and sweet taste.' }, { key: 'jajangmyeon', name: 'Jajangmyeon', description: 'When in doubt, just go for Jajangmyeon.' }, { key: 'malatang', name: 'Malatang', description: 'The current trend! Ready to get addicted to the numbing taste?' }, { key: 'curry', name: 'Curry', description: 'The fragrant curry smell will whet your appetite.' }, { key: 'friedrice', name: 'Fried Rice', description: 'Leftover ingredients can become a great dish.' }, { key: 'hamburger', name: 'Hamburger', description: 'The standard of classic taste, quickly fill up your energy.' }, { key: 'donkatsu', name: 'Donkatsu', description: 'The perfect meeting of crispy batter and thick meat.' }, { key: 'tangsuyuk', name: 'Sweet and Sour Pork', description: 'Crispiness and sweetness, can\'t miss both.' }
            ]
        },
        staticPages: {
            ko: { navHome: "홈", navBlog: "My Chef의 이야기", navAbout: "소개", navPrivacy: "개인정보 처리방침", navContact: "문의하기", blogTitle: "My Chef의 이야기", about: `<h1>My Chef의 선택을 소개합니다</h1><img src="chef-intro.png" alt="My Chef's Choice" class="static-page-image"><section><h2>"오늘 뭐 먹지?"</h2><p>이 질문은 우리의 하루에서 끊임없이 반복됩니다. 때로는 즐거운 고민이지만, 때로는 사소한 스트레스가 되기도 하죠.</p><p><strong>"누가 대신 좀 정해줬으면 좋겠다!"</strong></p><p>My Chef의 선택은 바로 그 생각에서 시작되었습니다. 메뉴를 고민하는 시간을 아껴, 당신의 소중한 오늘을 더 즐겁게 보낼 수 있도록 돕고 싶었습니다.</p></section>`, privacy: `<h1>개인정보 처리방침</h1><section><p><strong>시행일: 2025-07-01</strong></p><p>My Chef's Choice(이하 '사이트')는 이용자의 개인정보를 매우 중요하게 생각하며, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법규를 준수하고 있습니다. 본 개인정보 처리방침을 통해 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.</p><h2>1. 광고</h2><p>본 사이트는 Google 애드센스 광고를 사용하고 있습니다. Google과 같은 제3자 광고 사업자는 쿠키를 사용하여 사용자의 웹사이트 방문 기록을 기반으로 맞춤형 광고를 제공할 수 있습니다. 사용자는 Google 광고 설정에서 맞춤형 광고를 비활성화할 수 있습니다.</p><h2>2. 쿠키</h2><p>본 사이트는 서비스 개선 및 통계 분석, 광고 게재를 위해 쿠키를 사용합니다. 쿠키는 이용자 컴퓨터에 저장되는 작은 데이터 조각으로, 이용자는 웹 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</p></section>`, contact: `<h1>문의하기</h1><section><h2>My Chef's Choice에 궁금한 점이 있으신가요?</h2><p>서비스 관련 문의사항이 있으시면 아래 이메일로 연락 주시기 바랍니다.</p><p><strong>공식 이메일:</strong> <a href="mailto:mychef.recommends@gmail.com">mychef.recommends@gmail.com</a></p></section>` },
            en: { navHome: "Home", navBlog: "My Chef's Story", navAbout: "About", navPrivacy: "Privacy Policy", navContact: "Contact", blogTitle: "My Chef's Story", about: `<h1>About My Chef's Choice</h1><img src="chef-intro.png" alt="My Chef's Choice" class="static-page-image"><section><h2>"What should I eat today?"</h2><p>This question repeats endlessly in our day. Sometimes it's a pleasant dilemma, but other times it can be a minor stress.</p><p><strong>"I wish someone would just decide for me!"</strong></p><p>My Chef's Choice started from that very thought. We wanted to help you save time worrying about menus and enjoy your precious day more.</p></section>`, privacy: `<h1>Privacy Policy</h1><section><p><strong>Effective Date: 2025-07-01</strong></p><p>My Chef's Choice (the 'Site') values your privacy and complies with relevant regulations such as the Act on Promotion of Information and Communications Network Utilization and Information Protection, etc. This policy explains how we use your information and what measures we take to protect it.</p><h2>1. Advertising</h2><p>This Site uses Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website. You may opt out of personalized advertising by visiting Google's Ads Settings.</p><h2>2. Cookies</h2><p>This Site uses cookies for service improvement, statistical analysis, and ad delivery. Cookies are small data pieces stored on your computer. You can refuse to accept cookies by adjusting your browser settings. Refusing cookies may cause difficulties in using personalized services.</p></section>`, contact: `<h1>Contact Us</h1><section><h2>Do you have any questions about My Chef's Choice?</h2><p>If you have any inquiries regarding the service, please contact us at the email address below.</p><p><strong>Official Email:</strong> <a href="mailto:mychef.recommends@gmail.com">mychef.recommends@gmail.com</a></p></section>` },
            blog: [ { id: 'paradox-of-choice', date: '2025-07-01', thumbnail_img: 'blog-image-1.png', title_ko: "선택의 역설: 뷔페를 즐기지 못하는 셰프의 이야기", title_en: "The Paradox of Choice: A Chef's Story of Not Enjoying the Buffet", summary_ko: "풍요로운 뷔페 앞에서 오히려 선택의 어려움을 겪는 이유, 그리고 예상치 못한 기쁨에 대하여.", summary_en: "About the difficulty of choice in front of a rich buffet, and the joy of the unexpected.", contents_html_ko: `<img src="blog-image-1.png" alt="뷔페 앞의 셰프" class="blog-post-image"><h2>뷔페라는 달콤한 거짓말</h2><p>세상에는 수많은 음식이 있고, 우리는 매일 선택의 기로에 섭니다. 그 선택은 때로 즐거운 설렘을 주지만, 때로는 보이지 않는 스트레스가 되기도 합니다. 저는 뷔페를 좋아합니다. 언뜻 보면 선택의 폭을 무한히 넓혀주는 관대한 공간처럼 보이기 때문이죠. 하지만 정말 그럴까요? 사실 뷔페에 가는 것은 '뷔페'라는 단 하나의 음식을 먹으러 가는 것과 같습니다. 우리는 여전히 한정된 시간과 위장 속에서, 나의 허기짐을 가장 만족시켜줄 단 몇 가지의 조합을 골라내야 하는 또 다른 선택의 문제와 마주하게 됩니다.</p><h2>기대라는 무거운 짐</h2><p>우리가 하는 모든 '선택'에는 '기대'라는 그림자가 따라붙습니다. 큰마음 먹고 찾아간 맛집, 고심 끝에 고른 메뉴. 그 선택이 행복한 기대를 충족시켜주지 못했을 때, 우리는 실망하고 때로는 자신을 탓하기도 합니다. "아, 왜 이걸 선택했을까!" 하고 말이죠. 기대가 클수록, 실망의 무게도 무거워집니다.</p><h2>우연히 발견한 최고의 한 끼</h2><p>반대로 이런 순간도 있습니다. 시간에 쫓겨, 혹은 아무런 정보 없이 그저 눈앞에 보이는 음식을 선택했을 때. 별 기대 없이 한 입 베어 문 길거리의 닭꼬치가 예상을 뛰어넘는 환상적인 맛을 선사했던 경험. 기대하지 않았기에, 그 기쁨은 훨씬 더 크고 순수하게 다가옵니다.</p><h2>'My Chef의 선택'이 존재하는 이유</h2><p>저는 바로 그 '예상치 못한 기쁨의 순간'을 여러분과 공유하고 싶었습니다. 'My Chef의 선택'은 여러분에게서 '고심하는 선택'과 '과도한 기대'라는 짐을 덜어드립니다. 대신, 저희는 약간의 무작위성과 우연을 선물합니다. 오늘, 당신의 선택이 무엇이 될지는 아무도 모릅니다. 하지만 어쩌면 그 기대하지 않았던 메뉴가, 당신의 하루를 가장 빛나게 해 줄 최고의 한 끼가 될지도 모릅니다. 저희와 함께, 그 즐거운 우연을 만나보시겠어요?</p>`, contents_html_en: `<img src="blog-image-1.png" alt="Chef in front of a buffet" class="blog-post-image"><h2>The Sweet Lie of the Buffet</h2><p>The world is full of countless foods, and every day, we stand at a crossroads of choice. Sometimes that choice brings joyful anticipation, but at other times, it becomes an unseen stress. I like buffets. At first glance, they seem like generous spaces that infinitely widen the scope of choice. But is that really true? In reality, going to a buffet is like choosing to eat a single dish called "buffet." We still face another problem of choice within the confines of limited time and stomach capacity, having to select just a few combinations that will best satisfy our hunger.</p><h2>The Weight of Expectation</h2><p>Every 'choice' we make is followed by the shadow of 'expectation.' A highly-rated restaurant we decided to visit, a menu item chosen after much deliberation. When that choice fails to meet our happy expectations, we feel disappointed and sometimes even blame ourselves. "Ah, why did I choose this!" we exclaim. The greater the expectation, the heavier the weight of disappointment.</p><h2>The Best Meal Found by Chance</h2><p>Conversely, there are moments like this. When we choose a food simply because it's in front of us, pressed for time or without any prior information. The experience of taking a bite of a street-side chicken skewer without any expectation, only to find it fantastically delicious, far beyond what you imagined. Because there was no expectation, the joy comes as something much larger and purer.</p><h2>The Reason 'My Chef's Choice' Exists</h2><p>It is precisely that 'moment of unexpected joy' that I wanted to share with you. 'My Chef's Choice' relieves you of the burden of 'agonizing choice' and 'excessive expectation.' Instead, we offer you a gift of slight randomness and serendipity. No one knows what your choice will be today. But perhaps, that unexpected menu item might just become the best meal to brighten your entire day. Would you like to encounter that delightful coincidence with us?</p>` } ]
        }
    };

    // --- 상태 관리 변수 ---
    let currentLang = 'ko';
    let selectedQuestions = [];
    let currentQuestionIndex = 0;
    let currentRecommendedFoodKey = null;

    // --- HTML 요소 선택 ---
    const mainContent = document.getElementById('main-content');
    const resultContainer = document.getElementById('result-container');
    const pageContent = document.getElementById('page-content');
    const disclaimer = document.getElementById('disclaimer');
    const navButtons = document.querySelectorAll('.nav-btn');
    const langSwitcher = document.getElementById('lang-switcher');
    const standaloneSearchTitle = document.getElementById('standalone-search-title');
    const standaloneMenuInput = document.getElementById('standalone-menu-input');
    const standaloneLocationInput = document.getElementById('standalone-location-input');
    const standaloneSearchBtn = document.getElementById('standalone-search-btn');

    // --- 함수 정의 ---
    function switchView(viewName, dataId = null) {
        mainContent.classList.add('hidden');
        resultContainer.classList.add('hidden');
        pageContent.classList.add('hidden');
        disclaimer.classList.add('hidden');
        
        if (viewName === 'home') {
            currentRecommendedFoodKey = null;
            mainContent.classList.remove('hidden');
            mainContent.querySelector('.intro').classList.remove('hidden');
            mainContent.querySelector('#question-area').classList.add('hidden');
        } else if (viewName === 'result') {
            displayRecommendation();
        } else if (viewName === 'blog') {
            displayBlogPosts(currentLang);
            pageContent.classList.remove('hidden');
        } else if (viewName === 'blog-post') {
            displayFullBlogPost(dataId, currentLang);
            pageContent.classList.remove('hidden');
        } else if (['about', 'privacy', 'contact'].includes(viewName)) {
            displayStaticPage(viewName, currentLang);
            pageContent.classList.remove('hidden');
        }
    }
    
    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        langSwitcher.querySelectorAll('button').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
        
        document.title = translations.pageMeta.title[lang];
        document.querySelector('meta[name="description"]').setAttribute('content', translations.pageMeta.description[lang]);
        
        const ui_t = translations.ui;
        const introTitle = document.getElementById('intro-title');
        const startBtn = document.getElementById('start-btn');
        if (introTitle) introTitle.textContent = ui_t.intro_title[lang];
        if (startBtn) startBtn.textContent = ui_t.start_btn[lang];
        
        const disclaimerText = document.getElementById('disclaimer-text');
        if(disclaimerText) disclaimerText.textContent = ui_t.disclaimer[lang];

        navButtons.forEach(btn => {
            const pageKey = btn.dataset.page;
            const textKey = 'nav' + pageKey.charAt(0).toUpperCase() + pageKey.slice(1);
            if (translations.staticPages[lang][textKey]) {
                btn.textContent = translations.staticPages[lang][textKey];
            }
        });

        if (standaloneSearchTitle) standaloneSearchTitle.textContent = ui_t.standalone_search_title[lang];
        if (standaloneMenuInput) standaloneMenuInput.placeholder = ui_t.menu_placeholder[lang];
        if (standaloneLocationInput) standaloneLocationInput.placeholder = ui_t.location_placeholder[lang];
        if (standaloneSearchBtn) standaloneSearchBtn.textContent = ui_t.search_btn_text[lang];

        if (!pageContent.classList.contains('hidden')) {
            const pageType = pageContent.dataset.pageType;
            const pageId = pageContent.dataset.pageId;
            if (pageType === 'blog-list') displayBlogPosts(lang);
            else if (pageType === 'blog-post') displayFullBlogPost(pageId, lang);
            else if (pageType === 'static') displayStaticPage(pageId, lang);
        } else if (!resultContainer.classList.contains('hidden') && currentRecommendedFoodKey) {
            updateRecommendationText(lang);
        }
    }
    
    function updateRecommendationText(lang) {
        const foodData = translations.food[lang].find(f => f.key === currentRecommendedFoodKey);
        if (!foodData) return;

        resultContainer.querySelector('#result-title').textContent = translations.ui.result_title[lang];
        resultContainer.querySelector('#food-name').textContent = foodData.name;
        resultContainer.querySelector('#food-description').textContent = foodData.description;
        resultContainer.querySelector('#retry-btn').textContent = translations.ui.retry_btn[lang];
        disclaimer.querySelector('#disclaimer-text').textContent = translations.ui.disclaimer[lang];
    }

    function displayBlogPosts(lang) {
        pageContent.dataset.pageType = 'blog-list';
        pageContent.innerHTML = `
            <div class="blog-section">
                <h2>${translations.staticPages[lang].blogTitle}</h2>
                <div id="blog-posts-container">
                ${translations.staticPages.blog.map(post => `
                    <article class="blog-post-summary" data-id="${post.id}">
                        <img src="${post.thumbnail_img}" alt="${post['title_' + lang]}" class="blog-thumbnail">
                        <div class="blog-text-content">
                            <h3>${post['title_' + lang]}</h3>
                            <p class="blog-summary">${post['summary_' + lang]}</p>
                            <span class="blog-date">${post.date}</span>
                        </div>
                    </article>
                `).join('')}
                </div>
            </div>`;
    }

    function displayFullBlogPost(postId, lang) {
        const post = translations.staticPages.blog.find(p => p.id === postId);
        if (post) {
            pageContent.dataset.pageType = 'blog-post';
            pageContent.dataset.pageId = postId;
            pageContent.innerHTML = `<div class="blog-post-content"><h1>${post['title_' + lang]}</h1><p class="blog-date">${post.date}</p><div class="blog-body">${post['contents_html_' + lang]}</div></div>`;
        }
    }
    
    function displayStaticPage(pageKey, lang) {
        pageContent.dataset.pageType = 'static';
        pageContent.dataset.pageId = pageKey;
        pageContent.innerHTML = translations.staticPages[lang][pageKey];
    }
    
    function startGame() {
        mainContent.querySelector('.intro').classList.add('hidden');
        mainContent.querySelector('#question-area').classList.remove('hidden');

        currentQuestionIndex = 0;
        selectedQuestions = [...translations.questions].sort(() => 0.5 - Math.random()).slice(0, 3);
        displayQuestion();
    }

    function displayQuestion() {
        const questionArea = document.getElementById('question-area');
        const question = selectedQuestions[currentQuestionIndex];
        let currentOptions = [...question.options];
        if (question.isRandomOptions) currentOptions = currentOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
        const optionsHTML = currentOptions.map(opt => `<button class="option-btn">${opt.text[currentLang]}</button>`).join('');
        
        questionArea.innerHTML = `<div class="question-box"><h3>${question.text[currentLang]}</h3><div class="options">${optionsHTML}</div></div>`;
        questionArea.querySelectorAll('.option-btn').forEach(btn => btn.addEventListener('click', handleOptionClick));
    }
    
    function handleOptionClick() {
        currentQuestionIndex++;
        if (currentQuestionIndex < selectedQuestions.length) {
            displayQuestion();
        } else {
            switchView('result');
        }
    }

    function displayRecommendation() {
        if (!currentRecommendedFoodKey) {
            const foodList = translations.food[currentLang];
            const randomFood = foodList[Math.floor(Math.random() * foodList.length)];
            currentRecommendedFoodKey = randomFood.key;
        }

        const foodData = translations.food[currentLang].find(f => f.key === currentRecommendedFoodKey);

        if (!foodData) { 
            console.error("Could not find food for key:", currentRecommendedFoodKey, "in lang:", currentLang);
            return;
        }

        resultContainer.innerHTML = `
            <img id="chef-image" src="chef-result.png" alt="추천하는 셰프" class="chef-image"/>
            <h2 id="result-title">${translations.ui.result_title[currentLang]}</h2>
            <div id="food-recommendation">
                <h3 id="food-name">${foodData.name}</h3>
                <p id="food-description">${foodData.description}</p>
            </div>
            <button id="retry-btn">${translations.ui.retry_btn[currentLang]}</button>
        `;
        
        resultContainer.querySelector('#retry-btn').addEventListener('click', () => {
            switchView('home');
        });
        
        resultContainer.classList.remove('hidden');
        disclaimer.classList.remove('hidden');
    }
    
    function initializePage() {
        const introScreen = document.querySelector('.intro');
        if (introScreen && !introScreen.querySelector('.chef-image')) {
            const introChefImage = document.createElement('img');
            introChefImage.src = 'chef-intro.png';
            introChefImage.alt = 'A serious chef';
            introChefImage.className = 'chef-image';
            introScreen.prepend(introChefImage);
        }

        standaloneSearchBtn.addEventListener('click', () => {
            const menu = standaloneMenuInput.value.trim();
            const location = standaloneLocationInput.value.trim();

            if (menu === "" || location === "") {
                alert(translations.ui.alert_msg[currentLang]);
                return;
            }

            const fullKeyword = `${location} ${menu}`;
            const encodedKeyword = encodeURIComponent(fullKeyword);
            let searchUrl;

            if (currentLang === 'ko') {
                searchUrl = `https://map.kakao.com/link/search/${encodedKeyword}`;
            } else {
                searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedKeyword}`;
            }
            window.open(searchUrl, '_blank');
        });
    }

    document.getElementById('start-btn').addEventListener('click', startGame);

    langSwitcher.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' && !e.target.classList.contains('active')) {
            setLanguage(e.target.dataset.lang);
        }
    });

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pageKey = e.target.dataset.page;
            navButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            switchView(pageKey);
        });
    });
    
    pageContent.addEventListener('click', (e) => {
        const postElement = e.target.closest('.blog-post-summary');
        if (postElement) {
            navButtons.forEach(b => b.classList.remove('active'));
            document.querySelector('.nav-btn[data-page="blog"]').classList.add('active');
            switchView('blog-post', postElement.dataset.id);
        }
    });

    initializePage();
    setLanguage('ko');
    switchView('home');
    document.querySelector('.nav-btn[data-page="home"]').classList.add('active');
});
