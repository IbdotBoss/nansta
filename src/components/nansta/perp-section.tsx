import { PerpSummary } from '@/lib/types';
import { shortAddr, fmtUsd, fmtPct } from '@/lib/format';

interface PerpSectionProps {
  summary: PerpSummary;
}

export function PerpSection({ summary }: PerpSectionProps) {
  const hasData = summary.top_traders.length > 0 || summary.sm_trading.length > 0 || summary.hot_tokens.length > 0;
  if (!hasData) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path d="M2 14L6 6L10 10L14 2" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="text-lg font-bold tracking-tight">Perp Activity</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Traders */}
        {summary.top_traders.length > 0 && (
          <div className="rounded-2xl border border-white/[0.06] bg-zinc-950/50 backdrop-blur-2xl p-6 hover:border-white/[0.1] transition-all duration-300">
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 mb-4 font-medium">Top Traders</h3>
            <div className="space-y-3">
              {summary.top_traders.map((trader, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <code className="text-zinc-300 font-mono text-[11px] font-medium">{shortAddr(trader.address, 6, 4)}</code>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono font-bold tabular-nums ${trader.pnl > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {fmtUsd(trader.pnl)}
                    </span>
                    <span className="text-zinc-600 font-mono tabular-nums">{fmtPct(trader.win_rate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SM Trades */}
        {summary.sm_trading.length > 0 && (
          <div className="rounded-2xl border border-white/[0.06] bg-zinc-950/50 backdrop-blur-2xl p-6 hover:border-white/[0.1] transition-all duration-300">
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 mb-4 font-medium">Smart Money Trades</h3>
            <div className="space-y-3">
              {summary.sm_trading.map((trade, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-200">{trade.token}</span>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-lg font-bold ${
                      trade.side === 'BUY' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                    }`}>
                      {trade.side}
                    </span>
                  </div>
                  <span className="font-mono text-zinc-300 tabular-nums font-semibold">{fmtUsd(trade.size_usd)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hot Tokens */}
        {summary.hot_tokens.length > 0 && (
          <div className="rounded-2xl border border-white/[0.06] bg-zinc-950/50 backdrop-blur-2xl p-6 hover:border-white/[0.1] transition-all duration-300">
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 mb-4 font-medium">Hot Perp Tokens</h3>
            <div className="flex flex-wrap gap-2">
              {summary.hot_tokens.map((token, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-xs font-medium
                    hover:border-white/[0.12] transition-colors duration-200"
                >
                  <span className="text-white font-bold">{token.symbol}</span>
                  <span className="text-zinc-500 font-mono text-[10px] tabular-nums">{fmtUsd(token.volume_24h)}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
