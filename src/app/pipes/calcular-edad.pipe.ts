import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'calcularEdad',
  standalone: true
})
export class CalcularEdadPipe implements PipeTransform {
  transform(fechaNacimiento: string): string {
    const nacimiento = moment(fechaNacimiento, 'YYYY-MM-DD');
    const hoy = moment();
    const edad = hoy.diff(nacimiento, 'years');
    return `${edad} años`;
  }
}