import { useState } from 'react';
import { CommonButton } from '@/components/Common/Button';

interface IconButtonProps {
  beforeImgUrl: string;
  afterImgUrl: string;
  /** 아이콘이 변경될 때 추가로 실행할 콜백 (옵션) */
  onToggle?: () => void;
}

export const IconButton = ({ beforeImgUrl, afterImgUrl, onToggle }: IconButtonProps) => {
  const [isBeforeIcon, setIsBeforeIcon] = useState(true);

  const handleClick = () => {
    setIsBeforeIcon(prev => !prev);
    onToggle?.();
  };

  return (
    <CommonButton onClick={handleClick} width="40px" height="40px" borderradius="100px">
      <img src={isBeforeIcon ? beforeImgUrl : afterImgUrl} alt="icon" />
    </CommonButton>
  );
};
