import type { Meta, StoryObj } from "@storybook/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@xbase/design-system/components/ui/resizable";

const meta: Meta<typeof ResizablePanelGroup> = {
  title: "UI/Resizable",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ResizablePanelGroup
      className="h-[220px] w-[560px] rounded-lg border"
      orientation="horizontal"
    >
      <ResizablePanel defaultSize={35}>
        <div className="flex h-full items-center justify-center p-4 text-xs">
          Sidebar
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={65}>
        <div className="flex h-full items-center justify-center p-4 text-xs">
          Preview
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const Nested: Story = {
  render: () => (
    <ResizablePanelGroup
      className="h-[260px] w-[620px] rounded-lg border"
      orientation="horizontal"
    >
      <ResizablePanel defaultSize={30}>
        <div className="flex h-full items-center justify-center p-4 text-xs">
          Navigation
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize={65}>
            <div className="flex h-full items-center justify-center p-4 text-xs">
              Editor
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={35}>
            <div className="flex h-full items-center justify-center p-4 text-xs">
              Console
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
