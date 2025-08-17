import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { map } from 'rxjs/operators';

export interface NotificationResult {
  success: boolean;
  message: string;
  type: 'sms' | 'email';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  sendWelcomeSMS(phone: string, userName: string): Observable<NotificationResult> {
    return timer(1500).pipe(
      map(() => {
        // Simulate SMS sending
        console.log(`SMS enviado para ${phone}: Bem-vindo ${userName}! Sua conta foi criada com sucesso.`);
        
        return {
          success: true,
          message: `SMS de boas-vindas enviado para ${this.maskPhone(phone)}`,
          type: 'sms' as const
        };
      })
    );
  }

  sendWelcomeEmail(email: string, userName: string): Observable<NotificationResult> {
    return timer(1000).pipe(
      map(() => {
        // Simulate email sending
        console.log(`Email enviado para ${email}: Bem-vindo ${userName}! Sua conta foi criada com sucesso.`);
        
        return {
          success: true,
          message: `Email de boas-vindas enviado para ${this.maskEmail(email)}`,
          type: 'email' as const
        };
      })
    );
  }

  sendAccountConfirmation(email: string, phone: string, userName: string): Observable<NotificationResult[]> {
    return timer(2000).pipe(
      map(() => {
        // Simulate both SMS and email sending
        const results: NotificationResult[] = [
          {
            success: true,
            message: `Email de confirmação enviado para ${this.maskEmail(email)}`,
            type: 'email'
          },
          {
            success: true,
            message: `SMS de confirmação enviado para ${this.maskPhone(phone)}`,
            type: 'sms'
          }
        ];

        console.log(`Notificações enviadas para ${userName}:`, results);
        return results;
      })
    );
  }

  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart.substring(0, 2)}***@${domain}`;
  }

  private maskPhone(phone: string): string {
    // Remove formatting and mask middle digits
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 11) {
      return `(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 3)}****-${cleanPhone.substring(7)}`;
    } else if (cleanPhone.length === 10) {
      return `(${cleanPhone.substring(0, 2)}) ****-${cleanPhone.substring(6)}`;
    }
    return phone;
  }
}