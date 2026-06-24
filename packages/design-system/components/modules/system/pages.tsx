"use client";

import blockedIllustration from "@xbase/assets/images/modules/system/blocked.svg";
import inactiveIllustration from "@xbase/assets/images/modules/system/inactive.svg";
import maintenanceIllustration from "@xbase/assets/images/modules/system/maintenance.svg";
import notFoundIllustration from "@xbase/assets/images/modules/system/not-found.svg";
import rateLimitedIllustration from "@xbase/assets/images/modules/system/rate-limited.png";
import unsupportedIllustration from "@xbase/assets/images/modules/system/unsupported.svg";
import {
  IconArrowNarrowRight,
  IconLogout,
  IconRefresh,
} from "@xbase/icons/tabler";
import { Logo } from "@xbase/design-system/components/shared/logo";
import { Button } from "@xbase/design-system/components/ui/button";
import { cn } from "@xbase/design-system/lib/utils";
import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { useEffect, useState, useTransition } from "react";

export type SystemPageType =
  | "banned"
  | "inactive"
  | "noNetwork"
  | "notFound"
  | "rateLimited"
  | "unsupportedDevice";

type SystemPageAction = "goBack" | "logout" | "refresh" | "returnHome";

interface SystemPageCopy {
  description: ReactNode;
  image: StaticImageData;
  imageAlt: string;
  imageClassName?: string;
  title: string;
  titleClassName?: string;
}

interface SystemPageConfig extends SystemPageCopy {
  actions: SystemPageAction[];
}

export interface SystemPageProps {
  className?: string;
  contactHref?: string;
  contactLabel?: string;
  dashboardHref?: string;
  logo?: ReactNode;
  onGoBack?: () => Promise<void> | void;
  onLogout?: () => Promise<void> | void;
  onRefresh?: () => Promise<void> | void;
  onReturnHome?: () => Promise<void> | void;
  rateLimitSeconds?: number;
  type: SystemPageType;
}

const defaultRateLimitSeconds = 59;

const systemPageConfigs: Record<SystemPageType, SystemPageConfig> = {
  banned: {
    title: "Account Access Restricted",
    titleClassName: "mt-10",
    description: "Your account is currently banned.",
    image: blockedIllustration,
    imageAlt: "Account access restricted",
    imageClassName: "w-55",
    actions: ["refresh", "logout"],
  },
  inactive: {
    title: "Organization Inactive / Paused",
    titleClassName: "-mt-8",
    description:
      "The organization associated with this account is currently inactive or paused.",
    image: inactiveIllustration,
    imageAlt: "Organization inactive",
    imageClassName: "w-80",
    actions: ["refresh", "logout"],
  },
  noNetwork: {
    title: "No Internet or Server Connection",
    titleClassName: "-mt-8",
    description:
      "The app cannot reach the server right now. Check your connection or wait for the server to come back online, then try again.",
    image: maintenanceIllustration,
    imageAlt: "Network unavailable",
    imageClassName: "w-80",
    actions: ["refresh"],
  },
  notFound: {
    title: "Page Not Found",
    titleClassName: "-mt-8",
    description: "The page you are looking for doesn't exist.",
    image: notFoundIllustration,
    imageAlt: "Page not found",
    imageClassName: "w-80",
    actions: ["goBack", "returnHome"],
  },
  rateLimited: {
    title: "You've been rate limited for a while",
    description:
      "Too many requests have been made by this account. Please try again in some time.",
    image: rateLimitedIllustration,
    imageAlt: "Rate limited",
    imageClassName: "w-80",
    actions: ["refresh"],
  },
  unsupportedDevice: {
    title: "Unsupported Device",
    description:
      "Currently this software is not accessible from a mobile device.",
    image: unsupportedIllustration,
    imageAlt: "Unsupported device",
    imageClassName: "w-40",
    actions: [],
  },
};

function defaultRefresh() {
  window.location.reload();
}

function defaultReturnHome(dashboardHref: string) {
  window.location.assign(dashboardHref);
}

function defaultGoBack(dashboardHref: string) {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  defaultReturnHome(dashboardHref);
}

