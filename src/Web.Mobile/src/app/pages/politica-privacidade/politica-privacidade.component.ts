import { Component } from '@angular/core';

@Component({
  selector: 'app-politica-privacidade',
  template: `
    <div class="mobile-privacy-container">
      
      <!-- Header -->
      <div class="mobile-privacy-header">
        <button mat-icon-button (click)="goBack()" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Privacidade</h1>
      </div>

      <!-- Content -->
      <div class="mobile-privacy-content">
        
        <div class="intro-section">
          <mat-icon class="privacy-icon">security</mat-icon>
          <h2>Política de Privacidade</h2>
          <p>Seus dados são protegidos pela LGPD</p>
        </div>

        <mat-card class="info-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>info</mat-icon>
            <mat-card-title>Informações Gerais</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Coletamos e tratamos seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="info-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>storage</mat-icon>
            <mat-card-title>Dados Coletados</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <ul>
              <li>Nome e email para identificação</li>
              <li>Telefone para contato</li>
              <li>Dados de navegação e uso</li>
              <li>Preferências do aplicativo</li>
            </ul>
          </mat-card-content>
        </mat-card>

        <mat-card class="info-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>gavel</mat-icon>
            <mat-card-title>Seus Direitos</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="rights-list">
              <div class="right-item">
                <mat-icon>visibility</mat-icon>
                <span>Acesso aos seus dados</span>
              </div>
              <div class="right-item">
                <mat-icon>edit</mat-icon>
                <span>Correção de dados</span>
              </div>
              <div class="right-item">
                <mat-icon>delete</mat-icon>
                <span>Eliminação de dados</span>
              </div>
              <div class="right-item">
                <mat-icon>file_download</mat-icon>
                <span>Portabilidade</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="contact-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>contact_mail</mat-icon>
            <mat-card-title>Contato</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Para exercer seus direitos:</p>
            <a href="mailto:privacidade@barbeariasaas.com.br" class="contact-link">
              <mat-icon>email</mat-icon>
              privacidade@barbeariasaas.com.br
            </a>
          </mat-card-content>
        </mat-card>

      </div>

      <!-- Safe Area -->
      <div class="safe-area-bottom"></div>

    </div>
  `,
  styles: [`
    .mobile-privacy-container {
      min-height: 100vh;
      background: #f5f5f5;
      padding-top: env(safe-area-inset-top);
    }

    .mobile-privacy-header {
      display: flex;
      align-items: center;
      padding: 16px;
      background: var(--mobile-primary);
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .back-button {
        color: white;
        margin-right: 8px;
      }

      h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
      }
    }

    .mobile-privacy-content {
      padding: 16px;
    }

    .intro-section {
      text-align: center;
      padding: 24px 16px;
      margin-bottom: 16px;

      .privacy-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: var(--mobile-primary);
        margin-bottom: 16px;
      }

      h2 {
        margin: 0 0 8px 0;
        color: var(--mobile-text-primary);
      }

      p {
        margin: 0;
        color: var(--mobile-text-secondary);
      }
    }

    .info-card {
      margin-bottom: 16px;
      border-radius: 12px;

      mat-card-header {
        padding-bottom: 8px;

        mat-icon[mat-card-avatar] {
          background: var(--mobile-primary);
          color: white;
        }
      }

      ul {
        margin: 0;
        padding-left: 20px;

        li {
          margin-bottom: 8px;
          line-height: 1.4;
        }
      }
    }

    .rights-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .right-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: rgba(var(--mobile-primary-rgb), 0.1);
      border-radius: 8px;

      mat-icon {
        color: var(--mobile-primary);
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      span {
        font-size: 12px;
        color: var(--mobile-text-secondary);
      }
    }

    .contact-card {
      background: linear-gradient(135deg, var(--mobile-primary), var(--mobile-primary-dark));
      color: white;

      mat-card-header {
        mat-icon[mat-card-avatar] {
          background: rgba(255, 255, 255, 0.2);
        }

        mat-card-title {
          color: white;
        }
      }

      mat-card-content {
        p {
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 12px;
        }
      }
    }

    .contact-link {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
      text-decoration: none;
      font-weight: 500;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      &:active {
        opacity: 0.8;
      }
    }

    .safe-area-bottom {
      height: env(safe-area-inset-bottom);
    }
  `]
})
export class PoliticaPrivacidadeComponent {
  goBack(): void {
    window.history.back();
  }
}