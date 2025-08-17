import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

// Animações otimizadas para mobile com foco em performance
export const mobileSlideIn = trigger('mobileSlideIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(30px)' }),
    animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
  ])
]);

export const mobileFadeIn = trigger('mobileFadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-in', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-out', style({ opacity: 0 }))
  ])
]);

export const mobileScaleIn = trigger('mobileScaleIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.9)' }),
    animate('250ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
  ])
]);

export const mobileSlideUp = trigger('mobileSlideUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(50px)' }),
    animate('300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
      style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('250ms ease-in', style({ opacity: 0, transform: 'translateY(30px)' }))
  ])
]);

export const mobileStagger = trigger('mobileStagger', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(80, [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

// Animação específica para loading states
export const loadingPulse = trigger('loadingPulse', [
  state('loading', style({ opacity: 0.6, transform: 'scale(0.98)' })),
  state('loaded', style({ opacity: 1, transform: 'scale(1)' })),
  transition('loading <=> loaded', animate('200ms ease-in-out'))
]);

// Animação para erros com shake effect
export const errorShake = trigger('errorShake', [
  transition('* => error', [
    animate('0.5s', style({ transform: 'translateX(0)' })),
    animate('0.1s', style({ transform: 'translateX(-10px)' })),
    animate('0.1s', style({ transform: 'translateX(10px)' })),
    animate('0.1s', style({ transform: 'translateX(-10px)' })),
    animate('0.1s', style({ transform: 'translateX(10px)' })),
    animate('0.1s', style({ transform: 'translateX(0)' }))
  ])
]);

// Animação para navegação entre rotas mobile
export const mobileRouteAnimation = trigger('mobileRouteAnimation', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
        opacity: 0,
        transform: 'translateX(100%)',
      }),
    ], { optional: true }),
    query(':leave', [
      animate('250ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' })),
    ], { optional: true }),
    query(':enter', [
      animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
    ], { optional: true })
  ]),
]);