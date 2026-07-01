import type { Meta, StoryObj } from "@storybook/react-vite"
import { Bold } from "lucide-react"
import { Toggle } from "./toggle"

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle bold">
      <Bold />
    </Toggle>
  ),
}
