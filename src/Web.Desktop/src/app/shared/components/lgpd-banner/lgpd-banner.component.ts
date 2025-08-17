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
      transition('hidden => visible', animate('300ms ease-out')),
      transition('visible => hidden', animate('300ms ease-in'))
    ])
  ]
})
export class LgpdBannerComponent implements OnInit {
  isVisible = false;
  showDetails = false;

  private readonly LGPD_CONSENT_KEY = 'barbearia_lgpd_consent';
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
      }, 1000); // Mostrar após 1 segundo
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
  }

  acceptEssential(): void {
    this.saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    });
    this.hideBanner();
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  private saveConsent(preferences: any): void {
    const consentData = {
      version: this.LGPD_CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      preferences: preferences,
      userAgent: navigator.userAgent,
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
      console.log('Analytics cookies habilitados');
    }

    // Configurar cookies de marketing se permitido
    if (preferences.marketing) {
      // Aqui você configuraria pixels de marketing, etc.
      console.log('Marketing cookies habilitados');
    }

    // Configurar cookies de preferências se permitido
    if (preferences.preferences) {
      // Aqui você configuraria cookies de personalização
      console.log('Preference cookies habilitados');
    }
  }

  private hideBanner(): void {
    this.isVisible = false;
  }

  openPrivacyPolicy(): void {
    // Abrir política de privacidade em nova aba
    window.open('/politica-privacidade', '_blank');
  }

  openTermsOfUse(): void {
    // Abrir termos de uso em nova aba
    window.open('/termos-uso', '_blank');
  }
}