import { useState } from 'react';
const events = [
  { input: 'a · b · c', output: 'd', cache: 'a · b · c', label: 'Prefill：处理已知输入' },
  { input: 'd', output: 'e', cache: 'a · b · c · d', label: 'Decode 1：处理新位置 d' },
  { input: 'e', output: 'f', cache: 'a · b · c · d · e', label: 'Decode 2：处理新位置 e' },
];
export function kvBytes(tokens, sequences) { return 2 * 32 * 8 * 128 * 2 * tokens * sequences; }
function KVCalculator() {
  const [tokens, setTokens] = useState(4096);
  const [sequences, setSequences] = useState(16);
  return <figure className="lesson-demo" aria-label="KV Cache 容量估算"><figcaption>32 层 · 8 KV heads · head dim 128 · BF16</figcaption><div className="demo-controls"><label>每请求缓存位置数 <select value={tokens} onChange={e => setTokens(Number(e.target.value))}>{[512,1024,2048,4096,8192,16384].map(n => <option key={n}>{n}</option>)}</select></label><label>同长度请求数 <select value={sequences} onChange={e => setSequences(Number(e.target.value))}>{[1,2,4,8,16,32].map(n => <option key={n}>{n}</option>)}</select></label></div><output aria-live="polite" className="demo-result">{(kvBytes(tokens,sequences)/1024**3).toFixed(2)} GiB</output><p>仅计算原始 KV 数据，不含权重、工作区、分配开销、共享或分片。</p></figure>;
}
function Generation() {
  const [step, setStep] = useState(0);
  const event = events[step];
  return <figure className="lesson-demo"><figcaption>三个输入位置，逐步预测 d、e、f</figcaption><div className="demo-pipeline" aria-live="polite"><span>本轮输入<b>{event.input}</b></span><span>模型计算 →</span><span>预测<b>{event.output}</b></span></div><p>本轮结束后的 KV：{event.cache}</p><div className="demo-stepper"><button onClick={() => setStep(step-1)} disabled={step === 0}>上一步</button><span>{event.label}</span><button onClick={() => setStep(step+1)} disabled={step === events.length-1}>下一步</button></div></figure>;
}
function Batching() {
  const [continuous, setContinuous] = useState(false);
  const rows = continuous ? [['A','A','C','C','空'],['B','B','B','B','B']] : [['A','A','空','空','空','C','C'],['B','B','B','B','B','空','空']];
  return <figure className="lesson-demo"><figcaption>两个批次位置 · A 需 2 轮，B 需 5 轮，C 需 2 轮</figcaption><div className="demo-toggle" role="group" aria-label="批处理方式"><button aria-pressed={!continuous} onClick={() => setContinuous(false)}>固定批次</button><button aria-pressed={continuous} onClick={() => setContinuous(true)}>连续批处理</button></div><div className="batch-table" aria-live="polite"><table><thead><tr><th>位置 / 轮次</th>{rows[0].map((_,i) => <th key={i}>{i+1}</th>)}</tr></thead><tbody>{rows.map((row,i) => <tr key={i}><th>位置 {i+1}</th>{row.map((value,j) => <td key={j} className={value === '空' ? 'batch-idle' : `batch-${value}`}>{value}</td>)}</tr>)}</tbody></table></div><p>教学假设：同时到达、prefill 已完成、轮次等长；忽略开销，不代表实测加速比。</p></figure>;
}
function Benchmark() {
  const [target, setTarget] = useState(300);
  const ttft = [100,100,100,100,200,200,200,200,300,1000];
  const tpot = [20,20,20,20,30,30,30,30,40,100];
  const count = ttft.filter((value,index) => value <= target && tpot[index] <= 40).length;
  return <figure className="lesson-demo"><figcaption>重算教学数据的达标请求</figcaption><label>TTFT 目标（ms）<select value={target} onChange={e => setTarget(Number(e.target.value))}>{[100,200,300,1000].map(value => <option key={value}>{value}</option>)}</select></label><p>TPOT 固定要求 ≤ 40 ms；统计窗口 10 秒。</p><output className="demo-result" aria-live="polite">{count} / 10 达标 · goodput {(count/10).toFixed(1)} 请求/秒</output><p>请求吞吐始终为 1 请求/秒。这里改变的是目标，并未重新运行服务。</p></figure>;
}
export default function LessonDemo({ name }) {
  if (name === 'kv') return <KVCalculator />;
  if (name === 'decode') return <Generation />;
  if (name === 'batch') return <Batching />;
  if (name === 'benchmark') return <Benchmark />;
  const diagrams = {
    tokens: { caption:'固定玩具词表，嵌入维度为 4', steps:[['文本','我 学习 推理'],['ID · [1, 3]','2 → 3 → 5'],['查嵌入表','输出 [1, 3, 4]']] },
    attention: { caption:'单头 Attention · 3 个位置，key/value 维度均为 2',steps:[['Q × Kᵀ','[3, 2] × [2, 3]'],['缩放、mask、softmax','权重 [3, 3]'],['权重 × V','输出 [3, 2]']] },
    'kv-flow': { caption:'单层示意；模型的每个相关层各自维护缓存',steps:[['历史位置','缓存 K₀,V₀ … Kₜ₋₁,Vₜ₋₁'],['新位置 t','计算 Qₜ、Kₜ、Vₜ'],['Attention','Qₜ 读取历史与当前位置 K/V']] },
  };
  const diagram = diagrams[name];
  if (!diagram) return null;
  return <figure className="lesson-demo"><figcaption>{diagram.caption}</figcaption><ol className="demo-pipeline">{diagram.steps.map(([title,text],index) => <li key={title}><span>{index+1}. {title}</span><b>{text}</b></li>)}</ol></figure>;
}
