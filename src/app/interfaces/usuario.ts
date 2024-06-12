export interface Usuario {
    uid?: string;
    nombre?: string;
    apellido?: string;
    mail: string;
    pass: string;
    tipoDoc?: string;
    nroDocumento?: string;
    fechaNac?: number;
    fotoPerfil?: string;
    rol?: string;
    activo?: boolean;
  }
  