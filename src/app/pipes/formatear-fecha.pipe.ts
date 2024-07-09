import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatearFecha',
  standalone: true
})
export class FormatearFechaPipe implements PipeTransform {
  transform(timestamp: { seconds: number, nanoseconds: number }): { fecha: string, hora: string } {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    const fecha = date.toLocaleDateString();
    const hora = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { fecha, hora };
  }
}
