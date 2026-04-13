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
    <div className="rounded-2xl border border-zinc-800/40 bg-zinc-950/80 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-zinc-200 tracking-tight">Generate Report</h2>
          <p className="text-xs text-zinc-500 mt-1">Select chains to analyze</p>
        </div>
        <span className="text-[10px] text-zinc-600 bg-zinc-900/80 px-2 py-1 rounded-md border border-zinc-800/40">
          {selectedChains.length} selected
        </span>
      </div>

      {/* Chain selector pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {chains.map(chain => {
          const selected = selectedChains.includes(chain.id);
          return (
            <button
              key={chain.id}
              onClick={() => toggleChain(chain.id)}
              className={`
                px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200
                ${selected
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/5'
                  : 'bg-zinc-900/60 text-zinc-500 border border-zinc-800/60 hover:border-zinc-700/60 hover:text-zinc-400 hover:bg-zinc-800/60'
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
        className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 text-black font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Analyzing…
          </span>
        ) : (
          'Generate Report'
        )}
      </Button>
    </div>
  );
}
