// Tool Shield interactive inventory. Local only: state is saved in localStorage, nothing is sent anywhere.
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
 cnt.textContent=k?L.cnt.replace('{n}',k).replace('{s}',k===1?'':L.pl):L.none;
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
calc();
function show(){if(!S.hidden)return;S.hidden=false;}
if(ty){if(!ty.hidden)show();new MutationObserver(function(){if(!ty.hidden)show();}).observe(ty,{attributes:true,attributeFilter:['hidden']});}
})();
