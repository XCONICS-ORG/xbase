import { WebMetadata } from "@xbase/constants/metadata/web/metadata";
import { AuthLayout } from "@xbase/design-system/components/modules/auth/layout";
import { createMetadata } from "@xbase/seo/metadata";
import type { ReactNode } from "react";

export const metadata = createMetadata({
  title: WebMetadata.auth.title,
  description: WebMetadata.auth.description,
});

export default function AuthenticationLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <AuthLayout mediaPosition={"right"}>{children}</AuthLayout>;
}
