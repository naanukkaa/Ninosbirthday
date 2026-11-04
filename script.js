'use strict';
const $=s=>document.querySelector(s);

/* ---------- პიქსელ-არტი: ტექსტური ბადე -> SVG (შენი რენდერერი, უცვლელი) ---------- */
const PAL={h:'#4b2a24',H:'#6e4034',s:'#f7caa9',c:'#f79fb0',e:'#3b1e1a',w:'#fff',t:'#fff0c9',g:'#ff5fa2',p:'#ffa8cb',P:'#e8679b',
 m:'#c63f62',o:'#7a2a52',l:'#ffc4de',b:'#ff8fc0',B:'#e0508f',y:'#ffd34d',Y:'#e0a82a',k:'#4a1d3a',G:'#fff3a0',f:'#ffcc33',
 r:'#ff4f93',x:'#e8c9d8',d:'#5a3a55'};
const svg=(rows,mir)=>{let r='',W=0;rows.forEach((row,y)=>{if(mir)row+=[...row].reverse().join('');W=row.length;
 [...row].forEach((ch,x)=>{if(PAL[ch])r+=`<rect x="${x}" y="${y}" width="1.03" height="1.03" fill="${PAL[ch]}"/>`})});
 return `<svg viewBox="0 0 ${W} ${rows.length}" shape-rendering="crispEdges">${r}</svg>`};
const ICON={
 heart:svg([".rr.rr.","rrrrrrr","rrrrrrr",".rrrrr.","..rrr..","...r..."]),
 star:svg(["...y...","..yyy..","yyyyyyy",".yyyyy.",".yy.yy.","yy...yy"]),
 bow:svg(["rr..","rrr.","rrrB","rrr.","rr.."],1)};
/* ნინოს სპრაიტი (ნახევარი სახე, სარკისებურად ორმაგდება) */
const TOP=["....t..g","...ttttt","..hhhhhh",".hhhHhhh",".hhsssss","hhhsssss"];
const BOT=["hhhsssss","hhhppppp","hhppppPP","hhpppppp","..pppppp"];
const FACE={
 happy:["hhseesss","hhssssss","hhccssss","hhsssmss","hhssssmm"],
 excited:["hhsewsss","hhseesss","hhccssss","hhsssmmm","hhssssmm"],
 surprised:["hhsewsss","hhseesss","hhccssss","hhssssmm","hhssssmm"],
 thinking:["hhsewsss","hhseesss","hhccssss","hhssssss","hhsssmmm"],
 celebrate:["hhseesss","hhssssss","hhccssss","hhsssmmm","hhssssmm"],
 sly:["hhssssss","hhseesss","hhccssss","hhssssss","hhsssmmm"]};   // ახალი: ეშმაკური სახე ბოლო გვერდისთვის
const EX={},spr=e=>EX[e]??=svg([...TOP,...FACE[e],...BOT],1);
const setExpr=(el,e)=>{el.dataset.expr=e;el.innerHTML=spr(e)};

/* ---------- ტექსტის აკრეფა (შეხებით სწრაფდება) ---------- */
let tw=0,skip=false;
addEventListener('pointerdown',()=>skip=true);
function type(el,txt,sp=34){const id=++tw;skip=false;let i=0;
 el.textContent=txt;el.style.minHeight=el.offsetHeight+'px';el.textContent='';
 return new Promise(res=>{const step=()=>{if(id!==tw)return res();
  if(skip)i=txt.length;else i++;
  el.textContent=txt.slice(0,i);
  i<txt.length?setTimeout(step,/[.!?…]/.test(txt[i-1])?sp*7:sp):res()};step()})}

/* ფონის მცურავი გულები და ვარსკვლავები */
for(let i=0;i<12;i++){const s=document.createElement('span');s.className='fl';s.innerHTML=i%2?ICON.heart:ICON.star;
 s.style.cssText=`left:${Math.random()*92}%;width:${14+Math.random()*14|0}px;animation-duration:${9+Math.random()*9}s;animation-delay:-${Math.random()*14}s`;
 $('#decor').append(s)}

