"use client";

import { Loader } from "@xbase/design-system/components/modules/system/loader";
import { Button } from "@xbase/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@xbase/design-system/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@xbase/design-system/components/ui/field";
import { Input } from "@xbase/design-system/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@xbase/design-system/components/ui/input-otp";
import { PasswordInput } from "@xbase/design-system/components/ui/password-input";
import { cn } from "@xbase/design-system/lib/utils";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  EnvelopeSimpleIcon,
  XCircleIcon,
} from "@xbase/icons/phosphor";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  createAccountSchema,
  emailRequestSchema,
  resetPasswordSchema,
  signInSchema,
  verificationCodeFormSchema,
} from "./schema";
import { useAuthFormValidation } from "./use-auth-form-validation";

export const authScreens = [
  "loading",
  "sign-in",
  "create-account",
  "forgot-password",
  "sign-in-with-otp",
  "two-factor",
  "verify-otp",
  "reset-password",
] as const;

export type AuthScreen = (typeof authScreens)[number];
export type AuthOtpPurpose =
  | "sign-in"
  | "email-verification"
  | "password-reset";
export type AuthTwoFactorMethod = "authenticator" | "email";
export type AuthOtpLayout = "grouped" | "distributed";

export const authBlockWidthPresets = ["compact", "default", "wide"] as const;
export type AuthBlockWidthPreset = (typeof authBlockWidthPresets)[number];

export interface AuthFormData {
  confirmPassword: string;
  email: string;
  name: string;
  otp: string;
  password: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface CreateAccountCredentials extends AuthCredentials {
  confirmPassword: string;
  name: string;
}

export interface RequestOtpValues {
  email: string;
  purpose: AuthOtpPurpose;
}

export interface VerifyOtpValues extends RequestOtpValues {
  code: string;
}

export interface ResetPasswordValues {
  confirmPassword: string;
  email: string;
  password: string;
}

export interface VerifyTwoFactorValues {
  code: string;
  method: AuthTwoFactorMethod;
  trustDevice: boolean;
}

type AuthAction<T> = (values: T) => Promise<void> | void;

export interface AuthBlockProps {
  allowCreateAccount?: boolean;
  autoSubmit?: boolean;
  bordered?: boolean;
  className?: string;
  defaultEmail?: string;
  defaultFormData?: Partial<AuthFormData>;
  defaultScreen?: AuthScreen;
  error?: ReactNode;
  onAutoSubmit?: (screen: AuthScreen) => void;
  onCreateAccount?: AuthAction<CreateAccountCredentials>;
  onForgotPassword?: AuthAction<RequestOtpValues>;
  onFormDataChange?: (values: Partial<AuthFormData>) => void;
  onOtpPurposeChange?: (purpose: AuthOtpPurpose) => void;
  onResendOtp?: AuthAction<RequestOtpValues>;
  onResetPassword?: AuthAction<ResetPasswordValues>;
  onScreenChange?: (screen: AuthScreen) => void;
  onSendTwoFactorEmail?: () => Promise<void> | void;
  onSignIn?: AuthAction<AuthCredentials>;
  onSignInWithOtp?: AuthAction<RequestOtpValues>;
  onTwoFactorMethodChange?: (method: AuthTwoFactorMethod) => void;
  onVerifyOtp?: AuthAction<VerifyOtpValues>;
  onVerifyTwoFactor?: AuthAction<VerifyTwoFactorValues>;
  otpLayout?: AuthOtpLayout;
  otpPurpose?: AuthOtpPurpose;
  passwordRegex?: boolean;
  primaryButtonVariant?: "default" | "gradient";
  resendSeconds?: number;
  screen?: AuthScreen;
  showAlternativeAction?: boolean;
  showSeparator?: boolean;
  supportHref?: string;
  twoFactorMethod?: AuthTwoFactorMethod;
  widthPreset?: AuthBlockWidthPreset;
}

interface AuthCardProps {
  bordered: boolean;
  children: ReactNode;
  description: ReactNode;
  error?: ReactNode;
  title: ReactNode;
}

function AuthCard({
  bordered,
  children,
  description,
  error,
  title,
}: AuthCardProps) {
  return (
    <Card
      className={cn(
        "w-full gap-5 overflow-visible py-0",
        bordered ? "border bg-card p-4" : "border-0 bg-transparent ring-0"
      )}
    >
      <CardHeader className="gap-2 px-0">
        <CardTitle className="font-semibold text-2xl tracking-tight">
          {title}
        </CardTitle>
        <CardDescription className="max-w-sm text-sm/relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {error ? (
          <div
            className="mb-4 rounded-md border border-destructive/20 bg-destructive/8 px-3 py-2 text-destructive text-xs/relaxed"
            role="alert"
          >
            {error}
          </div>
        ) : null}
        {children}
      </CardContent>
    </Card>
  );
}

