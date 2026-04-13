import { PerpSummary } from '@/lib/types';
import { shortAddr, fmtUsd, fmtPct } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';

interface PerpSectionProps {
  summary: PerpSummary;
}

export function PerpSection({ summary }: PerpSectionProps) {
  const hasData = summary.top_traders.length > 0 || summary.sm_trading.length > 0 || summary.hot_tokens.length > 0;
  if (!hasData) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M2 14L6 6L10 10L14 2" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="text-base font-semibold tracking-tight">Perp Activity</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Traders */}
        {summary.top_traders.length > 0 && (
          <Card className="bg-zinc-950/80 border-zinc-800/40 backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-200">
            <CardContent className="p-5">
              <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 font-medium">Top Traders</h3>
              <div className="space-y-2.5">
                {summary.top_traders.map((trader, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <code className="text-zinc-400 font-mono text-[11px]">{shortAddr(trader.address, 6, 4)}</code>
                    <div className="flex items-center gap-3">
                      <span className={`font-mono font-medium tabular-nums ${trader.pnl > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {fmtUsd(trader.pnl)}
                      </span>
                      <span className="text-zinc-600 font-mono tabular-nums">{fmtPct(trader.win_rate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* SM Trades */}
        {summary.sm_trading.length > 0 && (
          <Card className="bg-zinc-950/80 border-zinc-800/40 backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-200">
            <CardContent className="p-5">
              <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 font-medium">Smart Money Trades</h3>
              <div className="space-y-2.5">
                {summary.sm_trading.map((trade, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-zinc-300">{trade.token}</span>
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-lg font-medium ${
                        trade.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {trade.side}
                      </span>
                    </div>
                    <span className="font-mono text-zinc-400 tabular-nums">{fmtUsd(trade.size_usd)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hot Tokens */}
        {summary.hot_tokens.length > 0 && (
          <Card className="bg-zinc-950/80 border-zinc-800/40 backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-200">
            <CardContent className="p-5">
              <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 font-medium">Hot Perp Tokens</h3>
              <div className="flex flex-wrap gap-2">
                {summary.hot_tokens.map((token, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/60 text-xs font-medium hover:border-zinc-700/60 transition-colors duration-200"
                  >
                    <span className="text-zinc-200">{token.symbol}</span>
                    <span className="text-zinc-600 font-mono text-[10px] tabular-nums">{fmtUsd(token.volume_24h)}</span>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
