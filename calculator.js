/* tool-idade-gestacional-e-dpp · Elucenia · https://github.com/Elucenia/tool-idade-gestacional-e-dpp
   Copyright (c) 2026 Elucenia · Felipe Guedes (fgxdev.com). Licensed under the Apache License 2.0: keep this notice and the NOTICE file, and mark your changes.
   Standalone integration. Package metadata and rights: README.md. */
(function(root){'use strict';
function freeze(value){if(value&&typeof value==='object'){for(const item of Object.values(value))freeze(item);Object.freeze(value);}return value;}
const TOOL=freeze({"id":"idade-gestacional-e-dpp","title":"Idade gestacional e DPP pela DUM","fields":[["dum_d","DUM: dia","num",{"min":1,"max":31,"step":1,"ph":"12"}],["dum_m","DUM: mês","num",{"min":1,"max":12,"step":1,"ph":"3"}],["dum_a","DUM: ano","num",{"min":2015,"max":2040,"step":1,"ph":"2026"}],["ref_d","Data de referência: dia <small>(vazio = hoje)</small>","num",{"min":1,"max":31,"step":1,"ph":"25","opt":true}],["ref_m","Data de referência: mês","num",{"min":1,"max":12,"step":1,"ph":"9","opt":true}],["ref_a","Data de referência: ano","num",{"min":2015,"max":2040,"step":1,"ph":"2026","opt":true}]],"config":null,"reviewStatus":"needs-review","clinicalValidation":"not-performed"});
const window={};
/* Elucenia arithmetic registry. No DOM access, storage, telemetry or network requests. */
(function(root){
  'use strict';
  const CALC={fn:Object.create(null)};
  const round=(n,d=1)=>Math.round(n*Math.pow(10,d))/Math.pow(10,d);
  const yes=v=>v===true||v==='1'||v===1;
  CALC.h={
    r1:round,
    br:(n,d=1)=>round(n,d).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d}),
    band:(n,bands)=>{for(const b of bands)if(n<b[0])return b[1];return bands[bands.length-1][1];},
    sum:(values,weights)=>Object.entries(weights).reduce((n,[key,w])=>n+(yes(values[key])?w:0),0),yes
  };
  CALC.def=(id,fn)=>{if(CALC.fn[id])throw Error('Duplicate calculator '+id);CALC.fn[id]=fn;};
  CALC.score=(cfg,values)=>{
    let score=0;
    for(const[name,type,weight]of cfg.fields){const v=values[name];if(type==='chk'){if(yes(v))score+=weight;}else if(type==='radio'||type==='sel'){const n=parseFloat(v);if(!Number.isNaN(n))score+=n;}}
    score=round(score,2);let band=cfg.bands[0];for(const b of cfg.bands)if(score>=b[0])band=b;
    return{main:[String(score).replace('.',','),cfg.unit||(Math.abs(score)===1?'ponto':'pontos')],label:cfg.label,level:band[1],verdict:band[2],note:band[3]||'',raw:{score}};
  };
  CALC.run=(id,values,cfg)=>{if(cfg&&cfg.bands)return CALC.score(cfg,values);if(!CALC.fn[id])return{error:'Calculadora indisponível.'};return CALC.fn[id](values);};
  root.CALC=CALC;if(typeof module!=='undefined')module.exports=CALC;
})(typeof window!=='undefined'?window:globalThis);

