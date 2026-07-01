import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search"],
    },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" {...args} />
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="disabled-input">Email</Label>
      <Input
        id="disabled-input"
        type="email"
        placeholder="you@example.com"
        disabled
        {...args}
      />
    </div>
  ),
}

/**
 * Interaction + a11y: the field is found via `getByLabelText`, which only
 * succeeds when the `<Label htmlFor>` is correctly associated with the input's
 * `id`. We then type and assert the value.
 */
export const TypeAndAssociation: Story = {
  render: () => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="full-name">Full name</Label>
      <Input id="full-name" placeholder="Ada Lovelace" />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText("Full name")

    await step("Typing updates the value", async () => {
      await userEvent.type(input, "Ada Lovelace")
      await expect(input).toHaveValue("Ada Lovelace")
    })
  },
}

/**
 * Invalid state: `aria-invalid` drives the destructive ring and is announced to
 * assistive tech, while `aria-describedby` links the helper text. The message
 * itself uses neutral foreground colour so contrast stays AA-compliant.
 */
export const Invalid: Story = {
  render: () => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="invalid-email">Email</Label>
      <Input
        id="invalid-email"
        type="email"
        defaultValue="not-an-email"
        aria-invalid
        aria-describedby="invalid-email-hint"
      />
      <p id="invalid-email-hint" className="text-sm text-muted-foreground">
        Enter a valid email address, e.g. you@example.com.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText("Email")
    await expect(input).toHaveAttribute("aria-invalid", "true")
    await expect(input).toHaveAccessibleDescription(/valid email address/i)
  },
}
