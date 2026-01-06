export interface LogItem {
    id: string;
    activityType: string;
    module: "Agendamento" | "Minha Conta";
    date: string;
}