(function(a){'use strict';
var e=a.h;
var r=(e.band,864e5);
function i(a,e,o){if(null==a||null==e||null==o)return null;a=Math.round(a),e=Math.round(e),o=Math.round(o);var r=new Date(Date.UTC(o,e-1,a));return r.getUTCFullYear()===o&&r.getUTCMonth()===e-1&&r.getUTCDate()===a&&r}
function n(a,e,o){return null==a&&null==e&&null==o?(r=new Date,new Date(Date.UTC(r.getFullYear(),r.getMonth(),r.getDate()))):i(a,e,o)||!1;var r}
function t(a,e){return new Date(a.getTime()+e*r)}
function d(a,e){return Math.round((e.getTime()-a.getTime())/r)}
function s(a,e){var o=a.getUTCFullYear(),r=a.getUTCMonth()+e,i=a.getUTCDate(),n=new Date(Date.UTC(o,r+1,0)).getUTCDate();return new Date(Date.UTC(o,r,Math.min(i,n)))}
function l(a){var e=function(a){return(a<10?"0":"")+a};return e(a.getUTCDate())+"/"+e(a.getUTCMonth()+1)+"/"+a.getUTCFullYear()}
function c(a){return Math.floor(a/7)+"s "+a%7+"d"}
function g(a){return a<259?["pré-termo (antes de 37 semanas)","info"]:a<273?["termo precoce (37s 0d a 38s 6d)","low"]:a<287?["termo completo (39s 0d a 40s 6d)","low"]:a<294?["termo tardio (41s 0d a 41s 6d)","mid"]:["pós-termo (42 semanas ou mais)","high"]}
a.def("idade-gestacional-e-dpp",function(a){var e=i(a.dum_d,a.dum_m,a.dum_a),o=n(a.ref_d,a.ref_m,a.ref_a);if(!e)return{error:"Data da DUM inválida: confira dia, mês e ano."};if(!o)return{error:"Data de referência inválida: preencha dia, mês e ano (ou deixe os três em branco para usar a data de hoje)."};var r=d(e,o);if(r<0)return{error:"A data de referência é anterior à DUM."};if(r>310)return{error:"Mais de 44 semanas entre a DUM e a data de referência: confira as datas."};var m=t(e,280),u=s(t(e,7),9),p=g(r),f=r<98?"1º trimestre":r<196?"2º trimestre":"3º trimestre",v=d(o,m);return{main:[c(r),"de idade gestacional"],label:"Idade gestacional pela DUM",level:r<259?"info":p[1],verdict:f+(r>=196?" · "+p[0]:""),rows:[["Data provável do parto (DUM + 280 dias)",l(m)],["Regra de Naegele clássica (+7 dias, −3 meses)",l(u)],[v>=0?"Faltam para a DPP":"Passou da DPP",Math.abs(v)+" dias"],["Data de referência",l(o)]],note:r>=287?"A partir de 41 semanas, discuta indução do parto e vigilância fetal; aos 42 semanas a gestação é pós-termo.":"",raw:{ig_dias:r,dpp:l(m),naegele:l(u)}}});
})(window.CALC);
function calculate(input){
 if(!input||typeof input!=='object'||Array.isArray(input))return {error:'Informe um objeto com os campos da ferramenta.',code:'INVALID_INPUT'};
 const values=Object.create(null);
 for(const[name,,kind,o={}] of TOOL.fields){
  const v=Object.hasOwn(input,name)?input[name]:undefined;
  if(kind==='chk'){if(v!==undefined&&v!==null&&![true,false,1,0,'1','0'].includes(v))return {error:'Campo booleano inválido: '+name,field:name,code:'INVALID_INPUT'};values[name]=v===true||v===1||v==='1';continue;}
  const empty=v==null||(typeof v==='string'&&!v.trim());
  if(empty){if(!o.opt)return {error:'Campo obrigatório: '+name,field:name,code:'REQUIRED_FIELD'};values[name]=kind==='num'?null:'';continue;}
  if(kind==='num'){
   if(!['number','string'].includes(typeof v)||(typeof v==='string'&&!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(v.trim()))||!Number.isFinite(Number(v)))return {error:'Número inválido: '+name,field:name,code:'INVALID_INPUT'};
   const n=Number(v);if((Number.isFinite(o.min)&&n<o.min)||(Number.isFinite(o.max)&&n>o.max))return {error:'Valor fora do intervalo: '+name,field:name,code:'OUT_OF_RANGE'};
   values[name]=n;
  }else{if(!Object.hasOwn(o.opts||{},String(v)))return {error:'Opção inválida: '+name,field:name,code:'INVALID_OPTION'};values[name]=String(v);}
 }
 try{const r=window.CALC.run(TOOL.id,values,TOOL.config);if(r.error)return {error:String(r.error).replace(/<[^>]*>/g,''),code:'FORMULA_DOMAIN'};
  if(!Array.isArray(r.main)||r.main.some(v=>typeof v==='number'&&!Number.isFinite(v))||/\b(?:NaN|Infinity)\b/.test(String(r.main[0])))return {error:'Resultado não finito ou indisponível.',code:'INVALID_RESULT'};
  return {id:TOOL.id,main:r.main,label:r.label||TOOL.title,raw:r.raw||{},clinicalValidation:'not-performed'};
 }catch{return {error:'Confira os valores e o domínio da fórmula.',code:'FORMULA_DOMAIN'};}
}
const api=Object.freeze({metadata:TOOL,calculate});if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.EluceniaTool=api;
})(typeof globalThis!=='undefined'?globalThis:this);
