import type { Meta, StoryObj } from "@storybook/react";
import {
  BlockListField,
  CountryStateCityField,
  FormContainer,
  MultiSelectField as FormMultiSelectField,
  PasswordInputField as FormPasswordInputField,
  PhoneInputField as FormPhoneInputField,
  FormSwitchField,
  FormWrappedField,
  GoogleMapPickerField,
} from "@xbase/design-system/components/modules/form";
import { Button } from "@xbase/design-system/components/ui/button";
import { FieldGroup } from "@xbase/design-system/components/ui/field";
import { IconSparkles } from "@xbase/icons/tabler";
import { generateRandomPassword } from "@xbase/utility/generators/password";
import { useEffect, useState } from "react";
import {
  type Path,
  type UseFormReturn,
  useForm,
  useWatch,
} from "react-hook-form";

const DOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.[a-z]{2,}$/i;
const JSON_TEXT_MODE_VALUE = "dummy text";
const JSON_MODE_VALUE = '{\n  "dummyText": "dummy text"\n}';

const getFormPreviewValue = (
  values: Partial<CustomFieldValues>,
  previewKeys: Array<keyof CustomFieldValues>
) =>
  Object.fromEntries(
    previewKeys.map((key) => [key, values[key]])
  ) as Partial<CustomFieldValues>;

function useDebouncedValue<TValue>(value: TValue, delayMs: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => window.clearTimeout(timeout);
  }, [delayMs, value]);

  return debouncedValue;
}

