import { Component } from '@angular/core';

@Component({
  selector: 'app-politica-privacidade',
  template: `
    <div class="privacy-policy-container">
      <div class="privacy-content">
        <h1>Política de Privacidade - Barbearia SaaS</h1>
        
        <section>
          <h2>1. Informações Gerais</h2>
          <p>Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).</p>
        </section>

        <section>
          <h2>2. Dados Coletados</h2>
          <ul>
            <li>Dados de identificação (nome, email, telefone)</li>
            <li>Dados de navegação (cookies, logs de acesso)</li>
            <li>Dados de uso do sistema</li>
          </ul>
        </section>

        <section>
          <h2>3. Finalidade do Tratamento</h2>
          <ul>
            <li>Prestação dos serviços contratados</li>
            <li>Comunicação com o usuário</li>
            <li>Melhoria da experiência do usuário</li>
            <li>Cumprimento de obrigações legais</li>
          </ul>
        </section>

        <section>
          <h2>4. Seus Direitos</h2>
          <p>Você tem direito a:</p>
          <ul>
            <li>Confirmação da existência de tratamento</li>
            <li>Acesso aos dados</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados</li>
            <li>Anonimização, bloqueio ou eliminação de dados</li>
            <li>Portabilidade dos dados</li>
            <li>Eliminação dos dados tratados com consentimento</li>
            <li>Revogação do consentimento</li>
          </ul>
        </section>

        <section>
          <h2>5. Contato</h2>
          <p>Para exercer seus direitos ou esclarecer dúvidas:</p>
          <p><strong>Email:</strong> privacidade@barbeariasaas.com.br</p>
        </section>

        <div class="back-button">
          <button mat-raised-button color="primary" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Voltar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .privacy-policy-container {
      min-height: 100vh;
      padding: 40px 20px;
      background: #f8f9fa;
    }

    .privacy-content {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: var(--primary-color);
      margin-bottom: 30px;
      text-align: center;
    }

    h2 {
      color: var(--text-primary);
      margin-top: 30px;
      margin-bottom: 15px;
    }

    section {
      margin-bottom: 25px;
    }

    ul {
      padding-left: 20px;
    }

    li {
      margin-bottom: 8px;
      line-height: 1.5;
    }

    .back-button {
      text-align: center;
      margin-top: 40px;
    }
  `]
})
export class PoliticaPrivacidadeComponent {
  goBack(): void {
    window.history.back();
  }
}