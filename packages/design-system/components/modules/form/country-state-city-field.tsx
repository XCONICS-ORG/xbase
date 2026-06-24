"use client";

import { FormFieldLabelText } from "@xbase/design-system/components/modules/form/required-field";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@xbase/design-system/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@xbase/design-system/components/ui/select";
import { cn } from "@xbase/design-system/lib/utils";
import {
  City,
  Country,
  type ICity,
  type ICountry,
  type IState,
  State,
} from "country-state-city";
import type { ReactNode } from "react";
import { useEffect, useId, useMemo } from "react";
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
  type PathValue,
  type UseFormSetValue,
  useWatch,
} from "react-hook-form";

interface SelectOption {
  label: string;
  value: string;
}

export interface ResolvedCountryStateCityValue {
  city?: string;
  country?: string;
  state?: string;
}

export interface CountryStateCityFieldLabels {
  city?: ReactNode;
  country?: ReactNode;
  state?: ReactNode;
}

export interface CountryStateCityFieldPlaceholders {
  city?: string;
  country?: string;
  state?: string;
}

export interface CountryStateCityFieldProps<TFormValues extends FieldValues> {
  cityContentClassName?: string;
  cityFieldClassName?: string;
  cityFieldId?: string;
  cityName: FieldPath<TFormValues>;
  cityTriggerClassName?: string;
  className?: string;
  control: Control<TFormValues>;
  countryContentClassName?: string;
  countryFieldClassName?: string;
  countryFieldId?: string;
  countryName: FieldPath<TFormValues>;
  countryTriggerClassName?: string;
  description?: ReactNode;
  disabled?: boolean;
  gridClassName?: string;
  labels?: CountryStateCityFieldLabels;
  placeholders?: CountryStateCityFieldPlaceholders;
  required?: boolean;
  setValue: UseFormSetValue<TFormValues>;
  stateContentClassName?: string;
  stateFieldClassName?: string;
  stateFieldId?: string;
  stateName: FieldPath<TFormValues>;
  stateTriggerClassName?: string;
}

const toNullableValue = <TFormValues extends FieldValues>(value: string) =>
  (value || null) as PathValue<TFormValues, FieldPath<TFormValues>>;

const findOption = (options: SelectOption[], value?: null | string) => {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  return (
    options.find((option) => option.value.toLowerCase() === normalized) ??
    options.find((option) => option.label.toLowerCase() === normalized) ??
    null
  );
};

const getCountryOptions = () =>
  Country.getAllCountries().map((country: ICountry) => ({
    label: country.name,
    value: country.isoCode,
  }));

const getStateOptions = (countryCode?: null | string) =>
  countryCode
    ? State.getStatesOfCountry(countryCode).map((state: IState) => ({
        label: state.name,
        value: state.isoCode,
      }))
    : [];

const getCityOptions = (
  countryCode?: null | string,
  stateCode?: null | string
) =>
  countryCode && stateCode
    ? City.getCitiesOfState(countryCode, stateCode).map((city: ICity) => ({
        label: city.name,
        value: city.name,
      }))
    : [];

export const resolveCountryStateCityValue = ({
  city,
  country,
  state,
}: {
  city?: null | string;
  country?: null | string;
  state?: null | string;
}): ResolvedCountryStateCityValue => {
  const countryOption = findOption(getCountryOptions(), country);

  if (!countryOption) {
    return {};
  }

  const stateOption = findOption(getStateOptions(countryOption.value), state);

  if (!stateOption) {
    return {
      country: countryOption.value,
    };
  }

  const cityOption = findOption(
    getCityOptions(countryOption.value, stateOption.value),
    city
  );

  return {
    city: cityOption?.value ?? city?.trim() ?? undefined,
    country: countryOption.value,
    state: stateOption.value,
  };
};

