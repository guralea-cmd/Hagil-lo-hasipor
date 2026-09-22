// מתקן את הקישור המת tc-leads בפוסטים הישנים, מהחדשים לישנים.
// שימוש: node fix-newest.js [כמה פוסטים]   (ברירת מחדל 20)
const fs=require('fs');
const {pageToken,post,get,RE,NEW}=require('./edit.js');
const N=parseInt(process.argv[2]||'20',10);
const PAGE='2267713623553786';
(async()=>{
 const tok=await pageToken(PAGE);
 const ids=JSON.parse(fs.readFileSync('post-ids.json','utf8'));
 const state=JSON.parse(fs.readFileSync('state.json','utf8'));
 state.done=state.done||[]; state.fail=state.fail||[]; state.nomatch=state.nomatch||[]; state.skipped=state.skipped||[];
 const handled=new Set([...state.done,...state.nomatch,...state.skipped.map(x=>x.id||x)]);
 const queue=ids.filter(p=>!handled.has(p.id)).sort((a,b)=>new Date(b.t)-new Date(a.t)).slice(0,N);
 console.log('queue:',queue.length,'| new link:',NEW);
 let gap=20000, fixed=0;
 for(const p of queue){
  const cur=await get(tok,p.id,'message,permalink_url');
  if(cur.error){ state.skipped.push({id:p.id,url:p.url,reason:'GET: '+cur.error.message}); console.log('SKIP(get)',p.id,cur.error.message); fs.writeFileSync('state.json',JSON.stringify(state)); continue; }
  if(!cur.message){ state.skipped.push({id:p.id,url:p.url,reason:'no editable message (probably reel/video)'}); console.log('SKIP(no message)',p.id); fs.writeFileSync('state.json',JSON.stringify(state)); continue; }
  if(!RE.test(cur.message)){ RE.lastIndex=0; state.nomatch.push(p.id); console.log('NOMATCH',p.id); fs.writeFileSync('state.json',JSON.stringify(state)); continue; }
  RE.lastIndex=0;
  const msg=cur.message.replace(RE,NEW);
  let ok=false, tries=0, lastErr='';
  while(tries<4 && !ok){
   const res=await post(tok,p.id,{message:msg});
   if(res.success||res.id){ ok=true; }
   else { tries++; lastErr=(res.error&&res.error.message)||JSON.stringify(res);
     if(/limit how often/i.test(lastErr)){ gap=Math.min(300000,gap*2); console.log('rate limited, waiting '+Math.round(gap/1000)+'s'); await new Promise(r=>setTimeout(r,gap)); }
     else break; }
  }
  if(ok){
   const chk=await get(tok,p.id,'message');
   const verified=chk.message && chk.message.includes(NEW) && !/tc-leads\.co\.il/.test(chk.message);
   if(verified){ state.done.push(p.id); fixed++; console.log('OK',p.id,p.t.slice(0,10),'verified'); }
   else { state.skipped.push({id:p.id,url:p.url,reason:'edit reported success but text unchanged'}); console.log('FAIL(verify)',p.id); }
  } else {
   state.skipped.push({id:p.id,url:p.url,reason:lastErr.slice(0,160)});
   console.log('FAIL',p.id,lastErr.slice(0,120));
  }
  fs.writeFileSync('state.json',JSON.stringify(state));
  await new Promise(r=>setTimeout(r,gap));
 }
 console.log('DONE fixed='+fixed+' total_done='+state.done.length+' skipped='+state.skipped.length+' remaining='+(ids.length-state.done.length));
})();
