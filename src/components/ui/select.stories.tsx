import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { onValueChange: fn() },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const Template = (args: ComponentProps<typeof Select>) => (
  <div className="grid gap-2">
    <Label htmlFor="fruit">Favorite fruit</Label>
    <Select {...args}>
      <SelectTrigger id="fruit" className="w-56">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Apple">Apple</SelectItem>
        <SelectItem value="Banana">Banana</SelectItem>
        <SelectItem value="Blueberry">Blueberry</SelectItem>
        <SelectItem value="Grapes">Grapes</SelectItem>
      </SelectContent>
    </Select>
  </div>
)

export const Default: Story = {
  render: (args) => <Template {...args} />,
}

/**
 * Interaction + a11y: opens the listbox, asserts `option` roles are present,
 * selects one with a pointer, and confirms the trigger reflects the new value
 * and the change handler fired. Popup content is portaled to the document body.
 */
export const ChooseOption: Story = {
  render: (args) => <Template {...args} />,
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByLabelText("Favorite fruit")

    await step("Open the listbox", async () => {
      await userEvent.click(trigger)
      await waitFor(async () => {
        await expect(body.getByRole("option", { name: "Blueberry" })).toBeVisible()
      })
    })

    await step("Select an option", async () => {
      await userEvent.click(body.getByRole("option", { name: "Blueberry" }))
      await waitFor(async () => {
        await expect(trigger).toHaveTextContent("Blueberry")
      })
      await expect(args.onValueChange).toHaveBeenCalled()
      // Wait for the listbox to fully close so the a11y scan runs on a settled
      // DOM (an open/closing Base UI listbox transiently aria-hides the trigger).
      await waitFor(async () => {
        await expect(
          body.queryByRole("option", { name: "Blueberry" })
        ).not.toBeInTheDocument()
      })
    })
  },
}

/**
 * Keyboard a11y: the trigger opens with Enter and exposes a listbox of options.
 */
export const OpenWithKeyboard: Story = {
  render: (args) => <Template {...args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByLabelText("Favorite fruit")

    await step("Enter opens the listbox", async () => {
      trigger.focus()
      await userEvent.keyboard("{Enter}")
      await waitFor(async () => {
        await expect(body.getByRole("option", { name: "Apple" })).toBeVisible()
      })
    })

    await step("Close the listbox before the a11y scan", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(async () => {
        await expect(
          body.queryByRole("option", { name: "Apple" })
        ).not.toBeInTheDocument()
      })
    })
  },
}
