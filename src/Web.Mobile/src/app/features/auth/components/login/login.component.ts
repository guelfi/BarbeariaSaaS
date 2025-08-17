import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { LoginRequest, AuthError } from '@core/models/auth.models';
import { BarbeariaSelectionComponent } from '../barbearia-selection/barbearia-selection.component';
import { 
  mobileSlideIn, 
  mobileFadeIn, 
  mobileScaleIn, 
  mobileSlideUp, 
  mobileStagger,
  loadingPulse,
  errorShake
} from '@shared/animations/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    mobileSlideIn, 
    mobileFadeIn, 
    mobileScaleIn, 
    mobileSlideUp, 
    mobileStagger,
    loadingPulse,
    errorShake
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  isOffline = false;
  returnUrl = '/development';
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet
  ) {
    this.loginForm = this.createForm();
  }

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/development'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/development';

    // Check if already authenticated
    this.authService.isAuthenticated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        if (isAuth) {
          this.router.navigate([this.returnUrl]);
        }
      });

    // Check offline status
    this.isOffline = this.authService.isOfflineMode();
    
    // Listen for network status changes
    window.addEventListener('online', () => {
      this.isOffline = false;
      this.authService.syncWhenOnline().subscribe();
      this.showNetworkStatus('Conexão restaurada', 'success');
    });

    window.addEventListener('offline', () => {
      this.isOffline = true;
      this.authService.enableOfflineMode();
      this.showNetworkStatus('Modo offline ativado', 'info');
    });

    // Set default credentials for demo
    this.loginForm.patchValue({
      email: 'cliente@email.com',
      password: 'Cliente123!'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) {
      this.markFormGroupTouched();
      this.triggerHapticFeedback('error');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginRequest: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(loginRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.triggerHapticFeedback('success');
            this.showNetworkStatus(
              `Bem-vindo, ${result.user?.name}!`, 
              'success'
            );
            
            // Small delay for better UX
            setTimeout(() => {
              this.router.navigate([this.returnUrl]);
            }, 500);
          } else {
            this.handleLoginError(result.error, result.message);
            this.triggerHapticFeedback('error');
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = 'Erro interno do servidor. Tente novamente.';
          this.triggerHapticFeedback('error');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.triggerHapticFeedback('light');
  }

  navigateToRegister(): void {
    this.router.navigate(['/login/register']);
  }

  openBarbeariaSelection(): void {
    const bottomSheetRef = this.bottomSheet.open(BarbeariaSelectionComponent, {
      panelClass: 'barbearia-selection-sheet'
    });

    bottomSheetRef.afterDismissed().subscribe(selectedBarbearia => {
      if (selectedBarbearia) {
        this.snackBar.open(
          `Barbearia selecionada: ${selectedBarbearia.nome}`,
          'Fechar',
          { duration: 3000 }
        );
      }
    });
  }

  private handleLoginError(error?: AuthError, message?: string): void {
    switch (error) {
      case AuthError.INVALID_CREDENTIALS:
        this.errorMessage = 'Email ou senha inválidos';
        break;
      case AuthError.USER_NOT_FOUND:
        this.errorMessage = 'Usuário não encontrado';
        break;
      case AuthError.USER_INACTIVE:
        this.errorMessage = 'Usuário inativo. Entre em contato com a barbearia.';
        break;
      default:
        this.errorMessage = message || 'Erro desconhecido durante o login';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'error'): void {
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(50);
          break;
        case 'medium':
          navigator.vibrate(100);
          break;
        case 'heavy':
          navigator.vibrate(200);
          break;
        case 'success':
          navigator.vibrate([100, 50, 100]);
          break;
        case 'error':
          navigator.vibrate([100, 100, 100]);
          break;
      }
    }
  }

  private showNetworkStatus(message: string, type: 'success' | 'info' | 'error'): void {
    const panelClass = type === 'success' ? 'success-snackbar' : 
                     type === 'info' ? 'info-snackbar' : 'error-snackbar';
    
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: [panelClass],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  // Getters for template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}