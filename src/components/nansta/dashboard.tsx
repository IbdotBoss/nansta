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
import DecryptedText from './decrypted-text';
import ElectricBorder from './electric-border';

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
    <div className="mt-12 space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-800/40 bg-zinc-950/80 p-5">
            <Skeleton className="h-3 w-16 mb-3" />
            <Skeleton className="h-7 w-24" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-32 mb-5" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-800/40 bg-zinc-950/80 p-5">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-8 w-12" />
            </div>
          </div>
        ))}
      </div>
      <div>
        <Skeleton className="h-6 w-48 mb-5" />
        <div className="rounded-xl border border-zinc-800/40 bg-zinc-950/80 p-5 space-y-3">
          <Skeleton className="h-4 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
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

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          {/* Hero — only show before report is generated */}
          {!report && !loading && (
            <div className="mb-16 text-center">
              <div className="mb-6">
                <DecryptedText
                  text="They move before you see it."
                  animateOn="view"
                  sequential
                  revealDirection="start"
                  speed={40}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-100"
                  encryptedClassName="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-emerald-500/30"
                  parentClassName="block"
                />
              </div>
              <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed mb-2">
                Smart money deploys capital before retail catches on.
              </p>
              <p className="text-zinc-500 text-base max-w-lg mx-auto">
                See where conviction is building — across lending, LP, staking, and farming.
              </p>
            </div>
          )}

          {/* Generate Form with Electric Border */}
          <ElectricBorder color="#10b981" speed={0.8} chaos={0.08} borderRadius={20}>
            <GenerateForm
              chains={CHAINS}
              selectedChains={selectedChains}
              onChainsChange={setSelectedChains}
              onGenerate={generate}
              loading={loading}
            />
          </ElectricBorder>

          {/* Error */}
          {error && (
            <div className="mt-8 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
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
            <div className="mt-12 space-y-12 animate-in fade-in duration-500">
              <StatsBar report={report} />

              <div className="border-t border-zinc-800/30 pt-10">
                <TopSignals signals={report.top_signals} />
              </div>

              <div className="border-t border-zinc-800/30 pt-10">
                <AccumulationTable tokens={report.accumulation_rankings} />
              </div>

              <div className="border-t border-zinc-800/30 pt-10">
                <DeFiGrid analysis={report.defi_analysis} />
              </div>

              <div className="border-t border-zinc-800/30 pt-10">
                <PerpSection summary={report.perp_summary} />
              </div>
            </div>
          )}

          {/* Empty state (when no report and not loading, but hero is shown above) */}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800/30 mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between text-xs text-zinc-600">
            <span>Powered by Nansen API</span>
            <a href="https://github.com/IbdotBoss/nansta" className="hover:text-zinc-400 transition-colors duration-200">GitHub</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
