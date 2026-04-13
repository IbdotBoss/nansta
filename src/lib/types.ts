// nansta report types — matches backend API response

export interface FlowIntel {
  sm_net_flow: number;
  whale_net_flow: number;
  exchange_net_flow: number;
  fresh_wallet_net_flow: number;
  sm_wallet_count: number;
  whale_wallet_count: number;
}

export interface TopBuyer {
  address: string;
  label: string;
  bought_usd: number;
}

export interface AccumulationToken {
  chain: string;
  symbol: string;
  address: string;
  net_flow_7d: number;
  net_flow_24h: number;
  market_cap: number;
  conviction_score: number;
  flow_intel: FlowIntel;
  top_buyers: TopBuyer[];
}

export interface DeFiProtocols {
  protocol_count: number;
  protocols: string[];
  positions: Record<string, Record<string, number>>;
  error?: string;
}

export interface PnLSummary {
  total_pnl: number;
  win_rate: number;
  trade_count: number;
}

export interface DeFiAnalysis {
  address: string;
  chain: string;
  protocols: DeFiProtocols;
  pnl_summary: PnLSummary;
}

export interface TopTrader {
  address: string;
  pnl: number;
  win_rate: number;
}

export interface SMTrade {
  token: string;
  side: string;
  size_usd: number;
}

export interface HotToken {
  symbol: string;
  volume_24h: number;
  open_interest: number;
}

export interface PerpSummary {
  top_traders: TopTrader[];
  sm_trading: SMTrade[];
  hot_tokens: HotToken[];
}

export interface NanstaReport {
  generated_at: string;
  week: string;
  chains_analyzed: string[];
  api_calls_made: number;
  accumulation_rankings: AccumulationToken[];
  defi_analysis: DeFiAnalysis[];
  perp_summary: PerpSummary;
  top_signals: AccumulationToken[];
}

export interface GenerateRequest {
  chains: string[];
  format?: 'json' | 'md' | 'html';
}
