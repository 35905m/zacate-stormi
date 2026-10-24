// Tool Shield interactive inventory. State is saved in localStorage. Nothing is sent over the network; 'Send' opens the lead's own email/text app (mailto:/sms:).
(function(){
var S=document.getElementById('inv'),D=document.getElementById('inv-data'),ty=document.getElementById('ty');if(!S||!D)return;
var d=JSON.parse(D.textContent),L=d.t,KEY='ts-inv-'+d.page,st={};try{st=JSON.parse(localStorage.getItem(KEY))||{};}catch(e){}
var fmt=new Intl.NumberFormat(d.lang==='es'?'es-US':'en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
var body=S.querySelector('.inv-body'),amt=S.querySelector('.amt'),cnt=S.querySelector('.cnt'),shown=0,raf;
function esc(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
var h='',n=0;d.cats.forEach(function(c,ci){h+='<details class="inv-cat"'+(ci===0?' open':'')+'><summary>'+esc(c[0])+'<small data-c="'+ci+'"></small></summary><div>';
 c[1].forEach(function(it){var id='i'+n++,s=st[id]||{},on=!!s.on;
  h+='<div class="inv-it'+(on?' on':'')+'" data-id="'+id+'" data-c="'+ci+'"><input type="checkbox" id="'+id+'"'+(on?' checked':'')+' aria-label="'+esc(L.own+': '+it[0])+'"><label class="nm" for="'+id+'">'+esc(it[0])+'</label>'+
  '<div class="ex"><label>'+esc(L.qty)+' <input type="number" inputmode="numeric" min="1" step="1" class="q" value="'+(s.q||1)+'"></label><label class="v">$ <input type="number" inputmode="numeric" min="0" step="10" class="vv" value="'+(s.v!=null?s.v:it[1])+'" aria-label="'+esc(L.val)+'"></label></div></div>';});
 h+='</div></details>';});
body.innerHTML=h;
function calc(){var tot=0,k=0,per={};st={};
 body.querySelectorAll('.inv-it').forEach(function(r){var cb=r.querySelector('input[type=checkbox]'),q=+r.querySelector('.q').value||0,v=+r.querySelector('.vv').value||0;
  r.classList.toggle('on',cb.checked);if(cb.checked){k++;tot+=q*v;per[r.dataset.c]=(per[r.dataset.c]||0)+1;}
  if(cb.checked||r.querySelector('.q').value!='1'||r.querySelector('.vv').defaultValue!=r.querySelector('.vv').value)st[r.dataset.id]={on:cb.checked,q:q,v:v};});
 body.querySelectorAll('summary small').forEach(function(s){var c=per[s.dataset.c]||0;s.textContent=c?('✔ '+c):'';s.closest('.inv-cat').classList.toggle('has',c>0);});
 var N=body.querySelectorAll('.inv-it').length,G=[25,50,100,N].filter(function(g){return g<=N;}),g=G.filter(function(x){return x>k;})[0],pv=G.filter(function(x){return x<=k;}).pop()||0;
 cnt.textContent=(k?L.cnt.replace('{n}',k).replace('{s}',k===1?'':L.pl):L.none)+' · '+(g?L.ms.replace('{m}',g-k).replace('{g}',g):L.msd.replace('{g}',N));
 var pb=S.querySelector('.pg i');if(pb){pb.style.width=(g?Math.round(100*(k-pv)/(g-pv)):100)+'%';S.querySelector('.pg').classList.toggle('done',!g);}
 try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}
 anim(tot);S.querySelector('.inv-pr').textContent=L.prt.replace('{n}',k).replace('{t}',fmt.format(tot))+' · '+new Date().toLocaleDateString(d.lang==='es'?'es-US':'en-US');}
function anim(to){cancelAnimationFrame(raf);var from=shown,t0=performance.now(),dur=matchMedia('(prefers-reduced-motion: reduce)').matches?0:600;
 amt.classList.add('bump');setTimeout(function(){amt.classList.remove('bump');},200);
 (function step(t){var p=dur?Math.min(1,(t-t0)/dur):1,e=1-Math.pow(1-p,3);shown=Math.round(from+(to-from)*e);amt.textContent=fmt.format(shown);if(p<1)raf=requestAnimationFrame(step);})(t0);}
body.addEventListener('input',calc);body.addEventListener('change',calc);
S.querySelector('.prt').addEventListener('click',function(){document.querySelectorAll('.inv-cat.has').forEach(function(x){x.open=true;});document.documentElement.classList.add('inv-printing');window.print();});
window.addEventListener('afterprint',function(){document.documentElement.classList.remove('inv-printing');});
S.querySelector('.clr').addEventListener('click',function(){if(!confirm(L.clrq))return;try{localStorage.removeItem(KEY);}catch(e){}st={};
 body.querySelectorAll('.inv-it').forEach(function(r){r.querySelector('input[type=checkbox]').checked=false;r.querySelector('.q').value=1;r.querySelector('.vv').value=r.querySelector('.vv').defaultValue;});calc();});

var LK='ts-lead';function lead(){try{return JSON.parse(localStorage.getItem(LK))||{};}catch(e){return {};}}
document.addEventListener('submit',function(e){var f=e.target;if(!f||!f.elements)return;var g=function(n){var x=f.elements[n];return x&&x.value?String(x.value).trim():'';};
 var o={name:g('name'),email:g('email'),phone:g('phone')};if(o.name||o.email||o.phone){try{localStorage.setItem(LK,JSON.stringify(o));}catch(er){}}},true);
function listText(){var lines=[],tot=0,k=0,ld=lead();lines.push(L.hi,'');
 body.querySelectorAll('details.inv-cat').forEach(function(dc){var rows=[];dc.querySelectorAll('.inv-it').forEach(function(r){if(!r.querySelector('input[type=checkbox]').checked)return;
  var q=+r.querySelector('.q').value||0,v=+r.querySelector('.vv').value||0;k++;tot+=q*v;rows.push('[x] '+r.querySelector('.nm').textContent+' | '+L.qty_+' '+q+' | '+fmt.format(v)+(q>1?' ea = '+fmt.format(q*v):''));});
  if(rows.length){lines.push(dc.querySelector('summary').firstChild.textContent.toUpperCase());lines=lines.concat(rows);lines.push('');}});
 lines.push(L.it+': '+k,L.tl+': '+fmt.format(tot));
 if(ld.name||ld.phone||ld.email)lines.push('',L.fr+': '+[ld.name,ld.phone,ld.email].filter(Boolean).join(' · '));
 return {txt:lines.join('\n'),tot:fmt.format(tot),ld:ld};}
function fillEm(){var e=lead().email||'';S.querySelectorAll('.inv-em').forEach(function(i){if(!i.value)i.value=e;});}
if(ty)new MutationObserver(function(){setTimeout(fillEm,0);}).observe(ty,{attributes:true,attributeFilter:['hidden']});fillEm();
var MD=S.querySelector('.inv-mod');if(MD){MD.querySelector('.x').addEventListener('click',function(){MD.hidden=true;});MD.addEventListener('click',function(e){if(e.target===MD)MD.hidden=true;});}
function ok(m){S.querySelectorAll('.inv-ok').forEach(function(p){p.textContent=m;p.hidden=false;});}
S.querySelectorAll('.snd').forEach(function(b){b.addEventListener('click',function(){var lb=b.parentNode.querySelector('label.em'),inp=lb.querySelector('.inv-em');if(lb.hidden){lb.hidden=false;if(!inp.value)inp.value=lead().email||'';b.textContent=L.go;inp.focus();return;}var em=(inp.value||'').trim();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){inp.focus();ok(L.need);return;}var ld0=lead();ld0.email=em;try{localStorage.setItem(LK,JSON.stringify(ld0));}catch(e){}S.querySelectorAll('.inv-em').forEach(function(i){i.value=em;});var x=listText(),to=em,cc='cc='+encodeURIComponent(d.em)+'&';var md=S.querySelector('.inv-mod');md.querySelector('.big').textContent=x.tot;md.querySelector('.msg').textContent=L.sent;md.hidden=false;md.querySelector('.x').focus();
 location.href='mailto:'+encodeURIComponent(to).replace('%40','@')+'?'+cc+'subject='+encodeURIComponent(L.subj.replace('{t}',x.tot))+'&body='+encodeURIComponent(x.txt);ok(L.sent);S.querySelectorAll('.inv-top').forEach(function(t){t.querySelector('label.em').hidden=true;t.querySelector('.snd').textContent=L.send;t.querySelector('.inv-ok').hidden=true;});});});
S.querySelectorAll('.sms2').forEach(function(b){b.addEventListener('click',function(){var x=listText(),ph=(x.ld.phone||'').replace(/[^\d+]/g,'');
 location.href='sms:'+ph+(/iP(hone|ad|od)/.test(navigator.userAgent)?'&':'?')+'body='+encodeURIComponent(L.subj.replace('{t}',x.tot)+'\n\n'+x.txt);ok(L.smsok);});});
calc();
function show(){if(!S.hidden)return;S.hidden=false;}
if(ty){if(!ty.hidden)show();new MutationObserver(function(){if(!ty.hidden)show();}).observe(ty,{attributes:true,attributeFilter:['hidden']});}
})();
