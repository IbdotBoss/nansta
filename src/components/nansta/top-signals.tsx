import { AccumulationToken } from '@/lib/types';
import { cleanSymbol, fmtUsd, fmtFlow, flowColor, chainName, scoreColor } from '@/lib/format';
import { Badge } from '@/components/ui/badge';

interface TopSignalsProps {
  signals: AccumulationToken[];
}

function ConvictionBar({ score }: { score: number }) {
  const width = Math.min(score, 100);
  const color = score >= 60 ? 'bg-emerald-500' : score >= 30 ? 'bg-amber-500' : 'bg-zinc-600';
  const bg = score >= 60 ? 'bg-emerald-500/15' : score >= 30 ? 'bg-amber-500/15' : 'bg-zinc-600/15';

  return (
    <div className={`h-1 rounded-full ${bg} w-full`}>
      <div
        className={`h-full rounded-full ${color} transition-all duration-500`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function TopSignals({ signals }: TopSignalsProps) {
  if (!signals.length) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M3 12L8 4L13 12H3Z" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <h2 className="text-base font-semibold tracking-tight">Top Signals</h2>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-zinc-700/60 text-zinc-500">
          Highest Conviction
        </Badge>
      </div>

      <div className="space-y-2">
        {signals.map((token, i) => (
          <div
            key={`${token.chain}-${token.symbol}-${i}`}
            className="grid grid-cols-[auto_1fr_auto] gap-3 sm:gap-4 items-center rounded-xl border border-zinc-800/40 bg-zinc-950/80 backdrop-blur-sm p-3 sm:p-4 hover:border-zinc-700/50 hover:bg-zinc-900/40 transition-all duration-200 group"
          >
            {/* Rank */}
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
              i === 0 ? 'bg-emerald-500/15 border border-emerald-500/20' : 'bg-zinc-900/80'
            }`}>
              <span className={`text-sm font-bold font-mono ${i === 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {i + 1}
              </span>
            </div>

            {/* Info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-zinc-200">{cleanSymbol(token.symbol)}</span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded-lg">
                  {chainName(token.chain)}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                <div>
                  <span className="text-zinc-600 uppercase tracking-wider">7d </span>
                  <span className={`font-mono font-medium ${flowColor(token.net_flow_7d)}`}>
                    {fmtFlow(token.net_flow_7d)}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-600 uppercase tracking-wider">24h </span>
                  <span className={`font-mono font-medium ${flowColor(token.net_flow_24h)}`}>
                    {fmtFlow(token.net_flow_24h)}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-600 uppercase tracking-wider">mcap </span>
                  <span className="font-mono text-zinc-400">{fmtUsd(token.market_cap)}</span>
                </div>
                {token.flow_intel.sm_net_flow > 0 && (
                  <div>
                    <span className="text-zinc-600 uppercase tracking-wider">sm </span>
                    <span className="font-mono text-emerald-400">{fmtFlow(token.flow_intel.sm_net_flow)}</span>
                  </div>
                )}
              </div>

              {/* Conviction bar */}
              <div className="mt-2 max-w-[200px]">
                <ConvictionBar score={token.conviction_score} />
              </div>
            </div>

            {/* Score */}
            <div className="text-right flex-shrink-0">
              <div className={`text-xl font-bold font-mono ${scoreColor(token.conviction_score)}`}>
                {token.conviction_score}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-600">conviction</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
