import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "@xbase/design-system/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@xbase/design-system/components/ui/field";
import { Input } from "@xbase/design-system/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@xbase/design-system/components/ui/radio-group";

const meta: Meta<typeof Field> = {
  title: "UI/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field className="w-[360px]">
      <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
      <Input defaultValue="xbase" id="workspace-name" />
      <FieldDescription>
        This is used as the local project display name.
      </FieldDescription>
    </Field>
  ),
};

export const Orientations: Story = {
  render: () => (
    <FieldGroup className="w-[460px]">
      <Field orientation="vertical">
        <FieldLabel htmlFor="vertical-field">Vertical</FieldLabel>
        <Input id="vertical-field" placeholder="Vertical field" />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="horizontal-field">Horizontal</FieldLabel>
        <Input id="horizontal-field" placeholder="Horizontal field" />
      </Field>
      <Field orientation="responsive">
        <FieldLabel htmlFor="responsive-field">Responsive</FieldLabel>
        <Input id="responsive-field" placeholder="Responsive field" />
      </Field>
    </FieldGroup>
  ),
};

export const FieldSetExample: Story = {
  render: () => (
    <FieldSet className="w-[420px]">
      <FieldLegend>Notifications</FieldLegend>
      <FieldDescription>Choose which workspace updates to receive.</FieldDescription>
      <RadioGroup defaultValue="mentions">
        <Field orientation="horizontal">
          <RadioGroupItem id="all" value="all" />
          <FieldLabel htmlFor="all">All updates</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem id="mentions" value="mentions" />
          <FieldLabel htmlFor="mentions">Mentions only</FieldLabel>
        </Field>
      </RadioGroup>
      <FieldSeparator>Advanced</FieldSeparator>
      <Field orientation="horizontal">
        <Checkbox id="digest" defaultChecked />
        <FieldContent>
          <FieldTitle>Weekly digest</FieldTitle>
          <FieldDescription>Send one summary at the end of the week.</FieldDescription>
        </FieldContent>
      </Field>
    </FieldSet>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field className="w-[360px]" data-invalid="true">
      <FieldLabel htmlFor="package-name">Package name</FieldLabel>
      <Input aria-invalid defaultValue="@xbase/docs" id="package-name" />
      <FieldError>Docs package has been removed from this workspace.</FieldError>
    </Field>
  ),
};
