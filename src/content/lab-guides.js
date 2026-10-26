export const labGuides = {
  'lab-first-train': {
    requirements: [
      '一台可运行 Python 3.10+ 的普通电脑；不需要 NVIDIA GPU，也不需要 Linux 服务器。',
      '以下命令以 macOS 或 Linux 终端为例，磁盘至少预留 3 GB 用于虚拟环境和 PyTorch。',
      '能理解最基础的 Python 变量与命令行路径即可；遇到陌生命令时先阅读注释再运行。',
    ],
    safety: '所有文件都写入你新建的 first-training 目录。不要对系统 Python 使用 sudo 安装依赖；若安装源或版本有组织要求，请先按本机规范调整。',
    steps: [
      {
        blocks: [{ title: '终端：创建隔离环境', code: `mkdir -p first-training && cd first-training
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install torch
python -c "import torch; print('PyTorch:', torch.__version__); print('本次使用 CPU，张量设备:', torch.tensor([1]).device)"` }],
        expected: '最后打印 PyTorch 版本和 cpu。命令行提示符通常出现 (.venv)，说明后续依赖只安装到当前项目环境。',
        note: '之后的命令都默认在 first-training 目录且虚拟环境已激活。重新打开终端后，先执行 cd first-training 和 source .venv/bin/activate。',
      },
      {
        blocks: [{ title: '终端：保存最小训练脚本', code: `cat > train.py <<'PY'
import json
import os
from pathlib import Path

import torch
import torch.nn.functional as F

learning_rate = float(os.environ.get('LR', '0.05'))
if learning_rate <= 0:
    raise ValueError('LR 必须是正数')

torch.manual_seed(42)
torch.set_num_threads(1)
x = torch.randn(512, 1)
y = 3 * x + 1 + 0.1 * torch.randn_like(x)

w = torch.zeros(1, 1, requires_grad=True)
b = torch.zeros(1, requires_grad=True)
optimizer = torch.optim.SGD([w, b], lr=learning_rate)
history = []

for step in range(1, 201):
    optimizer.zero_grad()
    prediction = x @ w + b
    loss = F.mse_loss(prediction, y)
    loss.backward()
    optimizer.step()
    if step == 1 or step % 20 == 0:
        row = {
            'step': step,
            'loss': round(loss.item(), 6),
            'w': round(w.item(), 6),
            'b': round(b.item(), 6),
        }
        history.append(row)
        print(row)

result = {
    'learning_rate': learning_rate,
    'samples': len(x),
    'steps': 200,
    'seed': 42,
    'device': 'cpu',
    'torch_version': torch.__version__,
    'final': history[-1],
    'history': history,
}
output = Path('results') / f'lr-{learning_rate}.json'
output.parent.mkdir(exist_ok=True)
output.write_text(json.dumps(result, indent=2), encoding='utf-8')
print('结果已保存到', output)
PY` }],
        expected: '目录中出现 train.py。x @ w + b 是预测，mse_loss 衡量误差，backward 计算梯度，optimizer.step 根据梯度更新 w 和 b。',
        note: '这里故意不下载数据集：真实关系约为 y = 3x + 1，方便判断训练是否学到了正确答案。噪声使最终 loss 不必等于 0。',
      },
      {
        blocks: [{ title: '终端：运行基线并保存证据', code: `LR=0.05 python train.py 2>&1 | tee results-lr-0.05.log
python -m pip freeze > python-environment.txt
python - <<'PY'
import json
result = json.load(open('results/lr-0.05.json'))
final = result['final']
print('最终参数:', final)
assert abs(final['w'] - 3) < 0.1, 'w 尚未接近 3，请检查训练日志'
assert abs(final['b'] - 1) < 0.1, 'b 尚未接近 1，请检查训练日志'
assert final['loss'] < 0.02, 'loss 偏高，请检查是否完整运行 200 步'
print('PASS: 参数和损失符合本实验预期')
PY` }],
        expected: '训练日志显示 loss 总体下降，w 接近 3、b 接近 1，自动断言打印 PASS；同时生成 results/lr-0.05.json、results-lr-0.05.log 和 python-environment.txt。',
        note: '数值可能因 PyTorch 版本或平台略有差异。断言只用于这份固定合成数据，不是其他训练任务的通用阈值。',
      },
      {
        blocks: [{ title: '终端：只改变学习率并汇总', code: `for lr in 0.001 0.2; do
  LR="$lr" python train.py 2>&1 | tee "results-lr-$lr.log"
done
python - <<'PY'
import json
from pathlib import Path

rows = []
for lr in ('0.001', '0.05', '0.2'):
    result = json.loads(Path(f'results/lr-{lr}.json').read_text())
    row = {'lr': lr, **result['final']}
    rows.append(row)
    print(f"LR={lr:>5}  loss={row['loss']:.6f}  w={row['w']:.4f}  b={row['b']:.4f}")
Path('results/comparison.json').write_text(json.dumps(rows, indent=2), encoding='utf-8')
PY` }],
        expected: '三组实验只有 LR 不同，生成 comparison.json。通常 0.001 在 200 步内学习较慢，0.05 和 0.2 更接近目标；请用自己的日志解释，而不是照抄预期。',
        note: '最后写下：学习率控制了哪一步？为什么本实验中较大的学习率更快，却不能推导出任何任务都应该无限增大学习率？',
      },
    ],
    troubleshooting: [
      { problem: 'python3: command not found', solution: '先安装 Python 3.10 或更新版本，并确认终端中的 python3 指向该安装；不要直接删除系统已有 Python。' },
      { problem: '安装 PyTorch 时网络或磁盘失败', solution: '保留完整报错，检查网络、代理、安装源和剩余磁盘；不要在多个目录反复安装，也不要使用 sudo pip 掩盖权限问题。' },
      { problem: 'w、b 没有接近目标', solution: '检查是否完整执行 200 步、是否误改了数据或优化器，并打开 JSON 查看 history；0.001 学得慢是可用于对照的结果，不应伪造为通过基线断言。' },
      { problem: 'loss 出现 NaN 或不断增大', solution: '先确认只修改了 LR，记录该学习率和完整日志；检查是否输入了极大 LR。把发散作为学习率不稳定的现象分析，而不是删除失败结果。' },
    ],
    cleanup: '先备份 train.py、results、三份日志和 python-environment.txt。退出虚拟环境可运行 deactivate；确认结果已备份后，可删除整个 first-training 目录释放空间。',
  },

  'lab-baseline': {
    requirements: [
      '一台可执行测试的 Linux 机器；以下安装命令以 Ubuntu / Debian 为例。',
      '拥有 sudo 权限，或已安装 sysbench、fio、Python 3 和 PyTorch。',
      '测试磁盘至少有 5 GB 空闲空间；GPU 步骤需要 NVIDIA 驱动可用。',
    ],
    safety: 'fio 会在当前目录创建 1 GB 临时文件。请严格使用下面的相对路径，不要把 --filename 改成 /dev/sda 等设备名；共享机器上先确认测试时段。',
    steps: [
      {
        blocks: [{ title: '终端 1：保存硬件与系统信息', code: `mkdir -p baseline-results
cd baseline-results
{ date -Is; uname -a; lscpu; free -h; lsblk; ip -brief address; if command -v nvidia-smi >/dev/null 2>&1; then nvidia-smi; nvidia-smi topo -m; fi; } 2>&1 | tee hardware.txt` }],
        expected: '当前目录生成 hardware.txt，里面包含 CPU、内存、磁盘和网卡信息；有 NVIDIA GPU 时还包含驱动、CUDA 与设备拓扑。',
        note: '后续命令默认仍在 baseline-results 目录执行。重开终端后，先运行 cd baseline-results。',
      },
      {
        blocks: [{ title: '终端 1：安装并运行微基准', code: `sudo apt update && sudo apt install -y sysbench fio
sysbench memory --memory-block-size=1M --memory-total-size=10G run 2>&1 | tee memory.txt
fio --name=seqread --filename=fio.test --size=1G --rw=read --bs=1M --iodepth=16 --direct=1 --runtime=20 --time_based --group_reporting 2>&1 | tee disk-read.txt
rm -f fio.test` }],
        expected: 'memory.txt 中能看到内存吞吐，disk-read.txt 中能看到顺序读带宽和延迟；fio.test 已删除。',
        note: '这里测的是特定参数下的结果，不等于整台机器的绝对性能。保留完整输出，不要只摘一个最大数字。',
      },
      {
        blocks: [{ title: '终端 1：运行一个真实张量负载', code: `python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install torch
python - <<'PY'
import json, platform, time, torch

torch.manual_seed(42)
device = 'cuda' if torch.cuda.is_available() else 'cpu'
n, warmup, iterations = 1024, 3, 30
a = torch.randn(n, n, device=device)
b = torch.randn(n, n, device=device)
for _ in range(warmup):
    c = a @ b
if device == 'cuda':
    torch.cuda.synchronize()
start = time.perf_counter()
for _ in range(iterations):
    c = a @ b
if device == 'cuda':
    torch.cuda.synchronize()
elapsed = time.perf_counter() - start
result = {
    'device': device,
    'device_name': torch.cuda.get_device_name(0) if device == 'cuda' else platform.processor(),
    'matrix_shape': [n, n],
    'iterations': iterations,
    'elapsed_seconds': round(elapsed, 6),
    'tflops': round(2 * n ** 3 * iterations / elapsed / 1e12, 4),
    'torch_version': torch.__version__,
}
with open('load-result.json', 'w') as f:
    json.dump(result, f, indent=2)
print(json.dumps(result, indent=2))
PY
python -m pip freeze > python-environment.txt` }],
        expected: '生成 load-result.json 和 python-environment.txt。结果中有设备名、耗时、矩阵大小和估算 TFLOPS，可用同一条命令再次复测。',
      },
      {
        blocks: [{ title: '终端 1：检查并打包原始结果', code: `ls -lh hardware.txt memory.txt disk-read.txt load-result.json python-environment.txt
tar -czf baseline-results.tar.gz hardware.txt memory.txt disk-read.txt load-result.json python-environment.txt` }],
        expected: '五个原始文件均存在，且打包生成 baseline-results.tar.gz。把压缩包与页面下载的记录模板放在同一个实验文件夹中。',
        note: '最后分别写下“观测到的事实”和“我的推测”。例如，GPU 利用率低是事实；数据加载导致等待是需要继续验证的推测。',
      },
    ],
    troubleshooting: [
      { problem: 'nvidia-smi: command not found', solution: '没有 NVIDIA GPU 或未安装驱动时，可以完成 CPU、内存和磁盘部分，并在报告中注明 GPU 数据缺失；不要为了完成表格而填写估计值。' },
      { problem: 'fio 报 direct I/O 不支持', solution: '先记录文件系统和完整报错。仅在用于对照的临时目录上，去掉 --direct=1 再跑一次，并把两次配置都保留，不能混为同一组数据。' },
      { problem: 'PyTorch 安装后仍使用 CPU', solution: '运行 python -c "import torch; print(torch.__version__, torch.cuda.is_available())"，检查安装的 PyTorch 构建、NVIDIA 驱动和 GPU 是否匹配。' },
    ],
    cleanup: '确认 fio.test 已删除。虚拟环境位于 baseline-results/.venv，不再需要时可以删除整个实验目录；先备份结果压缩包和实验记录。',
  },

  'lab-triton': {
    requirements: [
      '一张支持 CUDA 的 NVIDIA GPU，驱动与 PyTorch CUDA 构建匹配。',
      'Python 3.10+；建议在独立虚拟环境中安装依赖。',
      '已了解 RMSNorm 的基本公式，并能阅读简单 PyTorch 代码。',
    ],
    safety: '先在开发环境运行。下面的教学实现只覆盖二维连续输入和最后一维不大于 8192 的情况，不要未经验证直接替换生产模型中的归一化算子。',
    steps: [
      {
        blocks: [{ title: '终端：创建参考实现', code: `mkdir -p triton-rmsnorm && cd triton-rmsnorm
python3 -m venv .venv && source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install torch triton
cat > rms_ref.py <<'PY'
import torch

def rms_ref(x, weight, eps=1e-6):
    x_float = x.float()
    scale = torch.rsqrt(x_float.pow(2).mean(dim=-1, keepdim=True) + eps)
    return (x_float * scale * weight.float()).to(x.dtype)
PY
python -c "import torch; assert torch.cuda.is_available(); print(torch.__version__, torch.cuda.get_device_name(0))"` }],
        expected: '命令最后打印 PyTorch 版本和 GPU 名称，没有触发 CUDA unavailable 断言；目录中有 rms_ref.py。',
      },
      {
        blocks: [{ title: '终端：实现 Triton Kernel', code: `cat > rms_triton.py <<'PY'
import torch
import triton
import triton.language as tl

@triton.jit
def _rms_kernel(X, Y, W, N, eps, BLOCK: tl.constexpr):
    row = tl.program_id(0)
    cols = tl.arange(0, BLOCK)
    mask = cols < N
    x = tl.load(X + row * N + cols, mask=mask, other=0.0).to(tl.float32)
    mean_square = tl.sum(x * x, axis=0) / N
    normalized = x * tl.rsqrt(mean_square + eps)
    w = tl.load(W + cols, mask=mask, other=0.0).to(tl.float32)
    tl.store(Y + row * N + cols, (normalized * w).to(Y.dtype.element_ty), mask=mask)

def rmsnorm(x, weight, eps=1e-6):
    assert x.is_cuda and x.is_contiguous() and x.dim() == 2
    assert weight.is_contiguous() and weight.dim() == 1
    rows, n = x.shape
    assert n == weight.numel() and n <= 8192
    y = torch.empty_like(x)
    block = triton.next_power_of_2(n)
    _rms_kernel[(rows,)](x, y, weight, n, eps, BLOCK=block, num_warps=4)
    return y
PY` }],
        expected: '生成 rms_triton.py。实现中每个 program 处理一行，使用 FP32 做归约，mask 处理非 2 次幂宽度，最后才转回输入精度。',
      },
      {
        blocks: [{ title: '终端：运行参数化正确性测试', code: `cat > test_rms.py <<'PY'
import torch
from rms_ref import rms_ref
from rms_triton import rmsnorm

torch.manual_seed(42)
for dtype in (torch.float32, torch.float16, torch.bfloat16):
    for rows, cols in ((32, 128), (17, 768), (8, 1024), (3, 2048)):
        x = torch.randn(rows, cols, device='cuda', dtype=dtype).contiguous()
        weight = torch.randn(cols, device='cuda', dtype=dtype).contiguous()
        actual = rmsnorm(x, weight)
        expected = rms_ref(x, weight)
        atol = 1e-5 if dtype == torch.float32 else 2e-2
        torch.testing.assert_close(actual, expected, atol=atol, rtol=atol)
        error = (actual.float() - expected.float()).abs().max().item()
        print(f'PASS {dtype} {tuple(x.shape)} max_abs_error={error:.6g}')
PY
python test_rms.py` }],
        expected: '所有 shape 和精度都打印 PASS，没有 AssertionError。若只在 FP16 出现误差，先检查中间计算是否意外使用了 FP16，再调整有依据的容差。',
      },
      {
        blocks: [{ title: '终端：预热并比较延迟与有效带宽', code: `cat > bench_rms.py <<'PY'
import torch
import triton
from rms_ref import rms_ref
from rms_triton import rmsnorm

for n in (512, 1024, 2048, 4096, 8192):
    x = torch.randn(4096, n, device='cuda', dtype=torch.float16).contiguous()
    w = torch.randn(n, device='cuda', dtype=torch.float16).contiguous()
    torch_ms = triton.testing.do_bench(lambda: rms_ref(x, w), warmup=25, rep=100)
    triton_ms = triton.testing.do_bench(lambda: rmsnorm(x, w), warmup=25, rep=100)
    moved_bytes = (2 * x.numel() + n) * x.element_size()
    bandwidth = moved_bytes / (triton_ms / 1000) / 1e9
    print(f'N={n:4d} torch={torch_ms:.4f} ms triton={triton_ms:.4f} ms speedup={torch_ms / triton_ms:.2f}x bandwidth={bandwidth:.1f} GB/s')
PY
python bench_rms.py 2>&1 | tee benchmark.txt` }],
        expected: 'benchmark.txt 保存五种宽度的延迟、加速比和估算带宽。结果不要求每种 shape 都加速；需要解释小 shape 的启动开销和大 shape 的内存访问。',
      },
    ],
    troubleshooting: [
      { problem: 'CUDA is not available', solution: '先确认 nvidia-smi 可用，再根据 PyTorch 官方安装说明选择与驱动匹配的 CUDA 构建。不要在 CUDA 不可用时继续修改 Kernel。' },
      { problem: '非 2 次幂列数结果错误', solution: '检查 tl.load 和 tl.store 是否都使用同一个 mask，并确认 other=0.0 不会参与有效列的归约。' },
      { problem: 'Triton 比 PyTorch 慢', solution: '先确认测量前有预热、没有每次同步或重新编译，再比较不同 shape。教学实现未自动调参，慢本身也是有效实验结果。' },
    ],
    cleanup: '实验结果保存在 benchmark.txt。保留源码、测试和结果后，可删除 .venv 释放空间；不要只留下加速比而删除正确性测试。',
  },

  'lab-ddp': {
    requirements: [
      'Linux 机器至少有 2 张可用于实验的 NVIDIA GPU，且 PyTorch 能识别它们。',
      'Python 3.10+ 与 PyTorch；所有进程使用同一个虚拟环境。',
      '了解数据并行、rank、world size 和梯度同步的基本概念。',
    ],
    safety: '使用空闲或获准使用的 GPU。实验采用合成数据，不访问数据集；不要在共享训练任务运行时争抢显存。',
    steps: [
      {
        blocks: [{ title: '终端：创建实验脚本并运行单卡基线', code: `mkdir -p ddp-lab && cd ddp-lab
mkdir -p results
cat > ddp_lab.py <<'PY'
import argparse, json, os, time
from pathlib import Path
import torch
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP

parser = argparse.ArgumentParser()
parser.add_argument('--steps', type=int, default=30)
parser.add_argument('--batch-size', type=int, default=64)
parser.add_argument('--bucket-cap-mb', type=float, default=25)
parser.add_argument('--output', required=True)
args = parser.parse_args()
local_rank = int(os.environ['LOCAL_RANK'])
rank = int(os.environ['RANK'])
world_size = int(os.environ['WORLD_SIZE'])
torch.cuda.set_device(local_rank)
dist.init_process_group('nccl')
torch.manual_seed(42 + rank)
device = torch.device('cuda', local_rank)
model = torch.nn.Sequential(
    torch.nn.Linear(1024, 4096), torch.nn.ReLU(),
    torch.nn.Linear(4096, 4096), torch.nn.ReLU(),
    torch.nn.Linear(4096, 1024),
).to(device)
model = DDP(model, device_ids=[local_rank], bucket_cap_mb=args.bucket_cap_mb)
optimizer = torch.optim.SGD(model.parameters(), lr=0.001)
x = torch.randn(args.batch_size, 1024, device=device)

def train_step():
    optimizer.zero_grad(set_to_none=True)
    loss = model(x).square().mean()
    loss.backward()
    optimizer.step()
    return loss.item()

for _ in range(5):
    final_loss = train_step()
torch.cuda.synchronize()
dist.barrier()
torch.cuda.reset_peak_memory_stats()
start = time.perf_counter()
for _ in range(args.steps):
    final_loss = train_step()
torch.cuda.synchronize()
dist.barrier()
elapsed = time.perf_counter() - start
result = {
    'world_size': world_size,
    'batch_size_per_gpu': args.batch_size,
    'bucket_cap_mb': args.bucket_cap_mb,
    'steps': args.steps,
    'elapsed_seconds': elapsed,
    'global_samples_per_sec': args.steps * args.batch_size * world_size / elapsed,
    'peak_memory_gib_rank0': torch.cuda.max_memory_allocated() / 1024 ** 3,
    'final_loss': final_loss,
}
if rank == 0:
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(result, indent=2))
    print(json.dumps(result, indent=2))
dist.destroy_process_group()
PY
torchrun --standalone --nproc_per_node=1 ddp_lab.py --output results/single.json` }],
        expected: 'results/single.json 中 world_size 为 1，并包含吞吐、耗时、最终 loss 和峰值显存。单卡也使用 DDP，是为了尽量保持对照代码一致。',
      },
      {
        blocks: [{ title: '终端：改为两个进程运行', code: `torchrun --standalone --nproc_per_node=2 ddp_lab.py --output results/ddp-2gpu.json
python - <<'PY'
import json
for name in ('single', 'ddp-2gpu'):
    data = json.load(open(f'results/{name}.json'))
    print(name, 'world_size=', data['world_size'], 'global_samples/s=', round(data['global_samples_per_sec'], 2))
PY` }],
        expected: '第二个结果文件 world_size 为 2。吞吐按全局 batch 计算，因此可以直接与单卡比较；两次实验的模型、每卡 batch 和步数保持一致。',
      },
      {
        blocks: [{ title: '终端：一次只改变 bucket 大小', code: `for bucket in 1 25 100; do torchrun --standalone --nproc_per_node=2 ddp_lab.py --bucket-cap-mb "$bucket" --output "results/ddp-bucket-$bucket.json"; done
python - <<'PY'
import json
for bucket in (1, 25, 100):
    data = json.load(open(f'results/ddp-bucket-{bucket}.json'))
    print(f"bucket={bucket:3d} MB  samples/s={data['global_samples_per_sec']:.2f}  elapsed={data['elapsed_seconds']:.3f}s")
PY` }],
        expected: '得到三组只改变 bucket_cap_mb 的结果。若差异很小，也应如实记录；合成负载、模型大小和 GPU 拓扑都会影响 bucket 的收益。',
      },
      {
        blocks: [{ title: '终端：计算扩展效率并保存汇总', code: `cat > summarize.py <<'PY'
import json
from pathlib import Path

base = json.loads(Path('results/single.json').read_text())
rows = []
for path in sorted(Path('results').glob('ddp-*.json')):
    data = json.loads(path.read_text())
    speedup = data['global_samples_per_sec'] / base['global_samples_per_sec']
    row = {
        'run': path.stem,
        'world_size': data['world_size'],
        'bucket_cap_mb': data['bucket_cap_mb'],
        'samples_per_sec': round(data['global_samples_per_sec'], 3),
        'speedup': round(speedup, 3),
        'scaling_efficiency_pct': round(100 * speedup / data['world_size'], 2),
    }
    rows.append(row)
    print(row)
Path('results/summary.json').write_text(json.dumps(rows, indent=2))
PY
python summarize.py` }],
        expected: '生成 results/summary.json。扩展效率按“多卡吞吐 ÷ 单卡吞吐 ÷ GPU 数”计算；记录结果后，再结合时间线或 NCCL 日志解释未线性扩展的原因。',
      },
    ],
    troubleshooting: [
      { problem: 'torchrun 启动后立即报 CUDA 或 NCCL 错误', solution: '先用 nvidia-smi 确认两张 GPU 空闲，再运行 python -c "import torch; print(torch.cuda.device_count())"。检查是否至少为 2，并保留完整 NCCL 报错。' },
      { problem: '多卡吞吐反而低于单卡', solution: '确认比较的是全局吞吐而不是每卡吞吐，检查模型是否太小、通信是否无法重叠，以及是否误把启动和编译时间计入测量。' },
      { problem: '同一配置多次结果差异很大', solution: '检查其他任务、功耗与温度，并增加预热和测量步数。报告多轮结果的范围，不要只选最快的一次。' },
    ],
    cleanup: 'torchrun 结束后确认没有残留 Python 进程。结果目录包含单卡、多卡和 bucket 对照；保存 summary.json 与原始 JSON 后再清理临时环境。',
  },

  'lab-nccl': {
    requirements: [
      '一台至少有 2 张 NVIDIA GPU 的 Linux 机器；多机部分需要已配置 MPI 与 RDMA。',
      '已安装 CUDA Toolkit、NCCL 开发文件、git 和 C/C++ 编译工具。',
      '具备在实验节点上编译并运行 nccl-tests 的权限。',
    ],
    safety: '先做单机测试。NCCL_P2P_DISABLE 仅用于本实验的对照运行，不要写入共享节点的全局环境，也不要在生产训练任务上随意修改网络参数。',
    steps: [
      {
        blocks: [{ title: '终端：保存设备与互联拓扑', code: `mkdir -p nccl-lab/logs && cd nccl-lab
nvidia-smi -L 2>&1 | tee logs/gpus.txt
nvidia-smi topo -m 2>&1 | tee logs/topology.txt
nvidia-smi --query-gpu=name,driver_version,memory.total --format=csv 2>&1 | tee logs/gpu-versions.csv` }],
        expected: 'logs 目录中有 GPU 列表、拓扑和版本信息。拓扑里的 NVLink、PIX、PXB、SYS 等标记能帮助你解释后续带宽差异。',
      },
      {
        blocks: [{ title: '终端：编译并运行三种集合通信测试', code: `git clone https://github.com/NVIDIA/nccl-tests.git
cd nccl-tests
make MPI=0 -j"$(nproc)" 2>&1 | tee ../logs/build.log
NGPU=$(nvidia-smi -L | wc -l)
NCCL_DEBUG=INFO ./build/all_reduce_perf -b 8 -e 256M -f 2 -g "$NGPU" 2>&1 | tee ../logs/all_reduce.log
./build/all_gather_perf -b 8 -e 256M -f 2 -g "$NGPU" 2>&1 | tee ../logs/all_gather.log
./build/reduce_scatter_perf -b 8 -e 256M -f 2 -g "$NGPU" 2>&1 | tee ../logs/reduce_scatter.log
cd ..` }],
        expected: '三个测试都完成消息大小扫描，输出中包含 algbw、busbw 和错误检查列；日志保存在 logs 目录，而不是只留在终端里。',
        note: '多机测试需要重新用 MPI=1 编译，并使用 MPI 启动。不要把单机 -g 参数的用法直接照搬到多机。',
      },
      {
        blocks: [{ title: '终端：构造一个可恢复的 P2P 对照', code: `cd nccl-tests
NGPU=$(nvidia-smi -L | wc -l)
NCCL_P2P_DISABLE=1 NCCL_DEBUG=INFO ./build/all_reduce_perf -b 8 -e 256M -f 2 -g "$NGPU" 2>&1 | tee ../logs/all_reduce_no_p2p.log
cd ..
python - <<'PY'
from pathlib import Path
for name in ('all_reduce', 'all_reduce_no_p2p'):
    rows = []
    for line in Path(f'logs/{name}.log').read_text(errors='ignore').splitlines():
        parts = line.split()
        if parts and parts[0].isdigit() and len(parts) >= 12:
            try:
                rows.append((int(parts[0]), float(parts[-2])))
            except ValueError:
                pass
    print(name, 'samples=', len(rows), 'max_busbw=', max((v for _, v in rows), default=0))
PY` }],
        expected: '得到正常配置与 NCCL_P2P_DISABLE=1 的两组日志，并打印最大 busbw。性能是否下降取决于拓扑；没有变化时，需要继续检查实际传输路径。',
      },
      {
        blocks: [{ title: '终端：提取警告和带宽结果', code: `grep -E "NCCL WARN|NCCL INFO NET|out of bounds|Error" logs/*.log | head -80 > logs/diagnostic-summary.txt || true
python - <<'PY'
import csv
from pathlib import Path
with open('logs/bandwidth-summary.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['collective', 'bytes', 'busbw_gb_s'])
    for path in Path('logs').glob('*.log'):
        if 'no_p2p' in path.stem:
            continue
        for line in path.read_text(errors='ignore').splitlines():
            parts = line.split()
            if parts and parts[0].isdigit() and len(parts) >= 12:
                try:
                    writer.writerow([path.stem, int(parts[0]), float(parts[-2])])
                except ValueError:
                    pass
print('已生成 logs/bandwidth-summary.csv 和 logs/diagnostic-summary.txt')
PY` }],
        expected: '得到可用表格软件打开的 bandwidth-summary.csv，以及警告摘要。排障记录应同时包含拓扑、配置、消息大小和原始日志。',
      },
    ],
    troubleshooting: [
      { problem: '编译时找不到 cuda.h 或 nccl.h', solution: '确认 CUDA Toolkit 与 NCCL 开发包已安装；非默认路径下按 nccl-tests 文档传入 CUDA_HOME=/path/to/cuda 和 NCCL_HOME=/path/to/nccl 后重新 make。' },
      { problem: '测试卡住或出现 timeout', solution: '先缩小到 -b 8 -e 1M -n 5，确认是否是特定消息大小触发；再保存 NCCL_DEBUG=INFO 日志，检查是否与其他任务争抢设备。' },
      { problem: 'busbw 与网卡标称带宽相差很大', solution: '先确认比较的是 busbw 还是 algbw，并区分单节点 NVLink/PCIe 与跨节点 RDMA。集合通信算法和消息大小也会影响结果。' },
    ],
    cleanup: 'NCCL_P2P_DISABLE 只写在单条命令前，不会持续影响新终端。保留 logs 后，可删除 nccl-tests/build 中的编译产物；不要删除用于复盘的对照日志。',
  },

  'lab-fsdp': {
    requirements: [
      '一台至少有 2 张 NVIDIA GPU 的 Linux 机器；先完成 DDP 实验更容易理解本实验。',
      'Python 3.10+；示例依赖文件要求 PyTorch 2.7 或更高版本。',
      '可以联网获取 pytorch/examples，并有数 GB 磁盘空间保存代码与 Checkpoint。',
    ],
    safety: '只在实验节点运行，先确认 GPU 与磁盘空间。教程固定官方示例版本，并会修改示例中的一行日志代码；不要把实验目录直接当作生产训练工程。',
    steps: [
      {
        blocks: [{ title: '终端：创建环境并计算理论状态占用', language: 'bash', code: `mkdir -p fsdp-lab/results && cd fsdp-lab
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python - <<'PY'
params = 500_000_000
bytes_per_param = 4
world_size = 2
full = params * bytes_per_param * 4
sharded = full / world_size
print(f'参数数量: {params:,}')
print(f'FP32 参数 + 梯度 + Adam 两个状态（未分片）: {full / 1024**3:.2f} GiB/GPU')
print(f'理想均匀分片到 {world_size} 卡: {sharded / 1024**3:.2f} GiB/GPU + 激活与临时空间')
PY` }],
        expected: '你得到未分片与理想分片的理论值，虚拟环境位于 fsdp-lab/.venv。理论值没有包含激活、CUDA 上下文、通信缓冲和前向时临时聚合的参数，不能直接当作峰值显存。',
        note: '把 params 换成你的实际参数量。如果还没有模型配置，先保留 5 亿参数作为练习，不要把它写成实测结果。后续步骤保持在同一个虚拟环境中。',
      },
      {
        blocks: [{ title: '终端：固定官方版本并运行两组独立对照', code: `git clone --filter=blob:none https://github.com/pytorch/examples.git
cd examples
git checkout acc295dc7b90714f1bf47f06004fc19a7fe235c4
git rev-parse HEAD | tee ../results/example-commit.txt
cd distributed/FSDP2
python -m pip install -r requirements.txt
/usr/bin/time -p torchrun --standalone --nproc_per_node=2 example.py 2>&1 | tee ../../../results/fsdp-default.log
mv checkpoints ../../../results/checkpoints-default
/usr/bin/time -p torchrun --standalone --nproc_per_node=2 example.py --explicit-prefetching 2>&1 | tee ../../../results/fsdp-prefetch.log
mv checkpoints ../../../results/checkpoints-prefetch
du -sh ../../../results/checkpoints-default ../../../results/checkpoints-prefetch` }],
        expected: '默认配置和显式预取各生成一份含 real 耗时的日志，结果目录中有两组独立 Checkpoint。第二组不会因为第一组留下的状态而变成恢复运行。',
        note: '官方示例只训练 10 步，这里先验证流程，不要根据一次 real 时间判断预取更快。正式性能比较需要增加测量步数、单独预热并重复多轮，同时记录对示例的修改。',
      },
      {
        blocks: [{ title: '终端：标记恢复点并完成首次 DCP 保存', code: `python - <<'PY'
from pathlib import Path
path = Path('example.py')
text = path.read_text()
needle = '    checkpointer = Checkpointer("checkpoints", dcp_api=args.dcp_api)\\n'
marker = '    print(f"Checkpoint to resume: {checkpointer.last_training_time}", flush=True)\\n'
if marker in text:
    print('恢复点日志已经存在，无需修改')
elif needle in text:
    path.write_text(text.replace(needle, needle + marker, 1))
    print('已加入恢复点日志')
else:
    raise SystemExit('未找到 Checkpointer 初始化代码；确认已检出教程指定版本')
PY
/usr/bin/time -p torchrun --standalone --nproc_per_node=2 example.py --dcp-api 2>&1 | tee ../../../results/fsdp-save.log
find checkpoints -maxdepth 4 -type f | sort | tee ../../../results/fsdp-save-files.txt` }],
        expected: '首次日志包含 Checkpoint to resume: None，训练结束后 checkpoints/dcp_api 下出现带时间戳的目录，文件清单中能看到模型和优化器状态。',
        note: '当前官方示例本来就会保存 Checkpoint。这里只增加一条日志，让“从头开始”与“读取已有状态”在终端中可见，不改变保存逻辑。',
      },
      {
        blocks: [{ title: '终端：重新启动并断言读取了已有状态', code: `/usr/bin/time -p torchrun --standalone --nproc_per_node=2 example.py --dcp-api 2>&1 | tee ../../../results/fsdp-resume.log
python - <<'PY'
from pathlib import Path
save = Path('../../../results/fsdp-save.log').read_text(errors='ignore')
resume = Path('../../../results/fsdp-resume.log').read_text(errors='ignore')
save_markers = [line for line in save.splitlines() if 'Checkpoint to resume:' in line]
resume_markers = [line for line in resume.splitlines() if 'Checkpoint to resume:' in line]
print('首次运行:', save_markers)
print('第二次运行:', resume_markers)
assert any(line.strip().endswith('None') for line in save_markers), '首次运行没有显示空恢复点'
assert any(not line.strip().endswith('None') for line in resume_markers), '第二次运行没有显示已有恢复点'
checkpoints = sorted(path for path in Path('checkpoints/dcp_api').iterdir() if path.is_dir())
assert len(checkpoints) >= 2, '两次运行后应至少有两个 Checkpoint 目录'
print('Checkpoint 目录:', [path.name for path in checkpoints])
PY
du -sh checkpoints` }],
        expected: '第二次日志显示已有时间戳而不是 None，自动断言通过，并列出至少两个 Checkpoint 目录。fsdp-save.log 与 fsdp-resume.log 分别保存两次运行的耗时。',
        note: '这里验证了官方示例能识别并加载已有模型和优化器状态。真实训练还需要额外保存随机状态、数据位置、学习率调度器和全局步数，并核对恢复前后的 loss 曲线。',
      },
    ],
    troubleshooting: [
      { problem: '导入 fully_shard 失败', solution: '当前 PyTorch 太旧或安装的不是预期环境。运行 python -c "import torch; print(torch.__version__)"，确认使用 fsdp-lab/.venv，并按照 requirements.txt 重新安装。' },
      { problem: '示例提示 GPU 数量不足', solution: '运行 nvidia-smi 和 python -c "import torch; print(torch.cuda.device_count())"，确认当前环境至少能使用两张 GPU，再检查 CUDA 构建与驱动是否匹配。' },
      { problem: '第二次仍显示 Checkpoint to resume: None', solution: '确认两次都在 examples/distributed/FSDP2 目录运行，第一次正常结束，checkpoints/dcp_api 未被移动，并且两次都使用 --dcp-api。' },
    ],
    cleanup: '保留 results 中的代码版本、日志、文件清单和两组对照 Checkpoint；DCP 结果位于 examples/distributed/FSDP2/checkpoints。确认备份后再删除不需要的 Checkpoint，并可用 git diff 保存恢复点日志补丁。',
  },

  'lab-serving': {
    requirements: [
      'Linux + 一张 NVIDIA GPU；小模型实验建议至少 8 GB 可用显存。',
      'Python 3.10+，可以创建虚拟环境，并能下载 Qwen2.5-0.5B-Instruct。',
      '准备两个终端：终端 A 运行服务，终端 B 发送请求和压测。',
    ],
    safety: '首次启动会下载模型并占用磁盘。压测只针对本机实验服务，不要把命令中的地址换成他人或生产服务；结果只代表当前硬件、版本和请求分布。',
    steps: [
      {
        blocks: [
          { title: '终端 A：创建环境并启动服务', code: `mkdir -p vllm-lab/results && cd vllm-lab
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install vllm
python -m pip freeze > results/environment.txt
vllm serve Qwen/Qwen2.5-0.5B-Instruct --host 127.0.0.1 --port 8000 --max-model-len 4096 --gpu-memory-utilization 0.85 --seed 42` },
          { title: '终端 B：等待服务就绪并检查模型', code: `cd vllm-lab
source .venv/bin/activate
curl --fail --silent http://127.0.0.1:8000/v1/models | python -m json.tool` },
        ],
        expected: '终端 A 显示服务已启动；终端 B 的 /v1/models 返回 JSON，模型列表中包含 Qwen/Qwen2.5-0.5B-Instruct。首次下载未完成时不要开始压测。',
        note: '如果当前版本的启动参数不同，先运行 vllm serve --help 核对。把最终实际版本保存在 results/environment.txt 后，再做对照实验。',
      },
      {
        blocks: [
          { title: '终端 B：先发送一次普通请求', code: `curl --fail --silent http://127.0.0.1:8000/v1/completions -H 'Content-Type: application/json' -d '{"model":"Qwen/Qwen2.5-0.5B-Instruct","prompt":"用一句话解释 KV Cache。","max_tokens":32,"temperature":0}' | python -m json.tool` },
          { title: '终端 B：预热并运行单并发基线', code: `vllm bench serve --backend vllm --base-url http://127.0.0.1:8000 --endpoint /v1/completions --model Qwen/Qwen2.5-0.5B-Instruct --dataset-name random --random-input-len 128 --random-output-len 64 --num-prompts 32 --num-warmups 4 --max-concurrency 1 --request-rate inf --ignore-eos --seed 42 --percentile-metrics ttft,tpot,e2el --metric-percentiles 50,95,99 --save-result --save-detailed --result-dir results --result-filename baseline-c01.json` },
        ],
        expected: '普通请求能返回文本；压测结束后打印 TTFT、TPOT、端到端延迟和吞吐，并生成 results/baseline-c01.json。随机输入不代表真实业务，只用于控制变量。',
        note: '--ignore-eos 用于尽量固定输出长度；--num-warmups 排除预热请求。若你的 vLLM 版本没有这些参数，先查 vllm bench serve --help，不要静默删除关键实验条件。',
      },
      {
        blocks: [{ title: '终端 B：逐级扫描并发并记录 SLO 内 goodput', code: `for c in 1 2 4 8 16; do vllm bench serve --backend vllm --base-url http://127.0.0.1:8000 --endpoint /v1/completions --model Qwen/Qwen2.5-0.5B-Instruct --dataset-name random --random-input-len 128 --random-output-len 64 --num-prompts "$((c * 32))" --num-warmups 4 --max-concurrency "$c" --request-rate inf --ignore-eos --seed 42 --percentile-metrics ttft,tpot,e2el --metric-percentiles 50,95,99 --goodput ttft:2000 tpot:100 e2el:10000 --save-result --save-detailed --result-dir results --result-filename "scan-c$(printf '%02d' "$c").json" 2>&1 | tee "results/scan-c$(printf '%02d' "$c").log"; done` }],
        expected: '得到 c01、c02、c04、c08、c16 五组 JSON 和日志。这里的示例 SLO 是 TTFT ≤ 2 秒、TPOT ≤ 100 毫秒、E2E ≤ 10 秒；练习后可改成你的业务目标。',
        note: '每轮使用相同输入/输出长度与随机种子，只改变最大并发。请求数随并发增加是为了让每轮有足够样本，正式容量测试还应固定更长的持续时间并重复多轮。',
      },
      {
        blocks: [{ title: '终端 B：汇总容量曲线数据', code: `cat > summarize.py <<'PY'
import csv, json, re
from pathlib import Path

rows = []
for path in Path('results').glob('scan-c*.json'):
    match = re.search(r'c(\\d+)', path.stem)
    if not match:
        continue
    data = json.loads(path.read_text())
    rows.append({
        'concurrency': int(match.group(1)),
        'completed': data.get('completed'),
        'request_throughput_req_s': data.get('request_throughput'),
        'output_throughput_tok_s': data.get('output_throughput'),
        'request_goodput': data.get('request_goodput'),
        'p99_ttft_ms': data.get('p99_ttft_ms'),
        'p99_tpot_ms': data.get('p99_tpot_ms'),
        'p99_e2el_ms': data.get('p99_e2el_ms'),
    })
rows.sort(key=lambda row: row['concurrency'])
with open('results/summary.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=list(rows[0]))
    writer.writeheader()
    writer.writerows(rows)
for row in rows:
    print(row)
PY
python summarize.py` }],
        expected: '生成 results/summary.csv，每行对应一个并发档位。用 SLO 内 goodput 和 P99 一起判断可用容量，不要只选择 output throughput 最大的档位。',
        note: '如果某个字段显示 None，先打开对应 JSON 查看当前版本实际字段名，再调整汇总脚本；不要把缺失值当成 0。最后用记录模板写下容量结论和测试边界。',
      },
    ],
    troubleshooting: [
      { problem: '启动时显存不足', solution: '先停止占用显存的其他进程，再降低 --gpu-memory-utilization 或 --max-model-len。每次只改一个参数，并记录新配置后重新跑基线。' },
      { problem: 'curl 连接失败或一直等待', solution: '确认终端 A 仍在运行且模型加载已完成，执行 curl http://127.0.0.1:8000/v1/models。若端口被占用，同时修改服务端 --port 和客户端 --base-url。' },
      { problem: '压测参数无法识别', solution: '运行 vllm bench serve --help 检查当前版本。尤其核对 --num-warmups、--percentile-metrics 和 --goodput；记录版本，不要混用不同参数集的结果。' },
      { problem: 'P99 很高但平均吞吐还在上升', solution: '这是需要保留的结果。检查排队、KV Cache 使用和请求级详细数据，并按 SLO 内 goodput 选择容量，而不是继续把最大吞吐当作可用容量。' },
    ],
    cleanup: '在终端 B 确认压测已结束，再到终端 A 按 Ctrl+C 停止 vLLM。保留 results 下的环境、JSON、日志和 summary.csv；不再需要时可删除 .venv 与模型缓存。',
  },

  'lab-kv': {
    requirements: [
      '已完成“做一次可信的 LLM 推理压测”，或已有可运行的 vLLM 环境。',
      'Linux + NVIDIA GPU；本例继续使用 Qwen2.5-0.5B-Instruct 控制模型变量。',
      '保留 vllm-lab/results 中的基线结果，并准备两个终端。',
    ],
    safety: '自动前缀缓存的支持和默认行为取决于 vLLM 版本与硬件。对照时只改变 --enable-prefix-caching，固定模型、请求长度和随机种子；固定样本差异需要人工复核，不能只用字符串相等判断质量。',
    steps: [
      {
        blocks: [
          { title: '终端 B：从模型配置计算 KV Cache', code: `cd vllm-lab
source .venv/bin/activate
python -m pip install transformers
python - <<'PY'
from transformers import AutoConfig
config = AutoConfig.from_pretrained('Qwen/Qwen2.5-0.5B-Instruct')
head_dim = getattr(config, 'head_dim', config.hidden_size // config.num_attention_heads)
bytes_per_token = 2 * config.num_hidden_layers * config.num_key_value_heads * head_dim * 2
print('layers=', config.num_hidden_layers, 'kv_heads=', config.num_key_value_heads, 'head_dim=', head_dim)
print('BF16 KV bytes/token/request=', bytes_per_token)
for tokens in (128, 512, 1024, 2048, 4096):
    print(f'{tokens:4d} tokens: {bytes_per_token * tokens / 1024**2:.2f} MiB/request')
PY` },
          { title: '终端 B：准备固定质量检查样本', code: `cat > quality_eval.py <<'PY'
import json, os, urllib.request

label = os.environ['RUN_LABEL']
prompts = [
    '用两句话解释为什么长上下文会占用更多显存。',
    '列出一个推理服务需要记录的三个延迟指标。',
    '如果吞吐提高但 P99 延迟变差，应该如何判断容量？',
]
rows = []
for prompt in prompts:
    payload = json.dumps({'model': 'Qwen/Qwen2.5-0.5B-Instruct', 'prompt': prompt, 'max_tokens': 80, 'temperature': 0}).encode()
    request = urllib.request.Request('http://127.0.0.1:8000/v1/completions', data=payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(request, timeout=120) as response:
        data = json.load(response)
    rows.append({'prompt': prompt, 'text': data['choices'][0]['text']})
with open(f'results/quality-{label}.json', 'w') as f:
    json.dump(rows, f, ensure_ascii=False, indent=2)
print(f'已保存 results/quality-{label}.json')
PY` },
        ],
        expected: '计算值来自实际模型配置，并生成 quality_eval.py。计算公式是 2（K/V）× 层数 × KV heads × head dim × 每元素字节数 × token 数。',
      },
      {
        blocks: [
          { title: '终端 A：以固定上下文上限启动基线服务', code: `cd vllm-lab && source .venv/bin/activate
vllm serve Qwen/Qwen2.5-0.5B-Instruct --host 127.0.0.1 --port 8000 --max-model-len 8192 --gpu-memory-utilization 0.85 --seed 42` },
          { title: '终端 B：扫描输入长度与并发', code: `cd vllm-lab && source .venv/bin/activate
for length in 256 1024 2048; do for c in 1 4; do vllm bench serve --backend vllm --base-url http://127.0.0.1:8000 --endpoint /v1/completions --model Qwen/Qwen2.5-0.5B-Instruct --dataset-name random --random-input-len "$length" --random-output-len 64 --num-prompts 32 --num-warmups 4 --max-concurrency "$c" --ignore-eos --seed 42 --save-result --save-detailed --result-dir results --result-filename "kv-i$length-c$c.json" 2>&1 | tee "results/kv-i$length-c$c.log"; done; done
RUN_LABEL=baseline python quality_eval.py` },
        ],
        expected: '得到三种输入长度、两种并发的六组结果，以及固定提示词的 quality-baseline.json。观察显存日志时，要区分权重、KV Cache 和临时工作区。',
      },
      {
        blocks: [
          { title: '终端 B：在同一基线服务上测共享前缀', code: `vllm bench serve --backend vllm --base-url http://127.0.0.1:8000 --endpoint /v1/completions --model Qwen/Qwen2.5-0.5B-Instruct --dataset-name random --random-input-len 1024 --random-prefix-len 1024 --random-output-len 64 --num-prompts 32 --num-warmups 4 --max-concurrency 4 --ignore-eos --seed 42 --save-result --result-dir results --result-filename prefix-disabled.json` },
          { title: '终端 A：停止基线并开启自动前缀缓存', code: `# 先在运行服务的终端按 Ctrl+C，等待进程退出，再执行：
vllm serve Qwen/Qwen2.5-0.5B-Instruct --host 127.0.0.1 --port 8000 --max-model-len 8192 --gpu-memory-utilization 0.85 --seed 42 --enable-prefix-caching` },
          { title: '终端 B：用同一请求配置复测并保存输出', code: `vllm bench serve --backend vllm --base-url http://127.0.0.1:8000 --endpoint /v1/completions --model Qwen/Qwen2.5-0.5B-Instruct --dataset-name random --random-input-len 1024 --random-prefix-len 1024 --random-output-len 64 --num-prompts 32 --num-warmups 4 --max-concurrency 4 --ignore-eos --seed 42 --save-result --result-dir results --result-filename prefix-enabled.json
RUN_LABEL=prefix python quality_eval.py` },
        ],
        expected: 'prefix-disabled.json 与 prefix-enabled.json 只有服务端前缀缓存配置不同；固定质量样本另存为 quality-prefix.json。没有共享前缀的流量不应承诺同样的收益。',
        note: '当前参数定义下，总输入长度是 random-prefix-len 与 random-input-len 之和，所以这两次请求为 1024 + 1024 = 2048 tokens。若你的版本不支持这些参数，先查 vllm bench serve --help，并用可重复共享前缀的数据集替代。',
      },
      {
        blocks: [{ title: '终端 B：检查输出回归并汇总权衡', code: `python - <<'PY'
import json
from pathlib import Path
baseline = json.loads(Path('results/quality-baseline.json').read_text())
variant = json.loads(Path('results/quality-prefix.json').read_text())
for index, (before, after) in enumerate(zip(baseline, variant), 1):
    same = before['text'] == after['text']
    print(f'case={index} exact_match={same} baseline_chars={len(before["text"])} variant_chars={len(after["text"])}')
    if not same:
        print('  需要人工检查语义差异，不要仅按字符串不同判定质量下降')
for name in ('prefix-disabled', 'prefix-enabled'):
    data = json.loads(Path(f'results/{name}.json').read_text())
    print(name, {key: data.get(key) for key in ('request_throughput', 'output_throughput', 'mean_ttft_ms', 'p99_ttft_ms')})
PY` }],
        expected: '你保存了输出是否一致、文本长度和性能对照。字符串不同只代表需要复核；最终结论还要结合任务质量、共享前缀比例和 P99，而不是只看 TTFT。',
      },
    ],
    troubleshooting: [
      { problem: '前缀缓存开启后没有收益', solution: '先确认请求确实有足够长的共同前缀，并检查引擎日志是否识别该功能。完全随机的输入没有可复用前缀，没有收益是合理结果。' },
      { problem: '上下文增加后服务直接 OOM', solution: '记录触发时的输入长度、并发和启动参数，再降低 max-model-len 或并发。OOM 本身也是容量边界，不要删除这组结果。' },
      { problem: '开启前缀缓存后固定输出不同', solution: '先核对两次模型、采样参数和请求是否一致，再逐条人工检查语义。字符串不同不等于质量下降；如果输出明显错误，应停止采用该配置并保留复现结果。' },
    ],
    cleanup: '在终端 A 按 Ctrl+C 停止服务。保存六组扫描结果、前缀对照和三组固定输出；如果继续测试其他缓存配置，请使用新的结果目录，避免覆盖基线。',
  },

  'lab-production': {
    requirements: [
      '一个非生产 Kubernetes 集群，节点有可调度的 NVIDIA GPU 与 Device Plugin。',
      '本机已配置 kubectl 和 Helm，且拥有创建 Deployment、Service 与监控资源的权限。',
      '集群能拉取 vLLM 镜像和模型；先确认镜像与 GPU 驱动兼容。',
    ],
    safety: '只在测试集群执行删除 Pod 和变更镜像等操作。先核对 kubectl config current-context，不要对生产命名空间做故障演练；示例不包含认证，不能直接暴露到公网。',
    steps: [
      {
        blocks: [{ title: '终端：创建带探针和资源声明的部署', language: 'bash', code: `kubectl config current-context
mkdir -p gpu-service-lab && cd gpu-service-lab
cat > vllm.yaml <<'YAML'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-lab
  labels: {app: vllm-lab}
spec:
  replicas: 1
  selector:
    matchLabels: {app: vllm-lab}
  template:
    metadata:
      labels: {app: vllm-lab}
    spec:
      containers:
        - name: vllm
          image: vllm/vllm-openai:v0.11.0
          args: ["--model", "Qwen/Qwen2.5-0.5B-Instruct", "--max-model-len", "4096"]
          ports: [{containerPort: 8000}]
          resources:
            requests: {cpu: "2", memory: 8Gi, nvidia.com/gpu: "1"}
            limits: {cpu: "4", memory: 16Gi, nvidia.com/gpu: "1"}
          readinessProbe:
            httpGet: {path: /health, port: 8000}
            initialDelaySeconds: 30
            periodSeconds: 10
            failureThreshold: 30
          livenessProbe:
            httpGet: {path: /health, port: 8000}
            initialDelaySeconds: 120
            periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: vllm-lab
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8000"
    prometheus.io/path: "/metrics"
spec:
  selector: {app: vllm-lab}
  ports: [{port: 80, targetPort: 8000}]
YAML
kubectl apply -f vllm.yaml
kubectl rollout status deployment/vllm-lab --timeout=360s
kubectl get pods -l app=vllm-lab -o wide` }],
        expected: 'Deployment 变为可用，Pod 处于 Running 且 Ready。若一直 Pending，先看 kubectl describe pod 中的 GPU 资源与调度事件，不要直接重启。',
      },
      {
        blocks: [{ title: '终端：部署监控并验证指标端点', code: `helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add nvidia https://nvidia.github.io/dcgm-exporter
helm repo update
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack --namespace monitoring
helm upgrade --install dcgm-exporter nvidia/dcgm-exporter --namespace monitoring
kubectl get pods -n monitoring
kubectl port-forward svc/vllm-lab 8000:80 > port-forward.log 2>&1 &
PF_PID=$!
sleep 3
curl --fail --silent http://127.0.0.1:8000/metrics | head -30 > vllm-metrics-sample.txt
curl --fail --silent http://127.0.0.1:8000/health
kill "$PF_PID"` }],
        expected: '监控组件 Pod 启动，vllm-metrics-sample.txt 保存了真实指标，/health 返回成功。再到 Prometheus 中确认目标被发现，而不是只看到进程存活。',
      },
      {
        blocks: [{ title: '终端：配置不可用告警并演练回滚', code: `cat > alert.yaml <<'YAML'
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: vllm-lab-alerts
  labels: {release: monitoring}
spec:
  groups:
    - name: vllm-lab
      rules:
        - alert: VllmLabUnavailable
          expr: kube_deployment_status_replicas_unavailable{deployment="vllm-lab"} > 0
          for: 5m
          labels: {severity: warning}
          annotations:
            summary: "vLLM 实验服务存在不可用副本"
YAML
kubectl apply -f alert.yaml
kubectl set env deployment/vllm-lab VLLM_LOGGING_LEVEL=INFO
kubectl rollout status deployment/vllm-lab --timeout=360s
kubectl rollout history deployment/vllm-lab
kubectl rollout undo deployment/vllm-lab
kubectl rollout status deployment/vllm-lab --timeout=360s` }],
        expected: 'PrometheusRule 创建成功，一次受控配置变更后能够回滚并恢复 Ready。回滚验证的是流程，不代表业务请求一定没有中断，需要同时观察请求指标。',
      },
      {
        blocks: [{ title: '终端：删除一个 Pod 并记录恢复时间', code: `kubectl get pods -l app=vllm-lab -o wide
START=$(date +%s)
kubectl delete pod -l app=vllm-lab --wait=false
kubectl rollout status deployment/vllm-lab --timeout=360s
END=$(date +%s)
echo "recovery_seconds=$((END - START))" | tee recovery-result.txt
kubectl get events --sort-by=.lastTimestamp | tail -30 > recovery-events.txt` }],
        expected: 'Deployment 自动补回副本，recovery-result.txt 记录从删除到 Ready 的时间，事件日志保存了调度与探针过程。冷启动包含模型加载，不能只统计容器创建时间。',
      },
    ],
    troubleshooting: [
      { problem: 'Pod 一直 Pending', solution: '运行 kubectl describe pod -l app=vllm-lab，检查 nvidia.com/gpu 是否可分配、节点污点、CPU/内存请求和存储。不要通过删除资源限制来掩盖容量问题。' },
      { problem: '容器 Running 但一直不 Ready', solution: '查看 kubectl logs -l app=vllm-lab --tail=100。模型下载与加载可能较慢；确认 /health、端口和模型错误后，再有依据地调整探针。' },
      { problem: 'Prometheus 看不到服务指标', solution: '先直接验证 /metrics，再检查 Service annotations、Prometheus 的服务发现与抓取配置。仅安装监控 Chart 不等于自动抓取所有服务。' },
    ],
    cleanup: '确认记录已保存后，执行 kubectl delete -f alert.yaml -f vllm.yaml。监控组件是否保留由你决定；不要在共享测试集群中删除他人的命名空间或资源。',
  },

  'lab-rag': {
    requirements: [
      '一台普通电脑即可，Python 3.10+，不需要 GPU 或外部 LLM API。',
      '可以安装 scikit-learn；教程使用小型英文语料避免分词差异干扰实验。',
      '理解检索召回、回归测试和工具幂等的基本概念。',
    ],
    safety: '这个实验先验证检索与工具调用的回归流程，不用模拟分数冒充真实答案质量。接入自己的 LLM 后，还需要独立评测上下文相关性、答案正确性和权限边界。',
    steps: [
      {
        blocks: [{ title: '终端：创建有固定 ID 的数据与查询集', code: `mkdir -p rag-quality-lab && cd rag-quality-lab
python3 -m venv .venv && source .venv/bin/activate
python -m pip install scikit-learn
cat > dataset.json <<'JSON'
{
  "version": "v1",
  "documents": [
    {"id": "kv-cache", "text": "KV cache stores attention keys and values during autoregressive inference."},
    {"id": "continuous-batching", "text": "Continuous batching schedules requests at iteration level to improve accelerator utilization."},
    {"id": "checkpoint", "text": "A training checkpoint should include model optimizer random state and data position."},
    {"id": "nccl", "text": "NCCL provides collective operations such as all reduce and all gather for GPU clusters."},
    {"id": "permissions", "text": "Tool gateways must check permissions before executing actions with side effects."}
  ],
  "queries": [
    {"query": "What is stored in the KV cache?", "expected": ["kv-cache"]},
    {"query": "How does iteration level scheduling improve utilization?", "expected": ["continuous-batching"]},
    {"query": "What should a resumable training checkpoint contain?", "expected": ["checkpoint"]},
    {"query": "Which library provides all reduce for GPUs?", "expected": ["nccl"]}
  ]
}
JSON
python - <<'PY'
import hashlib, json
from pathlib import Path
raw = Path('dataset.json').read_bytes()
data = json.loads(raw)
assert len({item['id'] for item in data['documents']}) == len(data['documents'])
print('dataset_version=', data['version'])
print('sha256=', hashlib.sha256(raw).hexdigest())
Path('dataset.sha256').write_text(hashlib.sha256(raw).hexdigest() + '\\n')
PY` }],
        expected: 'dataset.json 包含固定文档 ID、查询和预期答案，dataset.sha256 固定了数据版本。后续每次评测都能追溯到同一份数据。',
      },
      {
        blocks: [{ title: '终端：计算 Recall@3、MRR 并保存失败样本', code: `cat > evaluate.py <<'PY'
import json
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

data = json.loads(Path('dataset.json').read_text())
documents = data['documents']
vectorizer = TfidfVectorizer()
matrix = vectorizer.fit_transform([item['text'] for item in documents])
rows, failures = [], []
for case in data['queries']:
    query_vector = vectorizer.transform([case['query']])
    scores = cosine_similarity(query_vector, matrix)[0]
    ranked = [documents[index]['id'] for index in scores.argsort()[::-1]]
    top3 = ranked[:3]
    hit = any(item in top3 for item in case['expected'])
    reciprocal_rank = 0.0
    for rank, doc_id in enumerate(ranked, 1):
        if doc_id in case['expected']:
            reciprocal_rank = 1 / rank
            break
    row = {'query': case['query'], 'expected': case['expected'], 'top3': top3, 'hit_at_3': hit, 'reciprocal_rank': reciprocal_rank}
    rows.append(row)
    if not hit:
        failures.append(case)
summary = {'dataset_version': data['version'], 'recall_at_3': sum(row['hit_at_3'] for row in rows) / len(rows), 'mrr': sum(row['reciprocal_rank'] for row in rows) / len(rows)}
Path('eval-results.json').write_text(json.dumps({'summary': summary, 'rows': rows}, indent=2))
Path('failures.json').write_text(json.dumps(failures, indent=2))
print(json.dumps(summary, indent=2))
for row in rows:
    print(row)
PY
python evaluate.py` }],
        expected: '生成 eval-results.json 和 failures.json，并打印 Recall@3 与 MRR。指标来自这个小型教学集，只用于练习评测流程，不能外推为真实业务质量。',
      },
      {
        blocks: [{ title: '终端：加入空检索、超时、权限与重复调用用例', code: `cat > test_failures.py <<'PY'
from functools import lru_cache

@lru_cache(maxsize=1)
def empty_retrieval():
    return []

def tool_gateway(user_role, action, request_id, executed):
    if user_role != 'operator':
        return 'permission-denied'
    if action == 'slow-action':
        return 'timeout-recorded'
    if request_id in executed:
        return 'duplicate-suppressed'
    executed.add(request_id)
    return 'executed-once'

def test_empty_retrieval_has_explicit_result():
    assert empty_retrieval() == []

def test_timeout_is_recorded():
    assert tool_gateway('operator', 'slow-action', 'r1', set()) == 'timeout-recorded'

def test_permission_checked_before_execution():
    executed = set()
    assert tool_gateway('viewer', 'delete', 'r2', executed) == 'permission-denied'
    assert not executed

def test_retry_does_not_repeat_side_effect():
    executed = set()
    assert tool_gateway('operator', 'restart', 'r3', executed) == 'executed-once'
    assert tool_gateway('operator', 'restart', 'r3', executed) == 'duplicate-suppressed'
    assert len(executed) == 1
PY
python -m pip install pytest
pytest -q 2>&1 | tee regression-tests.txt` }],
        expected: '四个测试全部通过，regression-tests.txt 保存结果。这些用例验证的是错误处理与副作用控制，不代表模型回答正确。',
      },
      {
        blocks: [{ title: '终端：把失败样本加入回归清单', code: `python - <<'PY'
import json
from pathlib import Path
failures = json.loads(Path('failures.json').read_text())
regression = {'dataset_version': 'v1', 'retrieval_failures': failures, 'required_tool_cases': ['empty-retrieval', 'timeout', 'permission-denied', 'duplicate-request']}
Path('regression.json').write_text(json.dumps(regression, indent=2))
print(f'已记录 {len(failures)} 个检索失败样本和 {len(regression["required_tool_cases"])} 个工具用例')
PY
python evaluate.py 2>&1 | tee eval-rerun.txt
pytest -q 2>&1 | tee regression-rerun.txt` }],
        expected: 'regression.json 固化失败样本与必须保留的工具用例，第二次评测和测试有独立日志。以后每次修改检索或工具逻辑，都应重跑并比较同一数据版本。',
        note: '真正修复问题后，不要直接删除失败样本。保留原用例，新增修复说明和新的评测结果，才能看出改动是否有效。',
      },
    ],
    troubleshooting: [
      { problem: 'Recall@3 很高，但回答仍然错误', solution: '检索命中不等于答案正确。需要继续检查上下文是否被正确使用、生成是否忠于文档，并把检索评测和生成评测分开记录。' },
      { problem: '换一批文档后分数无法比较', solution: '先检查 dataset.sha256 和索引版本是否变化。不同数据集上的分数不应直接比较，需要分别报告或建立固定对照集。' },
      { problem: '重试导致工具执行两次', solution: '在执行副作用前验证 request_id 与权限，并持久化执行状态。内存中的 set 只适合教学，生产环境需要原子去重与可审计状态。' },
    ],
    cleanup: '保留 dataset、eval-results、failures、regression 和两轮日志。虚拟环境可删除；不要把教学集上的 100% 指标写成真实应用的质量结论。',
  },
};
