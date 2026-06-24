import type { Meta, StoryObj } from "@storybook/react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@xbase/design-system/components/ui/pagination";

const meta: Meta<typeof Pagination> = {
  title: "UI/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" size="default" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" size="icon">
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive size="icon">
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" size="icon">
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" size="default" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const Compact: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="#" size="icon-sm">
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive size="icon-sm">
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" size="icon-sm">
            3
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};
