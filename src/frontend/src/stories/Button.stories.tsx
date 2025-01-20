import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/common/button';
import { ButtonColor } from '@/components/common/button/index.css';
import MicrophoneOn from '@/assets/img/MicrophoneOn.svg';
import Add from '@/assets/img/Add.svg';
import Check from '@/assets/img/Check.svg';

const meta = {
  title: 'Components/Common/Button',
  component: Button,
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
    textColor: {
      control: 'color',
      description: '버튼 글자 색상',
    },
    padding: {
      control: 'text',
      description: '버튼 내부 패딩',
    },
    borderRadius: {
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
    textColor: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    children: '입장',
    disabled: false,
  },
} satisfies Meta<typeof Button>;

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
    borderRadius: '100px',
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
    borderRadius: '100px',
  },
};
