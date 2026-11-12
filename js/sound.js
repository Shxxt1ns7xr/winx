/* Original magical ambience generated live with the Web Audio API: no audio files, so no copyright or royalty issues.
   Soft evolving pad chords + harp-like plucks + sparkles through a long reverb. */
window.Sound = (function () {
  let ctx, master, bus, timer, chordTimer, on = false, ci = 0
  const hz = (n) => 261.63 * Math.pow(2, n / 12)
  const CH = [[0, 4, 7, 11], [-3, 0, 4, 7], [-7, -3, 0, 4], [-5, -1, 2, 4]]   // Cmaj7, Am7, Fmaj7, G6
  const SC = [0, 2, 4, 7, 9]
  function init() {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination)
    const len = ctx.sampleRate * 3.4, buf = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6) }
    const verb = ctx.createConvolver(); verb.buffer = buf
    const vg = ctx.createGain(); vg.gain.value = 0.9; verb.connect(vg); vg.connect(master)
    const dry = ctx.createGain(); dry.gain.value = 0.6; dry.connect(master)
    bus = ctx.createGain(); bus.connect(dry); bus.connect(verb)
  }
  function pad() {
    const t = ctx.currentTime, ch = CH[ci++ % 4]
    ch.forEach((n, k) => [0, 1].forEach((d) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter()
      o.type = k % 2 ? 'triangle' : 'sine'; o.frequency.value = hz(n - 12); o.detune.value = d * 6
      f.type = 'lowpass'; f.frequency.value = 1400
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.028, t + 2.2); g.gain.linearRampToValueAtTime(0, t + 8.6)
      o.connect(f); f.connect(g); g.connect(bus); o.start(t); o.stop(t + 8.8)
    }))
  }
  function pluck(n, v, len) {
    const t = ctx.currentTime, o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), g2 = ctx.createGain()
    o.type = 'sine'; o2.type = 'triangle'; o.frequency.value = hz(n); o2.frequency.value = hz(n) * 2; g2.gain.value = 0.25
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + len)
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(bus); o.start(t); o2.start(t); o.stop(t + len + 0.1); o2.stop(t + len + 0.1)
  }
  function arp() {
    if (!on) return
    const ch = CH[(ci + 3) % 4]
    pluck(ch[(Math.random() * 4) | 0] + 12 * (Math.random() < 0.5 ? 1 : 2), 0.05 + Math.random() * 0.04, 1.8)
    if (Math.random() < 0.22) pluck(SC[(Math.random() * 5) | 0] + 24, 0.03, 2.4)
    timer = setTimeout(arp, 300 + Math.random() * 420)
  }
  return {
    get on() { return on },
    start() {
      if (!ctx) init()
      ctx.resume(); on = true
      master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(0.8, ctx.currentTime, 0.6)
      clearInterval(chordTimer); clearTimeout(timer); pad(); chordTimer = setInterval(pad, 8000); arp()
    },
    stop() {
      on = false; clearTimeout(timer); clearInterval(chordTimer)
      if (ctx) master.gain.setTargetAtTime(0, ctx.currentTime, 0.25)
    }
  }
})()
