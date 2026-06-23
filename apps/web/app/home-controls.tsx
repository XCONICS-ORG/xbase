"use client";

import { ModeToggle } from "@turtle/design-system/components/mode-toggle";
import { Button } from "@turtle/design-system/components/ui/button";

export function HomeControls() {
  return (
    <div className="flex items-center gap-2">
      <Button>Button</Button>
      <ModeToggle />
    </div>
  );
}
