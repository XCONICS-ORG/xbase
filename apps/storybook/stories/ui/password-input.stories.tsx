import type { Meta, StoryObj } from "@storybook/react";
import { PasswordInput } from "@xbase/design-system/components/ui/password-input";

const meta: Meta<typeof PasswordInput> = {
  title: "UI/PasswordInput",
  component: PasswordInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
