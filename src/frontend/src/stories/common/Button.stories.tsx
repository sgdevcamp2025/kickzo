import type { Meta, StoryObj } from '@storybook/react';
import { CommonButton } from '@/components/Common/Button';
import { ButtonColor } from '@/types/enums/ButtonColor';
import MicrophoneOn from '@/assets/img/MicrophoneOn.svg';
import Add from '@/assets/img/Add.svg';
import Check from '@/assets/img/Check.svg';

const meta = {
  title: 'Components/Common/Button',
  component: CommonButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    color: {
      control: { type: 'select' },
      options: Object.values(ButtonColor),
      description: '버튼 색상',
    },
    textcolor: {
      control: 'color',
      description: '버튼 글자 색상',
    },
    padding: {
      control: 'text',
      description: '버튼 내부 패딩',
    },
    borderradius: {
      control: 'text',
      description: '버튼의 border-radius 값',
    },
    border: {
      control: 'text',
      description: '버튼의 border 스타일',
    },
    disabled: {
      control: 'boolean',
      description: '버튼 비활성화 여부',
    },
    // children: {
    //   control: 'text',
    //   description: '버튼 내부 텍스트 또는 콘텐츠',
    // },
    onClick: {
      action: 'clicked',
      description: '버튼 클릭 핸들러',
    },
  },
  args: {
    color: ButtonColor.ORANGE,
    textcolor: 'white',
    padding: '10px 20px',
    borderradius: '5px',
    border: 'none',
    children: '입장',
    disabled: false,
  },
} satisfies Meta<typeof CommonButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 Button */
export const Default: Story = {};

/** 비활성화 상태의 Button */
export const Disabled: Story = {
  args: {
    color: ButtonColor.GRAY,
    disabled: true,
    children: <img src={Check} />,
  },
};

/** 이미지를 포함한 Button */
export const withImage: Story = {
  args: {
    children: <img src={MicrophoneOn} />,
    color: ButtonColor.LIGHTGRAY,
    padding: '8px',
    borderradius: '100px',
  },
};

/** 회색 Button */
export const GrayButton: Story = {
  args: {
    color: ButtonColor.GRAY,
    children: '이전',
  },
};

/** 다크그레이색 Button */
export const DarkGrayButton: Story = {
  args: {
    color: ButtonColor.DARKGRAY,
    children: '나가기',
  },
};

/** 투명 Button */
export const TransparentButton: Story = {
  args: {
    children: <img src={Add} />,
    color: ButtonColor.TRANSPARENT,
    padding: '8px',
    borderradius: '100px',
  },
};
