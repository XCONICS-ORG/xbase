"use client";

import {
  AuthBlock,
  type AuthOtpLayout,
} from "@xbase/design-system/components/modules/auth/auth-block";
import { showWarningToast } from "@xbase/design-system/components/ui/sonner";
import { useEffect, useRef, useState } from "react";
import { useAuthPageStore } from "@/store/auth";
import { getAuthSupportHref } from "./auth-support";
import { parseAuthUrlState } from "./auth-url-state";

interface AuthContentProps {
  allowCreateAccount?: boolean;
  otpLayout?: AuthOtpLayout;
}

const demoActionDelay = 2000;

function runDemoAuthAction(action: string): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      showWarningToast("Authentication API is not configured yet", {
        description: `${action} completed in local demo mode.`,
      });
      resolve();
    }, demoActionDelay);
  });
}

export function AuthContent({
  allowCreateAccount = true,
  otpLayout = "distributed",
}: AuthContentProps) {
  const [autoSubmit, setAutoSubmit] = useState(false);
  const [urlStateReady, setUrlStateReady] = useState(false);
  const pendingCleanUrlRef = useRef<URL | null>(null);
  const currentScreen = useAuthPageStore((state) => state.currentScreen);
  const formData = useAuthPageStore((state) => state.formData);
  const hasHydrated = useAuthPageStore((state) => state.hasHydrated);
  const otpPurpose = useAuthPageStore((state) => state.otpPurpose);
  const resendEndTime = useAuthPageStore((state) => state.resendEndTime);
  const resendTimer = useAuthPageStore((state) => state.resendTimer);
  const resetResendTimer = useAuthPageStore((state) => state.resetResendTimer);
  const setCurrentScreen = useAuthPageStore((state) => state.setCurrentScreen);
  const setOtpPurpose = useAuthPageStore((state) => state.setOtpPurpose);
  const startResendTimer = useAuthPageStore((state) => state.startResendTimer);
  const setTwoFactorMethod = useAuthPageStore(
    (state) => state.setTwoFactorMethod
  );
  const twoFactorMethod = useAuthPageStore((state) => state.twoFactorMethod);
  const updateFormData = useAuthPageStore((state) => state.updateFormData);
  const updateResendTimer = useAuthPageStore(
    (state) => state.updateResendTimer
  );
  const hydratedScreen =
    hasHydrated && urlStateReady ? currentScreen : "loading";
  const visibleScreen =
    hydratedScreen === "create-account" && !allowCreateAccount
      ? "sign-in"
      : hydratedScreen;

  useEffect(() => {
    let active = true;

    const initializeAuthState = async () => {
      await useAuthPageStore.persist.rehydrate();
      const parsedState = parseAuthUrlState(new URL(window.location.href));
      const state = useAuthPageStore.getState();

      if (Object.keys(parsedState.formData).length > 0) {
        state.updateFormData(parsedState.formData);
      }
      if (parsedState.otpPurpose) {
        state.setOtpPurpose(parsedState.otpPurpose);
      }
      if (parsedState.screen) {
        state.setCurrentScreen(parsedState.screen);
      }
      pendingCleanUrlRef.current = parsedState.cleanUrl ?? null;
      if (active) {
        setAutoSubmit(parsedState.autoSubmit);
        setUrlStateReady(true);
      }
    };

    initializeAuthState().catch(() => {
      if (active) {
        setUrlStateReady(true);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!(hasHydrated && resendEndTime)) {
      return;
    }

    const syncCountdown = () => {
      const remainingSeconds = Math.max(
        0,
        Math.ceil((resendEndTime - Date.now()) / 1000)
      );
      if (remainingSeconds === 0) {
        resetResendTimer();
        return;
      }
      updateResendTimer(remainingSeconds);
    };

    syncCountdown();
    const interval = window.setInterval(syncCountdown, 1000);
    return () => window.clearInterval(interval);
  }, [hasHydrated, resendEndTime, resetResendTimer, updateResendTimer]);

  const clearPendingAuthUrlParameters = () => {
    const cleanUrl = pendingCleanUrlRef.current;
    if (!cleanUrl) {
      return;
    }
    window.history.replaceState(
      null,
      "",
      `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`
    );
    pendingCleanUrlRef.current = null;
  };

  const handleScreenChange = (screen: typeof visibleScreen) => {
    const previousScreen = useAuthPageStore.getState().currentScreen;
    setCurrentScreen(screen);
    if (screen !== previousScreen) {
      clearPendingAuthUrlParameters();
    }
    if (screen === "verify-otp") {
      startResendTimer();
    }
  };

  return (
    <AuthBlock
      allowCreateAccount={allowCreateAccount}
      autoSubmit={autoSubmit}
      className="px-8"
      defaultFormData={formData}
      key={hasHydrated && urlStateReady ? "ready" : "loading"}
      onAutoSubmit={() => setAutoSubmit(false)}
      onCreateAccount={() => runDemoAuthAction("Create account")}
      onForgotPassword={() => runDemoAuthAction("Password reset request")}
      onFormDataChange={updateFormData}
      onOtpPurposeChange={setOtpPurpose}
      onResendOtp={async () => {
        await runDemoAuthAction("Resend verification code");
        startResendTimer();
      }}
      onResetPassword={() => runDemoAuthAction("Reset password")}
      onScreenChange={handleScreenChange}
      onSendTwoFactorEmail={async () => {
        await runDemoAuthAction("Send two-factor email code");
        startResendTimer();
      }}
      onSignIn={() => runDemoAuthAction("Sign in")}
      onSignInWithOtp={() => runDemoAuthAction("Send sign-in code")}
      onTwoFactorMethodChange={setTwoFactorMethod}
      onVerifyOtp={() => runDemoAuthAction("Verify one-time code")}
      onVerifyTwoFactor={() => runDemoAuthAction("Verify two-factor code")}
      otpLayout={otpLayout}
      otpPurpose={otpPurpose}
      resendSeconds={resendTimer}
      screen={visibleScreen}
      supportHref={getAuthSupportHref(visibleScreen)}
      twoFactorMethod={twoFactorMethod}
    />
  );
}
