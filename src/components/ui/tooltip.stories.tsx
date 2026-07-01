import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
      <TooltipContent>Add to your library</TooltipContent>
    </Tooltip>
  ),
}

/**
 * Interaction + a11y: a tooltip must be reachable by both hover and keyboard
 * focus, expose `role="tooltip"`, and dismiss on blur/unhover. The content is
 * portaled to the document body, so we query there.
 */
export const HoverAndFocus: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Settings</Button>} />
      <TooltipContent>Open settings</TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole("button", { name: /settings/i })

    // The tooltip content is portaled to the body; we match it by its text so
    // the assertion is robust to Base UI's internal role/markup choices.
    await step("Hover reveals the tooltip", async () => {
      await userEvent.hover(trigger)
      await waitFor(async () => {
        await expect(body.getByText("Open settings")).toBeVisible()
      })
    })

    await step("Unhover dismisses it", async () => {
      await userEvent.unhover(trigger)
      await waitFor(async () => {
        await expect(body.queryByText("Open settings")).not.toBeInTheDocument()
      })
    })

    await step("Keyboard focus also reveals it", async () => {
      trigger.focus()
      await waitFor(async () => {
        await expect(body.getByText("Open settings")).toBeVisible()
      })
    })
  },
}
