'use client'

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ChevronDown, LoaderCircle } from "lucide-react";
import { toastMessage } from "@/utils/toast-message";
import { cn } from "@/utils/utils";
import useFetch from "@/hooks/useFetch";
import { useMutationHook } from "@/hooks/useMutation";
import { useQueryClient } from "@tanstack/react-query";

interface Room {
    id: string;
    name: string;
    isActive: boolean;
}

const appointmentSchema = z.object({
    date: z.string().min(1, "Selecione uma data"),
    startTime: z.string().min(1, "Selecione um horário"),
    roomId: z.string().min(1, "Selecione uma sala"),
});

type AppointmentSchemaType = z.infer<typeof appointmentSchema>;

interface UserAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UserAppointmentModal({ isOpen, onClose }: UserAppointmentModalProps) {
    const queryClient = useQueryClient();

    const getToday = () => {
        const today = new Date();
        return today.toLocaleDateString('en-CA');
    };

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm<AppointmentSchemaType>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            date: getToday(),
            roomId: "",
            startTime: ""
        }
    });

    const selectedDate = watch("date");
    const selectedRoomId = watch("roomId");

    const { data: rooms = [], isPending: isLoadingRooms } = useFetch({
        url: `/rooms`,
        options: {
            method: 'GET',
        },
        cacheKeys: ['rooms'],
    });

    const { data: availableSlots = [], isPending: isLoadingSlots } = useFetch({
        url: `/schedules/availability?date=${selectedDate}&roomId=${selectedRoomId}`,
        options: {
            method: 'GET',
        },
        cacheKeys: ['availability', selectedDate, selectedRoomId],
    });

    useEffect(() => {
        if (isOpen) {
            reset({
                date: getToday(),
                roomId: "",
                startTime: ""
            });
        }
    }, [isOpen, reset]);

    useEffect(() => {
        setValue("startTime", "");
    }, [selectedDate, selectedRoomId, setValue]);

    const mutation = useMutationHook<void, Error, AppointmentSchemaType>({
        url: '/schedules',
        method: 'POST',
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
            toastMessage({ message: "Agendamento realizado com sucesso!", type: "success" });
            onClose();
        },
        onError: (error) => {
            toastMessage({ message: error.message || "Erro ao realizar agendamento", type: "error" });
        }
    });

    const handleSave = (data: AppointmentSchemaType) => {
        mutation.mutate(data);
    };

    const isTimeInPast = (time: string) => {
        if (selectedDate !== getToday()) return false;

        const now = new Date();
        const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

        const [hours, minutes] = time.split(':').map(Number);
        const slotTotalMinutes = hours * 60 + minutes;
        return slotTotalMinutes <= currentTotalMinutes;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Novo Agendamento"
            className="max-w-105"
        >
            <form onSubmit={handleSubmit(handleSave)} className="flex flex-col gap-6 mt-2">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-zinc-600">
                        Selecione uma <strong>data</strong>
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            className={cn(
                                "w-full h-11 px-2 rounded-md border text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all font-medium appearance-none",
                                errors.date ? "border-red-500" : "border-zinc-200"
                            )}
                            {...register("date")}
                            min={getToday()}
                        />
                    </div>
                    {errors.date && <span className="text-xs text-red-500">{errors.date.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-zinc-600">
                        Selecione uma <strong>sala</strong>
                    </label>
                    <div className="relative">
                        <select
                            className={cn(
                                "w-full h-11 px-2 rounded-md border text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all appearance-none bg-white font-medium cursor-pointer",
                                errors.roomId ? "border-red-500" : "border-zinc-200"
                            )}
                            {...register("roomId")}
                            defaultValue=""
                            disabled={isLoadingRooms}
                        >
                            <option value="" disabled>Selecione...</option>
                            {rooms.map((room: Room) => (
                                <option key={room.id} value={room.id}>{room.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    </div>
                    {errors.roomId && <span className="text-xs text-red-500">{errors.roomId.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-zinc-600 flex justify-between">
                        <span>Horários disponíveis</span>
                        {isLoadingSlots && <span className="text-xs text-zinc-400 flex items-center gap-1"><LoaderCircle className="w-3 h-3 animate-spin" /> Buscando...</span>}
                    </label>

                    {!selectedDate || !selectedRoomId ? (
                        <div className="p-4 border border-dashed border-zinc-200 rounded-md text-center text-sm text-zinc-400 bg-zinc-50">
                            Selecione data e sala para ver os horários.
                        </div>
                    ) : availableSlots.length === 0 && !isLoadingSlots ? (
                        <div className="p-4 border border-zinc-200 rounded-md text-center text-sm text-red-500 bg-red-50">
                            Não há horários disponíveis para esta data.
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-2 max-h-50 overflow-y-auto pr-1">
                            {availableSlots.map((time: string) => {
                                const isSelected = watch("startTime") === time;
                                const isDisabled = isTimeInPast(time);
                                return (
                                    <button
                                        key={time}
                                        type="button"
                                        disabled={isDisabled}
                                        onClick={() => setValue("startTime", time, { shouldValidate: true })}
                                        className={cn(
                                            "h-9 text-sm rounded-md border transition-all font-medium cursor-pointer",
                                            isDisabled
                                                ? "bg-zinc-100 text-zinc-300 border-zinc-100 cursor-not-allowed decoration-zinc-300"
                                                : isSelected
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
                                        )}
                                    >
                                        {time}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    <input type="hidden" {...register("startTime")} />
                    {errors.startTime && <span className="text-xs text-red-500">{errors.startTime.message}</span>}
                </div>

                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full h-12 bg-black hover:bg-zinc-800 text-white font-medium rounded-md mt-2 disabled:opacity-50"
                >
                    {mutation.isPending ? <LoaderCircle className="w-5 h-5 animate-spin" /> : "Confirmar Agendamento"}
                </Button>

            </form>
        </Modal>
    );
}