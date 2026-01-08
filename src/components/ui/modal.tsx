'use client'

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/utils/utils";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    const handleOpenChange = (open: boolean) => {
        if (!open) onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay
                    className="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                />

                <Dialog.Content
                    className={cn(
                        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-200 bg-white shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
                        className
                    )}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                        <Dialog.Title className="text-lg font-semibold text-zinc-900">
                            {title}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="p-1 rounded-md text-zinc-700 hover:text-zinc-600 hover:bg-zinc-100 transition-colors outline-none focus:ring-zinc-900 cursor-pointer">
                                <X className="w-5 h-5" />
                                <span className="sr-only">Fechar</span>
                            </button>
                        </Dialog.Close>
                    </div>

                    <div className="px-6 pb-6 pt-2">
                        {children}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}