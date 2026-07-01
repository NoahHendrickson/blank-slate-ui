import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, within } from "storybook/test"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" {...args} />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

export const Checked: Story = {
  args: { defaultChecked: true },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="subscribe" {...args} />
      <Label htmlFor="subscribe">Subscribe to the newsletter</Label>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="disabled-cb" {...args} />
      <Label htmlFor="disabled-cb">Option locked by your admin</Label>
    </div>
  ),
}

/**
 * Interaction + a11y: toggles by clicking the control and by clicking the
 * associated label (proving the htmlFor/id association). Asserts the
 * `aria-checked` state and that the change handler fires.
 */
export const Toggle: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="remember" {...args} />
      <Label htmlFor="remember">Remember me</Label>
    </div>
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole("checkbox", { name: /remember me/i })

    await step("Click checks the box", async () => {
      await expect(checkbox).not.toBeChecked()
      await userEvent.click(checkbox)
      await expect(checkbox).toBeChecked()
      await expect(args.onCheckedChange).toHaveBeenCalled()
    })

    await step("Clicking the label unchecks it", async () => {
      await userEvent.click(canvas.getByText(/remember me/i))
      await expect(checkbox).not.toBeChecked()
    })
  },
}
