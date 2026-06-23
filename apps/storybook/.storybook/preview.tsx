import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react";
import { Toaster } from "@turtle/design-system/components/ui/sonner";
import { TooltipProvider } from "@turtle/design-system/components/ui/tooltip";
import { ThemeProvider } from "@turtle/design-system/providers/theme";

import "@turtle/design-system/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    chromatic: {
      modes: {
        light: {
          theme: "light",
          className: "light",
        },
        dark: {
          theme: "dark",
          className: "dark",
        },
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    (Story) => (
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <div className="min-h-screen bg-background p-6 text-foreground">
            <Story />
          </div>
        </TooltipProvider>
        <Toaster />
      </ThemeProvider>
    ),
  ],
};

export default preview;
