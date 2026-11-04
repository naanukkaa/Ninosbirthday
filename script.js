
'use strict';

const $ = s => document.querySelector(s);

/* ---------- AUDIO SYSTEM ---------- */

// Audio files are in the same folder as this JS file.
const scriptURL = document.currentScript.src;

const music = new Audio(
    new URL('Sunshine, Lollipops And Rainbows.mp3', scriptURL).href
);

const typingSound = new Audio(
    new URL('typing.mp3', scriptURL).href
);

// Background music
music.loop = true;
music.volume = 0.25;

// Typing sound
typingSound.loop = true;
typingSound.volume = 0.20;

let musicStarted = false;
let musicMuted = false;
let typingActive = false;

async function startMusic() {
    if (musicMuted || musicStarted) return;

    try {
        await music.play();
        musicStarted = true;
        updateSoundButton();
    } catch (err) {
        // Browser may require user interaction first.
        musicStarted = false;
    }
}

function toggleMusic() {
    if (musicMuted) {
        musicMuted = false;
        music.play().then(() => {
            musicStarted = true;
            updateSoundButton();
        }).catch(() => {
            musicStarted = false;
            updateSoundButton();
        });
    } else {
        musicMuted = true;
        music.pause();
        musicStarted = false;
        updateSoundButton();
    }
}

function startTypingSound() {
    if (typingActive) return;

    typingActive = true;
    typingSound.currentTime = 0;

    typingSound.play().catch(() => {});
}

function stopTypingSound() {
    if (!typingActive) return;

    typingActive = false;
    typingSound.pause();
    typingSound.currentTime = 0;
}

function updateSoundButton() {
    const btn = $('#soundToggle');
    if (!btn) return;

    btn.textContent = musicMuted ? '🔇' : '🎵';
    btn.title = musicMuted ? 'ჩართე მუსიკა' : 'გამორთე მუსიკა';
}

// Try starting music immediately.
startMusic();

// Start music after the first user interaction if autoplay was blocked.
document.addEventListener('pointerdown', () => {
    if (!musicStarted && !musicMuted) startMusic();
}, { once: true });


/* ---------- PIXEL ART RENDERER ---------- */

const PAL = {
    h:'#4b2a24', H:'#6e4034', s:'#f7caa9',
    c:'#f79fb0', e:'#3b1e1a', w:'#fff',
    t:'#fff0c9', g:'#ff5fa2', p:'#ffa8cb',
    P:'#e8679b', m:'#c63f62', o:'#7a2a52',
    l:'#ffc4de', b:'#ff8fc0', B:'#e0508f',
    y:'#ffd34d', Y:'#e0a82a', k:'#4a1d3a',
    G:'#fff3a0', f:'#ffcc33', r:'#ff4f93',
    x:'#e8c9d8', d:'#5a3a55'
};

const svg = (rows, mir) => {
    let r = '';
    let W = 0;

    rows.forEach((row, y) => {
        if (mir) row += [...row].reverse().join('');
        W = row.length;

        [...row].forEach((ch, x) => {
            if (PAL[ch]) {
                r += `<rect x="${x}" y="${y}" width="1.03" height="1.03" fill="${PAL[ch]}"/>`;
            }
        });
    });

    return `<svg viewBox="0 0 ${W} ${rows.length}" shape-rendering="crispEdges">${r}</svg>`;
};

const ICON = {
    heart: svg([
        ".rr.rr.",
        "rrrrrrr",
        "rrrrrrr",
        ".rrrrr.",
        "..rrr..",
        "...r..."
    ]),

    star: svg([
        "...y...",
        "..yyy..",
        "yyyyyyy",
        ".yyyyy.",
        ".yy.yy.",
        "yy...yy"
    ]),

    bow: svg([
        "rr..",
        "rrr.",
        "rrrB",
        "rrr.",
        "rr.."
    ], 1)
};


/* ---------- NINO'S SPRITE ---------- */

const TOP = [
    "....t..g",
    "...ttttt",
    "..hhhhhh",
    ".hhhHhhh",
    ".hhsssss",
    "hhhsssss"
];

const BOT = [
    "hhhsssss",
    "hhhppppp",
    "hhppppPP",
    "hhpppppp",
    "..pppppp"
];

const FACE = {
    happy: [
        "hhseesss",
        "hhssssss",
        "hhccssss",
        "hhsssmss",
        "hhssssmm"
    ],

    excited: [
        "hhsewsss",
        "hhseesss",
        "hhccssss",
        "hhsssmmm",
        "hhssssmm"
    ],

    surprised: [
        "hhsewsss",
        "hhseesss",
        "hhccssss",
        "hhssssmm",
        "hhssssmm"
    ],

    thinking: [
        "hhsewsss",
        "hhseesss",
        "hhccssss",
        "hhssssss",
        "hhsssmmm"
    ],

    celebrate: [
        "hhseesss",
        "hhssssss",
        "hhccssss",
        "hhsssmmm",
        "hhssssmm"
    ],

    sly: [
        "hhssssss",
        "hhseesss",
        "hhccssss",
        "hhssssss",
        "hhsssmmm"
    ]
};

