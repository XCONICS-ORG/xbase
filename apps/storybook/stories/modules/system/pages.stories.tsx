import type { Meta, StoryObj } from "@storybook/react";
import {
  SystemPage,
  type SystemPageType,
} from "@xbase/design-system/components/modules/system/pages";

const pageTypes = [
  "banned",
  "inactive",
  "noNetwork",
  "notFound",
  "rateLimited",
  "unsupportedDevice",
] satisfies SystemPageType[];

const meta: Meta<typeof SystemPage> = {
  title: "Modules/System/Pages",
  component: SystemPage,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: pageTypes,
    },
    rateLimitSeconds: {
      control: {
        type: "number",
        min: 0,
      },
    },
  },
  args: {
    type: "notFound",
    dashboardHref: "/dashboard",
    rateLimitSeconds: 3,
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllPages: Story = {
  render: () => (
    <div className="grid gap-6 bg-background p-6">
      {pageTypes.map((type) => (
        <div className="h-[520px] overflow-hidden rounded-md border" key={type}>
          <SystemPage
            className="min-h-[520px]"
            dashboardHref="/dashboard"
            rateLimitSeconds={0}
            type={type}
          />
        </div>
      ))}
    </div>
  ),
};

export const RateLimited: Story = {
  args: {
    type: "rateLimited",
    rateLimitSeconds: 5,
  },
};

export const UnsupportedDevice: Story = {
  args: {
    type: "unsupportedDevice",
  },
};

export const NoNetwork: Story = {
  args: {
    type: "noNetwork",
  },
};
