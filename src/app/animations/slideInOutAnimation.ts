import { trigger, transition, style, animate } from '@angular/animations';

export const slideInOutAnimation =
  trigger('slideInOutAnimation', [
    transition(':enter', [
      style({ transform: 'translateX(-100%)', opacity: 0 }), // Entrada desde la izquierda
      animate('500ms ease-in', style({ transform: 'translateX(0%)', opacity: 1 })) // Se desplaza hacia el centro
    ]),
    transition(':leave', [
      animate('500ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 })) // Sale hacia la derecha
    ])
  ]);