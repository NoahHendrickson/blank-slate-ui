import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, within } from "storybook/test"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const meta = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { onCheckedChange: fn() },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="airplane" {...args} />
      <Label htmlFor="airplane">Airplane mode</Label>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="locked" {...args} />
      <Label htmlFor="locked">Managed by your organization</Label>
    </div>
  ),
}

/**
 * Interaction + a11y: a switch exposes `role="switch"` with `aria-checked`, and
 * is operable by both pointer and keyboard (Space). We toggle it each way.
 */
export const Toggle: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="wifi" {...args} />
      <Label htmlFor="wifi">Wi-Fi</Label>
    </div>
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    const sw = canvas.getByRole("switch", { name: /wi-fi/i })

    await step("Pointer toggles on", async () => {
      await expect(sw).not.toBeChecked()
      await userEvent.click(sw)
      await expect(sw).toBeChecked()
    })

    await step("Keyboard (Space) toggles off", async () => {
      sw.focus()
      await userEvent.keyboard("[Space]")
      await expect(sw).not.toBeChecked()
    })

    await expect(args.onCheckedChange).toHaveBeenCalledTimes(2)
  },
}
