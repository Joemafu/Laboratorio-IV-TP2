import { trigger, transition, style, animate } from '@angular/animations';

export const slideOutInAnimation =
  trigger('slideOutInAnimation', [
    transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('400ms ease-in', style({ transform: 'translateX(0%)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('400ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
  ]);