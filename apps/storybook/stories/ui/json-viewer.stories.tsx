import type { Meta, StoryObj } from "@storybook/react";
import { JsonViewer } from "@xbase/design-system/components/ui/json-viewer";

const sampleData = {
  id: "evt_01JH9EM0E1KPX9DQ9ZP3W3C2VA",
  status: "active",
  createdAt: "2026-06-26T09:30:00.000Z",
  theme: {
    primary: "#2563eb",
    muted: "rgba(148, 163, 184, 0.24)",
  },
  request: {
    method: "POST",
    url: "https://api.example.com/v1/events/evt_01JH9EM0E1KPX9DQ9ZP3W3C2VA",
    retries: 2,
    authenticated: true,
  },
  tags: ["storybook", "json", "viewer", "design-system", "preview"],
  metrics: [
    { label: "p50", value: 124 },
    { label: "p95", value: 318 },
    { label: "p99", value: 640 },
    { label: "errors", value: 0 },
    { label: "timeouts", value: 1 },
    { label: "retries", value: 2 },
  ],
  owner: null,
};

const meta: Meta<typeof JsonViewer> = {
  title: "UI/Json Viewer",
  component: JsonViewer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    data: sampleData,
    defaultExpanded: 1,
    showColorIndent: true,
    showLineNumbers: true,
    title: "Event payload",
  },
  argTypes: {
    collapseOn: {
      control: "inline-radio",
      options: ["click", "doubleClick"],
    },
    defaultExpanded: {
      control: "number",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[min(920px,calc(100vw-4rem))]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Collapsed: Story = {
  args: {
    defaultExpanded: false,
    showColorIndent: false,
    title: "Collapsed payload",
  },
};

export const Expanded: Story = {
  args: {
    defaultExpanded: true,
    truncation: {
      enabled: false,
    },
    title: "Expanded payload",
  },
};
