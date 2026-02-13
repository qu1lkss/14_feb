/*
  Настройки (ПОМЕНЯЕШЬ ПУТИ ТУТ, ЕСЛИ НУЖНО)
*/
const CONFIG = {
    backgroundImage: "images/bg.jpg",
    bgMusic: "songs/bg.mp3",
    specialMusic: "songs/special.mp3",
    startScreenTitle: "Персональная квест-валентинка для моей любимой.",
    photoExt: "jpg",
    photoDir: "images",
};

/*
  Нормализация строки: регистр вниз + пробелы схлопнуть.
*/
function norm(s){
    return String(s ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

/*
  6 вопросов + дальше 3 финальных экрана.
*/
const STEPS = [
    {
        type: "start",
        stepTitle: "Старт",
        title: CONFIG.startScreenTitle,
        subtitle: "Нажми «НАЧАТЬ» — и квест начнётся. Фон и музыка будут с тобой всё время.",
        task: "",
        buttonText: "НАЧАТЬ",
    },
    {
        type: "question",
        stepTitle: "Вопрос 1",
        title: "С какой фразы началась наша история?",
        subtitle: "",
        task: "Введи фразу точно.",
        hint: "ответ на вопрос был неоднозначным сначала",
        validate: (input) => norm(input) === norm("ты не против со мной встречаться?"),
        okText: "Правильно.",
        photosCount: 3,
    },
    {
        type: "question",
        stepTitle: "Вопрос 2",
        title: "Как называется место, где мы провели больше всего времени в первые несколько месяцев?",
        subtitle: "",
        task: "Одно слово.",
        hint: "хлебобулочное изделие",
        validate: (input) => norm(input) === norm("бублики"),
        okText: "Да.",
        photosCount: 3,
    },
    {
        type: "question",
        stepTitle: "Вопрос 3",
        title: "Напиши строчку из песни, которая ассоциируется с нашими отношениями и с нами",
        subtitle: "Из знаков препинания — только «-» и «…» (троеточие).",
        task: "Введи строку.",
        hint: "ГПИСЭТ",
        validate: (input) => norm(input) === norm("где причины и следствия - это ты..."),
        okText: "Попала в точку. Сейчас включу ту самую песню.",
        onCorrect: async () => {
            await AudioManager.playSpecial();
            UI.showNextOnly("Далее");
            UI.setMsg("Песня играет. Нажми «Далее», когда будешь готова.", "ok");
        },
        manualNext: true,
        photosCount: 3,
    },
    {
        type: "question",
        stepTitle: "Вопрос 4",
        title: "Какой один из самых спонтанных и неожиданно красивых и необычных дней был у нас?",
        subtitle: "Напиши действие, которое ассоциируется с ним.",
        task: "Можно в любой форме.",
        hint: "кря-кря",
        validate: (input) => {
            const s = norm(input);
            const hasFeed = s.includes("корм");
            const hasDuck = s.includes("уток") || s.includes("уточ") || s.includes("уточек") || s.includes("утк");
            return hasFeed && hasDuck;
        },
        okText: "Да. Это было красиво.",
        photosCount: 3,
    },
    {
        type: "question",
        stepTitle: "Вопрос 5",
        title: "Какое место мы называем нашим?",
        subtitle: "",
        task: "Введи точно, как мы его называем.",
        hint: "сначала я не воспринимал его всерьез, но как только мы туда сходили, нам очень понравилось и мы поняли, что это наше место, хоть и были там мало раз",
        validate: (input) => norm(input) === norm("птичка-невеличка"),
        okText: "Верно.",
        photosCount: 3,
    },
    {
        type: "question_any",
        stepTitle: "Вопрос 6",
        title: "За что ты ценишь наши отношения?",
        subtitle: "Можно написать что угодно — это твой ответ.",
        task: "Напиши от себя.",
        hint: "любой честный ответ подходит",
        validate: (input) => norm(input).length > 0,
        okText: "Спасибо, что ценишь наши отношения.",
        specialOk: true,
        photosCount: 3,
    },
    {
        type: "final_text",
        stepTitle: "Дальше",
        title: "…",
        subtitle: "",
        task: "",
        adjectives: [
            "умная","красивая","нежная","добрая","искренняя","сильная","светлая","чуткая","заботливая","внимательная",
            "мягкая","теплая","настоящая","яркая","смелая","мудрая","тонкая","глубокая","вдохновляющая","удивительная",
            "особенная","единственная","лучшая","родная","любимая","прекрасная","честная","верная","ласковая","солнечная",
            "обаятельная","миловидная","неповторимая","талантливая","творческая","крутая","классная","волшебная","душевная","живая",
            "необычная","трепетная","аккуратная","терпеливая","понимающая","неравнодушная","мужественная","спокойная","гармоничная","мотивирующая",
            "весёлая","смешная","очаровательная","умопомрачительная","великолепная","восхитительная","стильная","грациозная","тактичная","деликатная",
            "свободная","надёжная","приятная","уютная","притягательная","сладкая","магнитная","космическая","желанная","ценная",
            "сокровенная","тепло-сердечная","лучезарная","потрясающая","неотразимая","трогательная","самая-самая","любящая","любимейшая","моя"
        ]
    },
    {
        type: "love",
        stepTitle: "…",
        title: "Я ТЕБЯ ЛЮБЛЮ",
        subtitle: "",
        task: "",
    },
    {
        type: "photo_grid",
        stepTitle: "…",
        title: "",
        subtitle: "",
        task: ""
    },

    {
        type: "end",
        stepTitle: "Финал",
        title: "А теперь найди красный ящик, который находится в выпуклости в стене)",
        subtitle: "",
        task: "",
        buttonText: "ЗАВЕРШИТЬ",
    }
];

/* ===== DOM ===== */
const els = {
    bg: document.getElementById("bg"),
    gallery: document.getElementById("gallery"),
    fullGallery: document.getElementById("fullGallery"),

    card: document.getElementById("card"),
    stepTitle: document.getElementById("stepTitle"),
    title: document.getElementById("title"),
    subtitle: document.getElementById("subtitle"),
    task: document.getElementById("task"),

    inputRow: document.getElementById("inputRow"),
    answerInput: document.getElementById("answerInput"),
    checkBtn: document.getElementById("checkBtn"),

    hintBtn: document.getElementById("hintBtn"),
    msg: document.getElementById("msg"),

    nextRow: document.getElementById("nextRow"),
    nextBtn: document.getElementById("nextBtn"),

    progressText: document.getElementById("progressText"),
    progressBarText: document.getElementById("progressBarText"),
    progressFill: document.getElementById("progressFill"),

    restartBtn: document.getElementById("restartBtn"),
    soundBtn: document.getElementById("soundBtn"),
    soundIcon: document.querySelector("#soundBtn .icon"),

    bgm: document.getElementById("bgm"),
    special: document.getElementById("special"),

    fx: document.getElementById("fx"),
    screen: document.getElementById("screen"),
};

// ===== GALLERY auto-create (если в HTML нет <div id="gallery">) =====
if (!els.gallery) {
    const g = document.createElement("div");
    g.id = "gallery";
    g.className = "gallery";
    // вставим между actionsRow и nextRow (перед кнопкой "Далее")
    if (els.nextRow && els.nextRow.parentNode) {
        els.nextRow.parentNode.insertBefore(g, els.nextRow);
    } else if (els.card) {
        els.card.appendChild(g);
    }
    els.gallery = g;
}

function escapeHtml(s){
    return String(s)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

function hideScreen(){
    if (!els.screen) return;
    els.screen.className = "screen";
    els.screen.innerHTML = "";
    els.screen.style.display = "none";
}

function showScreen(className, html){
    if (!els.screen) return;
    els.screen.className = "screen show " + className;
    els.screen.style.display = "block";
    els.screen.innerHTML = html;
}

let index = 0;
let hintUsed = false;
let soundOn = true;

/* ===== UI helper ===== */
const UI = {
    setMsg(text, kind){
        els.msg.className = "msg" + (kind ? " " + kind : "");
        els.msg.textContent = text || "";
    },
    shake(){
        els.card.classList.add("shake");
        setTimeout(() => els.card.classList.remove("shake"), 230);
    },
    glow(){
        els.card.classList.add("glow");
        setTimeout(() => els.card.classList.remove("glow"), 520);
    },
    fadeSwitch(fn){
        els.card.classList.add("fadeOut");
        setTimeout(() => {
            fn();
            els.card.classList.remove("fadeOut");
            els.card.style.animation = "none";
            void els.card.offsetWidth;
            els.card.style.animation = "";
        }, 220);
    },
    showNextOnly(label){
        els.nextBtn.textContent = label || "Далее";
        els.nextRow.classList.add("show");
    },
    hideNext(){
        els.nextRow.classList.remove("show");
    }
};

/* ===== Audio manager ===== */
const AudioManager = {
    init(){
        els.bgm.src = CONFIG.bgMusic;
        els.special.src = CONFIG.specialMusic;

        els.bgm.volume = 0.55;
        els.special.volume = 0.8;
    },

    async ensureBgm(){
        if (!soundOn) return;
        if (els.bgm.paused){
            try{ await els.bgm.play(); } catch(e){}
        }
    },

    pauseAll(){
        els.bgm.pause();
        els.special.pause();
    },

    async playSpecial(){
        if (!soundOn) return;
        els.bgm.pause();
        els.special.currentTime = 0;
        try{ await els.special.play(); } catch(e){}
    },

    async resumeBgm(){
        if (!soundOn) return;
        if (!els.special.paused) els.special.pause();
        try{ await els.bgm.play(); } catch(e){}
    }
};

/* ===== Progress ===== */
function updateProgress(){
    const totalQuestions = 6;
    let stepNum = 0;

    if (index >= 1 && index <= 6) stepNum = index;
    else if (index === 0) stepNum = 0;
    else stepNum = totalQuestions;

    els.progressText.textContent = `Шаг ${stepNum} из ${totalQuestions}`;
    const pct = Math.round((stepNum / totalQuestions) * 100);
    els.progressBarText.textContent = `Готово: ${pct}%`;
    els.progressFill.style.width = `${pct}%`;
}

/* ===== FX (сердечки) ===== */
function resizeFx(){
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    els.fx.width = Math.floor(window.innerWidth * dpr);
    els.fx.height = Math.floor(window.innerHeight * dpr);
    els.fx.style.width = window.innerWidth + "px";
    els.fx.style.height = window.innerHeight + "px";
}
window.addEventListener("resize", resizeFx);

function heartsBurst(){
    const ctx = els.fx.getContext("2d");
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const W = els.fx.width;
    const H = els.fx.height;

    const parts = [];
    for (let i = 0; i < 24; i++){
        parts.push({
            x: (W/2) + (Math.random()*220 - 110) * dpr,
            y: (H/2) + (Math.random()*120 - 60) * dpr,
            vx: (Math.random()*2 - 1) * 2.4 * dpr,
            vy: (-Math.random()*2 - 1.8) * 2.9 * dpr,
            r: (Math.random()*10 + 8) * dpr,
            a: 1,
            rot: Math.random() * Math.PI,
            spin: (Math.random()*2 - 1) * 0.12
        });
    }

    const start = performance.now();
    const dur = 850;

    function heart(x,y,r,rot,alpha){
        ctx.save();
        ctx.translate(x,y);
        ctx.rotate(rot);
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        const s = r;
        ctx.moveTo(0, s*0.35);
        ctx.bezierCurveTo(0, 0, -s, 0, -s, s*0.55);
        ctx.bezierCurveTo(-s, s*1.05, 0, s*1.2, 0, s*1.55);
        ctx.bezierCurveTo(0, s*1.2, s, s*1.05, s, s*0.55);
        ctx.bezierCurveTo(s, 0, 0, 0, 0, s*0.35);
        ctx.closePath();

        const g = ctx.createLinearGradient(-s, 0, s, s*1.2);
        g.addColorStop(0, "rgba(255,111,174,0.95)");
        g.addColorStop(1, "rgba(124,140,255,0.95)");
        ctx.fillStyle = g;
        ctx.fill();

        ctx.restore();
    }

    function tick(t){
        const k = Math.min(1, (t - start) / dur);
        ctx.clearRect(0,0,W,H);

        for (const p of parts){
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05 * dpr;
            p.a = 1 - k;
            p.rot += p.spin;
            heart(p.x, p.y, p.r, p.rot, Math.max(0, p.a));
        }

        if (k < 1) requestAnimationFrame(tick);
        else ctx.clearRect(0,0,W,H);
    }

    requestAnimationFrame(tick);
}

/* ===== Gallery ===== */
function hideGallery(){
    if (!els.fullGallery) return;
    els.fullGallery.classList.remove("show");
    els.fullGallery.innerHTML = "";
}

function showGallery(questionNum, count){
    if (!els.fullGallery) return;

    els.fullGallery.innerHTML = "";

    for (let i = 1; i <= count; i++){
        const img = document.createElement("img");
        img.src = `images/${questionNum}.${i}.jpg`;
        img.alt = `${questionNum}.${i}`;
        img.loading = "lazy";
        els.fullGallery.appendChild(img);
    }

    els.fullGallery.classList.add("show");
}


/* ===== Render ===== */
function setTaskMultiline(text){
    els.task.innerHTML = "";
    const lines = String(text || "").split("\n");
    for (let i = 0; i < lines.length; i++){
        const div = document.createElement("div");
        div.textContent = lines[i];
        if (i) div.style.marginTop = "8px";
        els.task.appendChild(div);
    }
}

function render(){
    hideGallery();
    hintUsed = false;
    UI.setMsg("", "");
    els.answerInput.value = "";

    const step = STEPS[index];

    hideScreen();
    els.card.classList.remove("noProgress");
    els.card.style.display = "block";

    els.stepTitle.textContent = step.stepTitle || "";
    els.title.textContent = step.title || "";
    els.subtitle.textContent = step.subtitle || "";

    els.task.style.display = "block";

    UI.hideNext();

    if (step.type === "start"){
        els.card.classList.add("noProgress");
        els.inputRow.style.display = "none";
        els.hintBtn.style.display = "none";
        els.task.innerHTML = "";
        els.task.style.display = "none";
        UI.showNextOnly(step.buttonText || "НАЧАТЬ");
        updateProgress();
        return;
    }

    if (step.type === "question" || step.type === "question_any"){
        els.inputRow.style.display = "flex";
        els.hintBtn.style.display = "inline-flex";
        setTaskMultiline(step.task || "");
        updateProgress();
        return;
    }

    if (step.type === "final_text"){
        els.card.classList.add("noProgress");
        els.card.style.display = "none";

        const adjectivesLine = buildAdjectivesText(step.adjectives || []);
        const onlyList = adjectivesLine.replace(/^ты — самая:\s*/i, "");

        showScreen("adj", `
      <div class="inner">
        <div class="title">Ты — самая:</div>
        <div class="text">${escapeHtml(onlyList)}</div>
        <div class="bottom">
          <button class="btn secondary" id="screenNext">Далее</button>
        </div>
      </div>
    `);

        document.getElementById("screenNext").addEventListener("click", onNext);
        updateProgress();
        return;
    }

    if (step.type === "love"){
        els.card.classList.add("noProgress");
        els.card.style.display = "none";

        showScreen("love", `
      <div class="inner">
        <div class="loveText">Я ТЕБЯ ЛЮБЛЮ</div>
        <div class="bottom">
          <button class="btn secondary" id="screenNext">Далее</button>
        </div>
      </div>
    `);

        heartsBurst();
        document.getElementById("screenNext").addEventListener("click", onNext);
        updateProgress();
        return;
    }

    if (step.type === "photo_grid"){
        els.card.classList.add("noProgress");
        els.card.style.display = "none";

        let html = `<div class="photoGridWrapper">`;

        for (let i = 1; i <= 9; i++){
            html += `<img src="images/${i}.jpg" alt="${i}">`;
        }

        html += `
        <div class="gridBottom">
            <button class="btn secondary" id="screenNext">Далее</button>
        </div>
    </div>`;

        showScreen("photoGrid", html);

        document.getElementById("screenNext").addEventListener("click", onNext);
        updateProgress();
        return;
    }

    if (step.type === "end"){
        els.card.classList.add("noProgress");
        els.inputRow.style.display = "none";
        els.hintBtn.style.display = "none";
        els.task.innerHTML = "";
        els.task.style.display = "none";
        UI.showNextOnly(step.buttonText || "ЗАВЕРШИТЬ");
        updateProgress();
        return;
    }

    updateProgress();
}

/* ===== Text builder ===== */
function buildAdjectivesText(list){
    if (!list.length) return "ты — самая …";

    const clean = [];
    const seen = new Set();
    for (const w of list){
        const a = String(w || "").trim();
        if (!a) continue;
        const key = a.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        clean.push(a);
    }

    return "ты — самая: " + clean.join(", ") + ".";
}

/* ===== Logic ===== */
function go(next){
    if (next < 0 || next >= STEPS.length) return;
    UI.fadeSwitch(() => {
        index = next;
        render();
    });
}

async function onNext(){
    const step = STEPS[index];

    if (index === 3){
        await AudioManager.resumeBgm();
    }

    if (step.type === "end"){
        UI.setMsg("Готово.", "ok");
        heartsBurst();
        return;
    }

    go(index + 1);
}

async function check(){
    const step = STEPS[index];
    if (!(step.type === "question" || step.type === "question_any")) return;

    const input = els.answerInput.value;
    if (!norm(input)){
        UI.setMsg("Напиши ответ.", "bad");
        UI.shake();
        return;
    }

    const ok = !!step.validate?.(input);

    if (!ok){
        UI.setMsg(hintUsed ? "Не совпало. Попробуй ещё раз." : "Почти. Подумай чуть иначе.", "bad");
        UI.shake();
        return;
    }

    UI.glow();
    heartsBurst();

    UI.setMsg(step.okText || "Правильно.", "ok");

    // Фото под анкетой на правильном ответе (по умолчанию 3)
    const count = step.photosCount || 3;
    showGallery(index, count);

    // Спец-логика 3-го вопроса (включает песню и показывает "Далее")
    if (step.onCorrect){
        await step.onCorrect();
        return;
    }

    UI.showNextOnly("Далее");
}

function hint(){
    const step = STEPS[index];
    hintUsed = true;
    UI.setMsg(step.hint || "Подсказки нет.", "");
}

/* ===== Sound toggle ===== */
async function toggleSound(){
    soundOn = !soundOn;
    els.soundBtn.setAttribute("aria-pressed", String(soundOn));
    els.soundIcon.textContent = soundOn ? "🔊" : "🔇";

    if (!soundOn){
        AudioManager.pauseAll();
        return;
    }

    if (index === 3 && !els.special.paused){
        try{ await els.special.play(); } catch(e){}
        return;
    }

    await AudioManager.ensureBgm();
}

/* ===== Restart ===== */
async function restart(){
    AudioManager.pauseAll();
    els.bgm.currentTime = 0;
    els.special.currentTime = 0;

    index = 0;
    UI.setMsg("", "");
    render();

    if (soundOn){
        await AudioManager.ensureBgm();
    }
}

/* ===== Events ===== */
els.checkBtn.addEventListener("click", check);
els.answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") check();
});
els.hintBtn.addEventListener("click", hint);
els.nextBtn.addEventListener("click", onNext);
els.restartBtn.addEventListener("click", restart);
els.soundBtn.addEventListener("click", toggleSound);

/* ===== Init ===== */
(function init(){
    els.bg.style.backgroundImage = `url("${CONFIG.backgroundImage}")`;

    resizeFx();
    AudioManager.init();
    render();

    const unlock = async () => {
        document.removeEventListener("click", unlock);
        if (soundOn) await AudioManager.ensureBgm();
    };
    document.addEventListener("click", unlock, { once: true });
})();
