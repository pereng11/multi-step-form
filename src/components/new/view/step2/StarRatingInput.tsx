import styled from "@emotion/styled";
import React, { InputHTMLAttributes, useRef, useState } from "react";
import { Rating } from "../../types/rating";

const STAR_LIST = [1, 2, 3, 4, 5] as const;

type StarValue = (typeof STAR_LIST)[number];
type StarStatus = "none" | "half" | "full";

const StarIcon = ({ filled, half }: { filled: boolean; half: boolean }) => {
  if (half) {
    // 반 별 SVG
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="#FFD600" />
            <stop offset="50%" stopColor="#E0E0E0" />
          </linearGradient>
        </defs>
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          fill="url(#half)"
        />
      </svg>
    );
  }
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill={filled ? "#FFD600" : "#E0E0E0"}
      />
    </svg>
  );
};
interface StarRatingProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: Rating;
  onChange: (value: Rating) => void;
}

export const StarRatingInput: React.FC<StarRatingProps> = ({ value, onChange, ...restProps }) => {
  const [stars, setStars] = useState<Record<StarValue, StarStatus>>({
    1: "none",
    2: "none",
    3: "none",
    4: "none",
    5: "none",
  });
  const hoveringStatusRef = useRef<StarStatus>("none");

  const getStarStatus = (star: StarValue, hoveringStar: StarValue) => {
    if (star < hoveringStar) {
      return "full";
    }
    if (star === hoveringStar) {
      return hoveringStatusRef.current;
    }
    return "none";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const centerX = rect.width / 2;
    const isHalf = x < centerX;

    hoveringStatusRef.current = isHalf ? "half" : "full";
  };

  const handleMouseClick = (e: React.MouseEvent<HTMLSpanElement>, star: StarValue) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const centerX = rect.width / 2;
    const isHalf = x < centerX;

    setStars({
      1: getStarStatus(1, star),
      2: getStarStatus(2, star),
      3: getStarStatus(3, star),
      4: getStarStatus(4, star),
      5: getStarStatus(5, star),
    });
    const rating = (star + (isHalf ? -0.5 : 0)) as Rating;
    onChange(rating);
  };

  return (
    <div>
      <SrOnlyLabel>
        <input
          type="number"
          value={value ?? 0}
          onChange={(e) => onChange(e.target.valueAsNumber as Rating)}
          {...restProps}
        />
      </SrOnlyLabel>
      {STAR_LIST.map((starValue) => {
        const filled = stars[starValue] === "full";
        const half = stars[starValue] === "half";
        return (
          <StarContainer
            key={starValue}
            onMouseMove={(e) => handleMouseMove(e)}
            onClick={(e) => handleMouseClick(e, starValue)}
          >
            <StarIcon filled={filled} half={half} />
          </StarContainer>
        );
      })}
    </div>
  );
};

const SrOnlyLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 2px;

  overflow: hidden;
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  white-space: nowrap;
`;

const StarContainer = styled.span`
  cursor: pointer;
  border-radius: 4px;
  background: none;
  padding: 0;
  margin: 0;
  display: inline-flex;
`;
