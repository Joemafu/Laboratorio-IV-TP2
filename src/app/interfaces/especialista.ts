import { Usuario } from './usuario';

export interface Especialista extends Usuario{
  rol: 'especialista';
  especialidad?: string;
  activo?: boolean;
}