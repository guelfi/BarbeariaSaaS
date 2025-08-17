import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PwaService } from '../../../core/services/pwa.service';

@Component({
  selector: 'app-pwa-status',
  templateUrl: './pwa-status.component.html',
  styleUrls: ['./pwa-status.component.scss']
})
export class PwaStatusComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isOnline = true;
  updateAvailable = false;

  constructor(
    private pwaService: PwaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.pwaService.isOnline$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOnline => {
        this.isOnline = isOnline;
        this.showConnectivityStatus(isOnline);
      });

    this.pwaService.updateAvailable$
      .pipe(takeUntil(this.destroy$))
      .subscribe(updateAvailable => {
        this.updateAvailable = updateAvailable;
        if (updateAvailable) {
          this.showUpdateNotification();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private showConnectivityStatus(isOnline: boolean): void {
    const message = isOnline 
      ? 'Conectado - Dados sincronizados' 
      : 'Offline - Usando dados em cache';
    
    const panelClass = isOnline ? 'success-snackbar' : 'warning-snackbar';
    
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: [panelClass],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });

    // Haptic feedback
    if (isOnline) {
      this.pwaService.vibrate(100);
    } else {
      this.pwaService.vibrate([100, 100, 100]);
    }
  }

  private showUpdateNotification(): void {
    const snackBarRef = this.snackBar.open(
      'Nova versão disponível!', 
      'ATUALIZAR', 
      {
        duration: 0, // Don't auto-dismiss
        panelClass: ['info-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      }
    );

    snackBarRef.onAction().subscribe(() => {
      this.updateApp();
    });
  }

  async updateApp(): Promise<void> {
    try {
      await this.pwaService.activateUpdate();
      this.pwaService.vibrate([100, 50, 100]);
    } catch (error) {
      console.error('Error updating app:', error);
      this.snackBar.open('Erro ao atualizar. Tente novamente.', 'OK', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
}