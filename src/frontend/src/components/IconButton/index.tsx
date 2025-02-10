import { useState } from 'react';
import { CommonButton } from '@/components/common/Button';

interface IconButtonProps {
  beforeImgUrl: string;
  afterImgUrl?: string;
  onToggle?: () => void;
  onClick?: () => void;
}

export const IconButton = ({ beforeImgUrl, afterImgUrl, onToggle, onClick }: IconButtonProps) => {
  const [isBeforeIcon, setIsBeforeIcon] = useState(true);

  const handleClick = () => {
    setIsBeforeIcon(prev => !prev);
    onToggle?.();
    if (onClick) onClick();
  };

  return (
    <CommonButton onClick={handleClick} width="40px" height="40px" borderradius="100px">
      <img src={isBeforeIcon ? beforeImgUrl : afterImgUrl} alt="icon" />
    </CommonButton>
  );
};
