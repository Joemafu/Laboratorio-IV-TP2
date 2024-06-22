import { Usuario } from './usuario';

export class Especialista extends Usuario{
  override rol: string = 'especialista';
  override activo: boolean = false;
}