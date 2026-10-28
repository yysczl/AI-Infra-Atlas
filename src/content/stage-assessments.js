export const QUIZ_PASS_SCORE = 80;

// 每个学习阶段包含一个综合项目和五题结业测验。answer 是正确选项的索引。
export const stageAssessments = {
  p0: {
    project: {
      title: '可复现的迷你训练报告',
      subtitle: '把第一个训练循环变成别人也能复跑的完整实验',
      duration: '2–3 小时', environment: '普通电脑 · CPU · Python · Git',
      brief: '基于实验 00 的线性回归，补齐代码版本、环境记录、学习率对照和结果解释。重点不是复杂模型，而是交付一条完整、可检查的学习证据链。',
      steps: [
        { title: '建立项目与基线', detail: '创建独立目录和虚拟环境，完成一次有意义的 Git 提交，运行 LR=0.05 的基线并保存日志。', expected: 'README 写清启动命令，基线 w 接近 3、b 接近 1，依赖版本和原始日志均已保存。' },
        { title: '完成受控变量对照', detail: '只改变学习率，运行 0.001、0.05、0.2 三组实验，保持数据、种子和步数一致。', expected: '汇总表能逐组追溯到 JSON 与日志，结论解释收敛速度差异，没有同时修改其他条件。' },
        { title: '增加一个失败用例', detail: '额外选择一个过大或过小学习率，记录现象并解释为什么失败结果也应保留。', expected: '报告包含一组未达预期的真实结果、判断依据和下一步调整，不删除或美化失败数据。' },
        { title: '打包并让他人复跑', detail: '整理 README、命令、环境、结果和复盘，按 README 从干净目录重新执行一次。', expected: '不依赖终端历史即可复现主要表格，Git 差异中不包含虚拟环境、缓存或密钥。' },
      ],
      deliverables: ['可运行的 train.py 与 README', '至少四组学习率 JSON 和原始日志', 'python-environment.txt 与 Git 提交记录', '一页结果分析：事实、解释、未知项和下一步'],
      rubric: [
        { item: '实验可复现', points: 25, description: '环境、命令、种子、代码版本齐全，能从干净目录复跑。' },
        { item: '对照有效', points: 25, description: '除学习率外条件一致，结果文件与日志一一对应。' },
        { item: '结论有证据', points: 25, description: '同时讨论成功和失败结果，不把推测写成事实。' },
        { item: '交付整洁', points: 25, description: 'README 清晰，文件组织合理，无虚拟环境或敏感信息误提交。' },
      ],
    },
    quiz: [
      { id: 'p0-q1', topicId: 'base-python', question: '为什么每个训练项目都应该使用独立虚拟环境？', options: ['让所有项目自动共用最新依赖', '隔离项目依赖，并能记录实际安装版本', '让 CPU 自动获得 GPU 加速', '用来替代 Git 管理代码版本'], answer: 1, explanation: '虚拟环境解决的是依赖隔离与复现，不改变硬件能力，也不代替代码版本管理。' },
      { id: 'p0-q2', topicId: 'base-ml', question: '一个标准训练步骤的正确顺序是什么？', options: ['前向预测 → 计算 loss → 反向求梯度 → 优化器更新', '优化器更新 → 前向预测 → 删除 loss → 反向求梯度', '反向求梯度 → 前向预测 → 优化器更新 → 计算 loss', '计算 loss → 冻结参数 → 前向预测 → 优化器更新'], answer: 0, explanation: '先由当前参数得到预测和损失，再通过 backward 计算梯度，最后由优化器更新参数。' },
      { id: 'p0-q3', topicId: 'base-workflow', question: '两次实验同时改变了 batch size 和精度，结果更快了。能直接判断是哪一项带来提速吗？', options: ['可以，速度变化一定来自精度', '可以，batch size 总是唯一原因', '不能，需要固定其他条件分别做对照', '不能，因为性能实验不需要记录变量'], answer: 2, explanation: '多个变量同时变化会混淆归因，应通过受控对照分离各因素的影响。' },
      { id: 'p0-q4', topicId: 'base-linux', question: '在 shell 中，> 与 >> 用于写入日志时有什么区别？', options: ['两者都只会追加，没有区别', '> 通常覆盖目标文件，>> 通常追加到末尾', '> 用来执行命令，>> 用来删除命令', '只有 root 用户才能使用它们'], answer: 1, explanation: '覆盖重定向可能丢失已有日志，使用前要确认路径；追加更适合保留连续运行记录。' },
      { id: 'p0-q5', topicId: 'base-workflow', question: '比较三个学习率时，下列哪组设置最合理？', options: ['每组同时更换模型，避免结果过于相似', '只保留表现最好的日志', '每组使用不同数据集，增加样本多样性', '固定数据、种子、模型和步数，只改变学习率'], answer: 3, explanation: '学习率对照需要保持其他关键条件一致，并保留所有结果，而不是只保存最好的一组。' },
    ],
  },

  p1: {
    project: {
      title: 'AI 机器性能画像',
      subtitle: '用测量数据描述一台机器，而不是抄硬件参数表',
      duration: '3–4 小时', environment: 'Linux · CPU 必做 · NVIDIA GPU 可选',
      brief: '基于实验 01 建立硬件与软件清单，测量内存、磁盘和张量负载，再把一个训练或推理任务拆成计算、访存、I/O 与等待四类问题。',
      steps: [
        { title: '冻结机器与软件信息', detail: '记录 CPU、内存、磁盘、网卡、操作系统和框架版本；有 GPU 时补充显存、互联和驱动。', expected: '配置清单来自命令输出，关键字段能追溯到原始文件，没有凭印象填写。' },
        { title: '完成三层微基准', detail: '测量内存、顺序读和一个张量负载，写明参数、预热、重复次数与单位。', expected: '至少三类结果可复跑，理论规格与实际测量分开呈现。' },
        { title: '映射一个 AI 工作负载', detail: '选择一个数据加载、矩阵乘或 decode 场景，分析它可能受计算、带宽、容量还是等待限制。', expected: '每个瓶颈假设都有对应观测指标和验证方法，不只写“需要更快 GPU”。' },
        { title: '形成性能画像报告', detail: '汇总配置、测量、工作负载映射和后续实验优先级，明确 GPU 缺失时的数据边界。', expected: '报告能指导下一项实验，并清楚区分事实、估算与尚未验证的假设。' },
      ],
      deliverables: ['机器与软件配置清单', '三类微基准原始输出和汇总表', '一张 AI 工作负载瓶颈映射图', '性能画像报告与按优先级排列的验证计划'],
      rubric: [
        { item: '测量可信', points: 25, description: '配置、参数、预热、重复和单位完整，原始输出可追溯。' },
        { item: '分析覆盖全链路', points: 30, description: '同时考虑计算、访存、I/O 和等待，不只看单一利用率。' },
        { item: '假设可验证', points: 25, description: '每项瓶颈判断都配套指标和下一步实验。' },
        { item: '表达有边界', points: 20, description: '区分事实、估算和未知项，不夸大微基准代表范围。' },
      ],
    },
    quiz: [
      { id: 'p1-q1', topicId: 'sys-perf', question: 'GPU 利用率偏低时，哪一步最能帮助判断主机侧是否在拖慢任务？', options: ['直接把所有 batch 增大四倍', '只看 GPU 的峰值算力', '对照主机时间线、数据等待与设备 Kernel 空隙', '立即关闭所有日志'], answer: 2, explanation: '利用率只是症状，需要把主机、数据管线和设备时间线关联起来验证等待发生在哪里。' },
      { id: 'p1-q2', topicId: 'sys-memory', question: '一个算子计算量不大但频繁读取不连续内存，最合理的优化方向是什么？', options: ['改善数据局部性与复用，减少无效内存访问', '只增加线程数量，不改变访问方式', '把日志级别改成 DEBUG', '只比较处理器的核心数量'], answer: 0, explanation: '这类负载更可能受内存路径限制，布局、局部性和复用往往比单纯增加并行度更关键。' },
      { id: 'p1-q3', topicId: 'hw-precision', question: 'BF16 与 FP16 相比，一个典型特点是什么？', options: ['BF16 永远没有舍入误差', 'BF16 通常具有更大的指数范围，FP16 通常有更多尾数位', 'FP16 的显存占用总是 BF16 的两倍', '两者都不需要检查硬件 Kernel 支持'], answer: 1, explanation: 'BF16 更偏向动态范围，FP16 更偏向精度细节；实际选择还要看溢出、舍入和硬件支持。' },
      { id: 'p1-q4', topicId: 'hw-gpu', question: '为什么 Warp 内严重的分支发散可能降低执行效率？', options: ['它会让显存容量自动翻倍', '它一定会破坏网络连接', '它会强制所有数据改走磁盘', '不同分支路径需要分别执行，部分执行槽可能闲置'], answer: 3, explanation: '同一 Warp 的线程走不同路径时，硬件需要串行处理各路径，降低有效并行度。' },
      { id: 'p1-q5', topicId: 'sys-perf', question: '性能基线报告中，下列哪条写法最严谨？', options: ['“磁盘慢，所以训练一定慢”', '“GPU 很忙，因此系统没有瓶颈”', '“本次参数下顺序读为 X；它是否限制当前数据管线还需对照验证”', '“跑分最高，因此所有负载都最快”'], answer: 2, explanation: '报告应保留测量条件和结果，把进一步因果判断标为需要验证的假设。' },
    ],
  },

  p2: {
    project: {
      title: '可验证的 RMSNorm 优化',
      subtitle: '从 eager 参考实现到融合 Kernel，再证明结果正确且确实更快',
      duration: '4–6 小时', environment: 'Linux · PyTorch · 单张 NVIDIA GPU',
      brief: '基于实验 02，将 RMSNorm 的参考实现、Triton 实现和可选编译实现放在同一测试与基准框架中，完成 shape、精度和性能对照。',
      steps: [
        { title: '建立正确性基线', detail: '使用简单 PyTorch 实现作为参考，覆盖多种行数、宽度和 dtype，记录误差容差依据。', expected: '所有目标 shape 通过参数化测试，非 2 次幂宽度也有覆盖。' },
        { title: '实现并审查融合 Kernel', detail: '完成 Triton RMSNorm，检查加载与写回 mask、FP32 归约、连续输入和 block 选择。', expected: '实现边界明确，非法输入不会被静默当成已支持，源码中有关键设计说明。' },
        { title: '完成公平性能对照', detail: '预热后比较 eager、Triton 和可选 torch.compile，扫描至少五种宽度并记录有效带宽。', expected: '每种实现使用相同输入和测量口径，编译与同步开销处理有说明。' },
        { title: '解释收益与退化区间', detail: '结合读写量、启动开销和 profile，解释哪些 shape 获益、哪些没有，并提出下一轮优化。', expected: '报告不只给平均加速比，还包含退化 case、原始数据和验证中的瓶颈假设。' },
      ],
      deliverables: ['参考实现、Triton 实现与参数化测试', '多 shape、多 dtype 正确性结果', '可复现 benchmark 脚本和原始数据', '包含 profile 证据与退化区间的优化报告'],
      rubric: [
        { item: '数值正确', points: 30, description: 'shape 与精度覆盖充分，mask、归约和容差处理合理。' },
        { item: '基准公平', points: 25, description: '输入、预热、同步和测量口径一致，原始数据完整。' },
        { item: '分析深入', points: 25, description: '能解释内存访问、启动和编译开销，而非只报名词。' },
        { item: '边界清楚', points: 20, description: '保留退化结果，明确教学实现未覆盖的场景。' },
      ],
    },
    quiz: [
      { id: 'p2-q1', topicId: 'fw-loop', question: '使用梯度累积时，哪项描述最准确？', options: ['多个 micro-batch 累积梯度后再更新，需要明确 zero_grad 与 step 的时机', '每个 micro-batch 都必须创建一套新模型参数', '梯度累积会自动消除全部通信开销', '它与前向、反向和优化器更新顺序无关'], answer: 0, explanation: '累积的核心是多次反向后按设计更新，同时要考虑全局 batch、学习率和分布式同步。' },
      { id: 'p2-q2', topicId: 'kernel-triton', question: 'RMSNorm 融合 Kernel 的主要潜在收益来自哪里？', options: ['让归一化公式不再需要除法', '自动提高所有输入的数值精度', '减少中间结果往返显存和额外 Kernel 启动', '保证任何 shape 都比所有 eager 实现快'], answer: 2, explanation: '融合可以减少中间张量读写与启动开销，但收益仍受 shape、内存路径和实现质量影响。' },
      { id: 'p2-q3', topicId: 'compiler-graph', question: '模型编译后频繁 graph break 或重编译，优先检查什么？', options: ['模型文件文件名是否足够短', 'Python 控制流、数据依赖逻辑和动态 shape', '显示器刷新率', '只检查 GPU 功耗，不看代码'], answer: 1, explanation: '图捕获受 Python 控制流、动态形状和数据依赖操作影响，需要先定位无法稳定捕获的部分。' },
      { id: 'p2-q4', topicId: 'fw-data', question: '为什么 DataLoader worker 不是越多越好？', options: ['worker 与数据加载完全无关', 'worker 数必须是 GPU 数量的平方', '增加 worker 总能等比例减少全部延迟', '进程启动、CPU、内存和 I/O 竞争可能抵消预取收益'], answer: 3, explanation: 'worker 需要实际资源，过多会造成竞争，应结合主机时间线和吞吐扫描找到合适区间。' },
      { id: 'p2-q5', topicId: 'kernel-cuda', question: '哪组 Kernel 优化验收最完整？', options: ['只测一次最大 shape 的延迟', '只比较两张截图中的 GPU 利用率', '多 shape 正确性测试＋预热基准＋profile 与退化分析', '只要代码行数更少就接受'], answer: 2, explanation: '正确性、测量方法和瓶颈证据缺一不可，单一峰值无法代表真实工作负载。' },
    ],
  },

  p3: {
    project: {
      title: '可恢复的分布式训练演练',
      subtitle: '同时验证扩展效率、通信路径和 Checkpoint 恢复，而不只是“能启动”',
      duration: '6–8 小时', environment: 'Linux · 2 张以上 NVIDIA GPU · PyTorch',
      brief: '综合实验 03–05，固定一个小模型和合成数据，比较单卡与多卡，记录通信基线，并通过主动终止进程验证分布式 Checkpoint 能恢复训练状态。',
      steps: [
        { title: '选择方案并估算资源', detail: '根据模型状态、GPU 显存和拓扑选择 DDP 或 FSDP，写出显存估算、全局 batch 和通信路径。', expected: '方案说明为什么不需要或需要分片，估算明确未计入的激活与临时缓冲。' },
        { title: '建立单卡与多卡基线', detail: '固定每卡 batch 和模型，测量单卡、多卡吞吐及一种集合通信，计算扩展效率。', expected: '原始结果包含 rank、world size、消息大小和环境，吞吐按全局样本口径计算。' },
        { title: '执行一次恢复演练', detail: '保存模型、优化器、随机状态和数据位置，主动停止任务，再从 Checkpoint 重启。', expected: '恢复点、后续一步结果和数据游标符合预期，不留下半份或混代 Checkpoint。' },
        { title: '分析扩展与故障边界', detail: '对照通信、数据加载和 Checkpoint 时间，写出一个扩展瓶颈与一个恢复风险及改进方案。', expected: '结论有日志和测量支持，并明确两卡结果不能直接外推到多机。' },
      ],
      deliverables: ['并行与显存估算说明', '单卡／多卡及通信原始基准', 'Checkpoint 保存、终止和恢复日志', '扩展效率、恢复结果与风险复盘'],
      rubric: [
        { item: '方案合理', points: 25, description: '并行、batch 和显存选择与模型及拓扑匹配。' },
        { item: '测量可比较', points: 25, description: '单卡、多卡和通信结果口径一致，扩展效率计算正确。' },
        { item: '恢复经验证', points: 30, description: '实际执行故障与恢复，模型、优化器和数据状态一致。' },
        { item: '结论不过度外推', points: 20, description: '明确规模、合成负载和环境边界，改进项有证据。' },
      ],
    },
    quiz: [
      { id: 'p3-q1', topicId: 'dist-ddp', question: 'DDP 的梯度 bucket 主要帮助实现什么？', options: ['组织梯度通信，并为通信与反向计算重叠提供机会', '把每张 GPU 的显存容量合并成一个物理设备', '自动解决所有数据加载瓶颈', '让不同 rank 使用完全不同的模型参数'], answer: 0, explanation: 'bucket 将梯度分批组织通信，能减少小通信并创造重叠机会，但不消除通信本身。' },
      { id: 'p3-q2', topicId: 'dist-shard', question: '为什么 FSDP 已分片参数，峰值显存仍可能超限？', options: ['FSDP 从不分片任何状态', '分片会让所有激活永久复制到每个文件', '前向或反向时参数可能物化，且激活和临时缓冲仍占空间', '只要使用 FSDP 就必须额外预留全部 CPU 磁盘'], answer: 2, explanation: '静态分片不等于所有阶段都只有分片大小，需考虑参数物化、激活、通信和临时分配。' },
      { id: 'p3-q3', topicId: 'net-collective', question: '哪个场景最符合 AllGather？', options: ['所有 rank 把梯度求和后只保留在 rank 0', '各 rank 提供一份分片，最终所有 rank 都获得拼接后的完整数据', '一个 rank 向另一个 rank 发送点对点消息，其他 rank 不参与', '所有 rank 只保留自己原有数据，不发生通信'], answer: 1, explanation: 'AllGather 收集各 rank 的数据并让所有参与者获得结果，常见于分片物化等场景。' },
      { id: 'p3-q4', topicId: 'data-ckpt', question: '一个可恢复训练 Checkpoint 最关键的验收是什么？', options: ['目录里只要存在一个大文件', '只保存模型名称，优化器可以随便重置', '保存到一半就能被新任务当成最新完整版本', '模型、优化器、随机状态和数据位置一致，并以完整代际发布'], answer: 3, explanation: '恢复不仅是张量值，还包括训练过程状态；完整代际和原子可见性可避免读取半份状态。' },
      { id: 'p3-q5', topicId: 'dist-model', question: '在实现与显存允许的情况下，增加流水线 micro-batch 数量通常有什么作用？', options: ['必然消除全部网络通信', '让所有 stage 的参数量变成零', '降低流水线气泡所占比例，但会增加调度与通信管理开销', '保证收敛完全不受全局 batch 影响'], answer: 2, explanation: '更多微批次可提高流水线填充程度，但不是无成本，也不改变所有训练与通信约束。' },
    ],
  },

  p4: {
    project: {
      title: 'SLO 驱动的 LLM 容量报告',
      subtitle: '用真实长度分布、尾延迟和 goodput 选择可用工作点',
      duration: '4–6 小时', environment: 'Linux · 单张 NVIDIA GPU · vLLM 或同类运行时',
      brief: '基于实验 06–07，为一个固定模型建立可复现压测，扫描并发并比较一种优化，最后给出满足 SLO 的容量、灰度和回滚建议。',
      steps: [
        { title: '冻结模型与流量模型', detail: '记录模型、运行时、硬件和采样参数，构造包含短、中、长输入输出的固定请求集。', expected: '请求分布、随机种子、TTFT／TPOT／E2E 和 SLO 定义清楚，失败请求不计成 0 延迟。' },
        { title: '扫描并发并定位拐点', detail: '逐级提升并发，保存请求级数据、排队、吞吐、P50／P95／P99 和资源使用。', expected: '报告能指出吞吐平台、尾延迟陡增或显存限制出现的位置，并给出原始证据。' },
        { title: '验证一种优化', detail: '只选择前缀缓存、权重量化或调度参数中的一项做对照，同时回归输出质量。', expected: '优化前后条件一致，收益、质量变化和不适用请求都写入结果。' },
        { title: '给出容量与发布建议', detail: '按 SLO 内 goodput 选择留有余量的工作点，设计灰度、重试预算和回滚门禁。', expected: '容量结论包含流量假设和安全余量，不用原始 requests/s 代替有效容量。' },
      ],
      deliverables: ['固定请求集、SLO 与环境清单', '并发扫描请求级数据和汇总曲线', '一种优化的性能与质量对照', '容量结论、灰度指标和回滚方案'],
      rubric: [
        { item: '实验条件完整', points: 25, description: '模型、流量、长度、采样和运行时配置可复现。' },
        { item: '容量分析可信', points: 30, description: '覆盖尾延迟、goodput、失败和资源拐点，数据口径正确。' },
        { item: '优化对照有效', points: 25, description: '只改主要因素，同时检查质量与适用边界。' },
        { item: '发布方案可执行', points: 20, description: '有余量、灰度、重试和回滚门禁，能用于真实决策。' },
      ],
    },
    quiz: [
      { id: 'p4-q1', topicId: 'inf-decode', question: '长输入主要增加哪个阶段的压力，并最常直接影响哪项指标？', options: ['prefill；TTFT', 'decode；磁盘容量', '模型下载；Git 提交时间', '日志写入；模型参数量'], answer: 0, explanation: '输入提示主要由 prefill 处理，其计算和 KV 初始化会影响首 token 时间；长输出更直接影响 decode。' },
      { id: 'p4-q2', topicId: 'inf-kv', question: '为什么上下文变长可能降低可承载并发？', options: ['上下文会改变操作系统用户名', '长上下文必然减少模型权重字节数', '每请求 KV Cache 增长，留给并发请求的显存空间减少', '上下文长度与显存和调度完全无关'], answer: 2, explanation: 'KV Cache 随层数、上下文和并发增长，会挤压可调度空间并影响 batch 与吞吐。' },
      { id: 'p4-q3', topicId: 'serve-bench', question: 'SLO 内 goodput 的正确理解是什么？', options: ['所有已发起请求的总数，包括超时', '满足规定延迟、成功和其他必要条件的有效请求容量', '只统计排队中的请求', '把失败请求延迟填成 0 后的平均吞吐'], answer: 1, explanation: 'goodput 关注有效完成，而不是通过失败、积压或超时抬高表面吞吐。' },
      { id: 'p4-q4', topicId: 'serve-router', question: '昂贵的长推理请求需要重试时，哪项设计最安全？', options: ['客户端、网关和服务都无限重试', '只有失败后立刻并行发起十次请求', '不区分错误类型全部重试', '限制总重试预算和截止时间，区分错误并处理幂等'], answer: 3, explanation: '多层重试会放大 GPU 与 KV 占用，需要全链路预算、取消和副作用控制。' },
      { id: 'p4-q5', topicId: 'inf-opt', question: '验收一种量化或投机解码优化，最重要的组合是什么？', options: ['只看权重文件缩小比例', '只报告一个短请求的平均速度', '同时检查任务质量、目标流量下性能和尾延迟', '只要技术名称更先进就直接上线'], answer: 2, explanation: '优化必须针对真实瓶颈，并同时验证质量、性能和不同请求长度下的边界。' },
    ],
  },

  p5: {
    project: {
      title: '可观测且可恢复的 GPU 服务',
      subtitle: '从调度、就绪和告警，一路验证到回滚与事故复盘',
      duration: '1–2 天', environment: '测试 Kubernetes 集群 · GPU · Prometheus / DCGM',
      brief: '基于实验 08，部署一个推理服务，补齐资源声明、探针、分层指标和告警，再实际执行配置回滚与 Pod 删除演练。',
      steps: [
        { title: '声明资源与发布合约', detail: '配置 GPU、CPU、内存请求，区分 liveness、readiness 和启动探针，记录模型与运行时版本。', expected: '未完成模型加载的实例不会接流量，资源声明与测量需求一致。' },
        { title: '建立分层观测与告警', detail: '关联服务延迟、队列、goodput、GPU、显存和主机指标，配置一条面向用户症状的告警。', expected: '仪表盘能下钻到实例与版本，告警包含严重度、负责人和排障入口。' },
        { title: '执行回滚与故障演练', detail: '先做配置变更并回滚，再删除一个测试 Pod，记录发现、恢复和 Ready 时间。', expected: '服务按预期恢复，保留事件、指标、时间线和实际 RTO，不只检查 Pod 名称存在。' },
        { title: '完成事故复盘', detail: '整理时间线、影响、直接与促成因素，形成带负责人、期限和验证方法的行动项。', expected: '至少一项行动可通过告警测试、故障演练或 SLO 数据验证。' },
      ],
      deliverables: ['Deployment、Service 与探针配置', '分层仪表盘截图或导出及告警规则', '回滚与 Pod 故障演练原始记录', '带时间线、RTO 和可验证行动项的复盘'],
      rubric: [
        { item: '发布合约清晰', points: 25, description: '资源、版本、探针和流量接入条件配置合理。' },
        { item: '观测围绕症状', points: 25, description: '资源、运行时和业务指标可关联，告警可执行。' },
        { item: '恢复真实验证', points: 30, description: '实际完成回滚和故障演练，记录恢复时间与证据。' },
        { item: '复盘产生改进', points: 20, description: '不止归因个人操作，行动项有负责人和验证方式。' },
      ],
    },
    quiz: [
      { id: 'p5-q1', topicId: 'plat-k8s', question: '推理 Pod 的 readiness 最应该表达什么？', options: ['模型和必要初始化已完成，可以接收流量', '容器文件系统已经创建，无论模型是否加载', '节点上还有空闲磁盘', '只要进程没有退出就始终就绪'], answer: 0, explanation: 'Running 不代表可服务，readiness 应防止仍在下载、加载或预热的实例提前接流量。' },
      { id: 'p5-q2', topicId: 'plat-batch', question: '为什么多 rank 训练需要 gang scheduling？', options: ['为了让每个 rank 使用不同代码版本', '为了让任意一个 rank 都能独自完成全集通信', '因为 rank 要共同组成通信与训练作业，部分就绪会浪费资源或无法开始', '因为它能自动降低模型精度'], answer: 2, explanation: '成组调度避免部分进程占着资源等待其余 rank，保证作业作为整体启动。' },
      { id: 'p5-q3', topicId: 'obs-metrics', question: 'SM 利用率高但用户超时增多，最合理的下一步是什么？', options: ['宣布系统性能优秀并结束排查', '结合 goodput、队列、尾延迟和时间线判断忙碌是否转化为有效请求', '删除所有失败请求数据', '只把利用率采样间隔加长'], answer: 1, explanation: '资源忙碌不等于业务有效，需要关联请求结果、排队与执行路径。' },
      { id: 'p5-q4', topicId: 'obs-slo', question: '哪条告警最适合直接触发高优先级值班？', options: ['某台机器温度瞬时变化但没有影响', 'GPU 利用率在白天升高', '磁盘有正常日志写入', 'SLO 内 goodput 持续显著下降并影响用户'], answer: 3, explanation: '高优先级告警应优先对应持续的用户症状，原因指标用于后续诊断。' },
      { id: 'p5-q5', topicId: 'obs-incident', question: '哪个复盘行动项最可验证？', options: ['要求大家以后更加小心', '把根因写成某人不够熟练', '补充慢加载就绪测试和回滚演练，指定负责人、期限与通过标准', '决定以后不再记录事故'], answer: 2, explanation: '行动项需要具体工程改动、责任与期限，并能用测试或数据证明风险降低。' },
    ],
  },

  p6: {
    project: {
      title: '带质量、权限与成本门禁的 RAG 应用',
      subtitle: '把检索、工具、评测、发布和审计合成一个可交付系统',
      duration: '2–4 天', environment: 'Python · 小型固定语料 · 可使用 CPU 或受控模型 API',
      brief: '基于实验 09，完成一个小型知识库问答应用。重点不在模型大小，而在版本化摄入、混合检索、工具权限、自动评测和单位成本都能被检查。',
      steps: [
        { title: '建立可追溯知识库', detail: '准备固定文档集，保留来源、版本、权限与 chunk 元数据，实现一次文档更新和旧版本清理。', expected: '任一检索结果能回到原文，更新后不会混用新旧版本，删除文档不会留下可检索残留。' },
        { title: '验证检索与工具边界', detail: '用固定查询比较关键词、向量或混合检索，并加入空检索、越权、超时和重复工具调用测试。', expected: '报告 Recall@3／MRR 与失败样本，工具权限、幂等和审计测试全部通过。' },
        { title: '建立发布质量与成本门禁', detail: '组织事实、无答案、权限和冲突样本，比较两个候选版本，并估算每个有效回答的模型与基础设施成本。', expected: '同一数据集配对比较质量、延迟与成本，拒答和权限失败单独统计，不以单一平均分发布。' },
        { title: '完成架构与风险复盘', detail: '记录数据授权、日志保留、模型与 Prompt 版本、回滚、已知失败和下一阶段改进。', expected: '一次回答可追溯到模型、检索和工具记录，审计字段完整且敏感内容有最小化与保留策略。' },
      ],
      deliverables: ['版本化文档集、索引与元数据', '检索评测和四类工具回归结果', '候选版本质量／延迟／成本对照', '架构复盘、风险评估、审计与回滚说明'],
      rubric: [
        { item: '数据与检索可追溯', points: 25, description: '来源、版本、权限、更新和删除一致，评测覆盖失败样本。' },
        { item: '工具安全可验证', points: 25, description: '越权、超时、空结果和幂等都有自动测试与审计。' },
        { item: '发布门禁完整', points: 25, description: '质量、延迟、成本和分桶结果共同决定发布，不用平均分掩盖风险。' },
        { item: '治理落到工程', points: 25, description: '授权、保留、审计、回滚与改进均有具体实现和证据。' },
      ],
    },
    quiz: [
      { id: 'p6-q1', topicId: 'rag-ingest', question: '文档从 v1 更新到 v2 时，怎样避免查询混用新旧内容？', options: ['使用文档版本与代际管理，原子切换并清理旧向量', '只把新文档追加进去，旧文档永远保留', '让模型自己猜测哪个版本更新', '删除所有元数据以减少干扰'], answer: 0, explanation: '摄入需要版本、删除和切换语义，不能只依赖生成模型判断内容新旧。' },
      { id: 'p6-q2', topicId: 'rag-search', question: '某查询的第一个相关结果排在第 2 位，它的 reciprocal rank 是多少？', options: ['2', '1', '1/2', '0'], answer: 2, explanation: 'reciprocal rank 是首个相关结果名次的倒数，因此第 2 位为 1/2；MRR 再对多个查询取平均。' },
      { id: 'p6-q3', topicId: 'agent-tools', question: '为什么执行退款的 Agent 工具需要 request_id 与幂等处理？', options: ['为了让工具描述看起来更长', '故障重试可能重复执行同一逻辑请求，幂等键可避免重复副作用', '为了自动授予工具所有账户权限', '为了把写操作变成无需审计的操作'], answer: 1, explanation: '工具可能已经执行但结果未保存，重试必须识别同一请求，同时还需要授权和审计。' },
      { id: 'p6-q4', topicId: 'mlops-eval', question: '怎样更可信地判断新 Prompt 或模型确实优于旧版本？', options: ['只挑一个成功案例展示', '每天更换评测集和判分标准', '只比较最高的一次分数', '固定版本化样本做配对比较，重复必要运行并检查分桶与波动'], answer: 3, explanation: '固定口径、配对样本、失败分类与波动分析能降低把噪声当提升的风险。' },
      { id: 'p6-q5', topicId: 'gov-risk', question: '上线高风险知识库问答时，哪项做法最完整？', options: ['只记录一个平均准确率', '永久保存所有敏感 Prompt 并开放给所有人', '关联模型、检索与工具版本做审计，同时控制权限、保留期并核算有效回答成本', '只要模型足够大就省略回滚和人工升级'], answer: 2, explanation: '可追溯性要与数据最小化、权限和保留策略并存，发布还需考虑有效产出成本与恢复能力。' },
    ],
  },
};
