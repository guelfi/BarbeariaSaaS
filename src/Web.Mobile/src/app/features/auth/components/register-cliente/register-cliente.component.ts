import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { RegisterClienteRequest } from '@core/models/auth.models';
import { MockAuthDatabase } from '@core/data/mock-users.data';

@Component({
  selector: 'app-register-cliente',
  templateUrl: './register-cliente.component.html',
  styleUrls: ['./register-cliente.component.scss']
})
export class RegisterClienteComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  barbearias: any[] = [];
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.createForm();
  }

  ngOnInit(): void {
    // Check if already authenticated
    this.authService.isAuthenticated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        if (isAuth) {
          this.router.navigate(['/development']);
        }
      });

    // Load available barbearias
    this.loadBarbearias();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
      tenantId: ['', [Validators.required]],
      aceitarTermos: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const senha = form.get('senha');
    const confirmarSenha = form.get('confirmarSenha');
    
    if (senha && confirmarSenha && senha.value !== confirmarSenha.value) {
      confirmarSenha.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  private loadBarbearias(): void {
    this.barbearias = MockAuthDatabase.getBarbearias();
    
    // Pre-select first barbearia for demo
    if (this.barbearias.length > 0) {
      this.registerForm.patchValue({
        tenantId: this.barbearias[0].id
      });
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.isLoading) {
      this.markFormGroupTouched();
      this.triggerHapticFeedback('error');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.registerForm.value;
    const registerRequest: RegisterClienteRequest = {
      nome: formValue.nome,
      email: formValue.email,
      senha: formValue.senha,
      telefone: formValue.telefone,
      tenantId: formValue.tenantId
    };

    this.authService.registerCliente(registerRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.triggerHapticFeedback('success');
            this.snackBar.open(
              result.message || 'Conta criada com sucesso!', 
              'Fechar', 
              { 
                duration: 5000, 
                panelClass: ['success-snackbar'],
                horizontalPosition: 'center',
                verticalPosition: 'top'
              }
            );
            
            // Send welcome notifications
            this.sendWelcomeNotifications(formValue.email, formValue.telefone, formValue.nome);
            
            // Auto-login successful, redirect to development
            setTimeout(() => {
              this.router.navigate(['/development']);
            }, 3000);
          } else {
            this.errorMessage = result.message || 'Erro durante o cadastro';
            this.triggerHapticFeedback('error');
          }
        },
        error: (error) => {
          console.error('Register error:', error);
          this.errorMessage = 'Erro interno do servidor. Tente novamente.';
          this.triggerHapticFeedback('error');
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

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
    this.triggerHapticFeedback('light');
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  formatPhone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      
      this.registerForm.patchValue({ telefone: value });
    }
  }

  private sendWelcomeNotifications(email: string, phone: string, name: string): void {
    // Send welcome email
    this.notificationService.sendWelcomeEmail(email, name)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result.success) {
          this.snackBar.open(result.message, 'OK', {
            duration: 3000,
            panelClass: ['info-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      });

    // Send welcome SMS
    this.notificationService.sendWelcomeSMS(phone, name)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result.success) {
          this.snackBar.open(result.message, 'OK', {
            duration: 3000,
            panelClass: ['info-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
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

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters for template
  get nome() { return this.registerForm.get('nome'); }
  get email() { return this.registerForm.get('email'); }
  get telefone() { return this.registerForm.get('telefone'); }
  get senha() { return this.registerForm.get('senha'); }
  get confirmarSenha() { return this.registerForm.get('confirmarSenha'); }
  get tenantId() { return this.registerForm.get('tenantId'); }
  get aceitarTermos() { return this.registerForm.get('aceitarTermos'); }
}