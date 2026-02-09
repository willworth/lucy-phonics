interface ImageChoiceCardProps {
  imageUrl: string;
  label: string;
  disabled?: boolean;
  dimmed?: boolean;
  onSelect: () => void;
}

export const ImageChoiceCard = ({
  imageUrl,
  label,
  disabled = false,
  dimmed = false,
  onSelect
}: ImageChoiceCardProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`rounded-2xl bg-white p-3 shadow transition active:scale-95 ${dimmed ? 'opacity-55' : 'opacity-100'} ${
        disabled ? 'cursor-not-allowed' : 'hover:scale-[1.02]'
      }`}
    >
      <img src={imageUrl} alt={label} className="h-36 w-full rounded-xl object-contain sm:h-44" />
      <span className="mt-2 block text-xl font-bold text-teal-900">{label}</span>
    </button>
  );
};
