import { TrackedTopic, NewsArticle, ChecklistTask, WeeklyData } from '../types';

export const INITIAL_TOPICS: TrackedTopic[] = [
  {
    id: 'topic-1',
    name: 'Liquid Neural Networks',
    description: 'Smooth neural models that adapt continuously over time.',
    tags: ['#EdgeAI', '#NeuralModels'],
    sourceCount: 8,
    active: true,
    detailLevel: 'Deep Dive',
    statusText: 'All sources working fine • Last updated 3m ago',
    lastUpdated: '3m ago',
    sourceTypes: ['Research Papers', 'Code Repos'],
    frequency: 'Continuous',
    accentColor: '#00f2fe'
  },
  {
    id: 'topic-2',
    name: 'AI Interpretability & Safety',
    description: 'Understanding internal circuits and features inside deep models.',
    tags: ['#AISafety', '#ModelInternals'],
    sourceCount: 14,
    active: true,
    detailLevel: 'Quick Summary',
    statusText: 'Sources active • Updated 14m ago',
    lastUpdated: '14m ago',
    sourceTypes: ['Research Papers', 'Tech News'],
    frequency: 'Continuous',
    accentColor: '#dbb8ff'
  },
  {
    id: 'topic-3',
    name: 'Quantum Computing Circuits',
    description: 'Reducing noise in next-generation quantum algorithms.',
    tags: ['#QuantumAI', '#Algorithms'],
    sourceCount: 6,
    active: false,
    detailLevel: 'Deep Dive',
    statusText: 'Paused by you • Resumes tomorrow',
    lastUpdated: '1h ago',
    sourceTypes: ['Research Papers'],
    frequency: 'Hourly',
    accentColor: '#849495'
  },
  {
    id: 'topic-4',
    name: 'LLM Reasoning & Search Trees',
    description: 'Test-time compute scaling and verifiable reward verification.',
    tags: ['#TestTimeCompute', '#TreeSearch'],
    sourceCount: 22,
    active: true,
    detailLevel: 'Deep Dive',
    statusText: 'Ingesting arXiv & peer review • Active stream',
    lastUpdated: '8m ago',
    sourceTypes: ['Research Papers', 'Code Repos', 'Tech News'],
    frequency: 'Continuous',
    accentColor: '#00f2fe'
  }
];

export const TRENDING_TOPICS = [
  {
    id: 'trend-1',
    trendingMatch: '99% Trending',
    source: 'arXiv',
    title: 'AI Reasoning at Test Time',
    description: 'Search trees and verifiable reward models during inference runtime.',
    rate: '+42 papers/d',
    rateColor: '#00f2fe',
    tag: '#TestTimeCompute'
  },
  {
    id: 'trend-2',
    trendingMatch: '87% Trending',
    source: 'github.com',
    title: '1-Bit Fast Language Models',
    description: '1-bit LLM architectural hardware-accelerated quantization kernels.',
    rate: '18 repos/d',
    rateColor: '#dbb8ff',
    tag: '#Quantization'
  },
  {
    id: 'trend-3',
    trendingMatch: '76% Trending',
    source: 'sec.gov',
    title: 'Silicon Foundry CapEx Wars',
    description: 'Advanced lithography yields, substrate wafer constraints & packaging.',
    rate: 'Capital Flow',
    rateColor: '#ffb86f',
    tag: '#HardwareCapEx'
  }
];

