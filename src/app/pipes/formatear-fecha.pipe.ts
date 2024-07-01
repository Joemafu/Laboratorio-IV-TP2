import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'formatearFecha',
  standalone: true
})
export class FormatearFechaPipe implements PipeTransform {
  transform(horario: string): string {
    const [diaSemana, ...resto] = horario.split(' ');
    const fechaHora = resto.join(' ');

    const [fecha, hora, _] = fechaHora.split(' ');
    const [dia, mes] = fecha.split('/');

    const anioActual = new Date().getFullYear();

    const fechaStr = `${anioActual}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T${hora.replace('hs', '').trim()}:00`;

    return moment(fechaStr).format('YYYY-MM-DD h:mm A');
  }
}
