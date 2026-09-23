// Weekly loader (moved into the repo 23.9 from the week-3 scratchpad, TikTok privacy fixed).
// Schedules a week's slots in Metricool. One call per network, so Facebook keeps the address
// and Instagram gets "הקישור בביו" (rule 11).
// Usage: node push-metricool.js <secrets.json> <schedule.json> <fromIndex> <toIndexExclusive> [--dry]
const fs = require('fs'), https = require('https');

const sec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const slots = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const from = parseInt(process.argv[4], 10), to = parseInt(process.argv[5], 10);
const DRY = process.argv.includes('--dry');

const USER = sec.userId;
const BRANDS = [
  { id: sec.brands.hagil_lo_hasipor.blogId, label: 'הגיל הוא לא הסיפור', tiktok: true },
  { id: sec.brands.figura_ramla.blogId,     label: 'פילאטיס רמלה',      tiktok: false },
];

function post(blogId, body) {
  const data = Buffer.from(JSON.stringify(body), 'utf8');
  const opts = {
    host: 'app.metricool.com',
    path: `/api/v2/scheduler/posts?userId=${USER}&blogId=${blogId}`,
    method: 'POST',
    headers: {
      'X-Mc-Auth': sec.userToken,
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': data.length,
    },
  };
  return new Promise((res, rej) => {
    const r = https.request(opts, resp => {
      let d = ''; resp.on('data', c => d += c);
      resp.on('end', () => res({ status: resp.statusCode, body: d }));
    });
    r.on('error', rej); r.write(data); r.end();
  });
}

const base = (slot, extra) => ({
  publicationDate: { dateTime: `${slot.date}T${slot.time}:00`, timezone: 'Asia/Jerusalem' },
  autoPublish: true,
  draft: false,
  ...extra,
});

(async () => {
  const log = [];
  for (let i = from; i < to && i < slots.length; i++) {
    const s = slots[i];
    const jobs = [];
    for (const b of BRANDS) {
      jobs.push(['feed/facebook',  b, base(s, { text: s.facebook,  providers: [{ network: 'facebook' }],  media: [s.feedUrl],  facebookData: { type: 'POST' } })]);
      jobs.push(['feed/instagram', b, base(s, { text: s.instagram, providers: [{ network: 'instagram' }], media: [s.feedUrl],  instagramData: { autoPublish: true, type: 'REEL', showReelOnFeed: true } })]);
      jobs.push(['story/facebook', b, base(s, { text: s.story,     providers: [{ network: 'facebook' }],  media: [s.storyUrl], facebookData: { type: 'STORY' } })]);
      jobs.push(['story/instagram',b, base(s, { text: s.story,     providers: [{ network: 'instagram' }], media: [s.storyUrl], instagramData: { autoPublish: true, type: 'STORY' } })]);
      if (b.tiktok) {
        // tiktokData.privacyOption is required - without it TikTok fails with
        // "does not specified privacy options" (23.9: all of week 3 was loaded without it).
        jobs.push(['tiktok', b, base(s, { text: s.facebook, providers: [{ network: 'tiktok' }], media: [s.tiktokUrl], tiktokData: { privacyOption: 'PUBLIC_TO_EVERYONE', photoCoverIndex: 0 } })]);
      }
    }
    for (const [kind, b, body] of jobs) {
      if (body.providers.some(p => p.network === 'tiktok') && !body.tiktokData?.privacyOption) throw new Error('TikTok job without tiktokData.privacyOption - refusing to send');
      if (DRY) { log.push(`DRY ${s.date} ${s.time} ${b.label} ${kind}`); continue; }
      const r = await post(b.id, body);
      let id = '';
      try { id = JSON.parse(r.body).data.id; } catch (e) { id = r.body.slice(0, 160); }
      log.push(`${r.status === 200 ? 'OK ' : 'ERR'} ${s.date} ${s.time} ${b.label} ${kind} -> ${id}`);
      console.log(log[log.length - 1]);
    }
  }
  fs.appendFileSync(process.argv[3] + '.log', log.join('\n') + '\n', 'utf8');
  console.log(`\ncalls: ${log.length}, errors: ${log.filter(l => l.startsWith('ERR')).length}`);
})();
