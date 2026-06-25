"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  PwaContextValue,
  PwaInstallOutcome,
  PwaProviderProps,
} from "./types";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: PwaInstallOutcome; platform: string }>;
};

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

const PwaContext = createContext<PwaContextValue | undefined>(undefined);

const isRunningAsInstalledApp = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as NavigatorWithStandalone).standalone === true;

export function PwaProvider({
  children,
  registerServiceWorker = true,
  scope = "/",
  serviceWorkerPath = "/sw.js",
  updateViaCache = "none",
}: PwaProviderProps) {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsInstalled(isRunningAsInstalledApp());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    if (registerServiceWorker && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(serviceWorkerPath, { scope, updateViaCache })
        .catch(() => undefined);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [registerServiceWorker, scope, serviceWorkerPath, updateViaCache]);

  const promptForInstall = useCallback(async () => {
    if (!installPrompt || isInstalled) {
      return null;
    }

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    setInstallPrompt(null);
    return outcome;
  }, [installPrompt, isInstalled]);

  const value = useMemo(
    () => ({
      canInstall: Boolean(installPrompt) && !isInstalled,
      promptForInstall,
    }),
    [installPrompt, isInstalled, promptForInstall]
  );

  return createElement(PwaContext.Provider, { value }, children);
}

export function usePwaInstall() {
  const context = useContext(PwaContext);

  if (!context) {
    throw new Error("usePwaInstall must be used within PwaProvider");
  }

  return context;
}
