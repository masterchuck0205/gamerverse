(function () {
'use strict';
const G = window.GAMES, N = window.NEWS, app = document.getElementById('app');
const ICONS = {
  tree: '<svg viewBox="0 0 64 64"><path d="M32 4 12 34h10L8 52h20v8h8v-8h20L42 34h10z" fill="#e8ffd0"/></svg>',
  bolt: '<svg viewBox="0 0 64 64"><path d="M38 2 12 36h16l-4 26 28-36H36z" fill="#fff3c4"/></svg>',
  star: '<svg viewBox="0 0 64 64"><path d="m32 4 8 18 20 2-15 13 5 20-18-10-18 10 5-20L4 24l20-2z" fill="#fff"/></svg>'
};
const art = (g, big) => '<div class="art' + (big ? ' big' : '') + '" style="background:radial-gradient(circle at 70% 20%,' + g.art.c + '55,transparent 50%),linear-gradient(135deg,' + g.art.a + ',' + g.art.b + ')">' + (ICONS[g.art.icon] || ICONS.star) + '</div>';
const tags = g => '<div class="tags"><span class="tag">' + g.genre.toUpperCase() + '</span><span class="tag mp">' + (g.multiplayer ? 'MULTIPLAYER' : 'SINGLE-PLAYER') + '</span>' + (g.comingSoon ? '<span class="tag soon">COMING SOON</span>' : '') + '</div>';
const card = g => '<a class="card" href="#/game/' + g.id + '">' + art(g) + '<div class="cbody"><h3>' + g.name + '</h3>' + tags(g) + '<p>' + g.tagline + '</p><span class="btn ' + (g.comingSoon ? 'sec' : 'pri') + '" style="justify-content:center">' + (g.comingSoon ? 'VIEW' : '▶ PLAY NOW') + '</span></div></a>';

function home() {
  const f = G.find(g => g.featured) || G[0];
  const recent = [...G].sort((a, b) => b.added.localeCompare(a.added));
  const pop = [...G].sort((a, b) => b.popularity - a.popularity);
  return '<section class="hero"><h1>Welcome to the<br><b>TERRIBLE TRIO<br>GAMERVERSE</b></h1><p>One home for every game we make. Pick a game, send a room code to your friends and jump straight in.</p>' +
    '<a class="btn pri" href="#/game/' + f.id + '">▶ PLAY ' + f.name.toUpperCase() + '</a> <a class="btn sec" href="#/games">BROWSE GAMES</a></section>' +
    '<h2>⭐ Featured game</h2><div class="feat">' + art(f) + '<div><div class="tags">' + tags(f).replace('<div class="tags">', '').replace('</div>', '') + '</div><h1 style="font-size:34px;margin:10px 0">' + f.name + '</h1><p style="color:#cfcbff;margin-bottom:18px">' + f.description + '</p><a class="btn pri" href="#/game/' + f.id + '">▶ PLAY NOW</a></div></div>' +
    '<h2>🆕 Recently added</h2><div class="grid">' + recent.map(card).join('') + '</div>' +
    '<h2>🔥 Popular</h2><div class="grid">' + pop.map(card).join('') + '</div>' +
    '<h2>📰 News</h2><div class="news">' + N.map(n => '<div class="n"><small>' + n.date + '</small><h4>' + n.title + '</h4><p>' + n.text + '</p></div>').join('') + '</div>';
}
let q = '', filt = 'all';
function games() {
  return '<h1 style="font-size:32px">🎮 Games</h1><div class="bar" style="margin-top:16px"><input id="q" placeholder="Search games…" value="' + q.replace(/"/g, '') + '">' +
    ['all', 'multiplayer', 'single'].map(f => '<button class="chip' + (filt === f ? ' on' : '') + '" data-f="' + f + '">' + { all: 'All', multiplayer: 'Multiplayer', single: 'Single-player' }[f] + '</button>').join('') + '</div><div class="grid" id="list"></div>';
}
function fillList() {
  const l = document.getElementById('list'); if (!l) return;
  const r = G.filter(g => (filt === 'all' || (filt === 'multiplayer') === g.multiplayer) && (g.name + g.genre + g.tagline).toLowerCase().includes(q.toLowerCase()));
  l.innerHTML = r.length ? r.map(card).join('') : '<p style="color:var(--dim)">No games found.</p>';
}
function gamePage(id) {
  const g = G.find(x => x.id === id);
  if (!g) return '<div class="soonbox"><h1>Game not found</h1><a class="btn pri" href="#/games">BACK TO GAMES</a></div>';
  return '<a class="back" href="#/games">← All games</a><div class="gp"><div>' + art(g, true) + '</div><div>' + tags(g) + '<h1>' + g.name + '</h1><p style="color:#cfcbff">' + g.description + '</p><p style="color:var(--dim);margin-top:10px">👥 ' + g.players + '</p><ul>' + g.features.map(f => '<li>' + f + '</li>').join('') + '</ul>' +
    (g.comingSoon ? '<button class="btn sec" disabled>COMING SOON</button>' : '<button class="btn pri" id="play" data-id="' + g.id + '">▶ PLAY NOW</button>') + '</div></div>';
}
const soon = (t, e, p) => '<div class="soonbox"><div style="font-size:50px">' + e + '</div><h1>' + t + '</h1><p>' + p + '</p><a class="btn pri" href="#/games">BROWSE GAMES</a></div>';

function route() {
  const h = location.hash.replace(/^#\/?/, '').split('/');
  const page = h[0] || 'home';
  document.querySelectorAll('nav a.l').forEach(a => a.classList.toggle('on', a.dataset.p === (page === 'game' ? 'games' : page)));
  app.innerHTML = page === 'games' ? games() : page === 'game' ? gamePage(h[1]) :
    page === 'community' ? soon('Community', '👥', 'Announcements, discussions and friends are coming in a future update.') :
    page === 'account' ? soon('Accounts', '👤', 'Profiles, favourite games and online status are coming after the main hub is finished.') : home();
  window.scrollTo(0, 0); fillList();
}
document.addEventListener('input', e => { if (e.target.id === 'q') { q = e.target.value; fillList(); } });
document.addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (c) { filt = c.dataset.f; document.querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === c)); fillList(); }
  const p = e.target.closest('#play'); if (p) play(G.find(g => g.id === p.dataset.id));
  if (e.target.closest('#mclose')) document.getElementById('modal').classList.remove('on');
});
function play(g) {
  if (!g || !g.url) return;
  document.getElementById('mname').textContent = g.name;
  document.getElementById('modal').classList.add('on');
  const w = window.open(g.url, '_blank', 'noopener');
  if (!w) { document.getElementById('mtxt').innerHTML = 'Your browser blocked the pop-up. <a class="btn pri" href="' + g.url + '" target="_blank" rel="noopener">OPEN ' + g.name.toUpperCase() + '</a>'; }
}
/* wake sleeping free servers as soon as the hub opens, so Play is faster */
G.forEach(g => { if (g.url) fetch(g.url + '/health', { mode: 'no-cors' }).catch(() => {}); });
window.addEventListener('hashchange', route); route();
})();
