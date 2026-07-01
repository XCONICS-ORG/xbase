import type {
  AuthFormData,
  AuthOtpPurpose,
  AuthScreen,
} from "@xbase/design-system/components/modules/auth/auth-block";

export const AUTH_URL_PARAMS = {
  buttonAction: "auth_button_action",
  confirmPassword: "auth_confirm_password",
  email: "auth_email",
  name: "auth_name",
  otp: "auth_otp",
  otpPurpose: "auth_otp_purpose",
  password: "auth_password",
  screen: "auth_screen",
} as const;

/**
 * Supported URL examples (dummy values):
 *
 * Canonical sign-in with automatic primary-action submit:
 * https://example.com/auth?auth_screen=sign-in&auth_email=alex%40example.com&auth_password=SecurePassword1%21&auth_button_action=true
 *
 * Minimal equivalent:
 * https://example.com/auth?s=sign-in&e=alex%40example.com&p=SecurePassword1%21&a=true
 *
 * Request a password-reset code:
 * https://example.com/auth?s=forgot-password&e=alex%40example.com&a=true
 *
 * Open OTP verification with a prefilled dummy code:
 * https://example.com/auth?s=verify-otp&e=alex%40example.com&otp=123456&purpose=sign-in&a=true
 *
 * URL credentials can appear in browser history, proxy logs, and analytics.
 * Use them only for trusted, short-lived handoffs; prefer secure server sessions
 * for production authentication.
 */
export interface ParsedAuthUrlState {
  autoSubmit: boolean;
  cleanUrl?: URL;
  formData: Partial<AuthFormData>;
  otpPurpose?: AuthOtpPurpose;
  screen?: AuthScreen;
}

const parameterAliases = {
  buttonAction: [
    AUTH_URL_PARAMS.buttonAction,
    "button_action",
    "buttonAction",
    "action",
    "a",
  ],
  confirmPassword: [
    AUTH_URL_PARAMS.confirmPassword,
    "confirm_password",
    "confirmPassword",
    "cp",
  ],
  email: [AUTH_URL_PARAMS.email, "cred_email", "email", "e"],
  name: [AUTH_URL_PARAMS.name, "name", "n"],
  otp: [AUTH_URL_PARAMS.otp, "otp", "code"],
  otpPurpose: [AUTH_URL_PARAMS.otpPurpose, "otp_purpose", "purpose"],
  password: [AUTH_URL_PARAMS.password, "cred_password", "password", "p"],
  screen: [AUTH_URL_PARAMS.screen, "screen", "mode", "s"],
} as const;

const screenAliases: Record<string, AuthScreen> = {
  "create-account": "create-account",
  "forgot-password": "forgot-password",
  "reset-password": "reset-password",
  "sign-in": "sign-in",
  "sign-in-with-code": "sign-in-with-otp",
  "sign-in-with-otp": "sign-in-with-otp",
  "two-factor": "two-factor",
  "verify-otp": "verify-otp",
};

const otpPurposes = [
  "sign-in",
  "email-verification",
  "password-reset",
] as const satisfies readonly AuthOtpPurpose[];

function getParam(
  searchParams: URLSearchParams,
  hashParams: URLSearchParams,
  keys: readonly string[]
): string | undefined {
  for (const key of keys) {
    const value = searchParams.get(key) ?? hashParams.get(key);
    if (value !== null) {
      return value;
    }
  }
  return;
}

function parseScreen(value: string | undefined): AuthScreen | undefined {
  if (!value) {
    return;
  }
  return screenAliases[value.trim().toLowerCase()];
}

function parseOtpPurpose(
  value: string | undefined
): AuthOtpPurpose | undefined {
  if (!value) {
    return;
  }
  const normalized = value.trim().toLowerCase() as AuthOtpPurpose;
  return otpPurposes.includes(normalized) ? normalized : undefined;
}

function isAutoAction(value: string | undefined): boolean {
  const mode = value?.split(":")[0]?.trim().toLowerCase();
  return mode === "auto" || mode === "true" || mode === "1";
}

function createCleanUrl(url: URL): URL | undefined {
  const cleanUrl = new URL(url.href);
  const hashParams = new URLSearchParams(cleanUrl.hash.slice(1));
  let changed = false;

  for (const keys of Object.values(parameterAliases)) {
    for (const key of keys) {
      if (cleanUrl.searchParams.has(key)) {
        cleanUrl.searchParams.delete(key);
        changed = true;
      }
      if (hashParams.has(key)) {
        hashParams.delete(key);
        changed = true;
      }
    }
  }

  if (!changed) {
    return;
  }
  cleanUrl.hash = hashParams.size > 0 ? hashParams.toString() : "";
  return cleanUrl;
}

export function parseAuthUrlState(url: URL): ParsedAuthUrlState {
  const hashParams = new URLSearchParams(url.hash.slice(1));
  const formData: Partial<AuthFormData> = {};
  const formParameterMap = {
    confirmPassword: parameterAliases.confirmPassword,
    email: parameterAliases.email,
    name: parameterAliases.name,
    otp: parameterAliases.otp,
    password: parameterAliases.password,
  } as const satisfies Record<keyof AuthFormData, readonly string[]>;

  for (const [field, aliases] of Object.entries(formParameterMap)) {
    const value = getParam(url.searchParams, hashParams, aliases);
    if (value !== undefined) {
      formData[field as keyof AuthFormData] = value;
    }
  }

  return {
    autoSubmit: isAutoAction(
      getParam(url.searchParams, hashParams, parameterAliases.buttonAction)
    ),
    cleanUrl: createCleanUrl(url),
    formData,
    otpPurpose: parseOtpPurpose(
      getParam(url.searchParams, hashParams, parameterAliases.otpPurpose)
    ),
    screen: parseScreen(
      getParam(url.searchParams, hashParams, parameterAliases.screen)
    ),
  };
}
