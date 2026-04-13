import { NanstaReport } from '@/lib/types';
import { fmtUsd } from '@/lib/format';
import SpotlightCard from './spotlight-card';
import CountUp from './count-up';

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
    { label: '7D Net Flow', value: totalFlow7d, prefix: '$', positive: totalFlow7d >= 0 },
    { label: '24H Net Flow', value: totalFlow24h, prefix: '$', positive: totalFlow24h >= 0 },
    { label: 'Active Tokens', value: activeTokens, positive: undefined as boolean | undefined },
    { label: 'Avg Conviction', value: avgScore, suffix: '/100', positive: undefined },
    { label: 'DeFi Wallets', value: defiWallets, positive: undefined },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map(stat => (
        <SpotlightCard key={stat.label} className="p-5">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-medium">
            {stat.label}
          </div>
          <div className={`text-xl font-bold font-mono tracking-tight tabular-nums ${
            stat.positive !== undefined
              ? stat.positive ? 'text-emerald-400' : 'text-red-400'
              : 'text-zinc-100'
          }`}>
            <CountUp
              to={Math.abs(stat.value)}
              duration={1.5}
              delay={0.2}
              prefix={stat.prefix || ''}
              suffix={stat.suffix || ''}
              className="inline"
            />
          </div>
          {stat.positive !== undefined && (
            <div className={`mt-3 h-0.5 rounded-full ${stat.positive ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              <div className={`h-full rounded-full w-3/4 transition-all duration-1000 ${stat.positive ? 'bg-emerald-500/50' : 'bg-red-500/50'}`} />
            </div>
          )}
        </SpotlightCard>
      ))}
    </div>
  );
}
