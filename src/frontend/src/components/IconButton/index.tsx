import { useState } from 'react';
import { CircleButton } from './index.css';

interface IconButtonProps {
  beforeImgUrl: string;
  afterImgUrl?: string;
  backgroundColor?: string;
  onToggle?: () => void;
  onClick?: () => void;
}

export const IconButton = ({
  beforeImgUrl,
  afterImgUrl,
  backgroundColor,
  onToggle,
  onClick,
}: IconButtonProps) => {
  const [isBeforeIcon, setIsBeforeIcon] = useState(true);

  const handleClick = () => {
    setIsBeforeIcon(prev => !prev);
    onToggle?.();
    if (onClick) onClick();
  };

  return (
    <CircleButton onClick={handleClick} $backgroundColor={backgroundColor}>
      <div>
        <img src={isBeforeIcon ? beforeImgUrl : afterImgUrl} alt="icon" />
      </div>
    </CircleButton>
  );
};
