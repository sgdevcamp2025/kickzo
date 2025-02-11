import { Profile__Nickname } from '../index.css';

interface IProfileInfo {
  nickname: string;
  introduce: string;
}

export const ProfileInfo = (props: IProfileInfo) => {
  return (
    <>
      <Profile__Nickname>{props.nickname}</Profile__Nickname>
      <p>{props.introduce}</p>
    </>
  );
};
