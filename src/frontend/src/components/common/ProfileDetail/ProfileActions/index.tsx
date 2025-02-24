import { RoleChangeButton } from '@/components/RoleChangeButton';
import { CommonButton } from '@/components/common/Button';
import { UserRole } from '@/types/enums/UserRole';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { SidebarType } from '@/types/enums/SidebarType';
import { ProfileDetailDto } from '@/types/dto/ProfileDetailDto.dto';

export const ProfileActions = (props: ProfileDetailDto) => {
  if (
    props.myRole === UserRole.CREATOR &&
    props.userRole !== UserRole.CREATOR &&
    props.sidebarType === SidebarType.VOICECHAT
  ) {
    return (
      <>
        <RoleChangeButton
          userId={props.userId}
          roomId={props.roomId}
          myRole={props.myRole}
          userRole={props.userRole}
          text="권한"
        />
        <CommonButton
          color={ButtonColor.RED}
          onClick={() => alert('방장에 의해 연결이 끊겼습니다.')}
          justifycontent="left"
          width="100%"
          height="40px"
          padding="10px"
          borderradius="10px"
        >
          연결 끊기
        </CommonButton>
        <CommonButton
          color={ButtonColor.RED}
          onClick={() => alert('추방되었습니다.')}
          justifycontent="left"
          width="100%"
          height="40px"
          padding="10px"
          borderradius="10px"
        >
          추방하기
        </CommonButton>
      </>
    );
  }

  if (props.myRole === UserRole.CREATOR && props.userRole !== UserRole.CREATOR) {
    return (
      <>
        <RoleChangeButton
          userId={props.userId}
          roomId={props.roomId}
          myRole={props.myRole}
          userRole={props.userRole}
          text="권한"
        />
        <CommonButton
          color={ButtonColor.RED}
          onClick={() => alert('추방되었습니다.')}
          justifycontent="left"
          width="100%"
          height="40px"
          padding="10px"
          borderradius="10px"
        >
          추방하기
        </CommonButton>
      </>
    );
  }
  return null;
};
