'use client';

import { useState, useCallback } from 'react';
import { NanstaReport } from '@/lib/types';
import { GenerateForm } from './generate-form';
import { StatsBar } from './stats-bar';
import { TopSignals } from './top-signals';
import { AccumulationTable } from './accumulation-table';
import { DeFiGrid } from './defi-grid';
import { PerpSection } from './perp-section';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const FaultyTerminal = dynamic(() => import('./faulty-terminal'), { ssr: false });

const CHAINS = [
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'solana', label: 'Solana' },
  { id: 'base', label: 'Base' },
  { id: 'arbitrum', label: 'Arbitrum' },
  { id: 'avalanche', label: 'Avalanche' },
  { id: 'bnb', label: 'BNB Chain' },
];

function LoadingSkeleton() {
  return (
    <div className="mt-8 space-y-8 animate-in fade-in duration-500">
      {/* Stats skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-800/40 bg-zinc-950/80 p-5">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>

      {/* Top signals skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-28 mb-4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-800/40 bg-zinc-950/80 p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-9 h-9 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-8 w-10" />
            </div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div>
        <Skeleton className="h-5 w-44 mb-4" />
          <div className="rounded-xl border border-zinc-800/40 bg-zinc-950/80 p-5 space-y-3">
          <Skeleton className="h-4 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div>
        <Skeleton className="h-5 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-800/40 bg-zinc-950/80 p-5 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-6 w-10" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [report, setReport] = useState<NanstaReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedChains, setSelectedChains] = useState<string[]>(['ethereum', 'solana', 'base']);

  const generate = useCallback(async () => {
    setLoading(true);
    setError('');
    setReport(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chains: selectedChains, format: 'json' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
    setLoading(false);
  }, [selectedChains]);

  return (
    <div className="min-h-[100dvh] bg-black text-zinc-100 relative">
      {/* Animated background */}
      <FaultyTerminal
        scale={1.5}
        gridMul={[2, 1]}
        digitSize={1.5}
        scanlineIntensity={0.25}
        glitchAmount={0.8}
        flickerAmount={0.2}
        noiseAmp={0.4}
        dither={0.5}
        brightness={0.22}
        tint="#10b981"
      />

      {/* Content overlay */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-zinc-800/40 backdrop-blur-sm bg-black/60 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 12L8 4L13 12H3Z" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight">
                nansta<span className="text-emerald-400">.</span>
              </span>
            </div>
            {report && (
              <div className="hidden sm:flex items-center gap-4 text-xs text-zinc-500">
                <span className="px-2 py-1 rounded-md bg-zinc-900/80 border border-zinc-800/40">Week {report.week}</span>
                <span>{report.api_calls_made} API calls</span>
                <span>{report.chains_analyzed.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}</span>
              </div>
            )}
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Generate Form */}
          <GenerateForm
            chains={CHAINS}
            selectedChains={selectedChains}
            onChainsChange={setSelectedChains}
            onGenerate={generate}
            loading={loading}
          />

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 5v3M8 10v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && <LoadingSkeleton />}

          {/* Report */}
          {report && !loading && (
            <div className="mt-8 space-y-10 animate-in fade-in duration-500">
              <StatsBar report={report} />

              <div className="border-t border-zinc-800/30 pt-8">
                <TopSignals signals={report.top_signals} />
              </div>

              <div className="border-t border-zinc-800/30 pt-8">
                <AccumulationTable tokens={report.accumulation_rankings} />
              </div>

              <div className="border-t border-zinc-800/30 pt-8">
                <DeFiGrid analysis={report.defi_analysis} />
              </div>

              <div className="border-t border-zinc-800/30 pt-8">
                <PerpSection summary={report.perp_summary} />
              </div>
            </div>
          )}

          {/* Empty state */}
          {!report && !loading && !error && (
            <div className="mt-24 text-center animate-in fade-in duration-700">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-zinc-900/60 border border-zinc-800/40 mb-6 backdrop-blur-sm">
                <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
                  <path d="M3 12L8 4L13 12H3Z" stroke="#52525b" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-zinc-200 mb-2">Smart Money Intelligence</h2>
              <p className="text-zinc-500 max-w-md mx-auto text-sm leading-relaxed">
                Select chains and generate a report to see where smart money is deploying capital in DeFi — lending, LP, staking, farming.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                Powered by Nansen API
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800/30 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs text-zinc-600">
            <span>Powered by Nansen API</span>
            <a href="https://github.com" className="hover:text-zinc-400 transition-colors duration-200">GitHub</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
