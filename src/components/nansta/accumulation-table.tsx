import { AccumulationToken } from '@/lib/types';
import { cleanSymbol, fmtUsd, fmtFlow, flowColor, chainName, scoreColor } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AccumulationTableProps {
  tokens: AccumulationToken[];
}

function MiniScoreBar({ score }: { score: number }) {
  const color = score >= 60 ? 'bg-emerald-500' : score >= 30 ? 'bg-amber-500' : 'bg-zinc-600';
  const width = Math.min(score, 100);
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1 w-14 rounded-full bg-zinc-800/60 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${width}%` }} />
      </div>
      <span className={`font-mono text-sm font-bold tabular-nums ${scoreColor(score)}`}>
        {score}
      </span>
    </div>
  );
}

export function AccumulationTable({ tokens }: AccumulationTableProps) {
  if (!tokens.length) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="8" width="3" height="6" rx="0.5" fill="#10b981" opacity="0.6" />
            <rect x="6.5" y="5" width="3" height="9" rx="0.5" fill="#10b981" opacity="0.8" />
            <rect x="11" y="2" width="3" height="12" rx="0.5" fill="#10b981" />
          </svg>
          <h2 className="text-lg font-bold tracking-tight">Accumulation Rankings</h2>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase tracking-[0.15em] border-zinc-700/40 text-zinc-500 font-medium">
          {tokens.length} assets
        </Badge>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-zinc-950/50 backdrop-blur-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.04] hover:bg-transparent">
                <TableHead className="w-10 text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-medium">#</TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-medium">Asset</TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-medium">7D Net Flow</TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-medium hidden md:table-cell">24H Net Flow</TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-medium hidden lg:table-cell">Market Cap</TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-medium hidden lg:table-cell">SM Flow</TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-medium">Conviction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map((token, i) => (
                <TableRow
                  key={`${token.chain}-${token.symbol}-${i}`}
                  className="border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <TableCell className="font-mono text-xs text-zinc-600 tabular-nums font-medium">{i + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{cleanSymbol(token.symbol)}</span>
                      <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-500 bg-zinc-900/60 px-2 py-0.5 rounded-lg font-medium">
                        {chainName(token.chain)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={`text-right font-mono text-sm tabular-nums font-semibold ${flowColor(token.net_flow_7d)}`}>
                    {fmtFlow(token.net_flow_7d)}
                  </TableCell>
                  <TableCell className={`text-right font-mono text-sm tabular-nums hidden md:table-cell font-semibold ${flowColor(token.net_flow_24h)}`}>
                    {fmtFlow(token.net_flow_24h)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-zinc-300 tabular-nums hidden lg:table-cell font-medium">
                    {fmtUsd(token.market_cap)}
                  </TableCell>
                  <TableCell className={`text-right font-mono text-sm tabular-nums hidden lg:table-cell font-semibold ${flowColor(token.flow_intel.sm_net_flow)}`}>
                    {token.flow_intel.sm_net_flow > 0 ? fmtFlow(token.flow_intel.sm_net_flow) : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <MiniScoreBar score={token.conviction_score} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
