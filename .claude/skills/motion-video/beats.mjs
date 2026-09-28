// beats.mjs - מוצא את הקצב (BPM) ואת גריד הפעמות של שיר, בלי Python (ffmpeg + Node).
// שימוש: node beats.mjs <song.mp3> [--from 0] [--dur 30]
// פלט JSON: bpm, offset (הפעמה הראשונה בשניות), beats[] (זמני פעמות), peaks[] (שיאי עוצמה חזקים - למיקום צלילים/אירועים).
import { spawnSync } from 'node:child_process';
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf('--' + k); return i > -1 ? +args[i + 1] : undefined; };
const SR = 22050, HOP = 256, from = opt('from') || 0, dur = opt('dur') || 30;
const r = spawnSync('ffmpeg', ['-v', 'error', '-ss', String(from), '-t', String(dur), '-i', args[0], '-ac', '1', '-ar', String(SR), '-f', 'f32le', '-'], { maxBuffer: 1 << 30 });
const pcm = new Float32Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.length / 4);

// מעטפת אונסט: הפרש חיובי של אנרגיה לוגריתמית בחלונות HOP
const n = Math.floor(pcm.length / HOP), env = new Float32Array(n);
let prev = 0;
for (let i = 0; i < n; i++) {
  let e = 0; for (let j = 0; j < HOP; j++) { const v = pcm[i * HOP + j]; e += v * v; }
  const le = Math.log1p(1000 * e); env[i] = Math.max(0, le - prev); prev = le;
}
const fps = SR / HOP;
// טמפו: אוטוקורלציה בטווח 70-180 BPM, עם העדפה קלה לסביבת 120
let best = { bpm: 120, s: -1 };
for (let bpm = 70; bpm <= 180; bpm += 0.25) {
  const lag = fps * 60 / bpm; let s = 0;
  for (let i = 0; i + lag < n; i++) { const k = i + lag, a = Math.floor(k), f = k - a; s += env[i] * (env[a] * (1 - f) + (env[a + 1] || 0) * f); }
  s *= Math.exp(-0.5 * Math.pow(Math.log2(bpm / 120) / 0.9, 2));
  if (s > best.s) best = { bpm, s };
}
// פאזה: ההיסט שבו סכום האונסטים על הגריד מקסימלי
const spb = 60 / best.bpm; let ph = { o: 0, s: -1 };
for (let o = 0; o < spb; o += 1 / fps) {
  let s = 0; for (let t = o; t < dur; t += spb) s += env[Math.round(t * fps)] || 0;
  if (s > ph.s) ph = { o, s };
}
const beats = []; for (let t = ph.o; t < dur; t += spb) beats.push(+(from + t).toFixed(3));
const thr = [...env].sort((a, b) => b - a)[Math.floor(n * 0.02)];
const peaks = []; for (let i = 1; i < n - 1; i++) if (env[i] >= thr && env[i] > env[i - 1] && env[i] >= env[i + 1]) peaks.push(+(from + i / fps).toFixed(3));
console.log(JSON.stringify({ bpm: +best.bpm.toFixed(2), offset: +(from + ph.o).toFixed(3), secondsPerBeat: +spb.toFixed(4), beats, peaks }, null, 1));