const EX = {};

const spr = e => EX[e] ??= svg([...TOP, ...FACE[e], ...BOT], 1);

const setExpr = (el, e) => {
    el.dataset.expr = e;
    el.innerHTML = spr(e);
};


/* ---------- TYPEWRITER EFFECT ---------- */

let tw = 0;
let skip = false;

function type(el, txt, sp = 34) {
    const id = ++tw;
    skip = false;

    let i = 0;

    el.textContent = txt;
    el.style.minHeight = el.offsetHeight + 'px';
    el.textContent = '';

    return new Promise(resolve => {
        function step() {
            if (id !== tw) {
                stopTypingSound();
                return resolve();
            }

            if (skip) {
                i = txt.length;
            } else {
                i++;
            }

            el.textContent = txt.slice(0, i);

            if (i < txt.length) {
                startTypingSound();

                setTimeout(step,
                    /[.!?…]/.test(txt[i - 1]) ? sp * 7 : sp
                );
            } else {
                stopTypingSound();
                resolve();
            }
        }

        step();
    });
}

function type(el, txt, sp = 34) {
    const id = ++tw;

    skip = false;

    let i = 0;

    el.textContent = txt;
    el.style.minHeight = el.offsetHeight + 'px';
    el.textContent = '';

    return new Promise(res => {

        const step = () => {

            if (id !== tw) {
                stopTypingSound();
                return res();
            }

            if (skip) {
                i = txt.length;
            } else {
                i++;
            }

            el.textContent = txt.slice(0, i);

            if (i < txt.length) {

                if (!skip) {
                    startTypingSound();
                } else {
                    stopTypingSound();
                }

                const delay = /[.!?…]/.test(txt[i - 1])
                    ? sp * 7
                    : sp;

                setTimeout(step, delay);

            } else {

                stopTypingSound();
                res();

            }
        };

        step();
    });
}


/* ---------- FLOATING DECORATIONS ---------- */

const decor = $('#decor');

if (decor) {
    for (let i = 0; i < 12; i++) {

        const s = document.createElement('span');

        s.className = 'fl';
        s.innerHTML = i % 2 ? ICON.heart : ICON.star;

        s.style.cssText = `
            left:${Math.random() * 92}%;
            width:${14 + Math.random() * 14 | 0}px;
            animation-duration:${9 + Math.random() * 9}s;
            animation-delay:-${Math.random() * 14}s;
        `;

        decor.append(s);
    }
}


/* ---------- SIX QR PAGES ---------- */

