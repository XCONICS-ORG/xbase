"use client";

import { FormFieldLabelText } from "@xbase/design-system/components/modules/form/required-field";
import { Button } from "@xbase/design-system/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@xbase/design-system/components/ui/command";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@xbase/design-system/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@xbase/design-system/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@xbase/design-system/components/ui/popover";
import { cn } from "@xbase/design-system/lib/utils";
import { GlobeIcon } from "@xbase/icons/lucide";
import { IconChevronDown } from "@xbase/icons/tabler";
import { lookup } from "country-data-list";
import type { CountryCode } from "libphonenumber-js";
import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
import type { ChangeEvent, ComponentProps } from "react";
import { useEffect, useId, useMemo, useState } from "react";
import { CircleFlag } from "react-circle-flags";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { z } from "zod";

export const phoneSchema = z.string().refine((value) => {
  try {
    return isValidPhoneNumber(value);
  } catch {
    return false;
  }
}, "Invalid phone number");

export interface CountryData {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
}

interface PhoneInputControlProps
  extends Omit<ComponentProps<"input">, "onChange" | "type" | "value"> {
  defaultCountry?: string;
  fixedCountry?: string;
  inline?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onCountryChange?: (data: CountryData | undefined) => void;
  value?: null | string;
}

export interface PhoneInputFieldProps<TFormValues extends FieldValues>
  extends Omit<
    PhoneInputControlProps,
    | "aria-invalid"
    | "className"
    | "disabled"
    | "id"
    | "name"
    | "onBlur"
    | "onChange"
    | "ref"
    | "value"
  > {
  className?: string;
  control: Control<TFormValues>;
  controlClassName?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  fieldId?: string;
  label?: React.ReactNode;
  name: Path<TFormValues>;
  required?: boolean;
}

const DEFAULT_COUNTRY = "IN";

const COUNTRIES: CountryData[] = lookup
  .countries({ status: "assigned" })
  .filter((country: CountryData | undefined): country is CountryData =>
    Boolean(country?.alpha2 && country.name)
  )
  .sort((left: CountryData, right: CountryData) =>
    left.name.localeCompare(right.name)
  );

const findCountryByAlpha2 = (countryCode?: null | string) => {
  if (!countryCode) {
    return;
  }

  return lookup.countries({ alpha2: countryCode.toUpperCase() })[0] as
    | CountryData
    | undefined;
};

const getDialCode = (country?: CountryData) =>
  country?.countryCallingCodes[0] ?? "";

function CountryFlag({ countryCode }: { countryCode?: string }) {
  return (
    <span className="flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-full">
      {countryCode ? (
        <CircleFlag
          countryCode={countryCode.toLowerCase()}
          height={16}
          width={16}
        />
      ) : (
        <GlobeIcon className="size-3.5" />
      )}
    </span>
  );
}

const sanitizePhoneInput = (value: string) => {
  if (value.trim().length === 0) {
    return "";
  }

  const trimmedValue = value.trim();
  const hasLeadingPlus =
    trimmedValue.startsWith("+") || trimmedValue.startsWith("00");
  const digitsOnly = value.replace(/\D/g, "").slice(0, 15);

  if (digitsOnly.length === 0) {
    return "";
  }

  return hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
};

const getNationalNumber = (value: string, country?: CountryData) => {
  try {
    const parsed = parsePhoneNumber(
      value,
      country?.alpha2?.toUpperCase() as CountryCode | undefined
    );

    return parsed?.nationalNumber ?? "";
  } catch {
    return value.replace(/\D/g, "");
  }
};

