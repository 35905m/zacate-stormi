// ============ FORM ENDPOINT ============
// Zapier Catch Hook (Webhooks by Zapier). Sent as application/x-www-form-urlencoded via fetch no-cors:
// a CORS "simple request" (no preflight). The response is opaque and is treated as success.
var TS_ENDPOINT = 'https://hooks.zapier.com/hooks/catch/13623300/41qo8im/';
var TS_CONSENT_VERSION = 'tcpa-v1-2026-10-19';
// =======================================
(function(){
var f=document.getElementById('f');if(!f)return;
var q=new URLSearchParams(location.search);if(q.get('name'))f.name.value=q.get('name');if(q.get('phone'))f.phone.value=q.get('phone');
var TR={lawn:'Lawn',plumbing:'Plumbing',hvac:'HVAC',electrical:'Electrical',tree:'Tree Service',other:'Other'};
function done(){f.hidden=true;document.getElementById('ty').hidden=false;document.getElementById('box').scrollIntoView({behavior:'smooth'});}
var sent=false;
f.addEventListener('submit',function(e){e.preventDefault();if(sent)return;
 var full=f.name.value.trim().replace(/\s+/g,' '),ok=full&&f.phone.value.replace(/\D/g,'').length>=10&&f.trade.value,em=f.email.value.trim();
 if(ok&&em&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em))ok=false;
 document.getElementById('err').hidden=!!ok;if(!ok)return;sent=true;
 var parts=full.split(' '),d=f.dataset,lang=d.lang,cons=f.querySelector('.consent');
 var b=new URLSearchParams({first_name:parts[0],last_name:parts.slice(1).join(' '),full_name:full,phone:f.phone.value.trim(),email:f.email.value.trim(),
  trade:TR[f.trade.value]||f.trade.value,language:lang,agent:d.agent,agent_name:d.agentName,page:d.page,page_url:location.origin+location.pathname,
  lead_source:'Tool Shield - '+(TR[f.trade.value]||f.trade.value)+' - '+lang.toUpperCase()+' - '+d.agentName,tag:'Tool Shield',
  consent:'yes',consent_version:TS_CONSENT_VERSION,consent_text:cons?cons.textContent.trim():'',submitted_at:new Date().toISOString()});
 q.forEach(function(v,k){if(k.indexOf('utm_')===0)b.append(k,v);});
 var btn=f.querySelector('button');if(btn)btn.disabled=true;
 var t=setTimeout(done,6000);
 fetch(TS_ENDPOINT,{method:'POST',mode:'no-cors',keepalive:true,body:b}).catch(function(){}).finally(function(){clearTimeout(t);done();});
});
if(location.hash==='#thanks')done();
})();
(function(){var v=document.getElementById('hero-video'),pb=document.getElementById('vid-play'),sb=document.getElementById('vid-sound');if(!v)return;
function sync(){var pl=!v.paused;pb.textContent=pl?pb.dataset.pause:pb.dataset.play;pb.setAttribute('aria-pressed',String(pl));sb.textContent=v.muted?sb.dataset.un:sb.dataset.mu;sb.setAttribute('aria-pressed',String(!v.muted));}
pb.addEventListener('click',function(){v.paused?v.play():v.pause();});sb.addEventListener('click',function(){v.muted=!v.muted;if(!v.muted&&v.paused)v.play();sync();});
v.addEventListener('play',sync);v.addEventListener('pause',sync);v.addEventListener('volumechange',sync);
var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!rm){var p=v.play();if(p&&p.catch)p.catch(function(){});}sync();})();
