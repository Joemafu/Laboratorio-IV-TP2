export interface HistoriaClinica {
    turnoId: string;
    pacienteId?: string | undefined;
    pacienteNombre?: string | undefined;
    fechaTurno: string;
    altura: number;
    peso: number;
    temperatura: number;
    presion: number;
    datoDinamicoUno?: { clave: string, valor: string };
    datoDinamicoDos?: { clave: string, valor: string };
    datoDinamicoTres?: { clave: string, valor: string };
}

/* BORRADOR REVISAR */