import { UserRole } from '@/types/enums/UserRole';
import { ProfileDetailType } from '@/types/enums/ProfileDetailType';
import { RoleChangeButton } from '@/components/RoleChangeButton';
import { CommonButton } from '@/components/common/Button';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { ButtonContainer } from './index.css';

interface IProfileButtonContainer {
  myRole: UserRole;
  userRole: UserRole;
  profileDetailType: ProfileDetailType;
}

export const ProfileButtonContainer = (props: IProfileButtonContainer) => {
  if (props.profileDetailType === ProfileDetailType.EDIT) return null;

  if (props.myRole === UserRole.CREATOR && props.userRole !== UserRole.CREATOR) {
    return (
      <ButtonContainer>
        <RoleChangeButton myRole={props.myRole} userRole={props.userRole} text="권한" />
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
      </ButtonContainer>
    );
  }

  return null;
};
