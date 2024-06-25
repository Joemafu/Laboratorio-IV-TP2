import { Usuario } from './usuario';

export class Especialista extends Usuario{
  override rol: string = 'Especialista';
  override activo: boolean = false;
}