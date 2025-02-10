import { Dispatch, SetStateAction } from 'react';
import { ProfileDetailType } from '@/types/enums/ProfileDetailType';
import { Profile__Nickname, Profile__MyNickname, Profile__MyIntroduce } from './index.css';

interface IProfileContent {
  profileDetailType: ProfileDetailType;
  isEditing: boolean;
  nickname: string;
  setNickname: Dispatch<SetStateAction<string>>;
  introduce: string;
  setIntroduce: Dispatch<SetStateAction<string>>;
}

export const ProfileContent = (props: IProfileContent) => {
  if (props.profileDetailType === ProfileDetailType.EDIT && props.isEditing) {
    return (
      <>
        <Profile__MyNickname
          type="text"
          value={props.nickname}
          onChange={e => props.setNickname(e.target.value)}
          placeholder="닉네임을 입력하세요"
        />
        <Profile__MyIntroduce
          type="text"
          value={props.introduce}
          onChange={e => props.setIntroduce(e.target.value)}
          placeholder="상태 메시지를 입력하세요"
        />
      </>
    );
  }

  return (
    <>
      <Profile__Nickname>{props.nickname}</Profile__Nickname>
      <p>{props.introduce}</p>
    </>
  );
};
