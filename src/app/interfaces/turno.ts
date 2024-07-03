export interface Turno { 
    id: string;
    pacienteId?: string;
    pacienteNombre?: string;
    especialistaId: string;
    especialistaNombre: string;
    especialidad: string;
    fecha: string;
    hora: string;
    estado: 'Libre' | 'Pendiente' | 'Aceptado' | 'Cancelado' | 'Rechazado' | 'Realizado' | 'Finalizado';
    comentario?: string;
    calificacion?: string;
    reseniaMedico?: string;
    encuesta?: string;
}

/* BORRADOR - REVISAR */