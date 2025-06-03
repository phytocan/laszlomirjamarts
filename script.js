document.addEventListener('DOMContentLoaded', function() {
    // DOM elemek kiválasztása
    const portfolioBtn = document.getElementById('portfolio-btn');
    const portfolioDropdown = document.getElementById('portfolio-dropdown');
    const mainContent = document.getElementById('main-content');
    const homeContent = document.getElementById('home-content');
    const dynamicContent = document.getElementById('dynamic-content');
    const aboutBtn = document.getElementById('about-btn');


    // Rejtett menüpontok
    const hiddenMenuItems = ['diszito-elemek', 'sojatekok', 'film-manipulaciok'];
    hiddenMenuItems.forEach(item => {
        const elements = document.querySelectorAll(`[data-category="${item}"]`);
        elements.forEach(el => el.style.display = 'none');
    });

    // Főoldalra vissza a címre kattintva
    document.getElementById('home-link').addEventListener('click', function(e) {
        e.preventDefault();
        loadHomePage();
    });
    
    // Portfólió gomb kattintás eseménykezelője
    portfolioBtn.addEventListener('click', function() {
        portfolioDropdown.classList.toggle('show');
    });

    // Rólam gomb kattintás eseménykezelője
    aboutBtn.addEventListener('click', function() {
        loadAboutPage();
    });
    
    // Kattintás a dokumentumon kívülre zárja a legördülő menüt
    window.addEventListener('click', function(event) {
        if (!event.target.matches('#portfolio-btn') && !event.target.matches('.dropdown-content a')) {
            if (portfolioDropdown.classList.contains('show')) {
                portfolioDropdown.classList.remove('show');
            }
        }
    });
    
    // Portfólió kategóriák kezelése
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        if (!hiddenMenuItems.includes(link.getAttribute('data-category'))) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.getAttribute('data-category');
                loadPortfolioCategory(category);
                portfolioDropdown.classList.remove('show');
            });
        }
    });
    
    // Oldal betöltésekor ellenőrzi az URL hash-t
    if (window.location.hash === '#about') {
        loadAboutPage();
    } else if (window.location.hash.startsWith('#portfolio/')) {
        const category = window.location.hash.split('#portfolio/')[1];
        loadPortfolioCategory(category);
    } else {
        loadHomePage();
    }
    
    // Művészet kérdés form kezelése
    function setupArtQuestionForm() {
        // Ellenőrizzük, hogy már létezik-e a form
        if (document.querySelector('.art-question')) {
            return;
        }
        
        const form = document.createElement('div');
        form.className = 'art-question';
        form.innerHTML = `
            <h3>Mit jelent számodra a művészet?</h3>
            <textarea placeholder="Ossza meg véleményét..."></textarea>
            <button type="button">Küldés</button>
        `;
        
        const button = form.querySelector('button');
        const textarea = form.querySelector('textarea');
        
        button.addEventListener('click', function() {
            if (textarea.value.trim() === '') {
                alert('Kérjük, írja meg véleményét!');
                return;
            }
            
            // Itt lehetne elküldeni a szerverre a választ
            alert('Köszönjük, hogy megosztotta velünk véleményét!');
            textarea.value = '';
        });
        
        return form;
    }
    
    // Portfólió kategória betöltése
    function loadPortfolioCategory(category) {
        window.location.hash = `portfolio/${category}`;
        homeContent.style.display = 'none';
        dynamicContent.style.display = 'block';
        
        let content = `
            <div class="content-page">
                <h1>${getCategoryName(category)}</h1>
        `;

        if (category === 'gondok-megoldasok') {
            // Kapu projekt képei
            const kapuimages = ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg','10.jpg','11.jpg','12.jpg'];
            
            content += `
                <h2><br>A kapu</h2>
                <h3>2021</h3>
                <p>László Mirjam és Sipos Anna</p>
                <div class="portfolio-grid">
            `;
            
            kapuimages.forEach(img => {
                content += `
                    <div class="portfolio-item" onclick="openLightbox('kapu', '${img}', ${kapuimages.length})">
                        <img src="kapu/${img}" alt="A kapu képek">
                    </div>
                `;
            });
            
            content += `
                </div>
                <p class="project-description">A Magyar Képzőművészeti Egyetem tihanyi művésztelepén kapott képpár téma ihlette ezt az installációt. A művésztelep területén a hely adottságait kihasználva szaktársammal Sipos Annával egy régi ház romjainak ajtónyílását építettük ki. Egy kapunak képzeltük el, melynek egyik oldala a nyugodalmas békével teli gondatlanságot, a másik a romos és sötét nehézségekkel, üldöztetésekkel szegénységekkel teli életet jelképezi. Ennek vékony határaként egy asztalt építettünk, melynek mindkét oldalára egy–egy széket helyeztünk el, ezek nyersanyagaként a helyszínen talált nádat, liánt és téglát használtunk. Az asztalon látható két tányér, pohár és evőeszköz mutatja a hasonlóságokat. A sötétebb oldalán lévő eszközök koszosak, a szemben lévő tányérok, pedig tiszták. Meg szeretnénk mutatni, hogy hiába látjuk a szép oldalt, mégis elég hozzá egy mozzanat, hogy ez átboruljon. Ezért helyeztük el a székeket is egymással szembe.  Bármelyik oldalon is foglalunk helyet, nem tudjuk egymástól elszakítani a két helyszínt, ha a zord oldalon helyezkedünk el, akkor tekintetünk reményekkel telve előre néz a természetben burjánzó és látszólag teljesen vidám világba. </p>
                
                <h2><br><br>Dunaparti piknik</h2>
                <h3>2022</h3>
                <div class="dunapart-grid">
                    <div class="portfolio-item" onclick="openLightbox('dunapartipiknik', '1.jpg', 12)">
                        <img src="dunapartipiknik/1.jpg" alt="Dunaparti piknik 1" style="width:100%;height:auto;aspect-ratio:4000/2992;">
                    </div>
                    <div class="portfolio-item" onclick="openLightbox('dunapartipiknik', '2.jpg', 12)">
                        <img src="dunapartipiknik/2.jpg" alt="Dunaparti piknik 2" style="width:100%;height:auto;aspect-ratio:4000/2992;">
                    </div>
                </div>
                <div class="dunapart-grid-sub">
            `;
            
            for (let i = 3; i <= 10; i++) {
                content += `
                    <div class="portfolio-item" onclick="openLightbox('dunapartipiknik', '${i}.jpg', 12)">
                        <img src="dunapartipiknik/${i}.jpg" alt="Dunaparti piknik ${i}" style="width:100%;height:auto;aspect-ratio:4000/2992;">
                    </div>
                `;
            }
            
            content += `
                </div>
                <p class="project-description">Gyűjtőmunkámnak a természet és az oda nem való tárgyak egybeolvadásának bemutatását tűztem ki célul. Előszőr lefotóztam a hulladékként kezelt anyagokat a természettel elegyedett környezetükben, majd a talált dolgokból egy piknik kompozícióját hoztam létre, elképzelve régi valódi céljukat. Az installáció egy részét mintegy "kiállításként" a helyszínen hagytam az arra járóknak, hadd lássák, hogy lesz az értékből szemét.</p>
            
                <h2><br><br>A nyomás hatalma</h2>
                <h3>2020</h3>
                <h4>69 × 83 cm, akril</h4>
                <div class="nyomashatalma-container">
                    <img src="nyomashatalma/1.jpg" alt="A nyomás hatalma" class="nyomashatalma-single" onclick="openLightbox('nyomashatalma', '1.jpg', 1)" style="aspect-ratio:3477/3193;">
                </div>
                <p class="project-description">Ez a festmény a problémák megoldatlanságáról, az ideiglenes felszíni foltozásokról és az „álmegoldásokról” szól. Egy gömb jutott eszembe róla, ami tele van lyukakkal, amelyeket hiába próbálunk foltozni vagy sebtapasszal beborítani, ha továbbra is pumpáljuk bele a levegőt (nyomást), és nem a valódi, végleges megoldásokat keressük, sosem lesz maradandó eredmény. A gömb zöld színű, emlékeztetve a „zöldnek” nevezett, környezetvédelem nevében gerjesztett problémákra.
                A ránk nehezedő nyomásnak legtöbbször úgy vagyunk részesei, hogy azt nem is tudatosítjuk. A hírek könnyen megtéveszthetnek, látszólagos megoldásokat kínálnak egy-egy problémára, azt sugallva, hogy helyesen cselekszünk, hogy a tőlünk telhető legtöbbet megtesszük. Ám a nyomás megszüntetése nem mindenkinek érdeke. Éppen ezért túl gyakran derül ki, hogy ezek valójában csak álmegoldások, erős hívószavakkal tálalva, amelyeket egyesek könnyedén használnak anélkül, hogy észrevennénk: a problémát nem megszüntették, csupán áthelyezték egy másik gócpontba, amely előbb vagy utóbb elkerülhetetlenül „kipukkad”.
                Ma egy gyors termelésre épülő, szemétgyártó, luxuscikkeket halmozó életmódot élünk. Amíg a pénz beszél, az anyagi érdekek vezérlik a gazdaság minden mozzanatát, gyakran a lakosság valós igényeivel szemben. Sokan nem gondolnak arra, hogy minden új tárgyhoz nyersanyag kell, amit valahonnan ki kell termelni. Minél távolabb van egy folyamat az ismereteinktől, annál kevésbé tudjuk követni, hogy ki és milyen árat fizetett érte. Nem is kell messzire tekintenünk, hogy elképzeljük, mi zajlik máshol. Erőművekben égetjük el az erdőinket a környezetvédelem nevében, így tűnnek el a Kárpátok erdei is.
                Éppen ezért fontos, hogy minden egyes apró cselekedetünk súlyát végiggondoljuk. Gyakran nem is sejtjük, milyen következményekkel járnak tetteink, és hogy akaratlanul milyen folyamatokban veszünk részt. Ezekért azonban felelősséget kell vállalnunk, ha valóban csökkenteni akarjuk a ránk nehezedő nyomást.
                </p>
            `;

        } else if (category === 'feny-arnyek') {
            content += `
                <h2></h2>
                <p><br></p>
                <div class="fenyarnyek-grid">
            `;
            
            for (let i = 3; i <= 6; i++) {  //1-től kezdődne, de elrejtettem az első kettő csunya képet
                content += `
                    <div class="portfolio-item" onclick="openLightbox('fenyarnyek', '${i}.jpg', 6)">
                        <img src="fenyarnyek/${i}.jpg" alt="Fény-árnyék ${i}" style="width:100%;height:auto;aspect-ratio:1839/2048;">
                    </div>
                `;
            }
            
            content += `
                </div>
                <p class="project-description">Az egyik növénykém halovány árnyékát festettem meg akrillal, több azonos méretű 90 × 80 cm-es fehér vászonra. Az egész nagyon lágy, letisztult és visszafogott lett. 
Az installációt egy sötét és kör alaprajzú térbe installáltam, ahol 6 festett és 1 üres vásznat helyeztem a falra, a helyiség közepébe pedig a festmények elé drótból és textilből készült növényeket rendeztem el, melynek megvilágításával játszva a vásznakra irányítottam az árnyékaikat, ezzel a nézőt megtévesztve, aki elsőre nehezen döntheti el, hogy melyik a festett és melyik a térplasztika vetülete. Az installációt 2022 októberében az epreskerti Kálvária épületében mutattam be. A trükköt nem ismerő látogatókat megkérdezvén sikeresen mondhatom el, hogy az illúzió működött, a nézőknek gondot okozott vagy nem is sikerült megállapítani, hogy melyik az üres vászon.
</p>
            `;
            
        } else if (category === 'tajak') {
    content += `
        <br><br>
        <div class="tajak-grid">
    `;
    
    const tajakImages = [
        {file: '1.jpg', description: 'Villám, 2020, 80 × 130 cm, olajfesték'},
        {file: '2.jpg', description: 'Felhők, 2020, 80 × 130 cm, akril'},
        {file: '3.jpg', description: 'Vihar, 2021, 50 × 65 cm, olajfesték'},
        {file: '4.jpg', description: 'Rimakokava, 2017, A4, tempera, papír'},
        {file: '5.jpg', description: 'Aranyalma, 2025, 140 × 100 cm, olajfesték'}
    ];
    
    tajakImages.forEach((img, index) => {
        content += `
            <div class="tajak-item">
                <div class="portfolio-item" onclick="openLightbox('tajak', '${img.file}', ${tajakImages.length})">
                    <img src="tajak/${img.file}" alt="Táj ${index+1}" style="width:100%;height:auto;">
                </div>
                <div class="project-description-per-image">
                    <p>${img.description}</p>
                </div>
            </div>
            ${index < tajakImages.length - 1 ? '<br>' : ''}
        `;
    });
    
    content += `
        </div>
    `;
            

        } else if (category === 'minden-semmi') {
        content += `
            <br><br>
            <div class="mindensemmi-grid">
                <div class="mindensemmi-column">
        `;
        
        const mindensemmiImages = [
            {file: '1.jpg', ratio: '2021, 60 × 30 cm, akril'},
            {file: '4.jpg', ratio: '2025, 73 × 53 cm olajfesték'},
            {file: '7.jpg', ratio: 'Kapcsolódás, 2025, B2, olajfesték, papír'},
            {file: '10.jpg', ratio: 'Folyton folyvást folynak a folyamatok, 2020, 100 × 100 cm, olajfesték, filc, zsírkéta'},
            {file: '2.jpg', ratio: 'Teremtés ereje, 2020, 70 × 50 cm, olajfesték, akril'},
            {file: '5.jpg', ratio: 'Koszorú, 2025, olajfesték, papír, '},
            {file: '8.jpg', ratio: 'Teljesség forrása, 2020, 79 × 69 cm  akril,'},
            {file: '11.jpg', ratio: 'Föld mámora, 2019, 50 × 50 cm, akril, vászon'},
            {file: '3.jpg', ratio: 'Fény, 2025, 250 × 150 cm, olajfesték'},
            {file: '6.jpg', ratio: 'Koszorú, 2025, olajfesték, papír'},
            {file: '9.jpg', ratio: 'Minden egy, egy minden, minden nélkül az egy semmi sem, 2019, 71 × 76 cm, olajfesték, csillámpor'},
            {file: '12.jpg', ratio: 'Tánc, 2018, 30 × 30 cm, cianotípia'}
        ];
        
        // Képek oszlopokba szétosztása
        let currentCol = 1;
        for (let i = 0; i < mindensemmiImages.length; i++) {
            const img = mindensemmiImages[i];
            
            if (i > 0 && i % 4 === 0) {
                currentCol++;
                content += `
                    </div>
                    <div class="mindensemmi-column">
                `;
            }
            
            content += `
                <div class="mindensemmi-item">
                    <div class="portfolio-item" onclick="openLightbox('mindensemmi', '${img.file}', ${mindensemmiImages.length})">
                        <img src="mindensemmi/${img.file}" alt="Minden és semmi ${img.file}" style="width:100%;height:auto;aspect-ratio:${img.ratio};">
                    </div>
                    <div class="project-description-per-image">
                        <p>${img.ratio.replace('/', 'x')}</p>
                    </div>
                </div>
            `;
        }
        
        content += `
                </div>
            </div>
        `;

        } else if (category === 'ember-alakok') {
            content += `
                <br><br><br>
                <div class="emberalakok-grid-4">
            `;
            
            // Első 4 kép (3456x4608)
            for (let i = 1; i <= 4; i++) {
                content += `
                    <div class="portfolio-item" onclick="openLightbox('emberalakok', '${i}.jpg', 9)">
                        <img src="emberalakok/${i}.jpg" alt="Ember alakok ${i}" style="width:100%;height:auto;aspect-ratio:3456/4608;">
                    </div>
                `;
            }
            
            content += `
                </div>
                <p class="project-description">Élő modell utáni mintázás 1:1 arányban, 2023</p>
                <br><br>
                <div class="emberalakok-grid-3">
            `;
            
            // Következő 3 kép (3456x4156)
            for (let i = 5; i <= 7; i++) {
                content += `
                    <div class="portfolio-item" onclick="openLightbox('emberalakok', '${i}.jpg', 9)">
                        <img src="emberalakok/${i}.jpg" alt="Ember alakok ${i}" style="width:100%;height:auto;aspect-ratio:3456/4156;">
                    </div>
                `;
            }
            
            content += `
                </div>
                <p class="project-description">Élő modell utáni mintázás 3 óra alatt, 2024</p>
                <br><br>
                <div class="emberalakok-grid-2">
            `;
            
            // Utolsó 2 kép (3648x5108) - kisebb méretben
            for (let i = 8; i <= 9; i++) {
                content += `
                    <div class="portfolio-item" onclick="openLightbox('emberalakok', '${i}.jpg', 9)">
                        <img src="emberalakok/${i}.jpg" alt="Ember alakok ${i}" style="width:100%;height:auto;aspect-ratio:3648/5108;max-width:400px;">
                    </div>
                `;
            }
            
            content += `
                </div>
                <div class="emberalakok-descriptions">
                    <div class="project-description-per-image">
                        <p>2017, A2, vízfesték, papír</p>
                    </div>
                    <div class="project-description-per-image">
                        <p>Én, 2020, B2, ceruza, papír</p>
                    </div>
                </div>
            `;
        } else if (category === 'keramia-szobrok') {
            content += `
                <br>
                <h2>Fényorgona</h2>
                <h3>2024<br></h3>
                <div class="fenyorgona-grid-top">
            `;
            
            // Első 2 kép (2048x1365)
            for (let i = 1; i <= 2; i++) {
                content += `
                    <div class="portfolio-item" onclick="openLightbox('fenyorgona', '${i}.jpg', 6)">
                        <img src="fenyorgona/${i}.jpg" alt="Fényorgona ${i}" style="width:100%;height:auto;aspect-ratio:2048/1365;">
                    </div>
                `;
            }
            
            content += `
                </div>
                <div class="fenyorgona-grid-bottom">
            `;
            
            // Maradék 4 kép (1839x2048) - egy sorban
            for (let i = 3; i <= 6; i++) {
                content += `
                    <div class="portfolio-item" onclick="openLightbox('fenyorgona', '${i}.jpg', 6)">
                        <img src="fenyorgona/${i}.jpg" alt="Fényorgona ${i}" style="width:100%;height:auto;aspect-ratio:1839/2048;">
                    </div>
                `;
            }
            
                content += `
                    </div>
                    <p class="project-description">Orfűi művésztelep, Fényorgona, agyagból és fényfüzérből készült installáció, 2024<br><br>
                    Alkotók: Pálinkás Dominika, Deme Hanga, Szávai Zsófia Blanka, Piegel Flóra, Bottlik Csenge, László Mirjam, Bús Bea, Hinfner Zsófia Adél, Kucsora Kristóf <br><br>
                    Az orfűi camping művészeti projektek megvalósítására írt ki pályázatokat a PTE tanulói és tanárai számára. Pálinkás Dominika az egyetem doktorandusza elnyerte az egyik alkotói lehetőséget, miszerint a régi tűzrakó helyére egy fényfüzérrel ellátott kerámia installációt hozz létre egy 9 fős csapattal.<br>Az installáció formai világát együtt találtuk ki. A külső ívbe helyeztük el a legalacsonyabb, 1 részes elemeket, a középső körbe kerültek a 2 részesek, és a kör középpontjába egy darab 3 részes, így összesen 21 különböző elem jött létre.  Egy nagyon jó csapat jött össze, hasonló mentalitásunk révén hiába, hogy mindenki szabadon tervezte meg a saját szobrát, mégis összeillenek. Magas, csúcsos, kúpos oszlopokat készítettünk, ezek felületére rá is építettünk, de ami a legfontosabb volt, az a formák kivágása, ahol a fény kiáradhat. Kimondottan tetszik, hogy nappal és éjjel is egy teljesen másik oldalát mutatják ezek a kerámiák. Három nap alatt közel 600 kg agyagot dolgoztunk fel. Én egy két részes elemet formáztam meg, így lett 140 cm magas. Alulra körbe fákat mintáztam, a rajta csüngő gyümölcsöket, pedig körkörösen kivágtam. Leginkább két központi oldala lett, az egyik oldalára egy szellemszerű férfit, a másikra egy hölgyet, a csúcsra pedig a Holdat és a Napot vágtam ki szimmetriában. Egy tökéletes édeni hangulatot jelenítettem meg. Párhuzamosan 2 raku kemencében égettünk. A raku belsőterének magassága 70 cm volt, ez adta meg az elemek maximális méreteit. Az égetés után folytattuk munkánkat az installálással, betonvasat és drótot használtunk fel a szobrok rögzítéséhez. Az üreges belsejükbe fényforrásként fényfüzéreket helyeztünk el.</p>
                `;
        } else {
            content += `
                <div class="portfolio-grid">
                    <div class="portfolio-item">Kép 1</div>
                    <div class="portfolio-item">Kép 2</div>
                    <div class="portfolio-item">Kép 3</div>
                    <div class="portfolio-item">Kép 4</div>
                    <div class="portfolio-item">Kép 5</div>
                    <div class="portfolio-item">Kép 6</div>
                </div>
            `;
        }
        
        content += `
            </div>
            
            <!-- Lightbox konténer -->
            <div id="lightbox" class="lightbox">
                <span class="close-btn" onclick="closeLightbox()">&times;</span>
                <span class="nav-btn prev-btn" onclick="changeImage(-1)">&#10094;</span>
                <span class="nav-btn next-btn" onclick="changeImage(1)">&#10095;</span>
                <div class="lightbox-content">
                    <img id="lightbox-img" src="" alt="">
                    <div id="image-caption"></div>
                </div>
            </div>
        `;
        
        dynamicContent.innerHTML = content;
        
        // Képvédelmi réteg hozzáadása
        document.querySelectorAll('.portfolio-item img').forEach(img => {
            img.addEventListener('contextmenu', function(e) {
                e.preventDefault();
            });
        });
    }
    
    // Főoldal betöltése
    function loadHomePage() {
        window.location.hash = '';
        homeContent.style.display = 'block';
        dynamicContent.style.display = 'none';
        
        // Művészet kérdés form hozzáadása (csak ha még nincs)
        if (!document.querySelector('.art-question')) {
            const welcomeMessage = document.querySelector('.welcome-message');
            if (welcomeMessage) {
                welcomeMessage.appendChild(setupArtQuestionForm());
            }
        }
    }
    
    // Rólam oldal betöltése
    function loadAboutPage() {
        window.location.hash = 'about';
        homeContent.style.display = 'none';
        dynamicContent.style.display = 'block';
        
        const content = `
            <div class="content-page">
                <h2>Rólam</h2>
                <p>Ritkán reflektálok társadalmi és kulturális problémákra, inkább azok közös gyökerét keresem, hogy megoldásokat ábrázoljak. Szent Ágoston gondolata tökéletesen összegzi ezt számomra: „Szeress, és tégy, amit akarsz!”. Tetteink tudatos mivoltáról, a szeretetről, alázatról, szépségről, háláról, a teremtő erőről és a minden felé való fordulásról alkotok képi világot.</p>
                <p>Nap mint nap döntéseket hozunk, amelyek többsége nem tudatos, csupán a jelenlegi normákhoz való alkalmazkodás vezérel minket. Ha körülnézünk, számtalan pusztítást és szeretet nélküli cselekedetet láthatunk – és gyakran magunk is generáljuk ezeket. Tájékozottság hiányában nem látunk az orrunknál tovább. Én ez ellen küzdök: igyekszem a jót cselekedni. A művészetben egyik fő célom a jó táplálása, hogy az megnyugvást, szellemi és lelki felüdülést nyújtson a befogadónak.</p>
            </div>
        `;
        
        dynamicContent.innerHTML = content;
    }
    
    // Kategória nevének formázása
    function getCategoryName(category) {
        const names = {
            'minden-semmi': 'Minden és a semmi',
            'tajak': 'Tájak',
            'feny-arnyek': 'Fény-árnyék',
            'diszito-elemek': 'Díszítő elemek',
            'keramia-szobrok': 'Kerámia szobrok',
            'sojatekok': 'Szójátékok',
            'gondok-megoldasok': 'Gondok és megoldások',
            'ember-alakok': 'Ember alakok',
            'film-manipulaciok': 'Film manipulálások'
        };
        
        return names[category] || category;
    }
});

