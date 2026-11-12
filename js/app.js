(function () {
  'use strict'
  const W = window.WINX, F = W.fairies
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)]
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
  ScrollTrigger.config({ ignoreMobileResize: true })
  const by = Object.fromEntries(F.map((f) => [f.id, f]))
  const fill = (t) => t.replace(/{owner}/g, W.owner).replace(/{year}/g, W.year).replace(/{email}/g, W.email)
  const main = $('main')

  /* ---------- build the page from data.js ---------- */
  F.forEach((f) => { const d = document.createElement('div'); d.className = 'layer'; d.dataset.f = f.id; d.style.backgroundImage = `url(assets/bg/${f.id}.webp)`; $('.stage').appendChild(d) })
  for (let i = 0; i < 6; i++) {
    const bw = document.createElement('div'); bw.className = 'bw'
    const b = document.createElement('div'); b.className = 'band'
    b.style.clipPath = `inset(${(i * 100) / 6 - 0.2}% 0 ${100 - ((i + 1) * 100) / 6 - 0.2}% 0)`
    bw.appendChild(b); $('.collage').appendChild(bw)
  }
  $$('.a-title span').forEach((s) => { s.innerHTML = [...s.textContent].map((c) => `<i>${c === ' ' ? '&nbsp;' : c}</i>`).join('') })
  W.rowOrder.forEach((id) => {
    const f = by[id], b = document.createElement('button')
    b.className = 'a-f'; b.style.setProperty('--ac', f.col); b.dataset.go = id; b.setAttribute('aria-label', `Meet ${f.name}`)
    b.innerHTML = `<img src="assets/sit/${id}.webp" alt="${f.name}" draggable="false"><span>${f.name}</span>`
    $('.a-row').appendChild(b)
  })
  const star = '<g class="sp"><path d="M0-16V16M-16 0H16M-11-11L11 11M11-11L-11 11"/><circle r="3.5" fill="currentColor"/></g>'
  const link = (k, cls, label, d, sx, sy) => `<button class="link ${cls}" data-open="${k}" aria-label="${label}"><svg viewBox="0 0 300 130" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path class="ln" d="${d}"/><g transform="translate(${sx} ${sy})"><g class="st">${star}</g></g></svg><span>${label}</span></button>`
  const fsec = F.map((f) => {
    const s = document.createElement('section'); s.className = 'fairy'; s.id = f.id
    s.style.setProperty('--ac', f.col); s.style.setProperty('--ac2', f.col2)
    s.innerHTML = `<div class="f-fig"><img src="assets/stand/${f.id}.webp" alt="${f.name}, ${f.title}" draggable="false"></div>` +
      link('about', 'l', 'About Me', 'M292 16C200 8 70 14 44 84', 40, 94) + link('powers', 'r', 'My Powers', 'M8 114C100 124 230 120 256 50', 260, 40) +
      `<h2 class="f-name" aria-label="${f.name}">${[...f.name].map((c) => `<i aria-hidden="true">${c}</i>`).join('')}</h2>`
    main.insertBefore(s, $('#end')); return s
  })
  $$('.ln').forEach((p) => { try { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L } catch (e) {} })
  const dots = $('.dots')
  F.forEach((f) => { const b = document.createElement('button'); b.style.setProperty('--c', f.col2); b.setAttribute('aria-label', f.name); b.title = f.name; b.dataset.go = f.id; dots.appendChild(b) })
  $('#copy').textContent = `© ${W.year} ${W.owner}. Website design, code and music by ${W.owner}. Winx Club™ and all related characters, names and artwork belong to Rainbow S.r.l. and its licensors. Unofficial fan tribute, not for profit.`
  $('#legal-links').innerHTML = Object.keys(W.legal).map((k) => `<button data-legal="${k}">${k}</button>`).join('')

  /* ---------- navigation ---------- */
  function go(id) {
    const st = ScrollTrigger.getById(id); if (!st) return
    gsap.to(window, { scrollTo: { y: st.start + (st.end - st.start) * 0.6, autoKill: false }, duration: reduce ? 0.01 : 2.2, ease: 'power2.inOut' })
  }
  const dlg = $('#legal')
  function showLegal(k) {
    dlg.innerHTML = `<div class="tabs">${Object.keys(W.legal).map((t) => `<button class="${t === k ? 'on' : ''}" data-t="${t}">${t}</button>`).join('')}</div><h3>${k}</h3>${W.legal[k].map((p) => `<p>${fill(p)}</p>`).join('')}<button class="btn" data-close>Close</button>`
    if (!dlg.open) dlg.showModal()
  }
  dlg.addEventListener('click', (e) => {
    const t = e.target.closest('[data-t]'); if (t) return showLegal(t.dataset.t)
    if (e.target.closest('[data-close]') || e.target === dlg) dlg.close()
  })

  /* ---------- About Me / My Powers panel ---------- */
  const panel = $('#panel'), scrim = $('#scrim'); let openF = null
  function openPanel(id, kind) {
    const f = by[id], side = kind === 'about' ? 'left' : 'right', fig = $(`#${id} .f-fig`)
    panel.className = 'panel ' + side; panel.style.setProperty('--ac', f.col); panel.style.setProperty('--ac2', f.col2)
    const facts = `<ul class="facts"><li><b>Home world</b> ${f.world}</li><li><b>Joins the Winx</b> ${f.joins}</li><li><b>Partner</b> ${f.partner}</li></ul>`
    panel.innerHTML = `<button class="x" aria-label="Close">×</button><p class="k">${f.title}</p><h3>${kind === 'about' ? 'About ' + f.name : f.name + '’s Powers'}</h3>` +
      (kind === 'about' ? f.about.map((p) => `<p class="rv">${p}</p>`).join('') + facts : f.powers.map(([n, d]) => `<div class="pw rv"><h4>${n}</h4><p>${d}</p></div>`).join(''))
    panel.setAttribute('aria-hidden', 'false'); openF = { side, fig }
    document.documentElement.style.overflow = 'hidden'
    gsap.set(panel, { visibility: 'visible', xPercent: side === 'left' ? -108 : 108 })
    gsap.to(scrim, { autoAlpha: 1, duration: 0.5 })
    gsap.to(panel, { xPercent: 0, duration: 0.9, ease: 'expo.out' })
    gsap.fromTo(panel.querySelectorAll('.k,h3,.rv,.facts'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, delay: 0.25, ease: 'power3.out' })
    gsap.to(fig, { x: side === 'left' ? '10vw' : '-10vw', duration: 0.9, ease: 'power3.out' })
    panel.querySelector('.x').focus({ preventScroll: true })
  }
  function closePanel() {
    if (!openF) return
    const { side, fig } = openF; openF = null
    gsap.to(panel, { xPercent: side === 'left' ? -108 : 108, duration: 0.6, ease: 'power3.in', onComplete: () => { gsap.set(panel, { visibility: 'hidden' }); panel.setAttribute('aria-hidden', 'true') } })
    gsap.to(scrim, { autoAlpha: 0, duration: 0.5 }); gsap.to(fig, { x: 0, duration: 0.8, ease: 'power3.out' })
    document.documentElement.style.overflow = ''
  }
  scrim.addEventListener('click', closePanel)
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel() })
  panel.addEventListener('click', (e) => { if (e.target.closest('.x')) closePanel() })

  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-open]'); if (o) return openPanel(o.closest('.fairy').id, o.dataset.open)
    const g = e.target.closest('[data-go]'); if (g) return go(g.dataset.go)
    const en = e.target.closest('[data-end]')
    if (en) return gsap.to(window, { scrollTo: en.dataset.end === 'top' ? 0 : ScrollTrigger.getById('alfea').end, duration: 2.4, ease: 'power2.inOut' })
    const lg = e.target.closest('[data-legal]'); if (lg) showLegal(lg.dataset.legal)
  })

  /* ---------- sound ---------- */
  const snd = $('#snd'); let started = false
  const setSnd = (on) => { snd.classList.toggle('on', on); snd.classList.toggle('off', !on); snd.setAttribute('aria-pressed', on) }
  function begin() { if (started) return; started = true; snd.classList.add('started'); Sound.start(); setSnd(true) }
  snd.addEventListener('click', () => {
    if (!started) return begin()
    if (Sound.on) { Sound.stop(); setSnd(false) } else { Sound.start(); setSnd(true) }
  })
  const first = (e) => { if (e.target.closest && e.target.closest('#snd')) return; begin() }   // browsers only allow audio after a click or key press
  addEventListener('click', first); addEventListener('keydown', first)

  /* ---------- hero: edgy intro, glitch loop, mouse parallax, scroll exit ---------- */
  const rnd = gsap.utils.random
  function glitch() {
    const g = gsap.timeline()
    g.set('.ghost', { opacity: 0.9 }, 0)
      .to('.ghost.r', { x: () => rnd(-16, -4), y: () => rnd(-3, 3), duration: 0.05, repeat: 7, yoyo: true, ease: 'none', repeatRefresh: true }, 0)
      .to('.ghost.c', { x: () => rnd(4, 16), y: () => rnd(-3, 3), duration: 0.05, repeat: 7, yoyo: true, ease: 'none', repeatRefresh: true }, 0)
      .to('.logo-in', { skewX: () => rnd(-9, 9), duration: 0.04, repeat: 7, yoyo: true, repeatRefresh: true }, 0)
      .to('.bw', { x: () => rnd(-16, 16), duration: 0.05, repeat: 5, yoyo: true, stagger: 0.012, repeatRefresh: true }, 0)
      .set('.ghost', { opacity: 0, x: 0, y: 0 }).set('.logo-in', { skewX: 0 }).set('.bw', { x: 0 })
  }
  if (!reduce) {
    gsap.timeline({ delay: 0.3 })
      .from('.bw', { xPercent: (i) => 115 + i * 10, skewX: -28, opacity: 0, duration: 1.2, stagger: 0.09, ease: 'expo.out' })
      .from('.logo-in', { scale: 1.3, opacity: 0, filter: 'blur(16px)', duration: 1.3, ease: 'power3.out' }, 0.2)
      .add(() => { glitch(); (function loop() { gsap.delayedCall(rnd(3.5, 7), () => { glitch(); loop() }) })() }, 1.1)
    if (matchMedia('(pointer:fine)').matches) {
      const ry = gsap.quickTo('.collage', 'rotationY', { duration: 0.8 }), rx = gsap.quickTo('.collage', 'rotationX', { duration: 0.8 }), lx = gsap.quickTo('.logo-in', 'x', { duration: 0.9 })
      $('.hero').addEventListener('pointermove', (e) => { const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5; ry(x * -10); rx(y * 8); lx(x * -18) })
    }
  }
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=100%', pin: true, scrub: 0.5, anticipatePin: 1, id: 'hero' } })
    .to('.band', { xPercent: (i) => (i % 2 ? -70 : 70), skewX: (i) => (i % 2 ? -14 : 14), opacity: 0, ease: 'power2.in', duration: 1, stagger: 0.05 }, 0)
    .to('.logo', { scale: 0.72, yPercent: -10, opacity: 0, duration: 0.8 }, 0)
    .to('.hero-hint', { opacity: 0, duration: 0.2 }, 0)

  /* ---------- black -> rainbow gradient, title, story, fairies rise ---------- */
  const A = $('#alfea')
  gsap.timeline({ scrollTrigger: { trigger: A, start: 'top top', end: '+=320%', pin: true, scrub: 0.7, anticipatePin: 1, id: 'alfea', onUpdate: (s) => A.classList.toggle('ready', s.progress > 0.8) } })
    .to('.layer.rainbow', { '--r': '115%', duration: 1.4, ease: 'power1.inOut' }, 0)
    .from('.a-title i', { yPercent: 110, opacity: 0, rotate: 8, stagger: 0.05, duration: 0.5 }, 0.5)
    .from('.a-copy', { opacity: 0, y: 30, duration: 0.4 }, 0.8)
    .from('.a-p1', { opacity: 0, y: 40, duration: 0.5 }, 0.9)
    .to('.a-p1', { opacity: 0, y: -30, duration: 0.4 }, 1.9)
    .from('.a-p2', { opacity: 0, y: 40, duration: 0.5 }, 2.0)
    .from('.a-f', { yPercent: 120, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'back.out(1.4)' }, 2.1)
    .from('.a-hint', { opacity: 0, y: 14, duration: 0.3 }, 2.9)

  /* ---------- each fairy: background blends in, then she appears ---------- */
  F.forEach((f, i) => {
    const s = fsec[i], layer = $(`.layer[data-f="${f.id}"]`)
    gsap.fromTo(layer, { opacity: 0, scale: 1.18 }, { opacity: 1, scale: 1, ease: 'none', scrollTrigger: { trigger: s, start: 'top 92%', end: 'top 8%', scrub: true } })
    const tl = gsap.timeline({
      scrollTrigger: { trigger: s, start: 'top top', end: '+=140%', pin: true, scrub: 0.6, anticipatePin: 1, id: f.id,
        onToggle: (self) => { if (self.isActive) $$('.dots button').forEach((b, j) => b.classList.toggle('on', j === i)) } },
      defaults: { ease: 'power2.out' }
    })
    tl.from(s.querySelector('.f-fig'), { yPercent: 16, scale: 0.86, opacity: 0, duration: 0.4 }, 0)
      .from(s.querySelectorAll('.f-name i'), { yPercent: 120, rotateX: -80, opacity: 0, stagger: 0.04, duration: 0.25 }, 0.15)
      .to(s.querySelectorAll('.ln'), { strokeDashoffset: 0, duration: 0.3 }, 0.35)
      .from(s.querySelectorAll('.st'), { scale: 0, opacity: 0, duration: 0.25 }, 0.55)
      .from(s.querySelectorAll('.link span'), { opacity: 0, y: 12, duration: 0.25 }, 0.6)
      .to(s.querySelector('.f-fig'), { yPercent: -2, duration: 0.6 }, 0.45)
    if (!reduce) gsap.to(s.querySelector('.f-fig img'), { y: -12, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' })
  })
  ScrollTrigger.create({ start: () => ScrollTrigger.getById('alfea').end - 20, end: 'max', onToggle: (s) => dots.classList.toggle('show', s.isActive) })
  gsap.from('.outro .card, .outro footer', { y: 70, opacity: 0, stagger: 0.15, duration: 1, scrollTrigger: { trigger: '#end', start: 'top 60%', toggleActions: 'play none none reverse' } })
  addEventListener('load', () => ScrollTrigger.refresh())

  /* ---------- glitter ---------- */
  ;(function () {
    const c = $('#glitter'), x = c.getContext('2d'), COL = ['#ffffff', '#ffd86b', '#ff9bd2', '#9be7ff', '#c9a6ff']
    let w, h, st = [], ds = []
    const pick = () => COL[(Math.random() * COL.length) | 0]
    function size() { w = c.width = innerWidth; h = c.height = innerHeight; st = Array.from({ length: Math.min(60, (w * h) / 20000) | 0 }, () => ({ x: Math.random() * w, y: Math.random() * h, s: Math.random() * 4 + 2, p: Math.random() * 6.28, v: Math.random() * 0.35 + 0.08, c: pick() })) }
    function star(px, py, r, col, a) {
      x.globalAlpha = a; x.fillStyle = col; x.shadowColor = col; x.shadowBlur = r * 2
      x.beginPath(); x.moveTo(px, py - r); x.quadraticCurveTo(px, py, px + r, py); x.quadraticCurveTo(px, py, px, py + r); x.quadraticCurveTo(px, py, px - r, py); x.quadraticCurveTo(px, py, px, py - r); x.fill()
    }
    function frame(t) {
      x.clearRect(0, 0, w, h)
      for (const s of st) { s.y -= s.v; if (s.y < -10) s.y = h + 10; star(s.x, s.y, s.s * (0.6 + 0.4 * Math.sin(t * 0.003 + s.p)), s.c, 0.25 + 0.55 * Math.abs(Math.sin(t * 0.002 + s.p))) }
      ds = ds.filter((d) => d.l > 0)
      for (const d of ds) { d.x += d.vx; d.y += d.vy; d.vy += 0.03; d.l -= 0.02; star(d.x, d.y, d.s * d.l + 1, d.c, d.l) }
      requestAnimationFrame(frame)
    }
    size(); addEventListener('resize', size)
    if (reduce) return
    addEventListener('pointermove', (e) => { for (let i = 0; i < 2 && ds.length < 160; i++) ds.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - 0.5) * 1.6, vy: -Math.random(), s: Math.random() * 5 + 2, c: pick(), l: 1 }) })
    requestAnimationFrame(frame)
  })()
})()
