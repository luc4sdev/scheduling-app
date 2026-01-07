import { cn } from "@/utils/utis";

interface StatusSwitchProps {
    isActive: boolean;
    onToggle: () => void;
}

export function StatusSwitch({ isActive, onToggle }: StatusSwitchProps) {
    return (
        <button
            onClick={onToggle}
            type="button"
            title={isActive ? "Desativar" : "Ativar"}
            className={cn(
                "w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black cursor-pointer",
                isActive ? "bg-black" : "bg-zinc-200"
            )}
        >
            <span
                className={cn(
                    "block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out absolute top-1",
                    isActive ? "translate-x-6" : "translate-x-1"
                )}
            />
        </button>
    )
}