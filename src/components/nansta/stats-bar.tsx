import { NanstaReport } from '@/lib/types';
import { fmtUsd } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';

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
        <Card
          key={stat.label}
          className="bg-zinc-950/80 border-zinc-800/40 backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-200 group"
        >
          <CardContent className="p-5">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5 font-medium">
              {stat.label}
            </div>
            <div className={`text-lg font-semibold font-mono tracking-tight ${
              stat.positive !== undefined
                ? stat.positive ? 'text-emerald-400' : 'text-red-400'
                : 'text-zinc-200'
            }`}>
              {stat.value}
            </div>
            {stat.accent && stat.positive !== undefined && (
              <div className={`mt-2 h-0.5 rounded-full ${stat.positive ? 'bg-emerald-500/30' : 'bg-red-500/30'}`}>
                <div className={`h-full rounded-full w-3/4 ${stat.positive ? 'bg-emerald-500/60' : 'bg-red-500/60'}`} />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
