import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@xbase/design-system/components/ui/badge";
import { Button } from "@xbase/design-system/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@xbase/design-system/components/ui/card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Workspace status</CardTitle>
        <CardDescription>Package checks from the latest run.</CardDescription>
        <CardAction>
          <Badge variant="secondary">Ready</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-3">
          <div>
            <dt className="text-muted-foreground">Packages</dt>
            <dd className="font-medium">12</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Issues</dt>
            <dd className="font-medium">0</dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="justify-end">
        <Button size="sm" variant="outline">
          Open report
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>Default card</CardTitle>
          <CardDescription>Regular spacing for panels.</CardDescription>
        </CardHeader>
        <CardContent>Use this for dashboards and detail views.</CardContent>
      </Card>
      <Card className="w-[300px]" size="sm">
        <CardHeader>
          <CardTitle>Small card</CardTitle>
          <CardDescription>Tighter spacing for dense lists.</CardDescription>
        </CardHeader>
        <CardContent>Use this inside compact modules.</CardContent>
      </Card>
    </div>
  ),
};
