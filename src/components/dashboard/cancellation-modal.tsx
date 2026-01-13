import { AlertTriangle, LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";
import { AppointmentItem } from "@/types/appointment";

interface CancellationModalProps {
    appointmentToCancel: AppointmentItem | null;
    isCancelModalOpen: boolean;
    isAdmin: boolean;
    loadingId: string | null;
    setIsCancelModalOpen: (isCancelModalOpen: boolean) => void;
    confirmCancellation: () => void;
}
export function CancellationModal({ appointmentToCancel, isCancelModalOpen, isAdmin, loadingId, confirmCancellation, setIsCancelModalOpen }: CancellationModalProps) {
    return (
        <Modal
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            title="Confirmar Cancelamento"
            className="max-w-md"
        >
            <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-start gap-3 bg-red-50 p-3 rounded-md border border-red-100">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-red-900">Atenção!</p>
                        <p className="text-sm text-red-700">
                            Você tem certeza que deseja cancelar o agendamento {isAdmin && (<span>de <strong>{appointmentToCancel?.clientName}</strong></span>)} para o dia <strong>{appointmentToCancel?.date} entre às {appointmentToCancel?.startTime}h e {appointmentToCancel?.endTime}h</strong>?
                        </p>
                    </div>
                </div>
                {isAdmin && (
                    <p className="text-sm text-zinc-500">
                        Esta ação enviará um e-mail de notificação para o usuário informando sobre o cancelamento.
                    </p>
                )}
                <div className="flex items-center justify-end gap-3 mt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCancelModalOpen(false)}
                        className="bg-white hover:bg-zinc-50"
                    >
                        Voltar
                    </Button>

                    <Button
                        type="button"
                        onClick={confirmCancellation}
                        disabled={loadingId === appointmentToCancel?.id}
                        className="bg-red-600 hover:bg-red-700 text-white border-transparent"
                    >
                        {loadingId === appointmentToCancel?.id ? (
                            <LoaderCircle className="w-5 h-5 animate-spin text-zinc-100" />
                        ) : ' Confirmar Cancelamento'}
                    </Button>


                </div>
            </div>
        </Modal>
    )
}