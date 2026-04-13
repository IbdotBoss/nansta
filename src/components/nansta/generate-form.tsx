'use client';

import { Button } from '@/components/ui/button';

interface GenerateFormProps {
  chains: { id: string; label: string }[];
  selectedChains: string[];
  onChainsChange: (chains: string[]) => void;
  onGenerate: () => void;
  loading: boolean;
}

export function GenerateForm({ chains, selectedChains, onChainsChange, onGenerate, loading }: GenerateFormProps) {
  const toggleChain = (id: string) => {
    if (selectedChains.includes(id)) {
      if (selectedChains.length > 1) {
        onChainsChange(selectedChains.filter(c => c !== id));
      }
    } else {
      onChainsChange([...selectedChains, id]);
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-zinc-950/50 backdrop-blur-2xl p-8
      shadow-[0_0_80px_-20px_rgba(16,185,129,0.08)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Generate Report</h2>
          <p className="text-sm text-zinc-500 mt-1">Select chains to analyze</p>
        </div>
        <span className="text-xs text-zinc-500 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800/40 font-medium">
          {selectedChains.length} selected
        </span>
      </div>

      {/* Chain selector pills */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        {chains.map(chain => {
          const selected = selectedChains.includes(chain.id);
          return (
            <button
              key={chain.id}
              onClick={() => toggleChain(chain.id)}
              className={`
                px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${selected
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_-8px_rgba(16,185,129,0.3)]'
                  : 'bg-zinc-900/40 text-zinc-400 border border-white/[0.06] hover:border-white/[0.12] hover:text-zinc-200 hover:bg-zinc-800/60'
                }
              `}
            >
              {chain.label}
            </button>
          );
        })}
      </div>

      {/* Generate button */}
      <Button
        onClick={onGenerate}
        disabled={loading || selectedChains.length === 0}
        className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl
          transition-all duration-200 text-sm tracking-wide
          shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)]
          hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.5)]
          active:scale-[0.98]
          disabled:opacity-40 disabled:shadow-none"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            Analyzing chains…
          </span>
        ) : (
          'Generate Report'
        )}
      </Button>
    </div>
  );
}
