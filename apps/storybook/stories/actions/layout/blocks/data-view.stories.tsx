import type { Meta, StoryObj } from "@storybook/react";
import {
  CopyButton,
  DataView as XbaseDataView,
} from "@xbase/design-system/components/modules/layout/blocks";
import { Braces, DollarSign, Hash, Mail, Phone } from "@xbase/icons/lucide";

const meta: Meta<typeof XbaseDataView> = {
  title: "Actions/Layout/Blocks/DataView",
  component: XbaseDataView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const jsonValue = {
  plan: "Enterprise",
  seats: 42,
  status: "active",
};

export const Overview: Story = {
  render: () => (
    <div className="grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
      <XbaseDataView copy label="Company" value="Northstar Labs" />
      <XbaseDataView label="Status" type="boolean" value={true} />
      <XbaseDataView
        label="Monthly revenue"
        prefix={<DollarSign className="size-3.5" />}
        type="currency"
        value={12_540}
      />
      <XbaseDataView
        copy
        label="Billing email"
        prefix={<Mail className="size-3.5" />}
        type="email"
        value="finance@northstar.example"
      />
      <XbaseDataView
        label="Customer ID"
        prefix={<Hash className="size-3.5" />}
        type="code"
        value="cus_7AMX93KQ"
      />
      <XbaseDataView
        copy
        label="Password"
        type="password"
        value="N0rthstar!2026"
      />
      <XbaseDataView
        copy={{ showLabel: true }}
        label="Support phone"
        prefix={<Phone className="size-3.5" />}
        type="phone"
        value="+1 415 555 0198"
      />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-1 gap-4">
      <XbaseDataView label="Default" value="Standard field presentation" />
      <XbaseDataView
        label="Subtle"
        value="Muted container for dense detail sections"
        variant="subtle"
      />
      <XbaseDataView
        copy
        label="Card"
        value="Bordered block with copy operation"
        variant="card"
      />
      <XbaseDataView
        label="Inline"
        value="Label and value align on wider screens"
        variant="inline"
      />
      <XbaseDataView
        label="Plain"
        presentation="plain"
        type="code"
        value="read:properties write:deals"
        variant="plain"
      />
    </div>
  ),
};

export const ValueTypes: Story = {
  render: () => (
    <div className="grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
      <XbaseDataView label="Number" type="number" value={987_654} />
      <XbaseDataView
        currency="INR"
        label="Currency"
        type="currency"
        value={48_500}
      />
      <XbaseDataView
        dateOptions={{ preset: "dateOrdinalMonthYear" }}
        label="Date"
        type="date"
        value="2026-06-25"
      />
      <XbaseDataView label="Time" type="time" value="2026-06-25T13:45:00Z" />
      <XbaseDataView
        copy
        label="Long text"
        rows={5}
        type="longtext"
        value="Operational notes can be read-only, copied, and kept inside a stable textarea without turning the detail panel into an edit form."
      />
      <XbaseDataView
        copy={{ showLabel: true }}
        label="JSON"
        prefix={<Braces className="size-3.5" />}
        type="json"
        value={[jsonValue]}
      />
      <XbaseDataView
        label="Image"
        type="image"
        value="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23f1f5f9'/%3E%3Crect x='72' y='72' width='496' height='216' rx='18' fill='%23ffffff' stroke='%23cbd5e1'/%3E%3Ccircle cx='168' cy='146' r='42' fill='%2394a3b8'/%3E%3Cpath d='M112 256h416L392 148 296 232l-56-48z' fill='%23334155'/%3E%3C/svg%3E"
      />
      <XbaseDataView emptyValue="Not assigned" label="Empty" value="" />
    </div>
  ),
};

export const CopyOperation: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-4">
      <XbaseDataView
        copy={{
          copiedLabel: "Copied key",
          label: "Copy key",
          showLabel: true,
          value: ({ displayValue }) => `secret:${displayValue}`,
        }}
        label="API key"
        type="code"
        value="sk_live_123456789"
      />
      <div className="flex items-center gap-2">
        <CopyButton showLabel value="Standalone copied value" />
        <CopyButton label="Icon copy" value="Icon only copy" />
      </div>
    </div>
  ),
};
