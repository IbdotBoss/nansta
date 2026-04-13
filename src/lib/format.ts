/**
 * Formatting utilities for nansta reports.
 * Handles currency, percentages, and symbol cleaning.
 */

/** Strip emoji and junk from token symbols */
export function cleanSymbol(symbol: string): string {
  return symbol
    .replace(/[^\w\s\-\.$]/g, '') // remove emoji/special chars
    .replace(/\s+/g, ' ')
    .trim();
}

/** Format USD values with smart suffixes */
export function fmtUsd(val: number): string {
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  if (abs >= 1) return `${sign}$${abs.toFixed(0)}`;
  if (abs > 0) return `${sign}$${abs.toFixed(2)}`;
  return '$0';
}

/** Format percentage */
export function fmtPct(val: number): string {
  return `${val.toFixed(1)}%`;
}

/** Shorten address for display */
export function shortAddr(addr: string, start = 8, end = 4): string {
  if (addr.length <= start + end + 3) return addr;
  return `${addr.slice(0, start)}…${addr.slice(-end)}`;
}

/** Format flow with color class */
export function flowColor(val: number): string {
  if (val > 0) return 'text-emerald-400';
  if (val < 0) return 'text-red-400';
  return 'text-zinc-500';
}

/** Format flow with sign */
export function fmtFlow(val: number): string {
  if (val === 0) return '$0';
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${fmtUsd(val)}`;
}

/** Conviction score color */
export function scoreColor(score: number): string {
  if (score >= 60) return 'text-emerald-400';
  if (score >= 30) return 'text-amber-400';
  return 'text-zinc-500';
}

/** Conviction badge variant */
export function scoreBadge(score: number): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  if (score >= 80) return { label: 'High Conviction', variant: 'default' };
  if (score >= 60) return { label: 'Strong', variant: 'default' };
  if (score >= 30) return { label: 'Watchlist', variant: 'secondary' };
  if (score > 0) return { label: 'Weak', variant: 'outline' };
  return { label: 'No Signal', variant: 'outline' };
}

/** Time ago string */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/** Chain display name */
export function chainName(chain: string): string {
  const names: Record<string, string> = {
    ethereum: 'Ethereum',
    solana: 'Solana',
    base: 'Base',
    arbitrum: 'Arbitrum',
    optimism: 'Optimism',
    polygon: 'Polygon',
    avalanche: 'Avalanche',
    bnb: 'BNB Chain',
  };
  return names[chain] || chain.charAt(0).toUpperCase() + chain.slice(1);
}
