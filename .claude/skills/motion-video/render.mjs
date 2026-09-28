// render.mjs - מרנדר אנימציית HTML (עם window.seek(t)) לסרטון MP4, דרך Edge בלי ממשק + ffmpeg.
// שימוש:
//   node render.mjs <anim.html> <out.mp4> --w 1080 --h 1920 --dur 6 [--fps 60] [--sub 4] [--audio jingle.mp3 --audio-start 0]
//   node render.mjs <anim.html> <outDir> --beats 120 --dur 6 --w 1080 --h 1920   (פריים אחד לכל פעמה, לבדיקה לפני רינדור מלא)
// הדף חייב להגדיר window.seek(t) (t בשניות) שמצייר את הפריים כפונקציה טהורה של הזמן - בלי CSS transitions ובלי טיימרים.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const args = process.argv.slice(2);
const [src, out] = args;
const opt = k => { const i = args.indexOf('--' + k); return i > -1 ? args[i + 1] : undefined; };
const W = +(opt('w') || 1080), H = +(opt('h') || 1920), DUR = +(opt('dur') || 6);
const FPS = +(opt('fps') || 60), SUB = +(opt('sub') || 4), BEATS = opt('beats') ? +opt('beats') : null;
const audio = opt('audio'), audioStart = +(opt('audio-start') || 0);

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const port = 9400 + Math.floor(Math.random() * 400);
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-edge-'));
const ed = spawn(edge, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars', '--force-device-scale-factor=1', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let list; for (let i = 0; i < 60 && !list; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch { await sleep(250); } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => (ws.onopen = r));
let id = 0; const pend = {};
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'file:///' + path.resolve(src).replace(/\\/g, '/') });
await sleep(1500);
await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
const snap = async (t, file) => {
  await send('Runtime.evaluate', { expression: `window.seek(${t})` });
  const r = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
  fs.writeFileSync(file, Buffer.from(r.result.data, 'base64'));
};

if (BEATS) {
  // פריים אחד לכל פעמה - לבדוק שכל דבר נופל על הגריד, לא צפוף וקריא
  fs.mkdirSync(out, { recursive: true });
  const spb = 60 / BEATS;
  for (let b = 0; b * spb <= DUR + 1e-6; b++) await snap(b * spb, path.join(out, `beat-${String(b).padStart(2, '0')}.png`));
  console.log('beat frames ->', out);
} else {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-frames-'));
  const total = Math.round(DUR * FPS * SUB);
  for (let i = 0; i < total; i++) await snap(i / (FPS * SUB), path.join(tmp, `f${String(i).padStart(6, '0')}.png`));
  // SUB תת-פריימים לכל פריים, ממוצע עם tmix = טשטוש תנועה, ואז דגימה ל-FPS
  const vf = `tmix=frames=${SUB}:weights=${Array(SUB).fill(1).join(' ')},select='not(mod(n\\,${SUB}))',setpts=N/${FPS}/TB,format=yuv420p`;
  const a = ['-y', '-framerate', String(FPS * SUB), '-i', path.join(tmp, 'f%06d.png')];
  if (audio) a.push('-ss', String(audioStart), '-t', String(DUR), '-i', audio);
  a.push('-vf', vf, '-r', String(FPS), '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', '-pix_fmt', 'yuv420p');
  if (audio) a.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
  a.push('-movflags', '+faststart', out);
  const r = spawnSync('ffmpeg', a, { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(r.status === 0 ? 'done -> ' + out : 'ffmpeg failed');
}
ws.close(); ed.kill();
spawnSync('powershell', ['-NoProfile', '-Command', `Get-CimInstance Win32_Process -Filter "Name='msedge.exe'" | ? { $_.CommandLine -like '*${port}*' } | % { try { Stop-Process -Id $_.ProcessId -Force -ErrorAction Stop } catch {} }`]);
