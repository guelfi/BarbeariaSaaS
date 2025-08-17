import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { PwaService } from '@core/services/pwa.service';
import { User } from '@core/models/auth.models';

@Component({
  selector: 'app-development',
  templateUrl: './development.component.html',
  styleUrls: ['./development.component.scss']
})
export class DevelopmentComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isLoading = true;
  isOnline = true;
  
  features = [
    {
      title: 'Buscar Barbearias',
      description: 'Encontre barbearias próximas com avaliações e horários disponíveis.',
      icon: 'search',
      progress: 80,
      status: 'Em desenvolvimento',
      color: 'primary'
    },
    {
      title: 'Agendar Serviços',
      description: 'Agende cortes, barbas e outros serviços de forma rápida e fácil.',
      icon: 'event',
      progress: 75,
      status: 'Em desenvolvimento',
      color: 'primary'
    },
    {
      title: 'Meus Agendamentos',
      description: 'Visualize, edite ou cancele seus agendamentos futuros.',
      icon: 'schedule',
      progress: 65,
      status: 'Em desenvolvimento',
      color: 'accent'
    },
    {
      title: 'Histórico de Serviços',
      description: 'Acompanhe seu histórico completo de serviços realizados.',
      icon: 'history',
      progress: 50,
      status: 'Planejado',
      color: 'accent'
    },
    {
      title: 'Avaliações',
      description: 'Avalie os serviços e ajude outros clientes a escolher.',
      icon: 'star',
      progress: 40,
      status: 'Planejado',
      color: 'warn'
    },
    {
      title: 'Notificações Push',
      description: 'Receba lembretes sobre seus agendamentos e promoções.',
      icon: 'notifications',
      progress: 30,
      status: 'Planejado',
      color: 'warn'
    },
    {
      title: 'Pagamentos',
      description: 'Pague pelos serviços diretamente pelo app de forma segura.',
      icon: 'payment',
      progress: 20,
      status: 'Futuro',
      color: 'warn'
    },
    {
      title: 'Programa de Fidelidade',
      description: 'Acumule pontos e ganhe descontos em seus serviços favoritos.',
      icon: 'card_giftcard',
      progress: 10,
      status: 'Futuro',
      color: 'warn'
    }
  ];
  
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private pwaService: PwaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.setupConnectivityListener();
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

  private setupConnectivityListener(): void {
    this.pwaService.isOnline$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOnline => {
        this.isOnline = isOnline;
      });
  }

  onLogout(): void {
    this.authService.logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          if (success) {
            this.triggerHapticFeedback('success');
            this.snackBar.open('Logout realizado com sucesso', 'OK', {
              duration: 3000,
              panelClass: ['success-snackbar'],
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
            this.router.navigate(['/login']);
          }
        },
        error: (error) => {
          console.error('Logout error:', error);
          this.triggerHapticFeedback('error');
          this.snackBar.open('Erro durante logout', 'OK', {
            duration: 3000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      });
  }

  onRefresh(): void {
    this.triggerHapticFeedback('light');
    window.location.reload();
  }

  onFeatureClick(feature: any): void {
    this.triggerHapticFeedback('medium');
    
    const message = feature.status === 'Em desenvolvimento' 
      ? `${feature.title} está sendo desenvolvido e estará disponível em breve!`
      : `${feature.title} está planejado para futuras versões.`;
    
    this.snackBar.open(message, 'OK', {
      duration: 4000,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  getUserInitials(): string {
    if (!this.currentUser?.name) return 'U';
    
    const parts = this.currentUser.name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    
    return this.currentUser.name[0].toUpperCase();
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Em desenvolvimento':
        return 'build';
      case 'Planejado':
        return 'schedule';
      case 'Futuro':
        return 'hourglass_empty';
      default:
        return 'help';
    }
  }

  getProgressColor(progress: number): string {
    if (progress >= 70) return 'primary';
    if (progress >= 40) return 'accent';
    return 'warn';
  }

  private triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'error'): void {
    this.pwaService.vibrate(this.getVibrationPattern(type));
  }

  private getVibrationPattern(type: string): number | number[] {
    switch (type) {
      case 'light':
        return 50;
      case 'medium':
        return 100;
      case 'heavy':
        return 200;
      case 'success':
        return [100, 50, 100];
      case 'error':
        return [100, 100, 100];
      default:
        return 100;
    }
  }
}