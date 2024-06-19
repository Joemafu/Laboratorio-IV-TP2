import { Usuario } from './usuario';

export class Especialista extends Usuario{
  override rol: string = 'especialista';
  especialidad: string[] = [];
  activo: boolean = false;
}