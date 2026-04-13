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
      if (selectedChains.length > 1) onChainsChange(selectedChains.filter(c => c !== id));
    } else {
      onChainsChange([...selectedChains, id]);
    }
  };

  return (
    <div className="bg-zinc-950/90 backdrop-blur-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">Generate Report</h2>
          <p className="text-sm text-zinc-500 mt-1">Select chains to analyze</p>
        </div>
        <span className="text-xs text-zinc-500 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800/40 font-mono tabular-nums">
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
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/5'
                  : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800/60 hover:border-zinc-700/60 hover:text-zinc-300 hover:bg-zinc-800/60'
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
        className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-black font-semibold rounded-xl text-base transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Analyzing…
          </span>
        ) : (
          'Generate Report'
        )}
      </Button>
    </div>
  );
}
