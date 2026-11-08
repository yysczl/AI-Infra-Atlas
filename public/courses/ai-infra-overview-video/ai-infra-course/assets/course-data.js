window.COURSE = {
  "title": "从零认识 AI Infra",
  "subtitle": "模型从训练到上线的一套基础设施",
  "version": "2.0",
  "reviewed": "2026-11-04",
  "chapters": [
    "AI Infra 解决什么问题",
    "GPU 与计算基础",
    "模型训练与计算框架",
    "大模型推理引擎",
    "推理服务与集群管理",
    "一次请求的完整旅程"
  ],
  "references": {
    "cuda": {
      "title": "CUDA Programming Guide",
      "url": "https://docs.nvidia.com/cuda/cuda-programming-guide/",
      "accessed": "2026-11-01"
    },
    "cuda_legacy": {
      "title": "CUDA C++ Programming Guide 历史版",
      "url": "https://docs.nvidia.com/cuda/cuda-c-programming-guide/",
      "accessed": "2026-11-01"
    },
    "triton": {
      "title": "Triton 语言官方文档",
      "url": "https://triton-lang.org/main/index.html",
      "accessed": "2026-11-01"
    },
    "triton_server": {
      "title": "NVIDIA Triton Inference Server 官方文档",
      "url": "https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/index.html",
      "accessed": "2026-11-04"
    },
    "rocm": {
      "title": "AMD ROCm 软件平台",
      "url": "https://rocm.docs.amd.com/en/latest/about/what-is-rocm.html",
      "accessed": "2026-11-04"
    },
    "cann": {
      "title": "昇腾 CANN 官方文档",
      "url": "https://www.hiascend.com/cann/document",
      "accessed": "2026-11-04"
    },
    "pytorch": {
      "title": "PyTorch Learn the Basics",
      "url": "https://docs.pytorch.org/tutorials/beginner/basics/intro.html",
      "accessed": "2026-11-01"
    },
    "distributed": {
      "title": "PyTorch Distributed Overview",
      "url": "https://docs.pytorch.org/tutorials/beginner/dist_overview.html",
      "accessed": "2026-11-01"
    },
    "flash": {
      "title": "FlashAttention 原始论文 2022",
      "url": "https://arxiv.org/abs/2205.14135",
      "accessed": "2026-11-01"
    },
    "paged": {
      "title": "PagedAttention 与 vLLM 原始论文 2023",
      "url": "https://arxiv.org/abs/2309.06180",
      "accessed": "2026-11-01"
    },
    "vllm": {
      "title": "vLLM 官方文档",
      "url": "https://docs.vllm.ai/en/latest/",
      "accessed": "2026-11-01"
    },
    "prefix": {
      "title": "vLLM Automatic Prefix Caching",
      "url": "https://docs.vllm.ai/en/latest/design/prefix_caching/",
      "accessed": "2026-11-01"
    },
    "metrics": {
      "title": "vLLM Metrics",
      "url": "https://docs.vllm.ai/en/latest/design/metrics/",
      "accessed": "2026-11-01"
    },
    "sglang": {
      "title": "SGLang 官方文档",
      "url": "https://docs.sglang.io/",
      "accessed": "2026-11-01"
    },
    "cache": {
      "title": "Transformers How caching works",
      "url": "https://huggingface.co/docs/transformers/cache_explanation",
      "accessed": "2026-11-01"
    },
    "attention": {
      "title": "Attention Is All You Need 原始论文 2017",
      "url": "https://arxiv.org/abs/1706.03762",
      "accessed": "2026-11-01"
    },
    "orca": {
      "title": "Orca 迭代级调度论文 OSDI 2022",
      "url": "https://www.usenix.org/conference/osdi22/presentation/yu",
      "accessed": "2026-11-01"
    },
    "quant": {
      "title": "Transformers Quantization Overview",
      "url": "https://huggingface.co/docs/transformers/quantization/overview",
      "accessed": "2026-11-01"
    },
    "docker": {
      "title": "Docker Overview",
      "url": "https://docs.docker.com/get-started/docker-overview/",
      "accessed": "2026-11-01"
    },
    "k8s": {
      "title": "Kubernetes Overview",
      "url": "https://kubernetes.io/docs/concepts/overview/",
      "accessed": "2026-11-01"
    },
    "ray": {
      "title": "Ray on Kubernetes",
      "url": "https://docs.ray.io/en/latest/cluster/kubernetes/index.html",
      "accessed": "2026-11-01"
    },
    "cublas": {
      "title": "cuBLAS 官方文档",
      "url": "https://docs.nvidia.com/cuda/cublas/",
      "accessed": "2026-11-01"
    },
    "cudnn": {
      "title": "cuDNN 官方文档",
      "url": "https://docs.nvidia.com/cudnn/overview",
      "accessed": "2026-11-01"
    },
    "trt": {
      "title": "TensorRT LLM 官方文档",
      "url": "https://nvidia.github.io/TensorRT-LLM/",
      "accessed": "2026-11-01"
    },
    "deepspeed": {
      "title": "DeepSpeed 官方文档",
      "url": "https://www.deepspeed.ai/",
      "accessed": "2026-11-01"
    },
    "megatron": {
      "title": "Megatron-LM 官方仓库",
      "url": "https://github.com/NVIDIA/Megatron-LM",
      "accessed": "2026-11-01"
    },
    "nccl": {
      "title": "NCCL User Guide",
      "url": "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html",
      "accessed": "2026-11-01"
    },
    "nsys": {
      "title": "Nsight Systems User Guide",
      "url": "https://docs.nvidia.com/nsight-systems/UserGuide/index.html",
      "accessed": "2026-11-01",
      "note": "扩展阅读；不据此提供版本特定性能结论"
    },
    "ncu": {
      "title": "Nsight Compute Profiling Guide",
      "url": "https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html",
      "accessed": "2026-11-01",
      "note": "扩展阅读；不据此提供版本特定性能结论"
    },
    "cutlass": {
      "title": "CUTLASS 官方文档",
      "url": "https://docs.nvidia.com/cutlass/latest/",
      "accessed": "2026-11-01",
      "note": "扩展阅读；不据此提供版本特定性能结论"
    },
    "raycore": {
      "title": "Ray Core 官方文档",
      "url": "https://docs.ray.io/en/latest/ray-core/walkthrough.html",
      "accessed": "2026-11-01"
    },
    "http": {
      "title": "HTTP Semantics RFC 9110",
      "url": "https://www.rfc-editor.org/rfc/rfc9110.html",
      "accessed": "2026-11-01",
      "note": "扩展阅读；不据此提供版本特定性能结论"
    },
    "awq": {
      "title": "AWQ 原始论文",
      "url": "https://arxiv.org/abs/2306.00978",
      "accessed": "2026-11-01",
      "note": "扩展阅读；不据此提供版本特定性能结论"
    },
    "gptq": {
      "title": "GPTQ 原始论文",
      "url": "https://arxiv.org/abs/2210.17323",
      "accessed": "2026-11-01",
      "note": "扩展阅读；不据此提供版本特定性能结论"
    },
    "spec": {
      "title": "Speculative Decoding 原始论文",
      "url": "https://arxiv.org/abs/2211.17192",
      "accessed": "2026-11-01"
    },
    "pods": {
      "title": "Kubernetes Pods",
      "url": "https://kubernetes.io/docs/concepts/workloads/pods/",
      "accessed": "2026-11-01",
      "note": "扩展阅读；不据此提供版本特定性能结论"
    },
    "vllmopt": {
      "title": "vLLM Optimization and Tuning",
      "url": "https://docs.vllm.ai/en/latest/configuration/optimization/",
      "accessed": "2026-11-01",
      "note": "扩展阅读；不据此提供版本特定性能结论"
    },
    "vllmpd": {
      "title": "vLLM Disaggregated Prefilling",
      "url": "https://docs.vllm.ai/en/latest/features/disagg_prefill/",
      "accessed": "2026-11-01",
      "note": "扩展阅读；不据此提供版本特定性能结论"
    },
    "npu": {
      "title": "Intel AI Hardware",
      "url": "https://www.intel.com/content/www/us/en/learn/ai-hardware.html",
      "accessed": "2026-11-01"
    },
    "gpu": {
      "title": "CUDA Guide Introduction",
      "url": "https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/introduction.html",
      "accessed": "2026-11-01",
      "note": "扩展阅读；不据此提供版本特定性能结论"
    },
    "agent": {
      "title": "Anthropic Building effective agents",
      "url": "https://www.anthropic.com/research/building-effective-agents",
      "accessed": "2026-11-01",
      "note": "扩展阅读；不据此提供版本特定性能结论"
    },
    "rest": {
      "title": "Fielding REST 架构约束 原始论文",
      "url": "https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm",
      "accessed": "2026-11-01"
    },
    "cuda_vector_add": {
      "title": "CUDA C++ 编程指南 向量加法",
      "url": "https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/intro-to-cuda-cpp.html",
      "accessed": "2026-11-03"
    },
    "triton_vector_add": {
      "title": "Triton 官方教程 向量加法",
      "url": "https://triton-lang.org/main/getting-started/tutorials/01-vector-add.html",
      "accessed": "2026-11-03"
    },
    "pytorch_autograd": {
      "title": "PyTorch Automatic Differentiation with torch.autograd",
      "url": "https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html",
      "accessed": "2026-11-04"
    },
    "vllm_scheduler": {
      "title": "vLLM 推理引擎与统一调度",
      "url": "https://vllm-project.github.io/2025/09/05/anatomy-of-vllm.html",
      "accessed": "2026-11-04"
    },
    "fsdp": {
      "title": "PyTorch Fully Sharded Data Parallel",
      "url": "https://docs.pytorch.org/docs/stable/fsdp.html",
      "accessed": "2026-11-04"
    },
    "llama3": {
      "title": "Meta Llama 3 模型论文与架构参数",
      "url": "https://arxiv.org/html/2407.21783",
      "accessed": "2026-11-04"
    },
    "cuda_execution": {
      "title": "NVIDIA CUDA 执行模型",
      "url": "https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html",
      "accessed": "2026-11-04"
    },
    "cuda_platform": {
      "title": "NVIDIA CUDA 平台组件",
      "url": "https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/cuda-platform.html",
      "accessed": "2026-11-04"
    },
    "gpu_container": {
      "title": "NVIDIA Container Toolkit 架构",
      "url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/arch-overview.html",
      "accessed": "2026-11-04"
    },
    "nccl_collectives": {
      "title": "NCCL 集体通信操作",
      "url": "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/collectives.html",
      "accessed": "2026-11-04"
    },
    "dataloader": {
      "title": "PyTorch 数据加载",
      "url": "https://docs.pytorch.org/docs/stable/data.html",
      "accessed": "2026-11-04"
    },
    "checkpoint": {
      "title": "PyTorch Distributed Checkpoint",
      "url": "https://docs.pytorch.org/docs/stable/distributed.checkpoint.html",
      "accessed": "2026-11-04"
    },
    "generation": {
      "title": "Hugging Face Transformers 生成接口",
      "url": "https://huggingface.co/docs/transformers/main_classes/text_generation",
      "accessed": "2026-11-04"
    },
    "gqa": {
      "title": "GQA 与 MQA 原始论文",
      "url": "https://arxiv.org/abs/2305.13245",
      "accessed": "2026-11-04"
    },
    "probes": {
      "title": "Kubernetes 容器探针",
      "url": "https://kubernetes.io/docs/concepts/workloads/pods/probes/",
      "accessed": "2026-11-04"
    },
    "rollout": {
      "title": "Kubernetes Deployment 发布与回退",
      "url": "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
      "accessed": "2026-11-04"
    },
    "registry": {
      "title": "MLflow Model Registry",
      "url": "https://mlflow.org/docs/latest/ml/model-registry/",
      "accessed": "2026-11-04"
    },
    "otel": {
      "title": "OpenTelemetry 可观测信号",
      "url": "https://opentelemetry.io/docs/concepts/signals/",
      "accessed": "2026-11-04"
    },
    "goodput": {
      "title": "DistServe 论文中的 SLO 与 Goodput",
      "url": "https://arxiv.org/abs/2401.09670",
      "accessed": "2026-11-04"
    },
    "dpo": {
      "title": "Direct Preference Optimization 原始论文",
      "url": "https://arxiv.org/abs/2305.18290",
      "accessed": "2026-11-04"
    },
    "http429": {
      "title": "HTTP 429 RFC 6585",
      "url": "https://www.rfc-editor.org/rfc/rfc6585#section-4",
      "accessed": "2026-11-04"
    }
  },
  "slides": [
    {
      "id": "S01",
      "chapter": 1,
      "title": "聊天机器人怎样服务更多人？",
      "subtitle": "从一次问答到一批同时到达的请求",
      "kind": "opening",
      "targetSeconds": 60,
      "terms": [
        "AI Infra",
        "LLM",
        "Concurrency"
      ],
      "sources": [
        "vllm",
        "metrics",
        "vllm_scheduler"
      ],
      "steps": [
        {
          "label": "输入第一条问题",
          "narration": "你有没有遇到过这种情况：同一个聊天机器人，有时刚发出去就开始回答，有时对话框却空着好几秒。模型这段时间在做什么？",
          "phase": [
            0,
            1800
          ],
          "id": "S01.0",
          "estimatedSeconds": 13,
          "captions": [
            "你有没有遇到过这种情况：同一个聊天机器人，有时刚发出去就开始回答，",
            "有时对话框却空着好几秒。",
            "模型这段时间在做什么？"
          ]
        },
        {
          "label": "发送第一条问题",
          "narration": "先只发一条问题。留意一下，从点击发送到看到第一段回答，中间隔了多久。",
          "phase": [
            0,
            550
          ],
          "id": "S01.1",
          "estimatedSeconds": 9,
          "captions": [
            "先只发一条问题。",
            "留意一下，从点击发送到看到第一段回答，中间隔了多久。"
          ]
        },
        {
          "label": "请求抵达服务端",
          "narration": "消息穿过网络到达服务端。到这里，模型还没有开始回答，服务端还得安排这次请求由谁处理、什么时候执行。",
          "phase": [
            550,
            2220
          ],
          "id": "S01.4",
          "frame": 1,
          "estimatedSeconds": 12,
          "captions": [
            "消息穿过网络到达服务端。",
            "到这里，模型还没有开始回答，",
            "服务端还得安排这次请求由谁处理、什么时候执行。"
          ]
        },
        {
          "label": "回复开头返回",
          "narration": "模型算出第一个 Token 之后，服务器就可以先把它发回来，不必等整段回答全部生成。",
          "phase": [
            2220,
            4910
          ],
          "id": "S01.5",
          "frame": 1,
          "estimatedSeconds": 10,
          "captions": [
            "模型算出第一个 Token 之后，服务器就可以先把它发回来，",
            "不必等整段回答全部生成。"
          ]
        },
        {
          "label": "流式补全回答",
          "narration": "这种边生成边发送的方式叫流式输出。你已经能读到开头，模型其实还在继续往下算。",
          "phase": [
            4910,
            6900
          ],
          "id": "S01.6",
          "frame": 1,
          "estimatedSeconds": 10,
          "captions": [
            "这种边生成边发送的方式叫流式输出。",
            "你已经能读到开头，模型其实还在继续往下算。"
          ]
        },
        {
          "label": "更多人打开聊天窗口",
          "narration": "刚才只有一个人在提问。如果现在有十二个人几乎同时打开聊天窗口呢？",
          "phase": [
            0,
            710
          ],
          "id": "S01.2",
          "estimatedSeconds": 9,
          "captions": [
            "刚才只有一个人在提问。如果现在有十二个人几乎同时打开聊天窗口呢？"
          ]
        },
        {
          "label": "十二条请求汇入同一个入口",
          "narration": "十二条请求都到了同一个入口。服务端要安排它们什么时候执行，也要决定哪些请求可以放在同一轮里一起计算。",
          "phase": [
            710,
            4300
          ],
          "id": "S01.7",
          "frame": 2,
          "estimatedSeconds": 12,
          "captions": [
            "十二条请求都到了同一个入口。",
            "服务端要安排它们什么时候执行，",
            "也要决定哪些请求可以放在同一轮里一起计算。"
          ]
        },
        {
          "label": "四条请求用满缓存预算",
          "narration": "先做一个简化假设：这张 GPU 能分给请求上下文的显存，只够四条请求使用。四条占满以后，新来的请求就算已经到达，也得等空间腾出来。",
          "phase": [
            0,
            4700
          ],
          "id": "S01.3",
          "estimatedSeconds": 14,
          "captions": [
            "先做一个简化假设：这张 GPU 能分给请求上下文的显存，只够四条请求使用。",
            "四条占满以后，新来的请求就算已经到达，也得等空间腾出来。"
          ]
        },
        {
          "label": "第 05 条等待缓存释放",
          "narration": "我们把第五条记下来。它问的是“推荐一道晚餐”。消息已经送到服务器了，只是暂时还没有位置开始执行。",
          "phase": [
            4700,
            8500
          ],
          "id": "S01.8",
          "frame": 3,
          "estimatedSeconds": 11,
          "captions": [
            "我们把第五条记下来。它问的是“推荐一道晚餐”。",
            "消息已经送到服务器了，只是暂时还没有位置开始执行。"
          ]
        },
        {
          "label": "释放的缓存交给第 05 条",
          "narration": "等第一条请求结束，它占用的缓存块就能归还。调度器看到空间够了，才会把第五条请求放进来。",
          "phase": [
            8500,
            10500
          ],
          "id": "S01.9",
          "frame": 3,
          "estimatedSeconds": 11,
          "captions": [
            "等第一条请求结束，它占用的缓存块就能归还。",
            "调度器看到空间够了，才会把第五条请求放进来。"
          ]
        },
        {
          "label": "标出首段文字出现的时刻",
          "narration": "所以用户看到第一段回答之前，其实可能经历了两段等待：先在队列里等资源，再等模型算出第一个 Token。",
          "phase": [
            10500,
            12400
          ],
          "id": "S01.10",
          "frame": 3,
          "estimatedSeconds": 12,
          "captions": [
            "所以用户看到第一段回答之前，其实可能经历了两段等待：",
            "先在队列里等资源，再等模型算出第一个 Token。"
          ]
        },
        {
          "label": "重放单卡分配",
          "narration": "现在把刚才的场景重放一遍。如果只有一张卡，而且缓存已经被占满，第五条还是只能继续等。",
          "phase": [
            16200,
            19500
          ],
          "id": "S01.11",
          "frame": 3,
          "estimatedSeconds": 10,
          "captions": [
            "现在把刚才的场景重放一遍。",
            "如果只有一张卡，而且缓存已经被占满，第五条还是只能继续等。"
          ]
        },
        {
          "label": "重放双卡分配",
          "narration": "再给它一张卡，并在第二张卡上放一份完整模型。假设第二个副本还有空位，第五条就可以被分过去，不必等第一张卡释放资源。",
          "phase": [
            19500,
            22600
          ],
          "id": "S01.12",
          "frame": 3,
          "estimatedSeconds": 13,
          "captions": [
            "再给它一张卡，并在第二张卡上放一份完整模型。",
            "假设第二个副本还有空位，第五条就可以被分过去，不必等第一张卡释放资源。"
          ]
        },
        {
          "label": "从等待时间转到答案能否用",
          "narration": "给第五条请求腾出位置，它就能早点开始生成。但用户等到的答案，能不能拿去办事？碰上公司的规定，回答里给错一天都可能误事。",
          "phase": [
            22600,
            24100
          ],
          "id": "S01.13",
          "frame": 3,
          "estimatedSeconds": 14,
          "captions": [
            "给第五条请求腾出位置，它就能早点开始生成。",
            "但用户等到的答案，能不能拿去办事？",
            "碰上公司的规定，回答里给错一天都可能误事。"
          ]
        }
      ],
      "estimatedSeconds": 160,
      "transition": "读完后按 Space，进入下一页第一句。",
      "demo": {
        "question": "什么是人工智能？",
        "answer": [
          "人工智能是一类让计算机完成某些",
          "通常需要人类智能才能完成的任务的技术。",
          "例如，识别照片里的物体，或回答你的问题。"
        ],
        "otherQuestions": [
          "解释光合作用",
          "写一封请假邮件",
          "把这句话译成英文",
          "推荐一道晚餐",
          "月亮为什么会圆？",
          "帮我检查这段代码",
          "总结这篇文章",
          "怎么整理旅行行李？",
          "解释二进制",
          "帮我拟一个标题",
          "算一下这笔账"
        ],
        "followUp": "再举一个例子",
        "cacheCapacity": 4
      }
    },
    {
      "id": "S02",
      "chapter": 1,
      "title": "算法、应用与基础设施",
      "subtitle": "用长文档问答说明三类工作的分工",
      "kind": "roles",
      "targetSeconds": 60,
      "terms": [
        "AI Infra",
        "Training",
        "Inference",
        "Model Serving"
      ],
      "sources": [
        "pytorch",
        "vllm"
      ],
      "steps": [
        {
          "label": "报销提问",
          "narration": "比如你在公司的知识库里问：“这次出差的报销最晚哪天提交？”模型给了一个日期，但这个日期真的符合制度吗？",
          "phase": [
            0,
            450
          ],
          "id": "S02.0",
          "estimatedSeconds": 12,
          "captions": [
            "比如你在公司的知识库里问：“这次出差的报销最晚哪天提交？”",
            "模型给了一个日期，但这个日期真的符合制度吗？"
          ]
        },
        {
          "label": "对照模型回答和手册原文",
          "narration": "模型回答说十天内，可手册原文写的是“返程后十个工作日”。少了“工作”两个字，最后算出来的日期就可能不一样。",
          "phase": [
            450,
            1230
          ],
          "id": "S02.4",
          "frame": 0,
          "estimatedSeconds": 12,
          "captions": [
            "模型回答说十天内，可手册原文写的是“返程后十个工作日”。",
            "少了“工作”两个字，最后算出来的日期就可能不一样。"
          ]
        },
        {
          "label": "检查模型是否读准条件",
          "narration": "算法侧可以设计一组报销题，专门测模型能不能分清工作日和自然日。要判断它有没有读准条件，手里得先有正确的条款。",
          "phase": [
            1230,
            1690
          ],
          "id": "S02.5",
          "frame": 0,
          "estimatedSeconds": 12,
          "captions": [
            "算法侧可以设计一组报销题，",
            "专门测模型能不能分清工作日和自然日。",
            "要判断它有没有读准条件，手里得先有正确的条款。"
          ]
        },
        {
          "label": "检索出差旅条款",
          "narration": "这一步可以交给应用。它到知识库里检索，找到差旅报销办法的第四条，再取出里面关于报销期限的规定。",
          "phase": [
            0,
            910
          ],
          "id": "S02.1",
          "estimatedSeconds": 12,
          "captions": [
            "这一步可以交给应用。",
            "它到知识库里检索，找到差旅报销办法的第四条，",
            "再取出里面关于报销期限的规定。"
          ]
        },
        {
          "label": "展示带引用的回答",
          "narration": "应用把问题和检索到的条款一起发给模型，回答时再附上引用。这样用户不只看到结论，也能回到手册里核对依据。",
          "phase": [
            910,
            1480
          ],
          "id": "S02.6",
          "frame": 1,
          "estimatedSeconds": 12,
          "captions": [
            "应用把问题和检索到的条款一起发给模型，回答时再附上引用。",
            "这样用户不只看到结论，也能回到手册里核对依据。"
          ]
        },
        {
          "label": "报销问答进入等待区",
          "narration": "不过，资料找到了不代表答案马上就能出来。业务高峰时，请求可能还要在服务端排队，等到有计算资源再执行。",
          "phase": [
            0,
            440
          ],
          "id": "S02.2",
          "estimatedSeconds": 12,
          "captions": [
            "不过，资料找到了不代表答案马上就能出来。",
            "业务高峰时，请求可能还要在服务端排队，等到有计算资源再执行。"
          ]
        },
        {
          "label": "把请求交给 GPU",
          "narration": "轮到这条请求时，调度系统要为它找到可用的 GPU 资源。这里不只是找一张卡，还要看卡上是否有足够的运行空间。",
          "phase": [
            440,
            1480
          ],
          "id": "S02.7",
          "frame": 2,
          "estimatedSeconds": 12,
          "captions": [
            "轮到这条请求时，调度系统要为它找到可用的 GPU 资源。",
            "这里不只是找一张卡，还要看卡上是否有足够的运行空间。"
          ]
        },
        {
          "label": "显示 GPU 上的缓存占用",
          "narration": "尤其是后续生成要用到的 KV Cache，也需要占用显存。卡虽然空着，但如果缓存空间不够，服务也未必能接下新请求。",
          "phase": [
            1480,
            2280
          ],
          "id": "S02.8",
          "frame": 2,
          "estimatedSeconds": 12,
          "captions": [
            "尤其是后续生成要用到的 KV Cache，也需要占用显存。",
            "卡虽然空着，但如果缓存空间不够，服务也未必能接下新请求。"
          ]
        },
        {
          "label": "从在线服务转到训练资源",
          "narration": "应用负责找条款，模型负责读条款、写回答。让模型训练得起来，也让上线后的请求有资源可用，靠的是 AI 基础设施，也就是 AI Infra。它为训练和在线服务提供算力、存储和网络，并协调这些资源。",
          "focus": [
            "$ .concept-copy p"
          ],
          "id": "S02.9",
          "frame": 2,
          "estimatedSeconds": 20,
          "captions": [
            "应用负责找条款，模型负责读条款、写回答。",
            "让模型训练得起来，也让上线后的请求有资源可用，",
            "靠的是 AI 基础设施，也就是 AI Infra。",
            "它为训练和在线服务提供算力、存储和网络，并协调这些资源。"
          ]
        },
        {
          "label": "上传完整差旅手册",
          "narration": "再把问题扩大一点：用户上传的不再是一条制度，而是整本差旅手册。应用需要处理更长的材料，模型也要读更多内容。",
          "phase": [
            0,
            900
          ],
          "id": "S02.3",
          "estimatedSeconds": 12,
          "captions": [
            "再把问题扩大一点：用户上传的不再是一条制度，而是整本差旅手册。",
            "应用需要处理更长的材料，模型也要读更多内容。"
          ]
        },
        {
          "label": "显示应用侧的交付",
          "narration": "应用侧要保证文件上传、检索和引用展示都能正常工作。用户点开引用，应该能找到回答对应的原文，而不只是看到一段没有出处的结论。",
          "phase": [
            900,
            1190
          ],
          "id": "S02.10",
          "frame": 3,
          "estimatedSeconds": 14,
          "captions": [
            "应用侧要保证文件上传、检索和引用展示都能正常工作。",
            "用户点开引用，应该能找到回答对应的原文，",
            "而不只是看到一段没有出处的结论。"
          ]
        },
        {
          "label": "显示算法侧的检验",
          "narration": "算法侧要检查材料变长以后，模型是否还能找对条款、读准条件。资料变多，模型不一定就能自动答得更好。",
          "phase": [
            1190,
            1500
          ],
          "id": "S02.11",
          "frame": 3,
          "estimatedSeconds": 11,
          "captions": [
            "算法侧要检查材料变长以后，模型是否还能找对条款、读准条件。",
            "资料变多，模型不一定就能自动答得更好。"
          ]
        },
        {
          "label": "显示基础设施侧的测量",
          "narration": "基础设施侧则要关心长文会占多少显存、处理要花多长时间，以及高峰时还能同时服务多少人。要测这些指标，模型和服务得先真正跑起来。",
          "phase": [
            1500,
            1810
          ],
          "id": "S02.12",
          "frame": 3,
          "estimatedSeconds": 14,
          "captions": [
            "基础设施侧则要关心长文会占多少显存、处理要花多长时间，",
            "以及高峰时还能同时服务多少人。",
            "要测这些指标，模型和服务得先真正跑起来。"
          ]
        }
      ],
      "estimatedSeconds": 167,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S30",
      "chapter": 1,
      "title": "一个模型怎样走到上线",
      "subtitle": "沿着模型产物走一遍生命周期",
      "kind": "extension",
      "sources": [
        "llama3",
        "dataloader",
        "checkpoint",
        "registry",
        "quant"
      ],
      "terms": [
        "Training",
        "Inference",
        "Checkpoint",
        "Model Registry",
        "SFT",
        "DPO"
      ],
      "steps": [
        {
          "id": "S30.0",
          "label": "准备训练数据",
          "narration": "刚才是应用把现行条款交给模型。模型读懂条款、组织回答的能力，则来自上线前的训练。训练从数据开始，要先清洗、去重、分词，再整理成样本。",
          "estimatedSeconds": 16,
          "captions": [
            "刚才是应用把现行条款交给模型。",
            "模型读懂条款、组织回答的能力，则来自上线前的训练。",
            "训练从数据开始，要先清洗、去重、分词，再整理成样本。"
          ]
        },
        {
          "id": "S30.1",
          "label": "从数据得到权重",
          "narration": "训练程序把样本分批送进 GPU，反复计算并更新模型参数。预训练让模型从大量数据中学习语言规律，之后还可以用监督微调，也就是 SFT，利用示范问答让它更适合具体任务。",
          "estimatedSeconds": 17,
          "captions": [
            "训练程序把样本分批送进 GPU，反复计算并更新模型参数。",
            "预训练让模型从大量数据中学习语言规律，之后还可以用监督微调，",
            "也就是 SFT，利用示范问答让它更适合具体任务。"
          ]
        },
        {
          "id": "S30.2",
          "label": "用留出的样本评估",
          "narration": "训练结束不等于模型就能上线。我们还要拿训练时没见过的样本做评估，比如换一个返程日期，检查它能不能继续正确理解“工作日”。",
          "estimatedSeconds": 14,
          "captions": [
            "训练结束不等于模型就能上线。",
            "我们还要拿训练时没见过的样本做评估，比如换一个返程日期，",
            "检查它能不能继续正确理解“工作日”。"
          ]
        },
        {
          "id": "S30.3",
          "label": "调整格式并重新评估",
          "narration": "准备上线时，模型可能还要转换格式，或者做量化来减少权重占用。处理完不能直接假定效果没变，必须用最终要部署的那份模型重新评估。",
          "estimatedSeconds": 14,
          "captions": [
            "准备上线时，模型可能还要转换格式，或者做量化来减少权重占用。",
            "处理完不能直接假定效果没变，必须用最终要部署的那份模型重新评估。"
          ]
        },
        {
          "id": "S30.4",
          "label": "把产物加载到服务",
          "narration": "评估通过后，部署系统要拿到的不只是权重，还包括模型配置、分词器和版本信息。它们要配套交付，服务才能正确加载这一版模型。",
          "estimatedSeconds": 13,
          "captions": [
            "评估通过后，部署系统要拿到的不只是权重，",
            "还包括模型配置、分词器和版本信息。",
            "它们要配套交付，服务才能正确加载这一版模型。"
          ]
        },
        {
          "id": "S30.5",
          "label": "开始接收在线请求",
          "narration": "服务启动并通过检查之后，才开始接收真实请求。线上通常是一套权重服务很多用户，推理系统要安排请求一起计算，也要分别保存每个人的上下文。",
          "estimatedSeconds": 15,
          "captions": [
            "服务启动并通过检查之后，才开始接收真实请求。",
            "线上通常是一套权重服务很多用户，",
            "推理系统要安排请求一起计算，也要分别保存每个人的上下文。"
          ]
        },
        {
          "id": "S30.6",
          "label": "沿监控反馈回到评估",
          "narration": "上线之后，工作也没有结束。我们要持续观察延迟、错误率和资源占用；如果发现模型总在某类日期题上出错，就把这些案例补进评测集，进入下一轮改进。",
          "estimatedSeconds": 15,
          "captions": [
            "上线之后，工作也没有结束。",
            "我们要持续观察延迟、错误率和资源占用；",
            "如果发现模型总在某类日期题上出错，",
            "就把这些案例补进评测集，进入下一轮改进。"
          ]
        }
      ],
      "estimatedSeconds": 104
    },
    {
      "id": "S03",
      "chapter": 1,
      "title": "AI Infra 技术全景图",
      "subtitle": "从计算设备到在线服务，按职责找到工具的位置",
      "kind": "map",
      "targetSeconds": 60,
      "terms": [
        "GPU",
        "CUDA",
        "PyTorch",
        "vLLM",
        "Docker",
        "Kubernetes",
        "Ray",
        "NPU",
        "NCCL",
        "Hugging Face Transformers",
        "Observability"
      ],
      "sources": [
        "cuda_platform",
        "triton",
        "rocm",
        "cann",
        "gpu_container",
        "pytorch",
        "generation",
        "nccl_collectives",
        "deepspeed",
        "megatron",
        "vllm",
        "sglang",
        "trt",
        "k8s",
        "ray",
        "otel"
      ],
      "steps": [
        {
          "label": "区分技术地图和模型生命周期",
          "narration": "刚才我们沿着一个模型，看了它从训练到上线的过程。现在换个角度：要把这整套流程搭起来，硬件、软件和服务组件究竟怎样衔接？",
          "id": "S03.0",
          "estimatedSeconds": 13,
          "captions": [
            "刚才我们沿着一个模型，看了它从训练到上线的过程。",
            "现在换个角度：要把这整套流程搭起来，硬件、软件和服务组件究竟怎样衔接？"
          ]
        },
        {
          "label": "识别三类计算设备",
          "narration": "模型的训练和推理都要在设备上做计算。一台服务器里，CPU 负责通用控制和数据准备，GPU 适合同时做大量相似的运算。有些系统会用专门面向神经网络计算的处理器，比如 NPU。",
          "id": "S03.4",
          "frame": 0,
          "estimatedSeconds": 18,
          "phase": [
            0,
            1000
          ],
          "captions": [
            "模型的训练和推理都要在设备上做计算。",
            "一台服务器里，CPU 负责通用控制和数据准备，",
            "GPU 适合同时做大量相似的运算。",
            "有些系统会用专门面向神经网络计算的处理器，比如 NPU。"
          ]
        },
        {
          "label": "追踪存储与通信的路径",
          "narration": "计算开始前，数据得先到设备上。模型文件可以放在 SSD 上，CPU 用 DDR 这类系统内存，GPU 则有自己的设备内存，高性能加速卡常用 HBM。几张卡一起计算时，还可能通过 PCIe 或 NVLink 交换数据。跨服务器通信，则可能用到 InfiniBand。",
          "id": "S03.5",
          "frame": 0,
          "estimatedSeconds": 23,
          "phase": [
            0,
            1000
          ],
          "captions": [
            "计算开始前，数据得先到设备上。",
            "模型文件可以放在 SSD 上，CPU 用 DDR 这类系统内存，",
            "GPU 则有自己的设备内存，高性能加速卡常用 HBM。",
            "几张卡一起计算时，还可能通过 PCIe 或 NVLink 交换数据。",
            "跨服务器通信，则可能用到 InfiniBand。"
          ]
        },
        {
          "label": "接通系统与设备",
          "narration": "硬件装好了，程序还需要一条调用它的路径。以 NVIDIA GPU 为例，程序可以通过 CUDA Runtime 申请显存、启动计算，再由驱动和设备打交道。开发时还可以用 Toolkit 里的编译器。程序如果装在容器里，宿主机还要开放相应的设备访问权限。",
          "id": "S03.1",
          "estimatedSeconds": 24,
          "captions": [
            "硬件装好了，程序还需要一条调用它的路径。",
            "以 NVIDIA GPU 为例，程序可以通过 CUDA Runtime 申请显存、启动计算，",
            "再由驱动和设备打交道。开发时还可以用 Toolkit 里的编译器。",
            "程序如果装在容器里，宿主机还要开放相应的设备访问权限。"
          ]
        },
        {
          "label": "把算子交给内核",
          "narration": "驱动能把工作提交给 GPU，具体怎么算还得有一段程序。这段设备端程序叫 Kernel，也就是内核。开发者可以用 CUDA C++ 或 Triton 来写。",
          "id": "S03.6",
          "frame": 1,
          "estimatedSeconds": 14,
          "phase": [
            0,
            1000
          ],
          "captions": [
            "驱动能把工作提交给 GPU，具体怎么算还得有一段程序。",
            "这段设备端程序叫 Kernel，也就是内核。",
            "开发者可以用 CUDA C++ 或 Triton 来写。"
          ]
        },
        {
          "label": "区分计算和通信库",
          "narration": "矩阵乘法这类常用计算，可以直接交给 cuBLAS。cuDNN 提供许多深度学习操作，NCCL 则负责多卡之间交换数据。这些是 NVIDIA 平台上的例子。AMD 的 GPU 有 ROCm，昇腾加速器有 CANN，各有配套的软件。",
          "id": "S03.7",
          "frame": 1,
          "estimatedSeconds": 20,
          "phase": [
            0,
            1000
          ],
          "captions": [
            "矩阵乘法这类常用计算，可以直接交给 cuBLAS。",
            "cuDNN 提供许多深度学习操作，NCCL 则负责多卡之间交换数据。",
            "这些是 NVIDIA 平台上的例子。",
            "AMD 的 GPU 有 ROCm，昇腾加速器有 CANN，各有配套的软件。"
          ]
        },
        {
          "label": "区分深度学习框架和模型库",
          "narration": "有了这些内核和库，开发者就能用更高层的工具写模型。PyTorch 提供张量运算和自动求导，可以组织前向计算和参数更新。Hugging Face Transformers 则提供现成的模型结构和加载工具。",
          "id": "S03.2",
          "estimatedSeconds": 19,
          "captions": [
            "有了这些内核和库，开发者就能用更高层的工具写模型。",
            "PyTorch 提供张量运算和自动求导，可以组织前向计算和参数更新。",
            "Hugging Face Transformers 则提供现成的模型结构和加载工具。"
          ]
        },
        {
          "label": "把训练工具和推理引擎分开",
          "narration": "训练时，要让多张卡分工，并在需要时交换梯度或模型状态。DeepSpeed 和 Megatron-LM 可以帮忙组织这些工作。模型练好以后，任务变成给用户生成回答。vLLM、SGLang 和 TensorRT-LLM 这类引擎可以组织推理计算。",
          "id": "S03.8",
          "frame": 2,
          "estimatedSeconds": 21,
          "phase": [
            0,
            1000
          ],
          "captions": [
            "训练时，要让多张卡分工，并在需要时交换梯度或模型状态。",
            "DeepSpeed 和 Megatron-LM 可以帮忙组织这些工作。",
            "模型练好以后，任务变成给用户生成回答。",
            "vLLM、SGLang 和 TensorRT-LLM 这类引擎可以组织推理计算。"
          ]
        },
        {
          "label": "让服务在集群上运行",
          "narration": "要让应用用上模型，还得把服务部署到集群里。Docker 打包程序和依赖，Kubernetes 管理容器和服务副本，Ray 可以把程序里的任务分发给不同节点。应用通过 API 发来请求，负载均衡再选一个可用的副本。",
          "id": "S03.3",
          "estimatedSeconds": 20,
          "captions": [
            "要让应用用上模型，还得把服务部署到集群里。",
            "Docker 打包程序和依赖，Kubernetes 管理容器和服务副本，",
            "Ray 可以把程序里的任务分发给不同节点。",
            "应用通过 API 发来请求，负载均衡再选一个可用的副本。"
          ]
        },
        {
          "label": "用观测信号看见运行状态",
          "narration": "最下面这条横线连着整张图，因为每一层都可能影响服务。指标告诉我们什么时候开始变慢，日志记录具体事件，Trace 则能跟着一条请求，看它在各个环节花了多少时间。如果追到 GPU 执行这一段，就要知道它是怎么算的。我们先从这层讲起。",
          "id": "S03.9",
          "frame": 3,
          "estimatedSeconds": 23,
          "phase": [
            0,
            1000
          ],
          "captions": [
            "最下面这条横线连着整张图，因为每一层都可能影响服务。",
            "指标告诉我们什么时候开始变慢，日志记录具体事件，",
            "Trace 则能跟着一条请求，看它在各个环节花了多少时间。",
            "如果追到 GPU 执行这一段，就要知道它是怎么算的。",
            "我们先从这层讲起。"
          ]
        }
      ],
      "estimatedSeconds": 195,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S04",
      "chapter": 2,
      "title": "为什么深度学习常用 GPU",
      "subtitle": "矩阵和张量运算包含大量可并行的计算",
      "kind": "parallel",
      "targetSeconds": 70,
      "terms": [
        "CPU",
        "GPU",
        "Parallel Computing",
        "Tensor Core"
      ],
      "sources": [
        "cuda_legacy",
        "cuda"
      ],
      "steps": [
        {
          "label": "显示六个输入和两条 CPU 通道",
          "narration": "先做一道很简单的题：把六个数分别乘以二。每个结果只依赖自己的输入，所以这六项之间没有先后关系，可以同时计算。",
          "phase": [
            0,
            210
          ],
          "id": "S04.0",
          "estimatedSeconds": 13,
          "captions": [
            "先做一道很简单的题：把六个数分别乘以二。",
            "每个结果只依赖自己的输入，所以这六项之间没有先后关系，可以同时计算。"
          ]
        },
        {
          "label": "第一批写回四和十八",
          "narration": "假设这次 CPU 只有两条可用的工作通道，那就先处理两项。哪一项先完成，哪一项就先把结果写回去。",
          "phase": [
            210,
            2180
          ],
          "id": "S04.4",
          "frame": 0,
          "estimatedSeconds": 11,
          "captions": [
            "假设这次 CPU 只有两条可用的工作通道，那就先处理两项。",
            "哪一项先完成，哪一项就先把结果写回去。"
          ]
        },
        {
          "label": "后两批依次通过",
          "narration": "六项数据要经过三批才能全部处理完。后两批并不是计算本身更复杂，而是在等前面的工作腾出通道。",
          "phase": [
            2180,
            5940
          ],
          "id": "S04.5",
          "frame": 0,
          "estimatedSeconds": 11,
          "captions": [
            "六项数据要经过三批才能全部处理完。",
            "后两批并不是计算本身更复杂，而是在等前面的工作腾出通道。"
          ]
        },
        {
          "label": "对照示意通道和实际 CPU 并行",
          "narration": "真实的 CPU 当然不止两条通道。多个核心可以同时执行任务；在单个核心内部，SIMD 还可以让一条指令同时处理多份数据。",
          "focus": [
            "CPU 通道"
          ],
          "id": "S04.6",
          "frame": 0,
          "estimatedSeconds": 13,
          "captions": [
            "真实的 CPU 当然不止两条通道。",
            "多个核心可以同时执行任务；",
            "在单个核心内部，SIMD 还可以让一条指令同时处理多份数据。"
          ]
        },
        {
          "label": "让六个 GPU 线程同时开始",
          "narration": "GPU 的思路更偏向大规模并行。这个例子里，我们把六项工作交给六个示意线程，让它们同时处理各自的数据。数据规模扩大时，也可以继续增加线程来分担工作。",
          "phase": [
            0,
            1220
          ],
          "id": "S04.1",
          "estimatedSeconds": 16,
          "captions": [
            "GPU 的思路更偏向大规模并行。",
            "这个例子里，我们把六项工作交给六个示意线程，让它们同时处理各自的数据。",
            "数据规模扩大时，也可以继续增加线程来分担工作。"
          ]
        },
        {
          "label": "线程把结果写回各自的位置",
          "narration": "每个线程只需要知道自己负责哪个下标：读出对应的数，乘以二，再把结果写回同一个位置。线程之间不必争抢同一份结果。",
          "phase": [
            1220,
            2190
          ],
          "id": "S04.7",
          "frame": 1,
          "estimatedSeconds": 13,
          "captions": [
            "每个线程只需要知道自己负责哪个下标：",
            "读出对应的数，乘以二，再把结果写回同一个位置。",
            "线程之间不必争抢同一份结果。"
          ]
        },
        {
          "label": "标出左上角所需的行和列",
          "narration": "矩阵乘法也能拆成许多独立的小任务。比如输出矩阵左上角的值，只需要第一个矩阵的第一行，以及第二个矩阵的第一列。",
          "phase": [
            0,
            770
          ],
          "id": "S04.2",
          "estimatedSeconds": 13,
          "captions": [
            "矩阵乘法也能拆成许多独立的小任务。",
            "比如输出矩阵左上角的值，只需要第一个矩阵的第一行，",
            "以及第二个矩阵的第一列。"
          ]
        },
        {
          "label": "写出相乘相加的结果",
          "narration": "把对应元素分别相乘，再把乘积加起来，就得到这个位置的结果。其他输出位置也有各自对应的行和列，因此可以分给不同线程并行计算。",
          "phase": [
            770,
            1030
          ],
          "id": "S04.8",
          "frame": 2,
          "estimatedSeconds": 14,
          "captions": [
            "把对应元素分别相乘，再把乘积加起来，就得到这个位置的结果。",
            "其他输出位置也有各自对应的行和列，因此可以分给不同线程并行计算。"
          ]
        },
        {
          "label": "指出 Tensor Core 的适用范围",
          "narration": "一些 GPU 还提供 Tensor Core，专门加速矩阵乘加。它并不是所有计算都能用，数据类型、矩阵形状和具体指令都要符合硬件支持的条件。",
          "focus": [
            "Tensor Core 可加速支持的矩阵形状和数值格式。"
          ],
          "id": "S04.9",
          "frame": 2,
          "estimatedSeconds": 14,
          "captions": [
            "一些 GPU 还提供 Tensor Core，专门加速矩阵乘加。",
            "它并不是所有计算都能用，",
            "数据类型、矩阵形状和具体指令都要符合硬件支持的条件。"
          ]
        },
        {
          "label": "突出 CPU 接收和准备数据",
          "narration": "在线聊天请求通常先由 CPU 一侧接收和处理。输入整理好之后，服务再把需要大量并行计算的部分交给 GPU。",
          "focus": [
            "客户端",
            "CPU",
            "接收请求、准备数据"
          ],
          "id": "S04.3",
          "estimatedSeconds": 12,
          "captions": [
            "在线聊天请求通常先由 CPU 一侧接收和处理。",
            "输入整理好之后，服务再把需要大量并行计算的部分交给 GPU。"
          ]
        },
        {
          "label": "跟踪 GPU 的计算和回传",
          "narration": "GPU 完成计算后，结果还要回到服务程序，再经过接口发送给用户。所以评估一次请求的耗时，不能只看 GPU 内核运行了多久。",
          "phase": [
            0,
            4390
          ],
          "id": "S04.10",
          "frame": 3,
          "estimatedSeconds": 13,
          "captions": [
            "GPU 完成计算后，结果还要回到服务程序，再经过接口发送给用户。",
            "所以评估一次请求的耗时，不能只看 GPU 内核运行了多久。"
          ]
        },
        {
          "label": "比较准备、传输和计算的开销",
          "narration": "如果任务很小，准备数据、启动内核和传输结果花的时间，可能比真正计算还多。GPU 并不是任务一交过去就一定更快。",
          "focus": [
            "准备、传输和计算都耗时。"
          ],
          "id": "S04.11",
          "frame": 3,
          "estimatedSeconds": 12,
          "captions": [
            "如果任务很小，",
            "准备数据、启动内核和传输结果花的时间，可能比真正计算还多。",
            "GPU 并不是任务一交过去就一定更快。"
          ]
        }
      ],
      "estimatedSeconds": 155,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S32",
      "chapter": 2,
      "title": "一批线程怎样进入 GPU",
      "subtitle": "从 Grid 逐层放大到一个线程",
      "kind": "extension",
      "sources": [
        "cuda_execution",
        "cuda"
      ],
      "terms": [
        "Grid",
        "Block",
        "Warp",
        "Thread",
        "SM",
        "CUDA Core",
        "Tensor Core",
        "Occupancy"
      ],
      "steps": [
        {
          "id": "S32.0",
          "label": "把数组分给线程",
          "narration": "现在把数组扩大到十万项。每个线程仍然可以根据自己的编号找到负责的数据，但这么多线程不可能一次全塞进 GPU 的执行单元里，硬件需要分批安排。",
          "estimatedSeconds": 15,
          "captions": [
            "现在把数组扩大到十万项。",
            "每个线程仍然可以根据自己的编号找到负责的数据，",
            "但这么多线程不可能一次全塞进 GPU 的执行单元里，硬件需要分批安排。"
          ]
        },
        {
          "id": "S32.1",
          "label": "从 Grid 分到 Block",
          "narration": "一次内核启动所覆盖的所有线程组成一个 Grid，也就是网格。Grid 会被划分成多个 Block，叫线程块；每个 Block 里放多少线程，由内核的启动配置决定。",
          "estimatedSeconds": 16,
          "captions": [
            "一次内核启动所覆盖的所有线程组成一个 Grid，也就是网格。",
            "Grid 会被划分成多个 Block，叫线程块；",
            "每个 Block 里放多少线程，由内核的启动配置决定。"
          ]
        },
        {
          "id": "S32.2",
          "label": "把 Block 分派给 SM",
          "narration": "线程块会被分派到 SM，也就是流式多处理器上执行。同一个 Block 的线程在同一个 SM 上协作；如果寄存器、共享内存等资源允许，一个 SM 也可以同时驻留多个 Block。",
          "estimatedSeconds": 17,
          "captions": [
            "线程块会被分派到 SM，也就是流式多处理器上执行。",
            "同一个 Block 的线程在同一个 SM 上协作；",
            "如果寄存器、共享内存等资源允许，一个 SM 也可以同时驻留多个 Block。"
          ]
        },
        {
          "id": "S32.3",
          "label": "在 SM 内拆成 Warp",
          "narration": "进入 SM 以后，线程还会按 Warp 分组。以 NVIDIA GPU 为例，一个 Warp 通常包含 32 个线程，调度器会从当前可执行的 Warp 中选择一组发射指令。",
          "estimatedSeconds": 15,
          "captions": [
            "进入 SM 以后，线程还会按 Warp 分组。",
            "以 NVIDIA GPU 为例，一个 Warp 通常包含 32 个线程，",
            "调度器会从当前可执行的 Warp 中选择一组发射指令。"
          ]
        },
        {
          "id": "S32.4",
          "label": "追踪一个线程的结果",
          "narration": "同一个 Warp 执行同一条指令时，各线程使用自己的数据。比如负责下标九的线程，就计算第九项，再把结果写回第九个位置。",
          "estimatedSeconds": 13,
          "captions": [
            "同一个 Warp 执行同一条指令时，各线程使用自己的数据。",
            "比如负责下标九的线程，就计算第九项，再把结果写回第九个位置。"
          ]
        },
        {
          "id": "S32.5",
          "label": "区分两类运算单元",
          "narration": "普通的整数和浮点运算会用到 CUDA Core 等执行单元；矩阵乘加也可能交给 Tensor Core。能否使用 Tensor Core，仍然取决于数据格式、形状和指令条件。",
          "estimatedSeconds": 16,
          "captions": [
            "普通的整数和浮点运算会用到 CUDA Core 等执行单元；",
            "矩阵乘加也可能交给 Tensor Core。",
            "能否使用 Tensor Core，仍然取决于数据格式、形状和指令条件。"
          ]
        },
        {
          "id": "S32.6",
          "label": "观察驻留的 Warp",
          "narration": "如果一个 Warp 因为等待数据而暂时不能执行，SM 可以切换去执行另一个已经就绪的 Warp。Occupancy，也就是占用率，描述的是驻留 Warp 相对硬件上限的比例；较高的占用率有助于隐藏延迟，但不等于性能一定更好。以模型计算为例，权重得先放得进显存，执行时还得读得够快。",
          "estimatedSeconds": 28,
          "captions": [
            "如果一个 Warp 因为等待数据而暂时不能执行，",
            "SM 可以切换去执行另一个已经就绪的 Warp。",
            "Occupancy，也就是占用率，描述的是驻留 Warp 相对硬件上限的比例；",
            "较高的占用率有助于隐藏延迟，但不等于性能一定更好。",
            "以模型计算为例，权重得先放得进显存，执行时还得读得够快。"
          ]
        }
      ],
      "estimatedSeconds": 120
    },
    {
      "id": "S05",
      "chapter": 2,
      "title": "显存容量与带宽",
      "subtitle": "模型运行需要显存空间，计算单元也需要及时读到数据",
      "kind": "memory",
      "targetSeconds": 75,
      "terms": [
        "VRAM",
        "HBM",
        "Memory Bandwidth",
        "OOM",
        "KV Cache"
      ],
      "sources": [
        "cuda",
        "cache"
      ],
      "steps": [
        {
          "label": "把模型权重装进显存",
          "narration": "模型训练完成后，推理服务要先把权重加载到 GPU 的设备内存里。这样内核执行时，才能直接访问模型参数。",
          "id": "S05.0",
          "estimatedSeconds": 12,
          "captions": [
            "模型训练完成后，推理服务要先把权重加载到 GPU 的设备内存里。",
            "这样内核执行时，才能直接访问模型参数。"
          ]
        },
        {
          "label": "观察剩余的显存格",
          "narration": "但权重装得下，只能说明模型有机会启动。真正处理请求时，还要给 KV Cache、临时张量和其他运行时开销留出空间。",
          "focus": [
            "$[data-occupied=\"false\"]"
          ],
          "id": "S05.4",
          "frame": 0,
          "estimatedSeconds": 12,
          "captions": [
            "但权重装得下，只能说明模型有机会启动。",
            "真正处理请求时，还要给 KV Cache、临时张量和其他运行时开销留出空间。"
          ]
        },
        {
          "label": "加入缓存和临时空间",
          "narration": "每条请求的上下文都要占用缓存，计算过程中也会产生临时数据。请求越多、上下文越长，显存预算就越紧。",
          "phase": [
            0,
            1430
          ],
          "id": "S05.1",
          "estimatedSeconds": 11,
          "captions": [
            "每条请求的上下文都要占用缓存，计算过程中也会产生临时数据。",
            "请求越多、上下文越长，显存预算就越紧。"
          ]
        },
        {
          "label": "超出容量的申请失败",
          "narration": "如果一次申请超过了可用显存，就可能触发 OOM，也就是内存不足。推理引擎可以通过限制并发或暂缓接收新请求，避免把资源用到无法继续执行。",
          "phase": [
            1430,
            2480
          ],
          "id": "S05.5",
          "frame": 1,
          "estimatedSeconds": 15,
          "captions": [
            "如果一次申请超过了可用显存，就可能触发 OOM，也就是内存不足。",
            "推理引擎可以通过限制并发或暂缓接收新请求，避免把资源用到无法继续执行。"
          ]
        },
        {
          "label": "观察一个数据块过通道",
          "narration": "显存还有另一个重要指标：带宽。容量回答的是“总共能放多少”，带宽回答的是“每秒能搬多少数据”，两者不是一回事。",
          "phase": [
            0,
            1440
          ],
          "id": "S05.2",
          "estimatedSeconds": 12,
          "captions": [
            "显存还有另一个重要指标：带宽。",
            "容量回答的是“总共能放多少”，",
            "带宽回答的是“每秒能搬多少数据”，两者不是一回事。"
          ]
        },
        {
          "label": "算力闲置时仍在搬数据",
          "narration": "当内核需要的数据没能及时送到，计算单元就可能停下来等待。即使 GPU 的理论算力很高，也无法弥补数据供给跟不上的问题。",
          "phase": [
            1440,
            1820
          ],
          "id": "S05.6",
          "frame": 2,
          "estimatedSeconds": 13,
          "captions": [
            "当内核需要的数据没能及时送到，计算单元就可能停下来等待。",
            "即使 GPU 的理论算力很高，也无法弥补数据供给跟不上的问题。"
          ]
        },
        {
          "label": "对照容量不足时被拒绝的块",
          "narration": "如果容量不够，可以减少数据占用、缩短上下文，或者把模型和请求分散到其他设备上。具体怎么做，要看是哪一类数据占满了显存。",
          "focus": [
            "容量上限",
            "空间不足"
          ],
          "id": "S05.3",
          "estimatedSeconds": 13,
          "captions": [
            "如果容量不够，可以减少数据占用、缩短上下文，",
            "或者把模型和请求分散到其他设备上。",
            "具体怎么做，要看是哪一类数据占满了显存。"
          ]
        },
        {
          "label": "展示片内数据复用",
          "narration": "如果主要问题是数据搬运，就要考虑复用：同一份数据能不能少从显存读几次，先留在芯片内部，让后续计算继续使用？",
          "phase": [
            0,
            5100
          ],
          "focus": [
            "减少外部读取"
          ],
          "id": "S05.7",
          "frame": 3,
          "estimatedSeconds": 12,
          "captions": [
            "如果主要问题是数据搬运，就要考虑复用：",
            "同一份数据能不能少从显存读几次，",
            "先留在芯片内部，让后续计算继续使用？"
          ]
        }
      ],
      "estimatedSeconds": 100,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S33",
      "chapter": 2,
      "title": "一个数在 GPU 里走多远",
      "subtitle": "寄存器、片上存储和设备内存各管什么",
      "kind": "extension",
      "sources": [
        "cuda_execution",
        "cuda"
      ],
      "terms": [
        "Register",
        "Shared Memory",
        "L1 / L2 Cache",
        "Global Memory"
      ],
      "steps": [
        {
          "id": "S33.0",
          "label": "先从设备内存读数据",
          "narration": "以一次读取为例，内核发出全局内存访问，请求的数据通常来自 GPU 设备内存。不过如果缓存里已经有这份数据，就不必每次都访问 HBM。",
          "estimatedSeconds": 14,
          "captions": [
            "以一次读取为例，内核发出全局内存访问，",
            "请求的数据通常来自 GPU 设备内存。",
            "不过如果缓存里已经有这份数据，就不必每次都访问 HBM。"
          ]
        },
        {
          "id": "S33.1",
          "label": "经过缓存层次",
          "narration": "以常见 NVIDIA GPU 为例，L2 缓存可以被多个 SM 共享，L1 则离各自的 SM 更近。数据命中缓存时，读取路径会更短，能减少对显存带宽的压力。",
          "estimatedSeconds": 14,
          "captions": [
            "以常见 NVIDIA GPU 为例，L2 缓存可以被多个 SM 共享，",
            "L1 则离各自的 SM 更近。",
            "数据命中缓存时，读取路径会更短，能减少对显存带宽的压力。"
          ]
        },
        {
          "id": "S33.2",
          "label": "把私有值留在寄存器",
          "narration": "数据到了线程手里，当前要反复使用的值还可以放在寄存器里。寄存器属于线程私有，读取速度很快，但数量有限。",
          "estimatedSeconds": 12,
          "captions": [
            "数据到了线程手里，当前要反复使用的值还可以放在寄存器里。",
            "寄存器属于线程私有，读取速度很快，但数量有限。"
          ]
        },
        {
          "id": "S33.3",
          "label": "让同一块线程共用数据",
          "narration": "如果一个线程块里的多个线程都要使用同一小片数据，可以先把它搬到共享内存。这样块内线程就能反复读取，不必各自从显存取一遍。",
          "estimatedSeconds": 14,
          "captions": [
            "如果一个线程块里的多个线程都要使用同一小片数据，",
            "可以先把它搬到共享内存。",
            "这样块内线程就能反复读取，不必各自从显存取一遍。"
          ]
        },
        {
          "id": "S33.4",
          "label": "把计算结果写回",
          "narration": "矩阵乘法经常利用这种数据复用：先把一块输入搬到片上，再让它参与多次乘加，尽量把中间计算留在片上完成，最后再写回结果。",
          "estimatedSeconds": 13,
          "captions": [
            "矩阵乘法经常利用这种数据复用：先把一块输入搬到片上，",
            "再让它参与多次乘加，尽量把中间计算留在片上完成，最后再写回结果。"
          ]
        }
      ],
      "estimatedSeconds": 67
    },
    {
      "id": "S06",
      "chapter": 2,
      "title": "算子与 GPU 内核",
      "subtitle": "GPU 怎样执行矩阵乘法、加法和激活？",
      "kind": "operator",
      "targetSeconds": 65,
      "terms": [
        "Operator",
        "Kernel",
        "GEMM",
        "Kernel Fusion"
      ],
      "sources": [
        "pytorch",
        "cuda",
        "cublas"
      ],
      "steps": [
        {
          "label": "矩阵乘法得到负一",
          "narration": "刚才看到矩阵乘法怎样复用片上数据。把镜头拉近，看神经网络里一个输出位置怎么算。输入的一行和权重的一列做乘加，就得到这个位置的值。",
          "phase": [
            0,
            650
          ],
          "id": "S06.0",
          "estimatedSeconds": 15,
          "captions": [
            "刚才看到矩阵乘法怎样复用片上数据。",
            "把镜头拉近，看神经网络里一个输出位置怎么算。",
            "输入的一行和权重的一列做乘加，就得到这个位置的值。"
          ]
        },
        {
          "label": "加上偏置得到负三",
          "narration": "得到这个数以后，还要加上偏置。偏置给模型多一个可学习的调整量，让输出不只由乘法结果决定。",
          "phase": [
            650,
            1080
          ],
          "id": "S06.4",
          "frame": 0,
          "estimatedSeconds": 11,
          "captions": [
            "得到这个数以后，还要加上偏置。",
            "偏置给模型多一个可学习的调整量，让输出不只由乘法结果决定。"
          ]
        },
        {
          "label": "激活后得到零",
          "narration": "接下来经过 ReLU 激活。它会把负数变成零，正数则保持不变，所以刚才这个负值最后变成了零。",
          "phase": [
            1080,
            1550
          ],
          "id": "S06.5",
          "frame": 0,
          "estimatedSeconds": 10,
          "captions": [
            "接下来经过 ReLU 激活。",
            "它会把负数变成零，正数则保持不变，所以刚才这个负值最后变成了零。"
          ]
        },
        {
          "label": "辨认三个数学操作",
          "narration": "从模型表达上看，矩阵乘法、加偏置和 ReLU 是三个不同的算子，也就是三种数学操作。它们写在模型里很简单，但落到 GPU 上，还要由具体内核来执行。",
          "focus": [
            "矩阵乘法",
            "加偏置",
            "ReLU 激活"
          ],
          "id": "S06.6",
          "frame": 0,
          "estimatedSeconds": 15,
          "captions": [
            "从模型表达上看，矩阵乘法、加偏置和 ReLU 是三个不同的算子，",
            "也就是三种数学操作。",
            "它们写在模型里很简单，但落到 GPU 上，还要由具体内核来执行。"
          ]
        },
        {
          "label": "跟踪内核的读取、计算和写回",
          "narration": "一个内核通常要完成一整段执行过程：把需要的数据读进来，做计算，再把结果写回去。除了算得对，还要考虑中间数据怎么流动。",
          "id": "S06.1",
          "estimatedSeconds": 13,
          "captions": [
            "一个内核通常要完成一整段执行过程：",
            "把需要的数据读进来，做计算，再把结果写回去。",
            "除了算得对，还要考虑中间数据怎么流动。"
          ]
        },
        {
          "label": "区分算子名称与内核的职责",
          "narration": "在 CUDA 程序里，提交给 NVIDIA GPU 执行的这段设备端程序，通常就叫 CUDA Kernel。",
          "focus": [
            "内核从显存读取输入和权重，计算后把结果写回。"
          ],
          "id": "S06.7",
          "frame": 1,
          "estimatedSeconds": 10,
          "captions": [
            "在 CUDA 程序里，提交给 NVIDIA GPU 执行的这段设备端程序，",
            "通常就叫 CUDA Kernel。"
          ]
        },
        {
          "label": "查看乘法中间结果的往返",
          "narration": "如果乘法和加法分成两个内核，乘法算出的中间结果就得先写回显存；下一步加法再把它读出来。",
          "focus": [
            "−1 写回显存，再读出"
          ],
          "id": "S06.2",
          "estimatedSeconds": 11,
          "captions": [
            "如果乘法和加法分成两个内核，乘法算出的中间结果就得先写回显存；",
            "下一步加法再把它读出来。"
          ]
        },
        {
          "label": "查看加法中间结果的往返",
          "narration": "加法之后如果再单独执行 ReLU，中间结果又要写一次、读一次。一个张量在显存和计算单元之间来回走，开销可能不小。",
          "focus": [
            "−3 写回显存，再读出"
          ],
          "id": "S06.8",
          "frame": 2,
          "estimatedSeconds": 12,
          "captions": [
            "加法之后如果再单独执行 ReLU，中间结果又要写一次、读一次。",
            "一个张量在显存和计算单元之间来回走，开销可能不小。"
          ]
        },
        {
          "label": "观察融合后的一次写回",
          "narration": "如果这几个操作能够融合，就可以在一个内核里连续完成乘法、加偏置和激活，中间结果先留在寄存器或其他片上存储里，最后再写回。",
          "phase": [
            0,
            2720
          ],
          "id": "S06.9",
          "frame": 2,
          "estimatedSeconds": 14,
          "captions": [
            "如果这几个操作能够融合，就可以在一个内核里连续完成乘法、加偏置和激活，",
            "中间结果先留在寄存器或其他片上存储里，最后再写回。"
          ]
        },
        {
          "label": "对照两条路径的相同输出",
          "narration": "两条路径算出的数学结果相同，但融合路径少了中间张量的读写，也减少了内核启动次数。对于合适的工作负载，这通常能降低开销。",
          "focus": [
            "0"
          ],
          "id": "S06.3",
          "estimatedSeconds": 14,
          "captions": [
            "两条路径算出的数学结果相同，但融合路径少了中间张量的读写，",
            "也减少了内核启动次数。",
            "对于合适的工作负载，这通常能降低开销。"
          ]
        },
        {
          "label": "指出形状和硬件会影响实现",
          "narration": "该融合几个算子，要看张量形状、寄存器压力和硬件。有时拆成多个内核反而更合适。这些算子和内核，开发者平时用什么工具写出来、交给 GPU？",
          "focus": [
            "两条执行路径都得到 0，具体实现还要看形状与硬件。"
          ],
          "id": "S06.10",
          "frame": 3,
          "estimatedSeconds": 15,
          "captions": [
            "该融合几个算子，要看张量形状、寄存器压力和硬件。",
            "有时拆成多个内核反而更合适。",
            "这些算子和内核，开发者平时用什么工具写出来、交给 GPU？"
          ]
        }
      ],
      "estimatedSeconds": 140,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S07",
      "chapter": 2,
      "title": "CUDA、Triton、PyTorch 与计算库",
      "subtitle": "用 CUDA C++ 和 Triton 给同两组数做逐项加法",
      "kind": "software",
      "targetSeconds": 120,
      "terms": [
        "CUDA",
        "Triton",
        "cuBLAS",
        "cuDNN",
        "PyTorch"
      ],
      "sources": [
        "cuda",
        "triton",
        "triton_server",
        "cublas",
        "cudnn",
        "cuda_vector_add",
        "triton_vector_add"
      ],
      "steps": [
        {
          "label": "对齐两排输入",
          "narration": "用一道加法题对照几种写法。两个数组各有六个数，把对应位置相加，得到六个结果。",
          "focus": [
            "A",
            "B"
          ],
          "id": "S07.0",
          "estimatedSeconds": 9,
          "captions": [
            "用一道加法题对照几种写法。",
            "两个数组各有六个数，把对应位置相加，得到六个结果。"
          ]
        },
        {
          "label": "框出第三列",
          "narration": "数组下标从零开始，所以第三个元素对应下标二。接下来就看程序怎样找到这个位置。",
          "focus": [
            "$[data-vector-column=\"2\"]",
            "6 + 4 = 10"
          ],
          "id": "S07.4",
          "frame": 0,
          "estimatedSeconds": 10,
          "captions": [
            "数组下标从零开始，所以第三个元素对应下标二。",
            "接下来就看程序怎样找到这个位置。"
          ]
        },
        {
          "label": "对应线程下标与数据列",
          "narration": "用 CUDA C++ 写内核时，可以根据 Block 编号、Block 内线程编号和每块线程数，算出当前线程对应的全局下标。下标为二的线程就负责第三项。",
          "phase": [
            0,
            460
          ],
          "focus": [
            "int i = blockDim.x * blockIdx.x",
            "+ threadIdx.x;",
            "$[data-vector-column=\"2\"]"
          ],
          "id": "S07.1",
          "estimatedSeconds": 14,
          "captions": [
            "用 CUDA C++ 写内核时，",
            "可以根据 Block 编号、Block 内线程编号和每块线程数，",
            "算出当前线程对应的全局下标。",
            "下标为二的线程就负责第三项。"
          ]
        },
        {
          "label": "跟踪第三列写回",
          "narration": "这个线程读出两个数组下标二处的数，也就是六和四，相加得到十，再写回结果数组的下标二。其他线程各算各的。",
          "phase": [
            460,
            1190
          ],
          "id": "S07.5",
          "frame": 1,
          "estimatedSeconds": 12,
          "captions": [
            "这个线程读出两个数组下标二处的数，也就是六和四，",
            "相加得到十，再写回结果数组的下标二。",
            "其他线程各算各的。"
          ]
        },
        {
          "label": "对照启动数和有效范围",
          "narration": "这里为了演示启动了一个包含 32 个线程的 Block，但数组只有六项。多出来的线程不能越界访问，所以要先判断下标是否小于六。",
          "focus": [
            "if (i < n) {",
            "add<<<1, 32>>>(A, B, C, 6);"
          ],
          "id": "S07.6",
          "frame": 1,
          "estimatedSeconds": 14,
          "captions": [
            "这里为了演示启动了一个包含 32 个线程的 Block，但数组只有六项。",
            "多出来的线程不能越界访问，所以要先判断下标是否小于六。"
          ]
        },
        {
          "label": "让 Triton 程序按四个位置分组",
          "narration": "Triton 提供了另一种写 GPU 内核的方式。这个例子里，每个程序实例一次处理四个位置。注意，这里说的是 Triton 编程语言，不是 NVIDIA Triton Inference Server 那个模型服务系统。",
          "phase": [
            0,
            300
          ],
          "focus": [
            "start = K * tl.program_id(0)",
            "idx = start + tl.arange(0, K)",
            "程序 1"
          ],
          "id": "S07.2",
          "estimatedSeconds": 19,
          "captions": [
            "Triton 提供了另一种写 GPU 内核的方式。",
            "这个例子里，每个程序实例一次处理四个位置。",
            "注意，这里说的是 Triton 编程语言，",
            "不是 NVIDIA Triton Inference Server 那个模型服务系统。"
          ]
        },
        {
          "label": "把遮罩与越界列对应",
          "narration": "第二组处理下标四到七，但数组在下标五就结束了。用 mask，也就是掩码，把越界位置的读取和写回关掉，避免访问不存在的数据。",
          "phase": [
            300,
            450
          ],
          "focus": [
            "valid = idx < n",
            "$[data-valid=\"false\"]"
          ],
          "id": "S07.7",
          "frame": 2,
          "estimatedSeconds": 13,
          "captions": [
            "第二组处理下标四到七，但数组在下标五就结束了。",
            "用 mask，也就是掩码，把越界位置的读取和写回关掉，",
            "避免访问不存在的数据。"
          ]
        },
        {
          "label": "写回两组的有效结果",
          "narration": "两组程序执行完，只有六个合法位置会写出结果。分组大小和启动数量都可以根据问题规模调整。",
          "phase": [
            450,
            1110
          ],
          "id": "S07.8",
          "frame": 2,
          "estimatedSeconds": 11,
          "captions": [
            "两组程序执行完，只有六个合法位置会写出结果。",
            "分组大小和启动数量都可以根据问题规模调整。"
          ]
        },
        {
          "label": "从显式内核切到框架算子",
          "narration": "如果直接用 PyTorch，代码就简单得多：写出 C 等于 A 加 B，框架会负责调用对应的张量算子。",
          "phase": [
            0,
            900
          ],
          "focus": [
            "C = A + B"
          ],
          "id": "S07.3",
          "estimatedSeconds": 11,
          "captions": [
            "如果直接用 PyTorch，代码就简单得多：写出 C 等于 A 加 B，",
            "框架会负责调用对应的张量算子。"
          ]
        },
        {
          "label": "对照六项结果",
          "narration": "框架会根据设备、数据类型和张量形状选择实现。到了 GPU 上，底层仍然要启动内核，只是线程分工和边界处理不再由我们手动写。",
          "focus": [
            "$[data-vector-result]"
          ],
          "id": "S07.9",
          "frame": 3,
          "estimatedSeconds": 13,
          "captions": [
            "框架会根据设备、数据类型和张量形状选择实现。",
            "到了 GPU 上，底层仍然要启动内核，",
            "只是线程分工和边界处理不再由我们手动写。"
          ]
        },
        {
          "label": "指出优化库与算子的对应关系",
          "narration": "对于矩阵乘法、卷积等常见操作，框架还可以调用经过优化的计算库。比如矩阵乘法常用 cuBLAS，很多深度学习算子则能使用 cuDNN。",
          "focus": [
            "$ .foundation-note"
          ],
          "id": "S07.10",
          "frame": 3,
          "estimatedSeconds": 14,
          "captions": [
            "对于矩阵乘法、卷积等常见操作，框架还可以调用经过优化的计算库。",
            "比如矩阵乘法常用 cuBLAS，很多深度学习算子则能使用 cuDNN。"
          ]
        }
      ],
      "estimatedSeconds": 140,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S31",
      "chapter": 2,
      "title": "一行 GPU 代码靠谁运行",
      "subtitle": "从程序到驱动，再到设备",
      "kind": "extension",
      "sources": [
        "cuda_platform",
        "gpu_container",
        "triton",
        "cublas"
      ],
      "terms": [
        "CUDA",
        "CUDA Runtime",
        "CUDA Toolkit",
        "GPU Driver",
        "Container Runtime"
      ],
      "steps": [
        {
          "id": "S31.0",
          "label": "从框架发起一次计算",
          "narration": "PyTorch 发起一次加法，看起来只是一行代码。可要让它真正跑在 GPU 上，还要申请设备内存、找到可用的内核，再把工作提交给设备。这中间是谁在负责？",
          "estimatedSeconds": 15,
          "captions": [
            "PyTorch 发起一次加法，看起来只是一行代码。",
            "可要让它真正跑在 GPU 上，",
            "还要申请设备内存、找到可用的内核，再把工作提交给设备。",
            "这中间是谁在负责？"
          ]
        },
        {
          "id": "S31.1",
          "label": "运行库发起调用",
          "narration": "应用通常通过 CUDA Runtime 提供的接口完成这些操作，例如申请显存、复制数据和启动内核。它是 CUDA 程序运行时经常接触的一层接口。",
          "estimatedSeconds": 14,
          "captions": [
            "应用通常通过 CUDA Runtime 提供的接口完成这些操作，",
            "例如申请显存、复制数据和启动内核。",
            "它是 CUDA 程序运行时经常接触的一层接口。"
          ]
        },
        {
          "id": "S31.2",
          "label": "驱动把工作送到设备",
          "narration": "Runtime 再通过驱动和操作系统与 GPU 交互。如果程序看不到 GPU，排查时就要从宿主机设备识别、驱动状态和运行环境开始，而不只是检查 Python 代码。",
          "estimatedSeconds": 16,
          "captions": [
            "Runtime 再通过驱动和操作系统与 GPU 交互。",
            "如果程序看不到 GPU，",
            "排查时就要从宿主机设备识别、驱动状态和运行环境开始，",
            "而不只是检查 Python 代码。"
          ]
        },
        {
          "id": "S31.3",
          "label": "工具包在开发时生成内核",
          "narration": "开发 CUDA 程序时，还会用到 CUDA Toolkit 里的编译器和开发工具，把 CUDA C++ 编译成设备能够执行的代码。部署时则要保证驱动和运行库版本兼容。",
          "estimatedSeconds": 15,
          "captions": [
            "开发 CUDA 程序时，还会用到 CUDA Toolkit 里的编译器和开发工具，",
            "把 CUDA C++ 编译成设备能够执行的代码。",
            "部署时则要保证驱动和运行库版本兼容。"
          ]
        },
        {
          "id": "S31.4",
          "label": "容器获得 GPU 访问权",
          "narration": "如果程序放进 Docker 容器，GPU 驱动通常仍由宿主机提供。容器运行时需要把允许访问的设备和相关接口映射进去，容器里的程序才能正常调用 GPU。",
          "estimatedSeconds": 15,
          "captions": [
            "如果程序放进 Docker 容器，GPU 驱动通常仍由宿主机提供。",
            "容器运行时需要把允许访问的设备和相关接口映射进去，",
            "容器里的程序才能正常调用 GPU。"
          ]
        }
      ],
      "estimatedSeconds": 75
    },
    {
      "id": "S08",
      "chapter": 2,
      "title": "计算受限与访存受限",
      "subtitle": "FlashAttention 怎样减少中间数据搬运",
      "kind": "bottleneck",
      "targetSeconds": 75,
      "terms": [
        "Compute-bound",
        "Memory-bound",
        "FlashAttention",
        "Attention"
      ],
      "sources": [
        "flash",
        "cuda"
      ],
      "steps": [
        {
          "label": "展示计算队列积压",
          "narration": "驱动成功启动了内核，速度又由什么决定？先看第一种情况。数据已经准备好了，计算单元也一直有活干，任务还是做不完。这叫计算受限。",
          "id": "S08.0",
          "estimatedSeconds": 13,
          "captions": [
            "驱动成功启动了内核，速度又由什么决定？",
            "先看第一种情况。数据已经准备好了，计算单元也一直有活干，",
            "任务还是做不完。这叫计算受限。"
          ]
        },
        {
          "label": "指出计算侧的优化位置",
          "narration": "遇到计算受限，优化方向通常是减少不必要的运算，或者提高计算单元的利用效率。单纯多搬几份数据，并不能解决计算本身做不完的问题。",
          "focus": [
            "计算"
          ],
          "id": "S08.4",
          "frame": 0,
          "estimatedSeconds": 14,
          "captions": [
            "遇到计算受限，优化方向通常是减少不必要的运算，",
            "或者提高计算单元的利用效率。",
            "单纯多搬几份数据，并不能解决计算本身做不完的问题。"
          ]
        },
        {
          "label": "展示计算单元等待数据",
          "narration": "再看另一种情况：计算单元做完手头这批工作，却迟迟等不到下一批数据。它不是算不过来，而是数据供不上，这就是访存受限。",
          "id": "S08.1",
          "estimatedSeconds": 13,
          "captions": [
            "再看另一种情况：计算单元做完手头这批工作，却迟迟等不到下一批数据。",
            "它不是算不过来，而是数据供不上，这就是访存受限。"
          ]
        },
        {
          "label": "指出搬运侧的优化位置",
          "narration": "这时要检查数据是不是被重复读取，能不能利用缓存、共享内存或分块计算，让同一份数据在芯片上多用几次，减少来回搬运。",
          "focus": [
            "HBM"
          ],
          "id": "S08.5",
          "frame": 1,
          "estimatedSeconds": 13,
          "captions": [
            "这时要检查数据是不是被重复读取，能不能利用缓存、共享内存或分块计算，",
            "让同一份数据在芯片上多用几次，减少来回搬运。"
          ]
        },
        {
          "label": "跟踪注意力中间结果写回再读出",
          "narration": "注意力计算里就有一个典型例子。朴素实现可能先生成很大的注意力分数矩阵，把它写回 HBM；接着再读出来做归一化和后续计算。",
          "id": "S08.2",
          "estimatedSeconds": 14,
          "captions": [
            "注意力计算里就有一个典型例子。",
            "朴素实现可能先生成很大的注意力分数矩阵，把它写回 HBM；",
            "接着再读出来做归一化和后续计算。"
          ]
        },
        {
          "label": "指出中间结果的搬运代价",
          "narration": "序列越长，这张中间矩阵就越大，读写它的代价也越明显。即使数学公式没变，只要减少中间结果的显存往返，就可能缩短执行时间。",
          "focus": [
            "大中间结果写回，再读出"
          ],
          "id": "S08.6",
          "frame": 2,
          "estimatedSeconds": 13,
          "captions": [
            "序列越长，这张中间矩阵就越大，读写它的代价也越明显。",
            "即使数学公式没变，只要减少中间结果的显存往返，就可能缩短执行时间。"
          ]
        },
        {
          "label": "展开 FlashAttention 的片上路径",
          "narration": "FlashAttention 的思路是分块处理注意力：把一小块 Q、K、V 读到片上，边计算边更新结果，不必把完整的注意力分数矩阵写回 HBM。问题是，后面的分块还会改变归一化结果，前面算出的部分怎么办？",
          "id": "S08.3",
          "estimatedSeconds": 20,
          "captions": [
            "FlashAttention 的思路是分块处理注意力：把一小块 Q、K、V 读到片上，",
            "边计算边更新结果，不必把完整的注意力分数矩阵写回 HBM。",
            "问题是，后面的分块还会改变归一化结果，前面算出的部分怎么办？"
          ]
        },
        {
          "label": "对照相同的注意力运算",
          "narration": "它会在每个分块到来时更新归一化所需的统计量，并据此修正已有的部分结果。数学上仍然计算同一个注意力，只是计算顺序和浮点舍入可能不同，实际能快多少要在目标设备上测。这一章看的是 GPU 怎样拿到数据、执行计算。计算中要用到的那些模型权重，又是怎样训练出来的？",
          "focus": [
            "精确 Attention · 改变读写与执行顺序"
          ],
          "id": "S08.7",
          "frame": 3,
          "estimatedSeconds": 28,
          "captions": [
            "它会在每个分块到来时更新归一化所需的统计量，并据此修正已有的部分结果。",
            "数学上仍然计算同一个注意力，",
            "只是计算顺序和浮点舍入可能不同，实际能快多少要在目标设备上测。",
            "这一章看的是 GPU 怎样拿到数据、执行计算。",
            "计算中要用到的那些模型权重，又是怎样训练出来的？"
          ]
        }
      ],
      "estimatedSeconds": 128,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S09",
      "chapter": 3,
      "title": "模型参数怎样得到",
      "subtitle": "训练用数据更新参数，线上推理通常固定权重",
      "kind": "training",
      "targetSeconds": 60,
      "terms": [
        "Training",
        "Inference",
        "LLM",
        "Transformer"
      ],
      "sources": [
        "pytorch",
        "attention"
      ],
      "steps": [
        {
          "label": "给模型一个带答案的训练样本",
          "narration": "用一个补字的小例子，看看训练怎样调整模型参数。给模型输入“天气很”，训练样本里的下一个字是“晴”。",
          "phase": [
            0,
            360
          ],
          "id": "S09.0",
          "estimatedSeconds": 10,
          "captions": [
            "用一个补字的小例子，看看训练怎样调整模型参数。",
            "给模型输入“天气很”，训练样本里的下一个字是“晴”。"
          ]
        },
        {
          "label": "对照预测与正确答案",
          "narration": "假设模型第一次更倾向于输出“冷”，给“晴”的概率只有百分之三十。训练要做的，就是把这次预测和正确答案之间的差异转成可以调整参数的信号。",
          "phase": [
            360,
            730
          ],
          "id": "S09.4",
          "frame": 0,
          "estimatedSeconds": 15,
          "captions": [
            "假设模型第一次更倾向于输出“冷”，给“晴”的概率只有百分之三十。",
            "训练要做的，就是把这次预测和正确答案之间的差异转成可以调整参数的信号。"
          ]
        },
        {
          "label": "让梯度和优化器更新参数",
          "narration": "我们先根据预测结果和正确答案计算损失，再求损失对模型参数的梯度。梯度提供了参数调整的方向，优化器据此更新参数，让模型下一次有机会预测得更好。",
          "phase": [
            0,
            1200
          ],
          "id": "S09.1",
          "estimatedSeconds": 16,
          "captions": [
            "我们先根据预测结果和正确答案计算损失，再求损失对模型参数的梯度。",
            "梯度提供了参数调整的方向，优化器据此更新参数，",
            "让模型下一次有机会预测得更好。"
          ]
        },
        {
          "label": "重新预测同一个样本",
          "narration": "用更新后的参数再看同一个样本，这次“晴”的概率升到了百分之六十。这个例子只说明模型对这道题的预测发生了变化，能不能处理没见过的新题，还要靠独立评估。",
          "phase": [
            1200,
            1890
          ],
          "id": "S09.5",
          "frame": 1,
          "estimatedSeconds": 16,
          "captions": [
            "用更新后的参数再看同一个样本，这次“晴”的概率升到了百分之六十。",
            "这个例子只说明模型对这道题的预测发生了变化，",
            "能不能处理没见过的新题，还要靠独立评估。"
          ]
        },
        {
          "label": "突出本轮改变的参数",
          "narration": "真实训练会在大量样本上反复执行这个过程，逐渐得到最终权重。训练期间除了权重，还要保存梯度和优化器状态等信息。",
          "focus": [
            "示例参数 w₁：0.12 → 0.10"
          ],
          "id": "S09.6",
          "frame": 1,
          "estimatedSeconds": 13,
          "captions": [
            "真实训练会在大量样本上反复执行这个过程，逐渐得到最终权重。",
            "训练期间除了权重，还要保存梯度和优化器状态等信息。"
          ]
        },
        {
          "label": "给训练好的模型一个新输入",
          "narration": "训练完成后，我们把参数固定下来，再换一个输入，比如“今天很”，看看模型会接出什么。这时执行的是推理，不再更新模型权重。",
          "phase": [
            0,
            560
          ],
          "id": "S09.2",
          "estimatedSeconds": 13,
          "captions": [
            "训练完成后，我们把参数固定下来，",
            "再换一个输入，比如“今天很”，看看模型会接出什么。",
            "这时执行的是推理，不再更新模型权重。"
          ]
        },
        {
          "label": "看到输出并对照固定参数",
          "narration": "示例里模型接出了“暖”。这次只是用已经训练好的参数计算输出，模型本身没有因为这次回答而改变。",
          "phase": [
            560,
            880
          ],
          "id": "S09.7",
          "frame": 2,
          "estimatedSeconds": 11,
          "captions": [
            "示例里模型接出了“暖”。",
            "这次只是用已经训练好的参数计算输出，模型本身没有因为这次回答而改变。"
          ]
        },
        {
          "label": "核对前后两边的参数值",
          "narration": "在线聊天也是这样：每次请求带来的上下文都可能不同，但同一份模型权重可以被反复读取，服务很多请求。",
          "focus": [
            "同一个 w₁ = 0.10"
          ],
          "id": "S09.8",
          "frame": 2,
          "estimatedSeconds": 12,
          "captions": [
            "在线聊天也是这样：每次请求带来的上下文都可能不同，",
            "但同一份模型权重可以被反复读取，服务很多请求。"
          ]
        },
        {
          "label": "标出大语言模型",
          "narration": "实际的大语言模型预测的不是单个汉字，而是 Token，也就是分词器切出来的片段。一个 Token 可能是一个字、一个词，也可能只是词的一部分；LLM 就是 Large Language Model，大语言模型。",
          "focus": [
            "LLM：大语言模型"
          ],
          "id": "S09.3",
          "estimatedSeconds": 19,
          "captions": [
            "实际的大语言模型预测的不是单个汉字，而是 Token，",
            "也就是分词器切出来的片段。",
            "一个 Token 可能是一个字、一个词，也可能只是词的一部分；",
            "LLM 就是 Large Language Model，大语言模型。"
          ]
        },
        {
          "label": "把参数更新交给计算框架",
          "narration": "刚才用几个数字演示了一次参数更新。真正训练时，程序要把张量运算、损失和梯度接起来，最后用梯度更新参数。这些工作可以交给 PyTorch 来组织。",
          "focus": [
            "PyTorch · 组织训练计算"
          ],
          "id": "S09.9",
          "frame": 3,
          "estimatedSeconds": 16,
          "captions": [
            "刚才用几个数字演示了一次参数更新。",
            "真正训练时，程序要把张量运算、损失和梯度接起来，",
            "最后用梯度更新参数。这些工作可以交给 PyTorch 来组织。"
          ]
        }
      ],
      "estimatedSeconds": 141,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S10",
      "chapter": 3,
      "title": "PyTorch 怎样执行模型",
      "subtitle": "张量运算、前向计算与自动求导",
      "kind": "pytorch",
      "targetSeconds": 55,
      "terms": [
        "PyTorch",
        "Tensor",
        "Autograd",
        "Training",
        "Inference"
      ],
      "sources": [
        "pytorch",
        "pytorch_autograd"
      ],
      "steps": [
        {
          "label": "显示输入张量",
          "narration": "在 PyTorch 里，模型处理的数据通常用 Tensor，也就是张量来表示。可以先把输入 x 看成一组数字特征。",
          "focus": [
            "x = torch.tensor([2., 1.])",
            "x = [2, 1]"
          ],
          "id": "S10.0",
          "estimatedSeconds": 11,
          "captions": [
            "在 PyTorch 里，模型处理的数据通常用 Tensor，也就是张量来表示。",
            "可以先把输入 x 看成一组数字特征。"
          ]
        },
        {
          "label": "显示参数张量",
          "narration": "模型还会有一组需要学习的参数 w。它们同样存放在张量里，训练时框架会跟踪这些参数，计算它们应该怎样调整。",
          "focus": [
            "w = torch.tensor([1., -3.], requires_grad=True)",
            "w = [1, −3]"
          ],
          "id": "S10.4",
          "frame": 0,
          "estimatedSeconds": 12,
          "captions": [
            "模型还会有一组需要学习的参数 w。",
            "它们同样存放在张量里，训练时框架会跟踪这些参数，计算它们应该怎样调整。"
          ]
        },
        {
          "label": "计算前向输出",
          "narration": "把输入和参数做乘加，就能得到一个预测值。从输入走到预测结果的这段过程，叫前向计算，也就是 Forward。",
          "id": "S10.1",
          "estimatedSeconds": 12,
          "captions": [
            "把输入和参数做乘加，就能得到一个预测值。",
            "从输入走到预测结果的这段过程，叫前向计算，也就是 Forward。"
          ]
        },
        {
          "label": "定位前向计算的代码行",
          "narration": "如果参数需要求梯度，PyTorch 就会记录相关操作以及它们之间的依赖关系，形成一张计算图。",
          "focus": [
            "y = x @ w"
          ],
          "id": "S10.5",
          "frame": 1,
          "estimatedSeconds": 11,
          "captions": [
            "如果参数需要求梯度，PyTorch 就会记录相关操作",
            "以及它们之间的依赖关系，形成一张计算图。"
          ]
        },
        {
          "label": "把前向结果交给损失函数",
          "narration": "接下来把预测结果和正确答案交给损失函数，算出当前预测偏差有多大。因为损失也在计算图里，框架就知道它和前面参数之间的关系。",
          "phase": [
            0,
            1250
          ],
          "id": "S10.2",
          "estimatedSeconds": 14,
          "captions": [
            "接下来把预测结果和正确答案交给损失函数，算出当前预测偏差有多大。",
            "因为损失也在计算图里，框架就知道它和前面参数之间的关系。"
          ]
        },
        {
          "label": "调用自动求导",
          "narration": "调用 backward 以后，PyTorch 会沿着计算图反向计算梯度。这一步叫自动求导，也就是 Autograd。",
          "phase": [
            1250,
            2200
          ],
          "id": "S10.6",
          "frame": 2,
          "estimatedSeconds": 11,
          "captions": [
            "调用 backward 以后，PyTorch 会沿着计算图反向计算梯度。",
            "这一步叫自动求导，也就是 Autograd。"
          ]
        },
        {
          "label": "根据梯度更新参数",
          "narration": "有了梯度，就可以按学习率调整参数。最简单的梯度下降会从原参数中减去学习率乘以梯度，得到更新后的参数。",
          "phase": [
            2200,
            3150
          ],
          "id": "S10.7",
          "frame": 2,
          "estimatedSeconds": 12,
          "captions": [
            "有了梯度，就可以按学习率调整参数。",
            "最简单的梯度下降会从原参数中减去学习率乘以梯度，得到更新后的参数。"
          ]
        },
        {
          "label": "指出优化器负责更新",
          "narration": "实际训练通常把更新交给优化器，例如 SGD 或 Adam。它们可能还会结合动量、历史梯度等状态，决定每一步怎样更新。",
          "focus": [
            "$ .foundation-note"
          ],
          "id": "S10.8",
          "frame": 2,
          "estimatedSeconds": 12,
          "captions": [
            "实际训练通常把更新交给优化器，例如 SGD 或 Adam。",
            "它们可能还会结合动量、历史梯度等状态，决定每一步怎样更新。"
          ]
        },
        {
          "label": "推理只需前向计算",
          "narration": "而在线推理只需要拿当前权重做前向计算，不需要反向求导，也不需要更新参数，因此可以省掉训练阶段的这些操作。",
          "focus": [
            "y = x @ w",
            "2 × 1 + 1 × (−3) = −1"
          ],
          "id": "S10.3",
          "estimatedSeconds": 12,
          "captions": [
            "而在线推理只需要拿当前权重做前向计算，不需要反向求导，",
            "也不需要更新参数，因此可以省掉训练阶段的这些操作。"
          ]
        },
        {
          "label": "从模型调用转向服务",
          "narration": "单卡上，前向、反向和参数更新可以按顺序完成。换成多张 GPU 后，问题就变成：数据和模型状态怎样分配，各张卡又要在什么时候交换信息？",
          "focus": [
            "服务还要接收请求、安排执行、保留缓存。"
          ],
          "id": "S10.9",
          "frame": 3,
          "estimatedSeconds": 14,
          "captions": [
            "单卡上，前向、反向和参数更新可以按顺序完成。",
            "换成多张 GPU 后，问题就变成：数据和模型状态怎样分配，",
            "各张卡又要在什么时候交换信息？"
          ]
        }
      ],
      "estimatedSeconds": 121,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S11",
      "chapter": 3,
      "title": "多卡训练怎样分工",
      "subtitle": "数据并行、张量并行和流水线并行",
      "kind": "distributed",
      "targetSeconds": 65,
      "terms": [
        "DP",
        "TP",
        "PP",
        "DeepSpeed",
        "Megatron-LM"
      ],
      "sources": [
        "distributed",
        "fsdp"
      ],
      "steps": [
        {
          "label": "区分单卡的容量和训练速度",
          "narration": "一张卡训练不动，可能是模型和训练状态根本装不下，也可能是装得下，但计算太慢。先判断瓶颈是什么，才能选合适的多卡并行方式。",
          "id": "S11.0",
          "estimatedSeconds": 14,
          "captions": [
            "一张卡训练不动，可能是模型和训练状态根本装不下，",
            "也可能是装得下，但计算太慢。",
            "先判断瓶颈是什么，才能选合适的多卡并行方式。"
          ]
        },
        {
          "label": "根据限制选择分工",
          "narration": "如果每张卡都能放下一整份模型和训练状态，就可以让它们各自处理不同的数据批次，再把计算结果同步起来。",
          "focus": [
            "装得下，训练仍可能太慢"
          ],
          "id": "S11.4",
          "frame": 0,
          "estimatedSeconds": 12,
          "captions": [
            "如果每张卡都能放下一整份模型和训练状态，",
            "就可以让它们各自处理不同的数据批次，再把计算结果同步起来。"
          ]
        },
        {
          "label": "各卡拿到完整模型和不同数据",
          "narration": "这种方式叫数据并行，也就是 DP。每张卡都有一份完整模型，但读到的是不同样本，因此可以同时处理更多数据。",
          "phase": [
            0,
            2780
          ],
          "focus": [
            "完整模型副本"
          ],
          "id": "S11.1",
          "estimatedSeconds": 12,
          "captions": [
            "这种方式叫数据并行，也就是 DP。",
            "每张卡都有一份完整模型，但读到的是不同样本，因此可以同时处理更多数据。"
          ]
        },
        {
          "label": "跟踪两卡同步梯度",
          "narration": "每张卡算出本地梯度后，需要把梯度同步起来，再用相同的结果更新参数。这样各个模型副本才能继续保持一致。",
          "phase": [
            2780,
            5860
          ],
          "focus": [
            "同步梯度"
          ],
          "id": "S11.5",
          "frame": 1,
          "estimatedSeconds": 12,
          "captions": [
            "每张卡算出本地梯度后，需要把梯度同步起来，再用相同的结果更新参数。",
            "这样各个模型副本才能继续保持一致。"
          ]
        },
        {
          "label": "单卡装不下时拆分一层",
          "narration": "如果单卡连模型的一层都放不下，就可以把这一层的参数和计算拆到多张卡上。这种按张量切分的方式叫张量并行，也就是 TP。",
          "focus": [
            "同一层的张量分片",
            "GPU 0",
            "GPU 1"
          ],
          "id": "S11.2",
          "estimatedSeconds": 13,
          "captions": [
            "如果单卡连模型的一层都放不下，就可以把这一层的参数和计算拆到多张卡上。",
            "这种按张量切分的方式叫张量并行，也就是 TP。"
          ]
        },
        {
          "label": "跟踪部分结果的交换",
          "narration": "每张卡只算一部分结果，后续步骤可能需要把这些结果交换或合并。拆分确实能降低单卡压力，但卡间通信也会带来额外开销。",
          "phase": [
            0,
            5000
          ],
          "focus": [
            "交换部分结果"
          ],
          "id": "S11.6",
          "frame": 2,
          "estimatedSeconds": 13,
          "captions": [
            "每张卡只算一部分结果，后续步骤可能需要把这些结果交换或合并。",
            "拆分确实能降低单卡压力，但卡间通信也会带来额外开销。"
          ]
        },
        {
          "label": "定位前半与后半模型阶段",
          "narration": "还有一种切法不是拆同一层，而是把不同层放在不同卡上：前几层交给第一张卡，后几层交给第二张卡。这就是流水线并行，也就是 PP。",
          "focus": [
            "模型前半阶段",
            "模型后半阶段"
          ],
          "id": "S11.3",
          "estimatedSeconds": 14,
          "phase": [
            0,
            0
          ],
          "captions": [
            "还有一种切法不是拆同一层，而是把不同层放在不同卡上：",
            "前几层交给第一张卡，后几层交给第二张卡。",
            "这就是流水线并行，也就是 PP。"
          ]
        },
        {
          "label": "推进微批次并展示训练状态分片",
          "narration": "流水线可以把不同微批次安排在不同阶段，让设备尽量持续工作。另一种常见方法是 FSDP，全分片数据并行，把参数、梯度和优化器状态分散存到多张卡上，需要时再通信和重建。",
          "phase": [
            0,
            7450
          ],
          "id": "S11.7",
          "frame": 3,
          "estimatedSeconds": 17,
          "captions": [
            "流水线可以把不同微批次安排在不同阶段，让设备尽量持续工作。",
            "另一种常见方法是 FSDP，全分片数据并行，",
            "把参数、梯度和优化器状态分散存到多张卡上，需要时再通信和重建。"
          ]
        }
      ],
      "estimatedSeconds": 107,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S34",
      "chapter": 3,
      "title": "训练任务中断后怎样接着跑",
      "subtitle": "跟着一批训练数据走到梯度同步和恢复",
      "kind": "extension",
      "sources": [
        "dataloader",
        "nccl_collectives",
        "checkpoint",
        "deepspeed",
        "megatron",
        "llama3",
        "dpo"
      ],
      "terms": [
        "NCCL",
        "AllReduce",
        "Data Loader",
        "Checkpoint",
        "Pre-training",
        "SFT",
        "RLHF",
        "DPO"
      ],
      "steps": [
        {
          "id": "S34.0",
          "label": "从训练队列申请资源",
          "narration": "并行方案写好了，训练任务提交到集群也不一定马上启动。调度系统要找到足够的 GPU 和其他资源，凑齐这一组设备后，训练进程才能一起运行。",
          "estimatedSeconds": 15,
          "captions": [
            "并行方案写好了，训练任务提交到集群也不一定马上启动。",
            "调度系统要找到足够的 GPU 和其他资源，凑齐这一组设备后，",
            "训练进程才能一起运行。"
          ]
        },
        {
          "id": "S34.1",
          "label": "把数据送到两张卡",
          "narration": "任务启动后，数据加载器要从存储读取各自的数据分片，完成预处理，再把一批数据送到 GPU。如果读盘或预处理跟不上，GPU 就可能空等。",
          "estimatedSeconds": 14,
          "captions": [
            "任务启动后，数据加载器要从存储读取各自的数据分片，完成预处理，",
            "再把一批数据送到 GPU。",
            "如果读盘或预处理跟不上，GPU 就可能空等。"
          ]
        },
        {
          "id": "S34.2",
          "label": "每张卡先求本地梯度",
          "narration": "每张卡先用自己的样本计算本地梯度。比如同一个参数，第一张卡算出的梯度是二，第二张卡算出的是六。",
          "estimatedSeconds": 11,
          "captions": [
            "每张卡先用自己的样本计算本地梯度。",
            "比如同一个参数，第一张卡算出的梯度是二，第二张卡算出的是六。"
          ]
        },
        {
          "id": "S34.3",
          "label": "通过 NCCL 聚合梯度",
          "narration": "接下来要让各卡拿到一致的梯度。在 NVIDIA 集群里，常用 NCCL 执行 AllReduce：先把两边的梯度相加，得到八，再除以两张卡，平均梯度就是四。",
          "estimatedSeconds": 15,
          "captions": [
            "接下来要让各卡拿到一致的梯度。",
            "在 NVIDIA 集群里，常用 NCCL 执行 AllReduce：先把两边的梯度相加，",
            "得到八，再除以两张卡，平均梯度就是四。"
          ]
        },
        {
          "id": "S34.4",
          "label": "各副本同步更新",
          "narration": "两张卡都用这个平均梯度更新参数，模型副本就能保持一致。卡数更多、状态更复杂时，训练框架会进一步协调参数分片和通信。",
          "estimatedSeconds": 13,
          "captions": [
            "两张卡都用这个平均梯度更新参数，模型副本就能保持一致。",
            "卡数更多、状态更复杂时，训练框架会进一步协调参数分片和通信。"
          ]
        },
        {
          "id": "S34.5",
          "label": "定期保存训练进度",
          "narration": "训练可能连续跑几个小时甚至几天，中间机器也可能故障。为了不让进度全部丢失，系统会定期保存权重、优化器状态和训练进度，这份记录叫 Checkpoint，也就是检查点。",
          "estimatedSeconds": 17,
          "captions": [
            "训练可能连续跑几个小时甚至几天，中间机器也可能故障。",
            "为了不让进度全部丢失，系统会定期保存权重、优化器状态和训练进度，",
            "这份记录叫 Checkpoint，也就是检查点。"
          ]
        },
        {
          "id": "S34.6",
          "label": "换节点恢复任务",
          "narration": "如果一台节点掉线，任务可以在其他节点上恢复。程序读取最近一次完整的 Checkpoint 接着训练；从上次保存到故障之间的进度，通常就需要重新计算。",
          "estimatedSeconds": 16,
          "captions": [
            "如果一台节点掉线，任务可以在其他节点上恢复。",
            "程序读取最近一次完整的 Checkpoint 接着训练；",
            "从上次保存到故障之间的进度，通常就需要重新计算。"
          ]
        }
      ],
      "estimatedSeconds": 101
    },
    {
      "id": "S12",
      "chapter": 4,
      "title": "推理框架解决什么问题",
      "subtitle": "多个请求如何共享 GPU 和显存？",
      "kind": "engines",
      "targetSeconds": 65,
      "terms": [
        "Inference Engine",
        "vLLM",
        "SGLang",
        "TensorRT-LLM",
        "Model Serving"
      ],
      "sources": [
        "vllm",
        "sglang",
        "trt"
      ],
      "steps": [
        {
          "label": "定位三条长度不同的输入",
          "narration": "模型已经训练好了，现在有三个人几乎同时提问：两个人只发了一句话，另一个人还附了一篇文章。怎样让他们都尽快拿到答案？",
          "focus": [
            "什么是人工智能？",
            "总结这篇文章 ＋ 附文",
            "推荐一道晚餐"
          ],
          "id": "S12.0",
          "estimatedSeconds": 13,
          "phase": [
            0,
            420
          ],
          "captions": [
            "模型已经训练好了，现在有三个人几乎同时提问：",
            "两个人只发了一句话，另一个人还附了一篇文章。怎样让他们都尽快拿到答案？"
          ]
        },
        {
          "label": "区分等待处理和正在生成",
          "narration": "推理不是把三条请求一次性塞进 GPU 就结束了。模型每完成一轮计算，系统都要重新决定下一轮让谁继续、谁先等待。",
          "phase": [
            420,
            2000
          ],
          "id": "S12.4",
          "frame": 0,
          "estimatedSeconds": 12,
          "captions": [
            "推理不是把三条请求一次性塞进 GPU 就结束了。",
            "模型每完成一轮计算，系统都要重新决定下一轮让谁继续、谁先等待。"
          ]
        },
        {
          "label": "展示各请求的输入缓存",
          "narration": "而且，生成到一半的请求不能丢掉之前的上下文。引擎要把每条请求已经算过的状态保存下来，下一轮才能接着生成。",
          "id": "S12.1",
          "estimatedSeconds": 12,
          "captions": [
            "而且，生成到一半的请求不能丢掉之前的上下文。",
            "引擎要把每条请求已经算过的状态保存下来，下一轮才能接着生成。"
          ]
        },
        {
          "label": "对照长文和短问题的输入长度",
          "narration": "长文章和短问题占用的资源不一样。长输入需要更多计算，也会产生更多 KV Cache；能不能再接一条请求，要同时看计算预算和显存余量。",
          "focus": [
            "输入 5 个 Token",
            "输入 28 个 Token"
          ],
          "id": "S12.5",
          "frame": 1,
          "estimatedSeconds": 14,
          "captions": [
            "长文章和短问题占用的资源不一样。",
            "长输入需要更多计算，也会产生更多 KV Cache；",
            "能不能再接一条请求，要同时看计算预算和显存余量。"
          ]
        },
        {
          "label": "展示 vLLM 与 SGLang",
          "narration": "负责组织这些工作的组件，叫推理引擎。vLLM 和 SGLang 都能把模型组织成在线推理服务，并管理请求、缓存和生成过程。",
          "focus": [
            "vLLM",
            "SGLang"
          ],
          "id": "S12.2",
          "estimatedSeconds": 13,
          "captions": [
            "负责组织这些工作的组件，叫推理引擎。",
            "vLLM 和 SGLang 都能把模型组织成在线推理服务，",
            "并管理请求、缓存和生成过程。"
          ]
        },
        {
          "label": "定位 NVIDIA 的推理工具",
          "narration": "NVIDIA 也提供 TensorRT-LLM，用于大模型推理优化和部署。具体选哪套工具，要结合模型结构、目标硬件、性能要求和需要的服务功能来判断。",
          "focus": [
            "TensorRT-LLM"
          ],
          "id": "S12.6",
          "frame": 2,
          "estimatedSeconds": 15,
          "captions": [
            "NVIDIA 也提供 TensorRT-LLM，用于大模型推理优化和部署。",
            "具体选哪套工具，要结合模型结构、目标硬件、",
            "性能要求和需要的服务功能来判断。"
          ]
        },
        {
          "label": "把组批、缓存和模型调用连起来",
          "narration": "可以把推理引擎理解成模型计算外面的组织者：它先挑出这一轮要执行的请求，准备好各自的缓存，再调用底层框架或内核完成模型前向。",
          "focus": [
            "每轮挑选请求 → 保留各自的 KV → 调用模型计算"
          ],
          "id": "S12.3",
          "estimatedSeconds": 14,
          "captions": [
            "可以把推理引擎理解成模型计算外面的组织者：它先挑出这一轮要执行的请求，",
            "准备好各自的缓存，再调用底层框架或内核完成模型前向。"
          ]
        },
        {
          "label": "从职责转向单条请求",
          "narration": "接下来不再同时看三个人，我们跟着第一个短问题走一遍。从它进入服务，到模型开始生成，中间究竟经过哪些环节？",
          "focus": [
            "什么是人工智能？"
          ],
          "id": "S12.7",
          "frame": 3,
          "estimatedSeconds": 12,
          "captions": [
            "接下来不再同时看三个人，我们跟着第一个短问题走一遍。",
            "从它进入服务，到模型开始生成，中间究竟经过哪些环节？"
          ]
        }
      ],
      "estimatedSeconds": 105,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S13",
      "chapter": 4,
      "title": "推理请求的执行流程",
      "subtitle": "API Server → Scheduler → Worker",
      "kind": "components",
      "targetSeconds": 65,
      "terms": [
        "API Server",
        "Scheduler",
        "Worker",
        "Inference Engine"
      ],
      "sources": [
        "vllm"
      ],
      "steps": [
        {
          "label": "跟踪聊天问题进入 API",
          "narration": "第一个用户问的是“什么是人工智能”。点击发送之后，客户端就会把这条问题作为一次请求发给模型服务。",
          "phase": [
            0,
            830
          ],
          "id": "S13.0",
          "estimatedSeconds": 11,
          "captions": [
            "第一个用户问的是“什么是人工智能”。",
            "点击发送之后，客户端就会把这条问题作为一次请求发给模型服务。"
          ]
        },
        {
          "label": "确认输入检查",
          "narration": "请求首先到达 API Server，也就是对外提供接口的服务。它会检查请求格式和必要参数，再把合法请求交给后续组件；接口服务和调度、执行模块可以分开部署，也可以放在一起。",
          "phase": [
            830,
            1140
          ],
          "id": "S13.4",
          "frame": 0,
          "estimatedSeconds": 17,
          "captions": [
            "请求首先到达 API Server，也就是对外提供接口的服务。",
            "它会检查请求格式和必要参数，",
            "再把合法请求交给后续组件；",
            "接口服务和调度、执行模块可以分开部署，也可以放在一起。"
          ]
        },
        {
          "label": "在队列里找到 A 和 B",
          "narration": "请求通过输入检查，也不代表马上能执行。比如 A 和 B 已经在等待队列里，新来的请求可能还要排在后面。",
          "focus": [
            "等待队列",
            "A",
            "B"
          ],
          "id": "S13.1",
          "estimatedSeconds": 12,
          "captions": [
            "请求通过输入检查，也不代表马上能执行。",
            "比如 A 和 B 已经在等待队列里，新来的请求可能还要排在后面。"
          ]
        },
        {
          "label": "定位做准入决定的调度器",
          "narration": "这时由 Scheduler，也就是调度器，决定谁能进入下一轮。它不仅要看 GPU 计算预算，还要看 KV Cache 是否有足够空间。",
          "focus": [
            "Scheduler"
          ],
          "id": "S13.5",
          "frame": 1,
          "estimatedSeconds": 13,
          "captions": [
            "这时由 Scheduler，也就是调度器，决定谁能进入下一轮。",
            "它不仅要看 GPU 计算预算，还要看 KV Cache 是否有足够空间。"
          ]
        },
        {
          "label": "把 A 从队列交给 Worker",
          "narration": "调度器选中 A 以后，Worker，也就是工作进程，负责调用模型执行这一轮计算。",
          "phase": [
            0,
            1910
          ],
          "id": "S13.2",
          "estimatedSeconds": 9,
          "captions": [
            "调度器选中 A 以后，Worker，也就是工作进程，",
            "负责调用模型执行这一轮计算。"
          ]
        },
        {
          "label": "沿 A 的执行路径找到缓存",
          "narration": "这一轮生成的上下文状态会继续留在缓存里。A 下一轮再被调度时，就可以沿用已有缓存，而不是从头计算整段输入。",
          "focus": [
            "KV Cache",
            "使用请求自己的缓存"
          ],
          "id": "S13.6",
          "frame": 2,
          "estimatedSeconds": 12,
          "captions": [
            "这一轮生成的上下文状态会继续留在缓存里。",
            "A 下一轮再被调度时，就可以沿用已有缓存，而不是从头计算整段输入。"
          ]
        },
        {
          "label": "沿返回路径把输出送回聊天窗口",
          "narration": "模型产生可以返回的内容后，服务会沿着原来的请求连接，把结果发送回客户端。",
          "phase": [
            0,
            1530
          ],
          "id": "S13.3",
          "estimatedSeconds": 9,
          "captions": [
            "模型产生可以返回的内容后，",
            "服务会沿着原来的请求连接，把结果发送回客户端。"
          ]
        },
        {
          "label": "定位聊天窗口的首段回答",
          "narration": "聊天窗口里现在出现了回答的开头。要理解后面的 Token 是怎样一个接一个生成的，我们先看看模型实际接收的是什么。",
          "phase": [
            1530,
            1760
          ],
          "id": "S13.7",
          "frame": 3,
          "estimatedSeconds": 13,
          "captions": [
            "聊天窗口里现在出现了回答的开头。",
            "要理解后面的 Token 是怎样一个接一个生成的，",
            "我们先看看模型实际接收的是什么。"
          ]
        }
      ],
      "estimatedSeconds": 96,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S14",
      "chapter": 4,
      "title": "分词、嵌入与注意力",
      "subtitle": "Token 是离散单位，Attention 组合上下文",
      "kind": "tokens",
      "targetSeconds": 70,
      "terms": [
        "Token",
        "Tokenization",
        "Embedding",
        "Attention",
        "Key",
        "Value"
      ],
      "sources": [
        "attention",
        "cache"
      ],
      "steps": [
        {
          "label": "把输入切成 Token",
          "narration": "用户输入的文字不会原封不动地交给模型。分词器会先把它切成一个个 Token，也就是模型词表里的基本片段。",
          "phase": [
            0,
            650
          ],
          "id": "S14.0",
          "estimatedSeconds": 12,
          "captions": [
            "用户输入的文字不会原封不动地交给模型。",
            "分词器会先把它切成一个个 Token，也就是模型词表里的基本片段。"
          ]
        },
        {
          "label": "从词表查出片段编号",
          "narration": "词表会给每种 Token 分配一个整数编号，叫 Token ID。比如这张示意图里，“人工”对应的编号是一百零六。",
          "phase": [
            650,
            1140
          ],
          "id": "S14.4",
          "frame": 0,
          "estimatedSeconds": 11,
          "captions": [
            "词表会给每种 Token 分配一个整数编号，叫 Token ID。",
            "比如这张示意图里，“人工”对应的编号是一百零六。"
          ]
        },
        {
          "label": "对应示意 Token 与 ID",
          "narration": "要注意，Token 怎么切、每个片段对应什么编号，是由具体分词器决定的。换一个模型或分词器，切分结果就可能不同。",
          "focus": [
            "$[data-token-position=\"2\"]",
            "106"
          ],
          "id": "S14.5",
          "frame": 0,
          "estimatedSeconds": 12,
          "captions": [
            "要注意，Token 怎么切、每个片段对应什么编号，是由具体分词器决定的。",
            "换一个模型或分词器，切分结果就可能不同。"
          ]
        },
        {
          "label": "从 ID 查到嵌入向量",
          "narration": "模型接下来要处理的是数字，所以会拿 Token ID 到嵌入表里查出一组向量。这个向量叫 Embedding，也就是嵌入表示。",
          "phase": [
            0,
            960
          ],
          "id": "S14.1",
          "estimatedSeconds": 13,
          "captions": [
            "模型接下来要处理的是数字，所以会拿 Token ID 到嵌入表里查出一组向量。",
            "这个向量叫 Embedding，也就是嵌入表示。"
          ]
        },
        {
          "label": "对照一百零六与示例向量",
          "narration": "一百零六只是查表用的编号，真正参与后续计算的是查出来的向量。图里为了方便只画了两个数，真实模型的向量维度要大得多。",
          "focus": [
            "106",
            "[0.6, 0.3]"
          ],
          "id": "S14.6",
          "frame": 1,
          "estimatedSeconds": 13,
          "captions": [
            "一百零六只是查表用的编号，真正参与后续计算的是查出来的向量。",
            "图里为了方便只画了两个数，真实模型的向量维度要大得多。"
          ]
        },
        {
          "label": "让当前位置的 Q 连向各位置的 K",
          "narration": "向量本身还没有告诉模型当前位置应该关注前面的哪些内容。注意力机制会用当前位置的 Q，也就是 Query，去和当前及之前位置的 K，也就是 Key，计算匹配分数。",
          "phase": [
            850,
            2090
          ],
          "id": "S14.2",
          "estimatedSeconds": 16,
          "captions": [
            "向量本身还没有告诉模型当前位置应该关注前面的哪些内容。",
            "注意力机制会用当前位置的 Q，也就是 Query，",
            "去和当前及之前位置的 K，也就是 Key，计算匹配分数。"
          ]
        },
        {
          "label": "揭示各位置的注意力权重",
          "narration": "这些分数经过归一化后变成注意力权重。权重越大，说明这个位置的信息在当前计算中的占比越高。示意图里，“人工”占了一半。",
          "phase": [
            2090,
            3450
          ],
          "id": "S14.7",
          "frame": 2,
          "estimatedSeconds": 13,
          "captions": [
            "这些分数经过归一化后变成注意力权重。",
            "权重越大，说明这个位置的信息在当前计算中的占比越高。",
            "示意图里，“人工”占了一半。"
          ]
        },
        {
          "label": "用权重组合各位置的 V",
          "narration": "接着，模型按照这些权重，对各位置的 V，也就是 Value 向量做加权求和。这样当前位置的表示就融合了前文的信息。",
          "phase": [
            4650,
            6210
          ],
          "id": "S14.8",
          "frame": 2,
          "estimatedSeconds": 12,
          "captions": [
            "接着，模型按照这些权重，对各位置的 V，也就是 Value 向量做加权求和。",
            "这样当前位置的表示就融合了前文的信息。"
          ]
        },
        {
          "label": "遮住未来的问号",
          "narration": "不过，语言模型要预测的是后面的内容，不能提前看到未来。比如当前位置在“智能”，后面的问号必须被遮住，这就是因果遮罩。",
          "phase": [
            850,
            1630
          ],
          "id": "S14.3",
          "estimatedSeconds": 13,
          "captions": [
            "不过，语言模型要预测的是后面的内容，不能提前看到未来。",
            "比如当前位置在“智能”，后面的问号必须被遮住，这就是因果遮罩。"
          ]
        },
        {
          "label": "检查当前位置仍在可见范围",
          "narration": "因此当前位置可以关注自己和更早的位置，却不能利用后面的 Token。即使训练时整句话都已经准备好，因果遮罩也会挡住未来信息，避免模型“偷看答案”。",
          "focus": [
            "当前 Q",
            "K4"
          ],
          "id": "S14.9",
          "frame": 3,
          "estimatedSeconds": 16,
          "captions": [
            "因此当前位置可以关注自己和更早的位置，却不能利用后面的 Token。",
            "即使训练时整句话都已经准备好，因果遮罩也会挡住未来信息，",
            "避免模型“偷看答案”。"
          ]
        }
      ],
      "estimatedSeconds": 131,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S35",
      "chapter": 4,
      "title": "Transformer 怎样选出下一个 Token",
      "subtitle": "从输入向量走到词表分数和输出文字",
      "kind": "extension",
      "sources": [
        "attention",
        "llama3",
        "generation",
        "cache"
      ],
      "terms": [
        "Transformer",
        "QKV",
        "Multi-Head Attention",
        "FFN",
        "Residual Connection",
        "Layer Normalization",
        "RoPE",
        "LM Head",
        "Logits",
        "Sampling",
        "Temperature",
        "Top-k",
        "Top-p"
      ],
      "steps": [
        {
          "id": "S35.0",
          "label": "把文字转成模型输入",
          "narration": "这门课用大语言模型里常见的因果 Transformer 来说明生成过程。文字转成向量以后，会经过多层 Transformer。每一层都结合上下文更新这些向量，最后用它们预测下一个 Token。",
          "estimatedSeconds": 19,
          "captions": [
            "这门课用大语言模型里常见的因果 Transformer 来说明生成过程。",
            "文字转成向量以后，会经过多层 Transformer。",
            "每一层都结合上下文更新这些向量，最后用它们预测下一个 Token。"
          ]
        },
        {
          "id": "S35.1",
          "label": "用输入向量算出 Q、K、V",
          "narration": "在 Transformer 的注意力层里，输入向量会经过不同的线性变换，得到 Q、K、V。Q 用来发起查询，K 用来计算匹配程度，V 则提供最后要汇总的信息。",
          "estimatedSeconds": 16,
          "captions": [
            "在 Transformer 的注意力层里，",
            "输入向量会经过不同的线性变换，得到 Q、K、V。",
            "Q 用来发起查询，K 用来计算匹配程度，",
            "V 则提供最后要汇总的信息。"
          ]
        },
        {
          "id": "S35.2",
          "label": "多个头各自做注意力",
          "narration": "多头注意力会并行使用多组 Q、K、V，从不同子空间处理上下文，最后再合并结果。像 Llama 这样的模型还会用 RoPE，也就是旋转位置编码，把位置信息融入 Q 和 K。",
          "estimatedSeconds": 17,
          "captions": [
            "多头注意力会并行使用多组 Q、K、V，",
            "从不同子空间处理上下文，最后再合并结果。",
            "像 Llama 这样的模型还会用 RoPE，",
            "也就是旋转位置编码，把位置信息融入 Q 和 K。"
          ]
        },
        {
          "id": "S35.3",
          "label": "注意力结果进入前馈网络",
          "narration": "注意力层让一个位置能够利用其他位置的信息。随后，前馈网络，也叫 FFN 或 MLP，会对每个位置的向量分别做进一步变换。",
          "estimatedSeconds": 13,
          "captions": [
            "注意力层让一个位置能够利用其他位置的信息。",
            "随后，前馈网络，也叫 FFN 或 MLP，会对每个位置的向量分别做进一步变换。"
          ]
        },
        {
          "id": "S35.4",
          "label": "沿残差路径合并向量",
          "narration": "每层还会通过残差连接，把变换结果和原来的表示合并；归一化则帮助控制数值尺度。归一化放在层里的具体位置，要看模型采用的架构。",
          "estimatedSeconds": 14,
          "captions": [
            "每层还会通过残差连接，把变换结果和原来的表示合并；",
            "归一化则帮助控制数值尺度。",
            "归一化放在层里的具体位置，要看模型采用的架构。"
          ]
        },
        {
          "id": "S35.5",
          "label": "为候选 Token 打分",
          "narration": "经过多层计算后，模型取末尾位置的表示交给 LM Head，也就是语言模型输出头，为词表中的候选 Token 计算分数。这些还没有归一化的分数叫 Logits。",
          "estimatedSeconds": 15,
          "captions": [
            "经过多层计算后，模型取末尾位置的表示",
            "交给 LM Head，也就是语言模型输出头，为词表中的候选 Token 计算分数。",
            "这些还没有归一化的分数叫 Logits。"
          ]
        },
        {
          "id": "S35.6",
          "label": "调整采样的候选范围",
          "narration": "接下来才轮到生成策略。温度会改变概率分布的平缓程度；Top-k 只保留分数最高的 k 个候选，Top-p 则按概率从高到低累加，保留累计概率达到阈值的候选集合。",
          "estimatedSeconds": 16,
          "captions": [
            "接下来才轮到生成策略。",
            "温度会改变概率分布的平缓程度；",
            "Top-k 只保留分数最高的 k 个候选，",
            "Top-p 则按概率从高到低累加，保留累计概率达到阈值的候选集合。"
          ]
        },
        {
          "id": "S35.7",
          "label": "从分数到文字，再进入下一轮",
          "narration": "从候选分布里选出一个 Token ID，再由分词器把它转换成文字。这个新 Token 还会被接回输入，模型继续预测下一个，生成过程就这样一轮轮向前推进。",
          "estimatedSeconds": 15,
          "captions": [
            "从候选分布里选出一个 Token ID，再由分词器把它转换成文字。",
            "这个新 Token 还会被接回输入，模型继续预测下一个，",
            "生成过程就这样一轮轮向前推进。"
          ]
        }
      ],
      "estimatedSeconds": 125
    },
    {
      "id": "S15",
      "chapter": 4,
      "title": "Prefill 与 Decode",
      "subtitle": "模型怎样处理输入并逐个生成 Token？",
      "kind": "generation",
      "targetSeconds": 85,
      "terms": [
        "Prefill",
        "Decode",
        "Autoregressive Generation",
        "Streaming Output"
      ],
      "sources": [
        "cache",
        "vllm",
        "vllm_scheduler"
      ],
      "steps": [
        {
          "label": "显示五个输入片段和空白输出",
          "narration": "回到 A 的问题。分词器已经把输入切成五个 Token，要得到第一个输出，模型需要先处理完这五个输入位置。",
          "focus": [
            "$[data-input-position]"
          ],
          "id": "S15.0",
          "estimatedSeconds": 12,
          "captions": [
            "回到 A 的问题。",
            "分词器已经把输入切成五个 Token，",
            "要得到第一个输出，模型需要先处理完这五个输入位置。"
          ]
        },
        {
          "label": "从输入序列聚焦到 Prefill",
          "narration": "处理已有输入、为后续生成建立上下文的阶段，叫 Prefill，通常翻译成预填充。它主要负责把提示词先算一遍。",
          "focus": [
            "Prefill"
          ],
          "id": "S15.4",
          "frame": 0,
          "estimatedSeconds": 12,
          "captions": [
            "处理已有输入、为后续生成建立上下文的阶段，",
            "叫 Prefill，通常翻译成预填充。",
            "它主要负责把提示词先算一遍。"
          ]
        },
        {
          "label": "五个输入位置送进模型",
          "narration": "这五个输入位置可以在同一次前向里并行处理。每个位置能看到哪些前文，仍然由刚才讲过的因果遮罩决定。",
          "phase": [
            0,
            770
          ],
          "id": "S15.1",
          "estimatedSeconds": 12,
          "captions": [
            "这五个输入位置可以在同一次前向里并行处理。",
            "每个位置能看到哪些前文，仍然由刚才讲过的因果遮罩决定。"
          ]
        },
        {
          "label": "在输入下方建立五份缓存",
          "narration": "计算过程中，模型会把各层产生的 K 和 V 保存下来。后面生成新 Token 时，还要继续读取这些历史信息。",
          "phase": [
            770,
            1030
          ],
          "id": "S15.5",
          "frame": 1,
          "estimatedSeconds": 11,
          "captions": [
            "计算过程中，模型会把各层产生的 K 和 V 保存下来。",
            "后面生成新 Token 时，还要继续读取这些历史信息。"
          ]
        },
        {
          "label": "显示第一个输出 Token",
          "narration": "同一次前向也会产生末尾位置的 Logits。根据这些分数，生成策略选出第一个输出 Token，示例里是“人工”。",
          "phase": [
            1030,
            1310
          ],
          "id": "S15.6",
          "frame": 1,
          "estimatedSeconds": 12,
          "captions": [
            "同一次前向也会产生末尾位置的 Logits。",
            "根据这些分数，生成策略选出第一个输出 Token，示例里是“人工”。"
          ]
        },
        {
          "label": "沿回路接入刚生成的片段",
          "narration": "如果还要继续生成，就把刚选出的“人工”接回模型输入，进入 Decode，也就是逐步解码阶段。",
          "phase": [
            0,
            660
          ],
          "id": "S15.2",
          "estimatedSeconds": 10,
          "captions": [
            "如果还要继续生成，就把刚选出的“人工”接回模型输入，",
            "进入 Decode，也就是逐步解码阶段。"
          ]
        },
        {
          "label": "追加这个位置的缓存",
          "narration": "新位置也会产生自己的 K 和 V。引擎把它们追加到历史缓存后面，供后续 Token 使用。",
          "phase": [
            660,
            960
          ],
          "id": "S15.7",
          "frame": 2,
          "estimatedSeconds": 10,
          "captions": [
            "新位置也会产生自己的 K 和 V。",
            "引擎把它们追加到历史缓存后面，供后续 Token 使用。"
          ]
        },
        {
          "label": "写出第二个 Token",
          "narration": "这一轮选出了“智能”。下一步要根据已经有的上下文继续预测，所以刚生成的 Token 必须先进入下一轮计算。",
          "phase": [
            960,
            1280
          ],
          "id": "S15.8",
          "frame": 2,
          "estimatedSeconds": 12,
          "captions": [
            "这一轮选出了“智能”。",
            "下一步要根据已经有的上下文继续预测，",
            "所以刚生成的 Token 必须先进入下一轮计算。"
          ]
        },
        {
          "label": "聊天窗口收到第一段输出",
          "narration": "用户这时可能已经看到“人工智能”几个字。服务可以把已经生成的一个或多个 Token 合并成一段，再发送给客户端。",
          "phase": [
            0,
            1050
          ],
          "id": "S15.3",
          "estimatedSeconds": 12,
          "captions": [
            "用户这时可能已经看到“人工智能”几个字。",
            "服务可以把已经生成的一个或多个 Token 合并成一段，再发送给客户端。"
          ]
        },
        {
          "label": "继续接回刚生成的 Token",
          "narration": "后面生成的 Token 继续接回模型输入，新的 K 和 V 也继续追加到缓存里。整个 Decode 过程就是这样反复推进。",
          "phase": [
            1050,
            7150
          ],
          "id": "S15.9",
          "frame": 3,
          "estimatedSeconds": 12,
          "captions": [
            "后面生成的 Token 继续接回模型输入，新的 K 和 V 也继续追加到缓存里。",
            "整个 Decode 过程就是这样反复推进。"
          ]
        },
        {
          "label": "聊天窗口收到下一段",
          "narration": "接下来，“是”和“一类”也可以合并成一段发回去。服务不一定每生成一个 Token 就发送一次，具体怎样分块由实现决定。",
          "phase": [
            7150,
            7700
          ],
          "id": "S15.10",
          "frame": 3,
          "estimatedSeconds": 12,
          "captions": [
            "接下来，“是”和“一类”也可以合并成一段发回去。",
            "服务不一定每生成一个 Token 就发送一次，具体怎样分块由实现决定。"
          ]
        },
        {
          "id": "S15.11",
          "frame": 3,
          "label": "对照长输入 Prefill 的并行计算",
          "narration": "Prefill 一次要处理很多输入位置，多个位置可以一起参与较大的矩阵计算，权重也能被这一批位置共同使用。因此在长输入场景下，Prefill 往往更容易受到计算能力的影响。",
          "estimatedSeconds": 18,
          "phase": [
            0,
            1550
          ],
          "captions": [
            "Prefill 一次要处理很多输入位置，多个位置可以一起参与较大的矩阵计算，",
            "权重也能被这一批位置共同使用。",
            "因此在长输入场景下，Prefill 往往更容易受到计算能力的影响。"
          ]
        },
        {
          "id": "S15.12",
          "frame": 3,
          "label": "低并发 Decode 反复读权重和 KV",
          "narration": "Decode 每轮通常只处理新生成的少量位置，却要反复读取模型权重和越来越长的历史 KV。低并发时，这一阶段容易受到显存带宽限制；批大小和硬件不同，瓶颈也会变化。",
          "estimatedSeconds": 17,
          "phase": [
            1550,
            3800
          ],
          "captions": [
            "Decode 每轮通常只处理新生成的少量位置，",
            "却要反复读取模型权重和越来越长的历史 KV。",
            "低并发时，这一阶段容易受到显存带宽限制；",
            "批大小和硬件不同，瓶颈也会变化。"
          ]
        },
        {
          "id": "S15.13",
          "frame": 3,
          "label": "连接输入长度和输出长度",
          "narration": "所以输入长度和输出长度影响等待的方式不一样：输入很长，通常会拖慢第一个 Token 到来的时间；输出很长，则意味着 Decode 要多执行很多轮，回答完成得更晚。每多一轮 Decode，都得用上之前的上下文。如果每轮都从头算，已经处理过的位置也得一遍遍重算。哪些结果可以留下来，等下一轮直接用？",
          "estimatedSeconds": 30,
          "phase": [
            3800,
            4600
          ],
          "captions": [
            "所以输入长度和输出长度影响等待的方式不一样：",
            "输入很长，通常会拖慢第一个 Token 到来的时间；",
            "输出很长，则意味着 Decode 要多执行很多轮，回答完成得更晚。",
            "每多一轮 Decode，都得用上之前的上下文。",
            "如果每轮都从头算，已经处理过的位置也得一遍遍重算。",
            "哪些结果可以留下来，等下一轮直接用？"
          ]
        }
      ],
      "estimatedSeconds": 192,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S16",
      "chapter": 4,
      "title": "KV Cache 怎样复用历史计算",
      "subtitle": "保存每层历史 Token 的 Key 与 Value",
      "kind": "cache",
      "targetSeconds": 85,
      "terms": [
        "KV Cache",
        "Key",
        "Value",
        "Attention"
      ],
      "sources": [
        "cache",
        "paged"
      ],
      "steps": [
        {
          "label": "辨认三份历史键值",
          "narration": "图上前三个位置已经各自算出了 K 和 V。第四个位置进来时，先看它会怎样用上这些历史数据。",
          "focus": [
            "$[data-kv-action=\"stored\"]"
          ],
          "id": "S16.0",
          "estimatedSeconds": 10,
          "captions": [
            "图上前三个位置已经各自算出了 K 和 V。",
            "第四个位置进来时，先看它会怎样用上这些历史数据。"
          ]
        },
        {
          "label": "找到新的查询",
          "narration": "第四个位置会带来一个新的 Q。它需要拿这个查询和前面已经保存的 K 做匹配，再汇总对应的 V。",
          "focus": [
            "新位置的 Query"
          ],
          "id": "S16.4",
          "frame": 0,
          "estimatedSeconds": 11,
          "captions": [
            "第四个位置会带来一个新的 Q。",
            "它需要拿这个查询和前面已经保存的 K 做匹配，再汇总对应的 V。"
          ]
        },
        {
          "label": "重新计算历史位置",
          "narration": "如果不保存历史状态，每生成一个新 Token，都可能要重新计算前面所有位置的 K 和 V。上下文越长，重复工作就越多。",
          "id": "S16.1",
          "estimatedSeconds": 13,
          "captions": [
            "如果不保存历史状态，每生成一个新 Token，",
            "都可能要重新计算前面所有位置的 K 和 V。",
            "上下文越长，重复工作就越多。"
          ]
        },
        {
          "label": "保留历史 K 和 V",
          "narration": "因果遮罩保证了早先位置不会看到后来才出现的内容，所以它们已经算出的 K 和 V 不会因为新 Token 到来而改变。把这些结果按层保存起来，就是 KV Cache，也就是键值缓存。",
          "phase": [
            0,
            0
          ],
          "id": "S16.2",
          "estimatedSeconds": 18,
          "captions": [
            "因果遮罩保证了早先位置不会看到后来才出现的内容，",
            "所以它们已经算出的 K 和 V 不会因为新 Token 到来而改变。",
            "把这些结果按层保存起来，就是 KV Cache，也就是键值缓存。"
          ]
        },
        {
          "label": "追加第四个位置的 K 和 V",
          "narration": "现在只需要计算第四个位置自己的 K 和 V，再把它们追加到缓存末尾。前三个位置的结果可以直接沿用。",
          "phase": [
            0,
            1280
          ],
          "id": "S16.5",
          "frame": 2,
          "estimatedSeconds": 12,
          "captions": [
            "现在只需要计算第四个位置自己的 K 和 V，再把它们追加到缓存末尾。",
            "前三个位置的结果可以直接沿用。"
          ]
        },
        {
          "label": "沿着连线读取历史缓存",
          "narration": "计算注意力时，新位置的 Q 会读取历史 K，也包括刚算出来的这一份；再根据权重汇总对应的 V，得到当前 Token 的上下文表示。",
          "id": "S16.3",
          "estimatedSeconds": 13,
          "captions": [
            "计算注意力时，新位置的 Q 会读取历史 K，也包括刚算出来的这一份；",
            "再根据权重汇总对应的 V，得到当前 Token 的上下文表示。"
          ]
        },
        {
          "label": "看到注意力的计算结果",
          "narration": "这些 V 汇总完成后，就得到第四个位置结合了前文信息的表示，模型再用它继续预测下一个 Token。",
          "focus": [
            "注意力结果"
          ],
          "id": "S16.6",
          "frame": 3,
          "estimatedSeconds": 11,
          "captions": [
            "这些 V 汇总完成后，就得到第四个位置结合了前文信息的表示，",
            "模型再用它继续预测下一个 Token。"
          ]
        },
        {
          "label": "指出缓存的显存代价",
          "narration": "KV Cache 省掉了历史位置的重复计算，但它不是免费的：所有历史 K、V 都要占用显存，Decode 每一轮也仍然要读取它们。上下文越长，这笔成本越明显。",
          "focus": [
            "省下重算；仍要从显存读取历史 K / V。"
          ],
          "id": "S16.7",
          "frame": 3,
          "estimatedSeconds": 15,
          "captions": [
            "KV Cache 省掉了历史位置的重复计算，但它不是免费的：",
            "所有历史 K、V 都要占用显存，Decode 每一轮也仍然要读取它们。",
            "上下文越长，这笔成本越明显。"
          ]
        }
      ],
      "estimatedSeconds": 103,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S36",
      "chapter": 4,
      "title": "为什么可以少存几组 K 和 V",
      "subtitle": "对照 MHA、GQA 与 MQA 的 KV 头",
      "kind": "extension",
      "sources": [
        "gqa",
        "llama3"
      ],
      "terms": [
        "GQA",
        "MQA",
        "KV Cache",
        "Multi-Head Attention"
      ],
      "steps": [
        {
          "id": "S36.0",
          "label": "比较查询头与键值头",
          "narration": "刚才只画了一组查询头。实际模型的一层里通常有多个注意力头，每个头都会用自己的 Q 去读取 K，并根据权重汇总 V。",
          "estimatedSeconds": 13,
          "captions": [
            "刚才只画了一组查询头。",
            "实际模型的一层里通常有多个注意力头，",
            "每个头都会用自己的 Q 去读取 K，并根据权重汇总 V。"
          ]
        },
        {
          "id": "S36.1",
          "label": "每个查询头使用独立的 KV 头",
          "narration": "在标准多头注意力 MHA 中，每个查询头都有自己对应的 K 和 V。假设有四个头，一个 Token 就需要保存四组 KV。",
          "estimatedSeconds": 12,
          "captions": [
            "在标准多头注意力 MHA 中，每个查询头都有自己对应的 K 和 V。",
            "假设有四个头，一个 Token 就需要保存四组 KV。"
          ]
        },
        {
          "id": "S36.2",
          "label": "让一组查询头共享 K 和 V",
          "narration": "GQA，也就是分组查询注意力，会让一组查询头共享同一组 K 和 V。比如四个查询头分成两组，就只需要保存两组 KV，缓存开销会下降。",
          "estimatedSeconds": 14,
          "captions": [
            "GQA，也就是分组查询注意力，会让一组查询头共享同一组 K 和 V。",
            "比如四个查询头分成两组，就只需要保存两组 KV，缓存开销会下降。"
          ]
        },
        {
          "id": "S36.3",
          "label": "观察所有查询头共享一组 KV",
          "narration": "如果所有查询头都共享同一组 K 和 V，就是 MQA，也就是多查询注意力。模型具体使用几组 KV 由架构决定，估算缓存时要看实际的 KV 头数。",
          "estimatedSeconds": 14,
          "captions": [
            "如果所有查询头都共享同一组 K 和 V，就是 MQA，也就是多查询注意力。",
            "模型具体使用几组 KV 由架构决定，估算缓存时要看实际的 KV 头数。"
          ]
        }
      ],
      "estimatedSeconds": 53
    },
    {
      "id": "S17",
      "chapter": 4,
      "title": "KV Cache 占多少显存",
      "subtitle": "同一模型副本可共用权重，每个请求有自己的上下文",
      "kind": "cachegrow",
      "targetSeconds": 75,
      "terms": [
        "Context Length",
        "KV Cache",
        "OOM",
        "Concurrency"
      ],
      "sources": [
        "cache",
        "paged",
        "llama3"
      ],
      "steps": [
        {
          "label": "定位供多条请求使用的权重",
          "narration": "估算一个推理副本的显存，先把模型权重和请求缓存分开看。权重通常由同一副本里的多条请求共享，但每条请求的历史 KV 都要单独保存。",
          "focus": [
            "共享权重"
          ],
          "id": "S17.0",
          "estimatedSeconds": 14,
          "captions": [
            "估算一个推理副本的显存，先把模型权重和请求缓存分开看。",
            "权重通常由同一副本里的多条请求共享，但每条请求的历史 KV 都要单独保存。"
          ]
        },
        {
          "label": "在池里定位 A 的三格缓存",
          "narration": "图里先把一个缓存格当作一个 Token 位置。A 当前用了三格，整个池子一共有十八格可供分配。",
          "focus": [
            "$[data-request=\"A\"][data-used]"
          ],
          "id": "S17.4",
          "frame": 0,
          "estimatedSeconds": 11,
          "captions": [
            "图里先把一个缓存格当作一个 Token 位置。",
            "A 当前用了三格，整个池子一共有十八格可供分配。"
          ]
        },
        {
          "label": "让 A 的历史从三格长到七格",
          "narration": "随着 A 继续生成，每增加一个 Token，就要为它增加对应的 KV。这里 A 从三格增长到七格，增加的就是它的历史上下文。",
          "phase": [
            0,
            1360
          ],
          "id": "S17.1",
          "estimatedSeconds": 13,
          "captions": [
            "随着 A 继续生成，每增加一个 Token，就要为它增加对应的 KV。",
            "这里 A 从三格增长到七格，增加的就是它的历史上下文。"
          ]
        },
        {
          "label": "从格子对应到一个 Token 的缓存",
          "narration": "真实模型里，一个 Token 对应的缓存并不是一个简单数字。它取决于层数、KV 头数、每个头的维度，以及 K、V 的数据类型。",
          "focus": [
            "$ .inference-foot"
          ],
          "id": "S17.5",
          "frame": 1,
          "estimatedSeconds": 13,
          "captions": [
            "真实模型里，一个 Token 对应的缓存并不是一个简单数字。",
            "它取决于层数、KV 头数、每个头的维度，以及 K、V 的数据类型。"
          ]
        },
        {
          "label": "给 B 分配五格",
          "narration": "B 也使用同一套模型权重，但它的上下文和 A 不同，因此要有自己的缓存。现在 B 又申请了五格。",
          "phase": [
            0,
            795
          ],
          "id": "S17.2",
          "estimatedSeconds": 11,
          "captions": [
            "B 也使用同一套模型权重，但它的上下文和 A 不同，",
            "因此要有自己的缓存。现在 B 又申请了五格。"
          ]
        },
        {
          "label": "给 C 分配四格并汇总",
          "narration": "C 再申请四格。这样 A、B、C 一共占了十六格，整个缓存池只剩下两格。",
          "phase": [
            795,
            1100
          ],
          "id": "S17.6",
          "frame": 2,
          "estimatedSeconds": 9,
          "captions": [
            "C 再申请四格。这样 A、B、C 一共占了十六格，整个缓存池只剩下两格。"
          ]
        },
        {
          "label": "突出三个请求的缓存占用",
          "narration": "所以，单看当前有多少条请求并不够。每条请求的输入和已经生成的输出有多长，都会影响 KV Cache 的实际占用。",
          "focus": [
            "每个请求各自保存历史",
            "合计 16 / 18 个位置"
          ],
          "id": "S17.7",
          "frame": 2,
          "estimatedSeconds": 12,
          "captions": [
            "所以，单看当前有多少条请求并不够。",
            "每条请求的输入和已经生成的输出有多长，都会影响 KV Cache 的实际占用。"
          ]
        },
        {
          "label": "让请求 D 留在队列",
          "narration": "这时 D 又来了，它至少需要三格，但池子里只剩两格。GPU 可能还有计算能力，服务却因为没有足够的缓存空间，只能让 D 先等。",
          "id": "S17.3",
          "estimatedSeconds": 13,
          "captions": [
            "这时 D 又来了，它至少需要三格，但池子里只剩两格。",
            "GPU 可能还有计算能力，服务却因为没有足够的缓存空间，只能让 D 先等。"
          ]
        },
        {
          "label": "定位缓存容量的约束",
          "narration": "等其他请求完成并归还缓存，D 才可能拿到需要的空间。这里限制它的不是模型权重，也不一定是算力，而是 KV Cache 的容量。",
          "focus": [
            "D 需要 3 格，池里只剩 2 格 → 等待"
          ],
          "id": "S17.8",
          "frame": 3,
          "estimatedSeconds": 13,
          "captions": [
            "等其他请求完成并归还缓存，D 才可能拿到需要的空间。",
            "这里限制它的不是模型权重，也不一定是算力，而是 KV Cache 的容量。"
          ]
        },
        {
          "id": "S17.9",
          "frame": 3,
          "label": "按真实模型配置估算每个 Token 的 KV",
          "narration": "用 Llama 3.1 8B 做一个具体估算：它有 32 层，每层 8 个 KV 头，每个头的维度是 128。K 和 V 各保存一份，使用 BF16 时每个数占 2 字节，因此一个 Token 的 KV 大约是 128 KiB。",
          "estimatedSeconds": 17,
          "phase": [
            0,
            600
          ],
          "captions": [
            "用 Llama 3.1 8B 做一个具体估算：",
            "它有 32 层，每层 8 个 KV 头，每个头的维度是 128。",
            "K 和 V 各保存一份，使用 BF16 时每个数占 2 字节，",
            "因此一个 Token 的 KV 大约是 128 KiB。"
          ]
        },
        {
          "id": "S17.10",
          "frame": 3,
          "label": "让单条对话从 1024 增长到 8192 个 Token",
          "narration": "一个 Token 的缓存看起来不大，但长度累积起来就很可观：1024 个 Token 大约占 128 MiB，增长到 8192 个 Token，就约为 1 GiB。",
          "estimatedSeconds": 13,
          "phase": [
            600,
            2000
          ],
          "captions": [
            "一个 Token 的缓存看起来不大，但长度累积起来就很可观：",
            "1024 个 Token 大约占 128 MiB，增长到 8192 个 Token，就约为 1 GiB。"
          ]
        },
        {
          "id": "S17.11",
          "frame": 3,
          "label": "让 12 条长对话同时占用缓存",
          "narration": "如果同时有 12 条这样的长对话，每条都保留 8192 个 Token 的历史，原始 KV 就要约 12 GiB。这里还没算权重、临时空间和缓存管理开销。",
          "estimatedSeconds": 14,
          "phase": [
            2000,
            3650
          ],
          "captions": [
            "如果同时有 12 条这样的长对话，每条都保留 8192 个 Token 的历史，",
            "原始 KV 就要约 12 GiB。",
            "这里还没算权重、临时空间和缓存管理开销。"
          ]
        }
      ],
      "estimatedSeconds": 153,
      "transition": "读完后按 Space，进入下一页第一句。",
      "demo": {
        "model": "Llama 3.1 8B",
        "layers": 32,
        "kvHeads": 8,
        "headDimension": 128,
        "bytesPerElement": 2,
        "shortTokens": 1024,
        "longTokens": 8192,
        "longRequests": 12
      }
    },
    {
      "id": "S18",
      "chapter": 4,
      "title": "PagedAttention 怎样管理缓存",
      "subtitle": "映射表让一个请求的 KV Cache 可以分散存放",
      "kind": "paged",
      "targetSeconds": 75,
      "terms": [
        "PagedAttention",
        "KV Block",
        "Logical Block",
        "Physical Block"
      ],
      "sources": [
        "paged"
      ],
      "steps": [
        {
          "label": "标出三段连续预留空间",
          "narration": "请求的上下文会不断变长，缓存也就需要不断扩展。一种简单办法是请求一开始就预留一整段连续空间，但问题来了：到底要预留多长？",
          "focus": [
            "连续预留",
            "A",
            "B",
            "C"
          ],
          "id": "S18.0",
          "estimatedSeconds": 14,
          "captions": [
            "请求的上下文会不断变长，缓存也就需要不断扩展。",
            "一种简单办法是请求一开始就预留一整段连续空间，",
            "但问题来了：到底要预留多长？"
          ]
        },
        {
          "label": "指出预留段里闲着的部分",
          "narration": "生成最终会有多长，通常在开始时并不知道。如果按最大长度预留，短回答用不到的那部分空间也会被占着，其他请求就没法使用。",
          "focus": [
            "灰色空位已属于当前请求"
          ],
          "id": "S18.4",
          "frame": 0,
          "estimatedSeconds": 13,
          "captions": [
            "生成最终会有多长，通常在开始时并不知道。",
            "如果按最大长度预留，",
            "短回答用不到的那部分空间也会被占着，其他请求就没法使用。"
          ]
        },
        {
          "label": "让请求 D 等待空间",
          "narration": "这时 D 到达了。你会看到显存里似乎还有一些空白位置，但它们已经包含在其他请求的预留区里，不能随便分给 D。",
          "focus": [
            "$[data-status=\"waiting\"]"
          ],
          "id": "S18.1",
          "estimatedSeconds": 12,
          "captions": [
            "这时 D 到达了。",
            "你会看到显存里似乎还有一些空白位置，",
            "但它们已经包含在其他请求的预留区里，不能随便分给 D。"
          ]
        },
        {
          "label": "突出一段预留区内的空位",
          "narration": "比如 B 的预留区还没有写满，里面留着一截空位。如果不再按整段预留，而是用到多少再分多少，这部分空间就能留给其他请求。",
          "focus": [
            "$[data-reserved-owner=\"B\"][data-used=\"false\"]"
          ],
          "id": "S18.5",
          "frame": 1,
          "estimatedSeconds": 13,
          "captions": [
            "比如 B 的预留区还没有写满，里面留着一截空位。",
            "如果不再按整段预留，而是用到多少再分多少，这部分空间就能留给其他请求。"
          ]
        },
        {
          "label": "建立两个逻辑块和物理块的映射",
          "narration": "PagedAttention 把 KV Cache 按固定大小切成块，再用块表记录逻辑块和显存物理块之间的对应关系。图里为了说明，假设每块可以存四个 Token 位置。",
          "id": "S18.2",
          "estimatedSeconds": 16,
          "captions": [
            "PagedAttention 把 KV Cache 按固定大小切成块，",
            "再用块表记录逻辑块和显存物理块之间的对应关系。",
            "图里为了说明，假设每块可以存四个 Token 位置。"
          ]
        },
        {
          "label": "同时标出不相邻的 P2 与 P5",
          "narration": "A 看到的是连续的逻辑顺序：第零块、第一块。但它们在显存里不必挨在一起，可能分别落在物理块 P2 和 P5，只要块表能查到映射就行。",
          "focus": [
            "L0 → P2",
            "L1 → P5",
            "$[data-physical-block=\"2\"]",
            "$[data-physical-block=\"5\"]"
          ],
          "id": "S18.6",
          "frame": 2,
          "estimatedSeconds": 14,
          "captions": [
            "A 看到的是连续的逻辑顺序：第零块、第一块。",
            "但它们在显存里不必挨在一起，可能分别落在物理块 P2 和 P5，",
            "只要块表能查到映射就行。"
          ]
        },
        {
          "label": "把新增的 L2 映射到 P1",
          "narration": "A 继续生成、需要新空间时，再从空闲池申请一个物理块。新的逻辑块 L2 这次映射到 P1，之前的映射不需要移动。",
          "focus": [
            "L2 → P1",
            "$[data-physical-block=\"1\"]"
          ],
          "id": "S18.3",
          "estimatedSeconds": 12,
          "captions": [
            "A 继续生成、需要新空间时，再从空闲池申请一个物理块。",
            "新的逻辑块 L2 这次映射到 P1，之前的映射不需要移动。"
          ]
        },
        {
          "label": "沿逻辑顺序读取物理块",
          "narration": "读取时，内核沿着逻辑顺序查块表，找到 P2、P5、P1 这些实际位置。它借鉴了分页管理的组织方式，但 KV 数据仍然存放在 GPU 显存里。",
          "phase": [
            0,
            5750
          ],
          "id": "S18.7",
          "frame": 3,
          "estimatedSeconds": 14,
          "captions": [
            "读取时，内核沿着逻辑顺序查块表，找到 P2、P5、P1 这些实际位置。",
            "它借鉴了分页管理的组织方式，但 KV 数据仍然存放在 GPU 显存里。"
          ]
        }
      ],
      "estimatedSeconds": 108,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S19",
      "chapter": 4,
      "title": "一个请求怎样申请与释放缓存",
      "subtitle": "序列增长时，按需申请物理块",
      "kind": "allocate",
      "targetSeconds": 85,
      "terms": [
        "PagedAttention",
        "Block Table",
        "KV Cache"
      ],
      "sources": [
        "paged"
      ],
      "steps": [
        {
          "label": "让 A 从共享池领取缓存块",
          "narration": "按块管理缓存时，A 先从共享池里领取当前需要的块，而不是一次性预留一个很大的连续区域。",
          "id": "S19.0",
          "estimatedSeconds": 11,
          "captions": [
            "按块管理缓存时，A 先从共享池里领取当前需要的块，",
            "而不是一次性预留一个很大的连续区域。"
          ]
        },
        {
          "label": "观察 A 尚有空余的缓存块",
          "narration": "新生成的 Token 可以继续写进 A 已经拿到的块。等这一块写满，再向空闲池申请下一块。",
          "focus": [
            "$[data-physical-block=\"2\"]"
          ],
          "id": "S19.4",
          "frame": 0,
          "estimatedSeconds": 10,
          "captions": [
            "新生成的 Token 可以继续写进 A 已经拿到的块。",
            "等这一块写满，再向空闲池申请下一块。"
          ]
        },
        {
          "label": "为增长中的 A 再分一块",
          "narration": "需要扩展时，A 再领一个物理块，并在自己的块表里增加一条映射。原来保存的 KV 不必整体搬到新的连续区域。",
          "id": "S19.1",
          "estimatedSeconds": 12,
          "captions": [
            "需要扩展时，A 再领一个物理块，并在自己的块表里增加一条映射。",
            "原来保存的 KV 不必整体搬到新的连续区域。"
          ]
        },
        {
          "label": "观察池中尚未分配的块",
          "narration": "还没有分配出去的块留在空闲池里，其他请求也可以按需申请。这样不同请求就能共享同一个缓存池。",
          "focus": [
            "$[data-physical-block][data-free=\"true\"]"
          ],
          "id": "S19.5",
          "frame": 1,
          "estimatedSeconds": 11,
          "captions": [
            "还没有分配出去的块留在空闲池里，其他请求也可以按需申请。",
            "这样不同请求就能共享同一个缓存池。"
          ]
        },
        {
          "label": "让 B 向同一个池子申请",
          "narration": "B 来了以后，也从同一个空闲池申请缓存块。它和 A 使用同一套分配资源，但不会因此混用彼此的上下文。",
          "id": "S19.2",
          "estimatedSeconds": 12,
          "captions": [
            "B 来了以后，也从同一个空闲池申请缓存块。",
            "它和 A 使用同一套分配资源，但不会因此混用彼此的上下文。"
          ]
        },
        {
          "label": "查看 A 与 B 的独立分配",
          "narration": "A 和 B 各自维护自己的块表。引擎根据请求对应的块表读取 KV，因此两条请求可以独立增长和释放。",
          "focus": [
            "$[data-physical-block][data-owner=\"B\"]"
          ],
          "id": "S19.6",
          "frame": 2,
          "estimatedSeconds": 11,
          "captions": [
            "A 和 B 各自维护自己的块表。",
            "引擎根据请求对应的块表读取 KV，因此两条请求可以独立增长和释放。"
          ]
        },
        {
          "label": "让 A 的两个块依次归还",
          "narration": "A 完成以后，如果它的缓存没有被其他请求引用，也不需要继续保留，就可以把占用的块归还到空闲池。",
          "phase": [
            0,
            3810
          ],
          "id": "S19.3",
          "estimatedSeconds": 11,
          "captions": [
            "A 完成以后，如果它的缓存没有被其他请求引用，也不需要继续保留，",
            "就可以把占用的块归还到空闲池。"
          ]
        },
        {
          "label": "确认 B 仍然在执行",
          "narration": "B 还没有结束，所以它正在使用的块不能一起释放。缓存回收要按请求和引用关系分别处理。",
          "focus": [
            "$[data-physical-block=\"1\"]"
          ],
          "id": "S19.7",
          "frame": 3,
          "estimatedSeconds": 10,
          "phase": [
            3810,
            3900
          ],
          "captions": [
            "B 还没有结束，所以它正在使用的块不能一起释放。",
            "缓存回收要按请求和引用关系分别处理。"
          ]
        },
        {
          "id": "S19.8",
          "frame": 3,
          "label": "让 C 复用 A 归还的块",
          "narration": "随后新请求 C 到达，就可以申请 A 刚刚归还的块，把自己的 KV 写进去。空间因此能被循环利用。C 现在有地方写缓存了。至于哪一轮能和别的请求一起算，还得由推理引擎组批时决定。",
          "estimatedSeconds": 20,
          "phase": [
            3900,
            5150
          ],
          "captions": [
            "随后新请求 C 到达，就可以申请 A 刚刚归还的块，把自己的 KV 写进去。",
            "空间因此能被循环利用。",
            "C 现在有地方写缓存了。至于哪一轮能和别的请求一起算，",
            "还得由推理引擎组批时决定。"
          ]
        }
      ],
      "estimatedSeconds": 108,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S20",
      "chapter": 4,
      "title": "连续批处理怎样安排请求",
      "subtitle": "调度器可在每轮执行之间更新批次",
      "kind": "batch",
      "targetSeconds": 105,
      "terms": [
        "Batching",
        "Static Batching",
        "Continuous Batching",
        "Scheduler"
      ],
      "sources": [
        "orca",
        "vllm",
        "vllm_scheduler"
      ],
      "steps": [
        {
          "label": "对照两种批处理的 Decode 时间表",
          "narration": "用两张时间表看看组批怎么影响新请求。A 还要生成两轮，B 还要生成四轮。固定批处理会让它们待在同一批里，按相同的轮次一起推进。",
          "focus": [
            "固定批次",
            "连续批处理"
          ],
          "id": "S20.0",
          "estimatedSeconds": 15,
          "phase": [
            0,
            350
          ],
          "captions": [
            "用两张时间表看看组批怎么影响新请求。",
            "A 还要生成两轮，B 还要生成四轮。",
            "固定批处理会让它们待在同一批里，按相同的轮次一起推进。"
          ]
        },
        {
          "label": "让 C 到达两种批次的队列",
          "narration": "第一轮结束时，C 到达了。固定批处理通常要等整批请求结束，才能换进新请求；即使 A 已经先完成，C 也可能还得等 B。",
          "id": "S20.4",
          "frame": 0,
          "estimatedSeconds": 13,
          "phase": [
            350,
            960
          ],
          "captions": [
            "第一轮结束时，C 到达了。",
            "固定批处理通常要等整批请求结束，才能换进新请求；",
            "即使 A 已经先完成，C 也可能还得等 B。"
          ]
        },
        {
          "label": "连续批处理先安排 C 做 Prefill",
          "narration": "连续批处理则会在每轮计算结束后重新检查队列和资源。只要预算允许，引擎就可以先为 C 做 Prefill，处理它的输入并建立缓存。",
          "id": "S20.1",
          "estimatedSeconds": 14,
          "phase": [
            0,
            1750
          ],
          "captions": [
            "连续批处理则会在每轮计算结束后重新检查队列和资源。",
            "只要预算允许，引擎就可以先为 C 做 Prefill，处理它的输入并建立缓存。"
          ]
        },
        {
          "label": "让完成 Prefill 的 C 加入第二轮 Decode",
          "narration": "C 完成 Prefill 并得到首个输出后，就具备了继续生成的条件。下一轮它可以和仍在运行的 A、B 一起进入 Decode。",
          "id": "S20.5",
          "frame": 1,
          "estimatedSeconds": 13,
          "phase": [
            1750,
            3600
          ],
          "captions": [
            "C 完成 Prefill 并得到首个输出后，就具备了继续生成的条件。",
            "下一轮它可以和仍在运行的 A、B 一起进入 Decode。"
          ]
        },
        {
          "label": "让完成的 A 退出",
          "narration": "第二轮结束，A 已经答完。下一轮调度时就可以把 A 移出批次，把释放的计算和缓存资源留给其他请求。",
          "id": "S20.2",
          "estimatedSeconds": 11,
          "captions": [
            "第二轮结束，A 已经答完。",
            "下一轮调度时就可以把 A 移出批次，把释放的计算和缓存资源留给其他请求。"
          ]
        },
        {
          "label": "观察第三轮仍在执行的两条请求",
          "narration": "这种每轮都能重新安排请求的方式，叫 Continuous Batching，也就是连续批处理。请求结束后不用等整批一起结束，空出的资源可以尽早交给新请求。",
          "focus": [
            "$[data-live-status=\"running\"][data-live-request=\"B\"],[data-live-status=\"running\"][data-live-request=\"C\"]"
          ],
          "id": "S20.6",
          "frame": 2,
          "estimatedSeconds": 16,
          "captions": [
            "这种每轮都能重新安排请求的方式，",
            "叫 Continuous Batching，也就是连续批处理。",
            "请求结束后不用等整批一起结束，空出的资源可以尽早交给新请求。"
          ]
        },
        {
          "label": "对照 C 完成的 Decode 轮次",
          "narration": "在这个例子里，C 第三轮就完成了 Decode；如果采用固定批处理，它可能要等到第五轮才能开始解码，第六轮才结束。",
          "focus": [
            "C：第 6 轮完成",
            "C：第 3 轮完成"
          ],
          "id": "S20.3",
          "estimatedSeconds": 12,
          "captions": [
            "在这个例子里，C 第三轮就完成了 Decode；",
            "如果采用固定批处理，它可能要等到第五轮才能开始解码，第六轮才结束。"
          ]
        },
        {
          "label": "定位组批的资源与延迟约束",
          "narration": "当然，引擎不能只看队列里有谁。它还要核对 KV Cache 余量、每轮允许处理多少 Token，以及服务的延迟目标。长输入加入后，也可能让这一轮计算变长。如果两条请求里有一大段输入完全相同，这段能不能只算一次？",
          "focus": [
            "按显存、Token 预算与延迟目标组批"
          ],
          "id": "S20.7",
          "frame": 3,
          "estimatedSeconds": 21,
          "captions": [
            "当然，引擎不能只看队列里有谁。",
            "它还要核对 KV Cache 余量、每轮允许处理多少 Token，以及服务的延迟目标。",
            "长输入加入后，也可能让这一轮计算变长。",
            "如果两条请求里有一大段输入完全相同，这段能不能只算一次？"
          ]
        }
      ],
      "estimatedSeconds": 115,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S21",
      "chapter": 4,
      "title": "前缀缓存怎样命中",
      "subtitle": "Prefix Caching 允许多个请求复用相同前缀的 KV Cache",
      "kind": "prefix",
      "targetSeconds": 75,
      "terms": [
        "Prefix Caching",
        "KV Cache",
        "Prefill"
      ],
      "sources": [
        "prefix"
      ],
      "steps": [
        {
          "label": "对照报销和订票两条提问",
          "narration": "两个人都在问差旅问题：一个问报销，一个问订票。问题不一样，但如果应用给模型附上同一本手册，它们的提示词开头可能有很长一段完全相同。",
          "focus": [
            "何时报销？",
            "怎么订票？"
          ],
          "id": "S21.0",
          "estimatedSeconds": 15,
          "captions": [
            "两个人都在问差旅问题：一个问报销，一个问订票。",
            "问题不一样，但如果应用给模型附上同一本手册，",
            "它们的提示词开头可能有很长一段完全相同。"
          ]
        },
        {
          "label": "标出两条输入共享的前缀",
          "narration": "比如两条请求都以“请仅依据这份差旅手册回答”开头。既然这部分输入完全相同，第二个人还需要把它从头计算一遍吗？",
          "focus": [
            "$[data-prefix-text]"
          ],
          "id": "S21.4",
          "frame": 0,
          "estimatedSeconds": 13,
          "captions": [
            "比如两条请求都以“请仅依据这份差旅手册回答”开头。",
            "既然这部分输入完全相同，第二个人还需要把它从头计算一遍吗？"
          ]
        },
        {
          "label": "写入 A 的前缀缓存",
          "narration": "第一条请求 A 做 Prefill 时，模型已经为这段共同前缀算出了 K 和 V。只要缓存条件满足，这些结果就有机会留给后续请求使用。",
          "id": "S21.1",
          "estimatedSeconds": 14,
          "captions": [
            "第一条请求 A 做 Prefill 时，模型已经为这段共同前缀算出了 K 和 V。",
            "只要缓存条件满足，这些结果就有机会留给后续请求使用。"
          ]
        },
        {
          "label": "指出可留给后续请求的缓存",
          "narration": "A 完成后，引擎可以把这段前缀对应的 KV 暂时保留下来。缓存空间紧张时，也可以按淘汰策略释放它，并不是永久保存。",
          "focus": [
            "$[data-prefix-cached]"
          ],
          "id": "S21.5",
          "frame": 1,
          "estimatedSeconds": 13,
          "captions": [
            "A 完成后，引擎可以把这段前缀对应的 KV 暂时保留下来。",
            "缓存空间紧张时，也可以按淘汰策略释放它，并不是永久保存。"
          ]
        },
        {
          "label": "让 B 接上已经存好的前缀",
          "narration": "B 想复用这段缓存，不能只看文字是不是相似。引擎要检查 Token 序列、模型和相关配置是否匹配，还要遵守请求之间的数据隔离规则。",
          "id": "S21.2",
          "estimatedSeconds": 14,
          "captions": [
            "B 想复用这段缓存，不能只看文字是不是相似。",
            "引擎要检查 Token 序列、模型和相关配置是否匹配，",
            "还要遵守请求之间的数据隔离规则。"
          ]
        },
        {
          "label": "突出 B 的不同后缀",
          "narration": "B 后面关于订票的内容和 A 不同，这一段就是它自己的后缀。共同前缀可以复用，后缀仍然需要正常计算。",
          "focus": [
            "$[data-suffix-owner=\"B\"]"
          ],
          "id": "S21.6",
          "frame": 2,
          "estimatedSeconds": 12,
          "captions": [
            "B 后面关于订票的内容和 A 不同，这一段就是它自己的后缀。",
            "共同前缀可以复用，后缀仍然需要正常计算。"
          ]
        },
        {
          "label": "在命中路径上标出前缀读取",
          "narration": "如果共同前缀命中，B 就能直接读取已经保存的 KV，不必重复做这部分 Prefill。这种机制叫 Prefix Caching，也就是前缀缓存。",
          "phase": [
            800,
            1920
          ],
          "id": "S21.3",
          "estimatedSeconds": 14,
          "captions": [
            "如果共同前缀命中，B 就能直接读取已经保存的 KV，",
            "不必重复做这部分 Prefill。",
            "这种机制叫 Prefix Caching，也就是前缀缓存。"
          ]
        },
        {
          "label": "在命中路径上标出后缀 Prefill",
          "narration": "前缀之后的新内容仍要执行 Prefill，并在计算时接着使用已有上下文。整条输入处理完，模型才进入后续生成。即使省下了共同前缀的计算，模型权重仍然要放在显存里。如果占空间最多的恰好是权重，该从哪里省？",
          "phase": [
            3200,
            3540
          ],
          "id": "S21.7",
          "frame": 3,
          "estimatedSeconds": 22,
          "captions": [
            "前缀之后的新内容仍要执行 Prefill，并在计算时接着使用已有上下文。",
            "整条输入处理完，模型才进入后续生成。",
            "即使省下了共同前缀的计算，模型权重仍然要放在显存里。",
            "如果占空间最多的恰好是权重，该从哪里省？"
          ]
        }
      ],
      "estimatedSeconds": 117,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S22",
      "chapter": 4,
      "title": "推理慢或显存不够，该先查哪里？",
      "subtitle": "把权重、请求缓存、重复输入和注意力读写分开看",
      "kind": "quantization",
      "targetSeconds": 55,
      "terms": [
        "Quantization",
        "Model Parallelism",
        "KV Cache",
        "PagedAttention",
        "FlashAttention",
        "Prefix Caching"
      ],
      "sources": [
        "quant",
        "flash",
        "paged",
        "prefix"
      ],
      "steps": [
        {
          "label": "展示浮点原值的十六位编码",
          "narration": "推理慢或者显存不够，先找开销最大的一项。如果加载模型时权重就快占满整张卡，可以从权重的位宽查起。图里的 0.71875 用 16 位浮点数保存，占 16 个比特。",
          "phase": [
            0,
            600
          ],
          "id": "S22.0",
          "estimatedSeconds": 16,
          "captions": [
            "推理慢或者显存不够，先找开销最大的一项。",
            "如果加载模型时权重就快占满整张卡，可以从权重的位宽查起。",
            "图里的 0.71875 用 16 位浮点数保存，占 16 个比特。"
          ]
        },
        {
          "label": "揭示四位的量化编码",
          "narration": "量化会用更少的比特表示权重。这个例子把数值编码成一个 4 位整数七，存储和搬运的数据量都减少了，但它只是近似表示。",
          "phase": [
            600,
            885
          ],
          "id": "S22.4",
          "frame": 0,
          "estimatedSeconds": 13,
          "captions": [
            "量化会用更少的比特表示权重。",
            "这个例子把数值编码成一个 4 位整数七，",
            "存储和搬运的数据量都减少了，但它只是近似表示。"
          ]
        },
        {
          "label": "用整数和尺度恢复近似值",
          "narration": "读取时再结合尺度值，把整数映射回近似的浮点数。这里用七乘以 0.1，得到 0.7，和原来的 0.71875 有一点误差。",
          "phase": [
            800,
            1180
          ],
          "id": "S22.1",
          "estimatedSeconds": 12,
          "captions": [
            "读取时再结合尺度值，把整数映射回近似的浮点数。",
            "这里用七乘以 0.1，得到 0.7，和原来的 0.71875 有一点误差。"
          ]
        },
        {
          "label": "定位量化后要验证的条件",
          "narration": "真实量化通常会让一组权重共享尺度，有些方案还会使用零点。部署时既要确认内核支持对应格式，也要测量推理速度和模型效果有没有明显变化。",
          "focus": [
            "质量 · 硬件支持 · 内核实现 · 转换开销"
          ],
          "id": "S22.5",
          "frame": 1,
          "estimatedSeconds": 15,
          "captions": [
            "真实量化通常会让一组权重共享尺度，有些方案还会使用零点。",
            "部署时既要确认内核支持对应格式，",
            "也要测量推理速度和模型效果有没有明显变化。"
          ]
        },
        {
          "label": "显示多张卡协作运行模型",
          "narration": "权重太大还有一种处理办法。一张卡放不下完整模型，可以把权重和相应的计算拆给多张卡。图上由两张卡合起来跑一份模型，这叫模型并行。",
          "id": "S22.2",
          "estimatedSeconds": 15,
          "captions": [
            "权重太大还有一种处理办法。",
            "一张卡放不下完整模型，可以把权重和相应的计算拆给多张卡。",
            "图上由两张卡合起来跑一份模型，这叫模型并行。"
          ]
        },
        {
          "label": "对照两种手段各自改变的对象",
          "narration": "量化改变每份权重需要的空间，模型并行减少单卡承担的份额，但卡与卡之间可能要交换中间结果。除了权重，单卡还得留出空间存请求的 KV 和临时数据。",
          "focus": [
            "一份模型的权重与计算"
          ],
          "id": "S22.6",
          "frame": 2,
          "estimatedSeconds": 16,
          "captions": [
            "量化改变每份权重需要的空间，模型并行减少单卡承担的份额，",
            "但卡与卡之间可能要交换中间结果。",
            "除了权重，单卡还得留出空间存请求的 KV 和临时数据。"
          ]
        },
        {
          "label": "缓存空间紧张时检查块分配",
          "narration": "如果模型装得下，一到高峰却连新请求的 KV 都分不出来，要查的是缓存占用和分配方式。KV Cache 把算过的键值留下来，供后续生成复用。PagedAttention 按需分块，减少提前预留却用不上的空间。",
          "focus": [
            "$[data-optimization=\"cache\"]"
          ],
          "id": "S22.3",
          "estimatedSeconds": 20,
          "captions": [
            "如果模型装得下，一到高峰却连新请求的 KV 都分不出来，",
            "要查的是缓存占用和分配方式。",
            "KV Cache 把算过的键值留下来，供后续生成复用。",
            "PagedAttention 按需分块，减少提前预留却用不上的空间。"
          ]
        },
        {
          "label": "输入重复时检查前缀命中",
          "narration": "如果耗时主要出在一遍遍处理同一份提示词或手册，就看 Prefix Caching 能不能命中。命中后可以直接用共有前缀的 KV，省掉这段输入的 Prefill。",
          "focus": [
            "$[data-optimization=\"prefix\"]"
          ],
          "id": "S22.7",
          "frame": 3,
          "estimatedSeconds": 16,
          "captions": [
            "如果耗时主要出在一遍遍处理同一份提示词或手册，",
            "就看 Prefix Caching 能不能命中。",
            "命中后可以直接用共有前缀的 KV，省掉这段输入的 Prefill。"
          ]
        },
        {
          "label": "注意力读写多时检查内核",
          "narration": "如果剖析发现注意力内核花了大量时间搬运中间结果，就回到第二章讲过的 FlashAttention。它把注意力分块计算，减少中间数据在片上和显存之间的往返。",
          "focus": [
            "$[data-optimization=\"attention\"]"
          ],
          "id": "S22.8",
          "frame": 3,
          "estimatedSeconds": 16,
          "captions": [
            "如果剖析发现注意力内核花了大量时间搬运中间结果，",
            "就回到第二章讲过的 FlashAttention。",
            "它把注意力分块计算，减少中间数据在片上和显存之间的往返。"
          ]
        },
        {
          "label": "从单轮开销转到生成轮次",
          "narration": "这些办法分别省空间、省重算或省读写。到了 Decode，哪怕每轮都算得很快，生成长回答仍要一轮轮往下走。能不能少让大模型执行几轮？",
          "focus": [
            "$[data-optimization=\"decode\"]"
          ],
          "id": "S22.9",
          "frame": 3,
          "estimatedSeconds": 14,
          "captions": [
            "这些办法分别省空间、省重算或省读写。",
            "到了 Decode，哪怕每轮都算得很快，生成长回答仍要一轮轮往下走。",
            "能不能少让大模型执行几轮？"
          ]
        }
      ],
      "estimatedSeconds": 153,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S37",
      "chapter": 4,
      "title": "让大模型一轮确认多个候选",
      "subtitle": "投机解码的提议、验证与接受",
      "kind": "extension",
      "sources": [
        "spec",
        "vllm"
      ],
      "terms": [
        "Speculative Decoding",
        "Draft Model",
        "Target Model"
      ],
      "steps": [
        {
          "id": "S37.0",
          "label": "观察逐个生成的依赖",
          "narration": "难点就在相邻两个 Token 之间。当前这个 Token 得先选出来，才能作为输入去预测下一个。通常大模型每轮 Decode 往前走一步。",
          "estimatedSeconds": 13,
          "captions": [
            "难点就在相邻两个 Token 之间。",
            "当前这个 Token 得先选出来，才能作为输入去预测下一个。",
            "通常大模型每轮 Decode 往前走一步。"
          ]
        },
        {
          "id": "S37.1",
          "label": "用较轻的模型先试几步",
          "narration": "投机解码会让一个更小、更快的草稿模型先猜几个 Token。比如它先猜出“西红柿、炒、肉”，把这几个候选交给目标模型检查。",
          "estimatedSeconds": 13,
          "captions": [
            "投机解码会让一个更小、更快的草稿模型先猜几个 Token。",
            "比如它先猜出“西红柿、炒、肉”，把这几个候选交给目标模型检查。"
          ]
        },
        {
          "id": "S37.2",
          "label": "目标模型并行核对多个位置",
          "narration": "候选已经准备好，目标模型就可以在一次前向中并行计算多个位置的结果，再检查这些候选是否符合自己的预测。每个位置仍然遵守因果顺序，只能使用它之前的上下文。",
          "estimatedSeconds": 17,
          "captions": [
            "候选已经准备好，目标模型就可以在一次前向中并行计算多个位置的结果，",
            "再检查这些候选是否符合自己的预测。",
            "每个位置仍然遵守因果顺序，只能使用它之前的上下文。"
          ]
        },
        {
          "id": "S37.3",
          "label": "保留通过的前缀并修正分歧",
          "narration": "用贪心解码举例：如果前两个候选符合目标模型的选择，就可以保留；第三个不符合，就从分歧处改用目标模型的结果。随机采样场景还需要相应的接受和修正规则。",
          "estimatedSeconds": 16,
          "captions": [
            "用贪心解码举例：如果前两个候选符合目标模型的选择，就可以保留；",
            "第三个不符合，就从分歧处改用目标模型的结果。",
            "随机采样场景还需要相应的接受和修正规则。"
          ]
        },
        {
          "id": "S37.4",
          "label": "比较额外开销与省下的轮次",
          "narration": "草稿猜得准，目标模型一次就可能确认好几个 Token。草稿猜偏了，起草和验证照样花时间，要测整条生成链的实际速度。这些都发生在推理引擎里。对调用模型的应用来说，它看到的是发出去的一条请求，以及陆续返回的回答。",
          "estimatedSeconds": 23,
          "captions": [
            "草稿猜得准，目标模型一次就可能确认好几个 Token。",
            "草稿猜偏了，起草和验证照样花时间，要测整条生成链的实际速度。",
            "这些都发生在推理引擎里。对调用模型的应用来说，",
            "它看到的是发出去的一条请求，以及陆续返回的回答。"
          ]
        }
      ],
      "estimatedSeconds": 82
    },
    {
      "id": "S23",
      "chapter": 5,
      "title": "应用怎样调用模型服务",
      "subtitle": "服务接收 API 请求，安排推理并返回结果",
      "kind": "api",
      "targetSeconds": 65,
      "terms": [
        "API",
        "Model Serving",
        "Streaming Output"
      ],
      "sources": [
        "vllm",
        "metrics",
        "http429"
      ],
      "steps": [
        {
          "label": "跟踪一次 POST 请求从客户端进入服务",
          "narration": "自己的应用要调用模型服务，通常会向服务端发送一条 HTTP 请求。比如把“什么是人工智能”放进 POST 请求的消息体，再发给模型的 API，也就是应用编程接口。",
          "id": "S23.0",
          "estimatedSeconds": 16,
          "captions": [
            "自己的应用要调用模型服务，通常会向服务端发送一条 HTTP 请求。",
            "比如把“什么是人工智能”放进 POST 请求的消息体，",
            "再发给模型的 API，也就是应用编程接口。"
          ]
        },
        {
          "label": "查看生成长度和流式开关",
          "narration": "请求里还可以指定生成参数，例如最多生成多少 Token，以及是否使用流式输出。图里把生成上限设成了一百二十八。",
          "focus": [
            "$[data-api-field=\"options\"]"
          ],
          "id": "S23.4",
          "frame": 0,
          "estimatedSeconds": 12,
          "captions": [
            "请求里还可以指定生成参数，例如最多生成多少 Token，",
            "以及是否使用流式输出。",
            "图里把生成上限设成了一百二十八。"
          ]
        },
        {
          "label": "跟踪客户端收到两块文字",
          "narration": "打开流式输出后，客户端不必等整段回答结束。服务先发回“人工智能”，接着再发“是一类”，用户就能边等边读。",
          "phase": [
            0,
            2210
          ],
          "id": "S23.1",
          "estimatedSeconds": 11,
          "captions": [
            "打开流式输出后，客户端不必等整段回答结束。",
            "服务先发回“人工智能”，接着再发“是一类”，用户就能边等边读。"
          ]
        },
        {
          "label": "取消请求并停止继续生成",
          "narration": "如果用户中途点了取消，客户端会把取消信号传给服务。服务收到后，应尽量停止为这条请求安排后续计算。",
          "phase": [
            5600,
            6230
          ],
          "id": "S23.5",
          "frame": 1,
          "estimatedSeconds": 12,
          "captions": [
            "如果用户中途点了取消，客户端会把取消信号传给服务。",
            "服务收到后，应尽量停止为这条请求安排后续计算。"
          ]
        },
        {
          "label": "逐一归还请求占用的缓存格",
          "narration": "请求结束后，它不再需要、也不需要继续保留的 KV Cache 块，就可以归还给缓存池，供其他请求使用。",
          "phase": [
            6230,
            7090
          ],
          "id": "S23.6",
          "frame": 1,
          "estimatedSeconds": 11,
          "captions": [
            "请求结束后，它不再需要、也不需要继续保留的 KV Cache 块，",
            "就可以归还给缓存池，供其他请求使用。"
          ]
        },
        {
          "label": "观察 A 通过限流检查",
          "narration": "面向公众开放的模型服务，还要控制谁能调用、每个人能调用多少。通常会在 API 网关做身份验证和限流；A 通过检查后，才会继续进入后面的推理流程。",
          "phase": [
            0,
            1060
          ],
          "id": "S23.2",
          "estimatedSeconds": 15,
          "captions": [
            "面向公众开放的模型服务，还要控制谁能调用、每个人能调用多少。",
            "通常会在 API 网关做身份验证和限流；",
            "A 通过检查后，才会继续进入后面的推理流程。"
          ]
        },
        {
          "label": "观察 B 超出限额时收到 429",
          "narration": "B 到达时，如果它在当前时间窗口内已经超过调用额度，服务就可能返回 HTTP 429，表示请求过多或触发了限流。",
          "phase": [
            1060,
            1490
          ],
          "id": "S23.7",
          "frame": 2,
          "estimatedSeconds": 12,
          "captions": [
            "B 到达时，如果它在当前时间窗口内已经超过调用额度，",
            "服务就可能返回 HTTP 429，表示请求过多或触发了限流。"
          ]
        },
        {
          "label": "区分超时与监控",
          "narration": "超时和限流不是一回事：限流是在入口判断请求能不能进来，超时则限制一条请求最多能等多久。要分清请求被拒绝还是等超时，就需要记录对应事件。",
          "focus": [
            "超时",
            "监控"
          ],
          "id": "S23.8",
          "frame": 2,
          "estimatedSeconds": 15,
          "captions": [
            "超时和限流不是一回事：限流是在入口判断请求能不能进来，",
            "超时则限制一条请求最多能等多久。",
            "要分清请求被拒绝还是等超时，就需要记录对应事件。"
          ]
        },
        {
          "label": "用 GET 查询可用模型",
          "narration": "如果应用要切换到另一家模型服务，即使两边都声称兼容 OpenAI API，也可以先用 GET 请求查询模型列表，确认目标模型是否存在。",
          "focus": [
            "GET /v1/models"
          ],
          "id": "S23.3",
          "estimatedSeconds": 14,
          "captions": [
            "如果应用要切换到另一家模型服务，即使两边都声称兼容 OpenAI API，",
            "也可以先用 GET 请求查询模型列表，确认目标模型是否存在。"
          ]
        },
        {
          "label": "定位切换前的检查项",
          "narration": "真正切换前，还要用应用会发送的真实请求核对参数、流式返回和错误格式。接口长得相似，不代表所有行为都完全一致。应用这边能发请求了，服务端还得在目标服务器上跑起来。",
          "focus": [
            "$ .p-api-final p"
          ],
          "id": "S23.9",
          "frame": 3,
          "estimatedSeconds": 19,
          "captions": [
            "真正切换前，还要用应用会发送的真实请求核对参数、流式返回和错误格式。",
            "接口长得相似，不代表所有行为都完全一致。",
            "应用这边能发请求了，服务端还得在目标服务器上跑起来。"
          ]
        }
      ],
      "estimatedSeconds": 137,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S24",
      "chapter": 5,
      "title": "Docker 镜像与容器",
      "subtitle": "镜像打包应用和依赖，容器是启动后的实例",
      "kind": "docker",
      "targetSeconds": 60,
      "terms": [
        "Docker",
        "Container",
        "Container Image"
      ],
      "sources": [
        "docker"
      ],
      "steps": [
        {
          "label": "开发机启动程序并开始监听",
          "narration": "开发机上，服务已经启动，正在监听八千号端口。现在把同一份代码放到另一台服务器上，它还能直接跑吗？",
          "phase": [
            0,
            350
          ],
          "id": "S24.0",
          "estimatedSeconds": 12,
          "captions": [
            "开发机上，服务已经启动，正在监听八千号端口。",
            "现在把同一份代码放到另一台服务器上，它还能直接跑吗？"
          ]
        },
        {
          "label": "将代码送往服务器并触发缺依赖错误",
          "narration": "一启动就报错：找不到 FastAPI。代码虽然传过去了，但它依赖的运行环境没有一起准备好。",
          "phase": [
            350,
            2170
          ],
          "id": "S24.4",
          "frame": 0,
          "estimatedSeconds": 10,
          "captions": [
            "一启动就报错：找不到 FastAPI。",
            "代码虽然传过去了，但它依赖的运行环境没有一起准备好。"
          ]
        },
        {
          "label": "定位运行环境的差异",
          "narration": "如果要在很多台机器上部署，每台机器都手动安装依赖，很容易出现漏装、版本不一致或配置不同，最后有些副本根本启动不了。",
          "focus": [
            "依赖齐全",
            "No module named 'fastapi'"
          ],
          "id": "S24.5",
          "frame": 0,
          "estimatedSeconds": 13,
          "captions": [
            "如果要在很多台机器上部署，每台机器都手动安装依赖，",
            "很容易出现漏装、版本不一致或配置不同，最后有些副本根本启动不了。"
          ]
        },
        {
          "label": "把代码、依赖和启动配置组织成镜像",
          "narration": "Docker 可以把应用代码、运行依赖和启动配置组织成镜像。服务器拿到同一份镜像，就能按统一的方式启动服务。",
          "id": "S24.1",
          "estimatedSeconds": 12,
          "captions": [
            "Docker 可以把应用代码、运行依赖和启动配置组织成镜像。",
            "服务器拿到同一份镜像，就能按统一的方式启动服务。"
          ]
        },
        {
          "label": "定位镜像外的模型权重",
          "narration": "模型权重是否放进镜像，要看文件大小和更新频率。权重很大、版本经常变化时，通常会放在外部存储，启动时再挂载或下载。",
          "focus": [
            "模型权重可外置挂载"
          ],
          "id": "S24.6",
          "frame": 1,
          "estimatedSeconds": 13,
          "captions": [
            "模型权重是否放进镜像，要看文件大小和更新频率。",
            "权重很大、版本经常变化时，通常会放在外部存储，启动时再挂载或下载。"
          ]
        },
        {
          "label": "从同一镜像启动两个容器",
          "narration": "同一份镜像可以启动多个容器。镜像像是一份打包好的模板，容器则是根据这份模板启动起来的运行实例。",
          "id": "S24.2",
          "estimatedSeconds": 12,
          "captions": [
            "同一份镜像可以启动多个容器。",
            "镜像像是一份打包好的模板，容器则是根据这份模板启动起来的运行实例。"
          ]
        },
        {
          "label": "定位两个实例共同依赖的宿主内核",
          "narration": "容器会隔离进程、文件系统和网络等环境，但通常共享宿主机的操作系统内核。因此它比完整虚拟机轻量，运行时仍依赖宿主机内核。",
          "focus": [
            "共享宿主机内核"
          ],
          "id": "S24.7",
          "frame": 2,
          "estimatedSeconds": 14,
          "captions": [
            "容器会隔离进程、文件系统和网络等环境，但通常共享宿主机的操作系统内核。",
            "因此它比完整虚拟机轻量，运行时仍依赖宿主机内核。"
          ]
        },
        {
          "label": "跟踪容器访问宿主机 GPU 的路径",
          "narration": "容器里要使用 GPU，还需要宿主机提供设备访问能力，并确保容器中的 CUDA 运行库与宿主机驱动兼容。只把程序打进镜像，并不会自动获得 GPU。",
          "id": "S24.3",
          "estimatedSeconds": 15,
          "captions": [
            "容器里要使用 GPU，还需要宿主机提供设备访问能力，",
            "并确保容器中的 CUDA 运行库与宿主机驱动兼容。",
            "只把程序打进镜像，并不会自动获得 GPU。"
          ]
        },
        {
          "label": "从容器启动转到模型发布",
          "narration": "镜像让新副本可以用同样的环境启动。如果这次换的是模型版本，线上还有用户正在等回答。怎样让旧版继续接请求，同时验证新副本，等它准备好再接流量？",
          "focus": [
            "容器 A",
            "容器 B"
          ],
          "id": "S24.8",
          "frame": 3,
          "estimatedSeconds": 15,
          "captions": [
            "镜像让新副本可以用同样的环境启动。",
            "如果这次换的是模型版本，线上还有用户正在等回答。",
            "怎样让旧版继续接请求，同时验证新副本，等它准备好再接流量？"
          ]
        }
      ],
      "estimatedSeconds": 116,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S38",
      "chapter": 5,
      "title": "新版本怎样开始接流量",
      "subtitle": "从模型注册到预热、就绪和回滚",
      "kind": "extension",
      "sources": [
        "registry",
        "probes",
        "rollout",
        "gpu_container",
        "quant"
      ],
      "terms": [
        "Model Registry",
        "Model Loading",
        "Warmup",
        "Health Check",
        "Rolling Update",
        "Rollback"
      ],
      "steps": [
        {
          "id": "S38.0",
          "label": "选定可追溯的模型版本",
          "narration": "现在准备把服务升级到第二版模型。为了以后能查清线上到底运行的是哪一版，需要记录模型版本、权重地址、配置、分词器和对应的评估结果。模型注册表可以帮助管理这些产物。",
          "estimatedSeconds": 18,
          "captions": [
            "现在准备把服务升级到第二版模型。",
            "为了以后能查清线上到底运行的是哪一版，",
            "需要记录模型版本、权重地址、配置、分词器和对应的评估结果。",
            "模型注册表可以帮助管理这些产物。"
          ]
        },
        {
          "id": "S38.1",
          "label": "转换格式并验证候选版本",
          "narration": "如果目标设备需要另一种模型格式，就先做格式转换或量化。验证时要测最终准备部署的产物，而不是只测转换前的原始模型。",
          "estimatedSeconds": 13,
          "captions": [
            "如果目标设备需要另一种模型格式，就先做格式转换或量化。",
            "验证时要测最终准备部署的产物，而不是只测转换前的原始模型。"
          ]
        },
        {
          "id": "S38.2",
          "label": "准备环境并分配设备",
          "narration": "部署系统先准备好运行镜像，再向集群申请 GPU 等资源。拿到设备后，服务进程还要下载或挂载模型产物，并把权重加载到显存。",
          "estimatedSeconds": 13,
          "captions": [
            "部署系统先准备好运行镜像，再向集群申请 GPU 等资源。",
            "拿到设备后，服务进程还要下载或挂载模型产物，并把权重加载到显存。"
          ]
        },
        {
          "id": "S38.3",
          "label": "用测试请求预热",
          "narration": "进程启动成功，也不代表第一条真实请求就会很快。可以先发一条内部测试请求做 Warmup，也就是预热，把部分首次执行的准备开销提前完成。",
          "estimatedSeconds": 15,
          "captions": [
            "进程启动成功，也不代表第一条真实请求就会很快。",
            "可以先发一条内部测试请求做 Warmup，也就是预热，",
            "把部分首次执行的准备开销提前完成。"
          ]
        },
        {
          "id": "S38.4",
          "label": "等就绪检查通过再转入流量",
          "narration": "副本通过 Readiness，也就是就绪检查之后，入口才应该把真实流量分给它。Liveness 存活检查关注的是进程是否还正常、是否需要重启；两种检查解决的问题不同。",
          "estimatedSeconds": 17,
          "captions": [
            "副本通过 Readiness，也就是就绪检查之后，入口才应该把真实流量分给它。",
            "Liveness 存活检查关注的是进程是否还正常、是否需要重启；",
            "两种检查解决的问题不同。"
          ]
        },
        {
          "id": "S38.5",
          "label": "滚动替换旧版本",
          "narration": "滚动更新时，新副本逐个启动并通过就绪检查，旧副本继续处理已有请求。等流量切换完成，旧副本再停止接收新请求，处理完手头任务后退出。",
          "estimatedSeconds": 14,
          "captions": [
            "滚动更新时，新副本逐个启动并通过就绪检查，旧副本继续处理已有请求。",
            "等流量切换完成，旧副本再停止接收新请求，处理完手头任务后退出。"
          ]
        },
        {
          "id": "S38.6",
          "label": "发现异常后回到上一版",
          "narration": "如果第二版上线后错误率升高，或者性能不符合预期，可以先让旧版副本重新就绪，再把流量切回去。新旧副本都需要机器和 GPU。谁给副本找位置、补足数量？如果程序里的任务要跨机器执行，又由谁分派？",
          "estimatedSeconds": 21,
          "captions": [
            "如果第二版上线后错误率升高，或者性能不符合预期，",
            "可以先让旧版副本重新就绪，再把流量切回去。",
            "新旧副本都需要机器和 GPU。谁给副本找位置、补足数量？",
            "如果程序里的任务要跨机器执行，又由谁分派？"
          ]
        }
      ],
      "estimatedSeconds": 111
    },
    {
      "id": "S25",
      "chapter": 5,
      "title": "Kubernetes 与 Ray 的分工",
      "subtitle": "用 Kubernetes 部署容器，用 Ray 分发程序任务",
      "kind": "orchestration",
      "targetSeconds": 75,
      "terms": [
        "Kubernetes",
        "K8s",
        "Ray",
        "Cluster",
        "Node",
        "Resource Scheduling"
      ],
      "sources": [
        "k8s",
        "ray",
        "vllm_scheduler"
      ],
      "steps": [
        {
          "label": "识别集群中的两台节点",
          "narration": "把多台服务器组织起来共同运行服务，就形成了一个集群。每台服务器或计算实例都可以作为一个节点，拥有自己的 CPU、内存和 GPU 等资源。",
          "focus": [
            "节点 0",
            "节点 1"
          ],
          "id": "S25.0",
          "estimatedSeconds": 14,
          "captions": [
            "把多台服务器组织起来共同运行服务，就形成了一个集群。",
            "每台服务器或计算实例都可以作为一个节点，",
            "拥有自己的 CPU、内存和 GPU 等资源。"
          ]
        },
        {
          "label": "定位节点提供的资源",
          "narration": "给服务副本选择节点时，不能只看有没有 GPU。CPU、系统内存、设备型号以及节点当前的资源余量，都可能影响它能不能启动。",
          "focus": [
            "GPU",
            "CPU / RAM"
          ],
          "id": "S25.4",
          "frame": 0,
          "estimatedSeconds": 13,
          "captions": [
            "给服务副本选择节点时，不能只看有没有 GPU。",
            "CPU、系统内存、设备型号",
            "以及节点当前的资源余量，都可能影响它能不能启动。"
          ]
        },
        {
          "label": "展示两个处于运行状态的 Pod",
          "narration": "Kubernetes 负责管理容器化应用。我们可以声明希望运行两个副本，每个副本由一个 Pod 承载；一个 Pod 里可以包含一个或多个需要一起部署的容器。",
          "phase": [
            0,
            500
          ],
          "id": "S25.1",
          "estimatedSeconds": 15,
          "captions": [
            "Kubernetes 负责管理容器化应用。",
            "我们可以声明希望运行两个副本，每个副本由一个 Pod 承载；",
            "一个 Pod 里可以包含一个或多个需要一起部署的容器。"
          ]
        },
        {
          "label": "让节点一上的 Pod 消失",
          "narration": "假设节点一上的 Pod 意外消失了，当前能够接收请求的副本就少了一个，服务容量也会随之下降。",
          "phase": [
            500,
            1320
          ],
          "id": "S25.5",
          "frame": 1,
          "estimatedSeconds": 11,
          "captions": [
            "假设节点一上的 Pod 意外消失了，",
            "当前能够接收请求的副本就少了一个，服务容量也会随之下降。"
          ]
        },
        {
          "label": "创建替代 Pod 并恢复两个副本",
          "narration": "Kubernetes 控制器会持续比较实际副本数和期望副本数。发现少了一个，就会创建新的 Pod；只要其他节点有足够资源，调度器就能把它放到别处。",
          "phase": [
            2750,
            3090
          ],
          "id": "S25.6",
          "frame": 1,
          "estimatedSeconds": 15,
          "captions": [
            "Kubernetes 控制器会持续比较实际副本数和期望副本数。",
            "发现少了一个，就会创建新的 Pod；",
            "只要其他节点有足够资源，调度器就能把它放到别处。"
          ]
        },
        {
          "label": "把 Ray 任务发送到不同节点",
          "narration": "Pod 启动以后，应用内部可能还有需要跨机器执行的任务。Ray 可以把这些程序任务提交到集群中的 Worker，让它们在不同节点上运行。",
          "id": "S25.2",
          "estimatedSeconds": 14,
          "captions": [
            "Pod 启动以后，应用内部可能还有需要跨机器执行的任务。",
            "Ray 可以把这些程序任务提交到集群中的 Worker，让它们在不同节点上运行。"
          ]
        },
        {
          "label": "区分 Ray 的 Task 与 Actor",
          "narration": "Ray 里，一次性执行的工作可以提交成 Task；如果需要长期存在、保留状态并反复接收调用，就可以使用 Actor。比如 Actor 可以先加载模型，再持续处理任务。",
          "focus": [
            "Ray Worker 0",
            "Ray Worker 1"
          ],
          "id": "S25.7",
          "frame": 2,
          "estimatedSeconds": 16,
          "captions": [
            "Ray 里，一次性执行的工作可以提交成 Task；",
            "如果需要长期存在、保留状态并反复接收调用，就可以使用 Actor。",
            "比如 Actor 可以先加载模型，再持续处理任务。"
          ]
        },
        {
          "label": "定位 Kubernetes 给 Pod 选节点",
          "narration": "所以要区分两个调度器，关键是看它们管理的对象：Kubernetes 负责把 Pod 放到节点上，并维持应用副本数量。",
          "focus": [
            "Kubernetes",
            "Pod → 节点"
          ],
          "id": "S25.3",
          "estimatedSeconds": 12,
          "phase": [
            0,
            1100
          ],
          "captions": [
            "所以要区分两个调度器，关键是看它们管理的对象：",
            "Kubernetes 负责把 Pod 放到节点上，并维持应用副本数量。"
          ]
        },
        {
          "label": "定位 Ray 给 Task 或 Actor 分配 Worker",
          "narration": "Ray 关注的是程序里的 Task 和 Actor，根据它们声明的资源需求选择执行位置，再由对应节点上的 Worker 进程运行。",
          "focus": [
            "Ray",
            "Task / Actor → Worker"
          ],
          "id": "S25.8",
          "frame": 3,
          "estimatedSeconds": 13,
          "phase": [
            0,
            1100
          ],
          "captions": [
            "Ray 关注的是程序里的 Task 和 Actor，",
            "根据它们声明的资源需求选择执行位置，",
            "再由对应节点上的 Worker 进程运行。"
          ]
        },
        {
          "id": "S25.9",
          "frame": 3,
          "label": "定位引擎每轮选择请求和 Token",
          "narration": "推理引擎还管另一件事。对已经进入服务的请求，它决定这一轮谁一起算、每条处理多少 Token。调度器能分配 GPU，部署时还得决定这些卡要怎样组成副本。",
          "estimatedSeconds": 17,
          "focus": [
            "推理引擎",
            "请求 / Token → 本轮批次"
          ],
          "phase": [
            0,
            1100
          ],
          "captions": [
            "推理引擎还管另一件事。对已经进入服务的请求，",
            "它决定这一轮谁一起算、每条处理多少 Token。",
            "调度器能分配 GPU，部署时还得决定这些卡要怎样组成副本。"
          ]
        }
      ],
      "estimatedSeconds": 140,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S26",
      "chapter": 5,
      "title": "服务副本与模型并行",
      "subtitle": "请求可以分到多个副本，一个副本也可以跨多卡运行",
      "kind": "replicas",
      "targetSeconds": 80,
      "terms": [
        "Load Balancing",
        "Auto Scaling",
        "Model Parallelism",
        "Replica"
      ],
      "sources": [
        "k8s",
        "distributed",
        "vllm"
      ],
      "steps": [
        {
          "label": "回收开场的两个完整模型副本",
          "narration": "回到开头的两张卡。每张卡各放一份完整模型，就形成两个独立的服务副本，可以分别接收请求。",
          "focus": [
            "服务副本 1",
            "服务副本 2"
          ],
          "id": "S26.0",
          "estimatedSeconds": 11,
          "captions": [
            "回到开头的两张卡。",
            "每张卡各放一份完整模型，就形成两个独立的服务副本，",
            "可以分别接收请求。"
          ]
        },
        {
          "label": "定位独立权重和缓存",
          "narration": "每个副本都有自己的模型权重和 KV Cache 池。在这个部署方式下，第一份模型保存的对话上下文，第二份模型不能直接读取。",
          "focus": [
            "完整权重 · 独立缓存"
          ],
          "id": "S26.4",
          "frame": 0,
          "estimatedSeconds": 13,
          "captions": [
            "每个副本都有自己的模型权重和 KV Cache 池。",
            "在这个部署方式下，第一份模型保存的对话上下文，第二份模型不能直接读取。"
          ]
        },
        {
          "label": "让 A、B、C 走向不同副本",
          "narration": "入口可以通过负载均衡器把不同请求分到不同副本。示例里 A 和 C 去第一份模型，B 去第二份。",
          "id": "S26.1",
          "estimatedSeconds": 11,
          "captions": [
            "入口可以通过负载均衡器把不同请求分到不同副本。",
            "示例里 A 和 C 去第一份模型，B 去第二份。"
          ]
        },
        {
          "label": "指出请求后续使用同一份缓存",
          "narration": "请求开始生成后，通常要保持在同一个副本上继续执行，这样后续 Decode 才能直接使用该副本里已经保存的 KV Cache。",
          "focus": [
            "请求留在选中的副本上，",
            "继续使用同一份缓存状态。"
          ],
          "id": "S26.5",
          "frame": 1,
          "estimatedSeconds": 13,
          "captions": [
            "请求开始生成后，通常要保持在同一个副本上继续执行，",
            "这样后续 Decode 才能直接使用该副本里已经保存的 KV Cache。"
          ]
        },
        {
          "label": "将同一模型分到两张 GPU",
          "narration": "如果一张卡放不下完整模型，就不能简单地再复制一份。可以把同一个模型拆到两张或更多 GPU 上，由它们共同组成一个服务副本，这就是模型并行。",
          "focus": [
            "两张 GPU 执行同一模型",
            "部分参数 / 状态"
          ],
          "id": "S26.2",
          "estimatedSeconds": 15,
          "captions": [
            "如果一张卡放不下完整模型，就不能简单地再复制一份。",
            "可以把同一个模型拆到两张或更多 GPU 上，",
            "由它们共同组成一个服务副本，这就是模型并行。"
          ]
        },
        {
          "label": "跟踪卡间交换",
          "narration": "模型拆开以后，各卡在执行过程中可能要交换中间结果。卡间互联的带宽和延迟，会直接影响这个副本的整体响应时间。",
          "phase": [
            0,
            1730
          ],
          "id": "S26.6",
          "frame": 2,
          "estimatedSeconds": 13,
          "captions": [
            "模型拆开以后，各卡在执行过程中可能要交换中间结果。",
            "卡间互联的带宽和延迟，会直接影响这个副本的整体响应时间。"
          ]
        },
        {
          "label": "对照模型内分工和副本间分流",
          "narration": "因此可以把两种方式组合起来：一个副本内部由多张卡协作完成模型计算，副本与副本之间再通过负载均衡分担不同请求。",
          "focus": [
            "两张 GPU 执行同一模型",
            "负载均衡"
          ],
          "id": "S26.7",
          "frame": 2,
          "estimatedSeconds": 13,
          "captions": [
            "因此可以把两种方式组合起来：一个副本内部由多张卡协作完成模型计算，",
            "副本与副本之间再通过负载均衡分担不同请求。"
          ]
        },
        {
          "label": "第三个服务副本开始加载",
          "narration": "流量继续上涨时，可以增加服务副本，也就是 Autoscaling 自动伸缩。但新副本不是一出现就能接单，它还要等到资源、加载权重并完成启动。",
          "phase": [
            0,
            2450
          ],
          "id": "S26.3",
          "estimatedSeconds": 14,
          "captions": [
            "流量继续上涨时，可以增加服务副本，也就是 Autoscaling 自动伸缩。",
            "但新副本不是一出现就能接单，它还要等到资源、加载权重并完成启动。"
          ]
        },
        {
          "label": "副本就绪后接收 D",
          "narration": "第三个副本启动后，先通过就绪检查。入口确认它能够正常处理请求，才会把新的 D 请求分配过去。",
          "phase": [
            2450,
            5500
          ],
          "id": "S26.8",
          "frame": 3,
          "estimatedSeconds": 11,
          "captions": [
            "第三个副本启动后，先通过就绪检查。",
            "入口确认它能够正常处理请求，才会把新的 D 请求分配过去。"
          ]
        },
        {
          "label": "定位缩容前需要处理的副本",
          "narration": "流量回落时，先停止向待退出副本发新请求，等手上的回答处理完，再释放资源。副本加减之后，用户等得有多久，系统一秒能处理多少？这两项都量出来，才知道部署和扩缩容起了什么作用。",
          "focus": [
            "$[data-replica=\"new\"]"
          ],
          "id": "S26.9",
          "frame": 3,
          "estimatedSeconds": 20,
          "captions": [
            "流量回落时，先停止向待退出副本发新请求，",
            "等手上的回答处理完，再释放资源。",
            "副本加减之后，用户等得有多久，系统一秒能处理多少？",
            "这两项都量出来，才知道部署和扩缩容起了什么作用。"
          ]
        }
      ],
      "estimatedSeconds": 134,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S27",
      "chapter": 5,
      "title": "推理延迟与吞吐量",
      "subtitle": "用四个输出 Token 计算 TTFT 和 TPOT",
      "kind": "metrics",
      "targetSeconds": 70,
      "terms": [
        "Latency",
        "TTFT",
        "TPOT",
        "Throughput",
        "Concurrency"
      ],
      "sources": [
        "metrics"
      ],
      "steps": [
        {
          "label": "从发送时刻走到首个 Token",
          "narration": "用户说聊天变慢了，先别急着看 GPU 利用率。要问清楚：是发出问题后很久才看到第一个字，还是开头很快出现、后面的字却一个个等很久？这两种延迟要分开测。",
          "id": "S27.0",
          "estimatedSeconds": 16,
          "captions": [
            "用户说聊天变慢了，先别急着看 GPU 利用率。",
            "要问清楚：是发出问题后很久才看到第一个字，",
            "还是开头很快出现、后面的字却一个个等很久？",
            "这两种延迟要分开测。"
          ]
        },
        {
          "label": "标出首 Token 前的整段等待",
          "narration": "从发送请求到收到第一个 Token 的时间，叫 TTFT，也就是首 Token 延迟。它不只包含模型计算，还包括网络传输、入口处理和排队等待。示例里一共是 0.8 秒。",
          "focus": [
            "TTFT = 0.8 s"
          ],
          "id": "S27.4",
          "frame": 0,
          "estimatedSeconds": 16,
          "captions": [
            "从发送请求到收到第一个 Token 的时间，叫 TTFT，也就是首 Token 延迟。",
            "它不只包含模型计算，还包括网络传输、入口处理和排队等待。",
            "示例里一共是 0.8 秒。"
          ]
        },
        {
          "label": "逐个显示首个 Token 后的输出",
          "narration": "第一个 Token 到达后，后面又陆续收到了三个 Token。到最后一个到达时，从发送请求开始已经过去了 1.1 秒。",
          "id": "S27.1",
          "estimatedSeconds": 12,
          "captions": [
            "第一个 Token 到达后，后面又陆续收到了三个 Token。",
            "到最后一个到达时，从发送请求开始已经过去了 1.1 秒。"
          ]
        },
        {
          "label": "将后续总时间分到三个间隔",
          "narration": "总时间 1.1 秒减去首 Token 的 0.8 秒，后续生成一共用了 0.3 秒。注意，这里有四个 Token，但它们之间只有三个间隔。",
          "focus": [
            "0.3 s / 3"
          ],
          "id": "S27.5",
          "frame": 1,
          "estimatedSeconds": 12,
          "captions": [
            "总时间 1.1 秒减去首 Token 的 0.8 秒，后续生成一共用了 0.3 秒。",
            "注意，这里有四个 Token，但它们之间只有三个间隔。"
          ]
        },
        {
          "label": "定位后续 Token 的平均时间",
          "narration": "相邻 Token 到达的间隔叫 ITL。把这三个间隔取平均，得到每个后续 Token 平均约 0.1 秒，也就是这个例子里的 TPOT。",
          "focus": [
            "TPOT = 0.1 s"
          ],
          "id": "S27.6",
          "frame": 1,
          "estimatedSeconds": 12,
          "captions": [
            "相邻 Token 到达的间隔叫 ITL。",
            "把这三个间隔取平均，得到每个后续 Token 平均约 0.1 秒，",
            "也就是这个例子里的 TPOT。"
          ]
        },
        {
          "label": "标出从发送到完成的总延迟",
          "narration": "从发送请求到整段回答完成的时间，叫端到端延迟。本例是 1.1 秒，它把首 Token 等待和后续生成时间都包括在内。",
          "phase": [
            0,
            260
          ],
          "focus": [
            "总延迟 = 1.1 s"
          ],
          "id": "S27.2",
          "estimatedSeconds": 12,
          "captions": [
            "从发送请求到整段回答完成的时间，叫端到端延迟。",
            "本例是 1.1 秒，它把首 Token 等待和后续生成时间都包括在内。"
          ]
        },
        {
          "label": "统计两个请求在测量窗内的输出",
          "narration": "再看服务整体的产出。取一个两秒的统计窗口，A 输出了四个 Token，B 输出了六个。",
          "phase": [
            260,
            1080
          ],
          "id": "S27.7",
          "frame": 2,
          "estimatedSeconds": 10,
          "captions": [
            "再看服务整体的产出。",
            "取一个两秒的统计窗口，A 输出了四个 Token，B 输出了六个。"
          ]
        },
        {
          "label": "算出每秒 Token 数",
          "narration": "两条请求一共输出十个 Token，除以两秒，就是每秒五个 Token。这是输出 Token 吞吐量。",
          "phase": [
            1080,
            1410
          ],
          "id": "S27.8",
          "frame": 2,
          "estimatedSeconds": 10,
          "captions": [
            "两条请求一共输出十个 Token，除以两秒，就是每秒五个 Token。",
            "这是输出 Token 吞吐量。"
          ]
        },
        {
          "label": "用 A 和 B 说明并发",
          "narration": "并发关注的是同一时刻有多少条请求尚未完成。A 和 B 正在执行时，新的请求也可能已经到达，只是还没轮到它。",
          "phase": [
            0,
            1720
          ],
          "id": "S27.3",
          "estimatedSeconds": 12,
          "captions": [
            "并发关注的是同一时刻有多少条请求尚未完成。",
            "A 和 B 正在执行时，新的请求也可能已经到达，只是还没轮到它。"
          ]
        },
        {
          "label": "为 C 揭示一段等待时间",
          "narration": "比如 C 已经进入服务，却因为资源不足还在排队。它虽然没有在 GPU 上执行，仍然是一条未完成的并发请求。",
          "phase": [
            1720,
            2400
          ],
          "id": "S27.9",
          "frame": 3,
          "estimatedSeconds": 12,
          "captions": [
            "比如 C 已经进入服务，却因为资源不足还在排队。",
            "它虽然没有在 GPU 上执行，仍然是一条未完成的并发请求。"
          ]
        },
        {
          "label": "A 释放缓存后让 C 开始执行",
          "narration": "等 A 结束并释放足够的缓存空间，C 才能开始执行。它在队列里等待的这段时间，也会计入 C 的 TTFT。",
          "phase": [
            4900,
            5870
          ],
          "id": "S27.10",
          "frame": 3,
          "estimatedSeconds": 11,
          "captions": [
            "等 A 结束并释放足够的缓存空间，C 才能开始执行。",
            "它在队列里等待的这段时间，也会计入 C 的 TTFT。"
          ]
        },
        {
          "label": "把指标交给下一页的监控案例",
          "narration": "并发提高后，设备每秒可能处理更多 Token，但单个用户也可能等得更久。看服务表现时，吞吐量和延迟必须放在一起判断。",
          "focus": [
            "$[data-metric-span=\"wait\"]"
          ],
          "id": "S27.11",
          "frame": 3,
          "estimatedSeconds": 13,
          "captions": [
            "并发提高后，设备每秒可能处理更多 Token，但单个用户也可能等得更久。",
            "看服务表现时，吞吐量和延迟必须放在一起判断。"
          ]
        }
      ],
      "estimatedSeconds": 148,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S28",
      "chapter": 5,
      "title": "推理服务的监控指标",
      "subtitle": "固定模型和请求长度，观察并发变化",
      "kind": "dashboard",
      "targetSeconds": 70,
      "terms": [
        "Concurrency",
        "TTFT",
        "TPOT",
        "Throughput",
        "GPU Utilization",
        "OOM",
        "Profiling"
      ],
      "sources": [
        "metrics",
        "cuda",
        "vllm_scheduler"
      ],
      "steps": [
        {
          "label": "收到变慢反馈并调出低负载基线",
          "narration": "沿着刚才的反馈继续查。用户抱怨的是开头来得慢，我们先用一组模拟数据，对比低负载和高负载时的表现。",
          "focus": [
            "低负载",
            "$ .p-load-state strong"
          ],
          "id": "S28.0",
          "estimatedSeconds": 12,
          "captions": [
            "沿着刚才的反馈继续查。",
            "用户抱怨的是开头来得慢，我们先用一组模拟数据，",
            "对比低负载和高负载时的表现。"
          ]
        },
        {
          "label": "确认低负载时的 TTFT 基线",
          "narration": "低负载时只有两条请求同时执行，没有请求排队，首 Token 延迟是 180 毫秒。先把它作为这组实验的基线。",
          "focus": [
            "等待队列",
            "$[data-metric=\"ttft\"]"
          ],
          "id": "S28.4",
          "frame": 0,
          "estimatedSeconds": 11,
          "captions": [
            "低负载时只有两条请求同时执行，没有请求排队，首 Token 延迟是 180 毫秒。",
            "先把它作为这组实验的基线。"
          ]
        },
        {
          "label": "把吞吐曲线推进到中负载",
          "narration": "保持模型、硬件和请求长度不变，只把并发提高到八。设备一轮里有更多工作可以处理，输出吞吐量上升到每秒 180 个 Token。",
          "id": "S28.1",
          "estimatedSeconds": 13,
          "captions": [
            "保持模型、硬件和请求长度不变，只把并发提高到八。",
            "设备一轮里有更多工作可以处理，输出吞吐量上升到每秒 180 个 Token。"
          ]
        },
        {
          "label": "突出中负载时的延迟变化",
          "narration": "整体产量上去了，但单条请求的首 Token 等待和后续 Token 间隔也略有增加。系统总共做得更多，不代表每个人都等得更少。",
          "focus": [
            "$[data-metric=\"ttft\"]",
            "$[data-metric=\"tpot\"]"
          ],
          "id": "S28.5",
          "frame": 1,
          "estimatedSeconds": 13,
          "captions": [
            "整体产量上去了，但单条请求的首 Token 等待和后续 Token 间隔也略有增加。",
            "系统总共做得更多，不代表每个人都等得更少。"
          ]
        },
        {
          "label": "把吞吐曲线推进到高负载",
          "narration": "并发继续提高到二十四，输出吞吐量只增加了二十五个 Token，达到每秒 205 个。继续增加请求，产量已经没有明显增长，说明系统接近当前配置下的瓶颈。",
          "id": "S28.2",
          "estimatedSeconds": 15,
          "captions": [
            "并发继续提高到二十四，",
            "输出吞吐量只增加了二十五个 Token，达到每秒 205 个。",
            "继续增加请求，产量已经没有明显增长，说明系统接近当前配置下的瓶颈。"
          ]
        },
        {
          "label": "对照高负载 TTFT 和八条等待请求",
          "narration": "这时有八条请求还在排队，TTFT 已经升到 1300 毫秒。用户感觉开头变慢，很可能不是模型算得慢，而是请求在开始计算前等了太久。",
          "focus": [
            "等待队列",
            "$[data-queue-slot][data-occupied=\"true\"]",
            "$[data-metric=\"ttft\"]"
          ],
          "id": "S28.6",
          "frame": 2,
          "estimatedSeconds": 14,
          "captions": [
            "这时有八条请求还在排队，TTFT 已经升到 1300 毫秒。",
            "用户感觉开头变慢，很可能不是模型算得慢，而是请求在开始计算前等了太久。"
          ]
        },
        {
          "label": "查看高负载下的显存占用",
          "narration": "同时，显存占用已经达到百分之九十四。不过这个总量还不能直接告诉我们具体卡在哪里，下一步要继续看缓存和调度预算。",
          "focus": [
            "$[data-memory-percent=\"94\"]",
            "94%"
          ],
          "id": "S28.7",
          "frame": 2,
          "estimatedSeconds": 13,
          "captions": [
            "同时，显存占用已经达到百分之九十四。",
            "不过这个总量还不能直接告诉我们具体卡在哪里，",
            "下一步要继续看缓存和调度预算。"
          ]
        },
        {
          "label": "从 TTFT 拆出 950 毫秒排队",
          "narration": "把 1300 毫秒拆开看，其中 950 毫秒花在排队上。即使把 GPU 内核提速一倍，前面这段等待也不会自动消失。",
          "phase": [
            0,
            1200
          ],
          "id": "S28.3",
          "estimatedSeconds": 11,
          "captions": [
            "把 1300 毫秒拆开看，其中 950 毫秒花在排队上。",
            "即使把 GPU 内核提速一倍，前面这段等待也不会自动消失。"
          ]
        },
        {
          "label": "核对 KV 缓存余量和每轮 Token 预算",
          "narration": "接下来要查两件具体的事：当前还能不能分配新请求需要的 KV 块？这一轮还能不能安排更多 Token 计算？单看显存总占用率，回答不了这两个问题。",
          "id": "S28.8",
          "frame": 3,
          "estimatedSeconds": 15,
          "phase": [
            1200,
            2350
          ],
          "captions": [
            "接下来要查两件具体的事：当前还能不能分配新请求需要的 KV 块？",
            "这一轮还能不能安排更多 Token 计算？",
            "单看显存总占用率，回答不了这两个问题。"
          ]
        },
        {
          "label": "从监控异常转向单条请求",
          "narration": "这组数据把问题缩小到了排队阶段。如果确认是流量超出处理能力，可以限流，或加副本分担。接着看每秒完成了多少请求，以及等得最久的一批等了多久。要跟到具体请求，还得结合日志和 Trace。",
          "id": "S28.9",
          "frame": 3,
          "estimatedSeconds": 22,
          "phase": [
            2350,
            3600
          ],
          "captions": [
            "这组数据把问题缩小到了排队阶段。",
            "如果确认是流量超出处理能力，可以限流，或加副本分担。",
            "接着看每秒完成了多少请求，以及等得最久的一批等了多久。",
            "要跟到具体请求，还得结合日志和 Trace。"
          ]
        }
      ],
      "estimatedSeconds": 139,
      "transition": "读完后按 Space，进入下一页第一句。"
    },
    {
      "id": "S39",
      "chapter": 5,
      "title": "同一次慢请求怎样查到原因",
      "subtitle": "用指标发现异常，用日志和追踪缩小范围",
      "kind": "extension",
      "sources": [
        "otel",
        "metrics",
        "goodput",
        "nsys"
      ],
      "terms": [
        "Metrics",
        "Logs",
        "Traces",
        "P50 / P95 / P99",
        "ITL",
        "SLO",
        "Goodput",
        "Profiling"
      ],
      "steps": [
        {
          "id": "S39.0",
          "label": "用两个计数器测吞吐",
          "narration": "先把产量的单位分清楚。除了每秒输出多少个 Token，还可以数每秒完成多少条请求。图里两秒内完成两条，也就是每秒一条，输出吞吐量是每秒五个 Token。",
          "estimatedSeconds": 16,
          "captions": [
            "先把产量的单位分清楚。除了每秒输出多少个 Token，",
            "还可以数每秒完成多少条请求。",
            "图里两秒内完成两条，也就是每秒一条，输出吞吐量是每秒五个 Token。"
          ]
        },
        {
          "id": "S39.1",
          "label": "让长尾延迟浮出水面",
          "narration": "平均数也可能掩盖少数特别慢的请求。把延迟从短到长排序，P50 表示中位数，P95 和 P99 分别表示 95% 和 99% 的请求不超过的延迟位置。示例里，P99 已经超过服务时限。",
          "estimatedSeconds": 17,
          "captions": [
            "平均数也可能掩盖少数特别慢的请求。",
            "把延迟从短到长排序，P50 表示中位数，",
            "P95 和 P99 分别表示 95% 和 99% 的请求不超过的延迟位置。",
            "示例里，P99 已经超过服务时限。"
          ]
        },
        {
          "id": "S39.2",
          "label": "按服务目标计算 Goodput",
          "narration": "SLO 是服务级别目标。比如要求 95% 的请求成功，并且在 800 毫秒内返回首 Token。如果十秒内处理了一百条请求，其中九十五条达标，那么 Goodput，也就是满足服务目标的有效吞吐量，就是每秒 9.5 条。",
          "estimatedSeconds": 19,
          "captions": [
            "SLO 是服务级别目标。",
            "比如要求 95% 的请求成功，并且在 800 毫秒内返回首 Token。",
            "如果十秒内处理了一百条请求，其中九十五条达标，",
            "那么 Goodput，也就是满足服务目标的有效吞吐量，就是每秒 9.5 条。"
          ]
        },
        {
          "id": "S39.3",
          "label": "读取成组的监控指标",
          "narration": "接着把同一时间段的队列长度、错误率、GPU 利用率、显存占用和实际带宽放在一起看。这些随时间采集的运行数据叫 Metrics，也就是监控指标。",
          "estimatedSeconds": 15,
          "captions": [
            "接着把同一时间段的队列长度、错误率、GPU 利用率、",
            "显存占用和实际带宽放在一起看。",
            "这些随时间采集的运行数据叫 Metrics，也就是监控指标。"
          ]
        },
        {
          "id": "S39.4",
          "label": "在日志里查具体事件",
          "narration": "指标告诉我们异常大概发生在什么时候，日志则能补充具体事件。比如找到请求 r-17 的记录，发现它当时申请不到 KV 块。",
          "estimatedSeconds": 13,
          "captions": [
            "指标告诉我们异常大概发生在什么时候，日志则能补充具体事件。",
            "比如找到请求 r-17 的记录，发现它当时申请不到 KV 块。"
          ]
        },
        {
          "id": "S39.5",
          "label": "沿同一条 Trace 找耗时",
          "narration": "再用请求编号查 Trace，也就是分布式链路追踪。把网关、排队、模型执行和结果返回这些阶段拆开后，就能看到这条请求有 950 毫秒耗在队列里。",
          "estimatedSeconds": 15,
          "captions": [
            "再用请求编号查 Trace，也就是分布式链路追踪。",
            "把网关、排队、模型执行和结果返回这些阶段拆开后，",
            "就能看到这条请求有 950 毫秒耗在队列里。"
          ]
        },
        {
          "id": "S39.6",
          "label": "深入执行阶段做性能分析",
          "narration": "如果排查发现请求已经进入执行阶段，却还是跑得很慢，就要做 Profiling，也就是性能剖析。把内核执行和数据传输放到同一条时间线上，才能定位时间究竟花在哪一步。刚才是用指标、日志和 Trace 顺着一条慢请求找原因。把范围拉开，一次请求从进门到返回，正好能把服务入口、调度、缓存和 GPU 计算串起来。",
          "estimatedSeconds": 31,
          "captions": [
            "如果排查发现请求已经进入执行阶段，",
            "却还是跑得很慢，就要做 Profiling，也就是性能剖析。",
            "把内核执行和数据传输放到同一条时间线上，才能定位时间究竟花在哪一步。",
            "刚才是用指标、日志和 Trace 顺着一条慢请求找原因。",
            "把范围拉开，一次请求从进门到返回，",
            "正好能把服务入口、调度、缓存和 GPU 计算串起来。"
          ]
        }
      ],
      "estimatedSeconds": 126
    },
    {
      "id": "S29",
      "chapter": 6,
      "title": "一次推理请求的完整流程",
      "subtitle": "从请求排队到答案返回，回看算力、缓存与服务的分工",
      "kind": "journey",
      "targetSeconds": 90,
      "terms": [
        "API",
        "Scheduler",
        "Prefill",
        "KV Cache",
        "Decode",
        "CUDA",
        "Model Serving"
      ],
      "sources": [
        "vllm",
        "cache",
        "cuda",
        "k8s"
      ],
      "steps": [
        {
          "label": "认出开头的第 05 条晚餐请求",
          "narration": "就从开头排在第五的那条请求开始。它只问了一句“推荐一道晚餐”，前面四个人已经在生成，它为什么迟迟看不到回答？",
          "phase": [
            0,
            350
          ],
          "focus": [
            "推荐一道晚餐"
          ],
          "id": "S29.0",
          "estimatedSeconds": 13,
          "captions": [
            "就从开头排在第五的那条请求开始。",
            "它只问了一句“推荐一道晚餐”，前面四个人已经在生成，",
            "它为什么迟迟看不到回答？"
          ]
        },
        {
          "label": "沿 API 路径验证输入和权限",
          "narration": "请求到达服务后，先经过 API 检查。服务会验证输入格式、必要参数和访问权限，确认这条请求可以继续处理。",
          "phase": [
            350,
            2130
          ],
          "id": "S29.4",
          "frame": 0,
          "estimatedSeconds": 12,
          "captions": [
            "请求到达服务后，先经过 API 检查。",
            "服务会验证输入格式、必要参数和访问权限，确认这条请求可以继续处理。"
          ]
        },
        {
          "label": "前四条用满缓存预算，第 05 条等待",
          "narration": "但通过 API 检查不代表马上就能执行。前面四条请求已经占满了这组示例中的缓存预算，第五条只能留在队列里等空间。",
          "phase": [
            2130,
            4280
          ],
          "id": "S29.5",
          "frame": 0,
          "estimatedSeconds": 13,
          "captions": [
            "但通过 API 检查不代表马上就能执行。",
            "前面四条请求已经占满了这组示例中的缓存预算，",
            "第五条只能留在队列里等空间。"
          ]
        },
        {
          "label": "缓存释放后让第 05 条离开队列",
          "narration": "第一条请求完成后，缓存空间被归还。调度器重新检查资源，发现现在够用了，才把第五条请求从等待队列中放进来。",
          "phase": [
            0,
            2320
          ],
          "id": "S29.1",
          "estimatedSeconds": 12,
          "captions": [
            "第一条请求完成后，缓存空间被归还。",
            "调度器重新检查资源，发现现在够用了，才把第五条请求从等待队列中放进来。"
          ]
        },
        {
          "label": "沿用第 05 条的四段输入",
          "narration": "按照这次演示使用的分词结果，“推荐一道晚餐”被切成了四个 Token。真实模型的切分结果要由对应分词器决定。",
          "phase": [
            2320,
            3130
          ],
          "id": "S29.6",
          "frame": 1,
          "estimatedSeconds": 12,
          "captions": [
            "按照这次演示使用的分词结果，“推荐一道晚餐”被切成了四个 Token。",
            "真实模型的切分结果要由对应分词器决定。"
          ]
        },
        {
          "label": "运行 Prefill 并写入四份 KV",
          "narration": "Prefill 会一次处理这四个输入位置，并为各层计算、保存对应的 K 和 V。这样后面生成新 Token 时，就能接着使用这些历史缓存。",
          "phase": [
            3130,
            7420
          ],
          "id": "S29.7",
          "frame": 1,
          "estimatedSeconds": 14,
          "captions": [
            "Prefill 会一次处理这四个输入位置，并为各层计算、保存对应的 K 和 V。",
            "这样后面生成新 Token 时，就能接着使用这些历史缓存。"
          ]
        },
        {
          "label": "产生首个输出",
          "narration": "Prefill 完成后，模型根据最后一个输入位置的分数选出第一个输出 Token。这个例子里，选中的是“推荐”。",
          "phase": [
            7420,
            9530
          ],
          "id": "S29.8",
          "frame": 1,
          "estimatedSeconds": 11,
          "captions": [
            "Prefill 完成后，模型根据最后一个输入位置的分数选出第一个输出 Token。",
            "这个例子里，选中的是“推荐”。"
          ]
        },
        {
          "label": "读取已有缓存并追加新位置",
          "narration": "接下来进入 Decode。每生成一个新 Token，模型都会读取已有 KV，并为新位置追加一份缓存，再继续预测下一步。",
          "phase": [
            0,
            3540
          ],
          "id": "S29.2",
          "estimatedSeconds": 12,
          "captions": [
            "接下来进入 Decode。",
            "每生成一个新 Token，模型都会读取已有 KV，",
            "并为新位置追加一份缓存，再继续预测下一步。"
          ]
        },
        {
          "label": "先把菜名送回客户端",
          "narration": "模型已经生成了菜名，服务就可以先把这一段发回客户端。用户看到“西红柿炒蛋”时，后面的内容还可以继续生成。",
          "phase": [
            3540,
            5470
          ],
          "id": "S29.9",
          "frame": 2,
          "estimatedSeconds": 12,
          "captions": [
            "模型已经生成了菜名，服务就可以先把这一段发回客户端。",
            "用户看到“西红柿炒蛋”时，后面的内容还可以继续生成。"
          ]
        },
        {
          "label": "接着把做法送回客户端",
          "narration": "模型接着生成做法。用户正在读前面收到的菜名，服务器这边已经在计算后续 Token，这就是流式输出带来的体验。",
          "phase": [
            6600,
            8760
          ],
          "id": "S29.10",
          "frame": 2,
          "estimatedSeconds": 12,
          "captions": [
            "模型接着生成做法。",
            "用户正在读前面收到的菜名，",
            "服务器这边已经在计算后续 Token，这就是流式输出带来的体验。"
          ]
        },
        {
          "label": "请求结束后归还缓存格",
          "narration": "回答结束后，这条请求不再需要的 KV 块就可以归还缓存池。空间释放出来，后续请求才有机会使用。",
          "phase": [
            12300,
            12860
          ],
          "id": "S29.11",
          "frame": 2,
          "estimatedSeconds": 11,
          "captions": [
            "回答结束后，这条请求不再需要的 KV 块就可以归还缓存池。",
            "空间释放出来，后续请求才有机会使用。"
          ]
        },
        {
          "label": "跟踪上线前的参数交付",
          "narration": "把视角再往前移。用户发起请求之前，服务副本就已经启动，并加载好了训练得到的模型权重和对应配置。",
          "phase": [
            0,
            3500
          ],
          "id": "S29.3",
          "estimatedSeconds": 11,
          "captions": [
            "把视角再往前移。",
            "用户发起请求之前，服务副本就已经启动，",
            "并加载好了训练得到的模型权重和对应配置。"
          ]
        },
        {
          "label": "跟踪第 05 条经过接口和调度",
          "narration": "因此第五条请求并不是等着模型加载权重，它使用的就是已经就绪的那份模型。它比其他请求多等的时间，主要发生在进入调度、等待缓存空间这一段。",
          "phase": [
            3500,
            7700
          ],
          "id": "S29.12",
          "frame": 3,
          "estimatedSeconds": 15,
          "captions": [
            "因此第五条请求并不是等着模型加载权重，它使用的就是已经就绪的那份模型。",
            "它比其他请求多等的时间，主要发生在进入调度、等待缓存空间这一段。"
          ]
        },
        {
          "label": "跟踪 Decode 读取缓存",
          "narration": "一旦开始 Decode，模型就会沿着历史 KV 继续计算。每轮只处理新位置，同时读取此前保存的上下文。",
          "phase": [
            7700,
            10000
          ],
          "id": "S29.13",
          "frame": 3,
          "estimatedSeconds": 11,
          "captions": [
            "一旦开始 Decode，模型就会沿着历史 KV 继续计算。",
            "每轮只处理新位置，同时读取此前保存的上下文。"
          ]
        },
        {
          "label": "跟踪绿色回复路径",
          "narration": "新生成的内容再沿着原来的请求连接分段返回。客户端每收到一段，就可以立即显示一段，不必等完整回答结束。",
          "phase": [
            10000,
            13600
          ],
          "id": "S29.14",
          "frame": 3,
          "estimatedSeconds": 12,
          "captions": [
            "新生成的内容再沿着原来的请求连接分段返回。",
            "客户端每收到一段，就可以立即显示一段，不必等完整回答结束。"
          ]
        },
        {
          "label": "回答第五条为何晚收到首字",
          "narration": "如果部署两份完整模型，入口就有机会把第五条分到另一个有空位的副本。模型本身没有变，变化的是请求被分配到哪里、何时开始执行。",
          "id": "S29.15",
          "frame": 3,
          "estimatedSeconds": 14,
          "phase": [
            13600,
            14650
          ],
          "captions": [
            "如果部署两份完整模型，入口就有机会把第五条分到另一个有空位的副本。",
            "模型本身没有变，变化的是请求被分配到哪里、何时开始执行。"
          ]
        }
      ],
      "estimatedSeconds": 197,
      "transition": "读完后结束录制。",
      "demo": {
        "id": "05",
        "question": "推荐一道晚餐",
        "reply": [
          "推荐做西红柿炒蛋。",
          "先炒鸡蛋，再炒西红柿，最后合炒。"
        ],
        "inputTokens": [
          "推荐",
          "一",
          "道",
          "晚餐"
        ]
      }
    },
    {
      "id": "S40",
      "chapter": 6,
      "title": "从晚餐请求回到 AI Infra 全景",
      "subtitle": "遇到瓶颈时，先判断该查哪一段",
      "kind": "extension",
      "sources": [
        "cuda",
        "distributed",
        "paged",
        "vllm",
        "k8s",
        "ray",
        "otel"
      ],
      "terms": [
        "AI Infra",
        "Kernel",
        "Model Parallelism",
        "Continuous Batching",
        "Load Balancing",
        "Observability"
      ],
      "steps": [
        {
          "id": "S40.0",
          "label": "沿计算路径找到慢的工作",
          "narration": "晚餐推荐已经到了。回看第五条请求，GPU 先处理了输入，再沿着历史缓存逐个生成 Token。如果慢在这一步，就沿着第二章的办法，查时间花在运算上，还是花在等待数据上。",
          "estimatedSeconds": 17,
          "captions": [
            "晚餐推荐已经到了。回看第五条请求，",
            "GPU 先处理了输入，再沿着历史缓存逐个生成 Token。",
            "如果慢在这一步，就沿着第二章的办法，",
            "查时间花在运算上，还是花在等待数据上。"
          ]
        },
        {
          "id": "S40.1",
          "label": "沿显存预算找到放不下的对象",
          "narration": "这次真正拖长等待的是缓存空间。权重早已加载，正在生成的四条请求用完了演示里的缓存预算。遇到显存紧张，先分清占空间的是权重，还是随请求增长的历史 KV。",
          "estimatedSeconds": 17,
          "captions": [
            "这次真正拖长等待的是缓存空间。",
            "权重早已加载，正在生成的四条请求用完了演示里的缓存预算。",
            "遇到显存紧张，先分清占空间的是权重，还是随请求增长的历史 KV。"
          ]
        },
        {
          "id": "S40.2",
          "label": "在调度时序里查为什么等待",
          "narration": "第一条完成以后，缓存块还给了池子。调度器重新检查这轮的资源，第五条才进了批次。从等待到执行，变化的是它终于分到了放历史 KV 的位置。",
          "estimatedSeconds": 14,
          "captions": [
            "第一条完成以后，缓存块还给了池子。",
            "调度器重新检查这轮的资源，第五条才进了批次。",
            "从等待到执行，变化的是它终于分到了放历史 KV 的位置。"
          ]
        },
        {
          "id": "S40.3",
          "label": "沿服务入口找到可用的副本",
          "narration": "如果另一张卡上已经有就绪的副本，而且还有缓存余量，服务入口也可以把第五条发到那边。新增副本要先拿到设备、加载权重，通过就绪检查才接请求。",
          "estimatedSeconds": 16,
          "captions": [
            "如果另一张卡上已经有就绪的副本，而且还有缓存余量，",
            "服务入口也可以把第五条发到那边。",
            "新增副本要先拿到设备、加载权重，通过就绪检查才接请求。"
          ]
        },
        {
          "id": "S40.4",
          "label": "用观测结果验证修复",
          "narration": "改了分流或副本数，就用同样的请求和并发再跑一次。看首个 Token 有没有更早到，后续的字出得是否平稳，再对照错误率和达标的请求数。",
          "estimatedSeconds": 13,
          "captions": [
            "改了分流或副本数，就用同样的请求和并发再跑一次。",
            "看首个 Token 有没有更早到，后续的字出得是否平稳，",
            "再对照错误率和达标的请求数。"
          ]
        },
        {
          "id": "S40.5",
          "label": "把训练产物接入在线服务",
          "narration": "这几秒的请求里，还有一段准备工作发生在用户点击发送之前。数据变成训练样本，训练更新模型参数。权重经过评估，随配置和分词器部署到服务，副本就绪后开始接单。",
          "estimatedSeconds": 17,
          "captions": [
            "这几秒的请求里，还有一段准备工作发生在用户点击发送之前。",
            "数据变成训练样本，训练更新模型参数。",
            "权重经过评估，随配置和分词器部署到服务，副本就绪后开始接单。"
          ]
        },
        {
          "id": "S40.6",
          "label": "沿晚餐请求收束全课",
          "narration": "用户发来“推荐一道晚餐”，入口把请求交给副本，推理引擎安排批次和缓存，GPU 生成 Token，服务一段段送回回答。这条回答能送到用户手里，靠的是训练、部署和在线服务一起运转。第五条多等的那几秒，具体落在了调度队列里。查清时间花在哪一步，才知道该去改哪一步。",
          "estimatedSeconds": 24,
          "captions": [
            "用户发来“推荐一道晚餐”，入口把请求交给副本，",
            "推理引擎安排批次和缓存，GPU 生成 Token，服务一段段送回回答。",
            "这条回答能送到用户手里，靠的是训练、部署和在线服务一起运转。",
            "第五条多等的那几秒，具体落在了调度队列里。",
            "查清时间花在哪一步，才知道该去改哪一步。"
          ]
        }
      ],
      "estimatedSeconds": 118
    }
  ]
};
