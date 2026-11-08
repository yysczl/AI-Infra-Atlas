/* S02 keeps the four narration cues while changing the view into a product cross-section. */
(() => {
  'use strict';
  const ink = '#f2efe7', stone = '#878b88', orange = '#ed8254', green = '#bed6ae';
  const beats = [
    {name:'算法', english:'模型训练', title:'怎样改进回答质量？', detail:'训练数据、模型结构和训练方法\n都会影响回答质量。', focus:'模型怎样学习', color:ink},
    {name:'应用', english:'知识库问答', title:'应用怎样处理提问？', detail:'应用先检索相关文档，再把内容\n交给模型，最后展示答案。', focus:'检索文档与展示答案', color:green},
    {name:'Infra', english:'训练与推理', title:'基础设施管什么？', detail:'训练需要分配 GPU。模型上线后，\n服务还要调度请求、管理显存。', focus:'GPU、显存与调度', color:orange},
    {name:'协作', english:'长文档问答', title:'支持长文档要改什么？', detail:'要测试模型的回答质量、测量显存\n和延迟，并设计上传和展示方式。', focus:'以长文档问答为例', color:orange}
  ];
  const text=(x,y,value,size=28,fill=ink)=>`<text x="${x}" y="${y}" fill="${fill}" font-size="${size}">${value}</text>`;
  const line=(d,color='#485044',width=2)=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
  const rect=(x,y,w,h,fill='#1a1e1a',stroke='#485044',r=10)=>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" rx="${r}"/>`;
  const at=(delay,body)=>`<g data-case-at="${delay}">${body}</g>`;
  function caseStudy(s){
    const question='报销最晚哪天提交？';
    const source=text(64,308,'《差旅报销办法》第 4 条',27,green)+text(64,365,'返程后 10 个工作日内提交。',35);
    let z=rect(20,70,940,570)+line('M20 132H960')+text(57,111,'内部知识库',25)+text(791,111,'教学模拟',22,stone);
    z+=rect(54,160,860,70,'#242e23')+text(76,207,question,31);
    if(s===0){
      z+=text(64,296,'用同一道题检查回答是否准确',26,stone);
      z+=at(480,text(64,382,'模型回答：「10 天内。」',36,orange));
      z+=at(980,text(64,463,'核对原文：「10 个工作日内。」',36,green));
      z+=at(1380,text(64,557,'检查模型有没有读准「工作日」这个条件。',28));
    }
    if(s===1){
      z+=at(320,text(64,279,'检索命中',22,stone)+source+line('M64 402H910'));
      z+=at(1230,text(64,466,'依据第 4 条，返程后 10 个工作日内提交。',33)+text(64,524,'引用来源：差旅报销办法',23,green));
    }
    if(s===2){
      z+=source+line('M64 410H910');
      z+=text(64,471,'等待执行',24,stone)+text(541,471,'GPU 正在执行',24,green);
      z+=line('M305 533H518',orange);
      for(let i=0;i<4;i++){
        z+=at(1540+i*160,rect(658+i*61,570,47,40,'#2c4128')+text(668+i*61,598,'KV',21,green));
      }
      z+=`<g data-case-dispatch>${rect(558,492,120,66,'#5b3926','none')}${text(574,540,'报销问答',23)}</g>`;
    }
    if(s===3){
      z+=text(64,298,'上传完整手册',27,green);
      for(let i=0;i<8;i++)z+=at(240+i*80,rect(392+i*48,259,34,49,'#2b3528')+line(`M${400+i*48} 275h17m-17 8h17`,green,1));
      [
        ['应用','显示上传进度和答案引用',green],
        ['算法','检查长文档里能否找准第 4 条',ink],
        ['基础设施','增加输入长度，测量显存和等待时间',orange],
      ].forEach(([name,detail,color],i)=>{
        const y=386+i*84;
        z+=at(920+i*300,line(`M64 ${y+25}H910`)+text(64,y,name,29,color)+text(255,y,detail,28));
      });
    }
    return z;
  }

  function render(step) {
    const s=Math.max(0,Math.min(3,step)),b=beats[s];
    return `<section class="concept-scene" data-concept-step="${s}" aria-label="AI Infra 是什么：${b.focus}">
      <div class="concept-mast"><span>AI INFRA <i>/</i> 入门课</span><span>01 — AI Infra 解决什么问题</span></div>
      <span class="concept-folio" data-course-folio></span>
      <div class="concept-copy">
        <div class="concept-section-index">案例 <span>—</span> 知识库问答</div>
        <h1><span>AI Infra</span><strong>是什么？</strong></h1>
        <div class="concept-beat-name" style="color:${b.color}"><span>0${s+1}</span> ${b.name}<em>${b.english}</em></div>
        <h2>${b.title}</h2>
        <p>${b.detail.replace('\n','<br>')}</p>
      </div>
      <svg class="concept-art" viewBox="0 0 1000 790" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        ${caseStudy(s)}
      </svg>
      <div class="concept-annotation"><span class="concept-annotation-rule"></span><span>${b.focus}</span></div>
      <div class="concept-bottom"><span>AI 产品的三类工作</span><div>${['算法','应用','Infra'].map((v,i)=>`<span class="${s===i||s===3?'is-on':''}"><b>0${i+1}</b>${v}</span>`).join('')}</div><small>概念示意</small></div>
    </section>`;
  }

  function mount(root,step,{animate=false}={}) {
    const animations=[];
    if(!animate && step!==0) return animations;
    root.querySelectorAll('[data-case-at]').forEach(el=>{
      animations.push(el.animate([{opacity:0},{opacity:1}],{
        duration:220,delay:+el.dataset.caseAt,fill:'backwards',
      }));
    });
    const request=root.querySelector('[data-case-dispatch]');
    if(request) animations.push(request.animate([
      {transform:'translateX(-488px)'},{transform:'translateX(-488px)',offset:.35},{transform:'translateX(0)'},
    ],{duration:1400,fill:'backwards',easing:'ease-in-out'}));
    return animations;
  }
  window.PilotScenes ||= {};
  window.PilotScenes.concept={render,mount};
})();
