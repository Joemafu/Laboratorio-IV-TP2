import { Usuario } from './usuario';

export class Paciente extends Usuario{
    obraSocial: string = '';
    fotoPerfilDos: string = '';
    override rol: string = 'paciente';
    activo: boolean = true;
}