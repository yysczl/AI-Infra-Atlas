/* A 32-cell budget and a timed transfer cycle; quantities are teaching units. */
(() => {
  'use strict';
  const ink = '#f2efe7', muted = '#92958e', sage = '#bed6ae', orange = '#ed8254', sand = '#ded0ae';
  const text = (x,y,s,size=26,color=ink,extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${s}</text>`;
  const tile = (x,y,color,key,depth=20,extra='') => `<g class="memory-tile" data-cell="${key}" ${extra}>
    <path d="M${x-35},${y+15} l35,15 35,-15 v${depth} l-35,15 -35,-15Z" fill="${color}" opacity=".36"/>
    <path d="M${x},${y} l35,15 -35,15 -35,-15Z" fill="${color}" stroke="#101113" stroke-width="1.2"/>
    <path d="M${x},${y+30} v${depth}" stroke="#101113" stroke-width="1" opacity=".65"/>
  </g>`;
  function array(step, compact=false) {
    const filled = step===0 ? 20 : 32;
    let z = `<g class="memory-array" ${compact?'transform="translate(-100 30) scale(.68)"':''}>
      <path d="M1120 320 L1770 580 L1430 720 L780 460Z" fill="#202420"/>
      <path d="M780 460 L1430 720 L1770 580 L1770 612 L1430 752 L780 492Z" fill="#161b17" stroke="#3c443a" stroke-width="1.5"/>
      <path d="M796 479 L1430 734 L1754 600" fill="none" stroke="#718267" stroke-width="1.5"/>
      ${text(1125,293,'GPU 显存',19,muted,'letter-spacing="4"')}`;
    for(let r=0;r<4;r++) for(let c=0;c<8;c++) {
      const i=r*8+c, x=1120+c*79-r*79, y=337+c*32+r*32;
      const color=i<20?sage:i<28?orange:sand;
      z+=tile(x,y,i<filled?color:'#343c32',i,i<filled?26:3,`data-occupied="${i<filled}" data-runtime="${i>=20}"`);
    }
    z+=`<path d="M1430 783 v21 M780 523 v21 M780 539 L1430 800" fill="none" stroke="#626b5c"/>`;
    z+=text(1020,690,'32 个容量单位',23,muted,'transform="rotate(22 1020 690)"');
    if(step>=1) {
      z+=`<g class="memory-overflow">`;
      for(let i=0;i<4;i++)z+=tile(1640+i*52,770+i*21,orange,'overflow'+i,24);
      z+=`<path d="M1600 760 l-36,-16 m10,-13 l-14,30" stroke="${orange}" stroke-width="3"/>`;
      z+=text(1530,890,'申请失败 · OOM',27,orange)+`</g>`;
    }
    return z+'</g>';
  }
  function capacity(step) {
    return `<section class="memory-scene capacity-scene" data-scene="capacity" data-step="${step}">
      <div class="memory-eyebrow"><span>AI INFRA <i>/</i> 入门课</span><span>02 — ${COURSE.chapters[1]}</span><span data-course-folio></span></div>
      <div class="memory-heading"><span class="memory-index">01 / 容量</span><h1>显存容量</h1><p>权重和运行数据都占用显存。</p></div>
      <div class="memory-budget"><strong>${step===0?'20':'32'}<small> / 32</small></strong><span>已占用 / 总容量 · 示意单位</span></div>
      <div class="memory-legend"><div><b style="background:${sage}"></b>模型权重 <em>20</em></div><div class="${step===0?'not-yet':''}"><b style="background:${orange}"></b>KV Cache <em>8</em></div><div class="${step===0?'not-yet':''}"><b style="background:${sand}"></b>临时空间 <em>4</em></div></div>
      <svg class="memory-visual" viewBox="0 0 1920 1080" aria-hidden="true">${array(step)}</svg>
      <div class="memory-takeaway"><span>${step===0?'留出运行空间':'容量耗尽'}</span><p>${step===0?'剩余容量留给缓存和临时数据。':'请求增多或上下文变长时，缓存通常会增大。'}</p></div>
      <div class="memory-footnote">每格代表等量存储空间；占比为教学示意，非特定模型配置。</div>
    </section>`;
  }
  function device(x,y,scale=1) {
    let z=`<g transform="translate(${x} ${y}) scale(${scale})">`;
    for(let j=3;j>=0;j--)z+=`<path d="M0 ${j*14} l100,-40 100,40 -100,40Z" fill="${j===0?'#bed6ae':'#414b3d'}" stroke="#111512" stroke-width="2"/>`;
    return z+text(100,140,'显存',28,ink,'text-anchor="middle"')+'</g>';
  }
  function compute(x,y) {
    let z=`<g transform="translate(${x} ${y})"><path d="M-18 -18 H218 V218 H-18Z" fill="#1b201c"/>`;
    for(let r=0;r<4;r++)for(let c=0;c<4;c++)z+=`<rect class="memory-alu" x="${c*52}" y="${r*52}" width="43" height="43" rx="1" fill="${sage}" opacity=".18"/>`;
    for(let j=0;j<12;j++)z+=`<path d="M${j*18-1} -30 v-16 M${j*18-1} 230 v16 M-30 ${j*18-1} h-16 M230 ${j*18-1} h16" stroke="#5c6957" stroke-width="3"/>`;
    return z+text(100,287,'计算单元',28,ink,'text-anchor="middle"')+'</g>';
  }
  function bandwidth() {
    let z=device(685,455)+compute(1515,392);
    z+=`<path d="M908 488 H1465" stroke="#3d443a" stroke-width="66" fill="none"/>
      <path d="M908 488 H1465" stroke="#111612" stroke-width="60" fill="none"/>
      <path d="M908 488 H1465" stroke="#56614e" stroke-width="1" stroke-dasharray="2 12"/>
      <path d="M1192 440 v97 M1210 440 v97" stroke="${orange}" stroke-width="3"/>
      ${text(1200,397,'传输瓶颈',25,orange,'text-anchor="middle"')}
      ${text(1200,601,'每拍传输一块数据',27,muted,'text-anchor="middle"')}`;
    for(let i=0;i<3;i++)z+=`<g class="memory-packet" data-packet="${i}"><rect x="916" y="471" width="32" height="34" fill="${orange}"/><path d="M923 477 v22 M932 477 v22 M941 477 v22" stroke="#8f452d"/></g>`;
    z+=`<g class="memory-status-wait">${text(1615,354,'等数据',27,orange,'text-anchor="middle"')}</g><g class="memory-status-work" opacity="0">${text(1615,354,'计算中',27,sage,'text-anchor="middle"')}</g>`;
    z+=text(700,760,'同一时间窗',24,muted)+text(1770,760,'6 拍',24,muted,'text-anchor="end"');
    z+=`<path d="M700 800 H1770" stroke="#43483f" stroke-width="2"/>`;
    for(let i=0;i<6;i++) {
      const x=700+i*178;
      z+=`<path d="M${x} 790 v20" stroke="#858d7e"/>`;
      z+=`<rect x="${x+8}" y="825" width="124" height="14" fill="#383e34"/><rect x="${x+132}" y="825" width="46" height="14" fill="${sage}"/>`;
    }
    z+=`<path class="memory-time-cursor" d="M700 778 V850" stroke="${orange}" stroke-width="3"/>`;
    z+=text(700,886,'等待数据',23,muted)+`<path d="M840 878 h50" stroke="#383e34" stroke-width="12"/>`+text(950,886,'执行计算',23,muted)+`<path d="M1090 878 h50" stroke="${sage}" stroke-width="12"/>`;
    return `<section class="memory-scene bandwidth-scene" data-scene="bandwidth" data-step="2">
      <div class="memory-eyebrow"><span>AI INFRA <i>/</i> 入门课</span><span>02 — ${COURSE.chapters[1]}</span><span data-course-folio></span></div>
      <div class="memory-heading"><span class="memory-index">02 / 带宽</span><h1>显存带宽</h1><p>带宽 = 单位时间传输的数据量</p></div>
      <div class="memory-flow-note"><strong>数据已在显存里。</strong><p>数据送到计算单元前，<br>计算单元需要等待。</p><span>数据块等大 · 时间按“拍”计</span></div>
      <svg class="memory-visual" viewBox="0 0 1920 1080" aria-hidden="true"><g class="memory-bandwidth-camera">${z}</g></svg>
      <div class="memory-footnote">灰色时间用于等数据，浅绿色时间用于计算；节拍与占比为机制示意。</div>
    </section>`;
  }
  function compare() {
    let a='',b='';
    for(let i=0;i<32;i++)a+=`<rect x="${105+(i%8)*76}" y="${430+Math.floor(i/8)*52}" width="65" height="39" fill="${i<20?sage:i<28?orange:sand}"/>`;
    for(let i=0;i<4;i++)a+=`<rect class="memory-rejected" x="${760+(i%2)*62}" y="${490+Math.floor(i/2)*54}" width="50" height="39" fill="${orange}"/>`;
    a+=`<path d="M736 418 V638" stroke="${orange}" stroke-width="2" stroke-dasharray="6 6"/>`+text(746,397,'容量上限',22,orange);
    b+=`<path d="M1080 515 H1265" stroke="#47503f" stroke-width="3"/><path d="M1328 515 H1612 Q1692 515 1692 595 Q1692 667 1560 667 H1425 Q1345 667 1345 587 V515" stroke="${sage}" stroke-width="3" fill="none"/>`;
    b+=`<circle cx="1285" cy="515" r="22" fill="${orange}"/><path d="M1280 504 l12 11 -12 11" stroke="#191b16" stroke-width="3" fill="none"/>`;
    for(let i=0;i<3;i++)b+=`<rect class="memory-reuse" data-reuse="${i}" x="${1415+i*65}" y="495" width="40" height="40" fill="${sage}"/>`;
    b+=text(1080,463,'减少外部读取',25,orange);
    return `<section class="memory-scene compare-scene" data-scene="compare" data-step="3">
      <div class="memory-eyebrow"><span>AI INFRA <i>/</i> 入门课</span><span>02 — ${COURSE.chapters[1]}</span><span data-course-folio></span></div>
      <div class="memory-compare-heading"><span class="memory-index">03 / 对照</span><h1>显存容量不足与访存受限</h1></div>
      <div class="memory-problem first"><span>显存容量</span><h2>空间不足</h2><p>数据占用超过可用空间</p></div>
      <div class="memory-problem second"><span>显存带宽</span><h2>访存受限</h2><p>计算单元在等数据</p></div>
      <svg class="memory-visual" viewBox="0 0 1920 1080" aria-hidden="true"><path d="M966 315 V905" stroke="#363a33"/><g transform="translate(0 70)">${a}${b}</g></svg>
      <div class="memory-remedy remedy-capacity"><span>优化方向</span><p>减少数据占用<br>或分到更多设备</p></div>
      <div class="memory-remedy remedy-bandwidth"><span>优化方向</span><p>减少重复读取<br>复用已读入的数据</p></div>
      <div class="memory-footnote">HBM 强调高带宽。选硬件和做优化时，容量、带宽需要分别评估。</div>
    </section>`;
  }
  function mount(root,step,{animate=true,previousStep=null}={}) {
    const animations=[];
    const play=(el,frames,options)=>{if(el)animations.push(el.animate(frames,{fill:'none',...options}));};
    if(step<2) {
      root.querySelectorAll('[data-occupied="true"]').forEach((el,i)=>{
        if(animate && (previousStep!==0 || step===0 || el.dataset.runtime==='true'))play(el,[{transform:'translate(0,-130px)',opacity:0},{transform:'translate(0,0)',opacity:1}],{duration:850,delay:i*22,fill:'backwards',easing:'cubic-bezier(.16,1,.3,1)'});
      });
      if(step===1 && animate)play(root.querySelector('.memory-overflow'),[{transform:'translate(-35px,-18px)',opacity:0},{transform:'translate(0,0)',opacity:1},{transform:'translate(-10px,-4px)',opacity:1},{transform:'translate(0,0)',opacity:1}],{duration:1000,delay:1450,fill:'backwards',easing:'ease-out'});
    }
    if(step===2) {
      if(animate)play(root.querySelector('.memory-bandwidth-camera'),[{transform:'translate(65px,15px) scale(1.06)',opacity:.2},{transform:'translate(0,0) scale(1)',opacity:1}],{duration:1100,easing:'cubic-bezier(.16,1,.3,1)'});
      // One packet per beat. ALUs only light for the last 26% of each beat.
      root.querySelectorAll('.memory-packet').forEach((el,i)=>play(el,[{transform:'translateX(0)',opacity:0,offset:0},{transform:'translateX(0)',opacity:1,offset:.02},{transform:'translateX(505px)',opacity:1,offset:.25},{transform:'translateX(505px)',opacity:0,offset:.3333},{transform:'translateX(505px)',opacity:0,offset:1}],{duration:6000,delay:i*2000,iterations:Infinity,easing:'linear',fill:'both'}));
      root.querySelectorAll('.memory-alu').forEach((el,i)=>play(el,[{opacity:.16,offset:0},{opacity:.16,offset:.73},{opacity:1,offset:.75},{opacity:1,offset:.95},{opacity:.16,offset:1}],{duration:2000,iterations:Infinity,delay:(i%4)*14}));
      play(root.querySelector('.memory-status-wait'),[{opacity:1,offset:0},{opacity:1,offset:.73},{opacity:0,offset:.75},{opacity:0,offset:.97},{opacity:1,offset:1}],{duration:2000,iterations:Infinity});
      play(root.querySelector('.memory-status-work'),[{opacity:0,offset:0},{opacity:0,offset:.73},{opacity:1,offset:.75},{opacity:1,offset:.97},{opacity:0,offset:1}],{duration:2000,iterations:Infinity});
      play(root.querySelector('.memory-time-cursor'),[{transform:'translateX(0)'},{transform:'translateX(1070px)'}],{duration:12000,iterations:Infinity,easing:'linear'});
    }
    if(step===3) {
      root.querySelectorAll('.memory-rejected').forEach((el,i)=>play(el,[{opacity:.3},{opacity:1},{opacity:.3}],{duration:2600,delay:i*100,iterations:Infinity}));
      root.querySelectorAll('.memory-reuse').forEach((el,i)=>play(el,[{transform:'translate(0,0)',offset:0},{transform:`translate(${170-i*30}px,0)`,offset:.3},{transform:`translate(${170-i*30}px,130px)`,offset:.5},{transform:`translate(${-50-i*35}px,130px)`,offset:.8},{transform:'translate(0,0)',offset:1}],{duration:4000,delay:i*270,iterations:Infinity,easing:'ease-in-out'}));
    }
    return animations;
  }
  window.PilotScenes ||= {};
  window.PilotScenes.memory={render:step=>step<2?capacity(step):step===2?bandwidth():compare(),mount};
})();
