export interface IAddAppointment {
    userId: string;
    appointmentDateTime: Date;
}

export interface IAppointment {
    appointmentId: number,
    userId: string,
    appointmentDateTime: Date
}

export interface IDeleteAppointment {
    userId: string;
    appointmentId: number;
}

export interface IViewAppointments {
    appointmentDate: string;
}