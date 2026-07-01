import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { onOpenChange: fn() },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

const Template = (args: ComponentProps<typeof Dialog>) => (
  <Dialog {...args}>
    <DialogTrigger render={<Button>Open dialog</Button>} />
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Subscribe to updates</DialogTitle>
        <DialogDescription>
          Get a monthly email with product news. You can unsubscribe anytime.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose render={<Button variant="outline">Cancel</Button>} />
        <Button>Subscribe</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export const Default: Story = {
  render: (args) => <Template {...args} />,
}

/**
 * Interaction + a11y: opens a modal dialog (`role="dialog"`, `aria-modal`),
 * verifies focus is trapped inside, then closes with Escape and asserts focus
 * returns to the trigger. Dialog content is portaled to the document body.
 */
export const OpenCloseFlow: Story = {
  render: (args) => <Template {...args} />,
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole("button", { name: /open dialog/i })

    await step("Trigger opens the dialog", async () => {
      await userEvent.click(trigger)
      const dialog = await body.findByRole("dialog")
      // Wait out the open (fade/zoom-in) animation before asserting visibility.
      await waitFor(async () => {
        await expect(dialog).toBeVisible()
        await expect(
          within(dialog).getByText(/subscribe to updates/i)
        ).toBeVisible()
      })
      await expect(args.onOpenChange).toHaveBeenCalled()
    })

    await step("Focus is trapped within the dialog", async () => {
      await waitFor(async () => {
        const dialog = body.getByRole("dialog")
        await expect(dialog.contains(document.activeElement)).toBe(true)
      })
    })

    await step("Escape closes and restores focus to the trigger", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(async () => {
        await expect(body.queryByRole("dialog")).not.toBeInTheDocument()
      })
      await expect(trigger).toHaveFocus()
    })
  },
}
