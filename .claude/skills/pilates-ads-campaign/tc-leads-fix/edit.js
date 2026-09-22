const {pageToken}=require('./pagetok.js');
const RE=/https?:\/\/tc-leads\.co\.il\/[^\s]*/g;
const NEW='https://guraleapilates.com/contact/';
async function post(tok,id,body){
  const u='https://graph.facebook.com/v21.0/'+id;
  const p=new URLSearchParams({...body,access_token:tok});
  const r=await fetch(u,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},body:p});
  return r.json();
}
async function get(tok,id,fields){
  const u=new URL('https://graph.facebook.com/v21.0/'+id);
  u.searchParams.set('fields',fields); u.searchParams.set('access_token',tok);
  const r=await fetch(u); return r.json();
}
module.exports={pageToken,post,get,RE,NEW};
