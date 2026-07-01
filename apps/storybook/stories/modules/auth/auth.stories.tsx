import type { Meta, StoryObj } from "@storybook/react";
import {
  AuthBlock,
  type AuthOtpPurpose,
  type AuthScreen,
  type AuthTwoFactorMethod,
  authBlockWidthPresets,
  authScreens,
} from "@xbase/design-system/components/modules/auth";
import { showWarningToast } from "@xbase/design-system/components/ui/sonner";
import { useState } from "react";

const storyActionDelay = 1200;

function runStoryAuthAction(action: string): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      showWarningToast("Authentication API is not configured", {
        description: `${action} completed as a Storybook demo.`,
      });
      resolve();
    }, storyActionDelay);
  });
}

const meta: Meta<typeof AuthBlock> = {
  title: "Modules/Auth/Block",
  component: AuthBlock,
  tags: ["autodocs"],
  args: {
    allowCreateAccount: true,
    autoSubmit: false,
    bordered: false,
    defaultEmail: "alex@example.com",
    defaultScreen: "sign-in",
    onCreateAccount: () => runStoryAuthAction("Create account"),
    onForgotPassword: () => runStoryAuthAction("Password reset request"),
    onResendOtp: () => runStoryAuthAction("Resend verification code"),
    onResetPassword: () => runStoryAuthAction("Reset password"),
    onSendTwoFactorEmail: () =>
      runStoryAuthAction("Send two-factor email code"),
    onSignIn: () => runStoryAuthAction("Sign in"),
    onSignInWithOtp: () => runStoryAuthAction("Send sign-in code"),
    onVerifyOtp: () => runStoryAuthAction("Verify one-time code"),
    onVerifyTwoFactor: () => runStoryAuthAction("Verify two-factor code"),
    otpLayout: "grouped",
    passwordRegex: true,
    primaryButtonVariant: "gradient",
    showAlternativeAction: true,
    showSeparator: true,
    supportHref:
      "https://wa.me/919832800571?text=Hello%20Team%2C%20I%20need%20help%20with%20authentication.",
    widthPreset: "default",
  },
  argTypes: {
    allowCreateAccount: {
      control: "boolean",
    },
    autoSubmit: {
      control: "boolean",
    },
    bordered: {
      control: "boolean",
    },
    onAutoSubmit: {
      control: false,
    },
    onSendTwoFactorEmail: {
      control: false,
    },
    onVerifyTwoFactor: {
      control: false,
    },
    defaultScreen: {
      control: "select",
      options: authScreens,
    },
    otpPurpose: {
      control: "select",
      options: ["sign-in", "email-verification", "password-reset"],
    },
    otpLayout: {
      control: "inline-radio",
      options: ["grouped", "distributed"],
    },
    screen: {
      control: "select",
      options: authScreens,
    },
    passwordRegex: {
      control: "boolean",
    },
    primaryButtonVariant: {
      control: "inline-radio",
      options: ["default", "gradient"],
    },
    resendSeconds: {
      control: { min: 0, type: "number" },
    },
    showAlternativeAction: {
      control: "boolean",
    },
    showSeparator: {
      control: "boolean",
    },
    twoFactorMethod: {
      control: "inline-radio",
      options: ["authenticator", "email"],
    },
    widthPreset: {
      control: "select",
      options: authBlockWidthPresets,
    },
  },
  render: (args) => <AuthBlock {...args} />,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    twoFactorMethod: "authenticator",
  },
};

const screenStories: Array<{
  name: string;
  purpose?: AuthOtpPurpose;
  screen: AuthScreen;
  twoFactorMethod?: AuthTwoFactorMethod;
}> = [
  { name: "Loading", screen: "loading" },
  { name: "Sign in", screen: "sign-in" },
  { name: "Create account", screen: "create-account" },
  { name: "Forgot password", screen: "forgot-password" },
  { name: "Sign in with OTP", screen: "sign-in-with-otp" },
  {
    name: "Two-factor verification",
    screen: "two-factor",
    twoFactorMethod: "authenticator",
  },
  { name: "Verify sign-in OTP", purpose: "sign-in", screen: "verify-otp" },
  {
    name: "Verify email OTP",
    purpose: "email-verification",
    screen: "verify-otp",
  },
  {
    name: "Verify password reset OTP",
    purpose: "password-reset",
    screen: "verify-otp",
  },
  { name: "Reset password", screen: "reset-password" },
];

