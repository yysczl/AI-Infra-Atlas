/* Foundational chapters: each diagram owns its geometry and its animation timeline. */
(() => {
  'use strict';
  const C={ink:'#f2efe7',muted:'#9ca193',dim:'#4e574a',green:'#bed6ae',orange:'#ed8254',purple:'#c7b8d9',sand:'#ded0ae',bg:'#101113'};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const txt=(x,y,s,size=28,color=C.ink,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${esc(s)}</text>`;
  const path=(d,color=C.dim,w=2,extra='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" ${extra}/>`;
  const arrow=(x1,y1,x2,y2,color=C.dim)=>path(`M${x1} ${y1} L${x2} ${y2}`,color)+`<path d="M${x2-10} ${y2-7} L${x2} ${y2} L${x2-10} ${y2+7}" fill="none" stroke="${color}" stroke-width="2" transform="rotate(${Math.atan2(y2-y1,x2-x1)*180/Math.PI} ${x2} ${y2})"/>`;
  const dot=(x,y,r=6,color=C.green,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" ${extra}/>`;
  function motion(points,color=C.orange,delay=0,duration=3600,shape='dot',attrs=''){
    return `<g data-travel="${points.map(p=>p.join(',')).join(';')}" data-duration="${duration}" data-delay="${delay}" ${attrs}>${shape==='dot'?dot(0,0,7,color):`<rect x="-17" y="-12" width="34" height="24" fill="${color}"/><path d="M-9 -6V6M0 -6V6M9 -6V6" stroke="#101113" opacity=".45"/>`}</g>`;
  }
  function matrix(x,y,cols,rows,cell=31,color=C.green,attrs=''){
    let z=`<g ${attrs}>`;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)z+=`<rect x="${x+c*cell}" y="${y+r*cell}" width="${cell-5}" height="${cell-5}" fill="${color}" opacity="${.38+((c+r)%4)*.16}"/>`;return z+'</g>';
  }
  function chip(x,y,w=220,h=200,color=C.green,attrs=''){
    let z=`<g ${attrs}><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#1b211b" stroke="${color}" stroke-width="2"/>`;
    for(let i=12;i<w;i+=20)z+=path(`M${x+i} ${y-14}V${y} M${x+i} ${y+h}v14`,color,2);
    for(let i=12;i<h;i+=20)z+=path(`M${x-14} ${y+i}H${x} M${x+w} ${y+i}h14`,color,2);
    return z+'</g>';
  }
  function shell(id,s,title,svg,kind='wide',note=''){
    const slide=window.COURSE.slides.find(p=>p.id===id);
    return `<section class="foundation-scene foundation-${id.toLowerCase()} foundation-${kind}" data-step="${s}" data-foundation-slide="${id}" aria-label="${esc(slide.title+'：'+slide.steps.find(beat=>beat.id===`${id}.${s}`).label)}"><div class="foundation-mast"><span>AI INFRA <i>/</i> 入门课</span><span>${String(slide.chapter).padStart(2,'0')} — ${esc(window.COURSE.chapters[slide.chapter-1])}</span><span data-course-folio></span></div><div class="foundation-heading"><span class="foundation-kicker">${esc(slide.steps.find(beat=>beat.id===`${id}.${s}`).label)}</span><h1>${title}</h1></div><svg class="foundation-art" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${svg}</svg>${note?`<p class="foundation-note">${note}</p>`:''}</section>`;
  }
  function openingQueue(count, slots, focus) {
    const mid='text-anchor="middle"';
    const mono='class="foundation-mono"';
    const request=(i,x,y,active,attrs='')=>`<g transform="translate(${x} ${y})"><g ${attrs}>
      <rect x="-33" y="-24" width="66" height="48" rx="7" fill="${active?'#364a32':'#583a27'}" stroke="${i===focus?C.orange:'none'}" stroke-width="2"/>
      ${txt(0,8,`#${String(i+1).padStart(2,'0')}`,21,C.ink,`${mid} ${mono}`)}</g></g>`;
    const queueX=i=>580+(i-slots)*75;
    const gpuX=i=>1328+i*111;
    const y=535;
    let z=`<g data-opening-interval="0,16200" opacity="0">`;
    z+=txt(100,383,'服务入口',29,C.muted)+txt(540,383,'等待队列',32,C.orange)+txt(1265,383,'GPU 1 · 执行中',32,C.green)
      +txt(1103,383,`${count-slots} 条`,25,C.orange,'text-anchor="end" data-opening-interval="4100,8600" opacity="0"')
      +txt(1103,383,`${count-slots-1} 条`,25,C.orange,'text-anchor="end" data-opening-show="9700"')
      +txt(1716,383,`${slots} 条`,25,C.green,'text-anchor="end" data-opening-interval="2150,7100" opacity="0"')
      +txt(1716,383,`${slots-1} 条`,25,C.green,'text-anchor="end" data-opening-interval="7100,9700" opacity="0"')
      +txt(1716,383,`${slots} 条`,25,C.green,'text-anchor="end" data-opening-show="9700"');
    z+=path('M100 456H1160V535H1230',C.dim,2)+path('M207 535H540',C.dim,2);
    z+=dot(166,y,50,'#282c24')+txt(166,y+10,'接入',25,C.green,mid);
    z+=`<rect x="533" y="489" width="606" height="92" rx="10" fill="#1a1c19" stroke="${C.dim}"/>`;
    z+=chip(1265,483,462,104,C.green);
    for(let i=0;i<count;i++){
      const active=i<slots,x=active?gpuX(i):queueX(i);
      const end=i===0?7100:i===focus?8600:16200;
      const start=220+i*140, duration=active?1300:1800;
      const route=active?[[216,y],[216,456],[1158,456],[1158,y],[x,y]]:[[216,y],[x,y]];
      z+=motion(route,active?C.green:C.orange,start,duration,'dot','data-foundation-once');
      z+=request(i,x,y,active,`data-opening-route="${i}" data-active="${active}" data-opening-show="${start+duration}" data-end="${end}"`);
    }
    const dinner=window.COURSE.slides.find(slide=>slide.id==='S29').demo;
    z+=`<g data-opening-interval="4100,8600" opacity="0">${txt(540,641,`#${dinner.id} 「${dinner.question}」等待缓存`,30,C.orange)}</g>`;
    z+=txt(1265,438,'本次可用缓存',23,C.muted);
    for(let i=0;i<slots;i++){
      const x=1470+i*65;
      z+=`<rect x="${x}" y="417" width="56" height="23" fill="#30372e"/>`;
      const filled=`<rect x="${x}" y="417" width="56" height="23" fill="${C.purple}"/>`;
      const start=1520+i*140;
      z+=i===0?`<g data-opening-interval="${start},7100" opacity="0">${filled}</g><g data-opening-show="9580">${filled}</g>`
        :`<g data-opening-show="${start}">${filled}</g>`;
    }
    z+=request(0,1660,737,true,`data-opening-shift="${gpuX(0)-1660},-202" data-start="7100" data-duration="950" data-end="16200"`);
    z+=txt(1660,801,'已完成',27,C.green,`${mid} data-opening-show="8050"`);
    z+=request(focus,gpuX(0),y,true,`data-opening-shift="${queueX(focus)-gpuX(0)},0" data-start="8600" data-duration="1100" data-end="16200"`);
    z+=txt(540,641,`#${dinner.id} 获得缓存，开始执行`,30,C.green,'data-opening-show="9700"');
    z+=path('M545 769H1270',C.dim,2);
    z+=`<g data-opening-show="6000">${path('M545 769H920',C.orange,5)}${txt(732,741,'排队',25,C.orange,mid)}${txt(545,818,'发送',23,C.muted,mid)}</g>`;
    z+=`<g data-opening-show="9800">${path('M920 769H1270',C.green,5)}${txt(1095,741,'开始计算后仍要等首字',25,C.green,mid)}${txt(920,818,'开始执行',23,C.muted,mid)}</g>`;
    z+=`<g data-opening-show="11800">${dot(1270,769,9,C.green)}${txt(1270,818,'首字出现',23,C.green,mid)}${txt(545,906,'从发出请求到首字出现，排队时间也算在内。',30,C.ink)}</g></g>`;

    z+=`<g data-opening-show="16200">${txt(100,364,`同一批 ${count} 条请求 · 此例每卡缓存够 ${slots} 条同时生成`,30,C.muted)}`;
    for(const devices of [1,2]){
      const x=devices===1?100:1010;
      const delay=devices===1?16500:19900;
      const running=devices*slots;
      z+=`<g data-opening-show="${delay}">${txt(x,455,`${devices} 张 GPU`,44,C.ink)}`;
      for(let gpu=0;gpu<devices;gpu++){
        const gx=x+gpu*386;
        z+=chip(gx+16,500,340,105,C.green);
        for(let i=0;i<slots;i++){
          const index=gpu*slots+i;
          z+=request(index,gx+62+i*81,552,true,`data-opening-show="${delay+650+i*135}"`);
        }
        z+=txt(gx+186,660,`GPU ${gpu+1} · 完整模型`,25,C.green,`${mid} ${mono}`);
      }
      z+=txt(x,735,`还要等待 · ${count-running} 条`,29,C.orange);
      for(let i=running;i<count;i++){
        z+=request(i,x+34+(i-running)*83,787,false,`data-opening-show="${delay+1230+(i-running)*90}"`);
      }
      z+=txt(x,892,devices===1?`#${dinner.id} 等待缓存释放`:`#${dinner.id} 第一批就能开始`,29,devices===1?C.orange:C.green,`data-opening-show="${delay+2400}"`);
      z+='</g>';
    }
    z+=path('M949 405V914',C.dim)+txt(1010,950,'新增设备占用，也会增加运行开销。',27,C.muted,'data-opening-show="23700"');
    return z+'</g>';
  }

  function opening(s){
    const {question,answer,followUp,otherQuestions,cacheCapacity}=window.COURSE.slides.find(slide=>slide.id==='S01').demo;
    const count=1+otherQuestions.length;
    const mono='class="foundation-mono"';
    const center='text-anchor="middle"';
    const panel=(x,y,w,h,r=0,fill='#191d19',stroke=C.dim,attrs='')=>
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" ${attrs}/>`;
    const send=(x,y,size,fill,attrs='')=>
      `<g ${attrs}>${panel(x,y,size,size,9,fill,'none')}${path(`M${x+size*.5} ${y+size*.73}v-${size*.46}m-${size*.18} ${size*.18} ${size*.18} -${size*.18} ${size*.18} ${size*.18}`,C.bg,size*.052)}</g>`;
    function chat(sent,zoom=false){
      let art=panel(0,0,1080,568,18,'#191c19','#50594a')+path('M0 72H1080')+
        dot(30,36,6,C.orange)+txt(54,46,'聊天机器人',26)+txt(1038,46,'模拟对话',22,C.muted,'text-anchor="end"');
      art+=panel(46,465,988,70,14,'#232923','#65735d')+
        txt(72,510,sent?'输入消息…':question,29,sent?C.muted:C.ink,sent?'':'data-opening-type="draft"')+
        send(970,476,48,sent?'#667360':C.green);
      if(!sent) return art;
      art+=`<g ${zoom?'':'data-opening-show="360"'}>${panel(685,101,347,66,16,'#2f3a2c','none')}${txt(858,143,question,29,C.ink,center)}</g>`;
      art+=`<g ${zoom?'':'data-opening-show="2250"'}>${dot(67,228,18,C.green)}${txt(105,238,'聊天机器人',27,C.green)}`;
      answer.forEach((line,i)=>{
        art+=txt(105,292+i*47,line,32,C.ink,zoom?'':`data-opening-type="${i}"`);
      });
      art+='</g>';
      if(!zoom) art+=`<g data-opening-send opacity="0">${panel(46,465,988,70,14,'#232923','#65735d')}${txt(72,510,question,29)}${send(970,476,48,C.orange)}${path('M1003 525l-9-26 23 13-12 2-2 11Z',C.ink,2)}</g>`;
      return art;
    }

    let z='';
    if(s<2){
      z+=txt(90,429,s===0?'打开聊天窗口': '点击发送',44,C.ink);
      z+=txt(90,498,s===0?'在输入框里打下问题。':'等待回答的开头，',31,C.muted);
      if(s===1){
        z+=txt(90,545,'随后文字继续出现。',31,C.muted);
        z+=`<g data-opening-show="560">${chip(178,661,174,106,C.green)}${txt(265,725,'服务端',26,C.green,center)}
          ${path('M354 688H651 M651 742H354',C.dim,2)}</g>`;
        z+=motion([[651,688],[354,688]],C.orange,760,1450,'block','data-foundation-once');
        z+=motion([[354,742],[651,742]],C.green,2950,1100,'block','data-foundation-once');
        z+=`<g data-opening-interval="2120,4030" opacity="0">${txt(93,837,'服务端计算，客户端等待。',29,C.muted)}</g>`;
        z+=txt(93,837,'文字陆续返回聊天窗口。',29,C.green,'data-opening-show="4030"');
      }
      z+=`<g transform="translate(654 328)">${chat(s===1)}</g>`;
    } else if(s===2){
      z+=txt(95,380,'用户 01',27,C.green,mono);
      z+=`<g transform="translate(90 404)"><g data-opening-zoom style="transform:scale(.46)">${chat(true,true)}</g></g>`;
      z+=txt(94,710,followUp,24,C.green,'data-opening-show="640"')+
        txt(580,710,'已发送 ↑',22,C.green,'text-anchor="end" data-opening-show="640"');
      z+=path('M91 740H587')+txt(92,775,'汇入服务入口的请求',26,C.muted);
      z+=txt(92,891,count,106,C.ink,`${mono} data-opening-count="${count}"`)+txt(263,888,'条',31,C.green);
      z+=`<g data-opening-show="1600">${path('M661 940H1769',C.dim,2)}${txt(1770,979,'服务入口',27,C.orange,'text-anchor="end"')}</g>`;
      otherQuestions.forEach((prompt,i)=>{
        const x=655+i%4*290, y=330+Math.floor(i/4)*189;
        z+=`<g transform="translate(${x} ${y})"><g data-opening-user="${i}">${panel(0,0,261,150,11)}`;
        z+=dot(18,26,4,C.orange)+txt(32,33,`用户 ${String(i+2).padStart(2,'0')}`,19,C.muted)+path('M0 51H261');
        z+=panel(14,68,230,45,8,'#303a2d','none')+txt(25,98,prompt,22);
        z+=txt(226,137,'已发送 ↑',18,C.green,`text-anchor="end" data-opening-sent="${i}"`)+'</g></g>';
        z+=motion([[x+270,y+131],[x+270,940],[1755,940]],C.orange,1720+i*112,1100,'dot','data-foundation-once');
      });
      z+=motion([[580,711],[610,940],[1755,940]],C.orange,1608,1100,'dot','data-foundation-once');
    } else {
      const focus=Number(window.COURSE.slides.find(slide=>slide.id==='S29').demo.id)-1;
      z+=openingQueue(count,cacheCapacity,focus);
    }
    const titles=['先问聊天机器人一个问题','聊天机器人开始回答','更多用户同时发问','排队、接班和增配 GPU'];
    return shell('S01',s,titles[s],z,'opening',s===3?'紫色条示意缓存预算。实际占用随模型、序列长度和调度策略而变。':'聊天界面与回答为教学模拟。');
  }

  function mountOpening(root,s,{animate,previousStep}){
    if(!animate && s!==0) return [];
    const animations=mount(root,s,{animate:false});
    const add=(el,frames,options)=>animations.push(el.animate(frames,{fill:'backwards',...options}));
    const each=(selector,run)=>root.querySelectorAll(selector).forEach(run);
    const show=(el,delay)=>add(el,[{opacity:0},{opacity:1}],{duration:180,delay});

    each('[data-opening-type]',el=>{
      const draft=el.dataset.openingType==='draft';
      add(el,[{clipPath:'inset(0 100% 0 0) fill-box'},{clipPath:'inset(0 0 0 0) fill-box'}],
        {duration:draft?1450:880,delay:draft?260:4020+Number(el.dataset.openingType)*920,easing:`steps(${el.textContent.length}, end)`});
    });
    each('[data-opening-send]',el=>add(el,[{opacity:1},{opacity:1,offset:.55},{opacity:0}],
      {duration:360,fill:'both'}));
    each('[data-opening-show]',el=>show(el,+el.dataset.openingShow));

    if(s===2){
      const zoom=root.querySelector('[data-opening-zoom]');
      if(previousStep===1) add(zoom,[{transform:'translate(564px,-76px) scale(1)'},{transform:'scale(.46)'}],
        {duration:1050,easing:'cubic-bezier(.3,0,.18,1)'});
      each('[data-opening-user]',(el,i)=>add(el,[{opacity:0,transform:'translateX(34px) scale(.88)'},{opacity:1,transform:'none'}],
        {delay:270+i*112,duration:360,easing:'ease-out'}));
      each('[data-opening-sent]',(el,i)=>show(el,752+i*112));
      const counter=root.querySelector('[data-opening-count]');
      const total=+counter.dataset.openingCount;
      const parent=counter.parentNode;
      // Each interim number is a frame in the same pausable animation as the send labels.
      for(let value=0;value<total;value++){
        const interim=counter.cloneNode();
        interim.removeAttribute('data-opening-count');
        interim.textContent=value;
        parent.append(interim);
        const start=value===0?0:2708+(value-1)*112;
        const end=2708+value*112;
        interim.style.opacity=0;
        add(interim,[{opacity:1},{opacity:1}],{delay:start,duration:end-start,fill:'none'});
      }
      add(counter,[{opacity:0},{opacity:1}],{delay:2708+(total-1)*112,duration:1});
    }
    each('[data-opening-interval]',el=>{
      const [start,end]=el.dataset.openingInterval.split(',').map(Number);
      add(el,[{opacity:1},{opacity:1}],{delay:start,duration:end-start,fill:'none'});
    });
    each('[data-opening-route]',el=>{
      add(el,[{opacity:0},{opacity:0}],{delay:Number(el.dataset.end),duration:1,fill:'forwards'});
    });
    each('[data-opening-shift]',el=>{
      const [x,y]=el.dataset.openingShift.split(',').map(Number);
      const start=Number(el.dataset.start), duration=Number(el.dataset.duration);
      add(el,[{transform:`translate(${x}px,${y}px)`,opacity:0},{opacity:1,offset:.12},
        {transform:'translate(0,0)',opacity:1}],{delay:start,duration,easing:'ease-in-out'});
    });
    return animations;
  }
  function parallel(s){
    const mid='text-anchor="middle"';
    const number=(x,y,value,color=C.ink,attrs='')=>txt(x,y,value,36,color,`class="foundation-mono" ${mid} ${attrs}`);
    let z='';
    if(s<2){
      const inputs=[2,9,6,3,5,7];
      const x0=530,dx=208;
      const resultDelay=i=>s?1950:1950+Math.floor(i/2)*1850;
      z+=txt(100,412,'输入',29,C.muted)+txt(100,630,s?'GPU 线程':'CPU 通道',29,C.muted)+txt(100,840,'输出',29,C.muted);
      inputs.forEach((value,i)=>{
        const x=x0+i*dx;
        const color=s?C.green:C.sand;
        z+=number(x,412,value,C.ink)+path(`M${x} 437v117 M${x} 655v119`,C.dim);
        z+=`<g data-thread="${s?'gpu-'+i:'cpu-'+i%2}">${dot(x,613,47,'#202820')}
          ${txt(x,624,'× 2',30,color,mid)}</g>`;
        z+=`<g data-parallel-number data-delay="${resultDelay(i)-1680}" opacity="0">${number(x,463,value,color)}</g>`;
        z+=`<g data-parallel-number="157" data-delay="${resultDelay(i)-790}" opacity="0">${number(x,674,value*2,color)}</g>`;

        z+=`<g data-foundation-reveal="${resultDelay(i)}">${number(x,842,value*2,color)}</g>`;
      });
      if(!s){
        for(let i=0;i<3;i++){
          const x=x0+i*dx*2;
          z+=path(`M${x-45} 525v-15h${dx+90}v15`,C.sand,1.4);
          z+=txt(x+dx/2,491,`第 ${i+1} 批`,24,C.sand,mid);
        }
      }else{
        z+=path('M485 521v-14h1130v14',C.green,1.4);
      }
      return shell('S04',s,s?'GPU 同时处理多个位置':'把六个数分别乘以二',z,'wide','通道数和节拍为教学示意。CPU 也支持多核和向量并行。');
    }
    if(s===2){
      const arrays=[
        {x:265,values:[1,2,3,4],name:'输入 A',color:C.green},
        {x:797,values:[2,0,1,2],name:'权重 B',color:C.purple},
        {x:1330,values:[4,4,10,8],name:'结果 C',color:C.orange},
      ];
      arrays.forEach(({x,values,name,color},a)=>{
        z+=txt(x,391,name,30,color);
        values.forEach((value,i)=>{
          const cx=x+i%2*115,cy=428+Math.floor(i/2)*102;
          const focus=a===0?i<2:a===1?i%2===0:i===0;
          z+=`<rect x="${cx}" y="${cy}" width="104" height="89" fill="${focus?'#2e342a':'#191d19'}" stroke="${focus?color:C.dim}"/>`;
          z+=`<g ${a===2?'data-foundation-reveal="780"':''}>${number(cx+52,cy+58,value,focus?color:C.ink)}</g>`;
        });
      });
      z+=number(640,541,'×',C.muted)+number(1170,541,'=',C.muted);
      z+=txt(265,731,'左上角取 A 的第一行和 B 的第一列',32,C.ink)+txt(266,795,'1 × 2 + 2 × 1 = 4',40,C.orange,'class="foundation-mono"');
      z+=txt(266,889,'Tensor Core 可加速支持的矩阵形状和数值格式。',30,C.green);
      return shell('S04',s,'矩阵乘法的多个结果可并行计算',z,'matrix','用 2 × 2 矩阵说明计算关系。图中的尺寸不代表硬件指令支持的形状。');
    }
    z+=txt(120,373,'客户端',30,C.ink)+txt(120,440,'“什么是人工智能？”',34,C.orange);
    z+=arrow(470,430,667,430,C.orange)+chip(700,383,300,240,C.sand)+chip(1422,383,300,240,C.green);
    z+=txt(850,465,'CPU',45,C.sand,mid)+txt(850,533,'接收请求、准备数据',27,C.ink,mid);
    z+=txt(1572,465,'GPU',45,C.green,mid)+txt(1572,533,'计算下一步输出',27,C.ink,mid);
    z+=arrow(1020,454,1390,454,C.orange)+arrow(1390,562,1020,562,C.green);
    z+=txt(1205,418,'输入数值',27,C.orange,mid)+txt(1205,618,'计算结果',27,C.green,mid);
    z+=motion([[482,430],[690,430]],C.orange,0,2400,'block','data-task="receive"')+
      motion([[1020,454],[1400,454]],C.orange,350,2700,'block','data-task="dispatch"')+
      motion([[1390,562],[1020,562]],C.green,1650,2700,'block','data-task="return"');
    z+=path('M120 760H1716',C.dim)+txt(120,829,'准备、传输和计算都耗时。',35,C.muted);
    return shell('S04',s,'一次推理中的 CPU 和 GPU',z,'wide','常见分工示意。实际执行依模型、服务和硬件而异。');
  }
  function operator(s){
    const mid='text-anchor="middle"';
    const mono='class="foundation-mono"';
    const value=(x,y,text,color=C.ink)=>txt(x,y,text,36,color,`${mid} ${mono}`);
    const stages=[['矩阵乘法','2 × 1 + 1 × (−3)','−1',C.green],
      ['加偏置','−1 + (−2)','−3',C.orange],['ReLU 激活','max(0, −3)','0',C.purple]];
    let z=txt(100,355,'y = ReLU(xW + b)',53,C.ink,mono);
    z+=txt(102,417,'输入 x = [2, 1]    权重 W = [1, −3]ᵀ    偏置 b = −2',28,C.muted,mono);
    if(s<2){
      stages.forEach(([label,math,result,color],i)=>{
        const x=325+i*610;
        z+=txt(x,535,label,30,color,mid)+value(x,616,math)+path(`M${x-180} 657h360`,color,2);
        z+=`<g data-foundation-reveal="${420+i*430}">${value(x,722,result,color)}</g>`;
        if(i<2)z+=arrow(x+220,655,x+375,655,color);
      });
      if(s===1)z+=txt(103,883,'内核从显存读取输入和权重，计算后把结果写回。',32,C.ink)+
        motion([[100,778],[325,778],[935,778],[1545,778],[1780,778]],C.green,0,3500,'block','data-kernel-flow="true"');
    }else{
      z+=txt(105,545,'分开执行',30,C.muted)+txt(105,764,'融合执行',30,C.orange);
      stages.forEach(([label, ,result,color],i)=>{
        const x=480+i*515;
        z+=txt(x,513,label,27,color,mid)+value(x,585,result,color);
        z+=txt(x,738,label,27,color,mid);
        if(i<2){
          z+=path(`M${x+85} 558v59h345v-59`,C.dim,2)+txt(x+258,650,`${result} 写回显存，再读出`,24,C.muted,mid);
        }
      });
      z+=path('M370 777H1700',C.orange,5)+value(1740,788,'0',C.green);
      z+=motion([[390,777],[990,777],[1690,777]],C.orange,0,2700,'block','data-kernel="fused"');
      z+=txt(105,905,s===2?'中间值留在内核里，最后只写回 0。':'两条执行路径都得到 0，具体实现还要看形状与硬件。',33,C.ink);
    }
    return shell('S06',s,['三个算子算出一个结果','内核负责把计算跑起来','融合后少写两次中间结果','同样的数学运算，多种实现'][s],
      z,'operator','用一行数据说明算子与内核。实际读写和融合范围取决于实现。');
  }
  function vectorAddition(s){
    const a=[2,9,6,3,5,7], b=[1,2,4,8,3,6];
    const triton=s===2, framework=s===3, color=triton?C.purple:framework?C.green:C.orange;
    const center='text-anchor="middle"', mono='class="foundation-mono"';
    let z='';
    if(s===0){
      z+=txt(116,504,'A[i] + B[i]',86,C.ink,mono);
      z+=txt(120,588,'同一列的两个数相加，结果写回这一列。',34,C.muted);
      z+=txt(120,720,'第三列（下标 2）',28,C.orange)+txt(116,800,'6 + 4 = 10',56,C.orange,mono);
    }else{
      const lines=framework?[
        ['import torch'],
        ['A = torch.tensor([2, 9, 6, 3, 5, 7])'],
        ['B = torch.tensor([1, 2, 4, 8, 3, 6])'],
        ['C = A + B',C.green],
        ['print(C.tolist())'],
      ]:triton?[
        ['@triton.jit'], ['def add(A, B, C, n, K: tl.constexpr):'],
        ['    start = K * tl.program_id(0)',C.purple],
        ['    idx = start + tl.arange(0, K)',C.purple],
        ['    valid = idx < n',C.orange],
        ['    lhs = tl.load(A + idx, mask=valid)'],
        ['    rhs = tl.load(B + idx, mask=valid)'],
        ['    tl.store(C + idx, lhs + rhs, mask=valid)',C.green],
      ]:[
        ['__global__ void add(const float* A,'],
        ['                    const float* B,'],
        ['                    float* C, int n) {'],
        ['    int i = blockDim.x * blockIdx.x',C.orange],
        ['            + threadIdx.x;',C.orange],
        ['    if (i < n) {'],
        ['        C[i] = A[i] + B[i];',C.green],
        ['    }'], ['}'],
      ];
      z+=`<rect x="88" y="351" width="875" height="506" fill="#181c18" stroke="${C.dim}"/>`;
      z+=txt(116,399,framework?'add_torch.py':triton?'add.py':'add.cu',25,color,mono)+path('M88 421H963');
      lines.forEach(([line,ink],i)=>{
        const y=466+i*41;
        if(ink) z+=`<rect x="89" y="${y-30}" width="873" height="40" fill="${ink}" opacity=".08"/>`;
        z+=txt(117,y,line,29,ink||C.ink,`${mono} xml:space="preserve"`);
      });
      z+=txt(116,822,framework?'# [3, 11, 10, 11, 8, 13]':triton?'add[(2,)](A, B, C, 6, K=4)':'add<<<1, 32>>>(A, B, C, 6);',28,C.muted,mono);
    }
    const start=1116, gap=87;
    const highlight=i=>triton?i>=4:i===2;
    z+=txt(1015,398,triton?'两组位置，每组 4 个':s===1?'一个线程负责一个位置':framework?'框架调用现成加法算子':'每排 6 个数',31,C.ink);
    if(triton){
      z+=txt(start+170,463,'程序 0',25,C.muted,center)+txt(start+518,463,'程序 1',25,color,center);
      z+=path(`M${start+5} 490v-10h330v10`,C.dim)+path(`M${start+353} 490v-10h330v10`,color);
    }
    z+=txt(1015,538,'下标',25,C.muted)+txt(1015,603,'A',32,C.ink,mono)+txt(1015,685,'B',32,C.ink,mono)+txt(1015,801,'C',32,C.green,mono);
    for(let i=0;i<(triton?8:a.length);i++){
      const x=start+i*gap, valid=i<a.length, focused=highlight(i);
      const border=focused?(valid?color:C.dim):C.dim;
      z+=`<g data-vector-column="${i}" data-valid="${valid}">`;
      if(focused && valid) z+=`<rect x="${x-4}" y="548" width="80" height="277" fill="${color}" opacity=".065"/>`;
      z+=txt(x+36,538,i,27,focused && valid?color:C.muted,`${center} ${mono}`);
      for(const [y,value] of [[591,a[i]],[673,b[i]],[789,s===0?'?':a[i]+b[i]]]){
        const output=y===789;
        z+=`<rect x="${x}" y="${y-31}" width="72" height="63" fill="#191e19" stroke="${output && s && valid?C.green:border}" ${valid?'':'stroke-dasharray="5 5"'}/>`;
        if(output && valid && s){
          const delay=triton?(i<4?540:720):s===1&&i!==2?760:490;
          z+=`<g data-vector-result="${i}" data-result-delay="${delay}">`;
        }
        z+=txt(x+36,y+11,valid?value:'—',32,valid?(output && s?C.green:C.ink):C.muted,`${center} ${mono}`);
        if(output && valid && s) z+='</g>';
      }
      if(focused && valid && s) z+=arrow(x+36,712,x+36,747,color);
      z+='</g>';
    }
    z+=txt(1015,888,[
      '每一列可以独立计算。',
      '下标 2 的线程写入 6 + 4 = 10。',
      '下标 6、7 超出范围，遮罩关闭读写。',
      '六项结果与前两种写法一致。',
    ][s],29,s===0?C.muted:color);
    return z;
  }
  function software(s, beat){
    const title=['GPU 怎样把两排数相加？','CUDA C++ 按线程分工','Triton 语言按一组位置分工','PyTorch 直接调用加法算子'][s];
    const notes=['逐项加法示例。','代码省略显存准备；右图为执行示意。','代码省略导入与显存准备；右图为执行示意。',
      '加法与矩阵乘法是不同算子。矩阵乘法在 NVIDIA GPU 上可调用 cuBLAS，cuDNN 提供卷积等实现。'];
    let art = vectorAddition(s);
    if (beat.id === 'S07.2') {
      art += txt(116, 903, '同名工具 NVIDIA Triton Inference Server 用于模型部署和推理服务', 24, C.purple);
    }
    return shell('S07',s,title,art,'software',notes[s]);
  }
  function bottleneck(s){
    let z='';
    if(s<2){
      z+=txt(95,464,s===0?'01':'02',110,s===0?C.orange:C.green,'class="foundation-serif"');
      z+=txt(95,542,s===0?'计算受限':'访存受限',36,C.ink)+txt(95,598,s===0?'数据到位，工作仍在排队。':'计算单元，正在等数据。',29,C.muted);
      for(let i=3;i>=0;i--)z+=`<path d="M650 ${450+i*26}l130,-50 130,50 -130,50Z" fill="${i===0?'#718764':'#303a2c'}" stroke="#101113" stroke-width="2"/>`;
      z+=txt(780,650,'HBM',35,C.green,'text-anchor="middle"')+path('M930 504H1320',C.dim,55)+path('M930 504H1320','#101113',49);
      z+=chip(1400,396,260,250,C.orange,'data-device="compute"')+matrix(1428,426,5,4,43,s===0?C.orange:'#424c3b',s===0?'data-pulse="2200"':'');
      z+=txt(1530,712,'计算',35,C.orange,'text-anchor="middle"');
      for(let i=0;i<7;i++){const x=s===0?1180+(i%2)*75:905+(i%2)*75,y=s===0?600+Math.floor(i/2)*37:620+Math.floor(i/2)*37;z+=`<rect x="${x}" y="${y}" width="54" height="23" fill="${C.orange}" data-transfer="queued"/>`;}
      if(s===1)z+=path('M1110 459V551 M1126 459V551',C.orange,3);
      for(let i=0;i<(s===0?5:1);i++)z+=motion([[930,504],[1320,504]],s===0?C.green:C.orange,i*370,s===0?2200:5200,'block','data-transfer="hbm-read"');
      z+=txt(670,864,s===0?'优化方向：减少计算开销，或提高可用算力。':'优化方向：减少搬运，让已经取来的数据多用几次。',32,s===0?C.orange:C.green);
      return shell('S08',s,s===0?'计算受限':'访存受限',z,'wide','瓶颈随输入与运行条件变化，需要结合实际执行记录判断。');
    }
    z+=txt(100,360,'常见中间读写',31,C.muted);
    z+=txt(410,350,'HBM',30,C.muted)+txt(1450,350,'Attention 计算',30,C.muted);
    z+=path('M480 400H1650',C.dim,2)+path('M1650 435V565H480V435',C.orange,2);
    z+=matrix(750,420,8,4,31,C.orange,'data-intermediate="full-matrix"')+txt(1070,472,'大中间结果写回，再读出',26,C.orange);
    for(let i=0;i<4;i++)z+=motion([[1600,435],[1600,565],[480,565],[480,400],[1550,400]],C.orange,i*600,6000,'block','data-transfer="standard-roundtrip"');
    if(s===2)return shell('S08',s,'Attention 的中间读写',z,'wide','图中以写回 HBM 再读出中间结果为例。');
    z+=txt(100,663,'片上分块',34,C.green);
    z+=path('M480 704H895',C.green,3)+path('M1090 704H1650V840H1090V704',C.green,3);
    z+=txt(950,652,'片上存储',29,C.green,'text-anchor="middle"')+matrix(900,686,4,3,31,C.green,'data-tile="local"')+matrix(1440,680,5,4,31,C.purple,'data-pulse="2600"');
    z+=txt(1120,897,'精确 Attention · 改变读写与执行顺序',29,C.green,'text-anchor="middle"');
    for(let i=0;i<3;i++)z+=motion([[1040,704],[1580,704],[1580,840],[1090,840],[1090,704]],C.green,i*660,3900,'block','data-transfer="onchip-reuse" data-tile="moving"');
    return shell('S08',s,'FlashAttention 的片上分块',z,'wide','图示简化了数据路径。实际收益依输入、硬件和实现，浮点计算存在数值误差。');
  }
  function training(s,beat){
    const mid='text-anchor="middle"';
    let z=txt(105,378,s<2?'训练样本':'训练已完成',26,C.orange)+txt(105,463,'天气很 ___',57,C.ink)+txt(105,531,'样本中下一个词是「晴」',30,C.muted);
    const choices=s===0?[30,70]:[60,40];
    ['晴','冷'].forEach((word,i)=>{
      const y=420+i*104,color=i?C.purple:C.green;
      z+=txt(670,y,word,32,color)+path(`M760 ${y-9}h430`,C.dim,10);
      z+=`<g data-foundation-reveal="${s===1?1220:s===0?360+i*130:0}">${path(`M760 ${y-9}h${choices[i]*4.3}`,color,10)}
        ${txt(1225,y,choices[i]+'%',29,color,'class="foundation-mono"')}</g>`;
    });
    z+=txt(666,349,'同一样本的两种候选输出',27,C.muted);
    if(s===0)z+=txt(1350,470,'预测：冷',37,C.purple)+txt(1350,527,'目标：晴',37,C.green);
    if(s>=1){
      z+=txt(105,720,'预测 → 算损失与梯度 → 优化器更新参数',32,C.orange)+path('M110 750H1260',C.dim);
      if(s===1)z+=motion([[130,750],[520,750],[900,750],[1240,750]],C.orange,0,1850,'block','data-training="gradient" data-foundation-once');
      z+=txt(670,622,'目标「晴」的概率上升',31,C.green,`data-foundation-reveal="${s===1?1410:0}"`);
      z+=txt(105,827,'示例参数 w₁：0.12 → 0.10',30,C.muted,`data-foundation-reveal="${s===1?950:0}"`);
    }
    if(s>=2){
      z+=path('M1320 343V930',C.dim)+txt(1385,401,'推理 · 使用固定参数',30,C.green);
      z+=txt(1385,489,'新的输入：今天很',32,C.ink)+arrow(1575,529,1575,602,C.green);
      z+=txt(1575,661,'暖',52,C.green,`${mid} data-foundation-reveal="620"`);
      z+=txt(1385,741,'同一个 w₁ = 0.10',28,C.muted);
      if(s===3)z+=txt(1385,838,'LLM：大语言模型',27,C.ink);
      if(beat.id==='S09.9')z+=txt(1385,891,'PyTorch · 组织训练计算',27,C.ink);
    }
    return shell('S09',s,s<2?'模型练习预测下一个词':'用训练好的参数处理新输入',z,'training','候选词、概率和参数都是教学模拟。实际语言模型预测 Token。');
  }
  function pytorch(s){
    const mono='class="foundation-mono" xml:space="preserve"';
    const lines=[
      'import torch',
      'x = torch.tensor([2., 1.])',
      'w = torch.tensor([1., -3.], requires_grad=True)',
      'y = x @ w',
      'loss = (y - 1)**2',
      'loss.backward()',
      'with torch.no_grad():',
      '    w -= 0.1 * w.grad',
    ];
    const visible=[3,4,8,4][s], active=[2,3,5,3][s];
    let z=`<rect x="90" y="347" width="910" height="490" fill="#191d19" stroke="${C.dim}"/>`;
    z+=txt(118,397,'tiny_model.py',26,C.green,mono)+path('M90 421H1000');
    lines.slice(0,visible).forEach((line,i)=>{
      const y=469+i*45;
      if(s===2&&i>=4){
        z+=`<rect x="91" y="${y-31}" width="908" height="42" fill="${C.green}" opacity="0" data-code-focus="${i===4?'0,1250':i===5?'1250,2200':'2200,3300'}"/>`;
      } else if(i===active) z+=`<rect x="91" y="${y-31}" width="908" height="42" fill="${C.green}" opacity=".08"/>`;
      z+=txt(118,y,line,27,i===active?C.green:C.ink,mono);
    });
    z+=txt(1080,393,'输入与参数',28,C.muted)+txt(1080,459,'x = [2, 1]',40,C.green,mono)+txt(1080,531,'w = [1, −3]',40,C.purple,mono);
    if(s>=1){
      z+=path('M1082 558H1790',C.dim)+txt(1080,621,'2 × 1 + 1 × (−3) = −1',37,C.ink,`${mono} data-foundation-reveal="430"`);
    }
    if(s===2){
      z+=txt(1080,699,'前向结果 → 损失',29,C.muted,'data-foundation-reveal="660"')+
        txt(1080,768,'autograd 自动求梯度',30,C.orange,'data-foundation-reveal="1430"')+
        txt(1080,837,'用梯度更新参数 w',30,C.green,'data-foundation-reveal="2370"');
    }
    if(s===3){
      z+=txt(1080,719,'服务还要接收请求、安排执行、保留缓存。',28,C.muted);
    }
    return shell('S10',s,['张量里存的是输入和参数','一行代码得到前向输出','梯度让参数更新','前向计算是服务中的一步'][s],z,'pytorch',
      'PyTorch 教学示例。一次梯度更新用来说明 autograd，实际训练通常由优化器执行参数更新。');
  }
  function distributed(s){
    let z='';
    if(s===0){
      z+=chip(1160,390,360,330,C.green,'data-device="gpu0"')+matrix(1191,424,7,5,43,C.purple,'data-shard="full-model"');
      z+=txt(1340,783,'GPU 0',41,C.green,'text-anchor="middle"');
      for(let i=0;i<10;i++)z+=`<rect x="${1600+(i%2)*58}" y="${438+Math.floor(i/2)*43}" width="44" height="28" fill="${C.orange}" data-overflow="training-state"/>`;
      z+=txt(1540,720,'训练状态装不下',27,C.orange)+txt(1070,896,'装得下，训练仍可能太慢',33,C.muted);
      z+=motion([[960,545],[1130,545]],C.orange,0,3200,'block','data-work="input"');
      return shell('S11',s,'单卡的<br>显存与算力',z,'single-gpu','多设备协作也会引入通信与同步开销。');
    }
    const names=['','数据并行','张量并行','流水线并行'];
    z+=txt(95,384,['','DP','TP','PP'][s],112,C.orange,'class="foundation-serif"')+txt(305,383,names[s],40,C.ink);
    const devices=[{x:330,label:'GPU 0'},{x:1220,label:'GPU 1'}];
    devices.forEach((d,i)=>{z+=chip(d.x,500,320,255,i?C.green:C.purple,`data-device="gpu${i}"`)+txt(d.x+160,828,d.label,38,i?C.green:C.purple,'text-anchor="middle"');
      z+=matrix(d.x+35,550,s===2?3:6,4,42,i?C.green:C.purple,`data-shard="${s===1?'full-copy':s===2?'tensor-half-'+i:'model-stage-'+i}"`);
      z+=txt(d.x+160,463,s===1?'完整模型副本':s===2?'同一层的张量分片':i?'模型后半阶段':'模型前半阶段',28,C.muted,'text-anchor="middle"');});
    if(s===1){
      z+=txt(330,928,'数据 A',31,C.purple)+txt(1220,928,'数据 B',31,C.green);
      z+=arrow(675,600,1190,600,C.orange)+arrow(1190,655,675,655,C.orange)+txt(935,568,'同步梯度',31,C.orange,'text-anchor="middle"');
      z+=motion([[675,600],[1190,600]],C.orange,2800,3000,'block','data-work="gradient-0"')+motion([[1190,655],[675,655]],C.orange,2800,3000,'block','data-work="gradient-1"');
      z+=motion([[350,890],[350,785],[440,735]],C.purple,0,2800,'block','data-work="data-A"')+motion([[1240,890],[1240,785],[1330,735]],C.green,0,2800,'block','data-work="data-B"');
      z+=txt(935,713,'同步后更新，副本保持一致',26,C.muted,'text-anchor="middle"');
    }else if(s===2){
      z+=arrow(675,620,1190,620,C.orange)+arrow(1190,692,675,692,C.green)+txt(935,571,'交换部分结果',31,C.orange,'text-anchor="middle"');
      for(let i=0;i<3;i++)z+=motion([[675,620],[1190,620],[1190,692],[675,692]],i%2?C.green:C.orange,i*650,3700,'block',`data-work="partial-result-${i}"`);
      z+=txt(330,928,'分担存储与计算；设备间频繁通信。',31,C.muted);
    }else{
      z+=arrow(675,620,1190,620,C.orange)+txt(935,568,'微批次沿阶段推进',30,C.orange,'text-anchor="middle"');
      for(let i=0;i<4;i++)z+=motion([[150,680],[490,680],[740,620],[1100,620],[1380,680],[1740,680]],[C.orange,C.green,C.purple,C.sand][i],i*760,4800,'block',`data-work="microbatch-${i}"`);
      z+=txt(330,928,'拆分模型阶段，让多个小批次流水前进。',28,C.muted);
      z+=txt(1120,928,'FSDP：分片保存参数、梯度和优化器状态',26,C.purple,'data-foundation-reveal="6700"');
    }
    return shell('S11',s,s===1?'数据并行处理不同批次':s===2?'张量并行拆分层内计算':'流水线并行拆分模型阶段',z,'distributed','两张 GPU 为简化示意；DP、TP、PP 可结合使用，具体通信依实现而定。');
  }
  function mount(root,step,{animate=false}={}){
    const animations=[];
    root.querySelectorAll('[data-travel]').forEach(el=>{
      const positions=el.dataset.travel.split(';').map(p=>p.split(',').map(Number));
      const frames=positions.map((p,i)=>({transform:`translate(${p[0]}px,${p[1]}px)`,opacity:i===0||i===positions.length-1?0:1,offset:i/(positions.length-1)}));
      if(positions.length===2)frames.splice(1,0,{transform:`translate(${positions[0][0]}px,${positions[0][1]}px)`,opacity:1,offset:.04},{transform:`translate(${positions[1][0]}px,${positions[1][1]}px)`,opacity:1,offset:.94});
      animations.push(el.animate(frames,{duration:+el.dataset.duration||3500,delay:+el.dataset.delay||0,iterations:el.hasAttribute('data-foundation-once')?1:Infinity,easing:'linear',fill:'both'}));
    });
    root.querySelectorAll('[data-pulse]').forEach(el=>animations.push(el.animate([{opacity:.5},{opacity:1},{opacity:.5}],{duration:+el.dataset.pulse,iterations:Infinity,easing:'ease-in-out'})));
    if(animate || step===0) root.querySelectorAll('[data-parallel-number]').forEach(el=>{
      animations.push(el.animate([{opacity:0,transform:'translateY(0)'},{opacity:1,offset:.15},
        {opacity:1,offset:.85},{opacity:0,transform:`translateY(${el.dataset.parallelNumber||100}px)`}],
      {duration:760,delay:+el.dataset.delay,easing:'linear'}));
    });
    if(animate) root.querySelectorAll('[data-code-focus]').forEach(el=>{
      const [start,end]=el.dataset.codeFocus.split(',').map(Number);
      animations.push(el.animate([{opacity:.16},{opacity:.16}],{delay:start,duration:end-start}));
    });
    if(animate || root.querySelector('.foundation-s04[data-step="0"]')) root.querySelectorAll('[data-foundation-reveal]').forEach(el=>{
      const delay=+el.dataset.foundationReveal;
      if(delay)animations.push(el.animate([{opacity:0},{opacity:1}],{
        duration:200,delay,fill:'backwards',
      }));
    });
    if(animate){
      root.querySelectorAll('[data-vector-result]').forEach(el=>{
        animations.push(el.animate([
          {opacity:0,transform:'translateY(-15px)'},
          {opacity:1,transform:'translateY(0)'},
        ],{duration:330,delay:+el.dataset.resultDelay,easing:'ease-out',fill:'backwards'}));
      });
    }
    if(animate){const art=root.querySelector('.foundation-art');animations.push(art.animate([{opacity:.55},{opacity:1}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'}));}
    return animations;
  }
  window.CourseScenes ||= {};
  window.CourseScenes.S01={render:opening,mount:mountOpening};
  const renderers={S04:parallel,S06:operator,S07:software,S08:bottleneck,S09:training,S10:pytorch,S11:distributed};
  for(const [id,render]of Object.entries(renderers))window.CourseScenes[id]={render,mount};
})();
