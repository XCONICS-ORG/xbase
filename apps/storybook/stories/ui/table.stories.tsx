import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@xbase/design-system/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@xbase/design-system/components/ui/table";

const meta: Meta<typeof Table> = {
  title: "UI/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[560px]">
      <Table>
        <TableCaption>Shared workspace packages.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Package</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Exports</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">@xbase/design-system</TableCell>
            <TableCell>
              <Badge>Active</Badge>
            </TableCell>
            <TableCell className="text-right">42</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">@xbase/env</TableCell>
            <TableCell>
              <Badge variant="secondary">Local</Badge>
            </TableCell>
            <TableCell className="text-right">3</TableCell>
          </TableRow>
          <TableRow data-state="selected">
            <TableCell className="font-medium">@xbase/bucket</TableCell>
            <TableCell>
              <Badge variant="outline">Optional</Badge>
            </TableCell>
            <TableCell className="text-right">5</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total exports</TableCell>
            <TableCell className="text-right">50</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
};
