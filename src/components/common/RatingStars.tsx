import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  value: number;
  onChange?: (val: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  onChange,
  readonly = false,
  size = 'md'
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(null)}
          className={`transition-transform duration-150 ${
            !readonly ? 'hover:scale-110 cursor-pointer focus:outline-none' : 'cursor-default'
          }`}
          aria-label={`${star} star`}
        >
          <Star
            className={`${starSizes[size]} ${
              star <= displayValue
                ? 'fill-[#C6A969] text-[#C6A969]'
                : 'text-[#D3CDC0] fill-transparent'
            }`}
          />
        </button>
      ))}
    </div>
  );
};
