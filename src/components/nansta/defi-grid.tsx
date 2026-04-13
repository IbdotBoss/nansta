import { DeFiAnalysis } from '@/lib/types';
import { shortAddr, chainName, fmtUsd, fmtPct } from '@/lib/format';
import { Badge } from '@/components/ui/badge';

interface DeFiGridProps {
  analysis: DeFiAnalysis[];
}

const PROTO_COLORS = ['#10b981', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

export function DeFiGrid({ analysis }: DeFiGridProps) {
  if (!analysis.length) return null;

  const validWallets = analysis.filter(w => !w.protocols.error);
  const errorWallets = analysis.filter(w => w.protocols.error);

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="5" height="5" rx="1" stroke="#10b981" strokeWidth="1.2" />
            <rect x="9" y="2" width="5" height="5" rx="1" stroke="#10b981" strokeWidth="1.2" />
            <rect x="2" y="9" width="5" height="5" rx="1" stroke="#10b981" strokeWidth="1.2" />
            <rect x="9" y="9" width="5" height="5" rx="1" stroke="#10b981" strokeWidth="1.2" />
          </svg>
          <h2 className="text-lg font-bold tracking-tight">DeFi Deployment Analysis</h2>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase tracking-[0.15em] border-zinc-700/40 text-zinc-500 font-medium">
          {validWallets.length} active
        </Badge>
      </div>

      {/* Valid wallets */}
      {validWallets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {validWallets.map((wallet, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.06] bg-zinc-950/50 backdrop-blur-2xl p-6
                hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-5">
                <code className="text-xs text-zinc-300 font-mono font-medium">
                  {shortAddr(wallet.address)}
                </code>
                <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-500 bg-zinc-900/60 px-2 py-0.5 rounded-lg font-medium">
                  {chainName(wallet.chain)}
                </span>
              </div>

              {/* Protocol count */}
              <div className="mb-4">
                <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-600 font-medium">Protocols</span>
                <div className="text-2xl font-bold text-emerald-400 tabular-nums mt-1">
                  {wallet.protocols.protocol_count}
                </div>
              </div>

              {/* Protocol list */}
              {wallet.protocols.protocols.length > 0 && (
                <div className="space-y-2 mb-4">
                  {wallet.protocols.protocols.slice(0, 5).map((proto, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: PROTO_COLORS[j % PROTO_COLORS.length] }}
                      />
                      <span className="text-zinc-300 font-medium">
                        {typeof proto === 'string' ? proto : (proto as Record<string, string>).name || 'Unknown'}
                      </span>
                    </div>
                  ))}
                  {wallet.protocols.protocols.length > 5 && (
                    <div className="text-[10px] text-zinc-600 pl-4">
                      +{wallet.protocols.protocols.length - 5} more
                    </div>
                  )}
                </div>
              )}

              {/* PnL */}
              {(wallet.pnl_summary.total_pnl !== undefined && wallet.pnl_summary.total_pnl !== 0) && (
                <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs">
                  <span className="text-zinc-500 uppercase tracking-[0.12em] font-medium">PnL</span>
                  <span className={`font-mono font-bold ${wallet.pnl_summary.total_pnl > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {fmtUsd(wallet.pnl_summary.total_pnl)}
                  </span>
                </div>
              )}
              {wallet.pnl_summary.win_rate > 0 && (
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-zinc-500 uppercase tracking-[0.12em] font-medium">Win Rate</span>
                  <span className="font-mono text-zinc-300 tabular-nums font-semibold">{fmtPct(wallet.pnl_summary.win_rate)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error wallets */}
      {errorWallets.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {errorWallets.map((wallet, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.03] bg-zinc-950/30 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <code className="text-xs text-zinc-600 font-mono">
                  {shortAddr(wallet.address)}
                </code>
                <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-700 bg-zinc-900/40 px-2 py-0.5 rounded-lg font-medium">
                  {chainName(wallet.chain)}
                </span>
              </div>
              <div className="text-xs text-zinc-600 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                DeFi data unavailable
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
