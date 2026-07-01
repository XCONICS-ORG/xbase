"use client";

import type {
  AuthFormData,
  AuthOtpPurpose,
  AuthScreen,
  AuthTwoFactorMethod,
} from "@xbase/design-system/components/modules/auth/auth-block";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const AUTH_PAGE_STORAGE_KEY = "xbase-auth-flow";

const initialFormData: AuthFormData = {
  confirmPassword: "",
  email: "",
  name: "",
  otp: "",
  password: "",
};

interface AuthPageStore {
  currentScreen: AuthScreen;
  formData: AuthFormData;
  hasHydrated: boolean;
  otpPurpose: AuthOtpPurpose;
  previousScreen: AuthScreen | null;
  resendEndTime: number | null;
  resendTimer: number;
  resetAll: () => void;
  resetFormData: () => void;
  resetResendTimer: () => void;
  returnToPreviousScreen: () => void;
  setCurrentScreen: (screen: AuthScreen) => void;
  setHasHydrated: (hydrated: boolean) => void;
  setOtpPurpose: (purpose: AuthOtpPurpose) => void;
  setTwoFactorMethod: (method: AuthTwoFactorMethod) => void;
  startResendTimer: (seconds?: number) => void;
  twoFactorMethod: AuthTwoFactorMethod;
  updateFormData: (values: Partial<AuthFormData>) => void;
  updateResendTimer: (seconds: number) => void;
}

const initialState = {
  currentScreen: "sign-in" as AuthScreen,
  formData: initialFormData,
  hasHydrated: false,
  otpPurpose: "sign-in" as AuthOtpPurpose,
  previousScreen: null as AuthScreen | null,
  resendEndTime: null as number | null,
  resendTimer: 0,
  twoFactorMethod: "authenticator" as AuthTwoFactorMethod,
};

function formDataMatches(
  current: AuthFormData,
  incoming: Partial<AuthFormData>
): boolean {
  return Object.entries(incoming).every(
    ([key, value]) => current[key as keyof AuthFormData] === value
  );
}

export const useAuthPageStore = create<AuthPageStore>()(
  persist(
    (set) => ({
      ...initialState,
      resetAll: () => set({ ...initialState, hasHydrated: true }),
      resetFormData: () => set({ formData: { ...initialFormData } }),
      resetResendTimer: () => set({ resendEndTime: null, resendTimer: 0 }),
      returnToPreviousScreen: () =>
        set((state) => {
          if (!state.previousScreen) {
            return state;
          }
          return {
            currentScreen: state.previousScreen,
            previousScreen: state.currentScreen,
          };
        }),
      setCurrentScreen: (screen) =>
        set((state) => {
          if (state.currentScreen === screen) {
            return state;
          }
          return {
            currentScreen: screen,
            previousScreen: state.currentScreen,
          };
        }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setOtpPurpose: (otpPurpose) => set({ otpPurpose }),
      setTwoFactorMethod: (twoFactorMethod) => set({ twoFactorMethod }),
      startResendTimer: (seconds = 60) =>
        set({
          resendEndTime: Date.now() + seconds * 1000,
          resendTimer: seconds,
        }),
      updateFormData: (values) =>
        set((state) => {
          if (formDataMatches(state.formData, values)) {
            return state;
          }
          return { formData: { ...state.formData, ...values } };
        }),
      updateResendTimer: (resendTimer) => set({ resendTimer }),
    }),
    {
      name: AUTH_PAGE_STORAGE_KEY,
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
      partialize: (state) => ({
        ...state,
        currentScreen:
          state.currentScreen === "loading"
            ? (state.previousScreen ?? "sign-in")
            : state.currentScreen,
        formData: {
          ...state.formData,
          confirmPassword: "",
          otp: "",
          password: "",
        },
        hasHydrated: false,
      }),
      skipHydration: true,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export function clearAuthPageStore(): void {
  useAuthPageStore.getState().resetAll();
  useAuthPageStore.persist.clearStorage();
}
