/* Service, deployment, measurement, and the closing request journey. */
(() => {
  'use strict';
  const C={ink:'#f2efe7',muted:'#979c93',orange:'#ed8254',green:'#bed6ae',purple:'#c7b8d9',dark:'#101113',line:'#42473e',sand:'#d9c8a6'};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const t=(x,y,s,size=27,color=C.ink,extra='')=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" ${extra}>${esc(s)}</text>`;
  const mono=(x,y,s,size=25,color=C.ink,extra='')=>t(x,y,s,size,color,`class="p-mono" ${extra}`);
  const path=(d,color=C.line,w=2,extra='')=>`<path d="${d}" stroke="${color}" stroke-width="${w}" fill="none" ${extra}/>`;
  const dot=(x,y,r,color=C.green,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" ${extra}/>`;
  const rect=(x,y,w,h,color=C.green,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" ${extra}/>`;
  const center='text-anchor="middle"';
  const route=(name,points,color=C.orange,options={})=>`<g class="p-travel" data-motion="${name}" data-points="${points.map(p=>p.join(',')).join(';')}" data-duration="${options.duration||3600}" data-delay="${options.delay||0}" ${options.once?'data-once="true"':''}>${options.label?rect(-20,-15,40,30,color)+mono(0,8,options.label,21,C.dark,center):dot(0,0,6,color)}</g>`;
  const svg=body=>`<svg class="p-svg" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
  function base(id,s,variant,body,copy='',footnote='') {
    const slide=window.COURSE.slides.find(p=>p.id===id);
    return `<section class="platform-scene ${variant}" data-platform-page="${id}" data-platform-step="${s}"><div class="p-mast"><span>AI INFRA <i>/</i> 入门课</span><span>${String(slide.chapter).padStart(2,'0')} — ${esc(window.COURSE.chapters[slide.chapter-1])}</span><span data-course-folio></span></div>${body}${copy}${footnote?`<div class="p-footnote">${footnote}</div>`:''}</section>`;
  }
  const heading=(over,title,sub='')=>`<div class="p-heading"><span>${over}</span><h1>${title}</h1>${sub?`<p>${sub}</p>`:''}</div>`;
  function chip(x,y,w=160,color=C.green,label='GPU') {
    let z=`<g class="p-device" transform="translate(${x} ${y})">`;
    z+=rect(-w/2,-75,w,150,'#1f261e',`stroke="${color}" stroke-width="1.5"`);
    for(let i=0;i<7;i++){const n=-w/2+15+i*(w-30)/6;z+=path(`M${n} -75v-14 M${n} 75v14`,color,3)}
    for(let i=0;i<5;i++){const n=-52+i*26;z+=path(`M${-w/2} ${n}h-14 M${w/2} ${n}h14`,color,3)}
    z+=mono(0,12,label,30,color,center);
    return z+'</g>';
  }
  function cube(x,y,size=140,color=C.green,label='') {
    const h=size*.52;
    return `<g><path d="M${x} ${y-h}l${size} ${h} -${size} ${h} -${size} -${h}Z" fill="${color}" opacity=".24"/><path d="M${x-size} ${y}l${size} ${h} ${size} -${h}v${h}l-${size} ${h} -${size} -${h}Z" fill="#181e18" stroke="${color}" stroke-width="1.5"/>${path(`M${x} ${y+h}v${h}`,color,1.5)}${label?t(x,y+h*2+48,label,28,color,center):''}</g>`;
  }
  const at=(delay,body)=>`<g data-platform-at="${delay}">${body}</g>`;
  function api(s) {
    const demo=window.COURSE.slides.find(slide=>slide.id==='S01').demo;
    let z=path('M635 466H893',C.orange,2.5);
    z+=`<circle cx="958" cy="466" r="62" fill="#1b211b" stroke="${C.orange}" stroke-width="2"/>`+mono(958,476,'API',32,C.orange,center);
    z+=path('M1020 466H1145',s>0?C.green:C.line,2.5);
    z+=chip(1260,466,160,C.green,'MODEL');
    z+=t(958,582,'接收 / 检查',27,C.muted,center)+t(1260,603,'调度 · 缓存 · 执行',26,C.muted,center);
    if(s<2)z+=route('api-request',s===0?[[650,466],[895,466]]:[[1020,466],[1164,466]],C.orange,{duration:1000,label:'→',once:true});
    if(s===1){
      z+=path('M1260 654V747H635',C.green,2.5);
      z+=t(958,797,'结果分两块返回',28,C.green,center);
      for(let i=0;i<2;i++)z+=route('stream-chunk',[[1260,654],[1260,747],[635,747]],C.green,{duration:900,delay:480+i*700,label:String(i+1),once:true});
      z+=at(5700,mono(1490,445,'用户取消',28,C.orange,center)+path('M1595 475H1370',C.orange,2));
      z+=at(6000,t(1490,520,'已停止后续生成',27,C.orange,center));
      z+=at(6260,t(1490,562,'请求缓存归还',24,C.muted,center));
      z+=t(1490,645,'请求占用的缓存块',24,C.muted,center);
      for(let i=0;i<4;i++){
        z+=rect(1393+i*53,668,38,38,'#2f332b','rx="3"');
        z+=`<g data-platform-window="850,${6320+i*160}" opacity="0">${rect(1393+i*53,668,38,38,C.purple,'rx="3"')}</g>`;
      }
    }
    if(s>=2){
      z+=path('M958 393V318H1645V393',C.line,1.5);
      [['限流',945],['超时',1145],['监控',1345],['取消 / 错误',1595]].forEach(([label,x],i)=>{z+=dot(x,318,5,i===3?C.purple:C.orange)+t(x,280,label,26,i===3?C.purple:C.orange,center)});
      if(s===2){
        z+=route('burst',[[638,466],[820,466],[895,466]],C.orange,{duration:800,label:'A',once:true});
        z+=route('rate-limit',[[638,466],[834,466],[834,656]],C.orange,{duration:950,delay:400,label:'B',once:true});
        z+=path('M834 482V656',C.orange,2,'stroke-dasharray="5 7"');
        z+=at(1240,mono(834,710,'B ← HTTP 429',29,C.orange,center)+t(834,756,'这一刻的限额已用完',25,C.muted,center));
        z+=at(840,t(1260,694,'A 通过限流，交给模型',27,C.green,center));
      }else{
        z+=mono(1260,718,'GET /v1/models',29,C.purple,center)+t(1260,777,'核对接口返回的可用模型',27,C.muted,center);
      }
    }
    const payload=`<div class="p-terminal"><div class="p-terminal-top">客户端 <span>请求与响应 · 示意</span></div><pre><b>POST</b> /v1/chat/completions
<span>{</span>
  "model": "small-model",
  "messages": [{
    "role": "user",
    "content": "${esc(demo.question)}"
  }],
  <span data-api-field="options">"max_tokens": 128, "stream": true</span>
<span>}</span></pre>${s===1?`<div class="p-terminal-output"><span>← 流式响应</span><p><span data-platform-at="1260">人工智能</span><span data-platform-at="1920">是一类…</span></p></div>`:''}</div>`;
    const copy=heading('模型服务','应用怎样<br>调用模型？')+payload+(s===3?'<div class="p-api-final"><span>切换服务前的检查</span><p>核对可用模型、参数和实际性能。</p></div>':'');
    return base('S23',s,'api-scene',svg(z),copy,'请求格式为示例。部署、限流和取消的具体行为由服务实现决定。');
  }
  function docker(s) {
    let z='';
    if(s===0){
      z+=mono(255,385,'开发机',30,C.green,center)+mono(1510,385,'服务器',30,C.orange,center);
      z+=path('M450 535H1370',C.line,2,'stroke-dasharray="7 10"');
      z+=mono(255,485,'Python 3.x',31,C.green,center)+mono(255,540,'依赖齐全',31,C.green,center);
      z+=at(1950,mono(1510,485,'ModuleNotFoundError',31,C.orange,center)+mono(1510,540,`No module named 'fastapi'`,27,C.muted,center));
      z+=at(1950,path('M880 500l60 65m0-65l-60 65',C.orange,4));
      z+=route('deliver-code',[[450,535],[790,535],[1330,535]],C.ink,{duration:1850,label:'{ }',once:true});
      z+=t(960,727,'相同代码，也需要匹配的运行环境。',38,C.ink,center);
      z+=mono(255,629,'$ python app.py',24,C.muted,center)+mono(255,672,'Listening on :8000',24,C.green,center);
    } else {
      const layers=[['启动配置',C.sand],['运行依赖',C.purple],['应用代码',C.green]];
      layers.forEach(([label,c],i)=>{const y=393+i*83;z+=`<g class="p-image-layer" data-layer="${i}">${path(`M720 ${y}l150-57 150 57 -150 57Z`,c,1.8)}${t(870,y+8,label,28,c,center)}</g>`});
      z+=t(870,730,'镜像',34,C.ink,center)+t(870,769,'环境的可复用定义',24,C.muted,center);
      z+=path('M1035 553H1180V466H1300 M1180 553V696H1300',C.line,2);
      if(s>=2){
        z+=`<g class="p-container-clone" data-clone-from="-480,-30">${cube(1465,405,118,C.green,'容器 A')}</g>`;
        z+=`<g class="p-container-clone" data-clone-from="-480,-240">${cube(1465,680,118,C.green,'容器 B')}</g>`;
        z+=at(1190,t(1710,515,'进程已启动',24,C.green,center))+at(1490,t(1710,745,'进程已启动',24,C.green,center));
        if(s===2)z+=mono(220,840,'$ docker run ai-service:demo',26,C.green);
      }else{z+=cube(1465,550,118,C.green,'可重复启动')}
      z+=path('M1240 870H1800',C.line,3)+t(1520,915,'共享宿主机内核',27,C.muted,center);
      z+=path('M1465 590V856 M1465 820V856',C.line,1.5);
      if(s===3){
        z+=chip(365,707,175,C.orange,'GPU');
        z+=path('M465 707H650V820H1240',C.orange,2.5);
        z+=t(365,844,'驱动与设备接入',29,C.orange,center);
        z+=t(365,892,'仍需与运行库兼容',25,C.muted,center);
        z+=route('gpu-device-access',[[468,707],[650,707],[650,820],[1235,820]],C.orange,{duration:4300});
      } else {
        z+=path('M220 463H622 M220 550H622 M220 637H622',C.line,1.5);
        z+=mono(220,433,'code/',30,C.green)+mono(220,520,'dependencies',30,C.purple)+mono(220,607,'entrypoint',30,C.sand);
        z+=route('package-layer',[[335,550],[620,550],[870,550]],C.purple,{duration:3800});
      }
      z+=mono(1180,355,'模型权重可外置挂载',23,C.muted,center);
    }
    return base('S24',s,'docker-scene',svg(z),heading('运行环境','Docker 镜像与容器',s===0?'另一台机器缺少依赖时，同样的代码也可能启动失败。':s===3?'GPU 容器需要兼容的驱动和设备访问权限。':'容器是用镜像启动的运行实例。'),'模型权重可以放进镜像，也可以从外部存储挂载或下载。');
  }
  function nodeRack(x,y,label,s,index) {
    let z=path(`M${x} ${y}h520v333H${x}Z`,C.line,1.5)+t(x,y-30,label,31,C.ink);
    z+=path(`M${x+22} ${y+285}H${x+498}`,C.line,2);
    z+=chip(x+135,y+204,130,C.green,'GPU')+mono(x+345,y+205,'CPU / RAM',25,C.muted,center);
    if(s>=1){
      z+=`<g class="p-runtime ${index?'p-replacement':''}" data-replica="${index}" data-replica-state="ready">${rect(x+34,y+28,450,92,'#242b22')}${t(x+60,y+68,'容器工作负载',26,C.green)}${mono(x+60,y+103,s>=2?'Ray Worker '+index:'model-server',24,s>=2?C.purple:C.muted)}</g>`;
    }
    return z;
  }
  function schedulingLayers(beat) {
    const layers=[
      ['Kubernetes','Pod → 节点','为容器选运行位置，控制器维持服务副本',C.green],
      ['Ray','Task / Actor → Worker','在集群里安排程序的分布式工作',C.purple],
      ['推理引擎','请求 / Token → 本轮批次','在引擎内部决定 GPU 这一轮计算什么',C.orange],
    ];
    const active = ['S25.3', 'S25.8', 'S25.9'].indexOf(beat.id);
    const objects = ['Pod', 'Task', 'Token'];
    let z='';
    for(const [i,[name,work,detail,color]] of layers.entries()){
      const y=445+i*178;
      z+=path(`M120 ${y+77}H1785`,C.line,1.5);
      z+=dot(135,y-11,7,color)+t(170,y,name,38,color)+t(645,y,work,37,C.ink)+t(645,y+52,detail,27,C.muted);
      const from = 1195, to = 1680;
      z += path(`M${from} ${y-20}H${to}`, i === active ? color : C.line, 2) + dot(to,y-20,7,color);
      if (i === active) z += route('dispatch-'+objects[i],[[from,y-20],[to,y-20]],color,{duration:1050,label:objects[i],once:true});
    }
    return base('S25',3,'orchestration-scene',svg(z),heading('集群部署','三种调度各管什么？','从节点上的容器，到 GPU 上的一轮计算。'),
      '一种组合部署示意。推理服务可按部署需要选择是否使用 Kubernetes 或 Ray。');
  }
  function orchestration(s,beat) {
    if(s===3)return schedulingLayers(beat);
    let z=nodeRack(532,493,'节点 0',s,0)+nodeRack(1183,493,'节点 1',s,1);
    z+=t(532,873,'计算资源分布在不同节点',28,C.muted);
    if(s===1){
      z+=path('M1024 324V400H760V490 M1024 400H1425V490',C.green,2,'stroke-dasharray="7 7"');
      z+=`<circle cx="1024" cy="292" r="44" fill="#1e261c" stroke="${C.green}" stroke-width="1.5"/>`;
      for(let i=0;i<6;i++){const a=i*Math.PI/3;z+=path(`M1024 292L${1024+Math.cos(a)*29} ${292+Math.sin(a)*29}`,C.green,2)}
      z+=t(1094,290,'Kubernetes',37,C.green)+t(1094,329,'放置、资源、副本与故障恢复',25,C.muted);
      z+=route('orchestrate-placement',[[1024,341],[1024,400],[1425,400],[1425,493]],C.green,{duration:4200});
    }
    if(s===1){
      z+=at(550,t(532,950,'节点 1 上的 Pod 被删除',26,C.orange)+path('M827 939H1045',C.line,2))+
        at(2850,t(1090,950,'控制器补起一个副本，恢复到 2 个',26,C.green));
      z+=`<g data-platform-failed opacity="0">${rect(1217,521,450,92,'#362722')}${t(1245,578,'Pod 被删除 · 正在补齐',29,C.orange)}</g>`;
    }
    if(s>=2){
      z+=t(110,520,'Ray',57,C.purple)+t(110,567,'分发任务',28,C.muted);
      z+=path('M293 610H485V567H565 M485 610V924H1438V614',C.purple,2);
      for(let i=0;i<4;i++)z+=route('ray-task',i%2?[[310,610],[485,610],[485,924],[1438,924],[1438,615]]:[[310,610],[485,610],[485,567],[565,567]],i%2?C.orange:C.purple,{duration:5200,delay:i*950,label:String(i+1)});
      z+=t(1000,964,'任务分配到 Worker；引擎内部的组批仍由推理系统负责。',24,C.muted,center);
    }else{
      z+=t(110,520,s===0?'多个节点':'维持设定的',44,C.ink)+t(110,577,s===0?'组成集群':'副本数量',44,C.ink);
      z+=t(110,666,s===0?'节点可以是机器或计算实例。':'目标：两个副本保持运行。',26,C.muted);
    }
    return base('S25',s,'orchestration-scene',svg(z),heading('集群部署','集群里的容器和任务','节点提供运行容器和程序的资源。'));
  }
  function replica(x,y,label,color=C.green,sharded=false) {
    let z=chip(x,y,175,color,sharded?'分片':'MODEL');
    z+=label.startsWith('服务副本')?t(x+140,y-39,label,30,color):t(x,y-132,label,30,color,center);
    for(let i=0;i<(sharded?4:8);i++)z+=rect(x-77+i*20,y+107,14,26,color);
    z+=t(x,y+183,sharded?'部分参数 / 状态':'完整权重 · 独立缓存',25,C.muted,center);
    return z;
  }
  function replicas(s) {
    let z=path('M341 562H450V416H622 M450 562V740H622',C.line,2.5);
    z+=`<circle cx="283" cy="562" r="57" fill="#20271e" stroke="${C.green}" stroke-width="2"/>`;
    z+=t(283,539,'分流',28,C.green,center)+t(283,678,'负载均衡',29,C.ink,center);
    z+=replica(735,416,'服务副本 1')+replica(735,740,'服务副本 2',C.purple);
    if(s>=1){
      [['A',C.green,0],['B',C.purple,650],['C',C.orange,1300]].forEach(([label,c,delay])=>z+=route('request-'+label,label==='B'?[[130,562],[450,562],[450,740],[620,740]]:[[130,562],[450,562],[450,416],[620,416]],c,{duration:4200,delay,label}));
      z+=mono(939,410,'A · C',28,C.green)+mono(939,735,'B',28,C.purple);
    }else{
      z+=route('independent-replica',[[130,562],[450,562],[450,416],[620,416]],C.green,{duration:4200});
    }
    if(s<2){
      z+=t(1220,430,'两个独立的',67,C.ink)+t(1220,520,'服务副本',67,C.ink);
      z+=t(1220,638,'请求留在选中的副本上，',28,C.muted)+t(1220,686,'继续使用同一份缓存状态。',28,C.muted);
      z+=mono(1220,820,'2 个完整模型副本',28,C.green);
    } else if(s===2){
      z+=path('M1103 335V929',C.line,1.5);
      z+=replica(1295,591,'GPU 0',C.orange,true)+replica(1655,591,'GPU 1',C.orange,true);
      z+=path('M1400 590H1548',C.orange,2.5)+path('M1416 602l-14-12 14-12 M1532 578l14 12-14 12',C.orange,2.5);
      z+=route('model-parallel-exchange',[[1403,590],[1545,590]],C.orange,{duration:1600});
      z+=t(1475,370,'两张 GPU 执行同一模型',36,C.orange,center)+t(1475,858,'一个服务副本可以包含多张 GPU。',26,C.muted,center);
    } else {
      z+=path('M1014 570H1317',C.line,2.5);
      z+=`<g class="p-new-replica" data-replica="new" data-replica-state="ready">${replica(1542,598,'新服务副本',C.orange)}</g>`;
      z+=rect(1355,834,375,7,'#32392e')+rect(1355,834,375,7,C.orange,'class="p-load-fill" data-target-width="375"');
      z+=mono(1355,878,'加载模型',24,C.muted)+t(1730,878,'READY',24,C.green,'class="p-mono p-ready-label" text-anchor="end"');
      z+=t(1542,386,'新副本就绪后接收请求',39,C.orange,center);
      z+=route('ready-only-request',[[1020,570],[1317,570],[1317,598],[1428,598]],C.orange,{duration:2400,delay:3000,label:'D'});
    }
    return base('S26',s,'replicas-scene',svg(z),heading('多卡部署','服务副本与模型并行',s===2?'一个副本可以跨多张 GPU 执行模型。':'负载均衡器把请求分配给不同的副本。'),'示意前提：左侧单卡可放下完整模型；不同副本各自维护执行状态和缓存。');
  }
  function concurrency() {
    const rows=[
      {name:'A',arrival:360,start:360,end:1010},
      {name:'B',arrival:505,start:505,end:1370},
      {name:'C',arrival:680,start:1010,end:1550},
    ];
    let z=path('M360 833H1710 M1694 823l16 10-16 10',C.line,2)+t(1710,882,'时间 →',26,C.muted,'text-anchor="end"');
    z+=at(5000,path('M1010 395V833',C.orange,1.5,'stroke-dasharray="7 8"')
      +t(1010,382,'A 完成，释放缓存',28,C.orange,center));
    rows.forEach(({name,arrival,start,end},i)=>{
      const y=462+i*123,delay=450+i*720;
      z+=mono(142,y+12,name,42,i===2?C.orange:C.green)+t(202,y+10,'请求',25,C.muted);
      z+=path(`M360 ${y}H1710`,C.line,1.5);
      z+=at(delay,dot(arrival,y,10,i===2?C.orange:C.green));
      if(arrival<start)z+=at(delay+330,rect(arrival,y-14,start-arrival,28,C.orange,'data-metric-span="wait"')
        +t((arrival+start)/2,y+7,'等待',22,C.dark,center));
      z+=at(i===2?5300:delay+520,rect(start,y-14,end-start,28,C.green,'data-metric-span="run"')
        +t((start+end)/2,y+7,'执行',22,C.dark,center));
    });
    z+=at(5600,t(360,932,'C 已经到达，但 A 完成后它才开始执行。',30,C.ink));
    return base('S27',3,'metrics-scene',svg(z),heading('推理性能','并发增加后，谁需要等？','此例的缓存预算刚好够 A 和 B 同时生成。'),
      '时间线为教学示意。实际延迟和吞吐量需要按相同口径测量。');
  }
  function metrics(s) {
    if(s===3)return concurrency();
    const x=[160,1178,1305,1433,1560], vals=['0','0.8','0.9','1.0','1.1'];
    let z=path('M160 500H1770',C.line,2.5)+path('M1754 491l17 9-17 9',C.line,2.5);
    z+=t(160,425,'发出请求',30,C.ink,center)+t(160,574,'0 s',27,C.muted,center);
    for(let i=0;i<5;i++){
      if(s===0 && i>=2) continue;
      const reveal=i===1&&s===0?2000:i>1&&s===1?407*(i-1):0;
      z+=`<g data-time="${vals[i]}" data-token="${i?'y'+i:'request'}" data-platform-at="${reveal}">${dot(x[i],500,i?10:7,i?C.green:C.ink)}${path(`M${x[i]} 482v36`,i?C.green:C.muted,2)}${i?mono(x[i],445,['','人工','智能','是','一类'][i],29,C.green,center)+mono(x[i],574,vals[i]+' s',25,C.muted,center):''}</g>`;
    }
    z+=path('M160 625V645H1178V625',C.orange,2)+mono(669,700,'TTFT = 0.8 s',39,C.orange,center);
    if(s>=1){
      z+=path('M1178 625V645H1560V625',C.green,2)+mono(1369,700,'0.3 s / 3',31,C.green,center);
      z+=mono(1369,744,'TPOT = 0.1 s',31,C.green,center);
    }
    if(s>=2){
      z+=path('M160 785V806H1560V785',C.purple,2)+mono(860,855,'总延迟 = 1.1 s',35,C.purple,center);
      z+=t(1330,886,'另取一个 2 秒测量窗',23,C.muted);
      [4,6].forEach((n,i)=>{
        const y=925+i*36;
        z+=mono(1330,y+6,i?'B':'A',22,C.muted);
        for(let j=0;j<n;j++)z+=at(300+j*105+i*160,rect(1367+j*26,y-11,16,16,i?C.purple:C.green));
      });
      z+=at(1120,mono(1567,947,'(4 + 6) / 2 = 5',25,C.green)+t(1567,983,'Token / 秒',24,C.muted));
    }
    z+=`<g class="p-metric-cursor" data-start-x="${s===1?1178:160}" data-end-x="${s===0?1178:1560}" data-metric="${s===0?'ttft':'latency'}">${path(`M${s===1?1178:160} 474V526`,C.orange,3)}${dot(s===1?1178:160,500,5,C.orange)}</g>`;
    const copy=heading('推理性能',s<2?'首 Token 延迟与输出间隔':'总延迟与输出吞吐量',[
      'TTFT 是客户端等到首个 Token 的时间。',
      'TPOT 是首个 Token 之后的平均输出间隔。',
      '输出吞吐量按所有请求生成的 Token 数计算。'
    ][s]);
    return base('S27',s,'metrics-scene',svg(z),copy,'客户端口径的教学示例；动画慢放，图上时间为示例数值。');
  }
  const loads=[{name:'低负载',n:2,ttft:180,tpot:30,tps:60,mem:48,q:0},{name:'中负载',n:8,ttft:260,tpot:38,tps:180,mem:68,q:1},{name:'高负载',n:24,ttft:1300,tpot:75,tps:205,mem:94,q:8}];
  function dashboard(s) {
    const n=Math.min(s,2),d=loads[n];
    const xs=[800,1220,1640],ys=[672,504,469];
    let z='';
    if(s<3){
    z+=t(795,318,'输出吞吐 / tokens·s⁻¹',25,C.green);
    z+=path('M760 756H1750 M760 367V756',C.line,1.5);
    [0,100,200].forEach(v=>{const y=756-v*1.4;z+=path(`M760 ${y}H1750`,C.line,1,'stroke-dasharray="3 10"')+mono(735,y+7,String(v),21,C.muted,'text-anchor="end"')});
    if(n>0)z+=path(xs.slice(0,n+1).map((x,i)=>`${i?'L':'M'}${x} ${ys[i]}`).join(''),C.green,3,'class="p-chart-line"');
    for(let i=0;i<3;i++)z+=`<g opacity="${i<=n?1:.2}">${dot(xs[i],ys[i],i===n?10:6,C.green)}${mono(xs[i],ys[i]-28,String(loads[i].tps),33,C.green,center)}${t(xs[i],799,loads[i].name,25,C.muted,center)}</g>`;
    z+=path(`M${xs[n]} ${ys[n]+19}V756`,C.green,1.5,'stroke-dasharray="5 7"');
    }else{
      z+=t(790,380,'TTFT 从 180 ms 升到 1,300 ms',31,C.ink);
      z+=mono(790,460,'1,300 ms',56,C.orange)+t(1100,454,'从发送到首 Token',27,C.muted);
      z+=at(430,rect(790,528,670,62,C.orange)+t(815,567,'排队 950 ms',27,C.dark));
      z+=at(940,rect(1460,528,247,62,C.green)+t(1480,567,'其余 350 ms',25,C.dark));
      z+=at(930,t(790,644,'排队占了近四分之三，先查请求为何进不来。',27,C.ink));
      z+=at(1300,t(790,712,'核对可分配的 KV 块与每轮 Token 预算',26,C.purple));
      z+=at(2460,t(790,772,'流量超出处理能力 → 限流或加副本',26,C.green));
      z+=at(2900,t(790,810,'影响了多少人？看请求吞吐和长尾，再查日志、Trace。',24,C.muted));
    }
    z+=t(806,848,'等待队列',26,s===3?C.orange:C.muted);
    for(let i=0;i<8;i++){
      const x=810+i*52;
      z+=rect(x,884,36,36,'#2c3329',`data-queue-slot="${i}" data-occupied="${i<d.q}"`);
      if(i<d.q)z+=at(s===3?0:400+i*135,rect(x,884,36,36,C.orange)+mono(x+18,910,String(i+1),18,C.dark,center));
    }
    z+=t(1320,848,'显存占用',26,s===3?C.orange:C.muted)+rect(1320,884,380,33,'#2c3329')+rect(1320,884,380*d.mem/100,33,C.purple,`data-memory-percent="${d.mem}"`);
    z+=path('M1700 871V929',C.purple,2)+mono(1735,909,d.mem+'%',27,C.purple);
    const stats=`<div class="p-load-state" data-load="${n}" data-concurrency="${d.n}"><span>${d.name}</span><strong>${d.n}<small>并发</small></strong><p>${s===0?'用户反馈：开始回答变慢了。':s===1?'吞吐提高，等待略有增加。':s===2?'吞吐趋平，队列明显变长。':'拆开首 Token 前的时间。'}</p><dl><div><dt>TTFT</dt><dd data-metric="ttft">${d.ttft}<small>ms</small></dd></div><div><dt>TPOT</dt><dd data-metric="tpot">${d.tpot}<small>ms</small></dd></div></dl></div>`;
    if(s<3&&d.q)z+=route('queue-pressure',[[721,904],[809,904]],C.orange,{duration:780,once:true});
    return base('S28',s,'dashboard-scene',svg(z),heading('监控示例',s===3?'首 Token 前<br>时间花在哪？':'回答为何<br>开始得更慢？','同一模型、硬件和请求长度，逐步增加并发。')+stats,'教学模拟数据。左侧延迟指标从客户端计时，右侧队列和显存来自服务端。');
  }
  function journey(s) {
    if(s===3)return journeyAtlas();
    const request=window.COURSE.slides.find(slide=>slide.id==='S29').demo;
    const opening=window.COURSE.slides.find(slide=>slide.id==='S01').demo;
    const count=1+opening.otherQuestions.length;
    const focus=Number(request.id);
    const captions=[
      ['第五条请求进入等待队列','开头的 12 条请求 · 单卡示意'],
      ['轮到第五条，GPU 处理输入','Prefill 建立后续生成要用的缓存'],
      ['回答回到聊天窗口','Decode 读取已有缓存，处理新位置'],
    ];
    let z='';
    if(s===0 || s===2){
      const width=s===0?510:605;
      z+=rect(100,380,width,439,'#191e19','stroke="#424c40" rx="12"');
      z+=dot(131,421,6,C.orange)+t(155,429,'聊天机器人',25,C.ink)+path(`M100 455H${100+width}`);
      z+=rect(132,481,width-64,66,'#2d382b','rx="9"');
      z+=t(155,524,request.question,32)+mono(width+68,524,`#${request.id}`,25,C.orange,'text-anchor="end"');
      if(s===0)z+=at(330,t(155,639,'等待回答…',27,C.muted));
      else{
        z+=at(5200,t(155,632,request.reply[0],33,C.green));
        z+=at(8500,t(155,695,request.reply[1],27,C.green));
        z+=at(12400,t(155,765,'回答完成',24,C.muted));
      }
    }
    if(s===0){
      z+=path('M610 513H690 M834 513H965',C.line,2);
      z+=dot(761,513,65,'#222b21')+mono(761,525,'API',33,C.green,center);
      z+=at(1800,t(761,628,'输入和权限检查通过',26,C.green,center));
      z+=route('request-journey',[[610,513],[706,513]],C.orange,{duration:1350,delay:350,label:request.id,once:true});
      z+=route('queue-arrival',[[817,513],[967,513],[1044,513]],C.orange,{duration:1450,delay:2200,label:request.id,once:true});
      z+=t(998,420,'等待队列',31,C.orange)+t(998,690,'GPU 1 · 可用缓存已占满',30,C.green);
      z+=path('M991 551H1765',C.line,2)+chip(1238,790,450,C.green,'');
      for(let i=1;i<=count;i++){
        const waiting=i>opening.cacheCapacity;
        const x=waiting?1044+(i-opening.cacheCapacity-1)*93:1082+(i-1)*99;
        const y=waiting?513:790;
        const card=rect(x-33,y-23,66,46,waiting?'#523624':'#34472e',`rx="5" data-request-status="${waiting?'waiting':'running'}"`)
          +mono(x,y+8,String(i).padStart(2,'0'),24,i===focus?C.orange:C.ink,center);
        z+=at(i===focus?3570:0,card);
      }
      z+=at(3960,t(998,618,`#${request.id} 等待缓存释放。`,27,C.orange));
    } else {
      const decoding=s===2;
      const cells=decoding?6:4;
      if(!decoding){
        z+=t(100,409,'第一条完成，释放缓存',30,C.orange)+path('M100 456H779',C.line,2);
        z+=route('request-journey',[[135,456],[810,456],[933,505]],C.orange,{duration:1650,delay:450,label:request.id,once:true});
        z+=t(100,556,'输入片段 · 分词示意',28,C.muted);
        request.inputTokens.forEach((word,i)=>{
          const x=100+i*152;
          z+=at(2400+i*180,rect(x,591,134,65,'#2d2737')+t(x+67,634,word,30,C.purple,center));
          z+=route('prefill-input',[[x+67,665],[x+67,728],[866,728],[866,538]],C.purple,{duration:2000,delay:3200+i*175,once:true});
        });
      }
      z+=chip(969,513,182,C.green,decoding?'Decode':'Prefill');
      z+=t(969,650,'GPU 1',26,C.green,center);
      z+=t(1265,417,'第五条请求的 KV Cache',31,C.purple);
      z+=path('M1064 513H1240 M1098 571H1240',C.line,2);
      for(let i=0;i<cells;i++){
        const x=1265+i*89;
        const filled=rect(x,485,72,61,C.purple)+mono(x+36,524,'KV',23,C.dark,center);
        z+=rect(x,485,72,61,'#282532',`data-kv-slot="${i}"`);
        if(!decoding)z+=at(5400+i*390,filled);
        else z+=`<g data-platform-window="${i<4?0:2800+(i-4)*2700},12600" opacity="0">${filled}</g>`;
      }
      if(!decoding){
        z+=at(7150,t(1265,630,'四个输入位置已处理，留下四份 KV。',26,C.muted));
        z+=at(9250,t(1265,676,'首个输出「推荐」，下一轮可以接着算。',26,C.green));
        z+=mono(969,908,'模型算子 → GPU 内核',28,C.muted,center);
      } else {
        for(const [i,delay] of [500,3200].entries()){
          z+=route('kv-history-read',[[1265,513],[1070,513]],C.purple,{duration:1250,delay,once:true});
          z+=route('kv-append',[[1070,571],[1655+i*89,571],[1655+i*89,544]],C.orange,{duration:900,delay:1900+i*2700,once:true});
          z+=route('reply-to-client',[[864,513],[775,513],[775,627],[706,627]],C.green,{duration:1450,delay:3600+i*3300,once:true});
        }
        z+=at(5400,t(1265,630,'生成继续，缓存随处理的位置增长。',26,C.muted));
        z+=at(12600,t(1265,709,'请求结束，未保留的缓存归还。',26,C.green));
        z+=path('M706 627H775V513H864',C.line,2);
      }
    }
    return base('S29',s,'journey-scene',svg(z),heading('在线推理',...captions[s]),
      '请求编号与开场对应。分词、处理轮次和缓存用量均为示意。');
  }
  function journeyAtlas() {
    const levels=[['硬件',825,C.green],['计算软件',685,C.orange],['模型执行',540,C.purple],['服务平台',390,C.green],['应用',230,C.ink]];
    let z=path('M631 230V825',C.line,2);
    levels.forEach(([name,y,color],i)=>{z+=dot(631,y,6,color)+t(674,y+8,name,27,color)+mono(600,y+7,'0'+(i+1),18,C.muted,'text-anchor="end"')});
    z+=chip(1005,825,150,C.green,'GPU 0')+chip(1315,825,150,C.green,'GPU 1');
    for(let i=0;i<4;i++)z+=path(`M1590 ${797+i*15}l55-22 55 22 -55 22Z`,C.green,1.5);
    z+=t(1645,916,'显存 / HBM',26,C.green,center);
    z+=path('M1005 926H1315',C.green,2)+t(1160,965,'设备互联 / 网络',23,C.muted,center);
    z+=mono(1050,693,'CUDA / Triton',32,C.orange,center)+mono(1538,693,'计算库 / Kernel',27,C.orange,center);
    z+=path('M1005 723V735H1315V735 M1005 735V734 M1315 735V734',C.line,1.5);
    z+=path('M1005 724V735 M1315 724V735 M1538 724V743H1395',C.orange,1.5);
    z+=t(1030,529,'Prefill',35,C.purple,center)+t(1465,529,'Decode',35,C.purple,center);
    z+=path('M1125 540H1360',C.purple,2.5)+path('M1030 558V600H1124 M1347 600H1465V558',C.purple,2);
    z+=mono(1235,642,'KV Cache',26,C.purple,center);
    for(let i=0;i<6;i++)z+=rect(1128+i*38,588,26,25,C.purple,`data-kv-slot="${i}"`);
    z+=mono(1020,397,'Docker',28,C.green,center)+mono(1325,397,'Kubernetes',28,C.green,center)+mono(1605,397,'Ray',28,C.green,center);
    z+=path('M1325 422V448H1005V488 M1325 448H1465V488',C.line,1.5,'stroke-dasharray="4 7"');
    z+=t(1067,460,'部署与资源安排',22,C.muted,center);
    z+=t(1270,235,'用户应用',36,C.ink,center)+mono(1695,313,'API',30,C.orange,'text-anchor="end"')+t(1695,465,'调度',28,C.orange,'text-anchor="end"');
    z+=path('M1380 230H1730V270 M1730 340V423 M1730 482V491H1125V510',C.orange,2.5);
    z+=path('M1538 551H1795V230H1450',C.green,2);
    z+=t(1780,625,'流式返回',24,C.green,'text-anchor="end"');
    z+=route('atlas-live-request',[[1380,230],[1730,230],[1730,491],[1125,491],[1125,510]],C.orange,{duration:4200,delay:3500,label:window.COURSE.slides.find(slide=>slide.id==='S29').demo.id,once:true});
    z+=route('atlas-stream-back',[[1540,551],[1795,551],[1795,230],[1450,230]],C.green,{duration:3500,delay:10000,once:true});
    z+=route('atlas-kv-read',[[1250,600],[1465,600],[1465,550]],C.purple,{duration:2300,delay:7700,once:true});
    z+=`<circle cx="238" cy="662" r="58" fill="#25212b" stroke="${C.purple}" stroke-width="2"/>`;
    z+=path('M215 647a31 31 0 1 1-2 34 M204 678l10 3 3-11',C.purple,2);
    z+=t(238,560,'训练（提前）',32,C.purple,center)+t(238,785,'产生模型参数',27,C.muted,center);
    z+=path('M296 662H448V585H916V540',C.purple,2,'stroke-dasharray="6 7"');
    z+=route('training-artifact',[[300,662],[448,662],[448,585],[916,585],[916,540]],C.purple,{duration:3500,label:'W',once:true});
    z+=at(13680,t(104,877,'单卡：缓存已满，第 05 条先排队',26,C.orange)+t(104,925,'双副本：第 05 条可立即执行',26,C.green));
    return base('S29',3,'journey-scene journey-atlas-scene',svg(z),heading('课程回顾','第五条为何<br>晚收到回答？','「推荐一道晚餐」'),'紫色虚线表示模型参数的交付路径，橙色线表示在线请求。');
  }
  function mount(root,step,{animate=false}={}) {
    const animations=[];
    const run=(el,frames,options)=>{if(el)animations.push(el.animate(frames,{fill:'none',...options}));};
    root.querySelectorAll('.p-travel').forEach(el=>{
      const points=el.dataset.points.split(';').map(p=>p.split(',').map(Number));
      const frames=points.map((p,i)=>({transform:`translate(${p[0]}px,${p[1]}px)`,opacity:1,offset:.05+i*.9/(points.length-1)}));
      frames.unshift({...frames[0],opacity:0,offset:0});frames.push({...frames.at(-1),opacity:0,offset:1});
      run(el,frames,{duration:+el.dataset.duration,delay:+el.dataset.delay,iterations:el.dataset.once?1:Infinity,easing:'linear',fill:'both'});
    });
    const metric=root.querySelector('.p-metric-cursor');
    if(metric && (animate || step===0)) run(metric,[
      {transform:'translateX(0)'},{transform:`translateX(${+metric.dataset.endX-+metric.dataset.startX}px)`},
    ],{duration:step===0?2000:step===1?1220:2750,fill:'forwards',easing:'linear'});
    if(animate)root.querySelectorAll('[data-platform-window]').forEach(el=>{
      const [start,end]=el.dataset.platformWindow.split(',').map(Number);
      run(el,[{opacity:1},{opacity:1}],{delay:start,duration:end-start});
    });
    if(animate || step===0)root.querySelectorAll('[data-platform-at]').forEach(el=>{
      const delay=+el.dataset.platformAt;
      if(delay)run(el,[{opacity:0},{opacity:1}],{duration:175,delay,fill:'backwards'});
    });
    const failed=root.querySelector('[data-platform-failed]');
    if(failed){
      const replaced=root.querySelector('.p-replacement');
      if(animate){
        run(replaced,[{opacity:0},{opacity:0}],{delay:550,duration:2300});
        run(failed,[{opacity:1},{opacity:1}],{delay:550,duration:2300});
      }
    }
    if(animate){
      root.querySelectorAll('.p-container-clone').forEach((el,i)=>{
        const [x,y]=el.dataset.cloneFrom.split(',');run(el,[{transform:`translate(${x}px,${y}px) scale(.5)`,opacity:0},{transform:'translate(0,0) scale(1)',opacity:1}],{duration:1300,delay:i*180,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
      });
      root.querySelectorAll('.p-image-layer').forEach((el,i)=>run(el,[{transform:`translate(${-90+i*15}px,${-50-i*20}px)`,opacity:.15},{transform:'translate(0,0)',opacity:1}],{duration:950,delay:i*130,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
      const fill=root.querySelector('.p-load-fill');
      run(fill,[{width:'0px'},{width:(fill?.dataset.targetWidth||375)+'px'}],{duration:2600,easing:'linear'});
      run(root.querySelector('.p-ready-label'),[{opacity:0,offset:0},{opacity:0,offset:.66},{opacity:1,offset:.68},{opacity:1,offset:1}],{duration:4000,fill:'backwards'});
      run(root.querySelector('.p-new-replica'),[{opacity:.22},{opacity:1}],{duration:2700});
      const chart=root.querySelector('.p-chart-line');if(chart){const length=chart.getTotalLength();run(chart,[{strokeDasharray:String(length),strokeDashoffset:String(length)},{strokeDasharray:String(length),strokeDashoffset:'0'}],{duration:1700,easing:'ease-out'})}
    }
    return animations;
  }
  window.CourseScenes ||= {};
  const pages={S23:api,S24:docker,S25:orchestration,S26:replicas,S27:metrics,S28:dashboard,S29:journey};
  Object.entries(pages).forEach(([id,render])=>{window.CourseScenes[id]={render,mount}});
})();