export const INITIAL_ARTICLES: NewsArticle[] = [
  {
    id: 'art-1',
    sourceBadge: 'arXiv:2409.1102',
    matchScore: '99.2% Match',
    timeAgo: '14m ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrpkmkylHdzJTmlZfM2-jl7TSa4fGuvanR-N4CHSzHOPtWbvm0FMCylLbVhpC3Ew1wBzDIG53QWMcieArQJqpLhSMQs953YBsSHZvbIoHW3UEsbFA0rs1DXMFcC_YBDv1wNA4Bgd0Z96nCootX8-yxRCSEPrqgwMzdKjKYfKD6mEq5_x-PAm05ZJX9lAHSFmGUu5VNOyMdA0rMpj506joX39JvrniDU0vOZYhP6B_vDya0dOta6LRd',
    overlayBadgeLeft: 'System: 01-Turing',
    overlayBadgeRight: 'Deep Reasoning',
    overlayRightColor: '#00f2fe',
    title: 'New AI Reasoning Models Solve Hard Math & Logic Problems Faster',
    excerpt: 'New step-by-step verification methods allow AI models to automatically identify and correct reasoning errors on the fly, cutting hallucinations by 78.4%.',
    takeawayType: 'Key Takeaway',
    takeawayText: 'Models double-check answers in real time without extra delay.',
    takeawayIcon: 'bolt',
    takeawayColor: '#00f2fe',
    topicTag: 'LLM Reasoning',
    saved: false,
    audioDuration: '1 min 14 sec',
    audioNarration: 'Researchers have unveiled step-by-step verification frameworks that empower language models to auto-detect reasoning discrepancies during inference, reducing mathematical hallucinations by over 78 percent without adding pipeline latency.'
  },
  {
    id: 'art-2',
    sourceBadge: 'Nature Tech',
    matchScore: 'Top Peer Review',
    timeAgo: '42m ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEs_PtwhUbpewJZ2UcpR4jf5yyldqXEy08J0KiVh6KqxdMtFkjVrjj5nOIFIiNWXXtvGqpeZNQkq8eMkAkcEexL9BXjBBISl3deN7Mj4hEVBpoVlXwtZYeiwJ29CD-wlux6zs_MVkOI4b2TE7YyLsmaetdNhOEJcalDyllY4rRldjU8zKeTjYXR2SGu19P6WZkea9faOknzNTGkUDKGLuPknHEp4_9enVGM-F3uLaCN_yAMxO_yDVW',
    overlayBadgeLeft: 'Silicon Spin Nodes',
    overlayBadgeRight: 'Superconduction',
    overlayRightColor: '#6807ba',
    title: 'New Brain-Like Neuromorphic Chips Pack 100x More Density',
    excerpt: 'Integrated Josephson junctions mimic human brain synaptic behavior with near-zero latency, enabling ultra-fast on-device AI computing.',
    takeawayType: 'Why It Matters',
    takeawayText: 'Smart edge robots can run heavy AI models smoothly with much longer battery life.',
    takeawayIcon: 'psychology',
    takeawayColor: '#dbb8ff',
    topicTag: 'Neural Chips',
    saved: false,
    audioDuration: '1 min 08 sec',
    audioNarration: 'Nature Tech has published a breakthrough in superconducting neuromorphic hardware: sub-nanometer Josephson junctions mimicking biological synapses, achieving 100-fold density improvements for embedded edge computing.'
  },
  {
    id: 'art-3',
    sourceBadge: 'MIT Review',
    matchScore: 'Analysis',
    timeAgo: '2h ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_OsYPnnlU-G5gO6VDDiYx9nrY8w9RVeObIr05llT7ni-iwaP27z64NtTH-UZZML3dcUjyhYfB4SSIfTMaapkZCjb7qqvRQ3bRnrkqIk8vj4PYuQVRHKO2kj2O9cSyR7NK3WKpI7MfxRV3dYNFvKLHuM_DbqVV9GrmmGJv80afU_hclBm9Pjg9-S2gnW07Nkx2nXOjMp8LR5AiSGhn0amqq8_afZ5qSPF54G5r6IFceIXrL7S3pn1y',
    overlayBadgeLeft: 'Autonomous Swarms',
    overlayBadgeRight: 'Field Deploy',
    overlayRightColor: '#ffd3aa',
    title: 'How Autonomous AI Agents Are Changing Company Workflows',
    excerpt: 'How collaborative autonomous agent clusters are managing procurement, scheduling, and engineering tasks without constant human intervention.',
    takeawayType: 'Big Picture',
    takeawayText: 'Regulators are working on simple guidelines for companies deploying multi-agent systems.',
    takeawayIcon: 'policy',
    takeawayColor: '#ffb86f',
    topicTag: 'LLM Reasoning',
    saved: false,
    audioDuration: '1 min 22 sec',
    audioNarration: 'A comprehensive study from MIT Technology Review examines multi-agent clusters across enterprise supply chains. Collaborative agent networks now autonomously negotiate contracts and triage code deployments.'
  }
];

