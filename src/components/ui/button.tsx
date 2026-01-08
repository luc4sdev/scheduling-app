import { ComponentProps } from "react";
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-black text-white hover:bg-zinc-800",
                destructive: "bg-red-500 text-zinc-50 hover:bg-red-500/90",
                outline: "border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 text-zinc-900",
                secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80",
                ghost: "hover:bg-zinc-100 hover:text-zinc-900 text-zinc-600",
                link: "text-zinc-900 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-8",
                sm: "h-9 rounded-md px-3",
                lg: "h-12 rounded-md px-8",
                icon: "h-10 w-10",
            },
            fullWidth: {
                true: "w-full",
                false: "w-auto"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            fullWidth: false,
        },
    }
)

interface ButtonProps
    extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export function Button({
    className,
    variant,
    size,
    fullWidth,
    asChild = false,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            className={cn(buttonVariants({ variant, size, fullWidth, className }))}
            {...props}
        />
    )
}
export { buttonVariants }