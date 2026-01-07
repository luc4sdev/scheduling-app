export interface AppointmentApiResponse {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    user: {
        id: string;
        name: string;
        lastName: string;
        role: string;
        email: string;
    };
    room: {
        id: string;
        name: string;
    };
}

export interface AppointmentItem {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    clientName: string;
    role: string;
    room: string;
    status: string;
}