export const INITIAL_TASKS: ChecklistTask[] = [
  {
    id: 'task-1',
    title: 'Mixture of Experts (MoE) Architecture',
    readTime: '9 min read',
    completed: true,
    sourceMeta: 'DeepSeek-V3 Report • Smart routing between expert models',
    metricBadge: 'Verified',
    metricColor: '#dbb8ff',
    badgeLabel: 'Done',
    keyTakeaway: 'Multi-Head Latent Attention (MLA) reduces memory footprint by 93.3% while dual-pipe execution enables ultra-smooth inference with minimal overhead.',
    themeCategory: 'AI Architecture'
  },
  {
    id: 'task-2',
    title: 'Solid-State Battery Breakthroughs',
    readTime: '8 min read',
    completed: true,
    sourceMeta: 'Nature Energy • 800 Wh/L high energy density achieved',
    metricBadge: '800 Wh/L',
    metricColor: '#00f2fe',
    badgeLabel: 'Done',
    keyTakeaway: 'Dendrite-suppressing sulfide electrolytes achieved 1,200 continuous rapid charge cycles at 45°C without volumetric fracturing.',
    themeCategory: 'Energy Tech'
  },
  {
    id: 'task-3',
    title: 'Faster AI Model Inference Methods',
    readTime: '7 min read',
    completed: true,
    sourceMeta: 'FlashDecoding++ & vLLM • Up to 3.4x faster responses',
    metricBadge: '3.4x Speed',
    metricColor: '#dbb8ff',
    badgeLabel: 'Done',
    keyTakeaway: 'Speculative decoding with draft verification reduced decode latency under long-tail generation prompts by 62% across GPU clusters.',
    themeCategory: 'Inference'
  },
  {
    id: 'task-4',
    title: 'Building Reliable AI Agent Workflows',
    readTime: '11 min read',
    completed: false,
    sourceMeta: 'Status: Ready to read',
    metricBadge: 'Pending',
    metricColor: '#849495',
    badgeLabel: 'Pending',
    keyTakeaway: 'Deterministic validation loops combined with structured JSON schema verification guardrails prevent cascading tool call failures.',
    themeCategory: 'Agent Systems'
  }
];

export const INITIAL_WEEKLY: WeeklyData = {
  issue: 'ISSUE 48 • WEEKLY ROUNDUP • OCT 21 – OCT 27',
  dateRange: 'OCT 21 — OCT 27',
  headline: 'Autonomous AI Reasoning & Real-Time Problem Solving',
  abstract: 'Major breakthroughs this week show that models giving themselves more thinking time during queries are beating larger static models. Open-source labs are shifting quickly toward verified step-by-step logic.',
  biggestShift: 'Verification steps added after training produce much fewer errors.',
  efficiencyGain: '4.2x faster response times using speculative decoding.',
  articlesAnalyzed: 1840,
  knowledgeGrowth: '+15%',
  trends: [
    {
      id: 'trend-1',
      tag: 'TREND 01',
      sourcesCount: 8,
      title: 'Giving Models More Thinking Time',
      description: 'Instead of just making models bigger during training, top labs are letting models generate and check multiple reasoning steps before answering.',
      badges: ['o1', 'r1', '+ 6 Papers'],
      fullSummary: 'Inference-time compute scaling is replacing pure parameter scaling as the highest ROI frontier. By using test-time search trees and process reward models (PRMs), compact 7B-32B parameter models consistently outperform 70B monolithic models on MATH-500, AIME, and coding challenges while consuming a fraction of training energy.'
    },
    {
      id: 'trend-2',
      tag: 'TREND 02',
      sourcesCount: 14,
      title: 'Self-Correcting AI Agents',
      description: 'Rigorous tests show that adding simple self-checking loops prevents hallucination in coding benchmarks and complex workflows.',
      badges: ['SWE-Bench', 'MATH-500'],
      fullSummary: 'Agentic feedback loops combining environment execution with critique passes achieved an 82.4% pass rate on complex multi-file codebase refactors. Dual-pass verification catches silent logic regressions before committing changes.'
    },
    {
      id: 'trend-3',
      tag: 'TREND 03',
      sourcesCount: 11,
      title: 'Silicon Photonic Interconnects',
      description: 'Co-packaged optics integrated directly alongside GPU tensor cores slash inter-node transceiver power and cluster latency.',
      badges: ['Nature Tech', 'IEEE Spectrum'],
      fullSummary: 'Direct laser optical couplers embedded onto substrate carriers have demonstrated a 68% drop in cluster communication power, paving the way for petabyte-per-second interconnect fabrics.'
    }
  ]
};
