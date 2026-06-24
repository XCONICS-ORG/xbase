import type { Meta, StoryObj } from "@storybook/react";
import {
  BlockListField,
  CountryStateCityField,
  FormContainer,
  FormSwitchField,
  FormWrappedField,
  MultiSelectField,
  PasswordInputField,
  PhoneInputField,
  phoneSchema,
} from "@xbase/design-system/components/modules/form";
import { FieldGroup } from "@xbase/design-system/components/ui/field";
import { createZodResolver, z } from "@xbase/libs/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

const DOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.[a-z]{2,}$/i;

interface FormPreviewValues {
  blocks: string[];
  city: null | string;
  country: null | string;
  domain: string;
  enabled: boolean;
  jsonText: string;
  password: string;
  phone: string;
  state: null | string;
  tags: string[];
}

const invalidValues: FormPreviewValues = {
  blocks: [],
  city: null,
  country: null,
  domain: "invalid domain",
  enabled: false,
  jsonText: "{ invalid",
  password: "",
  phone: "",
  state: null,
  tags: [],
};

const tagOptions = [
  {
    description: "Dashboard charts and exports",
    label: "Analytics",
    value: "analytics",
  },
  {
    description: "Invoices, payments, and plans",
    label: "Billing",
    value: "billing",
  },
  {
    description: "Role and permission controls",
    label: "Access",
    value: "access",
  },
  {
    description: "Transactional notifications",
    label: "Messaging",
    value: "messaging",
  },
];

const jsonTextSchema = z.string().refine((value) => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}, "Enter valid JSON.");

const formPreviewSchema = z.object({
  blocks: z
    .array(z.string().trim().min(1, "Block content is required."))
    .min(1, "Add at least one block."),
  city: z.string().trim().min(1, "City is required."),
  country: z.string().trim().min(1, "Country is required."),
  domain: z
    .string()
    .trim()
    .regex(DOMAIN_PATTERN, "Enter a valid domain, for example xbase.app."),
  enabled: z
    .boolean()
    .refine((value) => value, "Enable this field before submitting."),
  jsonText: jsonTextSchema,
  password: z.string().min(8, "Password must be at least 8 characters."),
  phone: phoneSchema,
  state: z.string().trim().min(1, "State is required."),
  tags: z.array(z.string()).min(1, "Select at least one option."),
});

function ZodSubmitValidationPreview() {
  const form = useForm<FormPreviewValues>({
    defaultValues: invalidValues,
    resolver: createZodResolver<FormPreviewValues>(formPreviewSchema),
  });
  const [submittedValue, setSubmittedValue] =
    useState<Partial<FormPreviewValues> | null>(null);

  return (
    <div className="w-[min(820px,calc(100vw-3rem))]">
      <FormContainer
        form={form}
        formClassName="space-y-5"
        onSubmit={form.handleSubmit((values) => setSubmittedValue(values))}
        schema={formPreviewSchema}
        submitButton
        submitButtonText="Submit"
      >
        <FieldGroup>
          <FormWrappedField
            control={form.control}
            description="Regex validation: use a plain domain like xbase.app."
            inputGroupStartAddon="https://"
            label="Domain"
            name="domain"
            placeholder="example.com"
          />
          <PhoneInputField
            control={form.control}
            description="Validated with the shared phone zod schema."
            label="Phone"
            name="phone"
          />
          <PasswordInputField
            control={form.control}
            description="Minimum 8 characters."
            label="Password"
            name="password"
            placeholder="Enter password"
          />
          <FormWrappedField
            control={form.control}
            description="JSON text must parse before submit succeeds."
            enableJsonSwitcher
            jsonSwitcherDefaultMode="json"
            kind="textarea"
            label="JSON text"
            name="jsonText"
            rows={6}
          />
          <MultiSelectField
            control={form.control}
            description="At least one option is required."
            label="Multi select"
            name="tags"
            options={tagOptions}
          />
          <FormSwitchField
            control={form.control}
            description="Must be enabled before submit."
            label="Enabled"
            name="enabled"
          />
          <BlockListField
            control={form.control}
            description="At least one non-empty block is required."
            label="Multiple blocks"
            name="blocks"
          />
          <CountryStateCityField
            cityName="city"
            control={form.control}
            countryName="country"
            description="Country, state, and city are required."
            setValue={form.setValue}
            stateName="state"
          />
        </FieldGroup>
      </FormContainer>

      <div className="mt-4 rounded-md border bg-muted/20 p-3">
        <p className="mb-2 font-medium text-sm">Submitted value</p>
        <pre className="max-h-72 overflow-auto text-xs">
          {JSON.stringify(submittedValue, null, 2)}
        </pre>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Modules/Forms/Form Previews",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ZodSubmitValidation: Story = {
  render: () => <ZodSubmitValidationPreview />,
};
