export interface Appointment {
    id: string;
    date: string;
    clientName: string;
    role: string;
    room: string;
    status: Status;
}

export type Status = "Em análise" | "Agendado" | "Cancelado";