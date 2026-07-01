import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const meta = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { onOpenChange: fn() },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

const Template = (args: ComponentProps<typeof Popover>) => (
  <Popover {...args}>
    <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>Dimensions</PopoverTitle>
        <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
      </PopoverHeader>
      <div className="grid gap-2">
        <Label htmlFor="width">Width</Label>
        <Input id="width" defaultValue="100%" />
      </div>
    </PopoverContent>
  </Popover>
)

export const Default: Story = {
  render: (args) => <Template {...args} />,
}

/**
 * Interaction + a11y: opening moves focus into the popover; Escape closes it and
 * returns focus to the trigger. Content is portaled to the document body.
 */
export const OpenCloseFlow: Story = {
  render: (args) => <Template {...args} />,
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole("button", { name: /open popover/i })

    await step("Click opens the popover", async () => {
      await userEvent.click(trigger)
      await waitFor(async () => {
        await expect(body.getByText("Dimensions")).toBeVisible()
      })
      await expect(args.onOpenChange).toHaveBeenCalled()
    })

    await step("Focus moves into the popover", async () => {
      await waitFor(async () => {
        await expect(trigger).not.toHaveFocus()
      })
    })

    await step("Escape closes and restores focus", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(async () => {
        await expect(body.queryByText("Dimensions")).not.toBeInTheDocument()
      })
      await expect(trigger).toHaveFocus()
    })
  },
}
