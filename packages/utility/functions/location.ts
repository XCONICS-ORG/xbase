import { Country, State } from "country-state-city";

const normalizeValue = (value?: string | null) => {
  const normalized = value?.trim();
  return normalized ? normalized : null;
};

export const getCountryDisplayName = (countryValue?: string | null) => {
  const normalizedCountry = normalizeValue(countryValue);
  if (!normalizedCountry) {
    return null;
  }

  const countryByCode = Country.getCountryByCode(
    normalizedCountry.toUpperCase()
  );
  if (countryByCode) {
    return countryByCode.name;
  }

  const countryByName = Country.getAllCountries().find(
    (country) =>
      country.name.toLowerCase() === normalizedCountry.toLowerCase()
  );

  return countryByName?.name ?? normalizedCountry;
};

type StateDisplayNameOptions = {
  countryValue?: string | null;
  stateValue?: string | null;
};

export const getStateDisplayName = ({
  countryValue,
  stateValue,
}: StateDisplayNameOptions) => {
  const normalizedState = normalizeValue(stateValue);
  if (!normalizedState) {
    return null;
  }

  const normalizedCountry = normalizeValue(countryValue);
  if (!normalizedCountry) {
    return normalizedState;
  }

  const countryCode = Country.getCountryByCode(
    normalizedCountry.toUpperCase()
  )?.isoCode;
  if (!countryCode) {
    return normalizedState;
  }

  const stateByCode = State.getStateByCodeAndCountry(
    normalizedState.toUpperCase(),
    countryCode
  );
  if (stateByCode) {
    return stateByCode.name;
  }

  const stateByName = State.getStatesOfCountry(countryCode).find(
    (state) => state.name.toLowerCase() === normalizedState.toLowerCase()
  );

  return stateByName?.name ?? normalizedState;
};
