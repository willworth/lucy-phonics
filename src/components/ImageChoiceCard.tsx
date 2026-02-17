import { useState } from 'react';

interface ImageChoiceCardProps {
  imageUrl: string;
  label: string;
  disabled?: boolean;
  dimmed?: boolean;
  pressed?: boolean;
  wobble?: boolean;
  celebrate?: boolean;
  onSelect: () => void;
}

export const ImageChoiceCard = ({
  imageUrl,
  label,
  disabled = false,
  dimmed = false,
  pressed = false,
  wobble = false,
  celebrate = false,
  onSelect
}: ImageChoiceCardProps) => {
  const [showFallback, setShowFallback] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`rounded-2xl bg-white p-3 shadow transition ${pressed ? 'scale-[0.97]' : 'scale-100'} active:scale-95 ${
        dimmed ? 'opacity-65 saturate-75' : 'opacity-100'
      } ${disabled ? 'cursor-not-allowed' : 'hover:scale-[1.02]'} ${
        wobble ? 'animate-wobble-gentle' : ''
      } ${celebrate ? 'ring-4 ring-amber-300/70' : ''}`}
    >
      {showFallback ? (
        <div className="flex h-36 w-full items-center justify-center rounded-xl bg-slate-100 text-center text-sm font-semibold text-slate-600 sm:h-44">
          Image unavailable
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={label}
          className={`h-36 w-full rounded-xl object-contain sm:h-44 ${celebrate ? 'animate-happy-pulse' : ''}`}
          onError={() => setShowFallback(true)}
        />
      )}
      <span className="mt-2 block text-xl font-bold text-teal-900">{label}</span>
    </button>
  );
};
