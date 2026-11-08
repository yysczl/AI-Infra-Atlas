/* S12–S22: deterministic teaching states; every moving object belongs to the player. */
(() => {
  'use strict';
  const C={ink:'#f2efe7',muted:'#92988d',orange:'#ed8254',green:'#bed6ae',purple:'#c7b8d9',line:'#41473e',dark:'#101113',red:'#ee9a87',sand:'#ded0ae'};
  const esc=v=>String(v).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  const t=(x,y,value,size=28,color=C.ink,anchor='start',extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}" ${extra}>${esc(value)}</text>`;
  const line=(d,color=C.line,w=2,extra='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" ${extra}/>`;
  const dot=(x,y,r=6,color=C.green,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" ${extra}/>`;
  const r=(x,y,w,h,color=C.green,opacity=1,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${color}" opacity="${opacity}" ${extra}/>`;
  const flow=(points,color=C.orange,duration=3200,delay=0,radius=6,extra='')=>`<circle class="i-flow" r="${radius}" fill="${color}" data-route="${points}" data-duration="${duration}" data-delay="${delay}" opacity="0" ${extra}/>`;
  const svg=body=>`<svg class="inference-art" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
  const titleNames={S12:'推理框架解决什么问题？',S13:'推理请求的执行流程',S14:'分词、嵌入与注意力',S15:'Prefill 与 Decode',S16:'KV Cache 怎样复用历史计算',S17:'KV Cache 占多少显存？',S18:'PagedAttention 怎样管理缓存？',S19:'缓存块的分配与回收',S20:'连续批处理怎样安排请求？',S21:'前缀缓存怎样命中？'};
  function frame(id,s,body,{layout='wide',title=titleNames[id],deck='',foot='',theme='',label}={}) {
    const p=window.COURSE.slides.find(slide=>slide.id===id);
    return `<section class="inference-scene inference-${layout} ${theme}" data-inference-slide="${id}" data-inference-step="${s}">
      <div class="inference-mast"><span>AI INFRA <i>/</i> 入门课</span><span>${String(p.chapter).padStart(2,'0')} — ${esc(window.COURSE.chapters[p.chapter-1])}</span><span data-course-folio></span></div>
      <div class="inference-heading"><span class="inference-kicker">${id==='S12'?'模型服务':id==='S20'?'连续批处理':id==='S18'||id==='S19'?'PagedAttention':id==='S21'?'Prefix Caching':id==='S22'?'推理优化':'推理过程'} <b>— ${esc(label ?? p.steps.find(beat=>beat.id===`${id}.${s}`).label)}</b></span><h1>${title}</h1>${deck?`<p>${deck}</p>`:''}</div>
      ${svg(body)}${foot?`<div class="inference-foot">${foot}</div>`:''}
    </section>`;
  }
  function processor(x,y,label='模型',color=C.green,scale=1,activeRows=4) {
    let z=`<g transform="translate(${x} ${y}) scale(${scale})">`;
    for(let i=0;i<9;i++)z+=line(`M${i*20+10} -16V-29 M${i*20+10} 196V209 M-16 ${i*20+10}H-29 M196 ${i*20+10}H209`,C.line,3);
    z+=r(-7,-7,194,194,'#1d241d');
    for(let j=0;j<4;j++)for(let i=0;i<4;i++)z+=r(i*45+5,j*45+5,34,34,color,j<activeRows?.46:.12,j<activeRows?'class="i-core"':'');
    return z+t(90,254,label,29,color,'middle')+'</g>';
  }
  function token(x,y,label,color=C.green,extra='',w=90) {
    return `<g ${extra}>${r(x,y,w,64,color,.15)}${line(`M${x} ${y+64}H${x+w}`,color,3)}${t(x+w/2,y+42,label,28,color,'middle')}</g>`;
  }
  const at=(delay,body)=>`<g data-inference-at="${delay}">${body}</g>`;
  const opening=()=>window.COURSE.slides.find(slide=>slide.id==='S01').demo;
  const fragments=['人工','智能','是','一类'];
  function engines(s) {
    const requests=[
      {id:'A',prompt:opening().question,input:5,color:C.orange},
      {id:'B',prompt:'总结这篇文章 ＋ 附文',input:28,color:C.purple},
      {id:'C',prompt:window.COURSE.slides.find(slide=>slide.id==='S29').demo.question,input:4,color:C.green},
    ];
    let z=t(742,310,'客户端发来的问题',26,C.muted)+t(1218,310,'引擎里的请求状态 · 示意',26,C.muted);
    requests.forEach(({id,prompt,input,color},i)=>{
      const y=365+i*145, waiting=i===2;
      z+=t(742,y+39,id,28,color)+t(799,y+37,prompt,29)+t(799,y+79,`输入 ${input} 个 Token`,22,C.muted);
      z+=line(`M742 ${y+111}H1740`);
      z+=at(s===0?500+i*330:0,t(1218,y+37,waiting?'等待分配预算':'正在生成',27,waiting?C.muted:color));
      if(s>=1&&!waiting){
        z+=t(1218,y+79,'输入 KV',20,color);
        for(let pos=0;pos<input;pos++){
          z+=at(s===1?480+i*460+pos*26:0,r(1308+pos*15,y+63,11,18,color,.68));
        }
      }
    });
    if(s===2){
      const tools=[['vLLM','模型推理与服务'],['SGLang','模型推理与服务'],['TensorRT-LLM','NVIDIA 推理优化']];
      tools.forEach(([name,role],i)=>{const x=742+i*360;z+=t(x,841,name,34)+t(x,892,role,24,C.muted);});
    }else if(s===3){
      z+=line('M748 824H1720',C.line)+t(748,881,'每轮挑选请求 → 保留各自的 KV → 调用模型计算',29,C.green);
    }
    return frame('S12',s,z,{layout:'hero',title:'推理引擎怎样<br>处理多个请求？',
      deck:['同一份模型要处理<br>不同长度的请求。','引擎为正在生成的<br>请求保留缓存。','选择工具时核对模型、<br>设备及所需功能。','引擎在模型外维护<br>请求的执行状态。'][s],
      foot:'输入长度与请求状态为模拟。完整服务还要处理接入、鉴权、限流和监控。'});
  }

  function components(s) {
    const X=[150,575,1010,1470];
    let z='';
    const stages=[['聊天窗口','发送问题'],['API Server','接收与检查'],['Scheduler','等待与组批'],['Worker','调用 GPU']];
    stages.forEach(([title,detail],i)=>{
      const x=X[i],active=i<=s+1;
      z+=t(x,408,title,30,active?C.ink:C.muted)+t(x,454,detail,23,C.muted);
      if(i<3)z+=line(`M${x} 477H${X[i+1]-28}`,C.line,2);
    });
    z+=r(125,508,335,334,'#1a201a')+t(149,554,'聊天机器人',25,C.muted);
    z+=token(148,581,opening().question,C.green,'data-client-message="A"',286);
    if(s<3)z+=t(148,753,s<2?'等待回复…':'正在生成…',25,C.muted);
    else z+=at(1540,t(148,753,'人工智能是一类…',29,C.green));
    z+=at(s===0?850:0,t(575,561,'输入检查通过',26,C.green));
    if(s>=1){
      z+=t(1010,524,'等待队列',24,C.muted);
      ['B','A'].forEach((name,i)=>{if(i===0||s===1)z+=token(1010+i*87,543,name,i?C.orange:C.purple,`data-request="${name}" data-status="waiting"`,72);});
    }
    if(s>=2){
      z+=r(1470,510,285,98,'#222a21')+t(1490,548,'GPU 执行请求 A',27,C.green)+t(1490,584,'使用请求自己的缓存',24,C.muted);
      for(let i=0;i<5;i++)z+=r(1470+i*57,660,44,39,C.purple,.7,`data-kv-index="${i}"`);
      z+=line('M1610 608V649',C.purple,2)+t(1470,738,'KV Cache',26,C.purple);
    }
    const [from,to]=[[450,575],[650,1097],[1097,1470],[1097,1470]][s];
    if(s<3)z+=flow(`${from},${s?583:477} ${to},${s?583:477}`,C.orange,1800,100,8,'data-request="A" data-inference-once');
    if(s===3){
      z+=line('M1690 763V921H150V845',C.green,2);
      z+=flow('1690,763 1690,921 150,921 150,845',C.green,1600,0,8,'data-inference-once');
      z+=t(799,905,'服务接口把输出传回聊天窗口',27,C.green);
    }
    return frame('S13',s,z,{deck:['收到来自聊天窗口的请求 A。','GPU 暂时忙，A 留在等待队列。','调度器把 A 交给 Worker，Worker 调用 GPU。','生成的文字沿服务接口返回。'][s],
      foot:'逻辑职责示意。不同引擎可在同一进程内实现，也可拆到不同进程或机器。'});
  }

  function tokens(s) {
    const values=[
      ['什么',21,'[0.2, 0.7]','[2, 0]','10%'],
      ['是',8,'[0.1, 0.4]','[0, 1]','10%'],
      ['人工',106,'[0.6, 0.3]','[2, 1]','50%'],
      ['智能',52,'[0.7, 0.6]','[0, 2]','30%'],
      ['？',3,'[0.1, 0.2]','—','—'],
    ];
    let z=t(750,290,`输入「${opening().question}」`,37);
    const rows=[['分词',390],['词表 ID',490],['嵌入向量',594],['各位置的 K',668],['注意力权重',737],['V（值向量）',815]];
    rows.slice(0,s===0?2:s===1?3:6).forEach(([label,y])=>z+=t(739,y,label,23,C.muted));
    values.forEach(([word,id,embedding,value,weight],i)=>{
      const x=910+i*175, masked=s>=2&&i===4, current=i===3&&s>=2;
      const color=masked?C.muted:current?C.orange:C.green;
      z+=at(280+i*70,token(x,346,word,color,`data-token-position="${i}"`,137));
      z+=at(650+i*70,t(x+68,490,id,29,color,'middle')+line(`M${x+68} 421v30`,C.line));
      if(s>=1)z+=at(400+i*65,t(x+68,594,embedding,26,masked?C.muted:C.purple,'middle')+line(`M${x+68} 513v42`,C.line));
      if(s>=2){
        z+=at(1650,t(x+68,668,masked?'—':`K${i+1}`,24,color,'middle'));
        if(!masked)z+=at(2800+i*120,t(x+68,737,weight,29,color,'middle'));
        z+=at(4700,t(x+68,815,value,26,color,'middle'));
        if(current)z+=at(900,t(x+68,631,'当前 Q',23,C.orange,'middle'));
      }
    });
    if(s>=2){
      z+=at(1750,line('M1503 636V642H978 M1153 642v8 M1328 642v8 M1503 642v8 M978 642v8',C.orange,1.5));
      z+=at(5900,line('M911 837H1770',C.line)+t(911,889,'按权重组合 V → [1.2, 1.2]',33,C.green));
    }
    if(s===3){
      z+=at(850,r(1610,646,135,185,'#272820',.96,'data-causal-mask="future"')+line('M1625 677l101 126 M1625 715l71 88',C.orange,2));
      z+=at(1400,t(1677,869,'未来位置',24,C.orange,'middle'));
    }
    return frame('S14',s,z,{layout:'hero',title:'分词、嵌入<br>与注意力',deck:[
      '文字切成片段，再查词表 ID。','每个 ID 查出一组数。','当前 Q 与各位置的 K 计算权重，<br>再用这些权重组合 V。','「智能」可以看左边和自己，<br>因果遮罩挡住右边的「？」。'][s],
      foot:'切分、ID、向量和权重均为教学模拟。实际模型的词表、维度和数值各不相同。'});
  }

  function generationCost(s,beat) {
    let z=t(125,414,'输入较长 · Prefill',37,C.purple)+t(125,698,'并发较低 · Decode',37,C.orange);
    z+=line('M125 625H1770');
    z+=t(540,409,'显存中的权重',23,C.muted)+r(540,441,225,59,C.purple,.28);
    z+=t(540,693,'权重 + 历史 KV',23,C.muted)+r(540,725,225,59,C.purple,.28);
    z+=line('M765 470H1118',C.purple,2);
    for(let i=0;i<6;i++){
      z+=r(562+i*32,460,21,22,C.purple,.8)+r(562+i*32,744,21,22,i<3?C.purple:C.orange,.8);
      z+=flow(`765,470 986,470 1118,${423+i*21}`,C.purple,920,i*78,6,'data-inference-once');
    }
    z+=processor(1120,403,'多个位置并行计算',C.green,.74);
    z+=at(850,t(1370,461,'读入的权重供多个位置使用',28,C.green)+t(1370,511,'矩阵运算多，算力压力大',28,C.ink));
    z+=at(1560,line('M765 754H1118',C.orange,3)+processor(1120,690,'每条请求推进一个位置',C.orange,.74,1));
    for(let i=0;i<3;i++)z+=flow('765,754 950,754 1118,754',C.orange,600,1590+i*600,8,'data-inference-once');
    z+=at(2520,t(1370,745,'每轮都要搬权重和 KV',28,C.orange)+t(1370,795,'生成容易受带宽限制',28,C.ink));
    z+=at(3900,t(125,961,'长输入 → 首个 Token 前的工作更多',29,C.purple)+t(978,961,'长输出 → 需要更多 Decode 轮次',29,C.orange));
    return frame('S15',s,z,{label:beat.label,title:'长输入与长输出的开销',foot:'常见稠密模型的示意。瓶颈还随批大小、上下文长度、硬件和实现变化。'});
  }
  function generation(s,beat) {
    if(s===3 && Number(beat.id.split('.')[1])>=11)return generationCost(s,beat);
    let z=t(130,395,'输入序列 · 分词示意',27,C.muted);
    ['什么','是','人工','智能','？'].forEach((word,i)=>z+=token(130+i*122,435,word,C.purple,`data-input-position="${i}"`,100));
    z+=line('M740 467H860',C.line,2);
    z+=processor(902,404,s<2?'Prefill':'Decode',s<2?C.purple:C.orange,.98);
    z+=t(1230,395,'模型输出',27,C.muted)+line('M1215 509H1788',C.line);
    const n=[0,1,2,4][s];
    if(s===1)for(let i=0;i<5;i++){
      z+=flow(`${180+i*122},512 ${180+i*122},546 855,546 905,467`,C.purple,820,i*36,6,'data-inference-once');
    }
    for(let i=0;i<n;i++){
      const delay=i===0&&s===1?1060:i===1&&s===2?1020:s===3&&i>=2?3800+(i-2)*3200:0;
      z+=at(delay,token(1226+i*133,435,fragments[i],C.green,`data-output-token="${i+1}"`,112));
    }
    if(s>=1){
      z+=t(767,766,'已处理位置的 KV',26,C.purple);
      for(let i=0;i<(s===1?5:s===2?6:8);i++){
        const color=i<5?C.purple:C.orange;
        z+=at(s===1?790:i===5&&s===2?680:s===3&&i>=6?3120+(i-6)*3200:0,r(767+i*57,806,43,39,color,.85));
      }
    }
    if(s>=2){
      const feed=s===2?[[1282,70]]:[[1415,2140],[1548,5340]];
      feed.forEach(([x,delay])=>{
        z+=line(`M${x} 515V656H1088V518`,C.orange,2,'opacity=".6"');
        z+=flow(`${x},515 ${x},656 1088,656 1088,518`,C.orange,840,delay,7,'data-feedback="previous-output" data-inference-once');
      });
      z+=t(1210,700,s===2?'把刚生成的「人工」接回输入':'每轮接回上一个输出',26,C.orange);
    }
    if(s===3){
      z+=r(1226,762,540,135,'#202821')+t(1250,808,'聊天窗口 · 流式收到',22,C.muted);
      z+=at(680,t(1250,869,'人工智能',37,C.green,'start','data-stream-chunk="1"'));
      z+=at(7350,t(1400,869,'是一类…',37,C.green,'start','data-stream-chunk="2"'));
    }
    return frame('S15',s,z,{deck:['问题已切成 Token，回答还没有开始。','Prefill 处理整段输入，建立缓存，随后得到首个输出。','Decode 接回上一轮的输出，并追加该位置的缓存。','文字分段传回聊天窗口。'][s],
      foot:'常见因果 Transformer 的生成示意。分词与网络分段是两件事。'});
  }
  function cache(s) {
    const n=s>=1?4:3;
    let z='';
    z+=t(705,329,s===1?'反复重算的历史表示':'模型某一层的 K / V',27,s===1?C.red:C.muted);
    for(let row=0;row<2;row++) {
      z+=t(701,441+row*151,row?'V':'K',39,C.purple);
      for(let i=0;i<n;i++) {
        const x=770+i*184,y=392+row*151,color=s===1?C.red:i===3?C.orange:C.green;
        z+=token(x,y,(row?'V':'K')+(i+1),color,`data-kv-index="${i}" data-kv-type="${row?'V':'K'}" data-kv-action="${s===1?'recompute':i===3&&s>=2?'write':'stored'}" class="${i===3&&s===2?'i-cache-write':''}"`,135);
        if(s===1)z+=flow(`${x+65},${y+85} ${x+65},${y-35} ${x+98},${y-35} ${x+98},${y+20}`,C.red,2200,i*160+row*300,5,'data-recompute="true"');
      }
    }
    z+=line('M758 660H1284',C.line,2)+t(1020,710,s===1?'历史跟着新位置一起重算':'历史位置：已经算过',27,s===1?C.red:C.green,'middle');
    if(s>=2)z+=t(1384,710,'新位置：追加',27,C.orange,'middle')+line('M1322 661H1460',C.orange,2);
    z+=dot(1640,447,55,'#30281f')+t(1640,458,'Q',38,C.orange,'middle')+t(1640,552,'新位置的 Query',27,C.orange,'middle');
    if(s===0) {
      z+=line('M1545 430H1463',C.line,2);
      z+=t(705,842,'历史 K / V 已经确定，可继续使用。',31,C.ink);
    }
    if(s===1)z+=t(705,842,'新位置来了，历史位置也跟着重新计算。',31,C.red)+
      t(1384,710,'新位置 t4',27,C.red,'middle');
    if(s>=2)z+=t(705,842,s===2?'保存历史，只计算并追加新位置的 K / V。':'省下重算；仍要从显存读取历史 K / V。',31,s===3?C.ink:C.green);
    if(s===3)for(let row=0;row<2;row++)for(let i=0;i<n;i++) {
      const x=838+i*184,y=470+row*151,routeY=745+row*28;
      z+=line(`M${x} ${y}V${routeY}H1570V484`,C.purple,1.2,'opacity=".4"');
      z+=flow(`${x},${y} ${x},${routeY} 1570,${routeY} 1570,484 1605,465`,C.purple,3600,i*400+row*260,6,`data-kv-read="${i}" data-kv-read-type="${row?'V':'K'}"`);
    }
    if(s===3)z+=at(1450,t(1640,618,'得到当前位置的',24,C.green,'middle')+t(1640,651,'注意力结果',24,C.green,'middle'));
    return frame('S16',s,z,{layout:'hero',title:'KV Cache<br>怎样复用历史？',deck:['因果模型中，历史位置的<br>K 和 V 可以留给后续生成。','不缓存时，<br>历史位置也会重新计算。','每层保存历史 K 和 V，<br>并追加新位置的 K 和 V。','新位置用 Query 和缓存中的<br>K、V 计算注意力。'][s],foot:'固定权重的常见因果 Transformer 示意。缓存减少历史表示重算，同时占用显存并产生读取。'});
  }
  function cacheCapacity(s,beat) {
    const {model,layers,kvHeads,headDimension,bytesPerElement,shortTokens,longTokens,longRequests}=window.COURSE.slides.find(slide=>slide.id==='S17').demo;
    const bytesPerToken=2*layers*kvHeads*headDimension*bytesPerElement;
    const shortMiB=bytesPerToken*shortTokens/2**20;
    const longGiB=bytesPerToken*longTokens/2**30;
    let z=t(130,415,`${model} · BF16 KV`,36,C.ink);
    z+=t(130,479,`K 和 V × ${layers} 层 × ${kvHeads} 个 KV 头 × 每头 ${headDimension} 个数 × 每个数 ${bytesPerElement} 字节`,29,C.muted);
    z+=at(180,t(130,540,`每个缓存 Token 占 ${bytesPerToken/1024} KiB`,35,C.purple));
    const rows=[
      [700,623,`1 条短对话 · ${shortTokens.toLocaleString('en-US')} Token`,`${shortMiB} MiB`,shortMiB/1024],
      [1330,739,`1 条长对话 · ${longTokens.toLocaleString('en-US')} Token`,`${longGiB} GiB`,longGiB],
      [2110,855,`${longRequests} 条同样长的对话`,`${longGiB*longRequests} GiB`,longGiB*longRequests],
    ];
    for(const [delay,y,name,amount,gib] of rows){
      const fullWidth=1032, width=fullWidth*gib/(longGiB*longRequests);
      z+=at(delay,t(130,y+37,name,29,C.ink)+r(665,y,fullWidth,53,C.line,.4)+r(665,y,width,53,C.purple,.85)+t(1730,y+36,amount,28,C.purple));
    }
    return frame('S17',s,z,{label:beat.label,title:'真实模型的 KV 显存估算',foot:'保留完整历史，按每条对话独立存储估算。权重、临时数据和块管理开销另计。'});
  }
  function cachegrow(s,beat) {
    if(s===3 && Number(beat.id.split('.')[1])>=9)return cacheCapacity(s,beat);
    const rows=s<2?[['A',s===0?3:7,C.orange]]:[['A',7,C.orange],['B',5,C.green],['C',4,C.purple]];
    const budget=18;
    const used=rows.reduce((sum,row)=>sum+row[1],0);
    let z=processor(152,484,'共享权重',C.ink,1.18);
    z+=t(258,828,'权重保留一份',28,C.muted,'middle');
    z+=line('M459 579H575',C.line,2);
    z+=t(606,400,'每个请求各自保存历史',28,C.muted);
    rows.forEach(([name,count,color],i)=>{
      const y=442+i*98;
      z+=t(610,y+39,name,31,color);
      for(let j=0;j<count;j++){
        const delay=name==='A'&&s===1&&j>=3?330+(j-3)*260:name!=='A'&&s===2?300+i*275:0;
        z+=at(delay,r(690+j*126,y,102,55,color,.7,`data-request="${name}" data-cache-position="${j}" data-used="true"`)+t(741+j*126,y+37,'KV',25,C.dark,'middle'));
      }
      z+=at(name!=='A'&&s===2?300+i*275:0,t(1628,y+39,`${count} 个位置`,25,color));
    });
    const x0=605,y=805,w=63;
    if(s===1||s===2){
      const before=s===1?3:7;
      const fills=s===1?[330,590,850,1110]:[575,850];
      fills.forEach((end,i)=>{
        const value=s===1?before+i:i===0?before:12;
        z+=`<g data-inference-window="${i===0?0:fills[i-1]},${end}" opacity="0">${t(x0,773,`合计 ${value} / ${budget} 个位置`,31,C.ink)}</g>`;
      });
      z+=at(fills.at(-1),t(x0,773,`合计 ${used} / ${budget} 个位置`,31,C.ink));
    } else z+=t(x0,773,`合计 ${used} / ${budget} 个位置`,31,C.ink);
    let offset=0;
    rows.forEach(([name,count,color],i)=>{
      for(let j=0;j<count;j++){
        const delay=name==='A'&&s===1&&j>=3?330+(j-3)*260:name!=='A'&&s===2?300+i*275:0;
        z+=at(delay,r(x0+(offset+j)*w,y,w-6,31,color,.82));
      }
      offset+=count;
    });
    for(let i=used;i<budget;i++)z+=r(x0+i*w,y,w-6,31,C.line,.45);
    if(s===3)z+=at(740,t(x0,921,'D 需要 3 格，池里只剩 2 格 → 等待',31,C.orange)+token(1430,867,'D',C.orange,'data-request="D" data-status="waiting"',83));
    return frame('S17',s,z,{deck:'模型和存储格式固定时，缓存占用随保留的位置增加。',
      foot:'每格代表一个位置的 KV 存储量。实际大小还取决于层数、KV 头数、维度、精度及缓存策略。'});
  }
  function physicalBlock(i,x,y,owner='',logical=null,extra='',filled=4) {
    const color=owner==='A'?C.orange:owner==='B'?C.green:owner==='C'?C.purple:C.line;
    let z=`<g data-physical-block="${i}" data-owner="${owner||'free'}" data-free="${!owner}">`;
    z+=t(x+108,y-24,'P'+i,25,owner?color:C.muted,'middle');
    z+=line(`M${x} ${y+17}l108,-37 108,37 -108,37Z`,owner?color:C.line,1.5);
    z+=`<path d="M${x} ${y+17}v55l108,37 108,-37V${y+17} M${x+108} ${y+54}v55" fill="#1c211d" stroke="${owner?color:C.line}" stroke-width="1.5"/>`;
    if(owner){z+=`<g ${extra} data-load-x="${160-x}" data-load-y="${433+(logical||0)*145-y}">`;for(let j=0;j<4;j++)z+=r(x+22+j*45,y+18,34,23,color,j<filled?.85:.22,`data-cache-cell="${j}"`);z+='</g>'}
    z+=t(x+108,y+150,owner?`${owner} · L${logical}`:'空闲',26,owner?color:C.muted,'middle');
    return z+'</g>';
  }
  function paged(s) {
    let z='';
    if(s<2) {
      z+=t(130,398,'连续预留',29,C.ink)+t(905,398,'灰色空位已属于当前请求',27,C.muted);
      const used=[3,5,2], cols=[C.orange,C.green,C.purple];
      for(let row=0;row<3;row++) {
        const y=435+row*140;
        z+=t(150,y+45,['A','B','C'][row],32,cols[row]);
        for(let i=0;i<10;i++)z+=r(240+i*150,y,130,76,i<used[row]?cols[row]:C.line,i<used[row]?.8:.25,`data-reserved-owner="${['A','B','C'][row]}" data-used="${i<used[row]}"`);
      }
      if(s===1) {
        z+=token(1510,895,'D',C.orange,'data-status="waiting"',75);
        z+=t(130,931,'这里尚未用满，另一个请求却仍可能等空间。',31,C.orange);
      } else z+=t(130,931,'回答有多长，需要生成完才知道。',31,C.muted);
    } else {
      z+=t(130,408,'逻辑序列 · 请求 A',29,C.orange)+t(990,408,'物理缓存池',29,C.muted);
      const mapping=s===2?[2,5]:[2,5,1];
      for(let i=0;i<mapping.length;i++) {
        const y=433+i*145;
        z+=token(135,y,'L'+i,C.orange,`data-logical-block="${i}" data-mapping="${mapping[i]}"`,168);
        z+=t(475,y+43,`L${i} → P${mapping[i]}`,30,C.ink,'middle');
        const p=mapping[i],x=990+(p%3)*270,py=480+Math.floor(p/3)*255;
        z+=line(`M565 ${y+35}H735V${py+38}H${x-16}`,C.orange,1.2,'opacity=".35"');
        if(s===3)z+=flow(`290,${y+35} 735,${y+35} 735,${py+38} ${x+100},${py+38}`,C.orange,3900,i*900,7,`data-logical-read="${i}"`);
      }
      for(let i=0;i<6;i++) {
        const logical=mapping.indexOf(i),x=990+(i%3)*270,y=480+Math.floor(i/3)*255;
        z+=physicalBlock(i,x,y,logical>=0?'A':'',logical,logical>=0?'class="i-physical-load"':'');
      }
      z+=t(130,931,s===2?'块表记录每个逻辑块对应的物理块。':'按 L0、L1、L2 访问；物理位置是 P2、P5、P1。',31,s===3?C.ink:C.orange);
    }
    return frame('S18',s,z,{deck:s<2?'已预留的空位暂时无法分配给其他请求。':'Token 的先后顺序保留，实际存放位置由映射表记录。',foot:'图中每块可放 4 个 Token 位置。分页用于组织设备内存中的块，块表记录地址。'});
  }
  function allocate(s) {
    const entries=s===0?[['A',0,2]]:s===1?[['A',0,2],['A',1,5]]:s===2?[['A',0,2],['A',1,5],['B',0,1]]:[['B',0,1]];
    let z=t(130,400,'块映射表',30,C.ink)+t(975,400,'共享物理池 · 六个块',30,C.muted);
    z+=t(130,451,'请求',23,C.muted)+t(325,451,'逻辑',23,C.muted)+t(545,451,'物理',23,C.muted);
    entries.forEach(([owner,l,p],i)=>{
      const y=515+i*115,color=owner==='A'?C.orange:C.green;
      z+=`<g data-mapping-owner="${owner}" data-logical-block="${l}" data-mapping="${p}" ${s===3?'data-retained-mapping':'class="i-enter"'}>${t(150,y,owner,40,color)}${t(350,y,'L'+l,35,color)}${line(`M425 ${y-12}H490`,color,2)}${t(565,y,'P'+p,35,color)}${line(`M130 ${y+27}H660`,C.line,1)}</g>`;
    });
    for(let i=0;i<6;i++) {
      const entry=entries.find(a=>a[2]===i), x=965+(i%3)*282,y=470+Math.floor(i/3)*260;
      const filled=i===2&&s>0?4:2;
      const block=physicalBlock(i,x,y,entry?.[0],entry?.[1],entry?'class="i-physical-load"':'',filled);
      if(s===3 && [2,5].includes(i)) {
        const releasedAt=i===2?2800:3500;
        z+=`<g data-inference-window="0,${releasedAt}" opacity="0">${physicalBlock(i,x,y,'A',i===2?0:1).replace(/data-(physical-block|owner|free)=/g,'data-previous-$1=')}</g>`;
        const released=block+t(x+108,y+194,'A 的块已归还',24,C.orange,'middle');
        if(i===2){
          z+=`<g data-inference-window="${releasedAt},4780" opacity="0">${released}</g>`;
          z+=at(4780,physicalBlock(i,x,y,'C',0,'',2)+t(x+108,y+194,'已分配给 C',24,C.purple,'middle'));
        }else z+=at(releasedAt,released);
      }else z+=block;
    }
    if(s===3){
      [['L0','P2',515,2800],['L1','P5',630,3500]].forEach(([logical,physical,y,end])=>{
        z+=`<g data-inference-window="0,${end}" opacity="0">${t(150,y,'A',40,C.orange)}${t(350,y,logical,35,C.orange)}
          ${line(`M425 ${y-12}H490`,C.orange,2)}${t(565,y,physical,35,C.orange)}</g>`;
      });
      z+=at(4780,t(150,630,'C',40,C.purple)+t(350,630,'L0',35,C.purple)+line('M425 618H490',C.purple,2)+t(565,630,'P2',35,C.purple));
      z+=flow('180,660 730,660 975,510 1637,505',C.purple,810,3900,8,'data-inference-once');
    }
    const notes=['A 只领够用的空间','原块写满，A 再领一块','B 从同一个池领取空闲块','A 的空间可供后来的请求使用'];
    z+=at(s===3?3650:0,t(130,930,notes[s],31,s===3?C.green:C.orange));
    return frame('S19',s,z,{deck:'逻辑顺序不变，空间从同一个物理池申请。',foot:'回收以请求结束、且缓存块无其他引用或保留用途为前提。'});
  }
  function batch(s) {
    const current=[1,2,3,6][s];
    const fixed=[['A','A','','','C','C'],['B','B','B','B','',''],['','','','','','']];
    const continuous=[['A','A','','','',''],['B','B','B','B','',''],['','C','C','','','']];
    let z='';
    const color={A:C.orange,B:C.green,C:C.purple};
    const x0=570,dx=196,w=169;
    for(let c=0;c<6;c++)z+=t(x0+c*dx+w/2,388,'轮 '+(c+1),24,C.muted,'middle');
    for(let mode=0;mode<2;mode++) {
      const top=mode?715:430, rows=mode?continuous:fixed;
      z+=t(100,top+26,mode?'连续批处理':'固定批次',33,mode?C.green:C.ink);
      z+=t(100,top+75,mode?'轮次之间，重新组织':'等本批结束，再加入',25,C.muted);
      for(let row=0;row<3;row++)for(let c=0;c<6;c++) {
        const name=rows[row][c],active=name&&c<current, x=x0+c*dx,y=top+row*61;
        const cell=r(x,y,w,43,name?color[name]:C.line,active?.56:name?.12:.07,`data-batch-mode="${mode?'continuous':'fixed'}" data-request="${name||'empty'}" data-round="${c+1}" data-status="${!name?'empty':c+1>current?'scheduled':c+1===current?'running':'complete'}"`)
          +(name?t(x+w/2,y+31,name,25,active?C.ink:C.muted,'middle'):'');
        z+=s===1&&mode&&name&&c>=1?at(2140,cell):cell;
      }
      if((mode===0||s>=1)&&s<3) {
        const cursor=line(`M${x0+(current-1)*dx-12} ${top-15}V${top+173}`,mode?C.green:C.orange,2,'data-round-cursor="true"');
        z+=s===1&&mode?at(2140,cursor):cursor;
      }
    }
    if(s===0)z+=at(480,t(100,655,'C 等待下一批',28,C.purple));
    if(s===1)z+=at(2140,t(100,655,'C 在第 2 轮加入',28,C.purple));
    if(s===2)z+=t(100,655,'A 已完成退出',28,C.orange)+t(335,655,'B、C 继续执行',28,C.green);
    if(s===3)z+=t(100,655,'C：第 6 轮完成',28,C.purple)+t(100,934,'C：第 3 轮完成',28,C.purple)+t(1040,934,'按显存、Token 预算与延迟目标组批',27,C.muted);
    const live=s===0?['A','B']:s===1?['A','B','C']:s===2?['B','C']:[];
    const finished=s===2?['A']:s===3?['A','B','C']:[];
    if(live.length)z+=t(825,612,s===0?'当前固定批次':'当前执行集合',25,C.muted);
    live.forEach((name,i)=>{
      const x=825+i*150,enter=s===1&&name==='C';
      const request=`<g data-live-request="${name}" data-live-status="running" ${enter?`data-batch-enter="true" data-from-x="${405-x}"`:''}>${r(x,622,107,62,color[name],.8)}${t(x+53,663,name,31,C.dark,'middle')}${line(`M${x} 686H${x+107}`,color[name],3,'class="i-batch-work"')}</g>`;
      z+=enter?at(1920,request):request;
    });
    if(s===0)z+=at(480,token(405,622,'C',C.purple,'data-live-request="C" data-live-status="waiting"',76));
    if(s===1){
      let prefill=t(100,655,'C · Prefill',30,C.purple)+t(300,623,'输入',22,C.muted)+t(533,623,'写入 KV',22,C.purple);
      prefill+=line('M387 653H522',C.line,2);
      for(let i=0;i<3;i++){
        prefill+=r(300+i*29,639,22,25,C.purple,.65);
        prefill+=flow(`${330+i*28},652 460,652 ${532+i*29},652`,C.purple,760,80+i*170,6,'data-inference-once');
        prefill+=at(730+i*170,r(533+i*29,639,22,25,C.purple,.85));
      }
      prefill+=at(1320,t(642,656,'首个输出',22,C.green));
      z+=`<g data-inference-window="0,1930" data-prefill-request="C" opacity="0">${prefill}</g>`;
    }
    if(s===1||s===2)z+=token(100,559,'C 仍在等',C.purple,'data-fixed-waiting="C"',145);
    if(s===3){
      z+=line(`M${x0-12} 414v183 M${x0-12} 700v183`,C.orange,2,'data-batch-scan opacity="0"');
      z+=at(3800,t(570,994,'C 提前 3 轮完成。图中每一轮的实际耗时可能不同。',26,C.ink));
    }
    if(finished.length)z+=t(s===3?1150:1450,612,'已退出',25,C.muted);
    finished.forEach((name,i)=>{
      const x=s===3?1290+i*145:1580;
      z+=`<g data-live-request="${name}" data-live-status="complete" ${(s===2||name!=='A')?`data-batch-exit="true" data-from-x="${825+i*150-x}"`:''}>${r(x,622,100,62,color[name],.3)}${t(x+50,663,name,30,color[name],'middle')}</g>`;
    });
    return frame('S20',s,z,{deck:'剩余 Decode 轮次：A 两轮，B 四轮。C 在第一轮后到达，还需 Prefill 和两轮 Decode。',foot:'图中只编号 Decode 轮次。部分引擎可在同一次迭代中安排 Prefill 和 Decode。'});
  }
  function prefix(s) {
    let z='';
    z+=t(750,340,'相同的提示文本与 Token 前缀',30,C.purple);
    if(s===0) {
      for(let row=0;row<2;row++) {
        const y=435+row*205;
        z+=t(738,y+38,row?'B':'A',33,row?C.green:C.orange);
        z+=token(805,y,'仅依据这份差旅手册回答',C.purple,'data-prefix-text',650);
        z+=token(1485,y,row?'怎么订票？':'何时报销？',row?C.green:C.orange,'',260);
      }
      z+=t(805,881,'前缀完全相同，后续问题各不相同。',30,C.muted);
    } else {
      z+=token(805,415,'仅依据这份差旅手册回答',C.purple,'data-prefix-text',605);
      z+=line('M1110 505V620H1720',C.purple,2)+t(805,583,'保留的前缀 KV',28,C.purple);
      for(let i=0;i<5;i++)z+=at(s===1?380+i*150:0,r(805+i*110,620,85,52,C.purple,.7,'data-prefix-cached="true"'));
      z+=line('M1410 447H1483',C.orange,2)+token(1505,415,'何时报销？',C.orange,'data-suffix-owner="A"',230);
      if(s===1)z+=flow('815,446 1430,446 1480,446',C.orange,2700,0,6,'data-inference-once');
      if(s>=2) {
        z+=token(1505,712,'怎么订票？',C.green,'data-suffix-owner="B"',230);
        z+=line('M1370 646H1445V745H1483',C.green,2)+flow('1020,646 1445,646 1445,745 1480,745',C.green,3300,0,7,'data-prefix-reuse="B"');
        z+=t(1455,863,'B 接上已有状态',29,C.green,'middle');
      } else z+=t(805,835,'A 先计算，服务保留这份状态。',30,C.muted);
      if(s===3){
        z+=at(800,t(805,890,'命中时省下的计算',24,C.muted));
        z+=at(1700,r(805,916,468,48,'#2d2737')+t(828,948,'共同前缀 · 直接读取 KV',25,C.purple));
        z+=at(3300,r(1300,916,435,48,'#233120')+t(1323,948,'不同后缀 · 执行 Prefill',25,C.green));
      }
    }
    return frame('S21',s,z,{layout:'hero',title:'前缀缓存<br>怎样命中？',deck:['两个请求可以包含相同的<br>系统提示或文档前缀。','服务可以保存 A 的前缀 KV，<br>供后续请求使用。','前缀与配置匹配时，<br>B 可以复用这段 KV。','命中后，B 只需处理<br>前缀之后的输入。'][s],foot:'命中依赖前缀 Token、模型、配置与缓存键匹配；共享还受租户隔离、保留和淘汰策略约束。'});
  }
  function quantization(s, beat) {
    let z='';
    if(s<2) {
      z+=t(130,429,'FP16',37,C.purple)+at(650,t(130,638,'INT4',37,C.green));
      const bits=['0011100111000000','0111'];
      bits.forEach((word,row)=>[...word].forEach((bit,i)=>{
        const x=340+i*85,y=row?584:375,color=row?C.green:C.purple;
        z+=at(row?650:0,r(x,y,66,76,color,.22,`data-bit-width="${word.length}" data-bit-position="${i}"`)+t(x+33,y+49,bit,29,color,'middle'));
      }));
      z+=t(340,499,'原值 0.71875',27,C.purple)+at(650,t(697,631,'整数 7',29,C.green));
      if(s>=1) {
        z+=at(920,t(878,631,'× 尺度 0.1 ≈ 0.7',33,C.orange));
        z+=t(340,763,'质量 · 硬件支持 · 内核实现 · 转换开销',29,C.muted);
      }
      if(s===0)z+=t(340,793,'同一个权重的量化前后表示。',30,C.muted);
      if(s===1)z+=t(340,841,'常见分组量化：一组值共享尺度，有些格式另存零点。',28,C.orange);
    } else if(s===2) {
      z+=t(130,526,'一份模型的权重与计算',32);
      [C.purple,C.green].forEach((color,i)=>{
        const y=568+i*118;
        z+=r(130,y,520,75,color,.15)+t(162,y+49,`分给 GPU ${i} 的部分`,28,color);
        z+=line(`M650 ${y+37}H1050`,color,2)+flow(`650,${y+37} 1050,${y+37}`,color,1250,i*350);
        z+=r(1060,y,640,75,color,.15)+t(1092,y+49,`GPU ${i} · 存放部分权重并执行对应计算`,28,color);
      });
      z+=line('M1620 647V680',C.orange,2)+t(1570,674,'按需通信',22,C.orange,'end');
      z+=t(130,872,'单卡预算还要留给请求的 KV Cache 和临时数据。',28,C.muted);
    } else {
      const rows=[
        ['weights','权重占用太大','量化 / 模型并行','缩小权重表示，或分摊到多卡',C.orange],
        ['cache','KV Cache 空间紧张','按块管理（PagedAttention）','按需分配，减少无效预留',C.green],
        ['prefix','请求反复处理相同前缀','Prefix Caching','命中后跳过共同前缀的 Prefill',C.purple],
        ['attention','注意力中间读写过多','FlashAttention','分块计算，减少显存往返',C.green],
      ];
      z+=t(145,405,'观察到的瓶颈',26,C.muted)+t(686,405,'对应手段',26,C.muted)+t(1190,405,'改变了什么',26,C.muted);
      rows.forEach(([key,problem,method,effect,color],i)=>{
        const y=432+i*102;
        z+=`<g data-optimization="${key}">${r(130,y,1658,77,color,.10)}${t(145,y+50,problem,30,color)}
          ${t(686,y+50,method,29)}${t(1190,y+50,effect,27,C.muted)}</g>`;
      });
      if(beat.id==='S22.9') {
        z+=`<g data-optimization="decode">${t(145,919,'Decode 还要逐轮生成，能少让大模型执行几轮吗？',29,C.orange)}</g>`;
      }
    }
    return frame('S22',s,z,{
      title:s===3?'推理慢或显存不够，该先查哪里？':s===2?'权重装不下，就分给多张卡':'权重占用太大，先看位宽',
      deck:s===3?'先找到主要开销，再选对应的手段。':s===2?'模型并行把一份模型的权重和计算拆到多张卡。':'量化用更少的比特表示权重。',
      label:beat.label,
      foot:'量化效果、显存节省和执行速度需在目标模型与硬件上验证。图中的权重和分工均为示意。',
    });
  }
  function mount(root,s,{animate=false,previousStep=null}={}) {
    const animations=[], run=(el,frames,options)=>{if(el)animations.push(el.animate(frames,{fill:'none',...options}))};
    root.querySelectorAll('.i-flow').forEach(el=>{
      const points=el.dataset.route.split(' ').map(p=>p.split(',').map(Number));
      const frames=points.map(([x,y],i)=>({transform:`translate(${x}px,${y}px)`,opacity:i===0||i===points.length-1?0:1,offset:i/(points.length-1)}));
      if(points.length===2)frames.splice(1,0,{transform:`translate(${points[0][0]}px,${points[0][1]}px)`,opacity:1,offset:.03},{transform:`translate(${points[1][0]}px,${points[1][1]}px)`,opacity:1,offset:.96});
      run(el,frames,{duration:+el.dataset.duration,delay:+el.dataset.delay,iterations:el.hasAttribute('data-inference-once')?1:Infinity,easing:'linear',fill:'both'});
    });
    root.querySelectorAll('.i-core').forEach((el,i)=>run(el,[{opacity:.35},{opacity:.95},{opacity:.35}],{duration:2300,delay:(i%4)*110,iterations:Infinity}));
    if(animate) {
      root.querySelectorAll('.i-enter').forEach((el,i)=>run(el,[{opacity:0,transform:'translateY(25px)'},{opacity:1,transform:'translateY(0)'}],{duration:680,delay:i*65,fill:'backwards',easing:'cubic-bezier(.16,1,.3,1)'}));
      root.querySelectorAll('.i-cache-write').forEach((el,i)=>run(el,[{transform:'translate(0,-170px)',opacity:0},{transform:'translate(0,0)',opacity:1}],{duration:1000,delay:i*250,fill:'backwards',easing:'cubic-bezier(.16,1,.3,1)'}));
      root.querySelectorAll('.i-physical-load').forEach((el,i)=>{
        const id=root.querySelector('.inference-scene')?.dataset.inferenceSlide;
        if(id==='S19'&&s===3)return;
        run(el,[{transform:`translate(${el.dataset.loadX||-250}px,${el.dataset.loadY||-35}px)`,opacity:.25},{transform:'translate(0,0)',opacity:1}],{duration:1150,delay:i*220,fill:'backwards',easing:'cubic-bezier(.16,1,.3,1)'});
      });
    }
    if(animate)root.querySelectorAll('[data-inference-window]').forEach(el=>{
      const [start,end]=el.dataset.inferenceWindow.split(',').map(Number);
      run(el,[{opacity:1},{opacity:1}],{duration:end-start,delay:start});
    });
    if(animate)run(root.querySelector('[data-retained-mapping]'),[
      {transform:'translateY(230px)'},{transform:'translateY(0)'}
    ],{delay:3500,duration:480,easing:'ease-in-out',fill:'backwards'});
    if(animate)run(root.querySelector('[data-batch-scan]'),[
      {transform:'translateX(0)',opacity:1},{transform:'translateX(980px)',opacity:1}
    ],{duration:3400,easing:'steps(5, end)'});
    if(animate || s===0) root.querySelectorAll('[data-inference-at]').forEach(el=>{
      const delay=+el.dataset.inferenceAt;
      if(delay)run(el,[{opacity:0},{opacity:1}],{duration:190,delay,fill:'backwards'});
    });
    root.querySelectorAll('.i-batch-work').forEach((el,i)=>run(el,[{strokeDasharray:'107',strokeDashoffset:'107'},{strokeDasharray:'107',strokeDashoffset:'0'}],{duration:2000,delay:i*120,iterations:Infinity,easing:'linear'}));
    if(animate)root.querySelectorAll('[data-batch-enter],[data-batch-exit]').forEach((el,i)=>run(el,[{transform:`translate(${el.dataset.fromX}px,0)`,opacity:.4},{transform:'translate(0,0)',opacity:1}],{duration:1500,delay:el.hasAttribute('data-batch-enter')?1920:i*180,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
    return animations;
  }
  window.CourseScenes ||= {};
  const renderers={S12:engines,S13:components,S14:tokens,S15:generation,S16:cache,S17:cachegrow,S18:paged,S19:allocate,S20:batch,S21:prefix,S22:quantization};
  Object.entries(renderers).forEach(([id,render])=>window.CourseScenes[id]={render,mount});
})();
