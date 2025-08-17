import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { LoginRequest, AuthError } from '@core/models/auth.models';
import { slideIn, fadeIn } from '@shared/animations/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [slideIn, fadeIn]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  returnUrl = '/development';
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
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

    // Set default credentials for demo
    this.loginForm.patchValue({
      email: 'barbeiro@barbearia.com',
      password: 'Barbeiro123!'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) {
      this.markFormGroupTouched();
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
            this.snackBar.open(
              `Bem-vindo, ${result.user?.name}!`, 
              'Fechar', 
              { duration: 3000, panelClass: ['success-snackbar'] }
            );
            
            // Small delay for better UX
            setTimeout(() => {
              this.router.navigate([this.returnUrl]);
            }, 500);
          } else {
            this.handleLoginError(result.error, result.message);
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = 'Erro interno do servidor. Tente novamente.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  navigateToRegister(): void {
    this.router.navigate(['/login/register']);
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
        this.errorMessage = 'Usuário inativo. Entre em contato com o suporte.';
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

  // Getters for template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get rememberMe() { return this.loginForm.get('rememberMe'); }
}