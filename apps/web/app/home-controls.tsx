"use client";

import { ModeToggle } from "@xbase/design-system/components/mode-toggle";
import { Button } from "@xbase/design-system/components/ui/button";

export function HomeControls() {
  return (
    <div className="flex items-center gap-2">
      <Button>Button</Button>
      <ModeToggle />
    </div>
  );
}
