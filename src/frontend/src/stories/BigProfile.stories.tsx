import type { Meta, StoryObj } from '@storybook/react';
import { BigProfile } from '@/components/common/BigProfile';
import { UserRole } from '@/types/enums/UserRole';
import { SidebarType } from '@/types/enums/SidebarType';

const meta: Meta<typeof BigProfile> = {
  title: 'Components/BigProfile',
  component: BigProfile,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    userId: { control: 'number' },
    userRole: {
      control: { type: 'select' },
      options: [UserRole.OWNER, UserRole.MANAGER, UserRole.MEMBER],
    },
    myRole: {
      control: { type: 'select' },
      options: [UserRole.OWNER, UserRole.MANAGER, UserRole.MEMBER],
    },
    sidebarType: {
      control: { type: 'select' },
      options: [SidebarType.Chat, SidebarType.Playlist, SidebarType.VoiceChat, SidebarType.Member],
    },
  },
};

export default meta;
type Story = StoryObj<typeof BigProfile>;

/** 채팅 또는 유저리스트에서 멤버의 프로필을 조회하는 경우 BigProfile */
export const MemberList: Story = {
  args: {
    userId: 1,
    userRole: UserRole.MEMBER,
    myRole: UserRole.MEMBER,
    sidebarType: SidebarType.Chat,
  },
};

/** 음성채팅에서 멤버의 프로필을 조회하는 경우 BigProfile */
export const VoiceChat: Story = {
  args: {
    userId: 1,
    userRole: UserRole.MEMBER,
    myRole: UserRole.MEMBER,
    sidebarType: SidebarType.VoiceChat,
  },
};

/** 방장(Owner)이 멤버를 관리하는 경우 */
export const OwnerManagingMember: Story = {
  args: {
    userId: 2,
    userRole: UserRole.MEMBER,
    myRole: UserRole.OWNER,
    sidebarType: SidebarType.VoiceChat,
  },
};

/** 방장이 매니저를 관리하는 경우 */
export const OwnerManagingManager: Story = {
  args: {
    userId: 3,
    userRole: UserRole.MANAGER,
    myRole: UserRole.OWNER,
    sidebarType: SidebarType.VoiceChat,
  },
};

/** 매니저가 다른 유저들을 열람하는 경우 */
export const ManagerManagingUser: Story = {
  args: {
    userId: 4,
    userRole: UserRole.MEMBER,
    myRole: UserRole.MANAGER,
    sidebarType: SidebarType.Chat,
  },
};

/** 멤버가 다른 유저들을 열람하는 경우 */
export const MemberManagingUser: Story = {
  args: {
    userId: 4,
    userRole: UserRole.MEMBER,
    myRole: UserRole.MEMBER,
    sidebarType: SidebarType.Chat,
  },
};
