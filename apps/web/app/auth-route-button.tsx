"use client";

import { Button } from "@xbase/design-system/components/ui/button";
import { ArrowRightIcon } from "@xbase/icons/phosphor";

export function AuthRouteButton() {
  return (
    <Button href="/auth" rightIcon={<ArrowRightIcon />}>
      Open authentication
    </Button>
  );
}
