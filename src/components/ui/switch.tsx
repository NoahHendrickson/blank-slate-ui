import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[20px] data-[size=default]:w-[36px] data-[size=sm]:h-[16px] data-[size=sm]:w-[28px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-brand data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {/*
        The thumb echoes the button's outline: a bg-background face with a 1px
        border that recolors with state — brand-blue when checked, neutral-gray
        when unchecked. It's sized 1px taller than the track (21px vs 20px, 17px
        vs 16px) so the knob sits ~0.5px proud of the pill on every side: at each
        rest position it's concentric with the pill's rounded end-cap, a hair
        larger, spilling slightly over top, bottom, and the near end. The half-px
        translates (-1.5px unchecked; +14.5px / +10.5px checked) keep it centered
        on each cap. (A crisp full-px spill needs +2px, i.e. a 22px knob.)
      */}
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full border bg-background transition-transform group-data-[size=default]/switch:size-[21px] group-data-[size=sm]/switch:size-[17px] data-unchecked:border-[var(--neutral-line)] data-checked:border-brand group-data-[size=default]/switch:data-unchecked:translate-x-[-1.5px] group-data-[size=default]/switch:data-checked:translate-x-[14.5px] group-data-[size=sm]/switch:data-unchecked:translate-x-[-1.5px] group-data-[size=sm]/switch:data-checked:translate-x-[10.5px]"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
