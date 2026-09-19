const {g}=require('./fb.js');
async function pageToken(pid){
  const r=await g('me/accounts',{fields:'id,access_token',limit:50});
  return (r.data||[]).find(p=>p.id===pid).access_token;
}
async function gp(tok,path,params={}){
  const u=new URL('https://graph.facebook.com/v21.0/'+path);
  for(const [k,v] of Object.entries(params)) u.searchParams.set(k,v);
  u.searchParams.set('access_token',tok);
  const r=await fetch(u); return r.json();
}
module.exports={pageToken,gp};
