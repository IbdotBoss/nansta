'use client';

import { useState, useCallback, useEffect } from 'react';
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

const HERO_HEADLINE = 'Alpha is on-chain.';
const HERO_SUB = 'We read it.';

function AnimatedHeadline({ text, className }: { text: string; className?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.4s ease ${i * 40}ms, transform 0.4s ease ${i * 40}ms`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300 + delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s ease, transform 0.6s ease`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mt-10 space-y-8 animate-in fade-in duration-500">
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-zinc-800/30 bg-zinc-950/60 backdrop-blur-xl p-6">
            <Skeleton className="h-3 w-16 mb-3" />
            <Skeleton className="h-7 w-24" />
          </div>
        ))}
      </div>

      {/* Top signals skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-28 mb-5" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-zinc-800/30 bg-zinc-950/60 backdrop-blur-xl p-5">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-8 w-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div>
        <Skeleton className="h-5 w-44 mb-5" />
        <div className="rounded-2xl border border-zinc-800/30 bg-zinc-950/60 backdrop-blur-xl p-6 space-y-3">
          <Skeleton className="h-4 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div>
        <Skeleton className="h-5 w-48 mb-5" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-zinc-800/30 bg-zinc-950/60 backdrop-blur-xl p-6 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-7 w-12" />
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
  const [hasGenerated, setHasGenerated] = useState(false);

  const generate = useCallback(async () => {
    setLoading(true);
    setError('');
    setReport(null);
    setHasGenerated(true);
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

  const showHero = !hasGenerated && !loading;

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
        <header className="border-b border-white/[0.06] backdrop-blur-xl bg-black/70 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 12L8 4L13 12H3Z" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight">
                nansta<span className="text-emerald-400">.</span>
              </span>
            </div>
            {report && (
              <div className="hidden sm:flex items-center gap-4 text-xs text-zinc-500">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800/40 font-medium">Week {report.week}</span>
                <span>{report.api_calls_made} API calls</span>
                <span>{report.chains_analyzed.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}</span>
              </div>
            )}
          </div>
        </header>

        {/* Hero section — only before first generation */}
        {showHero && (
          <section className="max-w-6xl mx-auto px-6 pt-20 pb-12">
            <div className="max-w-3xl">
              <FadeIn delay={0}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Smart money tracker
                </div>
              </FadeIn>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] mb-4">
                <AnimatedHeadline text={HERO_HEADLINE} className="text-white" />
                <br />
                <FadeIn delay={HERO_HEADLINE.length * 40 + 100}>
                  <span className="text-emerald-400">{HERO_SUB}</span>
                </FadeIn>
              </h1>

              <FadeIn delay={HERO_HEADLINE.length * 40 + 300}>
                <p className="text-lg text-zinc-400 max-w-xl leading-relaxed mb-10">
                  See where the sharpest wallets deploy capital across DeFi — lending, LP positions, staking, farming. Updated weekly across 6 chains.
                </p>
              </FadeIn>

              <FadeIn delay={HERO_HEADLINE.length * 40 + 500}>
                <div className="flex items-center gap-6 text-sm text-zinc-500">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-emerald-500/60">
                      <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Accumulation signals
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-emerald-500/60">
                      <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    DeFi deployment map
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-emerald-500/60">
                      <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Perp activity
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>
        )}

        <main className={`max-w-6xl mx-auto px-6 ${showHero ? 'pb-16' : 'py-10'}`}>
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
            <div className="mt-6 p-5 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 5v3M8 10v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                {error}
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && <LoadingSkeleton />}

          {/* Report */}
          {report && !loading && (
            <div className="mt-10 space-y-12 animate-in fade-in duration-500">
              <StatsBar report={report} />

              <div className="border-t border-white/[0.04] pt-10">
                <TopSignals signals={report.top_signals} />
              </div>

              <div className="border-t border-white/[0.04] pt-10">
                <AccumulationTable tokens={report.accumulation_rankings} />
              </div>

              <div className="border-t border-white/[0.04] pt-10">
                <DeFiGrid analysis={report.defi_analysis} />
              </div>

              <div className="border-t border-white/[0.04] pt-10">
                <PerpSection summary={report.perp_summary} />
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.04] mt-20">
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between text-xs text-zinc-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-500">nansta<span className="text-emerald-500/60">.</span></span>
              <span>Powered by Nansen API</span>
            </div>
            <a href="https://github.com/IbdotBoss/nansta" className="hover:text-zinc-400 transition-colors duration-200 font-medium">GitHub</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
