/**
 * Accepted main-track ("10 min, 16 MB") records from the OpenAI Parameter Golf README leaderboard
 * (github.com/openai/parameter-golf, commit f5c0793, 2026-05-04). `bpb` is the README Score column
 * (bits per byte on the FineWeb validation set, lower is better); dates are the README dates.
 *
 * Omitted on purpose: non-record (unlimited-compute) submissions. The Ternary Quantization row
 * (1.1570, 03-24) is kept; it is simply not a new frontier. The final row (2026-05-01) was added
 * after the 30 April deadline under a grace policy and is flagged `afterDeadline`.
 *
 * Which account is "Aiden" rests on Weco's own statement; the repository only lists `dexhunter`.
 */
export interface GolfRecord {
  date: string
  bpb: number
  author: string
  name: string
  pr: number | null
  url: string
  afterDeadline?: boolean
}

export const parameterGolfRecords: readonly GolfRecord[] = [
  { date: "2026-03-18", bpb: 1.2244, author: "Baseline", name: "Naive Baseline", pr: null, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-17_NaiveBaseline/README.md" },
  { date: "2026-03-18", bpb: 1.2197, author: "Renier Velazco", name: "fp16 Embed", pr: null, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-18_FP16Embed_WD3600/README.md" },
  { date: "2026-03-18", bpb: 1.2147, author: "Nan Liu", name: "int6 mixed precision", pr: null, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-19_10L_MixedPrecision/README.md" },
  { date: "2026-03-18", bpb: 1.206, author: "Spokane Way", name: "2048 seq length", pr: null, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-18_LongContextSeq2048/README.md" },
  { date: "2026-03-19", bpb: 1.2014, author: "Spokane Way", name: "4k seq length", pr: null, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-19_TrainingOptSeq4096/README.md" },
  { date: "2026-03-19", bpb: 1.1928, author: "samacqua", name: "Lora TTT", pr: null, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-17_LoRA_TTT/README.md" },
  { date: "2026-03-19", bpb: 1.1925, author: "Matthew Li", name: "Sliding Window Eval", pr: null, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-19_SlidingWindowEval/README.md" },
  { date: "2026-03-19", bpb: 1.1748, author: "notapplica", name: "Muon WD + 10 layer", pr: null, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-19_SlidingWindow_FP16Emb_10L_MuonWD_OvertoneInit/README.md" },
  { date: "2026-03-19", bpb: 1.163, author: "aquariouseworkman", name: "Mixed Quant + Sliding Window Eval", pr: null, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-19_MixedQuant_Int6Int8_SlidingWindow/README.md" },
  { date: "2026-03-19", bpb: 1.1586, author: "yahya010", name: "10L Int6 QAT + Zstd MLP2.6x", pr: null, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-19_Seq2048_FP16Emb_TunedLR/README.md" },
  { date: "2026-03-19", bpb: 1.1556, author: "aquariouseworkman", name: "SmearGate + OrthoInit + Muon WD", pr: null, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-19_smeargate_orthoinit_muonwd/README.md" },
  { date: "2026-03-20", bpb: 1.1502, author: "aruniyer", name: "11L MLP3x + Int6 QAT", pr: null, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-19_MLP3x_QAT_Int6_SlidingWindow/README.md" },
  { date: "2026-03-20", bpb: 1.1458, author: "Raahil Shah", name: "Int6 MLP3x + SmearGate + BigramHash", pr: null, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-20_Int6_MLP3x_SmearGate_BigramHash_MuonWD_SWA/README.md" },
  { date: "2026-03-20", bpb: 1.1428, author: "thwu1", name: "10L Int5-MLP + BigramHash(10240)", pr: null, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-20_10L_Int5MLP_MuonWD04_SWA50/README.md" },
  { date: "2026-03-20", bpb: 1.1307, author: "unnir", name: "11L Efficient Partial XSA", pr: 198, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-20_11L_EfficientPartialXSA_FA3_SWA120/README.md" },
  { date: "2026-03-20", bpb: 1.1271, author: "jfprincz", name: "11L XSA4 + EMA + Int6 MLP3x", pr: 198, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-20_11L_XSA4_EMA_Int6_MLP3x_WD04_1.1271/README.md" },
  { date: "2026-03-21", bpb: 1.1248, author: "jfprincz", name: "11L Partial RoPE + LN Scale + EMA + XSA4", pr: 287, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-21_11L_XSA4_EMA_PartialRoPE_LateQAT_1.1248/README.md" },
  { date: "2026-03-22", bpb: 1.1228, author: "signalrush", name: "11L EMA + GPTQ-lite + warmdown3500", pr: 374, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-22_11L_EMA_GPTQ-lite_warmdown3500_QAT015_1.1233/README.md" },
  { date: "2026-03-23", bpb: 1.1194, author: "abaybektursun", name: "LeakyReLU\u00b2 + Legal Score-First TTT + Parallel Muon", pr: 549, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-23_LeakyReLU_LegalTTT_ParallelMuon/README.md" },
  { date: "2026-03-24", bpb: 1.157, author: "Ciprian-Florin Ifrim", name: "Ternary Quantization", pr: null, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-24_74M_Ternary_UNet_FP8_10L_8192BPE_YaRN_NeoMuon/README.md" },
  { date: "2026-03-25", bpb: 1.1147, author: "abaybektursun", name: "11L AR Self-Gen GPTQ + XSA", pr: 1019, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-25_ValCalib_GPTQ_XSA_BigramHash3072/README.md" },
  { date: "2026-03-29", bpb: 1.1122, author: "dexhunter", name: "Coprime-Stride Loader + Full GPTQ + XSA-all", pr: 1060, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-29_Loader_FullGPTQ_XSA11_BigramHash2816/README.md" },
  { date: "2026-03-30", bpb: 1.1099, author: "newjordan", name: "Rascal", pr: 1120, url: "https://github.com/openai/parameter-golf/pull/1120" },
  { date: "2026-03-31", bpb: 1.1063, author: "Marko Sisovic", name: "Parallel Residuals + Mini Depth Recurrence", pr: 1204, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-03-31_ParallelResiduals_MiniDepthRecurrence/README.md" },
  { date: "2026-04-01", bpb: 1.0979, author: "Kevin Clark", name: "4096-Vocab + Larger Model + High WD + Simplifications", pr: 1218, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-04-01_Vocab4096_MLPMult4_WD085/README.md" },
  { date: "2026-04-03", bpb: 1.0912, author: "dexhunter", name: "MuonEq-R + Depth Recurrence + WD=0.090 + All-Int6 GPTQ", pr: 1285, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-04-03_MuonEqR_DepthRecurrence_WD090_AllInt6/README.md" },
  { date: "2026-04-04", bpb: 1.0897, author: "aryanbhosale", name: "SP4096 + Depth Recurrence + Parallel Residuals + MuonEq-R", pr: 1334, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-04-04_SP4096_DepthRecurrence_ParallelResid_MuonEqR/README.md" },
  { date: "2026-04-05", bpb: 1.0856, author: "Kevin Clark", name: "SP8192 + GPTQ Embeddings + Depth Recurrence + SDClip", pr: 1394, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-04-05_SP8192_GPTQ-Embeddings_SDClip_Loop45x2/README.md" },
  { date: "2026-04-06", bpb: 1.0835, author: "Robby Sneiderman", name: "SP8192 + Parallel Residuals + Hessian-Aware SDClip", pr: 1412, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-04-06_SP8192_HessianSDClip_ProgressiveRecurrence/README.md" },
  { date: "2026-04-06", bpb: 1.0828, author: "dexhunter", name: "SP8192 + QK-Gain 5 + Legal Score-First TTT", pr: 1413, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-04-06_SP8192_QK5_LegalTTT_1.0828/README.md" },
  { date: "2026-04-08", bpb: 1.0822, author: "aryanbhosale", name: "SP8192 + Parallel Residuals + Score-First TTT", pr: 1477, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-04-08_SP8192_ParallelResid_ScoreFirstTTT/README.md" },
  { date: "2026-04-09", bpb: 1.081, author: "bigbag", name: "SP8192 + 3-Layer Recurrence + Parallel Residuals + Legal TTT", pr: 1493, url: "https://github.com/openai/parameter-golf/blob/main/records/track_10min_16mb/2026-04-09_SP8192_3LayerRecur_ParResid_QK525_LegalTTT/README.md" },
  { date: "2026-04-09", bpb: 1.0798, author: "dexhunter", name: "SP8192 + Muon 0.97 + Legal Score-First TTT", pr: 1514, url: "https://github.com/openai/parameter-golf/pull/1514" },
  { date: "2026-04-11", bpb: 1.0758, author: "msisovic", name: "Improved Parallel Residuals + CUTLASS EVT + Legal TTT", pr: 1529, url: "https://github.com/openai/parameter-golf/pull/1529" },
  { date: "2026-04-11", bpb: 1.0734, author: "samacqua", name: "VarLen Attention + Fused MLP + Doc-Independent Legal TTT", pr: 1530, url: "https://github.com/openai/parameter-golf/pull/1530" },
  { date: "2026-04-13", bpb: 1.0728, author: "romeerp", name: "VarLenAttn + PhasingTTT", pr: 1610, url: "https://github.com/openai/parameter-golf/pull/1610" },
  { date: "2026-04-14", bpb: 1.0719, author: "dexhunter", name: "VarLen Attention + Fused MLP + Multi-Phase Global SGD TTT", pr: 1626, url: "https://github.com/openai/parameter-golf/pull/1626" },
  { date: "2026-04-16", bpb: 1.0714, author: "MarioPaerle", name: "SmearGate + Attention Output Gate + Legal TTT", pr: 1667, url: "https://github.com/openai/parameter-golf/pull/1667" },
  { date: "2026-04-19", bpb: 1.0678, author: "romeerp", name: "CaseOps Tokenizer + Tapered WD + Phased TTT", pr: 1729, url: "https://github.com/openai/parameter-golf/pull/1729" },
  { date: "2026-04-19", bpb: 1.0655, author: "dexhunter", name: "SP8192 + CaseOps + GatedAttn + QuantGate + Loop45 + Phased TTT", pr: 1736, url: "https://github.com/openai/parameter-golf/pull/1736" },
  { date: "2026-04-22", bpb: 1.0645, author: "dexhunter", name: "CaseOps + MLPClip12 + SmearGate/LoRA-TTT", pr: 1769, url: "https://github.com/openai/parameter-golf/pull/1769" },
  { date: "2026-04-23", bpb: 1.0634, author: "nprime06", name: "PR1736 + PolarNS + MIN_LR + SparseAttnGate + FusedCE + Warm-A TTT", pr: 1787, url: "https://github.com/openai/parameter-golf/pull/1787" },
  { date: "2026-04-27", bpb: 1.0614, author: "aquariouseworkman", name: "BOS-Fixed SmearGate + LQER Asymmetric + PR1787 SparseAttn + Phased TTT", pr: 1851, url: "https://github.com/openai/parameter-golf/pull/1851" },
  { date: "2026-04-27", bpb: 1.0611, author: "codemath3000", name: "BOS-Fixed SmearGate + LQER + SparseAttnGate + 9-Hparam Stack", pr: 1855, url: "https://github.com/openai/parameter-golf/pull/1855" },
  { date: "2026-04-29", bpb: 1.0594, author: "alertcat", name: "AWQ-Lite GPTQ + AsymLogit on PR1855 Stack", pr: 1945, url: "https://github.com/openai/parameter-golf/pull/1945" },
  { date: "2026-04-30", bpb: 1.0586, author: "andrewbaggio1", name: "Long-Context No-Q/V TTT + QK-Gain 5.25", pr: 1953, url: "https://github.com/openai/parameter-golf/pull/1953" },
  { date: "2026-04-30", bpb: 1.0576, author: "simonbissonnette", name: "Progressive Context Growth + Short-Doc Score-First TTT", pr: 2014, url: "https://github.com/openai/parameter-golf/pull/2014" },
  { date: "2026-05-01", bpb: 1.0565, author: "codemath3000", name: "Calib32 Token-Only N-gram + AsymLogit Stack", pr: 2135, url: "https://github.com/openai/parameter-golf/pull/2135", afterDeadline: true },
]
