import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  {
    value: "item-1",
    q: "Is it accessible?",
    a: "Yes. It follows the WAI-ARIA accordion pattern and is fully keyboard navigable.",
  },
  {
    value: "item-2",
    q: "Is it animated?",
    a: "Yes — the panels animate open and closed with CSS.",
  },
  {
    value: "item-3",
    q: "Can I open multiple panels?",
    a: "This example is single-open; pass openMultiple to allow several at once.",
  },
]

export const Default: Story = {
  render: () => (
    <Accordion multiple={false} defaultValue={["item-1"]} className="w-[28rem]">
      {items.map((it) => (
        <AccordionItem key={it.value} value={it.value}>
          <AccordionTrigger>{it.q}</AccordionTrigger>
          <AccordionContent>{it.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}

/**
 * Interaction + a11y: each trigger exposes `aria-expanded`. We expand a panel,
 * assert it opens, then open a second and assert the first auto-collapses
 * (single-open behaviour).
 */
export const ExpandCollapse: Story = {
  render: () => (
    <Accordion multiple={false} className="w-[28rem]">
      {items.map((it) => (
        <AccordionItem key={it.value} value={it.value}>
          <AccordionTrigger>{it.q}</AccordionTrigger>
          <AccordionContent>{it.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByRole("button", { name: /is it accessible/i })
    const second = canvas.getByRole("button", { name: /is it animated/i })

    await step("Expand the first panel", async () => {
      await expect(first).toHaveAttribute("aria-expanded", "false")
      await userEvent.click(first)
      await expect(first).toHaveAttribute("aria-expanded", "true")
      await expect(
        canvas.getByText(/wai-aria accordion pattern/i)
      ).toBeVisible()
    })

    await step("Opening the second collapses the first", async () => {
      await userEvent.click(second)
      await expect(second).toHaveAttribute("aria-expanded", "true")
      await expect(first).toHaveAttribute("aria-expanded", "false")
    })
  },
}
