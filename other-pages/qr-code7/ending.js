'use strict';
/* იყენებს script.js-ის არსებულ ფუნქციებს: $, ICON, setExpr, type, startMusic */
(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms));

  const TEXT = [
    "როგორც იქნა, მიადექი ფინალს! ალბათ უკვე ხელები გიკანკალებს და ამხელა ყუთის დანახვაზე თვალები შუბლზე აგივიდა. ხო, პლანშეტია, დაწყნარდი, სუნთქვა არ დაგავიწყდეს!",
    "მთელი ეს თავსატეხები იმიტომ გატარე, რომ ცოტა ტვინი გაგენძრია. 12 წლის გახდი, პატარა კი აღარ ხარ, ყველაფერს ხომ არ დაგიღეჭავდი?!",
    "მოკლედ, გილოცავ დაბადების დღეს! ახლა შეგიძლია დაჯდე და მთელი დღე ამ ახალ ეკრანს მიაშტერდე, როგორც ნამდვილ გეიმერს შეეფერება.",
    "(პ.ს. ეკრანის პაროლი არ დაგავიწყდეს, თორემ თავიდან მოგიწევს მინიშნებების ძებნა!)"
  ];

  const root = $('#end');
  root.innerHTML = `
    <div class="sprite big" id="spr"></div>
    <div class="sys" role="status"><i>${ICON.star}</i><span>[SYSTEM]: ULTIMATE BOSS DEFEATED!</span><i>${ICON.star}</i></div>
    <div class="win" id="win" hidden>
      <div class="bar"><i></i><i></i><i></i></div>
      <div class="body" id="txt"></div>
    </div>
    <button class="btn pulse" id="finish" type="button" hidden>თამაშის დასრულება! 🎀</button>
    <h1 class="thx" id="thx" hidden>THANK YOU FOR PLAYING, NINO!</h1>`;

  const spr = $('#spr');
  setExpr(spr, 'excited');

  /* ჰაერში გასროლილი პიქსელური გულები / ვარსკვლავები / კონფეტი ნინოს ხელებიდან */
  const COLORS = ['#ffd34d', '#ff5fa2', '#fff', '#ffa8cb'];
  function throwHearts(n) {
    const g = $('#game').getBoundingClientRect(), r = spr.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const k = i % 4, s = document.createElement('span');
      s.className = 'th' + (k === 3 ? ' sq' : '');
      if (k === 3) s.style.background = COLORS[Math.random() * 4 | 0];
      else s.innerHTML = k === 2 ? ICON.star : ICON.heart;
      s.style.cssText += `;left:${r.left - g.left + r.width * (.25 + Math.random() * .5)}px;top:${r.top - g.top + r.height * .35}px;` +
        `--dx:${(Math.random() - .5) * 280 | 0}px;--dy:${-(130 + Math.random() * 230) | 0}px;--rot:${(Math.random() - .5) * 90 | 0}deg`;
      $('#game').append(s);
      s.onanimationend = () => s.remove();
    }
  }

  /* 1. სისტემური შეტყობინება ჩნდება, პერსონაჟი აღფრთოვანებულია */
  await wait(2200);

  /* 2. ტექსტი იწერება არსებული typewriter-ით (ბგერითაც) */
  $('#win').hidden = false;
  const box = $('#txt');
  for (const t of TEXT) {
    const p = document.createElement('p');
    p.className = 'pp';
    box.append(p);
    await type(p, t, 30);
    p.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    await wait(350);
  }

  /* 3. ნინო ზეიმობს, ღილაკი ჩნდება */
  setExpr(spr, 'celebrate');
  const btn = $('#finish');
  btn.hidden = false;
  btn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

  /* 4. ფინალური ღილაკი */
  btn.addEventListener('click', async () => {
    startMusic();
    root.scrollTo({ top: 0, behavior: 'smooth' });   // რომ ნინო ჩანდეს, როცა გულებს ისვრის
    await wait(450);
    setExpr(spr, 'celebrate');
    const thx = $('#thx');
    thx.hidden = false;
    for (let k = 0; k < 4; k++) { throwHearts(26); await wait(450); }
    thx.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
})();