interface CustomFieldValues {
  address: {
    address?: null | string;
    latitude: number;
    longitude: number;
  } | null;
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

const defaultValues: CustomFieldValues = {
  address: {
    address: "Salt Lake, Kolkata, West Bengal, India",
    latitude: 22.5909,
    longitude: 88.4404,
  },
  blocks: ["First reusable content block"],
  city: "Kolkata",
  country: "IN",
  domain: "xconics.com",
  enabled: true,
  jsonText: JSON_TEXT_MODE_VALUE,
  password: "",
  phone: "+91",
  state: "WB",
  tags: ["analytics", "billing"],
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

function CustomFieldFrame({
  children,
  form,
  previewKeys,
  previewTitle = "Field value",
  widthClassName = "w-[min(560px,calc(100vw-3rem))]",
}: {
  children: React.ReactNode;
  form: UseFormReturn<CustomFieldValues>;
  previewKeys: Array<keyof CustomFieldValues>;
  previewTitle?: string;
  widthClassName?: string;
}) {
  const watchedFieldValues = useWatch({
    control: form.control,
    name: previewKeys as Path<CustomFieldValues>[],
  });
  const watchedFieldValueList = Array.isArray(watchedFieldValues)
    ? watchedFieldValues
    : [];
  const watchedPreviewValue = getFormPreviewValue(
    Object.fromEntries(
      previewKeys.map((key, index) => [
        key,
        watchedFieldValueList[index] ??
          form.getValues(key as Path<CustomFieldValues>),
      ])
    ) as Partial<CustomFieldValues>,
    previewKeys
  );
  const previewSnapshot = JSON.stringify(watchedPreviewValue, null, 2);
  const debouncedPreviewSnapshot = useDebouncedValue(previewSnapshot, 350);

  return (
    <div className={widthClassName}>
      <FormContainer form={form} formClassName="space-y-4">
        <FieldGroup>{children}</FieldGroup>
      </FormContainer>
      <div className="mt-4 rounded-md border bg-muted/20 p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="font-medium text-sm">{previewTitle}</p>
          <span className="text-muted-foreground text-xs">Auto preview</span>
        </div>
        <pre className="max-h-60 overflow-auto text-xs">
          {debouncedPreviewSnapshot}
        </pre>
      </div>
    </div>
  );
}

function PhoneInputPreview() {
  const form = useForm<CustomFieldValues>({ defaultValues });

  return (
    <CustomFieldFrame form={form} previewKeys={["phone"]}>
      <FormPhoneInputField
        control={form.control}
        description="Phone input from Proptryx, wired as a form custom field."
        label="Phone input"
        name="phone"
      />
    </CustomFieldFrame>
  );
}

function PasswordInputPreview() {
  const form = useForm<CustomFieldValues>({ defaultValues });

  return (
    <CustomFieldFrame form={form} previewKeys={["password"]}>
      <FormPasswordInputField
        control={form.control}
        description="Password input with show and hide control."
        label="Password input"
        name="password"
        placeholder="Enter password"
      />
    </CustomFieldFrame>
  );
}

function TextareaJsonTextPreview() {
  const form = useForm<CustomFieldValues>({ defaultValues });

  return (
    <CustomFieldFrame form={form} previewKeys={["jsonText"]}>
      <FormWrappedField
        control={form.control}
        description="Switch between normal text and JSON validation/formatting."
        enableJsonSwitcher
        jsonSwitcherDefaultMode="text"
        jsonSwitcherModeValues={{
          json: JSON_MODE_VALUE,
          text: JSON_TEXT_MODE_VALUE,
        }}
        kind="textarea"
        label="Textarea JSON/Text"
        name="jsonText"
        rows={8}
      />
    </CustomFieldFrame>
  );
}

function MapPickerFieldBasicPreview() {
  const form = useForm<CustomFieldValues>({ defaultValues });

  return (
    <CustomFieldFrame
      form={form}
      previewKeys={["address"]}
      widthClassName="w-[min(900px,calc(100vw-3rem))]"
    >
      <GoogleMapPickerField
        control={form.control}
        description="Basic map picker field storing address, latitude, and longitude."
        label="Map picker field"
        name="address"
      />
    </CustomFieldFrame>
  );
}

function MultiSelectPreview() {
  const form = useForm<CustomFieldValues>({ defaultValues });

  return (
    <CustomFieldFrame form={form} previewKeys={["tags"]}>
      <FormMultiSelectField
        control={form.control}
        description="Select multiple values and verify that the form stores an array."
        label="Multi select"
        name="tags"
        options={tagOptions}
      />
    </CustomFieldFrame>
  );
}

function SwitchFieldPreview() {
  const form = useForm<CustomFieldValues>({ defaultValues });

  return (
    <CustomFieldFrame form={form} previewKeys={["enabled"]}>
      <FormSwitchField
        control={form.control}
        description="Boolean switch field wired directly to the form value."
        label="Enabled"
        name="enabled"
      />
    </CustomFieldFrame>
  );
}

function MultipleBlockInputPreview() {
  const form = useForm<CustomFieldValues>({ defaultValues });

  return (
    <CustomFieldFrame form={form} previewKeys={["blocks"]}>
      <BlockListField
        control={form.control}
        description="Add, edit, and remove multiple text blocks."
        label="Multiple block input"
        name="blocks"
      />
    </CustomFieldFrame>
  );
}

function CountryStateCityPreview() {
  const form = useForm<CustomFieldValues>({ defaultValues });

  return (
    <CustomFieldFrame
      form={form}
      previewKeys={["country", "state", "city"]}
      widthClassName="w-[min(760px,calc(100vw-3rem))]"
    >
      <CountryStateCityField
        cityName="city"
        control={form.control}
        countryName="country"
        description="Linked country, state, and city field names inside one form field group."
        setValue={form.setValue}
        stateName="state"
      />
    </CustomFieldFrame>
  );
}

function GeneratedPasswordInputPreview() {
  const form = useForm<CustomFieldValues>({ defaultValues });

  return (
    <CustomFieldFrame form={form} previewKeys={["password"]}>
      <FormPasswordInputField
        control={form.control}
        description="The end button writes a generated value into the same controlled field."
        endAddon={
          <Button
            aria-label="Generate password"
            onClick={() =>
              form.setValue("password", generateRandomPassword(12), {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <IconSparkles />
          </Button>
        }
        label="Generated password"
        name="password"
        placeholder="Generate or enter password"
      />
    </CustomFieldFrame>
  );
}

function DomainInputPreview() {
  const form = useForm<CustomFieldValues>({ defaultValues });
  const domain = form.watch("domain");
  const trimmedDomain = domain.trim();
  const [lookupStatus, setLookupStatus] = useState<
    "error" | "idle" | "loading" | "success"
  >("idle");

  useEffect(() => {
    if (!trimmedDomain) {
      setLookupStatus("idle");
      return;
    }

    setLookupStatus("loading");
    const timeout = window.setTimeout(() => {
      const isValidDomain = DOMAIN_PATTERN.test(trimmedDomain);
      const isAvailable = !trimmedDomain.toLowerCase().includes("taken");

      setLookupStatus(isValidDomain && isAvailable ? "success" : "error");
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [trimmedDomain]);

  const faviconUrl =
    lookupStatus === "success" && trimmedDomain
      ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(trimmedDomain)}&sz=64`
      : null;

  return (
    <CustomFieldFrame form={form} previewKeys={["domain"]}>
      <FormWrappedField
        control={form.control}
        description="Checks domain format and availability, then previews the domain favicon."
        inputGroupStartAddon="https://"
        label="Domain input"
        lookupStatus={lookupStatus}
        name="domain"
        placeholder="example.com"
      />
      {faviconUrl ? (
        <div className="flex items-center gap-3 rounded-md border bg-muted/20 p-3">
          {/* biome-ignore lint/performance/noImgElement: Favicon preview uses a runtime third-party domain URL. */}
          <img
            alt={`${trimmedDomain} favicon`}
            className="size-8 rounded-sm border bg-background"
            height={32}
            src={faviconUrl}
            width={32}
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-sm">{trimmedDomain}</p>
            <p className="text-muted-foreground text-xs">Domain favicon</p>
          </div>
        </div>
      ) : null}
    </CustomFieldFrame>
  );
}

const meta: Meta = {
  title: "Modules/Forms/Custom Fields",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const PhoneInputField: Story = {
  render: () => <PhoneInputPreview />,
};

export const PasswordInputField: Story = {
  render: () => <PasswordInputPreview />,
};

export const TextareaJsonText: Story = {
  render: () => <TextareaJsonTextPreview />,
};

export const MapPickerFieldBasic: Story = {
  render: () => <MapPickerFieldBasicPreview />,
};

export const MultiSelectField: Story = {
  render: () => <MultiSelectPreview />,
};

export const SwitchField: Story = {
  render: () => <SwitchFieldPreview />,
};

export const MultipleBlockInput: Story = {
  render: () => <MultipleBlockInputPreview />,
};

export const CountryStateCitySelector: Story = {
  render: () => <CountryStateCityPreview />,
};

export const GeneratedPasswordInput: Story = {
  render: () => <GeneratedPasswordInputPreview />,
};

export const DomainInput: Story = {
  render: () => <DomainInputPreview />,
};
