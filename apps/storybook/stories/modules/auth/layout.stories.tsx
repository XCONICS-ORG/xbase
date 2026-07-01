import type { Meta, StoryObj } from "@storybook/react";
import { AuthBlock } from "@xbase/design-system/components/modules/auth/auth-block";
import {
  AuthLayout,
  authLayoutWidthPresets,
} from "@xbase/design-system/components/modules/auth/layout";

const meta: Meta<typeof AuthLayout> = {
  title: "Modules/Auth/Layout",
  component: AuthLayout,
  tags: ["autodocs"],
  args: {
    children: <AuthBlock defaultEmail="alex@example.com" />,
    mediaPosition: "left",
    widthPreset: "media-narrow",
  },
  argTypes: {
    children: {
      control: false,
    },
    mediaPosition: {
      control: "inline-radio",
      options: ["left", "right"],
    },
    widthPreset: {
      control: "select",
      options: authLayoutWidthPresets,
    },
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ImageLeft: Story = {
  args: {
    mediaPosition: "left",
  },
};

export const ImageRight: Story = {
  args: {
    mediaPosition: "right",
  },
};

export const Balanced: Story = {
  args: {
    widthPreset: "balanced",
  },
};

export const WideImage: Story = {
  args: {
    widthPreset: "media-wide",
  },
};
