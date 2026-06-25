import type { Meta, StoryObj } from "@storybook/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@xbase/design-system/components/ui/tabs";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs className="w-[420px]" defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        Shared workspace packages, app entry points, and local configuration.
      </TabsContent>
      <TabsContent value="activity">
        Recent package changes and generated component updates.
      </TabsContent>
      <TabsContent value="settings">
        Local preferences and workspace controls.
      </TabsContent>
    </Tabs>
  ),
};

export const LineVariant: Story = {
  render: () => (
    <Tabs className="w-[420px]" defaultValue="preview">
      <TabsList variant="line">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">Rendered component example.</TabsContent>
      <TabsContent value="code">Import path and usage snippet.</TabsContent>
      <TabsContent value="tokens">Theme token references.</TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs
      className="w-[520px] flex-row"
      defaultValue="apps"
      orientation="vertical"
    >
      <TabsList>
        <TabsTrigger value="apps">Apps</TabsTrigger>
        <TabsTrigger value="packages">Packages</TabsTrigger>
        <TabsTrigger value="config">Config</TabsTrigger>
      </TabsList>
      <TabsContent value="apps">Web and Storybook app surfaces.</TabsContent>
      <TabsContent value="packages">
        Shared design-system, env, and utility packages.
      </TabsContent>
      <TabsContent value="config">
        Workspace-level configuration files.
      </TabsContent>
    </Tabs>
  ),
};
