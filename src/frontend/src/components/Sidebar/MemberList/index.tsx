import { useState } from "react";
import { SmallProfile } from "@/components/common/SmallProfile";
import { ProfileDetail } from "@/components/common/ProfileDetail";
import { MemberListFooter } from "@/components/Sidebar/MemberList/MemberListFooter";

import { SidebarType } from "@/types/enums/SidebarType";
import { ProfileType } from "@/types/enums/ProfileType";
import { UserRole } from "@/types/enums/UserRole";
import { memberListTest } from "@/assets/data/memberListTest";

import { ProfileDetailType } from "@/types/enums/ProfileDetailType";
import { Container, UserList, ProfileWrapper } from "./index.css";
interface IMemberListProps {
  sidebarType: SidebarType;
}

export const MemberList = ({ sidebarType }: IMemberListProps) => {
  const [activeProfile, setActiveProfile] = useState<number | null>(null);
  const handleProfileClick = (id: number) => {
    setActiveProfile((prevId) => (prevId === id ? null : id));
  };

  return (
    <Container>
      <UserList>
        {memberListTest
          .sort((a, b) => a.role - b.role)
          .map((member) => (
            <ProfileWrapper key={member.id}>
              <div onClick={() => handleProfileClick(member.id)}>
                <SmallProfile
                  type={
                    sidebarType === SidebarType.VOICECHAT
                      ? ProfileType.VOICECHAT
                      : ProfileType.MEMBER
                  }
                  role={member.role}
                  nickname={member.nickname}
                  imgUrl={member.profileImg}
                />
              </div>
              {activeProfile === member.id ? (
                <div
                  className={`profile-detail ${
                    activeProfile === member.id ? "active" : ""
                  }`}
                >
                  <ProfileDetail
                    userId={member.id}
                    userRole={member.role}
                    myRole={UserRole.CREATOR}
                    profileDetailType={sidebarType as unknown as ProfileDetailType}
                  />
                </div>
              ) : (
                ""
              )}
            </ProfileWrapper>
          ))}
      </UserList>
      <MemberListFooter sidebarType={sidebarType} />
    </Container>
  );
};
