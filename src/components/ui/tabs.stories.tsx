import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

const Panels = () => (
  <Tabs defaultValue="account" className="w-[28rem]">
    <TabsList>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
      <TabsTrigger value="team">Team</TabsTrigger>
    </TabsList>
    <TabsContent value="account">Manage your account details here.</TabsContent>
    <TabsContent value="password">Change your password here.</TabsContent>
    <TabsContent value="team">Invite and manage team members.</TabsContent>
  </Tabs>
)

export const Default: Story = {
  render: () => <Panels />,
}

/**
 * Interaction + a11y: tabs follow the WAI-ARIA tabs pattern — `role="tab"` with
 * `aria-selected`, and roving keyboard navigation. We select with a pointer and
 * with arrow keys, asserting the selected tab and visible panel.
 */
export const KeyboardNavigation: Story = {
  render: () => <Panels />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const account = canvas.getByRole("tab", { name: "Account" })
    const password = canvas.getByRole("tab", { name: "Password" })
    const team = canvas.getByRole("tab", { name: "Team" })

    await step("Default tab is selected", async () => {
      await expect(account).toHaveAttribute("aria-selected", "true")
      await expect(canvas.getByText(/manage your account details/i)).toBeVisible()
    })

    await step("Pointer selects another tab", async () => {
      await userEvent.click(password)
      await expect(password).toHaveAttribute("aria-selected", "true")
      await expect(canvas.getByText(/change your password/i)).toBeVisible()
    })

    await step("Arrow keys move focus across tabs (roving tabindex)", async () => {
      // Base UI tabs use manual activation: arrows move focus between tabs
      // (roving tabindex); selection is committed on click/Enter. We assert the
      // keyboard-navigation behaviour here; pointer selection is covered above.
      password.focus()
      await expect(password).toHaveFocus()
      await userEvent.keyboard("{ArrowRight}")
      await expect(team).toHaveFocus()
      await userEvent.keyboard("{ArrowLeft}")
      await expect(password).toHaveFocus()
    })
  },
}
