import { Usuario } from './usuario';

export class Paciente extends Usuario{
    override rol: string = 'paciente';
}