// ============== LIGHTBOX FUNKCIÓK ==============

// Globális változók a lightbox-hoz
let currentImageIndex = 0;
let currentImages = [];
let currentFolder = '';

// Lightbox megnyitása
function openLightbox(folder, img, totalImages) {
    currentFolder = folder;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    currentImages = [];
    for (let i = 1; i <= totalImages; i++) {
        currentImages.push(`${i}.jpg`);
    }
    
    currentImageIndex = currentImages.indexOf(img);
    lightboxImg.src = `${folder}/${img}`;
    lightboxImg.onerror = function() {
        this.src = 'placeholder.jpg';
        console.error('Kép betöltése sikertelen:', this.src);
    };
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Képvédelmi réteg
    lightboxImg.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
}

// Lightbox bezárása
function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Képváltás a lightbox-ban
function changeImage(step) {
    currentImageIndex += step;
    
    if (currentImageIndex >= currentImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = currentImages.length - 1;
    }
    
    const newImg = `${currentFolder}/${currentImages[currentImageIndex]}`;
    document.getElementById('lightbox-img').src = newImg;
}

// Kattintás a lightbox-on kívülre is zárja a lightbox-ot
window.onclick = function(event) {
    const lightbox = document.getElementById('lightbox');
    if (event.target === lightbox) {
        closeLightbox();
    }
}

// Kép letöltésének megakadályozása
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
}, false);