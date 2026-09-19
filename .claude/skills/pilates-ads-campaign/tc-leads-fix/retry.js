const fs=require('fs');
const {pageToken,post,get,RE,NEW}=require('./edit.js');
(async()=>{
 const tok=await pageToken('2267713623553786');
 const tc=JSON.parse(fs.readFileSync('tc-posts.json','utf8'));
 const state=fs.existsSync('state.json')?JSON.parse(fs.readFileSync('state.json','utf8')):{done:[],fail:[]};
 const doneSet=new Set(state.done);
 let gap=20000;
 for(const p of tc){
  if(doneSet.has(p.id)) continue;
  const msg=p.message.replace(RE,NEW);
  if(msg===p.message){doneSet.add(p.id);continue;}
  let tries=0, okd=false;
  while(tries<4 && !okd){
   const res=await post(tok,p.id,{message:msg});
   if(res.success){okd=true; doneSet.add(p.id); gap=Math.max(15000,gap-1000);}
   else{
    tries++;
    const m=(res.error&&res.error.message)||'';
    if(/limit how often/i.test(m)){ gap=Math.min(300000,Math.round(gap*2)); await new Promise(r=>setTimeout(r,gap)); }
    else { state.fail.push({id:p.id,url:p.permalink_url,err:m}); break; }
   }
  }
  state.done=[...doneSet];
  fs.writeFileSync('state.json',JSON.stringify(state));
  console.log(new Date().toISOString(), okd?'OK':'SKIP', doneSet.size+'/'+tc.length, 'gap='+Math.round(gap/1000)+'s');
  await new Promise(r=>setTimeout(r,gap));
 }
 console.log('FINISHED done='+doneSet.size+' failed='+state.fail.length);
})();