export function CountryStateCityField<TFormValues extends FieldValues>({
  cityContentClassName,
  cityFieldClassName,
  cityFieldId,
  cityName,
  cityTriggerClassName,
  className,
  control,
  countryContentClassName,
  countryFieldClassName,
  countryFieldId,
  countryName,
  countryTriggerClassName,
  description,
  disabled,
  gridClassName,
  labels,
  placeholders,
  required,
  setValue,
  stateContentClassName,
  stateFieldClassName,
  stateFieldId,
  stateName,
  stateTriggerClassName,
}: CountryStateCityFieldProps<TFormValues>) {
  const reactId = useId().replaceAll(":", "");
  const resolvedCountryFieldId =
    countryFieldId ?? `${String(countryName).replace(/\W+/g, "-")}-${reactId}`;
  const resolvedStateFieldId =
    stateFieldId ?? `${String(stateName).replace(/\W+/g, "-")}-${reactId}`;
  const resolvedCityFieldId =
    cityFieldId ?? `${String(cityName).replace(/\W+/g, "-")}-${reactId}`;
  const selectedCountry = useWatch({ control, name: countryName }) as
    | null
    | string
    | undefined;
  const selectedState = useWatch({ control, name: stateName }) as
    | null
    | string
    | undefined;
  const selectedCity = useWatch({ control, name: cityName }) as
    | null
    | string
    | undefined;
  const countryOptions = useMemo(() => getCountryOptions(), []);
  const selectedCountryOption = useMemo(
    () => findOption(countryOptions, selectedCountry),
    [countryOptions, selectedCountry]
  );
  const countryValue = selectedCountryOption?.value ?? "";
  const stateOptions = useMemo(
    () => getStateOptions(countryValue),
    [countryValue]
  );
  const selectedStateOption = useMemo(
    () => findOption(stateOptions, selectedState),
    [selectedState, stateOptions]
  );
  const stateValue = selectedStateOption?.value ?? "";
  const cityOptions = useMemo(
    () => getCityOptions(countryValue, stateValue),
    [countryValue, stateValue]
  );
  const selectedCityOption = useMemo(
    () => findOption(cityOptions, selectedCity),
    [cityOptions, selectedCity]
  );
  const savedCityValue = selectedCity?.trim() ?? "";
  const cityValue = selectedCityOption?.value ?? savedCityValue;
  const citySelectOptions = useMemo(() => {
    if (
      !(savedCityValue && cityValue === savedCityValue && !selectedCityOption)
    ) {
      return cityOptions;
    }

    return [
      {
        label: savedCityValue,
        value: savedCityValue,
      },
      ...cityOptions,
    ];
  }, [cityOptions, cityValue, savedCityValue, selectedCityOption]);

  useEffect(() => {
    if (
      !selectedCountryOption ||
      selectedCountryOption.value === selectedCountry
    ) {
      return;
    }

    setValue(
      countryName,
      toNullableValue<TFormValues>(selectedCountryOption.value),
      {
        shouldDirty: false,
        shouldValidate: true,
      }
    );
  }, [countryName, selectedCountry, selectedCountryOption, setValue]);

  useEffect(() => {
    if (!selectedStateOption || selectedStateOption.value === selectedState) {
      return;
    }

    setValue(
      stateName,
      toNullableValue<TFormValues>(selectedStateOption.value),
      {
        shouldDirty: false,
        shouldValidate: true,
      }
    );
  }, [selectedState, selectedStateOption, setValue, stateName]);

  useEffect(() => {
    if (!selectedCityOption || selectedCityOption.value === selectedCity) {
      return;
    }

    setValue(cityName, toNullableValue<TFormValues>(selectedCityOption.value), {
      shouldDirty: false,
      shouldValidate: true,
    });
  }, [cityName, selectedCity, selectedCityOption, setValue]);

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn("grid grid-cols-1 gap-3 lg:grid-cols-3", gridClassName)}
      >
        <Controller
          control={control}
          name={countryName}
          render={({ field, fieldState }) => (
            <Field
              className={countryFieldClassName}
              data-invalid={fieldState.invalid}
            >
              <FieldLabel htmlFor={resolvedCountryFieldId}>
                <FormFieldLabelText name={countryName} required={required}>
                  {labels?.country ?? "Country"}
                </FormFieldLabelText>
              </FieldLabel>
              <Select
                disabled={disabled}
                onValueChange={(value) => {
                  field.onChange(value);
                  setValue(stateName, toNullableValue<TFormValues>(""), {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setValue(cityName, toNullableValue<TFormValues>(""), {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                value={countryValue}
              >
                <SelectTrigger
                  className={cn("w-full", countryTriggerClassName)}
                  id={resolvedCountryFieldId}
                >
                  <SelectValue
                    placeholder={placeholders?.country ?? "Select country"}
                  />
                </SelectTrigger>
                <SelectContent className={countryContentClassName}>
                  {countryOptions.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          control={control}
          name={stateName}
          render={({ field, fieldState }) => (
            <Field
              className={stateFieldClassName}
              data-invalid={fieldState.invalid}
            >
              <FieldLabel htmlFor={resolvedStateFieldId}>
                <FormFieldLabelText name={stateName} required={required}>
                  {labels?.state ?? "State"}
                </FormFieldLabelText>
              </FieldLabel>
              <Select
                disabled={disabled || !countryValue}
                onValueChange={(value) => {
                  field.onChange(value);
                  setValue(cityName, toNullableValue<TFormValues>(""), {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                value={stateValue}
              >
                <SelectTrigger
                  className={cn("w-full", stateTriggerClassName)}
                  id={resolvedStateFieldId}
                >
                  <SelectValue
                    placeholder={placeholders?.state ?? "Select state"}
                  />
                </SelectTrigger>
                <SelectContent className={stateContentClassName}>
                  {stateOptions.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          control={control}
          name={cityName}
          render={({ field, fieldState }) => (
            <Field
              className={cityFieldClassName}
              data-invalid={fieldState.invalid}
            >
              <FieldLabel htmlFor={resolvedCityFieldId}>
                <FormFieldLabelText name={cityName} required={required}>
                  {labels?.city ?? "City"}
                </FormFieldLabelText>
              </FieldLabel>
              <Select
                disabled={disabled || !countryValue || !stateValue}
                onValueChange={field.onChange}
                value={cityValue}
              >
                <SelectTrigger
                  className={cn("w-full", cityTriggerClassName)}
                  id={resolvedCityFieldId}
                >
                  <SelectValue
                    placeholder={placeholders?.city ?? "Select city"}
                  />
                </SelectTrigger>
                <SelectContent className={cityContentClassName}>
                  {citySelectOptions.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </div>
  );
}