const PAGES = {

    1: {
        tag: 'QR 1 / 5',
        ex: 'excited',
        ex2: 'happy',

        say: `ეს ნინოა! 🎀 12 წლის იუბილარი!

მოიცა მოიცა... შენ ნინო ხარ, არა?! 👀

ჰოდა, დღეს განსაკუთრებული მისია გაქვს!

მე დაგეხმარები შენი საჩუქრების პოვნაში. მიჰყევი მინიშნებებს და ვნახოთ, რამდენად კარგი დეტექტივი ხარ.

მზად ხარ? 💗`,

        clue: `12 წლის გახდი და დეტექტივობა მოგინდა?
ჯერ ისწავლე, ოთახში რა სად გიდევს, გოგონი!
მინიშნება მარტივია, ტვინს ნუ დაიძაბავ:
დღისით მზეს რომ ეფარება, ღამით ჩრდილებს მალავს.
მიდი, შეიხედე უკან, ფანჯარასთან ქანაობს,
თეატრალური დრამა გელის, თუკი არ გეზარება! 😅`
    },

    2: {
        tag: 'QR 2 / 5',
        ex: 'surprised',
        ex2: 'happy',

        say: `ვაა, მართლა იპოვე?! 😳

სიმართლე გითხრა, არ ველოდი... მეგონა, პირველსავე ფარდასთან გაიჭედებოდი!

მარა კარგი, ვაღიარებ: ერთი ქულა გაქვს.`,

        clue: `საგვარეულო საგანძურის დრო მოვიდა, პატარავ!
იქ, სადაც სტუმრებისთვის გადანახული თეფშები დგას,
ზემოდან სარკეში შენი გაკვირვებული სახე რომ ჩანს,
ქვემოთ კი კარები მარჯვნივ-მარცხნივ სრიალებს...
ჭურჭელი არ დაამტვრიო, თორემ დედა გაგაგდებს სახლიდან,
ფრთხილად შეიხედე შიგნით და იპოვე შემდეგი კოდი! ✨`
    },

    3: {
        tag: 'QR 3 / 5',
        ex: 'happy',
        ex2: 'thinking',

        say: `ისევ იპოვე?! 👏

ან გაგიმართლა, ან მართლა დეტექტივი ხარ. მეორე ვარიანტი უფრო მომწონს, ამიტომ ახლა მაგას დავუჯერებ... დროებით. 😏`,

        clue: `ბეთჰოვენი შენგან არ დადგა, ეგ უკვე შევამჩნიეთ,
შენს „კონცერტებს“ სახლში ყველა ყურსასმენით ვუსმენდით!
მიდი იმ შავ-თეთრ ყუთთან, თითებს რომ ატყაპუნებ,
თავსახური ახადე და ქვემოდან შეიხედე:
მოცარტი მაინც ელოდება ამ დიდ აღმოჩენას! 🎶`
    },

    4: {
        tag: 'QR 4 / 5',
        ex: 'thinking',
        ex2: 'excited',

        say: `ჰმმმ... ამ სიჩქარით შემდეგ დაბადების დღემდე მივაღწევთ. 🥱

მე უკვე ორი ყავა დავლიე და პიქსელებმა დაბერება დაიწყეს.

მაგრამ კარგი, იპოვე. ეს ისტორიული მომენტია!`,

        clue: `ახლა დაბლა დაიხარე, დეტექტივო, მაღლა აღარ გვიყურო!
ოთახში მაგიდაა, რომელზეც ჩაი და ყავა ცხოვრობს,
ფეხებს ზედ არ ვაწყობთ, ჭიქებს კი ვუფრთხილდებით.
მას კი პატარა კარი აქვს, რომელსაც ყველა ივიწყებს.
დააკაკუნე, გააღე და უთხარი: „გამარჯობა, მე ნინო ვარ!“ 🚪`
    },

    5: {
        tag: 'QR 5 / 5',
        ex: 'excited',
        ex2: 'celebrate',

        say: `ბოლო დონე!!! ⚔️ ორკესტრი, დაუკარით! 🎺

ყველა კარგ თამაშს ბოლო ბოსი ჰყავს და ამ თამაშის ბოსი ერთი დიდი ყუთია, რომელიც შენს გამოჩენას ელოდება.`,

        clue: `ყუთი იმალება იმ დიდი რბილი ავეჯის ქვეშ, სადაც ფილმის ყურებისას ყველა ზარმაცად წვება და სადაც ხან წინდა იკარგება, ხან ჩანთა.
დაიხარე, ჩაიხედე და ბოსს თვალებში შეხედე! 📦`
    },

    6: {
        tag: '🎁 ფინალი',
        ex: 'sly',
        ex2: 'sly',

        say: `როგორც ჩანს ყველა საჩუქარი იპოვე... ან არა 👀`,

        clue: `მე არაფერს ვამბობ. უბრალოდ, კარგი დეტექტივი ყოველთვის ცოტა ეჭვს იტოვებს... 🕵️‍♀️

დანარჩენს კი მოგვიანებით გაიგებ. 😏`
    }
};


/* ---------- BUILD CURRENT QR PAGE ---------- */

(async () => {

    const n = +document.body.dataset.p;
    const d = PAGES[n];

    const app = $('#app');

    if (!app || !d) {
        console.error('QR page not found. Check body data-p attribute.');
        return;
    }

    app.innerHTML = `
        <button id="soundToggle"
                type="button"
                aria-label="მუსიკის ჩართვა ან გამორთვა"
                style="
                    position:absolute;
                    top:12px;
                    right:12px;
                    z-index:50;
                    width:44px;
                    height:44px;
                    border:3px solid #9b2c61;
                    background:#fff0f6;
                    font-size:21px;
                    cursor:pointer;
                    box-shadow:3px 3px 0 #9b2c61;
                ">🎵</button>

        <div class="stag">${d.tag}</div>

        <div class="sprite big" id="spr"></div>

        <div class="win">
            <div class="bar">
                <i></i><i></i><i></i>
            </div>
            <div class="body">
                <p id="say"></p>
            </div>
        </div>

        <div class="note" id="note" hidden>
            <span class="nb">${ICON.bow}</span>

            ${n < 6
                ? '<b class="lbl">🔎 მინიშნება: იქ QR კოდი გიცდის!</b>'
                : ''
            }

            <p id="clue"></p>
        </div>
    `;

    // Music button
    updateSoundButton();

    $('#soundToggle').addEventListener('click', e => {
        e.stopPropagation();
        toggleMusic();
    });

    // Character expression
    setExpr($('#spr'), d.ex);

    // First dialogue
    await type($('#say'), d.say, n === 6 ? 55 : 30);

    // Change expression
    setExpr($('#spr'), d.ex2);

    // Reveal clue
    $('#note').hidden = false;

    await type($('#clue'), d.clue, 26);

})();
