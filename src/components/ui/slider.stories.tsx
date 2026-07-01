import type { Meta, StoryObj } from "@storybook/react-vite"
import { Slider } from "./slider"

const meta = {
  title: "Components/Slider",
  component: Slider,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Slider aria-label="Volume" defaultValue={[50]} className="w-64" />
  ),
}
