import type { Meta, StoryObj } from "@storybook/react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@xbase/design-system/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";

const meta: Meta<typeof ChartContainer> = {
  title: "UI/Chart",
  component: ChartContainer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const chartData = [
  { month: "Jan", packages: 8, apps: 2 },
  { month: "Feb", packages: 9, apps: 2 },
  { month: "Mar", packages: 10, apps: 2 },
  { month: "Apr", packages: 11, apps: 2 },
  { month: "May", packages: 12, apps: 1 },
  { month: "Jun", packages: 12, apps: 1 },
];

const chartConfig = {
  packages: {
    label: "Packages",
    color: "var(--chart-1)",
  },
  apps: {
    label: "Apps",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export const Default: Story = {
  render: () => (
    <ChartContainer className="h-[240px] w-[520px]" config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="month"
          tickLine={false}
          tickMargin={10}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="packages" fill="var(--color-packages)" radius={4} />
        <Bar dataKey="apps" fill="var(--color-apps)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

export const LineExample: Story = {
  render: () => (
    <ChartContainer className="h-[240px] w-[520px]" config={chartConfig}>
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="month"
          tickLine={false}
          tickMargin={10}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Line
          dataKey="packages"
          dot={false}
          stroke="var(--color-packages)"
          strokeWidth={2}
          type="monotone"
        />
        <Line
          dataKey="apps"
          dot={false}
          stroke="var(--color-apps)"
          strokeWidth={2}
          type="monotone"
        />
      </LineChart>
    </ChartContainer>
  ),
};
