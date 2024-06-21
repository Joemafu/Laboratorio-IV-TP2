import { Usuario } from './usuario';

export class Admin extends Usuario {
    override rol: string = 'admin';
    override activo: boolean = true;
}