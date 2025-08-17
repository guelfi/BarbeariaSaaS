import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-lgpd-banner',
  templateUrl: './lgpd-banner.component.html',
  styleUrls: ['./lgpd-banner.component.scss'],
  animations: [
    trigger('slideUp', [
      state('hidden', style({
        transform: 'translateY(100%)',
        opacity: 0
      })),
      state('visible', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('hidden => visible', animate('250ms ease-out')),
      transition('visible => hidden', animate('200ms ease-in'))
    ]),
    trigger('modalSlide', [
      state('closed', style({
        transform: 'translateY(100%)',
        opacity: 0
      })),
      state('open', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('closed => open', animate('300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)')),
      transition('open => closed', animate('250ms ease-in'))
    ])
  ]
})
export class LgpdBannerComponent implements OnInit {
  isVisible = false;
  showModal = false;

  private readonly LGPD_CONSENT_KEY = 'barbearia_mobile_lgpd_consent';
  private readonly LGPD_CONSENT_VERSION = '1.0';

  ngOnInit(): void {
    this.checkLgpdConsent();
  }

  private checkLgpdConsent(): void {
    const consent = localStorage.getItem(this.LGPD_CONSENT_KEY);
    const consentData = consent ? JSON.parse(consent) : null;
    
    // Mostrar banner se não há consentimento ou versão desatualizada
    if (!consentData || consentData.version !== this.LGPD_CONSENT_VERSION) {
      setTimeout(() => {
        this.isVisible = true;
      }, 1500); // Mostrar após 1.5 segundos no mobile
    }
  }

  acceptAll(): void {
    this.saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    });
    this.hideBanner();
    this.triggerHapticFeedback('success');
  }

  acceptEssential(): void {
    this.saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    });
    this.hideBanner();
    this.triggerHapticFeedback('light');
  }

  openModal(): void {
    this.showModal = true;
    this.triggerHapticFeedback('light');
  }

  closeModal(): void {
    this.showModal = false;
  }

  private saveConsent(preferences: any): void {
    const consentData = {
      version: this.LGPD_CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      preferences: preferences,
      userAgent: navigator.userAgent,
      platform: 'mobile-pwa',
      ip: 'not-collected' // Por questões de privacidade
    };

    localStorage.setItem(this.LGPD_CONSENT_KEY, JSON.stringify(consentData));
    
    // Configurar cookies baseado nas preferências
    this.configureCookies(preferences);
  }

  private configureCookies(preferences: any): void {
    // Configurar Google Analytics se permitido
    if (preferences.analytics) {
      // Aqui você configuraria o GA4 ou outras ferramentas de analytics
      console.log('Analytics cookies habilitados no mobile');
    }

    // Configurar cookies de marketing se permitido
    if (preferences.marketing) {
      // Aqui você configuraria pixels de marketing, etc.
      console.log('Marketing cookies habilitados no mobile');
    }

    // Configurar cookies de preferências se permitido
    if (preferences.preferences) {
      // Aqui você configuraria cookies de personalização
      console.log('Preference cookies habilitados no mobile');
    }

    // Configurar PWA específicos
    if (preferences.essential) {
      // Service Worker e cache essencial
      console.log('PWA essential features habilitados');
    }
  }

  private hideBanner(): void {
    this.isVisible = false;
    this.showModal = false;
  }

  private triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'error'): void {
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate(30);
          break;
        case 'success':
          navigator.vibrate([10, 50, 10]);
          break;
        case 'error':
          navigator.vibrate([20, 100, 20, 100, 20]);
          break;
      }
    }
  }

  openPrivacyPolicy(): void {
    // Abrir política de privacidade em nova aba
    window.open('/politica-privacidade', '_blank');
  }

  openTermsOfUse(): void {
    // Abrir termos de uso em nova aba
    window.open('/termos-uso', '_blank');
  }

  // Método para detectar se é PWA instalado
  isPWAInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }
}