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
        food: { ko: [ { key: 'sushi', name: '스시', description: '넌 지금 와사비가 필요해.' }, { key: 'galbi', name: '갈비', description: '달콤하고 진한 맛을 느껴봐.' }, { key: 'bread', name: '빵 (베이커리)', description: '빵 하나면 충분해. 그래야 내일 고민 안 할 거야.' }, { key: 'sandwich', name: '샌드위치', description: '가장 맛있는 조합은 네 입이 알고 있어.' }, { key: 'chicken', name: '치킨', description: '언제나 옳아. 바삭한 튀김을 느껴봐.' }, { key: 'kimbap', name: '김밥', description: '널 위한 선물 세트야. 야채를 챙겨야 할 때가 됐지?' }, { key: 'pasta', name: '파스타', description: '면이 주는 위로를 느껴봐.' }, { key: 'pizza', name: '피자', description: '다 함께 즐기는 최고의 선택!' }, { key: 'ramen', name: '라면', description: '세상에서 가장 완벽한 국물 요리 중 하나.' }, { key: 'doenjang-jjigae', name: '된장찌개', description: '구수한 맛이 일품인 한국인의 소울푸드.' }, { key: 'bibimbap', name: '비빔밥', description: '다양한 야채와 고추장의 조화, 건강하고 든든하게.' }, { key: 'tteokbokki', name: '떡볶이', description: '매콤달콤한 맛으로 스트레스를 날려버려.' }, { key: 'jeyuk-bokkeum', name: '제육볶음', description: '밥도둑이 여기 있었네. 말이 필요 없는 맛.' }, { key: 'budae-jjigae', name: '부대찌개', description: '햄과 라면사리의 환상적인 콜라보!' }, { key: 'jajangmyeon', name: '짜장면', description: '고민될 땐 그냥 짜장면으로 가자.' }, { key: 'jjamppong', name: '짬뽕', description: '얼큰한 국물이 생각날 때, 최고의 선택.' }, { key: 'tangsuyuk', name: '탕수육', description: '바삭함과 달콤함, 둘 다 놓칠 수 없지.' }, { key: 'malatang', name: '마라탕', description: '요즘 대세! 얼얼한 맛에 중독될 준비 됐어?' }, { key: 'donkatsu', name: '돈까스', description: '바삭한 튀김옷과 두툼한 고기의 완벽한 만남.' }, { key: 'convenience-store-meal', name: '편의점 만찬', description: '오늘의 셰프는 바로 너! 최고의 조합을 만들어봐.' }, { key: 'fried-rice', name: '볶음밥', description: '냉장고에 남은 재료도 훌륭한 요리가 될 수 있지.' }, { key: 'hamburger', name: '햄버거', description: '클래식한 맛의 정석, 빠르게 에너지를 채워봐.' }, { key: 'dosirak', name: '도시락', description: '정성스럽게 담은 한 끼 식사, 간단하고 든든하게.' }, { key: 'haemul-jjim', name: '해물찜', description: '매콤한 양념에 버무린 신선한 해산물의 향연.' }, { key: 'andong-jjimdak', name: '안동찜닭', description: '짭짤하고 달콤한 간장 소스가 밴 닭고기와 당면.' }, { key: 'dak-bokkeum-tang', name: '닭볶음탕', description: '매콤하고 칼칼한 국물, 밥 비벼 먹으면 최고지.' }, { key: 'kalguksu', name: '칼국수', description: '구수한 국물과 쫄깃한 면발이 마음을 위로해줄 거야.' }, { key: 'mandu', name: '만두', description: '찐만두, 군만두, 만둣국. 어떻게 먹어도 맛있지.' }, { key: 'dak-galbi', name: '닭갈비', description: '매콤한 양념에 볶아낸 닭고기, 볶음밥은 필수 코스.' }, { key: 'gukbap', name: '국밥', description: '뚝배기 한 그릇에 담긴 든든함, 마음까지 따뜻해져.' }, { key: 'sundae-guk', name: '순대국', description: '뜨끈한 국물에 속이 꽉 찬 순대, 든든함의 대명사.' }, { key: 'baekban', name: '백반 정식', description: '매일 바뀌는 반찬의 즐거움, 집밥보다 더 집밥 같아.' }, { key: 'gisa-sikdang-bulbaek', name: '기사 식당 불백', description: '불패 신화여서 불백이야. 실패 없는 완벽한 한 끼.' }, { key: 'buffet', name: '뷔페', description: '고민은 그만! 오늘만큼은 세상 모든 걸 맛보자.' }, { key: 'naengmyeon', name: '냉면', description: '냉면은 사실 사계절용이야. 이한치한, 이열치열!' }, { key: 'samgyeopsal', name: '삼겹살', description: '대패든 뭐든 괜찮아. 일단 3겹. 지글지글 소리가 들리지?' }, { key: 'bulgogi', name: '불고기', description: '달콤한 간장 양념의 정석, 남녀노소 모두의 사랑.' }, { key: 'deopbap', name: '덮밥', description: '흰 쌀밥 위에 펼쳐지는 맛의 향연, 한 그릇의 행복.' }, { key: 'gamja-tang', name: '감자탕', description: '진한 국물에 부드러운 등뼈, 술 안주로도 식사로도 최고.' }, { key: 'toast', name: '토스트', description: '바삭한 빵에 달콤한 잼, 간단하지만 완벽한 시작.' }, { key: 'jjolmyeon', name: '쫄면', description: '쫄깃하고 새콤한 맛을 지금 먹어야 겠어!' }, { key: 'seolleongtang', name: '설렁탕', description: '고기와 밥과 당면. 그 조합은 지금이야!' }, { key: 'gopchang-bokkeum', name: '곱창 볶음', description: '깻잎에 싸서 지금 입에 넣어야 해!' }, { key: 'jangeo-deopbap', name: '장어 덮밥', description: '비싸다고? 인정. 다시 추천 받아.' }, { key: 'kimchi-bokkeumbap', name: '김치볶음밥', description: '제대로 볶아주는 김치 맛집을 찾아봐.' }, { key: 'saengseon-gui', name: '생선 구이', description: '세상은 넓고 입에 맞는 생선은 있다!' }, { key: 'shabu-shabu', name: '샤브샤브', description: '고기와 채소의 따뜻한 만남.' }, { key: 'udon', name: '우동', description: '휴게소부터 전문점까지 통통한 면발을 찾아봐.' }, { key: 'curry', name: '카레', description: '제대로된 카레는 깊이부터 달라.' } ],
            en: [ { key: 'sushi', name: 'Sushi', description: 'You need some wasabi right now.' }, { key: 'galbi', name: 'Galbi (Korean BBQ Ribs)', description: 'Feel the sweet and rich flavor.' }, { key: 'bread', name: 'Bakery Bread', description: 'One bread is enough. So you won\'t worry tomorrow.' }, { key: 'sandwich', name: 'Sandwich', description: 'Your mouth knows the best combination.' }, { key: 'chicken', name: 'Fried Chicken', description: 'It\'s always right. Feel the crispy crust.' }, { key: 'pasta', name: 'Pasta', description: 'Feel the comfort that noodles give.' }, { key: 'pizza', name: 'Pizza', description: 'The best choice to enjoy together!' }, { key: 'ramen', name: 'Ramen', description: 'One of the most perfect soup dishes in the world.' }, { key: 'bibimbap', name: 'Bibimbap', description: 'A harmony of various vegetables, healthy and satisfying.' }, { key: 'tteokbokki', name: 'Tteokbokki', description: 'Blow away stress with its spicy and sweet taste.' }, { key: 'jajangmyeon', name: 'Jajangmyeon', description: 'When in doubt, just go for Jajangmyeon.' }, { key: 'malatang', name: 'Malatang', description: 'The current trend! Ready to get addicted to the numbing taste?' }, { key: 'curry', name: 'Curry', description: 'The fragrant curry smell will whet your appetite.' }, { key: 'fried-rice', name: 'Fried Rice', description: 'Leftover ingredients can become a great dish.' }, { key: 'hamburger', name: 'Hamburger', description: 'The standard of classic taste, quickly fill up your energy.' }, { key: 'donkatsu', name: 'Donkatsu', description: 'The perfect meeting of crispy batter and thick meat.' }, { key: 'tangsuyuk', name: 'Sweet and Sour Pork', description: 'Crispiness and sweetness, can\'t miss both.' }, { key: 'seafood-bake', name: 'Seafood Bake', description: 'A medley of ocean treasures, baked to perfection.' }, { key: 'bento-box', name: 'Bento Box', description: 'A perfectly balanced and beautiful meal box.' }, { key: 'taco-plate', name: 'Taco Plate', description: 'Build your own happiness with fresh toppings.' }, { key: 'hot-dog', name: 'Hot Dog', description: 'A simple classic that never disappoints.' }, { key: 'carbonara', name: 'Spaghetti Carbonara', description: 'Creamy, cheesy, and oh-so-satisfying.' }, { key: 'tomato-pasta', name: 'Tomato Basil Pasta', description: 'Simple, fresh, and bursting with Italian sunshine.' }, { key: 'fish-and-chips', name: 'Fish and Chips', description: 'Crispy battered fish and golden fries. A seaside classic.' }, { key: 'cajun-shrimp', name: 'Cajun Shrimp Bowl', description: 'Spicy, savory, and packed with flavor.' }, { key: 'grilled-cheese', name: 'Grilled Cheese Sandwich', description: 'Golden toasted bread with a gooey, cheesy center.' }, { key: 'falafel-wrap', name: 'Falafel Wrap', description: 'A delicious and healthy Mediterranean delight.' }, { key: 'pulled-pork', name: 'Pulled Pork Burger', description: 'Slow-cooked, tender, and smothered in BBQ sauce.' }, { key: 'breakfast-burrito', name: 'Breakfast Burrito', description: 'All your breakfast favorites wrapped in a warm tortilla.' }, { key: 'buffalo-wings', name: 'Buffalo Wings', description: 'Tangy, spicy, and perfectly messy. Napkins required.' }, { key: 'chili', name: 'Chili', description: 'A hearty bowl of warmth and spice. Comfort in every spoonful.' }, { key: 'cobb-salad', name: 'Cobb Salad', description: 'A perfectly arranged masterpiece of flavors. Almost too pretty to eat.' }, { key: 'bbq-ribs', name: 'BBQ Ribs', description: 'Fall-off-the-bone tender. Get your hands dirty.' }, { key: 'clam-chowder', name: 'Clam Chowder', description: 'A creamy, seaside classic. Perfect for a cool day.' }, { key: 'mac-and-cheese', name: 'Mac and Cheese', description: 'The ultimate comfort food. Pure, cheesy bliss.' }, { key: 'fried-green-tomatoes', name: 'Fried Green Tomatoes', description: 'A southern classic. Crispy, tangy, and delightful.' }, { key: 'jambalaya', name: 'Jambalaya', description: 'A spicy celebration of rice and flavor from the bayou.' }, { key: 'shrimp-scampi', name: 'Shrimp Scampi', description: 'Garlicky, buttery shrimp over pasta. Simply elegant.' }, { key: 'beef-stew', name: 'Beef Stew', description: 'Slow-cooked perfection. A hug in a bowl.' }, { key: 'caesar-salad', name: 'Caesar Salad', description: 'When you need something light but mighty. The emperor of salads awaits.' }, { key: 'grilled-salmon', name: 'Grilled Salmon', description: 'Healthy? Yes. Delicious? Absolutely. A perfectly seared fillet is calling your name.' }, { key: 'meatball-sub', name: 'Meatball Sub', description: 'Hearty, saucy, and impossible to eat gracefully. That\'s how you know it\'s good.' }, { key: 'quesadilla', name: 'Quesadilla', description: 'The ultimate cheese-filled fold. Simple, satisfying, and melts all your troubles away.' }, { key: 'chicken-parmesan', name: 'Chicken Parmesan', description: 'Crispy chicken, rich marinara, and melted cheese. The Italian-American dream on a plate.' }, { key: 'sloppy-joes', name: 'Sloppy Joes', description: 'Messy, delicious, and a ticket straight back to childhood. Grab extra napkins.' }, { key: 'beef-burrito', name: 'Beef Burrito', description: 'Everything you love, wrapped up in a perfect package. Your hunger doesn\'t stand a chance.' }, { key: 'philly-cheesesteak', name: 'Philly Cheesesteak', description: 'Thinly sliced steak, melted cheese, and a perfect roll. The pride of Philly can be your pride today.' }, { key: 'poke-bowl', name: 'Poke Bowl', description: 'Fresh, vibrant, and bursting with flavor. It\'s a bowl of pure sunshine from Hawaii.' }, { key: 'chicken-fried-steak', name: 'Chicken Fried Steak', description: 'Don\'t let the name fool you. Crispy, savory, and smothered in gravy. Pure Southern comfort.' } ]
        },
        staticPages: {
            ko: { navHome: "홈", navBlog: "My Chef의 이야기", navAbout: "소개", navPrivacy: "개인정보 처리방침", navContact: "문의하기", blogTitle: "My Chef의 이야기", about: `<h1>My Chef의 선택을 소개합니다</h1><img src="chef-intro.png" alt="My Chef's Choice" class="static-page-image"><section><h2>"오늘 뭐 먹지?"</h2><p>이 질문은 우리의 하루에서 끊임없이 반복됩니다. 때로는 즐거운 고민이지만, 때로는 사소한 스트레스가 되기도 하죠.</p><p><strong>"누가 대신 좀 정해줬으면 좋겠다!"</strong></p><p>My Chef의 선택은 바로 그 생각에서 시작되었습니다. 메뉴를 고민하는 시간을 아껴, 당신의 소중한 오늘을 더 즐겁게 보낼 수 있도록 돕고 싶었습니다.</p></section>`, privacy: `<h1>개인정보 처리방침</h1><section><p><strong>시행일: 2025-07-01</strong></p><p>My Chef's Choice(이하 '사이트')는 이용자의 개인정보를 매우 중요하게 생각하며, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법규를 준수하고 있습니다. 본 개인정보 처리방침을 통해 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.</p><h2>1. 광고</h2><p>본 사이트는 Google 애드센스 광고를 사용하고 있습니다. Google과 같은 제3자 광고 사업자는 쿠키를 사용하여 사용자의 웹사이트 방문 기록을 기반으로 맞춤형 광고를 제공할 수 있습니다. 사용자는 Google 광고 설정에서 맞춤형 광고를 비활성화할 수 있습니다.</p><h2>2. 쿠키</h2><p>본 사이트는 서비스 개선 및 통계 분석, 광고 게재를 위해 쿠키를 사용합니다. 쿠키는 이용자 컴퓨터에 저장되는 작은 데이터 조각으로, 이용자는 웹 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</p></section>`, contact: `<h1>문의하기</h1><section><h2>My Chef's Choice에 궁금한 점이 있으신가요?</h2><p>서비스 관련 문의사항이 있으시면 아래 이메일로 연락 주시기 바랍니다.</p><p><strong>공식 이메일:</strong> <a href="mailto:mychef.recommends@gmail.com">mychef.recommends@gmail.com</a></p></section>` },
            en: { navHome: "Home", navBlog: "My Chef's Story", navAbout: "About", navPrivacy: "Privacy Policy", navContact: "Contact", blogTitle: "My Chef's Story", about: `<h1>About My Chef's Choice</h1><img src="chef-intro.png" alt="My Chef's Choice" class="static-page-image"><section><h2>"What should I eat today?"</h2><p>This question repeats endlessly in our day. Sometimes it's a pleasant dilemma, but other times it can be a minor stress.</p><p><strong>"I wish someone would just decide for me!"</strong></p><p>My Chef's Choice started from that very thought. We wanted to help you save time worrying about menus and enjoy your precious day more.</p></section>`, privacy: `<h1>Privacy Policy</h1><section><p><strong>Effective Date: 2025-07-01</strong></p><p>My Chef's Choice (the 'Site') values your privacy and complies with relevant regulations such as the Act on Promotion of Information and Communications Network Utilization and Information Protection, etc. This policy explains how we use your information and what measures we take to protect it.</p><h2>1. Advertising</h2><p>This Site uses Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website. You may opt out of personalized advertising by visiting Google's Ads Settings.</p><h2>2. Cookies</h2><p>This Site uses cookies for service improvement, statistical analysis, and ad delivery. Cookies are small data pieces stored on your computer. You can refuse to accept cookies by adjusting your browser settings. Refusing cookies may cause difficulties in using personalized services.</p></section>`, contact: `<h1>Contact Us</h1><section><h2>Do you have any questions about My Chef's Choice?</h2><p>If you have any inquiries regarding the service, please contact us at the email address below.</p><p><strong>Official Email:</strong> <a href="mailto:mychef.recommends@gmail.com">mychef.recommends@gmail.com</a></p></section>` },
            // ✨ 중요 변경: blog 데이터를 배열(Array)에서 객체(Object)로 변경했습니다.
            blog: {
                'grilled-salmon-recipe': { date: '2025-07-13', thumbnail_img: 'blog-image-11.png', title_ko: "구운 연어 – 간단하면서도 고급스러운 한 끼", title_en: "Grilled Salmon – A Simple Yet Elegant Meal", summary_ko: "건강하고 맛있는 저녁 메뉴로 인기 있는 구운 연어 레시피입니다. 그릴 요리를 할 때는 언제나 화상을 조심하세요.", summary_en: "A healthy and delicious dinner option. Always be cautious of burns when grilling.", contents_html_ko: `...`, contents_html_en: `...` },
                'breakfast-burrito-recipe': { date: '2025-07-12', thumbnail_img: 'blog-image-10.png', title_ko: "브렉퍼스트 부리토 – 든든하고 간편한 아침 한 끼", title_en: "Breakfast Burrito – A Hearty and Convenient Morning Meal", summary_ko: "계란, 햄, 치즈, 야채를 또띠아에 꽉 채워 넣고 바삭하게 구워내면, 한 손에 들고 먹기 좋은 완벽한 아침 식사가 완성됩니다.", summary_en: "Packed with eggs, ham, and cheese, it’s the perfect handheld breakfast.", contents_html_ko: `...`, contents_html_en: `...` },
                'udon-recipe': { date: '2025-07-12', thumbnail_img: 'blog-image-9.png', title_ko: "우동 – 따뜻한 국물과 면의 조화", title_en: "Udon – A Harmony of Warm Broth and Noodles", summary_ko: "쫄깃한 식감과 맑고 풍미 깊은 국물이 특징인 우동. 추운 날에 딱 맞는 이 일본식 레시피를 집에서 간편하게 만들어 보세요.", summary_en: "Known for its chewy texture and clear, flavorful broth. Perfect for chilly days.", contents_html_ko: `...`, contents_html_en: `...` },
                'tomato-pasta-recipe': { date: '2025-07-11', thumbnail_img: 'blog-image-8.png', title_ko: "토마토 파스타 – 오리지널의 품격", title_en: "Tomato Pasta – The Elegance of the Original", summary_ko: "신선한 토마토와 올리브오일, 마늘, 바질이 어우러진 클래식 토마토 파스타. 간단한 재료로 깊은 풍미를 끌어내는 레시피입니다.", summary_en: "A classic recipe that brings out deep flavors with simple ingredients.", contents_html_ko: `...`, contents_html_en: `...` },
                'poke-bowl-recipe': { date: '2025-07-11', thumbnail_img: 'blog-image-7.png', title_ko: "포케볼 – 신선함과 균형의 한 그릇", title_en: "Poke Bowl – A Fresh and Balanced One-Bowl Meal", summary_ko: "하와이에서 유래한 요리로, 생선회와 밥, 다양한 채소와 소스를 한 그릇에 담아낸 건강하고 다채로운 식사입니다.", summary_en: "A vibrant dish from Hawaii, combining fish, rice, and vegetables.", contents_html_ko: `...`, contents_html_en: `...` },
                'skillet-pizza-recipe': { date: '2025-07-11', thumbnail_img: 'blog-image-6.png', title_ko: "프라이팬 피자 – 집에서 즐기는 베스트셀러", title_en: "Skillet Pizza – Best-Seller at Home", summary_ko: "오븐 없이도 간편하게 만들 수 있는 프라이팬 피자! 바삭한 도우와 녹아내리는 치즈, 풍성한 토핑까지. 프라이팬 하나로 완성해보세요.", summary_en: "No oven? No problem! With just a skillet, you can make a crispy, cheesy, and fully loaded pizza right at home. This best-selling favorite is easy to prepare.", contents_html_ko: `...`, contents_html_en: `...` },
                'homemade-curry-recipe': { date: '2025-07-09', thumbnail_img: 'blog-image-5.png', title_ko: "카레 – 집에서 즐기는 깊은 풍미", title_en: "Curry – Deep Flavor Enjoyed at Home", summary_ko: "전 세계인이 사랑하는 카레. 누구나 무난하게 즐길 수 있는 부드럽고 고소한 돼지고기 카레 레시피를 소개합니다.", summary_en: "Curry is a beloved dish around the world. Here's a mild and comforting pork curry recipe that anyone can enjoy.", contents_html_ko: `...`, contents_html_en: `...` },
                'taco-plate-recipe': { date: '2025-07-07', thumbnail_img: 'blog-image-4.png', title_ko: "타코 플레이트 – 한 접시에 담긴 화려한 맛", title_en: "Taco Plate – A Burst of Flavor on One Plate", summary_ko: "멕시코 대표 길거리 음식 타코! 간단하면서도 다양한 재료와 소스 조합으로 풍부한 맛을 즐길 수 있습니다. 집에서도 타코의 매력을 한 접시에 담아볼까요?", summary_en: "Tacos are a beloved Mexican street food. Let’s bring the vibrant taste of tacos to your table with this colorful and satisfying taco plate!", contents_html_ko: `...`, contents_html_en: `...` },
                'korean-bibimbap-recipe': { date: '2025-07-05', thumbnail_img: 'blog-image-3.png', title_ko: "비빔밥 레시피: 조화롭게 채소를 즐기는 방법", title_en: "Bibimbap Recipe: A Harmonious Way to Enjoy Vegetables", summary_ko: "세계에서 가장 유명한 한식 비빔밥. 먹는 방법을 모르는 사람은 있어도, 그 맛을 쉽게 잊어버리는 사람은 없습니다. 조화로운 야채들이 만들어낸 따뜻한 한 숟가락. 여러분께 소개합니다.", summary_en: "The World’s Most Famous Korean Dish: Bibimbap. There may be people who don’t know how to eat it, but few forget its unforgettable flavor. One warm spoonful of harmoniously prepared vegetables— let us introduce you to Bibimbap.", contents_html_ko: `...`, contents_html_en: `...` },
                'chefs-secret-recipe': { date: '2025-07-03', thumbnail_img: 'blog-image-2.png', title_ko: "셰프의 비밀 레시피: 10분 완성 토마토 달걀 볶음", title_en: "Chef's Secret Recipe: 10-Minute Tomato and Egg Stir-fry", summary_ko: "바쁜 당신을 위한, 맛있고 든든한 초간단 요리. 셰프의 작은 비밀을 공개합니다.", summary_en: "A delicious and hearty super-simple dish for the busy you. The chef reveals a little secret.", contents_html_ko: `...`, contents_html_en: `...` },
                'paradox-of-choice': { date: '2025-07-01', thumbnail_img: 'blog-image-1.png', title_ko: "선택의 역설: 뷔페를 즐기지 못하는 셰프의 이야기", title_en: "The Paradox of Choice: A Chef's Story of Not Enjoying the Buffet", summary_ko: "풍요로운 뷔페 앞에서 오히려 선택의 어려움을 겪는 이유, 그리고 예상치 못한 기쁨에 대하여.", summary_en: "About the difficulty of choice in front of a rich buffet, and the joy of the unexpected.", contents_html_ko: `...`, contents_html_en: `...` }
            }
        }
    };

    let currentLang = 'ko';
    let selectedQuestions = [];
    let currentQuestionIndex = 0;
    
    const langSwitcher = document.getElementById('lang-switcher');
    const standaloneSearchBtn = document.getElementById('standalone-search-btn');

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('myChefLang', lang);
        document.documentElement.lang = lang;
        updateAllTexts(lang);
    }

    // ✨✨✨ AI 친화적으로 완전히 재작성된 함수입니다 ✨✨✨
    function updateAllTexts(lang) {
        const pagePath = window.location.pathname;

        // 1. [번역] data-translate-key 속성을 가진 모든 요소를 찾아 번역합니다.
        document.querySelectorAll('[data-translate-key]').forEach(element => {
            const key = element.dataset.translateKey; // 예: "staticPages.blog.grilled-salmon-recipe.title"
            const keys = key.split('.'); // 예: ["staticPages", "blog", "grilled-salmon-recipe", "title"]
            
            const propertyName = keys.pop(); // "title" 이나 "summary" 같은 마지막 부분을 가져옵니다.
            const finalPropertyKey = propertyName + '_' + lang; // "title_ko" 또는 "summary_en" 같은 최종 키를 만듭니다.

            let dataObject = translations;
            try {
                // 최종 속성(예: title)을 제외한 나머지 키 경로를 따라 객체를 탐색합니다.
                for (const part of keys) {
                    dataObject = dataObject[part];
                }

                // 최종 객체에서 번역문을 가져옵니다. (예: dataObject['title_ko'])
                const newText = dataObject[finalPropertyKey];

                if (newText) {
                    if (element.tagName === 'IMG') {
                        element.alt = newText;
                    } else if (element.tagName === 'INPUT') {
                        element.placeholder = newText;
                    } else {
                        element.textContent = newText;
                    }
                }
            } catch (e) {
                // 키를 찾지 못해도 오류 없이 넘어갑니다.
            }
        });

        // 2. [페이지별 특수 처리] 페이지의 <title> 태그나 동적으로 생성되는 다른 부분들을 처리합니다.
        if (pagePath.endsWith('/') || pagePath.endsWith('index.html')) {
            document.title = translations.pageMeta.title[lang];
            document.querySelector('meta[name="description"]').setAttribute('content', translations.pageMeta.description[lang]);
        }
        else if (pagePath.endsWith('blog.html')) {
            // blog.html 에서는 제목만 번역합니다. 내용은 이미 HTML에 있기 때문에 건드리지 않습니다.
            document.title = `${translations.staticPages[lang].blogTitle} | ${translations.pageMeta.title[lang]}`;
        }
        else if (pagePath.includes('/blog/')) {
            // 개별 블로그 글 페이지에서는 본문을 채워넣습니다.
            const postId = pagePath.substring(pagePath.lastIndexOf('/') + 1).replace('.html', '');
            const postData = translations.staticPages.blog[postId];
            if (postData) {
                document.title = `${postData['title_' + lang]} | My Chef의 선택`;
                document.querySelector('meta[name="description"]').setAttribute('content', postData['summary_' + lang]);
                const h1 = document.querySelector('h1');
                const body = document.querySelector('.blog-body');
                if(h1) h1.textContent = postData['title_' + lang];
                if(body) body.innerHTML = postData['contents_html_' + lang].replace(/src="blog-image-/g, 'src="../blog-image-');
            }
        }
        else if (pagePath.endsWith('about.html') || pagePath.endsWith('privacy.html') || pagePath.endsWith('contact.html')) {
            // 이 페이지들은 내용 전체를 JS로 관리하므로, 언어 변경 시 내용을 교체합니다.
            const pageKey = pagePath.substring(pagePath.lastIndexOf('/') + 1).replace('.html', '');
            const pageContent = document.getElementById('page-content');
            if (pageContent) {
                pageContent.innerHTML = translations.staticPages[lang][pageKey];
            }
        }

        // 3. [UI 상태 업데이트]
        langSwitcher.querySelectorAll('button').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

        if (document.getElementById('result-container') && !document.getElementById('result-container').classList.contains('hidden')) {
            updateRecommendationText(lang);
        }
    }

    function updateRecommendationText(lang) {
        const foodNameEl = document.getElementById('food-name');
        if(!foodNameEl) return;

        const currentRecommendedFoodKey = foodNameEl.dataset.foodKey;
        if (!currentRecommendedFoodKey) return;
        
        const foodData = translations.food[lang].find(f => f.key === currentRecommendedFoodKey);
        if (!foodData) return;

        const resultContainer = document.getElementById('result-container');
        const resultTitleEl = resultContainer.querySelector('#result-title');
        const foodDescEl = resultContainer.querySelector('#food-description');
        const retryBtnEl = resultContainer.querySelector('#retry-btn');
        const disclaimerTextEl = document.getElementById('disclaimer-text');

        if(resultTitleEl) resultTitleEl.textContent = translations.ui.result_title[lang];
        if(foodNameEl) foodNameEl.textContent = foodData.name;
        if(foodDescEl) foodDescEl.textContent = foodData.description;
        if(retryBtnEl) retryBtnEl.textContent = translations.ui.retry_btn[lang];
        if(disclaimerTextEl) disclaimerTextEl.textContent = translations.ui.disclaimer[lang];
    }
    
    function startGame() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;
        mainContent.querySelector('.intro').classList.add('hidden');
        mainContent.querySelector('#question-area').classList.remove('hidden');
        currentQuestionIndex = 0;
        selectedQuestions = [...translations.questions].sort(() => 0.5 - Math.random()).slice(0, 3);
        displayQuestion();
    }

    function displayQuestion() {
        const questionArea = document.getElementById('question-area');
        if (!questionArea) return;

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
            displayRecommendation();
        }
    }

    function displayRecommendation() {
        const mainContent = document.getElementById('main-content');
        const resultContainer = document.getElementById('result-container');
        const disclaimer = document.getElementById('disclaimer');
        if (!mainContent || !resultContainer || !disclaimer) return;

        mainContent.classList.add('hidden');
        
        const foodList = translations.food[currentLang];
        const randomFood = foodList[Math.floor(Math.random() * foodList.length)];

        resultContainer.innerHTML = `
            <img src="chef-result.png" alt="추천하는 셰프" class="chef-image"/>
            <div id="food-recommendation">
                <h2 id="result-title">${translations.ui.result_title[currentLang]}</h2>
                <h3 id="food-name" data-food-key="${randomFood.key}">${randomFood.name}</h3>
                <p id="food-description">${randomFood.description}</p>
            </div>
            <button id="retry-btn">${translations.ui.retry_btn[currentLang]}</button>
        `;
        
        resultContainer.querySelector('#retry-btn').addEventListener('click', () => { window.location.href = 'index.html'; });
        resultContainer.classList.remove('hidden');
        
        disclaimer.querySelector('p').textContent = translations.ui.disclaimer[currentLang];
        disclaimer.classList.remove('hidden');
    }

    function initializePage() {
        const savedLang = localStorage.getItem('myChefLang') || 'ko';
        setLanguage(savedLang);

        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', startGame);
        }

        langSwitcher.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' && !e.target.classList.contains('active')) {
                setLanguage(e.target.dataset.lang);
            }
        });

        if (standaloneSearchBtn) {
            standaloneSearchBtn.addEventListener('click', () => {
                const menuInput = document.getElementById('standalone-menu-input');
                const locationInput = document.getElementById('standalone-location-input');
                
                if(!menuInput || !locationInput) return;
                const menu = menuInput.value.trim();
                const location = locationInput.value.trim();

                if (menu === "" || location === "") {
                    alert(translations.ui.alert_msg[currentLang]);
                    return;
                }

                const fullKeyword = `${location} ${menu}`;
                const encodedKeyword = encodeURIComponent(fullKeyword);
                let searchUrl = (currentLang === 'ko') ? `https://map.kakao.com/link/search/${encodedKeyword}` : `https://www.google.com/maps/search/?api=1&query=${encodedKeyword}`;
                window.open(searchUrl, '_blank');
            });
        }
        
        const pagePath = window.location.pathname.split('/').pop() || 'index.html';
        let activePage = 'home';
        if (pagePath.includes('blog')) activePage = 'blog';
        else if (pagePath.includes('about')) activePage = 'about';
        else if (pagePath.includes('privacy')) activePage = 'privacy';
        else if (pagePath.includes('contact')) activePage = 'contact';
        
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === activePage);
        });
    }

    initializePage();
});
