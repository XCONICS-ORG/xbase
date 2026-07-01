import {
  COMPANY_CONFIG,
  createCompanySupportHref,
} from "@xbase/constants/data/company";
import type { AuthScreen } from "@xbase/design-system/components/modules/auth/auth-block";

const authSupportMessages: Record<Exclude<AuthScreen, "loading">, string> = {
  "create-account": COMPANY_CONFIG.QUICK_MESSAGES.AUTH.CREATE_ACCOUNT,
  "forgot-password": COMPANY_CONFIG.QUICK_MESSAGES.AUTH.FORGOT_PASSWORD,
  "reset-password": COMPANY_CONFIG.QUICK_MESSAGES.AUTH.RESET_PASSWORD,
  "sign-in": COMPANY_CONFIG.QUICK_MESSAGES.AUTH.SIGN_IN,
  "sign-in-with-otp": COMPANY_CONFIG.QUICK_MESSAGES.AUTH.SIGN_IN_WITH_OTP,
  "two-factor": COMPANY_CONFIG.QUICK_MESSAGES.AUTH.TWO_FACTOR,
  "verify-otp": COMPANY_CONFIG.QUICK_MESSAGES.AUTH.VERIFY_OTP,
};

export function getAuthSupportHref(screen: AuthScreen): string | undefined {
  if (screen === "loading") {
    return;
  }
  return createCompanySupportHref(authSupportMessages[screen]);
}
