import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "@xbase/design-system/components/ui/calendar";
import { useState } from "react";

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: function CalendarStory() {
    const [date, setDate] = useState<Date | undefined>(new Date(2026, 5, 24));

    return (
      <Calendar
        mode="single"
        onSelect={setDate}
        selected={date}
      />
    );
  },
};

export const Range: Story = {
  args: {},
  render: () => (
    <Calendar
      defaultMonth={new Date(2026, 5, 1)}
      mode="range"
      numberOfMonths={2}
      selected={{
        from: new Date(2026, 5, 18),
        to: new Date(2026, 5, 24),
      }}
    />
  ),
};

export const DropdownCaption: Story = {
  args: {},
  render: () => (
    <Calendar
      captionLayout="dropdown"
      defaultMonth={new Date(2026, 5, 1)}
      mode="single"
      selected={new Date(2026, 5, 24)}
    />
  ),
};
