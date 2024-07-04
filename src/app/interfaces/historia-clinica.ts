export interface HistoriaClinica {
    turnoId: string;
    pacienteId?: string | undefined;
    fechaTurno: string;
    altura: number;
    peso: number;
    temperatura: number;
    presion: string;
    datoDinamicoUno?: { clave: string, valor: string };
    datoDinamicoDos?: { clave: string, valor: string };
    datoDinamicoTres?: { clave: string, valor: string };
}

/* BORRADOR REVISAR */