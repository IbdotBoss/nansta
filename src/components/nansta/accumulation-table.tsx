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
    <div className="flex items-center gap-2">
      <div className="h-1 w-12 rounded-full bg-zinc-800/60 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
      <span className={`font-mono text-sm font-semibold tabular-nums ${scoreColor(score)}`}>
        {score}
      </span>
    </div>
  );
}

export function AccumulationTable({ tokens }: AccumulationTableProps) {
  if (!tokens.length) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="8" width="3" height="6" rx="0.5" fill="#10b981" opacity="0.6" />
            <rect x="6.5" y="5" width="3" height="9" rx="0.5" fill="#10b981" opacity="0.8" />
            <rect x="11" y="2" width="3" height="12" rx="0.5" fill="#10b981" />
          </svg>
          <h2 className="text-base font-semibold tracking-tight">Accumulation Rankings</h2>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-zinc-700/60 text-zinc-500">
          {tokens.length} assets
        </Badge>
      </div>

      <div className="rounded-xl border border-zinc-800/40 bg-zinc-950/80 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800/40 hover:bg-transparent">
                <TableHead className="w-10 text-[10px] uppercase tracking-widest text-zinc-500 font-medium">#</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Asset</TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-widest text-zinc-500 font-medium">7D Net Flow</TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-widest text-zinc-500 font-medium hidden md:table-cell">24H Net Flow</TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-widest text-zinc-500 font-medium hidden lg:table-cell">Market Cap</TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-widest text-zinc-500 font-medium hidden lg:table-cell">SM Flow</TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Conviction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map((token, i) => (
                <TableRow
                  key={`${token.chain}-${token.symbol}-${i}`}
                  className="border-zinc-800/30 hover:bg-zinc-900/40 transition-colors duration-150"
                >
                  <TableCell className="font-mono text-xs text-zinc-600 tabular-nums">{i + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-zinc-200">{cleanSymbol(token.symbol)}</span>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-600 bg-zinc-900/80 px-2 py-0.5 rounded-lg">
                        {chainName(token.chain)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={`text-right font-mono text-sm tabular-nums ${flowColor(token.net_flow_7d)}`}>
                    {fmtFlow(token.net_flow_7d)}
                  </TableCell>
                  <TableCell className={`text-right font-mono text-sm tabular-nums hidden md:table-cell ${flowColor(token.net_flow_24h)}`}>
                    {fmtFlow(token.net_flow_24h)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-zinc-400 tabular-nums hidden lg:table-cell">
                    {fmtUsd(token.market_cap)}
                  </TableCell>
                  <TableCell className={`text-right font-mono text-sm tabular-nums hidden lg:table-cell ${flowColor(token.flow_intel.sm_net_flow)}`}>
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