/* ---------- ექვსივე გვერდის ტექსტი ---------- */
const PAGES={
1:{tag:'QR 1 / 5',ex:'excited',ex2:'happy',
 say:"ეს ნინოა! 🎀 12 წლის იუბილარი!\n\nმოიცა მოიცა... შენ ნინო ხარ, არა?! 👀\n\nჰოდა, დღეს განსაკუთრებული მისია გაქვს!\n\nმე დაგეხმარები შენი საჩუქრების პოვნაში. მიჰყევი მინიშნებებს და ვნახოთ, რამდენად კარგი დეტექტივი ხარ.\n\nმზად ხარ? 💗",
 clue:"12 წლის გახდი და დეტექტივობა მოგინდა? \nჯერ ისწავლე, ოთახში რა სად გიდევს, გოგონი! \nმინიშნება მარტივია, ტვინს ნუ დაიძაბავ: \nდღისით მზეს რომ ეფარება, ღამით ჩრდილებს მალავს. \nმიდი, შეიხედე უკან, ფანჯარასთან ქანაობს, \nთეატრალური დრამა გელის, თუკი არ გეზარება! 😅"},
2:{tag:'QR 2 / 5',ex:'surprised',ex2:'happy',
 say:"ვაა, მართლა იპოვე?! 😳\n\nსიმართლე გითხრა, არ ველოდი... მეგონა, პირველსავე ფარდასთან გაიჭედებოდი!\n\nმარა კარგი, ვაღიარებ: ერთი ქულა გაქვს.",
 clue:"საგვარეულო საგანძურის დრო მოვიდა, პატარავ! \nიქ, სადაც სტუმრებისთვის გადანახული თეფშები დგას, \nზემოდან სარკეში შენი გაკვირვებული სახე რომ ჩანს, \nქვემოთ კი კარები მარჯვნივ-მარცხნივ სრიალებს... \nჭურჭელი არ დაამტვრიო, თორემ დედა გაგაგდებს სახლიდან, \nფრთხილად შეიხედე შიგნით და იპოვე შემდეგი კოდი! ✨"},
3:{tag:'QR 3 / 5',ex:'happy',ex2:'thinking',
 say:"ისევ იპოვე?! 👏\n\nან გაგიმართლა, ან მართლა დეტექტივი ხარ. მეორე ვარიანტი უფრო მომწონს, ამიტომ ახლა მაგას დავუჯერებ... დროებით. 😏",
 clue:"ბეთჰოვენი შენგან არ დადგა, ეგ უკვე შევამჩნიეთ, \nშენს „კონცერტებს“ სახლში ყველა ყურსასმენით ვუსმენდით! \nმიდი იმ შავ-თეთრ ყუთთან, თითებს რომ ატყაპუნებ, \nთავსახური ახადე და ქვემოდან შეიხედე: \nმოცარტი მაინც ელოდება ამ დიდ აღმოჩენას! 🎶"},
4:{tag:'QR 4 / 5',ex:'thinking',ex2:'excited',
 say:"ჰმმმ... ამ სიჩქარით შემდეგ დაბადების დღემდე მივაღწევთ. 🥱\n\nმე უკვე ორი ყავა დავლიე და პიქსელებმა დაბერება დაიწყეს.\n\nმაგრამ კარგი, იპოვე. ეს ისტორიული მომენტია!",
 clue:"ახლა დაბლა დაიხარე, დეტექტივო, მაღლა აღარ გვიყურო! \nოთახში მაგიდაა, რომელზეც ჩაი და ყავა ცხოვრობს, \nფეხებს ზედ არ ვაწყობთ, ჭიქებს კი ვუფრთხილდებით. \nმას კი პატარა კარი აქვს, რომელსაც ყველა ივიწყებს. \nდააკაკუნე, გააღე და უთხარი: „გამარჯობა, მე ნინო ვარ!“ 🚪"},
5:{tag:'QR 5 / 5',ex:'excited',ex2:'celebrate',
 say:"ბოლო დონე!!! ⚔️ ორკესტრი, დაუკარით! 🎺\n\nყველა კარგ თამაშს ბოლო ბოსი ჰყავს და ამ თამაშის ბოსი ერთი დიდი ყუთია, რომელიც შენს გამოჩენას ელოდება.",
 clue:"ყუთი იმალება იმ დიდი რბილი ავეჯის ქვეშ, სადაც ფილმის ყურებისას ყველა ზარმაცად წვება და სადაც ხან წინდა იკარგება, ხან ჩანთა. \nდაიხარე, ჩაიხედე და ბოსს თვალებში შეხედე! 📦"},
6:{tag:'🎁 ფინალი',ex:'sly',ex2:'sly',
 say:"როგორც ჩანს ყველა საჩუქარი იპოვე... ან არა 👀",
 clue:"მე არაფერს ვამბობ. უბრალოდ, კარგი დეტექტივი ყოველთვის ცოტა ეჭვს იტოვებს... 🕵️‍♀️\n\nდანარჩენს კი მოგვიანებით გაიგებ. 😏"}};

/* ---------- გვერდის აწყობა ---------- */
(async()=>{
 const n=+document.body.dataset.p,d=PAGES[n];
 $('#app').innerHTML=`<div class="stag">${d.tag}</div><div class="sprite big" id="spr"></div>
 <div class="win"><div class="bar"><i></i><i></i><i></i></div><div class="body"><p id="say"${n===6?' class="fin"':''}></p></div></div>
 <div class="note" id="note" hidden><span class="nb">${ICON.bow}</span>${n<6?'<b class="lbl">🔎 მინიშნება: იქ QR კოდი გიცდის!</b>':''}<p id="clue"></p></div>`;
 setExpr($('#spr'),d.ex);
 await type($('#say'),d.say,n===6?55:30);
 setExpr($('#spr'),d.ex2);$('#note').hidden=false;
 await type($('#clue'),d.clue,26);
})();
