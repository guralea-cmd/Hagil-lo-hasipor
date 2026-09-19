const fs=require('fs');
const REPO='C:/Users/gural/OneDrive/מסמכים/GitHub/Hagil-lo-hasipor';
const ads=JSON.parse(fs.readFileSync(REPO+'/.claude/skills/facebook-ads-plan/secrets.json','utf8'));
const TOKEN=ads.userAccessToken;
const V='v21.0';
async function g(path, params={}){
  const u=new URL(`https://graph.facebook.com/${V}/${path}`);
  for(const [k,v] of Object.entries(params)) u.searchParams.set(k,v);
  u.searchParams.set('access_token',TOKEN);
  const r=await fetch(u);
  const j=await r.json();
  return j;
}
module.exports={g,TOKEN,V};
if(require.main===module){
  (async()=>{
    const acct='act_2148850321876940';
    console.log('--- ADSETS ---');
    console.log(JSON.stringify(await g(acct+'/adsets',{fields:'id,name,status,daily_budget,targeting,effective_status',limit:50}),null,1));
    console.log('--- ADS ---');
    console.log(JSON.stringify(await g(acct+'/ads',{fields:'id,name,status,effective_status,adset_id,creative{id,name,object_story_spec,effective_object_story_id}',limit:50}),null,1));
  })();
}
