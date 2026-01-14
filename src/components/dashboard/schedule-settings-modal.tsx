'use client'

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Clock, Plus, ChevronDown, LoaderCircle, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toastMessage } from "@/utils/toast-message";
import { cn } from "@/utils/utils";
import { useMutationHook } from "@/hooks/useMutation";


const singleRoomSchema = z.object({
    name: z.string().min(2, "O nome da sala deve ter pelo menos 2 caracteres"),
    timeRange: z.string().regex(/^\d{2}:\d{2}\s-\s\d{2}:\d{2}$/, "Formato inválido. Use ex: 08:00 - 18:00"),
    interval: z.string().min(1, "Selecione um intervalo"),
});

const formSchema = z.object({
    rooms: z.array(singleRoomSchema)
});

type FormSchemaType = z.infer<typeof formSchema>;

type ApiPayload = {
    name: string;
    startTime: string;
    endTime: string;
    slotDuration: number;
}[];

interface ScheduleSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ScheduleSettingsModal({ isOpen, onClose }: ScheduleSettingsModalProps) {
    const { data: session } = useSession();

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rooms: [
                {
                    name: "Sala 012",
                    timeRange: "08:00 - 18:00",
                    interval: "30 minutos"
                }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rooms"
    });

    useEffect(() => {
        if (!isOpen) {
            reset({
                rooms: [{ name: "Sala 012", timeRange: "08:00 - 18:00", interval: "30 minutos" }]
            });
        }
    }, [isOpen, reset]);

    const mutation = useMutationHook<void, Error, ApiPayload>({
        url: '/rooms',
        method: 'POST',
        invalidateQueries: [['rooms']],
        headers: {
            Authorization: `Bearer ${session?.user?.token}`
        },
        onSuccess: () => {
            toastMessage({ message: "Salas cadastradas com sucesso!", type: "success" });
            onClose();
        },
        onError: (error) => {
            toastMessage({ message: error.message || "Erro ao criar salas", type: "error" });
        }
    });

    const handleSave = (data: FormSchemaType) => {
        const payload: ApiPayload = data.rooms.map((room) => {
            const [start, end] = room.timeRange.split(' - ');
            const duration = parseInt(room.interval.split(' ')[0]);

            return {
                name: room.name,
                startTime: start,
                endTime: end,
                slotDuration: duration
            };
        });

        mutation.mutate(payload);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Ajustes de agendamento"
            className="max-w-105"
        >
            <form onSubmit={handleSubmit(handleSave)} className="flex flex-col gap-6 mt-2">

                <div className="flex flex-col gap-8 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-200">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex flex-col gap-4 relative">

                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                    Sala {index + 1}
                                </span>
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors cursor-pointer"
                                        title="Remover sala"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-zinc-600">
                                    Nome da sala
                                </label>
                                <input
                                    placeholder="Ex: Sala de Reunião"
                                    className={cn(
                                        "w-full h-11 px-3 rounded-md border text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all placeholder:text-zinc-400 font-medium",
                                        errors.rooms?.[index]?.name ? "border-red-500 focus:ring-red-500" : "border-zinc-200"
                                    )}
                                    {...register(`rooms.${index}.name`)}
                                />
                                {errors.rooms?.[index]?.name && (
                                    <span className="text-xs text-red-500">{errors.rooms[index]?.name?.message}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-zinc-600">
                                    Horário Inicial & Final da sala
                                </label>
                                <div className="relative">
                                    <input
                                        placeholder="08:00 - 18:00"
                                        className={cn(
                                            "w-full h-11 pl-3 pr-10 rounded-md border text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all placeholder:text-zinc-400 font-medium",
                                            errors.rooms?.[index]?.timeRange ? "border-red-500 focus:ring-red-500" : "border-zinc-200"
                                        )}
                                        {...register(`rooms.${index}.timeRange`)}
                                    />
                                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                </div>
                                {errors.rooms?.[index]?.timeRange && (
                                    <span className="text-xs text-red-500">{errors.rooms[index]?.timeRange?.message}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-zinc-600">
                                    Bloco de Horários de agendamento
                                </label>
                                <div className="relative">
                                    <select
                                        className={cn(
                                            "w-full h-11 pl-3 pr-10 rounded-md border text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all appearance-none bg-white font-medium cursor-pointer",
                                            errors.rooms?.[index]?.interval ? "border-red-500 focus:ring-red-500" : "border-zinc-200"
                                        )}
                                        {...register(`rooms.${index}.interval`)}
                                    >
                                        <option value="15 minutos">15 minutos</option>
                                        <option value="30 minutos">30 minutos</option>
                                        <option value="60 minutos">60 minutos</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                </div>
                                {errors.rooms?.[index]?.interval && (
                                    <span className="text-xs text-red-500">{errors.rooms[index]?.interval?.message}</span>
                                )}
                            </div>

                            {index < fields.length - 1 && <hr className="border-zinc-100 my-2" />}
                        </div>
                    ))}
                </div>

                <div>
                    <button
                        type="button"
                        onClick={() => append({ name: "", timeRange: "08:00 - 18:00", interval: "30 minutos" })}
                        className="flex items-center gap-2 text-sm font-semibold text-zinc-900 hover:text-zinc-700 transition-colors outline-none focus:underline cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Adicionar nova sala
                    </button>
                </div>

                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full h-12 bg-black hover:bg-zinc-800 text-white font-medium rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {mutation.isPending ? (
                        <LoaderCircle className="w-5 h-5 animate-spin" />
                    ) : (
                        "Salvar"
                    )}
                </Button>

            </form>
        </Modal>
    );
}