import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, within } from "storybook/test"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { onCheckedChange: fn() },
  argTypes: {
    size: {
      control: "select",
      options: ["default", "lg"],
    },
  },
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

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(["default", "lg"] as const).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-16 text-sm text-muted-foreground">{size}</span>
          <Checkbox aria-label={`${size} unchecked`} size={size} {...args} />
          <Checkbox
            aria-label={`${size} checked`}
            size={size}
            defaultChecked
            {...args}
          />
        </div>
      ))}
    </div>
  ),
}

/**
 * Regression guard: the checked 3D lip must render inside opaque containers.
 * A negative-z-index lip pseudo-element gets painted behind an ancestor's
 * opaque background (here the Card's bg-card), silently flattening the
 * checkbox — the same bug the Button's lip had inside Cards/Dialogs.
 */
export const InCard: Story = {
  render: (args) => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Email preferences</CardTitle>
        <CardDescription>Choose what we send you.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Checkbox id="in-card-digest" defaultChecked {...args} />
          <Label htmlFor="in-card-digest">Weekly digest</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="in-card-promos" {...args} />
          <Label htmlFor="in-card-promos">Product announcements</Label>
        </div>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole("checkbox", { name: /weekly digest/i })
    ).toBeChecked()
    await expect(
      canvas.getByRole("checkbox", { name: /product announcements/i })
    ).not.toBeChecked()
  },
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
