import { ChangeEvent, useEffect, useRef, useState } from 'react';
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
  ErrorMessage,
  ProfileImageResetButton,
  ProfileImageContainer,
} from './index.css';

import Edit from '@/assets/img/Edit.svg';
import Check from '@/assets/img/Check.svg';
import Setting from '@/assets/img/Setting.svg';
import Cancel from '@/assets/img/CancelSmall.svg';
import { useUserStore } from '@/stores/useUserStore';
import DefaultProfile from '@/assets/img/DefaultProfile.svg';
import AddIcon from '@/assets/img/Add.svg';
import { AxiosError } from 'axios';
import { uploadImageToS3 } from '@/utils/uploadFile';

export const MyProfile = () => {
  const { user, updateMyProfile, updateProfileImage } = useUserStore();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname);
  const [stateMessage, setStateMessage] = useState(user?.stateMessage || null);
  const [isChanged, setIsChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const nicknameChanged = nickname !== user.nickname;
      const stateMessageChanged = stateMessage !== user.stateMessage;
      setIsChanged(nicknameChanged || stateMessageChanged);
    }
  }, [nickname, stateMessage, user]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }
  }, [errorMessage]);

  if (!user) {
    return;
  }

  const handleSave = async () => {
    if (nickname === user?.nickname && stateMessage === user?.stateMessage) {
      setIsEditMode(false);
      return;
    }
    if (!nickname) {
      setErrorMessage('닉네임을 입력해주세요.');
      return;
    }

    if (nickname && (nickname === '' || nickname.length > 20)) {
      setErrorMessage('닉네임은 1자 이상 20자 이하여야 합니다.');
      return;
    }

    if (stateMessage && (stateMessage === '' || stateMessage.length > 100)) {
      setErrorMessage('상태 메시지는 1자 이상 100자 이하여야 합니다.');
      return;
    }
    try {
      await updateMyProfile({
        nickname,
        ...(stateMessage && { stateMessage }),
      });
      setIsEditMode(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        handleCancel();
        setErrorMessage(error.response?.data.message);
      }
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setNickname(user?.nickname);
    setStateMessage(user?.stateMessage);
  };

  const handleImageClick = () => {
    if (isEditMode) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImageToS3(file);
      const updateUser = await updateProfileImage(imageUrl);
      console.log('image change', updateUser);
    } catch {
      setErrorMessage('이미지 업로드에 실패했습니다.');
    }
  };

  const handleImageReset = async () => {
    const updateUser = await updateProfileImage(null);
    console.log('image reset', updateUser);
  };

  return (
    <Container>
      <Profile>
        <Header>
          <ProfileImageContainer>
            <ProfileImage
              src={user.profileImageUrl ?? DefaultProfile}
              onClick={handleImageClick}
              $onClick={isEditMode}
              onError={e => {
                e.currentTarget.src = DefaultProfile;
              }}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
              accept="image/*"
            />
            {isEditMode && (
              <ProfileImageResetButton onClick={handleImageReset}>
                <img src={Cancel} alt="cancel" />
              </ProfileImageResetButton>
            )}
          </ProfileImageContainer>
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
                  handleCancel();
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
              value={stateMessage ?? ''}
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
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Container>
  );
};
