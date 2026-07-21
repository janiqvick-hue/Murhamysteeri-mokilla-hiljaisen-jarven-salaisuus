import { X, Sparkles, FolderPlus, Compass, Info } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  toast: {
    message: string;
    type: 'clue' | 'phase' | 'contradiction' | 'info';
  };
  onClose: () => void;
}

export function ToastContainer({ toast, onClose }: ToastProps) {
  useEffect(() => {
    // Auto-close after 4.5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'clue':
        return <FolderPlus className="w-5 h-5 text-emerald-500 animate-bounce" />;
      case 'phase':
        return <Compass className="w-5 h-5 text-sky-500 animate-spin" />;
      case 'contradiction':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-zinc-300" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'clue':
        return 'border-emerald-700 bg-emerald-950/90 text-emerald-200';
      case 'phase':
        return 'border-sky-700 bg-sky-950/90 text-sky-200';
      case 'contradiction':
        return 'border-amber-700 bg-amber-950/90 text-amber-200';
      default:
        return 'border-zinc-800 bg-zinc-900/95 text-zinc-200';
    }
  };

  const getTypeLabel = () => {
    switch (toast.type) {
      case 'clue':
        return 'JOHTOLANKA LÖYDETTY';
      case 'phase':
        return 'TUTKINNAN EDISTYMINEN';
      case 'contradiction':
        return 'SUURI RISTIRIITA RATKAISTU';
      default:
        return 'HUOMAUTUS';
    }
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-sm w-full p-4 border rounded-lg shadow-2xl backdrop-blur-md flex items-start gap-3 animate-slide-in select-none ${getBorderColor()}`}
      style={{ animationDuration: '0.35s' }}
    >
      <div className="shrink-0 pt-0.5">
        {getIcon()}
      </div>

      <div className="flex-1 space-y-1">
        <span className="text-[10px] font-mono font-bold tracking-wider opacity-60 block">
          {getTypeLabel()}
        </span>
        <p className="text-xs font-sans font-medium leading-relaxed">
          {toast.message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer shrink-0"
        title="Sulje"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
export default ToastContainer;
