"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    // Checked = the dolores-ds 3D button treatment: a light bg-background face
    // with a brand-blue border on a brand-shadow "lip" (the ::before, gated on
    // data-checked so it only appears when filled in). Same recipe as Button's
    // default variant, scaled to the 16px box — ~2px lip, 4px radius — with a
    // primary-blue check. Unchecked stays a plain neutral outline, no lip.
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-brand data-checked:bg-background data-checked:text-primary dark:data-checked:bg-background data-checked:before:absolute data-checked:before:-inset-x-px data-checked:before:-top-px data-checked:before:-bottom-[3px] data-checked:before:-z-10 data-checked:before:rounded-[4px] data-checked:before:border data-checked:before:border-brand data-checked:before:bg-[var(--brand-shadow)] data-checked:before:content-['']",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
