import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@/components/IconButton';
import {
  Container,
  Profile,
  Header,
  ProfileImage,
  HeaderButtonContainer,
  NicknameText,
  StateMessageText,
  NicknameInput,
  StateMessageInput,
  StateMessagePlus,
} from './index.css';

import Edit from '@/assets/img/Edit.svg';
import Check from '@/assets/img/Check.svg';
import Setting from '@/assets/img/Setting.svg';
import Cancel from '@/assets/img/CancelSmall.svg';
import { useUserStore } from '@/stores/useUserStore';
import DefaultProfile from '@/assets/img/DefaultProfile.svg';
import AddIcon from '@/assets/img/Add.svg';

export const MyProfile = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname);
  const [stateMessage, setStateMessage] = useState(user?.stateMessage);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (user) {
      const nicknameChanged = nickname !== user.nickname;
      const stateMessageChanged = stateMessage !== user.stateMessage;
      setIsChanged(nicknameChanged || stateMessageChanged);
    }
  }, [nickname, stateMessage, user]);

  if (!user) {
    return;
  }

  const handleSave = () => {
    setIsEditMode(false);
    if (nickname === user?.nickname && stateMessage === user?.stateMessage) {
      return;
    }
    alert('닉네임과 상태 메시지가 저장되었습니다.');
  };

  return (
    <Container>
      <Profile>
        <Header>
          <ProfileImage src={user.profileImageUrl ?? DefaultProfile} />
          <HeaderButtonContainer>
            <IconButton
              beforeImgUrl={isEditMode ? Check : Edit}
              afterImgUrl={isEditMode ? Check : Edit}
              backgroundColor={
                isEditMode
                  ? isChanged
                    ? 'var(--palette-primary-normal)'
                    : 'var(--palette-label-disable)'
                  : 'var(--palette-line-solid-alternative)'
              }
              onClick={() => {
                if (isEditMode) {
                  handleSave();
                } else {
                  setIsEditMode(true);
                }
              }}
            />
            <IconButton
              beforeImgUrl={isEditMode ? Cancel : Setting}
              afterImgUrl={isEditMode ? Cancel : Setting}
              onClick={() => {
                if (isEditMode) {
                  setIsEditMode(false);
                  setNickname(user?.nickname);
                  setStateMessage(user?.stateMessage);
                } else {
                  navigate('/setting');
                }
              }}
            />
          </HeaderButtonContainer>
        </Header>
        {isEditMode ? (
          <>
            <NicknameInput
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              $isEditMode={isEditMode}
            />
            <StateMessageInput
              type="text"
              value={stateMessage}
              onChange={e => setStateMessage(e.target.value)}
              placeholder="상태 메시지를 입력하세요"
              $isEditMode={isEditMode}
            />
          </>
        ) : (
          <>
            <NicknameText>{nickname}</NicknameText>
            {stateMessage ? (
              <StateMessageText>{stateMessage}</StateMessageText>
            ) : (
              <StateMessagePlus onClick={() => setIsEditMode(true)}>
                <img src={AddIcon} alt="plus" />
                상태 추가하기
              </StateMessagePlus>
            )}
          </>
        )}
      </Profile>
    </Container>
  );
};
