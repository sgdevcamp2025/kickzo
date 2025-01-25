import type { Meta, StoryObj } from '@storybook/react';
import { CommonInput } from '@/components/common/input';

const meta = {
  title: 'Components/Common/Input',
  component: CommonInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'password', 'email', 'number'],
    },
    placeholder: {
      control: 'text',
    },
    value: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
    buttonLabel: {
      control: 'text',
    },
    onButtonClick: {
      action: 'onButtonClick',
    },
    design: {
      control: { type: 'select' },
      options: [0, 1] /** 0 = INPUT, 1 = SEARCH */,
    },
  },
  args: {
    type: 'text',
    value: '',
    disabled: false,
    error: '',
    buttonLabel: '',
    design: 0,
  },
} satisfies Meta<typeof oninput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 Input*/
export const Default: Story = {};

/** placeholder를 포함한 Input */
export const WithPlaceholder: Story = {
  args: {
    placeholder: '아이디',
  },
};

/** 버튼을 포함한 Input */
export const WithButton: Story = {
  args: {
    buttonLabel: '중복 확인',
    onButtonClick: () => alert('중복 확인 버튼 클릭'),
  },
};

/** 비활성화 상태의 Input */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/** 에러 메시지가 포함된 Input */
export const WithError: Story = {
  args: {
    error: '6~12자로 입력해주세요',
    value: '',
  },
};

/** 숫자를 입력하기 위한 Input */
export const NumberInput: Story = {
  args: {
    type: 'number',
    placeholder: '(예시) 01012345678',
  },
};

/** 비밀번호를 입력하기 위한 Input */
export const PasswordInput: Story = {
  args: {
    type: 'password',
    placeholder: '비밀번호',
  },
};

/** 검색하기 위한 Input */
export const Search: Story = {
  args: {
    design: 1,
    placeholder: '닉네임 검색',
  },
};
