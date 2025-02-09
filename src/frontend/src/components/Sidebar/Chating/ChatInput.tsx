import { useState } from 'react';
import { CommonInput } from '@/components/common/Input';
import { CommonButton } from '@/components/common/Button';
import Add from '@/assets/img/Add.svg';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { InputContainer } from './index.css';

interface IChatInput {
  onSendMessage: (message: string) => void;
}

export const ChatInput = (props: IChatInput) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() !== '') {
      props.onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <InputContainer>
      <CommonButton color={ButtonColor.TRANSPARENT} borderradius="20px" onClick={handleSend}>
        <img src={Add} alt="Add" />
      </CommonButton>
      <CommonInput
        placeholder="메시지 보내기"
        design={1}
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
      />
    </InputContainer>
  );
};
