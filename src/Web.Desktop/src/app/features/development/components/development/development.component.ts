import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { User } from '@core/models/auth.models';

@Component({
  selector: 'app-development',
  templateUrl: './development.component.html',
  styleUrls: ['./development.component.scss']
})
export class DevelopmentComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isLoading = true;
  
  features = [
    {
      title: 'Gestão de Agendamentos',
      description: 'Sistema completo para controlar agendamentos, horários e disponibilidade.',
      icon: 'event',
      progress: 85,
      status: 'Em desenvolvimento'
    },
    {
      title: 'Cadastro de Clientes',
      description: 'Gerenciamento completo da base de clientes com histórico de serviços.',
      icon: 'people',
      progress: 70,
      status: 'Em desenvolvimento'
    },
    {
      title: 'Controle de Serviços',
      description: 'Catálogo de serviços com preços, duração e descrições detalhadas.',
      icon: 'content_cut',
      progress: 60,
      status: 'Planejado'
    },
    {
      title: 'Relatórios Financeiros',
      description: 'Dashboard com métricas de faturamento, lucro e análises de performance.',
      icon: 'analytics',
      progress: 45,
      status: 'Planejado'
    },
    {
      title: 'Notificações Push',
      description: 'Sistema de notificações para clientes e barbeiros sobre agendamentos.',
      icon: 'notifications',
      progress: 30,
      status: 'Planejado'
    },
    {
      title: 'Integração de Pagamentos',
      description: 'Processamento de pagamentos online com múltiplas formas de pagamento.',
      icon: 'payment',
      progress: 15,
      status: 'Futuro'
    }
  ];
  
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData(): void {
    this.authService.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.currentUser = user;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading user data:', error);
          this.isLoading = false;
          this.router.navigate(['/login']);
        }
      });
  }

  onLogout(): void {
    this.authService.logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          if (success) {
            this.snackBar.open('Logout realizado com sucesso', 'Fechar', {
              duration: 3000,
              panelClass: ['info-snackbar']
            });
            this.router.navigate(['/login']);
          }
        },
        error: (error) => {
          console.error('Logout error:', error);
          this.snackBar.open('Erro durante logout', 'Fechar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  onRefresh(): void {
    window.location.reload();
  }

  getUserInitials(): string {
    if (!this.currentUser?.name) return 'U';
    
    const parts = this.currentUser.name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    
    return this.currentUser.name[0].toUpperCase();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Em desenvolvimento':
        return 'primary';
      case 'Planejado':
        return 'accent';
      case 'Futuro':
        return 'warn';
      default:
        return 'primary';
    }
  }

  getProgressColor(progress: number): string {
    if (progress >= 70) return 'primary';
    if (progress >= 40) return 'accent';
    return 'warn';
  }
}