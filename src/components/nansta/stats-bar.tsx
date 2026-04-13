import { NanstaReport } from '@/lib/types';
import { fmtUsd } from '@/lib/format';

interface StatsBarProps {
  report: NanstaReport;
}

export function StatsBar({ report }: StatsBarProps) {
  const totalFlow7d = report.accumulation_rankings.reduce((sum, t) => sum + t.net_flow_7d, 0);
  const totalFlow24h = report.accumulation_rankings.reduce((sum, t) => sum + t.net_flow_24h, 0);
  const activeTokens = report.accumulation_rankings.filter(t => t.net_flow_7d > 0).length;
  const avgScore = report.accumulation_rankings.length
    ? Math.round(report.accumulation_rankings.reduce((sum, t) => sum + t.conviction_score, 0) / report.accumulation_rankings.length)
    : 0;
  const defiWallets = report.defi_analysis.filter(d => !d.protocols.error).length;

  const stats = [
    { label: '7D Net Flow', value: fmtUsd(totalFlow7d), positive: totalFlow7d >= 0, accent: totalFlow7d >= 0 },
    { label: '24H Net Flow', value: fmtUsd(totalFlow24h), positive: totalFlow24h >= 0, accent: false },
    { label: 'Active Tokens', value: String(activeTokens), accent: false },
    { label: 'Avg Conviction', value: `${avgScore}/100`, accent: false },
    { label: 'DeFi Wallets', value: String(defiWallets), accent: false },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map(stat => (
        <div
          key={stat.label}
          className="rounded-2xl border border-white/[0.06] bg-zinc-950/50 backdrop-blur-2xl p-6
            hover:border-white/[0.1] transition-all duration-300 group"
        >
          <div className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 mb-3 font-medium">
            {stat.label}
          </div>
          <div className={`text-2xl font-bold font-mono tracking-tight ${
            stat.positive !== undefined
              ? stat.positive ? 'text-emerald-400' : 'text-red-400'
              : 'text-white'
          }`}>
            {stat.value}
          </div>
          {stat.accent && stat.positive !== undefined && (
            <div className="mt-3 h-0.5 rounded-full bg-zinc-800/60 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  stat.positive ? 'bg-emerald-500/60' : 'bg-red-500/60'
                }`}
                style={{ width: '75%' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