function TextAction({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="font-medium text-primary text-xs/relaxed underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-50"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function AuthSupportLink({ href }: { href: string }) {
  return (
    <p className="mt-5 text-center text-muted-foreground text-xs/relaxed">
      Facing an issue?{" "}
      <a
        className="font-medium text-primary underline underline-offset-4"
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        Contact support
      </a>
    </p>
  );
}

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

function formatCountdown(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getOtpFallbackLabel(purpose: AuthOtpPurpose): string {
  if (purpose === "sign-in") {
    return "Use password instead";
  }
  if (purpose === "password-reset") {
    return "Request a new code";
  }
  return "Use another email";
}

function getResendLabel(resending: boolean, resendSeconds: number): string {
  if (resending) {
    return "Resending…";
  }
  if (resendSeconds > 0) {
    return `Resend in ${formatCountdown(resendSeconds)}`;
  }
  return "Resend code";
}

function getOtpEntryScreen(purpose: AuthOtpPurpose): AuthScreen {
  if (purpose === "password-reset") {
    return "forgot-password";
  }
  if (purpose === "sign-in") {
    return "sign-in-with-otp";
  }
  return "create-account";
}

const authBlockWidthClasses: Record<AuthBlockWidthPreset, string> = {
  compact: "[--auth-block-width:22rem]",
  default: "[--auth-block-width:28rem]",
  wide: "[--auth-block-width:34rem]",
};

const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /\d/;
const specialCharacterRegex = /[^A-Za-z0-9\s]/;
const authFormFieldNames = {
  code: "otp",
  confirmPassword: "confirmPassword",
  email: "email",
  name: "name",
  password: "password",
} as const satisfies Record<string, keyof AuthFormData>;

function getAuthFormFieldName(name: string): keyof AuthFormData | undefined {
  if (name in authFormFieldNames) {
    return authFormFieldNames[name as keyof typeof authFormFieldNames];
  }
  return;
}

const passwordRequirements = [
  {
    label: "At least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "One uppercase letter",
    test: (value: string) => uppercaseRegex.test(value),
  },
  {
    label: "One lowercase letter",
    test: (value: string) => lowercaseRegex.test(value),
  },
  {
    label: "One number",
    test: (value: string) => numberRegex.test(value),
  },
  {
    label: "One special character",
    test: (value: string) => specialCharacterRegex.test(value),
  },
] as const;

function PasswordRequirements({ password }: { password: string }) {
  return (
    <div
      aria-live="polite"
      className="grid gap-1"
      data-slot="password-requirements"
    >
      <p className="font-medium text-foreground text-xs/relaxed">
        Password requirements
      </p>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
        {passwordRequirements.map((requirement) => {
          const valid = requirement.test(password);
          const Icon = valid ? CheckCircleIcon : XCircleIcon;

          return (
            <li
              className={cn(
                "flex items-center gap-1.5 text-xs/relaxed",
                valid
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              )}
              key={requirement.label}
            >
              <Icon
                aria-hidden="true"
                className="size-3.5 shrink-0"
                weight="fill"
              />
              {requirement.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const otpCopy: Record<AuthOtpPurpose, { description: string; title: string }> =
  {
    "email-verification": {
      title: "Verify your email",
      description: "Enter the verification code sent to your email address.",
    },
    "password-reset": {
      title: "Enter your reset code",
      description: "Enter the code we sent before choosing a new password.",
    },
    "sign-in": {
      title: "Enter your sign-in code",
      description: "Enter the one-time code sent to your email address.",
    },
  };

function AuthOtpSlots({ layout }: { layout: AuthOtpLayout }) {
  if (layout === "distributed") {
    return (
      <InputOTPGroup variant="distributed">
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    );
  }

  return (
    <>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </>
  );
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Screen branches remain colocated so the auth state machine has one render boundary.
export function AuthBlock({
  allowCreateAccount = true,
  autoSubmit = false,
  bordered = false,
  className,
  defaultEmail = "",
  defaultFormData,
  defaultScreen = "sign-in",
  error,
  onAutoSubmit,
  onCreateAccount,
  onForgotPassword,
  onFormDataChange,
  onOtpPurposeChange,
  onResendOtp,
  onResetPassword,
  onScreenChange,
  onSendTwoFactorEmail,
  onSignIn,
  onSignInWithOtp,
  onTwoFactorMethodChange,
  onVerifyTwoFactor,
  onVerifyOtp,
  otpLayout = "grouped",
  otpPurpose,
  passwordRegex = true,
  primaryButtonVariant = "gradient",
  resendSeconds = 0,
  screen,
  supportHref,
  showAlternativeAction = true,
  showSeparator = true,
  twoFactorMethod,
  widthPreset = "default",
}: AuthBlockProps) {
  const [internalScreen, setInternalScreen] = useState(defaultScreen);
  const [email, setEmail] = useState(defaultFormData?.email ?? defaultEmail);
  const [internalOtpPurpose, setInternalOtpPurpose] = useState<AuthOtpPurpose>(
    otpPurpose ?? "sign-in"
  );
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [sendingTwoFactorEmail, setSendingTwoFactorEmail] = useState(false);
  const [internalError, setInternalError] = useState<string>();
  const [password, setPassword] = useState(defaultFormData?.password ?? "");
  const [confirmPassword, setConfirmPassword] = useState(
    defaultFormData?.confirmPassword ?? ""
  );
  const [otpCode, setOtpCode] = useState(defaultFormData?.otp ?? "");
  const [internalTwoFactorMethod, setInternalTwoFactorMethod] =
    useState<AuthTwoFactorMethod>(twoFactorMethod ?? "authenticator");
  const autoSubmittedScreenRef = useRef<AuthScreen | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { clearFieldError, clearFieldErrors, fieldErrors, validate } =
    useAuthFormValidation();
  const id = useId();
  const requestedScreen = screen ?? internalScreen;
  const activeScreen =
    requestedScreen === "create-account" && !allowCreateAccount
      ? "sign-in"
      : requestedScreen;
  const activeOtpPurpose = otpPurpose ?? internalOtpPurpose;
  const activeTwoFactorMethod = twoFactorMethod ?? internalTwoFactorMethod;
  const visibleError = error ?? internalError;

  useEffect(() => {
    if (!autoSubmit) {
      autoSubmittedScreenRef.current = null;
      return;
    }
    if (
      activeScreen === "loading" ||
      autoSubmittedScreenRef.current === activeScreen
    ) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const form = rootRef.current?.querySelector("form");
      const submitButton = form?.querySelector<HTMLButtonElement>(
        'button[type="submit"]'
      );
      if (!(form && submitButton) || submitButton.disabled) {
        return;
      }
      autoSubmittedScreenRef.current = activeScreen;
      onAutoSubmit?.(activeScreen);
      form.requestSubmit(submitButton);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [activeScreen, autoSubmit, onAutoSubmit]);

  const changeScreen = (
    nextScreen: AuthScreen,
    nextPurpose?: AuthOtpPurpose
  ) => {
    const allowedScreen =
      nextScreen === "create-account" && !allowCreateAccount
        ? "sign-in"
        : nextScreen;
    setInternalError(undefined);
    clearFieldErrors();
    if (nextPurpose) {
      setInternalOtpPurpose(nextPurpose);
      onOtpPurposeChange?.(nextPurpose);
    }
    if (screen === undefined) {
      setInternalScreen(allowedScreen);
    }
    onScreenChange?.(allowedScreen);
  };

  const runAction = async <T,>(
    action: AuthAction<T> | undefined,
    values: T,
    onSuccess?: () => void
  ) => {
    setPending(true);
    setInternalError(undefined);
    try {
      await action?.(values);
      onSuccess?.();
    } catch (actionError: unknown) {
      setInternalError(getErrorMessage(actionError));
    } finally {
      setPending(false);
    }
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextEmail = getStringValue(formData, "email");
    const values = {
      email: nextEmail,
      password: getStringValue(formData, "password"),
    };
    if (!validate(signInSchema, values)) {
      return;
    }
    setEmail(nextEmail);
    await runAction(onSignIn, values);
  };

  const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextEmail = getStringValue(formData, "email");
    const password = getStringValue(formData, "password");
    const confirmPassword = getStringValue(formData, "confirmPassword");
    const values = {
      confirmPassword,
      email: nextEmail,
      name: getStringValue(formData, "name"),
      password,
    };
    if (!validate(createAccountSchema(passwordRegex), values)) {
      return;
    }
    setEmail(nextEmail);
    await runAction(onCreateAccount, values, () =>
      changeScreen("verify-otp", "email-verification")
    );
  };

  const handleOtpRequest = async (
    event: FormEvent<HTMLFormElement>,
    purpose: AuthOtpPurpose,
    action: AuthAction<RequestOtpValues> | undefined
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextEmail = getStringValue(formData, "email");
    if (!validate(emailRequestSchema, { email: nextEmail })) {
      return;
    }
    setEmail(nextEmail);
    await runAction(action, { email: nextEmail, purpose }, () =>
      changeScreen("verify-otp", purpose)
    );
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const code = getStringValue(formData, "code");
    if (!validate(verificationCodeFormSchema, { code })) {
      return;
    }
    await runAction(
      onVerifyOtp,
      {
        code,
        email,
        purpose: activeOtpPurpose,
      },
      activeOtpPurpose === "password-reset"
        ? () => changeScreen("reset-password")
        : undefined
    );
  };

  const handleVerifyTwoFactor = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const code = getStringValue(formData, "code");
    if (!validate(verificationCodeFormSchema, { code })) {
      return;
    }
    await runAction(onVerifyTwoFactor, {
      code,
      method: activeTwoFactorMethod,
      trustDevice: true,
    });
  };

  const handleSendTwoFactorEmail = async () => {
    if (
      pending ||
      sendingTwoFactorEmail ||
      !onSendTwoFactorEmail ||
      (activeTwoFactorMethod === "email" && resendSeconds > 0)
    ) {
      return;
    }
    setSendingTwoFactorEmail(true);
    setInternalError(undefined);
    try {
      await onSendTwoFactorEmail();
      setInternalTwoFactorMethod("email");
      onTwoFactorMethodChange?.("email");
    } catch (actionError: unknown) {
      setInternalError(getErrorMessage(actionError));
    } finally {
      setSendingTwoFactorEmail(false);
    }
  };

  const handleUseAuthenticator = () => {
    setInternalError(undefined);
    clearFieldErrors();
    setInternalTwoFactorMethod("authenticator");
    onTwoFactorMethodChange?.("authenticator");
  };

  const handleResendOtp = async () => {
    if (pending || resending || resendSeconds > 0 || !onResendOtp) {
      return;
    }
    setResending(true);
    setInternalError(undefined);
    try {
      await onResendOtp({ email, purpose: activeOtpPurpose });
    } catch (actionError: unknown) {
      setInternalError(getErrorMessage(actionError));
    } finally {
      setResending(false);
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = getStringValue(formData, "password");
    const confirmPassword = getStringValue(formData, "confirmPassword");
    const values = { confirmPassword, password };
    if (!validate(resetPasswordSchema(passwordRegex), values)) {
      return;
    }
    await runAction(onResetPassword, { ...values, email }, () =>
      changeScreen("sign-in")
    );
  };

  const sharedFormClassName = "grid gap-5";
  const primaryButtonClassName = "h-9 w-full";
  const showAlternativeSeparator = showAlternativeAction && showSeparator;
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };
  const handleOtpCodeChange = (value: string) => {
    setOtpCode(value);
    onFormDataChange?.({ otp: value });
    clearFieldError("code");
  };
  const handleFormDataChange = (event: FormEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const fieldName = getAuthFormFieldName(target.name);
    if (fieldName) {
      onFormDataChange?.({ [fieldName]: target.value });
      clearFieldError(target.name === "code" ? "code" : fieldName);
    }
  };

  return (
    <div
      className={cn(
        "w-[min(calc(100vw-3rem),var(--auth-block-width))] max-w-full",
        authBlockWidthClasses[widthPreset],
        className
      )}
      data-auth-screen={activeScreen}
      data-width-preset={widthPreset}
      onChange={handleFormDataChange}
      ref={rootRef}
    >
      {activeScreen === "loading" ? (
        <div className="flex min-h-72 w-full items-center justify-center">
          <Loader
            className="min-h-0 bg-transparent"
            fullHeight={false}
            size="md"
          />
        </div>
      ) : null}

      {activeScreen === "sign-in" ? (
        <AuthCard
          bordered={bordered}
          description="Use your credentials to securely access your account."
          error={visibleError}
          title="Welcome back"
        >
          <form
            className={sharedFormClassName}
            noValidate
            onSubmit={handleSignIn}
          >
            <FieldGroup>
              <Field data-invalid={Boolean(fieldErrors.email)}>
                <FieldLabel htmlFor={`${id}-sign-in-email`}>Email</FieldLabel>
                <Input
                  aria-invalid={Boolean(fieldErrors.email)}
                  autoComplete="email"
                  defaultValue={defaultFormData?.email ?? email}
                  disabled={pending}
                  id={`${id}-sign-in-email`}
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
                <FieldError>{fieldErrors.email}</FieldError>
              </Field>
              <Field data-invalid={Boolean(fieldErrors.password)}>
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel htmlFor={`${id}-sign-in-password`}>
                    Password
                  </FieldLabel>
                  <TextAction
                    disabled={pending}
                    onClick={() => changeScreen("forgot-password")}
                  >
                    Forgot password?
                  </TextAction>
                </div>
                <PasswordInput
                  aria-invalid={Boolean(fieldErrors.password)}
                  autoComplete="current-password"
                  defaultValue={defaultFormData?.password}
                  disabled={pending}
                  id={`${id}-sign-in-password`}
                  name="password"
                  placeholder="Enter your password"
                  required
                />
                <FieldError>{fieldErrors.password}</FieldError>
              </Field>
            </FieldGroup>
            <Button
              className={primaryButtonClassName}
              loading={pending}
              loadingText="Signing in"
              rightIcon={<ArrowRightIcon />}
              type="submit"
              variant={primaryButtonVariant}
            >
              Sign in
            </Button>
            {showAlternativeSeparator ? (
              <FieldSeparator>or</FieldSeparator>
            ) : null}
            {showAlternativeAction ? (
              <Button
                className={primaryButtonClassName}
                disabled={pending}
                onClick={() => changeScreen("sign-in-with-otp")}
                rightIcon={<ArrowRightIcon />}
                type="button"
                variant="outline"
              >
                Sign in with a code
              </Button>
            ) : null}
          </form>
          {allowCreateAccount ? (
            <p className="mt-5 text-center text-muted-foreground text-xs/relaxed">
              New here?{" "}
              <TextAction
                disabled={pending}
                onClick={() => changeScreen("create-account")}
              >
                Create an account
              </TextAction>
            </p>
          ) : null}
        </AuthCard>
      ) : null}

      {activeScreen === "create-account" ? (
        <AuthCard
          bordered={bordered}
          description="Create your account to get started."
          error={visibleError}
          title="Create an account"
        >
          <form
            className="grid gap-4"
            noValidate
            onSubmit={handleCreateAccount}
          >
            <FieldGroup className="gap-3">
              <Field data-invalid={Boolean(fieldErrors.name)}>
                <FieldLabel htmlFor={`${id}-create-name`}>Full name</FieldLabel>
                <Input
                  aria-invalid={Boolean(fieldErrors.name)}
                  autoComplete="name"
                  defaultValue={defaultFormData?.name}
                  disabled={pending}
                  id={`${id}-create-name`}
                  name="name"
                  placeholder="Your full name"
                  required
                />
                <FieldError>{fieldErrors.name}</FieldError>
              </Field>
              <Field data-invalid={Boolean(fieldErrors.email)}>
                <FieldLabel htmlFor={`${id}-create-email`}>Email</FieldLabel>
                <Input
                  aria-invalid={Boolean(fieldErrors.email)}
                  autoComplete="email"
                  defaultValue={defaultFormData?.email ?? email}
                  disabled={pending}
                  id={`${id}-create-email`}
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
                <FieldError>{fieldErrors.email}</FieldError>
              </Field>
              <Field data-invalid={Boolean(fieldErrors.password)}>
                <FieldLabel htmlFor={`${id}-create-password`}>
                  Password
                </FieldLabel>
                <PasswordInput
                  aria-invalid={Boolean(fieldErrors.password)}
                  autoComplete="new-password"
                  disabled={pending}
                  id={`${id}-create-password`}
                  minLength={passwordRegex ? 8 : undefined}
                  name="password"
                  onChange={handlePasswordChange}
                  placeholder="At least 8 characters"
                  required
                  value={password}
                />
                <FieldError>{fieldErrors.password}</FieldError>
                {passwordRegex ? (
                  <PasswordRequirements password={password} />
                ) : null}
              </Field>
              <Field data-invalid={Boolean(fieldErrors.confirmPassword)}>
                <FieldLabel htmlFor={`${id}-create-confirm-password`}>
                  Confirm password
                </FieldLabel>
                <PasswordInput
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  autoComplete="new-password"
                  disabled={pending}
                  id={`${id}-create-confirm-password`}
                  minLength={passwordRegex ? 8 : undefined}
                  name="confirmPassword"
                  onChange={handleConfirmPasswordChange}
                  placeholder="Repeat your password"
                  required
                  value={confirmPassword}
                />
                <FieldError>{fieldErrors.confirmPassword}</FieldError>
              </Field>
            </FieldGroup>
            <Button
              className={primaryButtonClassName}
              loading={pending}
              loadingText="Creating account"
              rightIcon={<ArrowRightIcon />}
              type="submit"
              variant={primaryButtonVariant}
            >
              Create account
            </Button>
          </form>
          <p className="mt-5 text-center text-muted-foreground text-xs/relaxed">
            Already have an account?{" "}
            <TextAction
              disabled={pending}
              onClick={() => changeScreen("sign-in")}
            >
              Sign in
            </TextAction>
          </p>
        </AuthCard>
      ) : null}

      {activeScreen === "forgot-password" ? (
        <AuthCard
          bordered={bordered}
          description="We’ll send a verification code to your email."
          error={visibleError}
          title="Reset your password"
        >
          <form
            className={sharedFormClassName}
            noValidate
            onSubmit={(event) =>
              handleOtpRequest(event, "password-reset", onForgotPassword)
            }
          >
            <Field data-invalid={Boolean(fieldErrors.email)}>
              <FieldLabel htmlFor={`${id}-forgot-email`}>Email</FieldLabel>
              <Input
                aria-invalid={Boolean(fieldErrors.email)}
                autoComplete="email"
                defaultValue={defaultFormData?.email ?? email}
                disabled={pending}
                id={`${id}-forgot-email`}
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
              <FieldError>{fieldErrors.email}</FieldError>
            </Field>
            <Button
              className={primaryButtonClassName}
              loading={pending}
              loadingText="Sending code"
              rightIcon={<ArrowRightIcon />}
              type="submit"
              variant={primaryButtonVariant}
            >
              Send reset code
            </Button>
          </form>
          {showAlternativeAction ? (
            <div className="mt-4 grid gap-4">
              {showAlternativeSeparator ? (
                <FieldSeparator>or</FieldSeparator>
              ) : null}
              <Button
                className={primaryButtonClassName}
                disabled={pending}
                onClick={() => changeScreen("sign-in")}
                rightIcon={<ArrowRightIcon />}
                type="button"
                variant="outline"
              >
                Back to sign in
              </Button>
            </div>
          ) : null}
        </AuthCard>
      ) : null}

      {activeScreen === "sign-in-with-otp" ? (
        <AuthCard
          bordered={bordered}
          description="We’ll email you a one-time code for passwordless sign in."
          error={visibleError}
          title="Sign in with a code"
        >
          <form
            className={sharedFormClassName}
            noValidate
            onSubmit={(event) =>
              handleOtpRequest(event, "sign-in", onSignInWithOtp)
            }
          >
            <Field data-invalid={Boolean(fieldErrors.email)}>
              <FieldLabel htmlFor={`${id}-otp-email`}>Email</FieldLabel>
              <Input
                aria-invalid={Boolean(fieldErrors.email)}
                autoComplete="email"
                defaultValue={defaultFormData?.email ?? email}
                disabled={pending}
                id={`${id}-otp-email`}
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
              <FieldError>{fieldErrors.email}</FieldError>
            </Field>
            <Button
              className={primaryButtonClassName}
              loading={pending}
              loadingText="Sending code"
              rightIcon={<ArrowRightIcon />}
              type="submit"
              variant={primaryButtonVariant}
            >
              Send sign-in code
            </Button>
          </form>
          {showAlternativeAction ? (
            <div className="mt-4 grid gap-4">
              {showAlternativeSeparator ? (
                <FieldSeparator>or</FieldSeparator>
              ) : null}
              <Button
                className={primaryButtonClassName}
                disabled={pending}
                onClick={() => changeScreen("sign-in")}
                rightIcon={<ArrowRightIcon />}
                type="button"
                variant="outline"
              >
                Use password instead
              </Button>
            </div>
          ) : null}
        </AuthCard>
      ) : null}

      {activeScreen === "two-factor" ? (
        <AuthCard
          bordered={bordered}
          description={
            activeTwoFactorMethod === "email"
              ? "Enter the code sent to your email to continue."
              : "Enter the code from your authenticator app to continue."
          }
          error={visibleError}
          title="Two-Factor Verification"
        >
          <form
            className={sharedFormClassName}
            noValidate
            onSubmit={handleVerifyTwoFactor}
          >
            <Field data-invalid={Boolean(fieldErrors.code)}>
              <FieldLabel htmlFor={`${id}-two-factor-code`}>
                Verification code
              </FieldLabel>
              <InputOTP
                aria-invalid={Boolean(fieldErrors.code)}
                aria-label="Six digit two-factor verification code"
                autoComplete="one-time-code"
                containerClassName={cn(
                  "justify-center",
                  otpLayout === "distributed" && "w-full"
                )}
                disabled={pending || sendingTwoFactorEmail}
                id={`${id}-two-factor-code`}
                maxLength={6}
                name="code"
                onChange={handleOtpCodeChange}
                pattern="[0-9]*"
                required
                value={otpCode}
              >
                <AuthOtpSlots layout={otpLayout} />
              </InputOTP>
              <FieldError>{fieldErrors.code}</FieldError>
            </Field>
            <Button
              className={primaryButtonClassName}
              disabled={sendingTwoFactorEmail}
              loading={pending}
              loadingText="Verifying"
              rightIcon={<ArrowRightIcon />}
              type="submit"
              variant={primaryButtonVariant}
            >
              {activeTwoFactorMethod === "email"
                ? "Verify email code"
                : "Verify authenticator code"}
            </Button>
          </form>
          {showAlternativeAction ? (
            <div className="mt-4 grid gap-4">
              {activeTwoFactorMethod === "email" ? (
                <>
                  <div className="flex items-center justify-between gap-4 text-xs/relaxed">
                    <span className="text-foreground">
                      Did not receive a code?
                    </span>
                    <button
                      aria-live="polite"
                      className="shrink-0 font-medium text-primary underline-offset-4 hover:underline disabled:pointer-events-none disabled:text-muted-foreground"
                      disabled={
                        pending ||
                        sendingTwoFactorEmail ||
                        resendSeconds > 0 ||
                        !onSendTwoFactorEmail
                      }
                      onClick={handleSendTwoFactorEmail}
                      type="button"
                    >
                      {getResendLabel(sendingTwoFactorEmail, resendSeconds)}
                    </button>
                  </div>
                  {showAlternativeSeparator ? (
                    <FieldSeparator>or</FieldSeparator>
                  ) : null}
                  <Button
                    className={primaryButtonClassName}
                    disabled={pending || sendingTwoFactorEmail}
                    onClick={handleUseAuthenticator}
                    rightIcon={<ArrowRightIcon />}
                    type="button"
                    variant="outline"
                  >
                    Use authenticator instead
                  </Button>
                </>
              ) : (
                <>
                  {showAlternativeSeparator ? (
                    <FieldSeparator>or</FieldSeparator>
                  ) : null}
                  <Button
                    className={primaryButtonClassName}
                    disabled={pending || !onSendTwoFactorEmail}
                    leftIcon={<EnvelopeSimpleIcon />}
                    loading={sendingTwoFactorEmail}
                    loadingText="Sending code"
                    onClick={handleSendTwoFactorEmail}
                    type="button"
                    variant="outline"
                  >
                    Verify via email
                  </Button>
                </>
              )}
            </div>
          ) : null}
        </AuthCard>
      ) : null}

      {activeScreen === "verify-otp" ? (
        <AuthCard
          bordered={bordered}
          description={
            <>
              {otpCopy[activeOtpPurpose].description}
              {email ? (
                <span className="mt-1 block font-medium text-foreground">
                  {email}
                </span>
              ) : null}
            </>
          }
          error={visibleError}
          title={otpCopy[activeOtpPurpose].title}
        >
          <form
            className={sharedFormClassName}
            noValidate
            onSubmit={handleVerifyOtp}
          >
            <Field data-invalid={Boolean(fieldErrors.code)}>
              <FieldLabel htmlFor={`${id}-verification-code`}>
                Verification code
              </FieldLabel>
              <InputOTP
                aria-invalid={Boolean(fieldErrors.code)}
                aria-label="Six digit verification code"
                autoComplete="one-time-code"
                containerClassName={cn(
                  "justify-center",
                  otpLayout === "distributed" && "w-full"
                )}
                disabled={pending || resending}
                id={`${id}-verification-code`}
                maxLength={6}
                name="code"
                onChange={handleOtpCodeChange}
                pattern="[0-9]*"
                required
                value={otpCode}
              >
                <AuthOtpSlots layout={otpLayout} />
              </InputOTP>
              <FieldError>{fieldErrors.code}</FieldError>
            </Field>
            <Button
              className={primaryButtonClassName}
              disabled={resending}
              loading={pending}
              loadingText="Verifying"
              rightIcon={<ArrowRightIcon />}
              type="submit"
              variant={primaryButtonVariant}
            >
              Verify code
            </Button>
          </form>
          <div className="mt-4 grid gap-4">
            <div className="flex items-center justify-between gap-4 text-xs/relaxed">
              <span className="text-foreground">Did not receive a code?</span>
              <button
                aria-live="polite"
                className="shrink-0 font-medium text-primary underline-offset-4 hover:underline disabled:pointer-events-none disabled:text-muted-foreground"
                disabled={
                  pending || resending || resendSeconds > 0 || !onResendOtp
                }
                onClick={handleResendOtp}
                type="button"
              >
                {getResendLabel(resending, resendSeconds)}
              </button>
            </div>
            {showAlternativeSeparator ? (
              <FieldSeparator>or</FieldSeparator>
            ) : null}
            {showAlternativeAction ? (
              <Button
                className={primaryButtonClassName}
                disabled={pending || resending}
                onClick={() =>
                  changeScreen(getOtpEntryScreen(activeOtpPurpose))
                }
                rightIcon={<ArrowRightIcon />}
                type="button"
                variant="outline"
              >
                {getOtpFallbackLabel(activeOtpPurpose)}
              </Button>
            ) : null}
          </div>
        </AuthCard>
      ) : null}

      {activeScreen === "reset-password" ? (
        <AuthCard
          bordered={bordered}
          description="Choose a strong password you haven’t used before."
          error={visibleError}
          title="Set a new password"
        >
          <form
            className={sharedFormClassName}
            noValidate
            onSubmit={handleResetPassword}
          >
            <FieldGroup>
              <Field data-invalid={Boolean(fieldErrors.password)}>
                <FieldLabel htmlFor={`${id}-reset-password`}>
                  New password
                </FieldLabel>
                <PasswordInput
                  aria-invalid={Boolean(fieldErrors.password)}
                  autoComplete="new-password"
                  disabled={pending}
                  id={`${id}-reset-password`}
                  minLength={passwordRegex ? 8 : undefined}
                  name="password"
                  onChange={handlePasswordChange}
                  placeholder="At least 8 characters"
                  required
                  value={password}
                />
                <FieldError>{fieldErrors.password}</FieldError>
                {passwordRegex ? (
                  <PasswordRequirements password={password} />
                ) : null}
              </Field>
              <Field data-invalid={Boolean(fieldErrors.confirmPassword)}>
                <FieldLabel htmlFor={`${id}-confirm-password`}>
                  Confirm new password
                </FieldLabel>
                <PasswordInput
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  autoComplete="new-password"
                  disabled={pending}
                  id={`${id}-confirm-password`}
                  minLength={passwordRegex ? 8 : undefined}
                  name="confirmPassword"
                  onChange={handleConfirmPasswordChange}
                  placeholder="Repeat your new password"
                  required
                  value={confirmPassword}
                />
                <FieldError>{fieldErrors.confirmPassword}</FieldError>
              </Field>
            </FieldGroup>
            <Button
              className={primaryButtonClassName}
              loading={pending}
              loadingText="Updating password"
              rightIcon={<ArrowRightIcon />}
              type="submit"
              variant={primaryButtonVariant}
            >
              Update password
            </Button>
          </form>
          {showAlternativeAction ? (
            <div className="mt-4 grid gap-4">
              {showAlternativeSeparator ? (
                <FieldSeparator>or</FieldSeparator>
              ) : null}
              <Button
                className={primaryButtonClassName}
                disabled={pending}
                onClick={() => changeScreen("sign-in")}
                rightIcon={<ArrowRightIcon />}
                type="button"
                variant="outline"
              >
                Back to sign in
              </Button>
            </div>
          ) : null}
        </AuthCard>
      ) : null}

      {activeScreen !== "loading" && supportHref ? (
        <AuthSupportLink href={supportHref} />
      ) : null}
    </div>
  );
}