function PhoneInputControl({
  className,
  defaultCountry = DEFAULT_COUNTRY,
  fixedCountry,
  inline = false,
  onChange,
  onCountryChange,
  placeholder,
  ref,
  value,
  ...props
}: PhoneInputControlProps) {
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const initialCountry = useMemo(
    () =>
      findCountryByAlpha2(fixedCountry || defaultCountry || DEFAULT_COUNTRY),
    [defaultCountry, fixedCountry]
  );
  const [selectedCountry, setSelectedCountry] = useState<
    CountryData | undefined
  >(initialCountry);

  useEffect(() => {
    const nextCountry = findCountryByAlpha2(
      fixedCountry || defaultCountry || DEFAULT_COUNTRY
    );
    setSelectedCountry(nextCountry);
    onCountryChange?.(nextCountry);
  }, [defaultCountry, fixedCountry, onCountryChange]);

  useEffect(() => {
    if (fixedCountry || !value) {
      return;
    }

    try {
      const parsed = parsePhoneNumber(value);

      if (parsed?.country) {
        const detectedCountry = findCountryByAlpha2(parsed.country);

        if (detectedCountry) {
          setSelectedCountry(detectedCountry);
          onCountryChange?.(detectedCountry);
        }
      }
    } catch {
      // Keep the current country while the number is partial.
    }
  }, [fixedCountry, onCountryChange, value]);

  useEffect(() => {
    if (hasInitialized || value || !selectedCountry) {
      return;
    }

    const dialCode = getDialCode(selectedCountry);

    if (!dialCode) {
      return;
    }

    onChange?.({
      target: { value: dialCode },
    } as ChangeEvent<HTMLInputElement>);
    setHasInitialized(true);
  }, [hasInitialized, onChange, selectedCountry, value]);

  const emitChange = (
    nextValue: string,
    event?: ChangeEvent<HTMLInputElement>
  ) => {
    onChange?.(
      event
        ? ({
            ...event,
            currentTarget: {
              ...event.currentTarget,
              value: nextValue,
            },
            target: {
              ...event.target,
              value: nextValue,
            },
          } as ChangeEvent<HTMLInputElement>)
        : ({
            target: { value: nextValue },
          } as ChangeEvent<HTMLInputElement>)
    );
  };

  const handleCountrySelect = (countryCode: string) => {
    const nextCountry = findCountryByAlpha2(countryCode);

    if (!nextCountry) {
      return;
    }

    setSelectedCountry(nextCountry);
    onCountryChange?.(nextCountry);
    setIsCountrySelectorOpen(false);

    const nextDialCode = getDialCode(nextCountry);

    if (!nextDialCode) {
      return;
    }

    const currentValue = typeof value === "string" ? value : "";
    const nationalNumber = getNationalNumber(currentValue, selectedCountry);
    const nextValue = `${nextDialCode}${nationalNumber}` || nextDialCode;

    emitChange(nextValue);
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    let nextValue = sanitizePhoneInput(event.target.value);

    if (nextValue && !nextValue.startsWith("+")) {
      nextValue = `+${nextValue}`;
    }

    try {
      const parsed = fixedCountry
        ? parsePhoneNumber(nextValue, fixedCountry.toUpperCase() as CountryCode)
        : parsePhoneNumber(nextValue);

      if (parsed?.country && !fixedCountry) {
        const detectedCountry = findCountryByAlpha2(parsed.country);

        if (detectedCountry) {
          setSelectedCountry(detectedCountry);
          onCountryChange?.(detectedCountry);
        }
      }

      emitChange(parsed?.number ?? nextValue, event);
    } catch {
      emitChange(nextValue, event);
    }
  };

  const resolvedCountry =
    selectedCountry ?? findCountryByAlpha2(DEFAULT_COUNTRY);

  return (
    <InputGroup className={cn("overflow-hidden", className)}>
      {inline ? null : (
        <InputGroupAddon align="inline-start" className="gap-0 py-0 pl-0">
          <Popover
            onOpenChange={setIsCountrySelectorOpen}
            open={isCountrySelectorOpen}
          >
            <PopoverTrigger asChild>
              <Button
                className="h-8 gap-1.5 rounded-none border-0 px-2 shadow-none"
                disabled={props.disabled || Boolean(fixedCountry)}
                size="sm"
                type="button"
                variant="ghost"
              >
                <CountryFlag countryCode={resolvedCountry?.alpha2} />
                {fixedCountry ? null : (
                  <IconChevronDown className="size-3.5 text-muted-foreground" />
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-80 p-0">
              <Command>
                <CommandInput placeholder="Search country..." />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {COUNTRIES.map((country) => {
                      const countryDialCode = getDialCode(country);

                      return (
                        <CommandItem
                          data-checked={
                            resolvedCountry?.alpha2 === country.alpha2
                          }
                          key={country.alpha2}
                          onSelect={() => handleCountrySelect(country.alpha2)}
                          value={`${country.name} ${country.alpha2} ${countryDialCode}`}
                        >
                          <CountryFlag countryCode={country.alpha2} />
                          <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                            <span className="truncate">{country.name}</span>
                            <span className="text-muted-foreground">
                              {countryDialCode}
                            </span>
                          </span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      )}

      <InputGroupInput
        {...props}
        autoComplete="tel"
        className={cn(!inline && "border-l pl-2")}
        inputMode="tel"
        onChange={handlePhoneChange}
        placeholder={placeholder || "Enter number"}
        ref={ref}
        type="tel"
        value={value ?? ""}
      />
    </InputGroup>
  );
}

export function PhoneInputField<TFormValues extends FieldValues>({
  className,
  control,
  controlClassName,
  description,
  disabled,
  fieldId,
  label,
  name,
  required,
  ...inputProps
}: PhoneInputFieldProps<TFormValues>) {
  const reactId = useId().replaceAll(":", "");
  const resolvedFieldId =
    fieldId ?? `${String(name).replace(/\W+/g, "-")}-${reactId}`;

  return (
    <Controller
      control={control}
      disabled={disabled}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          className={className}
          data-disabled={disabled || undefined}
          data-invalid={fieldState.invalid}
        >
          {label ? (
            <FieldLabel htmlFor={resolvedFieldId}>
              <FormFieldLabelText name={name} required={required}>
                {label}
              </FormFieldLabelText>
            </FieldLabel>
          ) : null}
          <PhoneInputControl
            {...inputProps}
            aria-invalid={fieldState.invalid}
            className={controlClassName}
            disabled={disabled}
            id={resolvedFieldId}
            name={field.name}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(event.target.value)}
            ref={field.ref}
            value={typeof field.value === "string" ? field.value : ""}
          />
          {description ? (
            <FieldDescription>{description}</FieldDescription>
          ) : null}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
