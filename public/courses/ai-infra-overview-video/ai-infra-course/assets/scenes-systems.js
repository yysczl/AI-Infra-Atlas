/* The added scenes use one frame per cue. Motion always settles to the same frame. */
(() => {
  'use strict';
  const {esc, rect, arrow} = Diagrams;
  const ink = '#f2efe7', muted = '#a5ae9e', faint = '#586153', edge = '#38443a';
  const green = '#bddaa2', orange = '#f3a076', purple = '#c9afea', blue = '#9bbde4';
  const text = (x, y, value, size = 29, color = ink, anchor = 'start') =>
    `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${esc(value)}</text>`;
  const center = (x, y, value, size, color) => text(x, y, value, size, color, 'middle');
  const path = (d, color = edge, width = 2, dash = '') =>
    `<path d="${d}" stroke="${color}" stroke-width="${width}" stroke-dasharray="${dash}" fill="none"/>`;
  const dot = (x, y, color = green, radius = 8) => `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}"/>`;
  const box = (x, y, w, h, color = edge) => rect(x, y, w, h, '#181e1a', color, 12);
  const pill = (x, y, w, label, color = green) =>
    rect(x, y, w, 54, color + '22', color, 8) + center(x + w / 2, y + 36, label, 26, color);
  const appear = (body, delay = 0) => `<g data-systems-enter="${delay}">${body}</g>`;
  const move = (points, label = '', color = orange, delay = 0) =>
    `<g data-systems-route="${points.map(p => p.join(',')).join(';')}" data-delay="${delay}" opacity="0">${label ? pill(-65, -27, 130, label, color) : dot(0, 0, color)}</g>`;
  const block = (x, y, w, label, detail, color = green) =>
    box(x, y, w, 112, color) + center(x + w / 2, y + 47, label, 32, color) +
    center(x + w / 2, y + 86, detail, 23, muted);

  function mount(root) {
    const effects = [];
    for (const item of root.querySelectorAll('[data-systems-enter]')) {
      effects.push(item.animate([{opacity: 0}, {opacity: 1}], {
        delay: +item.dataset.systemsEnter, duration: 280, fill: 'backwards',
      }));
    }
    for (const item of root.querySelectorAll('[data-systems-route]')) {
      const points = item.dataset.systemsRoute.split(';');
      const keyframes = points.map((point, i) => {
        const [x, y] = point.split(',');
        return {transform: `translate(${x}px,${y}px)`, opacity: i ? 1 : 0};
      });
      keyframes.push({...keyframes.at(-1), opacity: 0});
      effects.push(item.animate(keyframes, {
        duration: 1150, delay: +item.dataset.delay,
      }));
    }
    return effects;
  }

  function atlas(step, beat) {
    const order = [0, 4, 5, 1, 6, 7, 2, 8, 3, 9];
    const selected = order.indexOf(+beat.id.split('.')[1]);
    const active = [0, 0, 0, 1, 2, 2, 3, 3, 4, 5][selected];
    const rows = [
      ['硬件', ['计算设备', 'CPU · GPU · NPU'], ['存放数据', 'SSD · DDR · HBM'], ['设备互联', 'PCIe · NVLink · InfiniBand']],
      ['设备接入', ['管理设备', '操作系统 · GPU 驱动'], ['调用和开发（NVIDIA）', 'CUDA Runtime / Toolkit'], ['开放设备权限', '容器运行时']],
      ['计算与通信', ['编写内核', 'CUDA C++ · Triton'], ['调用现成算子', 'cuBLAS · cuDNN'], ['跨 GPU 交换数据', 'NCCL']],
      ['模型执行', ['构建模型', 'PyTorch · HF Transformers'], ['组织多卡训练', 'DeepSpeed · Megatron-LM'], ['组织推理', 'vLLM · SGLang · TensorRT-LLM']],
      ['集群与服务', ['打包与管理副本', 'Docker · Kubernetes'], ['分发程序任务', 'Ray'], ['接入并分流', '应用 → API / 负载均衡 → 副本']],
    ];
    const colors = [blue, purple, orange, green, blue];
    let art = path('M24 49V465', faint, 2);
    rows.forEach(([label, ...parts], i) => {
      const y = i * 104, color = i === active ? colors[i] : i < active ? muted : faint;
      art += dot(24, y + 49, color, 7) + path(`M48 ${y + 91}H1652`);
      art += text(60, y + 60, label, 33, color);
      if (i <= active) {
        parts.forEach(([role, tools], j) => {
          if ((selected === 1 && i === 0 && j > 0) || (selected === 4 && i === 2 && j > 0) ||
              (selected === 6 && i === 3 && j > 0)) return;
          const x = [370, 770, 1170][j];
          const field = text(x, y + 35, role, 22, color) +
            text(x, y + 68, tools, 25, i === active ? ink : muted);
          art += i === active ? appear(field, j * 160) : field;
        });
      }
    });
    if (selected >= 5) {
      const ecosystems = text(60, 291, 'AMD ROCm · 昇腾 CANN', 21, selected === 5 ? orange : muted);
      art += selected === 5 ? appear(ecosystems, 500) : ecosystems;
    }
    if (active === 5) {
      let guide = path('M1680 49V541H48', purple, 2, '7 7');
      rows.forEach((_, i) => { guide += path(`M1658 ${49 + i * 104}H1680`, purple); });
      guide += text(60, 587, '贯穿各层的观测', 30, purple) +
        text(370, 587, '指标 · 发现变慢', 26, ink) +
        text(770, 587, '日志 · 核对事件', 26, ink) +
        text(1170, 587, 'Trace · 定位请求耗时', 26, ink);
      art += appear(guide, 200);
    }
    return art;
  }

  const phases = ['数据准备', '模型训练', '模型评估', '模型优化', '模型部署', '在线推理', '监控与迭代'];
  const artifacts = ['训练样本', '模型权重', '评测报告', '模型产物', '就绪副本', '报销回答', '待复核样本'];
  function lifecycle(step) {
    const xs = phases.map((_, i) => 108 + i * 244);
    let art = path(`M${xs[0]} 106H${xs.at(-1)}`, edge, 4);
    if (step > 0) art += path(`M${xs[0]} 106H${xs[step]}`, green, 4);
    phases.forEach((name, i) => {
      const color = i === step ? orange : i < step ? green : muted;
      art += dot(xs[i], 106, color, i === step ? 13 : 8) + center(xs[i], 60, name, 31, color);
      if (i <= step) art += center(xs[i], 163, artifacts[i], 26, color);
    });
    if (step) art += move([[xs[step - 1], 106], [xs[step], 106]]);
    if (step === 6) art += path(`M${xs[6]} 174V218H${xs[2]}V174`, purple, 2, '8 8');
    const samples = [
      ['训练语料', '清洗、去重、分词', '训练批次 01'],
      ['训练批次 01', 'GPU 集群更新参数', '权重 v1 + 检查点'],
      ['权重 v1', '新题：返程日遇到假期', '评测：区分工作日'],
      ['权重 v1', '转换 / 量化后再评估', '已评估模型产物'],
      ['模型产物 + 配置', '分配设备，加载权重', '就绪副本'],
      ['报销问答', '排队、组批、分配缓存', '在线输出'],
      ['延迟与错误记录', '筛出回答失败的样本', '下轮评测题'],
    ];
    const [left, operation, right] = samples[step];
    art += block(50, 325, 390, left, '输入', blue) +
      block(590, 325, 500, operation, '这一阶段的工作', orange) +
      appear(block(1240, 325, 390, right, '交给下一步', green), 900);
    art += arrow(450, 381, 577, 381, edge) + arrow(1100, 381, 1227, 381, edge);
    if (step === 1) art += appear(text(50, 527, '预训练数据 → 基础权重 → 用示范问答做监督微调', 29, purple), 1350);
    return art + move([[435, 381], [585, 381]]) + move([[1095, 381], [1235, 381]], '', green, 530);
  }

  function runtime(step) {
    const stages = [['PyTorch 进程', '发起向量加法'], ['CUDA Runtime', '申请设备内存，提交内核'],
                    ['系统与 GPU 驱动', '管理设备，执行调用'], ['GPU', '执行已编译内核']];
    let art = '';
    stages.forEach(([label, desc], i) => {
      const x = i * 430;
      art += block(x, 292, 390, label, desc, i === Math.min(step, 2) ? orange : i <= step + 1 ? green : edge);
      if (i < 3) art += arrow(x + 392, 348, x + 423, 348, i <= step ? green : edge);
    });
    if (step < 3) {
      const end = [430, 860, 1290][step];
      art += move([[end - 50, 348], [end + 20, 348]]);
      art += text(0, 488, ['准备输入和输出缓冲区', '调用运行时接口', '宿主驱动负责设备访问'][step], 30, orange);
    }
    if (step === 3) {
      art += block(0, 40, 370, 'CUDA Toolkit', '编译器和开发工具', purple) +
        arrow(387, 96, 597, 96, purple) + appear(block(610, 40, 410, '已编译内核', '可随应用交付', green), 600) +
        path('M815 156V234H195V280', purple, 2, '6 6') + move([[390, 96], [595, 96]], '', purple);
    }
    if (step === 4) {
      art += rect(-11, 224, 838, 232, 'none', purple, 14) + text(0, 200, '容器进程 · 运行库', 33, purple) +
        path('M842 190V475', faint, 2, '7 7') + text(865, 200, '宿主机 · 驱动与设备', 33, blue) +
        text(0, 527, '容器运行时按配置接入获准使用的 GPU', 32, orange) +
        move([[750, 348], [862, 348], [1280, 348]], '', orange);
    }
    return art;
  }

  function cells(x, y, count, cols, size, color, selected = -1) {
    let art = '';
    for (let i = 0; i < count; i++) {
      const c = i === selected ? orange : color;
      art += rect(x + (i % cols) * (size + 8), y + Math.floor(i / cols) * (size + 8),
        size, size, c + '32', c, 4);
    }
    return art;
  }

  function execution(step) {
    let art = '';
    if (step < 3) {
      art += text(0, 45, '向量输入', 29, muted) + cells(0, 76, 20, 20, 44, blue, 9);
      if (step === 0) {
        for (let i = 0; i < 20; i++) {
          const x = 22 + i * 52;
          art += arrow(x, 128, x, 214, i === 9 ? orange : edge);
        }
        return art + appear(cells(0, 230, 20, 20, 44, green, 9), 620) +
          text(0, 335, '每个线程找自己的元素', 33, green) + move([[490, 128], [490, 222]]);
      }
      art += box(0, 170, 1035, 355, step === 1 ? orange : edge) + text(27, 222, 'Grid · 一次 Kernel 启动', 34, orange);
      for (let i = 0; i < 4; i++) {
        const x = 25 + i * 252;
        art += block(x, 268, 224, 'Block ' + i, '线程组', i === 1 ? orange : green) + cells(x + 12, 417, 5, 5, 31, i === 1 ? orange : green);
      }
      if (step === 2) {
        art += text(1230, 45, 'GPU 上的 SM', 33, green);
        art += block(1230, 164, 420, 'SM 0', 'Block 0 · Block 2', green) +
          appear(block(1230, 386, 420, 'SM 1', 'Block 1 · Block 3', orange), 700);
        art += path('M1040 382H1135V221H1218 M1135 382V443H1218', faint, 2) +
          move([[1042, 382], [1135, 382], [1135, 443], [1218, 443]], 'Block 1');
      }
      return art;
    }
    art += box(0, 22, 1670, 505, green) + text(35, 78, 'SM 1 · 放大 Block 1', 37, green);
    for (let i = 0; i < 2; i++) {
      const y = 140 + i * 166;
      art += text(38, y + 31, 'Warp ' + i, 31, i ? muted : orange) +
        cells(256, y, 32, 16, 37, i ? blue : green, i === 0 && step >= 4 ? 9 : -1);
    }
    if (step === 3) {
      art += text(1050, 172, '32 个线程为一组', 33, orange) + move([[193, 158], [248, 158]]);
    }
    if (step === 4) {
      art += text(1050, 172, '线程 9', 32, orange) +
        appear(pill(1050, 203, 360, '数组位置 9：6 × 2 = 12', orange), 630) +
        move([[677, 160], [960, 160], [1040, 230]]);
    }
    if (step === 5) {
      art += block(1050, 137, 555, 'CUDA Core 等执行单元', '普通算术', orange) +
        appear(block(1050, 304, 555, 'Tensor Core', '支持的矩阵计算', purple), 620);
    }
    if (step === 6) {
      art += text(1050, 173, 'Warp 0：等待数据', 32, orange) +
        appear(text(1050, 339, 'Warp 1：发出下一条指令', 32, green), 580) +
        move([[220, 156], [220, 324]], '', green) +
        text(35, 480, 'Occupancy = 活跃 Warp 数 ÷ 硬件允许的最大 Warp 数', 29, muted);
    }
    return art;
  }

  function memory(step) {
    const levels = [['设备内存', 'Global Memory'], ['L2', '跨 SM 使用'], ['L1', '靠近 SM']];
    let art = box(720, 60, 945, 445, green) + text(752, 117, '一个 SM', 34, green);
    levels.forEach(([name, desc], i) => {
      const x = [0, 400, 750][i];
      art += block(x, 200, i ? 235 : 295, name, desc, i <= step ? blue : edge);
      if (i < 2) art += arrow(x + (i ? 242 : 302), 257, [390, 740][i], 257, step ? blue : edge);
    });
    if (step === 0) art += appear(pill(72, 337, 150, '输入 6', blue));
    if (step === 1) art += move([[300, 257], [398, 257], [638, 257], [744, 257]], '读取', blue);
    if (step >= 2) {
      art += block(1050, 152, 255, '寄存器', '线程 A 的值', orange) +
        block(1370, 152, 255, '寄存器', '线程 B 的值', orange);
    }
    if (step === 2) {
      art += move([[970, 257], [1045, 213]], '值 6') + move([[970, 257], [1365, 213]], '值 4', blue, 250);
    }
    if (step >= 3) {
      art += appear(block(1140, 347, 420, '共享内存', '同一个 Block 的线程共用', purple), 320) +
        path('M1178 265V300H1497V265 M1350 300V340', purple, 2) +
        move([[975, 257], [1015, 400], [1135, 400]], '输入块', purple);
    }
    if (step === 4) {
      art += path('M1350 510V553H145V321', green, 2) + move([[1350, 511], [1350, 553], [145, 553], [145, 321]], '结果', green);
    }
    return art;
  }

  function training(step) {
    const inputs = ['训练作业', '数据分片', '本地梯度', '求和 AllReduce', '同步更新', '保存进度', '恢复训练'];
    let art = text(0, 54, inputs[step], 36, orange);
    const left = 360, right = 1040;
    if (step === 0) {
      art += block(0, 220, 365, '作业队列', '等待两张 GPU', orange) +
        arrow(378, 276, 580, 276, edge) +
        appear(block(600, 220, 390, '集群调度', '分到一组设备', blue), 360) +
        arrow(1004, 276, 1210, 276, edge) +
        appear(block(1225, 220, 405, '启动训练进程', 'GPU 0 和 GPU 1', green), 850);
      return art + move([[380, 276], [595, 276], [1215, 276]], '训练作业');
    }
    art += path('M210 210H299V430H210 M299 210H343 M299 430H343', edge, 2);
    const state = [
      [], ['批次 A', '批次 B'], ['本地梯度 2', '本地梯度 6'],
      ['归约结果 8', '归约结果 8'], ['用平均梯度 4 更新', '用平均梯度 4 更新'],
      ['权重与优化器状态', '权重与优化器状态'], ['载入进度 1200', '新节点 · 恢复到 1200'],
    ][step];
    art += block(0, 264, 220, '数据存储', '加载与预处理', blue);
    state.forEach((value, i) => {
      const y = 150 + i * 220;
      art += box(left, y, 425, 128, i === 1 && step === 6 ? orange : green) +
        text(left + 24, y + 48, i === 1 && step === 6 ? '替换后的 GPU 1' : 'GPU ' + i, 30, green) +
        appear(text(left + 24, y + 96, value, 30, step === 2 ? orange : ink), step === 3 ? 900 : i * 260);
      if (step === 1) art += move([[220, 322], [299, 322], [299, y + 60], [left, y + 60]], '批次 ' + (i ? 'B' : 'A'), blue, i * 180);
      if (step === 3) {
        art += path(`M785 ${y + 64}H913V325H1030`, purple, 2);
        art += move([[790, y + 64], [913, y + 64], [1030, 325]], i ? '梯度 6' : '梯度 2', purple, i * 110);
        art += move([[1040, 343], [940, 343], [940, y + 86], [790, y + 86]], '结果 8', green, 730 + i * 110);
      }
    });
    if (step === 2) art += text(1060, 324, '每张卡先独立计算', 34, orange);
    if (step === 3) art += block(right, 270, 515, 'NCCL 通信 · 求和', '每张卡得到 2 + 6 = 8', purple);
    if (step === 4) art += block(right, 270, 515, '两份副本同步', '等量批次示例 · 8 ÷ 2 = 4', green);
    if (step >= 5) {
      art += block(right, 270, 515, 'Checkpoint · 步 1200', '持久存储中的最近完整版本', purple) +
        path('M790 213H940V326H1030 M790 433H940V326', purple, 2);
      art += step === 5
        ? move([[790, 213], [940, 213], [940, 326], [1030, 326]], '保存', purple)
        : move([[1030, 326], [940, 326], [940, 433], [790, 433]], '恢复', orange);
    }
    return art;
  }

  function transformer(step) {
    const names = ['输入文本', 'Tokenizer', 'Token ID', 'Embedding', 'Transformer', 'LM Head', 'Logits', 'Sampling', 'Detokenization'];
    const active = [3, 4, 4, 4, 4, 6, 7, 8][step];
    let art = '';
    names.forEach((name, i) => {
      const x = 83 + i * 186, color = i === active ? orange : i < active ? green : muted;
      art += center(x, 45, name, 24, color) + dot(x, 79, color, i === active ? 9 : 5);
      if (i < names.length - 1) art += path(`M${x + 15} 79h156`, i < active ? green : edge);
    });
    if (step === 0) {
      const parts = [
        ['什么是人工智能？', '输入文字'], ['什么 / 是 / 人工 / 智能 / ？', '分词'],
        ['… 106 …', '编号'], ['[0.6, 0.3, …]', '向量'],
      ];
      parts.forEach(([name, desc], i) => {
        art += appear(block(i * 425, 230, 394, name, desc, i === 3 ? orange : green), i * 280);
        if (i < 3) art += arrow(i * 425 + 398, 286, i * 425 + 421, 286, edge);
      });
      return art + text(0, 440, '切分、编号与向量取值为示意', 26, muted);
    }
    if (step <= 4) {
      art += box(0, 146, 1668, 394, edge) + text(27, 195, '放大一个 Transformer Block', 34, ink);
      art += pill(28, 280, 165, '输入向量', blue) + path('M201 308H290', blue);
      const qkv = ['Q', 'K', 'V'];
      qkv.forEach((name, i) => {
        const y = 222 + i * 82;
        art += path(`M210 307H245V${y + 27}H275`, edge) + appear(pill(278, y, 132, name, [orange, purple, green][i]), i * 140);
        if (step >= 2) art += path(`M412 ${y + 27}H460V307H508`, edge);
      });
      if (step >= 2) {
        art += appear(block(520, 250, 344, '多头注意力', '并行计算，再合并', green), 450);
        art += text(297, 512, 'RoPE 用于 Q / K', 24, purple);
      }
      if (step >= 3) {
        art += arrow(874, 306, 1024, 306, green) + appear(block(1035, 250, 410, 'MLP / FFN', '逐位置变换向量', orange), 550) +
          arrow(1455, 307, 1610, 307, edge) + move([[875, 306], [1025, 306]]);
      }
      if (step === 4) {
        art += path('M470 308V430H950V309 M980 308V460H1512V308', purple, 3) +
          dot(950, 308, purple, 11) + dot(1512, 308, purple, 11) +
          text(600, 423, '残差相加', 25, purple) + text(1110, 451, '残差相加', 25, purple) +
          text(520, 231, '归一化', 24, blue) + text(1040, 231, '归一化', 24, blue);
      }
      return art;
    }
    if (step >= 5) {
      const candidates = ['人工', '这个', '一种', '机器', '其他'];
      const values = step === 5 ? [4.2, 3.5, 2.7, 1.8, 0.8] : [52, 26, 12, 7, 3];
      art += block(0, 222, 390, '末尾位置的表示', '经过所有 Transformer 层', green) +
        arrow(397, 278, 559, 278, green) + block(570, 222, 380, 'LM Head', '映射到词表', purple);
      art += text(1050, 159, step === 5 ? '词表中的部分 Logits' : '概率分布 · 示例', 31, orange);
      candidates.forEach((name, i) => {
        const y = 196 + i * 68, color = step === 7 && i === 0 ? orange : step >= 6 && i > 2 ? faint : green;
        const width = values[i] * (step === 5 ? 80 : 7);
        art += text(1050, y + 29, name, 25, color) + appear(rect(1140, y, width, 41, color + '50', color, 5), i * 80) +
          text(1155 + width, y + 29, values[i] + (step === 5 ? '' : '%'), 24, color);
      });
      if (step === 5) art += move([[400, 278], [560, 278], [960, 278]]);
      if (step === 6) {
        art += text(0, 402, '调温度：改变候选间的概率差异', 28, muted);
        [[65, 30, 15], [44, 33, 27]].forEach((bars, i) => {
          const x = i * 435;
          bars.forEach((height, j) => {
            art += appear(rect(x + j * 59, 514 - height, 42, height, purple + '44', purple, 4), i * 350 + j * 90);
          });
          art += text(x + 196, 500, i ? '较高温度' : '较低温度', 26, purple);
        });
        art += text(1050, 566, 'Top-k = 3 或 Top-p = 0.9 · 保留前三项', 26, muted);
      }
      if (step === 7) {
        art += appear(block(0, 397, 430, '选中 Token：人工', '解码成可以显示的文字', orange), 600) +
          path('M1080 470V554H225V512', orange, 2) + move([[1080, 474], [1080, 554], [225, 554], [225, 516]]);
      }
    }
    return art;
  }

  function heads(step) {
    const n = [4, 4, 2, 1][step];
    let art = text(0, 54, '4 个查询头', 35, orange) + text(0, 293, n + ' 组 K / V', 35, purple);
    for (let i = 0; i < 4; i++) {
      const x = 390 + i * 298;
      art += pill(x, 80, 210, 'Q' + (i + 1), orange);
      const target = 390 + Math.floor(i / (4 / n)) * 298 + 105;
      art += arrow(x + 105, 147, target, 284, [orange, green, blue, purple][i]);
      art += move([[x + 105, 153], [target, 281]], '', [orange, green, blue, purple][i], i * 130);
    }
    for (let i = 0; i < n; i++) {
      art += pill(390 + i * 298, 300, 210, 'K' + (i + 1) + ' / V' + (i + 1), purple);
      art += appear(rect(400 + i * 298, 435, 190, 50, purple + '45', purple, 5), 520 + i * 120);
    }
    art += text(0, 466, '每个位置的 KV', 29, muted);
    return art + text(390, 548, ['查询头使用对应的键和值', 'MHA · 4 对 4', 'GQA · 4 对 2', 'MQA · 4 对 1'][step], 32, green);
  }

  function speculate(step) {
    const xs = [510, 800, 1090];
    const candidates = ['西红柿', '炒', '肉'];
    let art = text(0, 44, '候选序列示意 · 使用贪心选择', 27, muted);
    if (step === 0) {
      art += text(0, 212, '目标模型逐轮执行', 34, orange);
      xs.forEach((x, i) => {
        art += appear(block(x, 154, 245, '第 ' + (i + 1) + ' 轮', ['西红柿', '炒', '蛋'][i], green), i * 550);
        if (i < 2) art += arrow(x + 252, 210, x + 283, 210, edge);
      });
      return art + text(510, 344, '上一轮输出成为下一轮输入', 31, muted);
    }
    art += text(0, 147, '草稿模型', 34, purple);
    candidates.forEach((candidate, i) => art += appear(pill(xs[i], 109, 245, candidate, purple), i * 240));
    if (step >= 2) {
      art += box(475, 246, 910, 128, green) + text(0, 321, '目标模型', 34, green);
      xs.forEach((x, i) => {
        art += path(`M${x + 122} 168V237`, purple, 2) + move([[x + 122, 168], [x + 122, 237]], '', purple, i * 95);
        art += appear(center(x + 122, 320, '验证位置 ' + (i + 1), 28, green), 680);
      });
      art += text(1413, 321, '一次前向', 30, green);
    }
    if (step >= 3) {
      art += text(0, 465, '提交到输出', 34, orange);
      ['西红柿 ✓', '炒 ✓', '蛋 ↺'].forEach((label, i) => art += appear(pill(xs[i], 427, 245, label, i === 2 ? orange : green), 770 + i * 140));
    }
    if (step === 4) art += text(510, 550, '省下的目标模型轮次，要抵过提议与验证开销。', 29, muted);
    return art;
  }

  function deployment(step) {
    let art = '';
    if (step < 3) {
      const details = [['注册表 · v2', '可追溯产物', '取出权重、配置和分词器'],
        ['注册表 · v2', '转换或量化', '核对质量与格式后交付'],
        ['镜像与模型产物', '集群分配 GPU', '下载 / 挂载并加载']];
      const [origin, process, result] = details[step];
      art += block(0, 172, 385, origin, '准备', purple) + arrow(399, 228, 572, 228, edge) +
        block(590, 172, 438, process, '部署前的处理', blue) + arrow(1042, 228, 1180, 228, edge) +
        appear(block(1197, 172, 465, step === 2 ? 'GPU 上的权重' : '模型包', result, green), 910);
      art += move([[399, 228], [580, 228], [1190, 228]], 'v2', purple);
      if (step === 2) art += text(1197, 350, '此时尚未接入真实流量', 27, muted);
      return art;
    }
    const rollback = step === 6;
    const v1 = rollback ? '重新就绪 · 恢复接流量' : step === 5 ? '排空已有请求' : '继续接流量';
    const v2 = rollback ? '检测到异常，撤出' : step === 3 ? '预热，等待就绪' : '就绪 · 可接流量';
    art += block(0, 186, 360, '流量入口', '只转发到就绪实例', blue) +
      block(1170, 90, 495, '副本 v1', v1, step === 5 ? muted : green) +
      block(1170, 371, 495, '副本 v2', v2, rollback || step === 3 ? orange : green);
    art += path('M360 242H990V146H1150', step === 5 ? edge : green, 3, step === 5 ? '8 8' : '') +
      path('M990 242V427H1150', step === 3 || rollback ? edge : green, 3, step === 3 || rollback ? '8 8' : '');
    if (step === 3) {
      art += pill(585, 431, 340, '内部测试请求 · Warmup', purple) + path('M935 457H1160', purple, 3) +
        move([[944, 457], [1157, 457]], '预热', purple);
    } else {
      const target = rollback ? 146 : 427;
      art += move([[364, 242], [990, 242], [990, target], [1160, target]], '请求', green);
      art += appear(text(585, 523, rollback ? '错误率升高 → 回滚 v1' : step === 5 ? 'v2 接流量后，v1 排空退出' : '就绪检查通过 → 加入接流量实例', 30, rollback ? orange : green), 650);
    }
    return art;
  }

  function observability(step) {
    let art = '';
    if (step === 0) {
      art += text(0, 53, '2 秒测量窗', 35, ink);
      for (let i = 0; i < 2; i++) {
        const y = 155 + i * 140, count = i ? 6 : 4;
        art += text(0, y + 39, i ? '请求 B' : '请求 A', 31, i ? purple : green);
        for (let j = 0; j < count; j++) {
          art += appear(pill(240 + j * 145, y, 116, 'Token', i ? purple : green), j * 150 + i * 190);
        }
        art += appear(pill(1200, y, 245, '请求完成', orange), 1020 + i * 300);
      }
      return art + appear(text(0, 483, '请求吞吐 = 1 请求/秒', 36, orange) + text(735, 483, '输出吞吐 = 5 Token/秒', 36, green), 1300);
    }
    if (step === 1 || step === 2) {
      const x = 120, y = 454;
      art += path(`M${x} 113V${y}H1570`, muted, 2) +
        path('M120 245H1550', orange, 2, '8 8') + text(124, 222, '首 Token 时间目标 · 800 ms', 26, orange) +
        text(120, 505, '按 TTFT 从短到长排列请求', 26, muted) + text(0, 72, 'TTFT ↑', 26, muted);
      const samples = Array.from({length: 100}, (_, i) => [
        128 + i * 14, 438 - (i < 94 ? 30 + i * 1.4 : [190, 208, 219, 257, 285, 310][i - 94]),
      ]);
      art += appear(path(samples.map(([a, b], i) => (i ? 'L' : 'M') + a + ' ' + b).join(' '), green, 4), 300);
      [[49, 'P50', -10, 60], [94, 'P95', -125, -60], [98, 'P99', 10, -20]].forEach(([i, label, dx, dy]) => {
        const [a, b] = samples[i];
        art += dot(a, b, i === 98 ? orange : green) + text(a + dx, b + dy, label, 28, i === 98 ? orange : green);
      });
      if (step === 2) art += appear(text(180, 144, 'SLO 示例 · 至少 95% 成功且 TTFT ≤ 800 ms', 30, green) +
        text(180, 559, 'Goodput · 10 秒内 95 条达标 → 9.5 请求/秒', 29, orange), 740);
      return art;
    }
    if (step === 3) {
      const names = ['排队请求', '错误率', 'GPU 利用率', '显存占用', '显存带宽'];
      const values = ['8 个', '1.2%', '87%', '94%', '1.2 TB/s'];
      const plots = ['0,110 70,110 120,84 180,84 238,43 290,22', '0,111 75,109 132,100 176,112 225,82 290,64',
        '0,110 80,70 140,75 190,37 230,66 290,30', '0,100 45,86 112,82 171,51 239,48 290,19',
        '0,95 66,82 130,47 188,84 236,32 290,52'];
      names.forEach((name, i) => {
        const x = i * 337, color = i === 0 ? orange : green;
        art += text(x, 158, name, 32, muted) + text(x, 225, values[i], 43, color) + path(`M${x} 419h292`);
        art += appear(`<polyline transform="translate(${x} 290)" points="${plots[i]}" fill="none" stroke="${color}" stroke-width="4"/>`, i * 135);
      });
      return art + text(0, 518, 'Metrics · 同一时间窗的模拟监控读数', 30, muted);
    }
    if (step === 4) {
      art += box(0, 80, 1668, 405, edge) + text(38, 142, 'Logs · 服务事件', 37, orange);
      const rows = [['12:01:02.014', 'r-16', '请求完成'], ['12:01:02.080', 'r-17', '收到请求，进入队列'],
        ['12:01:02.096', 'r-17', '暂时无法分配 KV 块'], ['12:01:03.030', 'r-17', '分配成功，开始 Prefill']];
      rows.forEach(([time, id, event], i) => {
        const y = 211 + i * 72, color = i === 2 ? orange : muted;
        art += appear(text(38, y, time, 28, color) + text(512, y, id, 29, color) +
          text(850, y, event, 29, color) + path(`M38 ${y + 23}H1628`), i * 240);
      });
      return art;
    }
    const gpu = step === 6;
    art += text(0, 57, gpu ? 'Profiling · 执行阶段细看' : 'Trace · 请求 r-17 · 从发送到首个 Token', 33, orange);
    const segments = gpu
      ? [['读取权重', 0, 185, blue], ['注意力内核', 185, 420, purple], ['矩阵运算', 605, 280, green], ['写回', 885, 115, blue]]
      : [['网关', 0, 60, blue], ['排队', 60, 950, orange], ['Prefill 与采样', 1010, 270, purple], ['返回', 1280, 20, green]];
    const scale = gpu ? 1.3 : 1.02;
    segments.forEach(([name, offset, width, color], i) => {
      const x = 305 + offset * scale, y = 100 + i * 102;
      art += text(0, y + 43, name, 30, color) + path(`M305 ${y + 31}H1650`, edge) +
        appear(rect(x, y, width * scale, 61, color + '60', color, 5), i * 290);
      if (!gpu) art += appear(text(width < 60 ? x - 94 : x + 17, y + 42, width + ' ms', 23, width < 60 ? color : ink), i * 290);
    });
    return art + text(0, 555, gpu ? '这里切换到执行慢的另一种示意，条带是 GPU 上的计算和传输。' : '排队时间占大头，继续核对 KV 余量与调度预算。', 27, muted);
  }

  function summary(step) {
    const guide = [
      ['计算', '执行阶段慢', '分开看计算与访存', 'Prefill · Decode · GPU 内核', orange],
      ['显存', '第五条暂时放不下', '区分权重与请求缓存', '权重已加载，四条请求占满缓存预算', purple],
      ['调度', '第一条完成，缓存归还', '检查剩余资源，重新组批', '第五条进入执行', green],
      ['服务', '有另一个就绪副本', '看副本还有没有余量', '入口可把第五条分给它', blue],
      ['运维', '改动后复测', '保持请求和并发一致', 'TTFT · Token 间隔 · 错误率 · 达标数', orange],
    ];
    let art = '';
    if (step < 5) {
      art += text(215, 53, '发生了什么', 28, muted) + text(677, 53, '先看哪里', 28, muted) + text(1120, 53, '关键线索', 28, muted);
      guide.forEach(([domain, symptom, action, tools, color], i) => {
        const y = 76 + i * 103, selected = i === step;
        art += path(`M0 ${y + 84}H1660`) + text(0, y + 52, domain, 38, selected ? color : muted);
        if (i <= step) {
          art += text(215, y + 52, symptom, 29, ink) + arrow(598, y + 42, 646, y + 42, selected ? color : edge);
          const diagnosis = text(677, y + 52, action, 28, selected ? color : muted) + text(1120, y + 52, tools, 23, muted);
          art += selected ? appear(diagnosis, 460) + move([[603, y + 42], [662, y + 42]], '', color) : diagnosis;
        }
      });
      return art;
    }
    const preparation = [['数据准备', '整理训练样本'], ['训练', '更新模型权重'], ['评估', '验证模型效果'], ['部署', '加载权重并通过检查']];
    const request = [['客户端发问', '推荐一道晚餐'], ['服务入口', '发给可用副本'], ['推理引擎', '排队、组批、分配缓存'], ['GPU', 'Prefill 与 Decode'], ['流式回答', '西红柿炒蛋']];
    art += text(0, 50, '用户发问之前', 32, purple);
    preparation.forEach(([title, detail], i) => {
      const x = i * 430;
      art += appear(block(x, 78, 365, title, detail, purple), step === 5 ? i * 245 : 0);
      if (i < preparation.length - 1) art += arrow(x + 374, 134, x + 418, 134, muted);
    });
    if (step === 5) return art + move([[795, 134], [1280, 134]], '模型', purple, 420);

    art += path('M1472 194V245H492V319', purple, 2, '7 7') +
      text(998, 232, '副本就绪，入口可分配请求', 24, purple) +
      text(0, 291, '第五条请求的在线路径', 32, green);
    request.forEach(([title, detail], i) => {
      const x = i * 343, color = i === 2 ? orange : green;
      art += appear(block(x, 326, 298, title, detail, color), 200 + i * 230);
      if (i < request.length - 1) art += arrow(x + 305, 382, x + 336, 382, muted);
    });
    art += move([[300, 382], [641, 382], [982, 382], [1328, 382]], '', green, 350);
    art += appear(text(686, 505, '第五条在这里等到缓存空间', 28, orange) +
      path('M835 448V470', orange), 1150);
    return art;
  }

  const scenes = {
    S03: [atlas, '每行是一类职责。各类组件按训练或在线服务的实际需要组合。'],
    S30: [lifecycle, '以企业问答为例。评估和优化可以反复进行，监控结果也会反馈到前面的环节。'],
    S31: [runtime, '以 NVIDIA GPU 为例。容器内的运行库和宿主驱动需要兼容。'],
    S32: [execution, 'NVIDIA CUDA 执行示意。初始数组和分派图省略了部分线程及设备单元。'],
    S33: [memory, '常见 NVIDIA GPU 的访问示意。共享内存由程序管理，缓存由硬件管理。'],
    S34: [training, '两个等量批次的示意。通信连线表示逻辑上的集合操作。'],
    S35: [transformer, '因果 Transformer 示意。不同架构的归一化位置和具体实现会有差异。'],
    S36: [heads, '按单层、单个 Token 位置画缓存。查询头数相同，KV 头数不同。'],
    S37: [speculate, '同一候选序列的示意。性能取决于候选接受率、负载和实现。'],
    S38: [deployment, '一次模型服务发布示意。网关只向被标为就绪的副本转发实际流量。'],
    S39: [observability, '全部指标、事件和时间均为教学示例。比较时需注明测量窗口和统计口径。'],
    S40: [summary, '回到课程开头的请求与模型生命周期。'],
  };
  window.CourseScenes ||= {};
  for (const [id, [draw, note]] of Object.entries(scenes)) {
    const slide = COURSE.slides.find(slide => slide.id === id);
    window.CourseScenes[id] = {
      render(step, beat) {
        return `<section class="platform-scene systems-scene" data-systems-slide="${id}" data-systems-step="${step}">
          <div class="p-mast"><span>AI INFRA <i>/</i> 入门课</span><span>${esc(COURSE.chapters[slide.chapter - 1])}</span><span data-course-folio></span></div>
          <div class="p-heading"><h1>${esc(slide.title)}</h1><p>${esc(slide.subtitle)}</p></div>
          <svg class="p-svg" viewBox="0 0 1920 1080" aria-hidden="true"><g transform="translate(120 358)">${draw(step, beat)}</g></svg>
          <div class="p-footnote">${esc(note)}</div>
        </section>`;
      },
      mount,
    };
  }
})();