export const AllVariants: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,26rem),1fr))] gap-6 bg-muted/30 p-6">
      {screenStories.map(({ name, purpose, screen, twoFactorMethod }) => (
        <section
          className="flex min-w-0 flex-col items-center rounded-lg border bg-background p-6"
          key={name}
        >
          <p className="mb-6 font-medium text-muted-foreground text-xs uppercase tracking-wide">
            {name}
          </p>
          <AuthBlock
            defaultEmail="alex@example.com"
            onCreateAccount={() => runStoryAuthAction("Create account")}
            onForgotPassword={() =>
              runStoryAuthAction("Password reset request")
            }
            onResendOtp={() => runStoryAuthAction("Resend verification code")}
            onResetPassword={() => runStoryAuthAction("Reset password")}
            onSendTwoFactorEmail={() =>
              runStoryAuthAction("Send two-factor email code")
            }
            onSignIn={() => runStoryAuthAction("Sign in")}
            onSignInWithOtp={() => runStoryAuthAction("Send sign-in code")}
            onVerifyOtp={() => runStoryAuthAction("Verify one-time code")}
            onVerifyTwoFactor={() =>
              runStoryAuthAction("Verify two-factor code")
            }
            otpPurpose={purpose}
            resendSeconds={screen === "verify-otp" ? 42 : 0}
            screen={screen}
            twoFactorMethod={twoFactorMethod}
          />
        </section>
      ))}
    </div>
  ),
};

export const SignIn: Story = { args: { screen: "sign-in" } };
export const Loading: Story = { args: { screen: "loading" } };
export const CreateAccount: Story = { args: { screen: "create-account" } };
export const ForgotPassword: Story = {
  args: { screen: "forgot-password" },
};
export const SignInWithOtp: Story = {
  args: { screen: "sign-in-with-otp" },
};
export const TwoFactorAuthenticator: Story = {
  args: {
    screen: "two-factor",
    twoFactorMethod: "authenticator",
  },
};
export const TwoFactorEmail: Story = {
  args: {
    resendSeconds: 26,
    screen: "two-factor",
    twoFactorMethod: "email",
  },
};
export const VerifyEmailOtp: Story = {
  args: {
    otpPurpose: "email-verification",
    resendSeconds: 42,
    screen: "verify-otp",
  },
};
export const OtpResendReady: Story = {
  args: {
    otpPurpose: "sign-in",
    resendSeconds: 0,
    screen: "verify-otp",
  },
};
export const DistributedOtp: Story = {
  args: {
    otpLayout: "distributed",
    otpPurpose: "sign-in",
    resendSeconds: 26,
    screen: "verify-otp",
  },
};
export const SignupDisabled: Story = {
  args: {
    allowCreateAccount: false,
    screen: "create-account",
  },
};
export const ResetPassword: Story = { args: { screen: "reset-password" } };
export const ErrorState: Story = {
  args: {
    error: "Those credentials could not be verified.",
    screen: "sign-in",
  },
};

export const InlineValidationErrors: Story = {
  args: {
    autoSubmit: true,
    defaultFormData: { email: "", password: "" },
    screen: "sign-in",
  },
};

export const PasswordPolicyDisabled: Story = {
  args: {
    passwordRegex: false,
    screen: "create-account",
  },
};

export const Bordered: Story = {
  args: {
    bordered: true,
    screen: "sign-in",
  },
};

export const AlternativeActionHidden: Story = {
  args: {
    screen: "sign-in-with-otp",
    showAlternativeAction: false,
  },
};

export const SeparatorHidden: Story = {
  args: {
    screen: "sign-in-with-otp",
    showSeparator: false,
  },
};

export const PrefilledCredentials: Story = {
  args: {
    defaultFormData: {
      email: "alex@example.com",
      password: "SecurePassword1!",
    },
    screen: "sign-in",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Equivalent web URL: /auth?auth_screen=sign-in&auth_email=alex%40example.com&auth_password=SecurePassword1%21",
      },
    },
  },
};

function AutoSubmitPreview() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="grid gap-3">
      <p className="text-muted-foreground text-xs/relaxed" role="status">
        {submitted
          ? "Sign-in form submitted automatically."
          : "Waiting for auto-submit…"}
      </p>
      <AuthBlock
        autoSubmit
        defaultFormData={{
          email: "alex@example.com",
          password: "SecurePassword1!",
        }}
        onSignIn={async () => {
          await runStoryAuthAction("Automatic sign in");
          setSubmitted(true);
        }}
        screen="sign-in"
      />
    </div>
  );
}

export const AutoSubmitFromParameters: Story = {
  render: () => <AutoSubmitPreview />,
};