function ContactLine({
  contactHref,
  contactLabel = "Contact us",
}: Pick<SystemPageProps, "contactHref" | "contactLabel">) {
  if (!contactHref) {
    return null;
  }

  return (
    <p className="mt-2 max-w-md text-muted-foreground text-sm">
      Still have an issue?
      <a
        className="mx-1 text-primary"
        href={contactHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        {contactLabel}
      </a>
      for further assistance.
    </p>
  );
}

export function SystemPage({
  className,
  contactHref,
  contactLabel,
  dashboardHref = "/",
  logo,
  onGoBack,
  onLogout,
  onRefresh,
  onReturnHome,
  rateLimitSeconds = defaultRateLimitSeconds,
  type,
}: SystemPageProps) {
  const config = systemPageConfigs[type];
  const resolvedLogo =
    logo === undefined ? (
      <Logo className="w-30" priority variant="text" />
    ) : (
      logo
    );
  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<SystemPageAction | null>(
    null
  );
  const [countdown, setCountdown] = useState(
    type === "rateLimited" ? rateLimitSeconds : 0
  );

  useEffect(() => {
    if (type !== "rateLimited" || countdown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown((previousValue) => {
        if (previousValue <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return previousValue - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [countdown, type]);

  const runAction = (
    action: SystemPageAction,
    handler: (() => Promise<void> | void) | undefined,
    fallback: () => Promise<void> | void
  ) => {
    setActiveAction(action);
    startTransition(async () => {
      await (handler ?? fallback)();
      setActiveAction(null);
    });
  };

  const isActionPending = (action: SystemPageAction) =>
    isPending && activeAction === action;

  return (
    <div className={cn("relative min-h-screen px-4 py-4", className)}>
      {resolvedLogo ? (
        <div className="absolute top-3 left-4">{resolvedLogo}</div>
      ) : null}

      <div className="absolute top-1/2 left-1/2 flex w-full max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center px-5 text-center">
        <div className="flex items-center justify-center">
          <Image
            alt={config.imageAlt}
            className={cn(
              "pointer-events-none select-none object-contain",
              config.imageClassName ?? "w-[94%]"
            )}
            height={400}
            priority
            src={config.image}
            width={400}
          />
        </div>
        <h2
          className={cn(
            "font-semibold text-2xl text-secondary-foreground",
            config.titleClassName ?? "mt-5"
          )}
        >
          {config.title}
        </h2>
        <p className="mt-2 max-w-md text-muted-foreground text-sm">
          {config.description}
        </p>
        <ContactLine contactHref={contactHref} contactLabel={contactLabel} />

        {config.actions.length > 0 ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {config.actions.includes("goBack") ? (
              <Button
                onClick={() =>
                  runAction("goBack", onGoBack, () =>
                    defaultGoBack(dashboardHref)
                  )
                }
                variant="outline"
              >
                Go Back
              </Button>
            ) : null}

            {config.actions.includes("returnHome") ? (
              <Button
                onClick={() =>
                  runAction("returnHome", onReturnHome, () =>
                    defaultReturnHome(dashboardHref)
                  )
                }
              >
                Return to dashboard
                <IconArrowNarrowRight className="size-4 shrink-0 stroke-[1.5px]" />
              </Button>
            ) : null}

            {config.actions.includes("refresh") ? (
              <Button
                disabled={type === "rateLimited" && countdown > 0}
                loading={isActionPending("refresh")}
                loadingText="Checking Status"
                onClick={() => runAction("refresh", onRefresh, defaultRefresh)}
              >
                {type === "rateLimited" && countdown > 0
                  ? `Refresh in ${countdown}s`
                  : "Refresh Page"}
                <IconRefresh className="size-4 shrink-0 stroke-[1.5px]" />
              </Button>
            ) : null}

            {config.actions.includes("logout") ? (
              <Button
                loading={isActionPending("logout")}
                loadingText="Logging Out"
                onClick={() =>
                  runAction("logout", onLogout, () => {
                    window.location.assign("/auth");
                  })
                }
                rightIcon={<IconLogout className="size-4 shrink-0" />}
                variant="outline"
              >
                Logout
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function renderSystemPage(props: SystemPageProps) {
  return <SystemPage {...props} />;
}

export const BannedPage = (props: Omit<SystemPageProps, "type">) => (
  <SystemPage {...props} type="banned" />
);

export const InactivePage = (props: Omit<SystemPageProps, "type">) => (
  <SystemPage {...props} type="inactive" />
);

export const NoNetworkPage = (props: Omit<SystemPageProps, "type">) => (
  <SystemPage {...props} type="noNetwork" />
);

export const NotFoundPage = (props: Omit<SystemPageProps, "type">) => (
  <SystemPage {...props} type="notFound" />
);

export const RateLimitedPage = (props: Omit<SystemPageProps, "type">) => (
  <SystemPage {...props} type="rateLimited" />
);

export const UnsupportedDevicePage = (props: Omit<SystemPageProps, "type">) => (
  <SystemPage {...props} type="unsupportedDevice" />
);
