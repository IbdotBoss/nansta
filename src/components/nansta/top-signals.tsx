import { AccumulationToken } from '@/lib/types';
import { cleanSymbol, fmtUsd, fmtFlow, flowColor, chainName, scoreColor } from '@/lib/format';
import { Badge } from '@/components/ui/badge';

interface TopSignalsProps {
  signals: AccumulationToken[];
}

function ConvictionBar({ score }: { score: number }) {
  const width = Math.min(score, 100);
  const color = score >= 60 ? 'bg-emerald-500' : score >= 30 ? 'bg-amber-500' : 'bg-zinc-600';
  const bg = score >= 60 ? 'bg-emerald-500/10' : score >= 30 ? 'bg-amber-500/10' : 'bg-zinc-600/10';

  return (
    <div className={`h-1 rounded-full ${bg} w-full overflow-hidden`}>
      <div
        className={`h-full rounded-full ${color} transition-all duration-700`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function TopSignals({ signals }: TopSignalsProps) {
  if (!signals.length) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path d="M3 12L8 4L13 12H3Z" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <h2 className="text-lg font-bold tracking-tight">Top Signals</h2>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase tracking-[0.15em] border-zinc-700/40 text-zinc-500 font-medium">
          Highest Conviction
        </Badge>
      </div>

      <div className="space-y-3">
        {signals.map((token, i) => (
          <div
            key={`${token.chain}-${token.symbol}-${i}`}
            className="grid grid-cols-[auto_1fr_auto] gap-4 sm:gap-5 items-center rounded-2xl border border-white/[0.06] bg-zinc-950/50 backdrop-blur-2xl p-5 sm:p-6
              hover:border-white/[0.1] hover:bg-zinc-900/30 transition-all duration-300 group"
          >
            {/* Rank */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              i === 0 ? 'bg-emerald-500/15 border border-emerald-500/25' : 'bg-zinc-900/60 border border-zinc-800/40'
            }`}>
              <span className={`text-sm font-bold font-mono ${i === 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {i + 1}
              </span>
            </div>

            {/* Info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="font-bold text-base text-white">{cleanSymbol(token.symbol)}</span>
                <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-500 bg-zinc-900/60 px-2 py-0.5 rounded-lg font-medium">
                  {chainName(token.chain)}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
                <div>
                  <span className="text-zinc-600 uppercase tracking-wider text-[10px]">7d </span>
                  <span className={`font-mono font-semibold ${flowColor(token.net_flow_7d)}`}>
                    {fmtFlow(token.net_flow_7d)}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-600 uppercase tracking-wider text-[10px]">24h </span>
                  <span className={`font-mono font-semibold ${flowColor(token.net_flow_24h)}`}>
                    {fmtFlow(token.net_flow_24h)}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-600 uppercase tracking-wider text-[10px]">mcap </span>
                  <span className="font-mono text-zinc-300 font-medium">{fmtUsd(token.market_cap)}</span>
                </div>
                {token.flow_intel.sm_net_flow > 0 && (
                  <div>
                    <span className="text-zinc-600 uppercase tracking-wider text-[10px]">sm </span>
                    <span className="font-mono text-emerald-400 font-semibold">{fmtFlow(token.flow_intel.sm_net_flow)}</span>
                  </div>
                )}
              </div>

              {/* Conviction bar */}
              <div className="mt-3 max-w-[200px]">
                <ConvictionBar score={token.conviction_score} />
              </div>
            </div>

            {/* Score */}
            <div className="text-right flex-shrink-0">
              <div className={`text-2xl font-bold font-mono ${scoreColor(token.conviction_score)}`}>
                {token.conviction_score}
              </div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-zinc-600 mt-0.5">conviction</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
