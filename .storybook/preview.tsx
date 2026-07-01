import type { Preview } from "@storybook/react-vite"
import { withThemeByClassName } from "@storybook/addon-themes"

// Global stylesheet: Tailwind v4 + shadcn theme tokens + the `dark` variant.
// Importing it here guarantees the compiled CSS is present in the preview iframe
// (and in the Vitest browser test runner), independent of Vite plugin merge order.
import "../src/index.css"

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'error' fails the test run on any axe-core accessibility violation.
      // ('todo' = report-only, 'off' = skip). We want a11y to be a hard gate.
      test: "error",
    },
  },
  // The theme switcher (toolbar) toggles the `dark` class on <html> — the default
  // target for withThemeByClassName. shadcn redefines its CSS variables under
  // `.dark`, so the whole canvas (incl. background) flips between light and dark.
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
}

export default preview
